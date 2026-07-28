import { getLeadWithCompany } from '../src/crm/index.mjs';
import { generateDraft } from '../src/messages/index.mjs';

const [leadIdArg, type, localeArg] = process.argv.slice(2);
const VALID_TYPES = ['first_email', 'after_interest', 'follow_up_1', 'follow_up_2', 'reply', 'proposal'];
const VALID_LOCALES = ['ru', 'vi'];

if (!leadIdArg || !type || !VALID_TYPES.includes(type)) {
  console.error(`Usage: npm run draft -- <leadId> <${VALID_TYPES.join('|')}> [${VALID_LOCALES.join('|')}]`);
  console.error('Locale is auto-detected from the lead\'s company.country (VN -> vi, else ru) if omitted.');
  process.exit(1);
}
if (localeArg && !VALID_LOCALES.includes(localeArg)) {
  console.error(`Unknown locale override: ${localeArg} (expected one of ${VALID_LOCALES.join('|')})`);
  process.exit(1);
}

const lead = getLeadWithCompany(Number(leadIdArg));
if (!lead) {
  console.error(`Lead ${leadIdArg} not found.`);
  process.exit(1);
}

const draft = generateDraft(type, lead, lead.company, true, {}, localeArg);

console.log(`Draft #${draft.id} saved (status: ${draft.status}, locale: ${draft.locale})\n`);
console.log(`Subject: ${draft.subject}\n`);
console.log(draft.body);
console.log(`\n--\nReview and edit before sending manually. When sent, run:`);
console.log(`  node -e "import('./src/crm/index.mjs').then(m => m.markDraftSent(${draft.id}))"`);
