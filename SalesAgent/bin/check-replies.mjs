// Checks the outreach mailbox (same Gmail account used to send, via IMAP with the same
// app-password from .env) for replies to messages we've actually sent. Read-only — never
// deletes/modifies anything in the mailbox.
//
// "Reply" is detected two ways: (1) subject starts with "Re:" and matches one of our sent
// subjects, or (2) sender address/domain matches a contact we have on file for a company we
// sent to. Neither is perfect (a reply could come from a personal address at a different
// domain, or with a rewritten subject) — this is a best-effort filter, not a guarantee; the
// "other inbox messages" section exists so nothing gets silently missed.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ImapFlow } from 'imapflow';
import { getDb } from '../src/db/index.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const text = readFileSync(join(__dirname, '../.env'), 'utf8');
  const env = {};
  for (const line of text.split('\n')) {
    const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
    if (m) env[m[1]] = m[2];
  }
  return env;
}

function buildSentSets() {
  const db = getDb();
  const drafts = db
    .prepare("SELECT md.subject, l.company_id FROM message_drafts md JOIN leads l ON l.id = md.lead_id WHERE md.status = 'sent'")
    .all();

  const subjects = new Set(drafts.map((d) => d.subject));
  const companyIds = [...new Set(drafts.map((d) => d.company_id))];

  const emails = new Set();
  const domains = new Set();
  const contactStmt = db.prepare("SELECT value FROM contacts WHERE company_id = ? AND type = 'email'");
  for (const companyId of companyIds) {
    for (const c of contactStmt.all(companyId)) {
      const val = c.value.toLowerCase();
      emails.add(val);
      const domain = val.split('@')[1];
      if (domain) domains.add(domain);
    }
  }
  return { subjects, emails, domains };
}

async function main() {
  const daysArg = Number(process.argv[2] || 3);
  const env = loadEnv();
  const { subjects: sentSubjects, emails: sentEmails, domains: sentDomains } = buildSentSets();

  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    logger: false,
  });

  await client.connect();
  const lock = await client.getMailboxLock('INBOX');
  try {
    const since = new Date();
    since.setDate(since.getDate() - daysArg);
    since.setHours(0, 0, 0, 0);

    const uids = await client.search({ since });
    console.log(`Checked INBOX since ${since.toISOString().slice(0, 10)} (last ${daysArg} day(s)): ${uids.length} message(s) total.`);

    const matches = [];
    const others = [];
    if (uids.length > 0) {
      for await (const msg of client.fetch(uids, { envelope: true })) {
        const from = msg.envelope.from?.[0];
        const fromAddr = from?.address ? from.address.toLowerCase() : '(unknown)';
        const fromDomain = from?.address?.includes('@') ? from.address.split('@')[1].toLowerCase() : '';
        const subject = msg.envelope.subject || '(no subject)';
        const date = msg.envelope.date;

        const bareSubject = subject.replace(/^re:\s*/i, '');
        const isReplySubject = /^re:/i.test(subject) && sentSubjects.has(bareSubject);
        const isKnownSender = sentEmails.has(fromAddr) || sentDomains.has(fromDomain);

        const row = { uid: msg.uid, fromAddr, subject, date };
        if (isReplySubject || isKnownSender) matches.push(row);
        else others.push(row);
      }
    }

    console.log(`\n=== Likely replies to our outreach (${matches.length}) ===`);
    for (const m of matches) {
      console.log(`  ${m.date?.toISOString().slice(0, 16).replace('T', ' ')} | ${m.fromAddr} | ${m.subject}`);
    }
    if (matches.length === 0) console.log('  (none found)');

    console.log(`\n=== Other inbox messages in this window, for reference (${others.length}) ===`);
    for (const o of others.slice(0, 15)) {
      console.log(`  ${o.date?.toISOString().slice(0, 16).replace('T', ' ')} | ${o.fromAddr} | ${o.subject}`);
    }
    if (others.length > 15) console.log(`  ... and ${others.length - 15} more`);
  } finally {
    lock.release();
    await client.logout();
  }
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
