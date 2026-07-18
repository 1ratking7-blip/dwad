// Re-scores existing lead(s) with the CURRENT weights in src/scoring/config.mjs — useful
// after tuning weights (e.g. once real replies come in and you learn what actually predicts a
// good lead), without re-running the whole analyze+contacts pipeline.
import { getDb } from '../src/db/index.mjs';
import { getCompany, getContactsForCompany, updateLeadScore, getLead } from '../src/crm/index.mjs';
import { scoreLead } from '../src/scoring/index.mjs';

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: npm run score -- <leadId>\n       npm run score -- --all');
  process.exit(1);
}

function rescore(lead) {
  const company = getCompany(lead.company_id);
  const contacts = getContactsForCompany(company.id);
  const { score, breakdown, priority } = scoreLead(company, contacts);
  updateLeadScore(lead.id, score, breakdown, priority);
  console.log(`Lead #${lead.id} (${company.name}): ${lead.score ?? '—'} -> ${score} (${priority})`);
}

if (arg === '--all') {
  const db = getDb();
  const leads = db.prepare('SELECT * FROM leads').all();
  console.log(`Re-scoring ${leads.length} lead(s)...`);
  leads.forEach(rescore);
} else {
  const lead = getLead(Number(arg));
  if (!lead) {
    console.error(`Lead ${arg} not found.`);
    process.exit(1);
  }
  rescore(lead);
}
