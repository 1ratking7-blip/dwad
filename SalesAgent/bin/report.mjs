import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { generateReport, renderReportMarkdown } from '../src/reports/index.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const period = process.argv[2] || 'weekly'; // daily | weekly | monthly

if (!['daily', 'weekly', 'monthly'].includes(period)) {
  console.error('Usage: npm run report -- <daily|weekly|monthly>');
  process.exit(1);
}

const stats = generateReport(period);
const markdown = renderReportMarkdown(period, stats);

const outDir = join(__dirname, '../reports');
mkdirSync(outDir, { recursive: true });
const filename = `${new Date().toISOString().slice(0, 10)}-${period}.md`;
writeFileSync(join(outDir, filename), markdown, 'utf8');

console.log(markdown);
console.log(`\nSaved to reports/${filename}`);
