# Brand Mention Monitor & Site Health Check

Two small, dependency-free scripts for keeping an eye on zhelezo.space without a paid
monitoring service.

## check-mentions.mjs

Checks whether ZHELEZO/zhelezo.space shows up anywhere in DuckDuckGo's search index —
useful to notice when a guest-post, forum post, or Quora answer actually gets indexed,
or if someone mentions the brand somewhere you didn't post it yourself.

## Honest scope — read before relying on this
- **No API key needed** (uses DuckDuckGo's public HTML search page, not a paid search
  API like Google/Bing) — that's the whole reason this is possible to run for free.
- **Not comprehensive.** This checks one search engine's index, at the moment you run
  it. It is not a live listener, not multi-engine, and won't catch things DuckDuckGo
  hasn't indexed yet (which can lag real publication by days).
- **Precise queries only.** "zhelezo" alone is a common Russian word (hardware/iron) —
  matches unrelated GitHub repos, gaming news, YouTube channels. Always search the
  full domain or exact handle in quotes, not the bare brand name.
- **HTML scraping, not an API contract.** If DuckDuckGo changes their result page
  markup, this starts silently returning 0 results. Worth spot-checking by hand
  (open the same query in a browser) if it goes quiet for a long stretch.

## Usage
```
node check-mentions.mjs                          # default queries (domain, Telegram, ref link)
node check-mentions.mjs "your custom query"       # one-off custom query
```

### Running it periodically
This is a one-shot script, not a daemon — nothing runs unless you run it. For a
recurring check, use Windows Task Scheduler (same pattern as `ClaudeTelegramBot`'s
proposed restart-on-failure setup): create a Basic Task, trigger daily/weekly,
action = `node C:\Projects\CasinoReferral\Scripts\brand-monitor\check-mentions.mjs`,
redirect output to a log file if you want a history instead of just console output.

## site-health-check.mjs

Checks the live site for broken links and slow pages: fetches `robots.txt` and
`sitemap.xml`, then every URL listed in the sitemap, then any same-origin links found
on those pages that weren't already in the sitemap. Reports HTTP status + response
time for each, flags anything non-2xx as broken and anything over 2 seconds as slow.
Exit code is 1 if any broken URL was found (so it plugs into Task Scheduler failure
notifications), 0 otherwise.

### Honest scope — read before relying on this
- **Real HTTP checks, not a guess** — every run hits the live site.
- **Can't see inside the React SPA.** `/`, `/en/`, `/vi/` are client-rendered — their
  raw HTML has no `<a href>` tags at all (nav/footer links only exist after JS runs).
  This script does a plain `fetch()`, no headless browser, so it can only discover
  new links from the *static* blog pages, not the SPA shell. It found the
  sitemap.xml gap for `/privacy-policy` and `/terms` (×3 languages) precisely
  because that gap existed both in the sitemap *and* on the SPA pages this script
  can't crawl — it didn't "prove" those links were fine, it just couldn't see them.
  A "no broken links found" result means no broken links among what it *can* see.
- **One level of extra crawling.** Links found on sitemap pages are checked once;
  links found on *those* pages are not followed further.

### Usage
```
node site-health-check.mjs                          # checks https://www.zhelezo.space
node site-health-check.mjs https://staging.example   # checks a different base URL
```
