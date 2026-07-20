#!/usr/bin/env node
// Brand-mention checker — searches DuckDuckGo's HTML endpoint (no API key needed,
// unlike Google/Bing search APIs which require a paid key — see the same honest
// tradeoff already documented in SalesAgent/docs/ARCHITECTURE.md for lead discovery).
//
// What this IS: a real check against one real search engine's index, right now.
// What this ISN'T: comprehensive brand monitoring across the whole web, or a
// live/continuous listener — DuckDuckGo's own index coverage and freshness are
// outside this script's control, and this only searches when you run it.
//
// Usage: node check-mentions.mjs [query ...]
// Default queries if none given: the brand + domain.

// "zhelezo" alone is too generic to be useful — it's an ordinary Russian word
// ("hardware"/"iron") and matches unrelated GitHub repos, YouTube channels, gaming
// hardware news, etc. (confirmed by actually running this against DuckDuckGo, not
// assumed). Precise domain/handle queries only.
const DEFAULT_QUERIES = ['"zhelezo.space"', '"t.me/ZHELEz19"', '"bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo"'];

async function searchDuckDuckGo(query) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ZhelezoBrandMonitor/1.0)' },
  });
  if (!res.ok) {
    throw new Error(`DuckDuckGo returned HTTP ${res.status}`);
  }
  const html = await res.text();

  // Cheap regex parse instead of pulling in cheerio for one field — the result
  // markup is stable (class="result__a") but if DuckDuckGo changes their HTML,
  // this will start returning 0 results silently. Worth re-checking by hand
  // occasionally, same caveat as any HTML-scraping approach.
  const linkPattern = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)</g;
  const results = [];
  let match;
  while ((match = linkPattern.exec(html)) !== null) {
    const rawHref = match[1].replace(/&amp;/g, '&');
    const title = match[2].replace(/&amp;/g, '&').replace(/&#x27;/g, "'").trim();
    // DuckDuckGo HTML results wrap the real URL in a redirect link (?uddg=...).
    const uddgMatch = /[?&]uddg=([^&]+)/.exec(rawHref);
    const realUrl = uddgMatch ? decodeURIComponent(uddgMatch[1]) : rawHref;
    results.push({ title, url: realUrl });
  }
  return results;
}

async function main() {
  const queries = process.argv.slice(2);
  const toRun = queries.length > 0 ? queries : DEFAULT_QUERIES;

  console.log(`Brand mention check — ${new Date().toISOString()}\n`);

  for (const query of toRun) {
    console.log(`Query: ${query}`);
    try {
      const results = await searchDuckDuckGo(query);
      if (results.length === 0) {
        console.log('  No results found.\n');
      } else {
        for (const r of results) {
          console.log(`  - ${r.title}`);
          console.log(`    ${r.url}`);
        }
        console.log();
      }
    } catch (err) {
      console.log(`  ERROR: ${err.message}\n`);
    }
    // Be polite — don't hammer the endpoint with back-to-back requests.
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

main();
