// CI guard for the exact real bug this project's own docs warn about (see public/_headers
// comment block): editing an inline <script> in index.html changes its sha256 hash, and the
// browser then SILENTLY blocks it under CSP unless someone remembers to rerun
// `node scripts/csp-hashes.mjs` and paste the new hash into public/_headers. This script makes
// that check automatic instead of relying on memory — run after `npm run build` in CI.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const scriptRe = /<script(\b[^>]*)>([\s\S]*?)<\/script>/g;

const computedHashes = [];
let match;
while ((match = scriptRe.exec(html))) {
  const [, attrs, rawBody] = match;
  if (/\bsrc=/.test(attrs)) continue; // external script — governed by 'self', not a hash
  if (/type=["']application\/ld\+json["']/.test(attrs)) continue; // not script-src governed
  const body = rawBody.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (body.trim() === '') continue;
  computedHashes.push(createHash('sha256').update(body, 'utf8').digest('base64'));
}

if (computedHashes.length === 0) {
  console.error('No inline scripts found in dist/index.html — did the build actually run?');
  process.exit(1);
}

const headers = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8');
const cspLine = headers.split('\n').find((l) => l.includes('Content-Security-Policy'));
if (!cspLine) {
  console.error('No Content-Security-Policy line found in public/_headers.');
  process.exit(1);
}

const missing = computedHashes.filter((h) => !cspLine.includes(`sha256-${h}`));

if (missing.length > 0) {
  console.error(
    `CSP MISMATCH: ${missing.length} inline script hash(es) in the built index.html are not ` +
      `present in public/_headers's script-src. An inline <script> in index.html was edited ` +
      `without regenerating hashes — the browser will silently block it in production.\n\n` +
      `Fix: run \`node scripts/csp-hashes.mjs\` and paste ALL of its output into the ` +
      `script-src list in public/_headers.\n\nMissing hash(es):\n` +
      missing.map((h) => `  'sha256-${h}'`).join('\n')
  );
  process.exit(1);
}

console.log(`CSP OK — all ${computedHashes.length} inline script hash(es) match public/_headers.`);
