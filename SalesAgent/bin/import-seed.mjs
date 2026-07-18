import { readFileSync } from 'node:fs';
import { processSeedList } from '../src/discovery/index.mjs';

const seedFile = process.argv[2];
if (!seedFile) {
  console.error('Usage: npm run import-seed -- <path-to-seeds.json>');
  console.error('See seeds/example-seeds.json for the expected format.');
  process.exit(1);
}

const seeds = JSON.parse(readFileSync(seedFile, 'utf8'));
console.log(`Processing ${seeds.length} seed(s)...`);

const results = await processSeedList(seeds);

let ok = 0;
let failed = 0;
for (const r of results) {
  if (r.error) {
    failed++;
    console.log(`  ✗ ${r.website} — ${r.error}`);
  } else {
    ok++;
    console.log(`  ✓ ${r.company.name} (${r.company.website}) — score ${r.lead.score} (${r.lead.priority})`);
  }
}

console.log(`\nDone: ${ok} processed, ${failed} failed/skipped.`);
console.log('Run `npm run dashboard` or `npm run report` to see results.');
