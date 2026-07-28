// Persistent, session-independent reply watcher — meant to run on a schedule via
// .github/workflows/salesagent-reply-watch.yml, NOT inside a Claude session. Notify-only by
// deliberate choice (see Память/sessions/2026-07-28_002.md): this script never replies to
// anyone, it just emails Данил a heads-up when something reply-shaped shows up, so a real
// person (or a future Claude session, after Данил asks) reviews the actual content before any
// reply goes out. No LLM is available here to judge real-vs-automated the way a live session
// can, so the classification below is a conservative regex heuristic that's meant to
// over-notify rather than risk silently missing a real reply.
//
// Deliberately does NOT depend on data/sales_agent.db (gitignored, machine-local, won't exist
// in a fresh CI checkout) or store any recipient email addresses in git (this repo is public —
// see Память/sessions/2026-07-22_001.md for the prior "public repo" risk acceptance, which was
// about Данил's own post content, not third-party contact PII; don't extend that precedent to
// scraped company emails). Detection instead keys off the two fixed subject-line phrases every
// campaign email uses, and the "already notified" state file stores only opaque Message-IDs.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import nodemailer from 'nodemailer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_PATH = join(__dirname, '../state/notified_replies.json');

const CAMPAIGN_SUBJECT_MARKERS = [
  /идеи по привлечению клиентов/i,
  /vài ý tưởng thu hút khách hàng cho/i,
];

// Real phrases observed in this campaign's actual auto-ack replies (Pyrus/Okdesk/RetailCRM/
// MPSTATS, 2026-07-28) — not guessed. Extend this list as new helpdesk platforms show up.
const AUTOMATED_BODY_PATTERNS = [
  /заявка (зарегистрирован|принят|решен)/i,
  /принят[оа] в (обработку|работу)/i,
  /ответ будет предоставлен в течение/i,
  /мы ответим как можно скорее/i,
  /ticket ?id/i,
  /обращение принято в обработку/i,
];

function loadNotifiedIds() {
  if (!existsSync(STATE_PATH)) return new Set();
  try {
    return new Set(JSON.parse(readFileSync(STATE_PATH, 'utf8')));
  } catch {
    return new Set();
  }
}

function saveNotifiedIds(ids) {
  writeFileSync(STATE_PATH, JSON.stringify([...ids], null, 2) + '\n');
}

function requiredEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

async function sendNotificationEmail(items) {
  const transporter = nodemailer.createTransport({
    host: requiredEnv('SMTP_HOST'),
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: requiredEnv('SMTP_USER'), pass: requiredEnv('SMTP_PASS') },
  });

  const lines = items.map((it) => {
    const tag = it.likelyAutomated ? '🤖 похоже на автоматику тикет-системы' : '👤 ПРОВЕРЬ — возможно, реальный ответ';
    return `${tag}\nОт: ${it.fromAddr}\nТема: ${it.subject}\nДата: ${it.date}\n\n${it.snippet}\n${'-'.repeat(40)}`;
  });

  await transporter.sendMail({
    from: `SalesAgent Watch <${requiredEnv('SMTP_USER')}>`,
    to: requiredEnv('SMTP_USER'),
    subject: `🔔 SalesAgent: ${items.length} новых ответ(а/ов) на аутрич`,
    text: `Обнаружено ${items.length} новых сообщений, похожих на ответы на кампанию привлечения клиентов/партнёров.\n\n${lines.join('\n\n')}`,
  });
}

async function main() {
  const notified = loadNotifiedIds();
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user: requiredEnv('SMTP_USER'), pass: requiredEnv('SMTP_PASS') },
    logger: false,
  });

  await client.connect();
  const lock = await client.getMailboxLock('INBOX');
  const newItems = [];
  try {
    const since = new Date();
    since.setDate(since.getDate() - 7); // generous window, state file dedupes anyway
    const uids = await client.search({ since });

    // Two passes on purpose: fetching `source: true` for every message in the window (mostly
    // unrelated personal mail — bank receipts, app notifications, etc.) is slow and wasteful.
    // Envelope-only first to find the handful of campaign-subject matches, then fetch source
    // only for those.
    const candidateUids = [];
    for await (const msg of client.fetch(uids, { envelope: true })) {
      const messageId = msg.envelope.messageId;
      if (!messageId || notified.has(messageId)) continue;
      const subject = msg.envelope.subject || '';
      if (!CAMPAIGN_SUBJECT_MARKERS.some((re) => re.test(subject))) continue;
      candidateUids.push(msg.uid);
    }

    if (candidateUids.length > 0) {
      for await (const msg of client.fetch(candidateUids, { envelope: true, source: true })) {
        const messageId = msg.envelope.messageId;
        const subject = msg.envelope.subject || '';
        const from = msg.envelope.from?.[0];
        const fromAddr = from?.address || '(unknown)';
        const parsed = await simpleParser(msg.source);
        const bodyText = (parsed.text || '').trim();
        const likelyAutomated = AUTOMATED_BODY_PATTERNS.some((re) => re.test(bodyText));

        newItems.push({
          messageId,
          fromAddr,
          subject,
          date: msg.envelope.date?.toISOString() ?? '',
          snippet: bodyText.slice(0, 500),
          likelyAutomated,
        });
        notified.add(messageId);
      }
    }
  } finally {
    lock.release();
    await client.logout();
  }

  if (newItems.length > 0) {
    await sendNotificationEmail(newItems);
    console.log(`Notified about ${newItems.length} new message(s).`);
  } else {
    console.log('No new campaign-related messages since last check.');
  }

  saveNotifiedIds(notified);
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
