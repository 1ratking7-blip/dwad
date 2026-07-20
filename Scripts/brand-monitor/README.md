# Brand Mention Monitor

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

## Running it periodically
This is a one-shot script, not a daemon — nothing runs unless you run it. For a
recurring check, use Windows Task Scheduler (same pattern as `ClaudeTelegramBot`'s
proposed restart-on-failure setup): create a Basic Task, trigger daily/weekly,
action = `node C:\Projects\CasinoReferral\Scripts\brand-monitor\check-mentions.mjs`,
redirect output to a log file if you want a history instead of just console output.
