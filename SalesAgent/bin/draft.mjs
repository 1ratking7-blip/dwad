import { getLeadWithCompany } from '../src/crm/index.mjs';
import { generateDraft } from '../src/messages/index.mjs';

const [leadIdArg, type] = process.argv.slice(2);
const VALID_TYPES = ['first_email', 'follow_up_1', 'follow_up_2', 'reply', 'proposal'];

if (!leadIdArg || !type || !VALID_TYPES.includes(type)) {
  console.error(`Usage: npm run draft -- <leadId> <${VALID_TYPES.join('|')}>`);
  process.exit(1);
}

const lead = getLeadWithCompany(Number(leadIdArg));
if (!lead) {
  console.error(`Lead ${leadIdArg} not found.`);
  process.exit(1);
}

const draft = generateDraft(type, lead, lead.company);

console.log(`Draft #${draft.id} saved (status: ${draft.status})\n`);
console.log(`Subject: ${draft.subject}\n`);
console.log(draft.body);
console.log(`\n--\nReview and edit before sending manually. When sent, run:`);
console.log(`  node -e "import('./src/crm/index.mjs').then(m => m.markDraftSent(${draft.id}))"`);
