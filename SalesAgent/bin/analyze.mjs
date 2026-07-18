// Standalone single-URL analysis — for spot-checking one prospect without running a whole
// seed batch, or re-analyzing a company whose site has changed since it was first added.
import { analyzeCompany } from '../src/analyzer/index.mjs';
import { upsertCompany, getCompanyByWebsite } from '../src/crm/index.mjs';

const url = process.argv[2];
if (!url) {
  console.error('Usage: npm run analyze -- <url>');
  process.exit(1);
}

const result = await analyzeCompany(url);
if (result.error) {
  console.error(`Failed: ${result.error}${result.detail ? ` (${result.detail})` : ''}${result.status ? ` [HTTP ${result.status}]` : ''}`);
  process.exit(1);
}

const existing = getCompanyByWebsite(result.website);
const company = upsertCompany(result);

console.log(existing ? `Updated existing company #${company.id}` : `Created new company #${company.id}`);
console.log(JSON.stringify(company, null, 2));
if (result.contactCandidates.length) {
  console.log(`\nContact page candidates found (not yet fetched — run Contact Discovery separately or via import-seed):`);
  result.contactCandidates.forEach((c) => console.log(`  - ${c}`));
}
