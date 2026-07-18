import {
  listLeads,
  listDraftsForLead,
  getContactsForCompany,
  markDraftSent,
  addInteraction,
} from '../src/crm/index.mjs';
import { sendMail } from '../src/messages/mailer.mjs';

function printUsage() {
  console.error(`Usage (run with: node --env-file=.env bin/send.mjs ...):
  npm run send -- <leadId>              Preview (dry-run) the ready draft for one lead
  npm run send -- <leadId> --confirm    Actually send it over SMTP
  npm run send -- --all                 Preview (dry-run) every lead with a ready draft
  npm run send -- --all --confirm       Actually send all of them (rate-limited)

Options:
  --confirm        Actually send. Without it, nothing is sent or marked — preview only.
  --limit <n>       Cap how many get sent in one run (default: no cap)
  --delay-ms <n>    Delay between sends in ms (default: 8000)

Only leads with a message_draft in status 'draft' (type first_email) and a discovered
email contact are eligible. Nothing is ever sent twice: a successful send calls
markDraftSent(), which is what makes a draft ineligible on the next run.`);
}

function parseArgs(argv) {
  const args = { confirm: false, all: false, limit: Infinity, delayMs: 8000, leadId: null };
  const rest = [...argv];
  if (rest[0] === '--all') {
    args.all = true;
    rest.shift();
  } else if (rest[0] && !rest[0].startsWith('--')) {
    args.leadId = Number(rest.shift());
  }
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--confirm') args.confirm = true;
    else if (rest[i] === '--limit') args.limit = Number(rest[++i]);
    else if (rest[i] === '--delay-ms') args.delayMs = Number(rest[++i]);
  }
  return args;
}

function findReadyDraft(leadId) {
  const drafts = listDraftsForLead(leadId);
  return drafts.find((d) => d.type === 'first_email' && d.status === 'draft') ?? null;
}

function findEmailContact(companyId) {
  const contacts = getContactsForCompany(companyId);
  return contacts.find((c) => c.type === 'email') ?? null;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const args = parseArgs(process.argv.slice(2));

  let candidateLeadIds;
  if (args.all) {
    candidateLeadIds = listLeads({}).map((l) => l.id);
  } else if (args.leadId) {
    candidateLeadIds = [args.leadId];
  } else {
    printUsage();
    process.exit(1);
  }

  const allLeads = listLeads({});
  const targets = [];
  for (const leadId of candidateLeadIds) {
    const lead = allLeads.find((l) => l.id === leadId);
    if (!lead) {
      console.error(`Lead ${leadId} not found — skipping.`);
      continue;
    }
    const draft = findReadyDraft(leadId);
    if (!draft) continue; // nothing ready for this lead, silently skip in --all mode
    const contact = findEmailContact(lead.company_id);
    if (!contact) {
      console.warn(`Lead ${leadId} (${lead.company.name}) has a ready draft but no discovered email contact — skipping.`);
      continue;
    }
    targets.push({ lead, draft, contact });
  }

  if (targets.length === 0) {
    console.log('No eligible leads (ready draft + known email contact) found.');
    return;
  }

  const capped = targets.slice(0, args.limit);
  console.log(`${capped.length} eligible lead(s) ${args.confirm ? '— SENDING FOR REAL' : '(dry-run — pass --confirm to actually send)'}:\n`);

  let sent = 0;
  let failed = 0;
  for (let i = 0; i < capped.length; i++) {
    const { lead, draft, contact } = capped[i];
    console.log(`Lead #${lead.id} — ${lead.company.name} <${contact.value}>`);
    console.log(`  Subject: ${draft.subject}`);
    if (!args.confirm) {
      console.log(`  [dry-run, not sent]\n`);
      continue;
    }
    try {
      await sendMail({ to: contact.value, subject: draft.subject, body: draft.body });
      markDraftSent(draft.id, 'sent automatically via SMTP (bin/send.mjs)');
      sent++;
      console.log(`  Sent OK.\n`);
    } catch (err) {
      failed++;
      addInteraction(lead.id, 'send_failed', `${draft.type} send failed: ${err.message}`);
      console.error(`  FAILED: ${err.message}\n`);
    }
    if (args.confirm && i < capped.length - 1) {
      await sleep(args.delayMs);
    }
  }

  if (args.confirm) {
    console.log(`Done. Sent: ${sent}, failed: ${failed}.`);
  }
}

run().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
