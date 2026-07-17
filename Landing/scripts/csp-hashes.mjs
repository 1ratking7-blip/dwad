// Recomputes the sha256 CSP hashes for index.html's inline <script> blocks and
// prints them for pasting into public/_headers (Content-Security-Policy script-src).
//
// Usage: npm run build && node scripts/csp-hashes.mjs
//
// Browsers normalize CRLF/CR to LF before hashing a script element's text content
// (HTML spec input preprocessing), so this hashes the built dist/index.html with
// that same normalization rather than the raw file bytes.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const scriptRe = /<script(\b[^>]*)>([\s\S]*?)<\/script>/g;

let match;
let count = 0;
while ((match = scriptRe.exec(html))) {
  const [, attrs, rawBody] = match;
  if (/\bsrc=/.test(attrs)) continue; // external script, no hash needed
  if (/type=["']application\/ld\+json["']/.test(attrs)) continue; // not script-src governed
  const body = rawBody.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (body.trim() === '') continue;
  count++;
  const hash = createHash('sha256').update(body, 'utf8').digest('base64');
  console.log(`'sha256-${hash}'`);
}

if (count === 0) {
  console.error('No inline scripts found — did you run `npm run build` first?');
  process.exit(1);
}
