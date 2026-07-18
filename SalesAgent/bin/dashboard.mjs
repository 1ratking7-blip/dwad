import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { generateDashboardHtml } from '../src/dashboard/generate.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../dashboard');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'index.html');

writeFileSync(outPath, generateDashboardHtml(), 'utf8');
console.log(`Dashboard written to ${outPath}`);
console.log('Open it directly in a browser (file://) — no server needed.');
