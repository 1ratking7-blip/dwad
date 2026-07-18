import { getLeadWithCompany, updateLeadStatus, setNextAction, getInteractions, listDraftsForLead } from '../src/crm/index.mjs';

const VALID_STATUSES = ['new', 'contacted', 'replied', 'qualified', 'won', 'lost', 'on_hold'];

function printUsage() {
  console.error(`Usage:
  npm run lead -- <leadId> show
  npm run lead -- <leadId> status <${VALID_STATUSES.join('|')}> [note]
  npm run lead -- <leadId> next-action <YYYY-MM-DD> [note]`);
}

const [leadIdArg, command, ...rest] = process.argv.slice(2);

if (!leadIdArg || !command) {
  printUsage();
  process.exit(1);
}

const leadId = Number(leadIdArg);
const lead = getLeadWithCompany(leadId);
if (!lead) {
  console.error(`Lead ${leadId} not found.`);
  process.exit(1);
}

switch (command) {
  case 'show': {
    console.log(`Lead #${lead.id} — ${lead.company.name} (${lead.company.website})`);
    console.log(`Status: ${lead.status} | Score: ${lead.score ?? '—'} | Priority: ${lead.priority ?? '—'}`);
    console.log(`Next action: ${lead.next_action_date ?? '—'} ${lead.next_action_note ?? ''}`);
    console.log(`\nInteractions:`);
    for (const i of getInteractions(lead.id)) {
      console.log(`  [${i.created_at}] ${i.type}: ${i.content ?? ''}`);
    }
    console.log(`\nDrafts:`);
    for (const d of listDraftsForLead(lead.id)) {
      console.log(`  #${d.id} ${d.type} (${d.status}) — ${d.subject ?? ''}`);
    }
    break;
  }

  case 'status': {
    const [status, ...noteParts] = rest;
    if (!VALID_STATUSES.includes(status)) {
      console.error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
      process.exit(1);
    }
    updateLeadStatus(leadId, status, noteParts.join(' ') || undefined);
    console.log(`Lead #${leadId} status -> ${status}`);
    break;
  }

  case 'next-action': {
    const [date, ...noteParts] = rest;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.error('Date must be in YYYY-MM-DD format.');
      process.exit(1);
    }
    setNextAction(leadId, date, noteParts.join(' ') || undefined);
    console.log(`Lead #${leadId} next action -> ${date}`);
    break;
  }

  default:
    printUsage();
    process.exit(1);
}
