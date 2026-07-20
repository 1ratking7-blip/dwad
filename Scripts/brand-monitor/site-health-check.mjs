#!/usr/bin/env node
// Site health monitor — sitemap/robots.txt reachability, per-page response time,
// and broken internal links, checked against the live production site.
//
// What this IS: a real HTTP check against https://www.zhelezo.space/ right now —
// every URL listed in sitemap.xml, plus every internal link found on those pages.
// What this ISN'T: a synthetic-monitoring service (no alerting/scheduling built in,
// see "Running it periodically" in README.md for that), and it only follows links
// one level deep from sitemap pages — it won't discover pages that are neither in
// the sitemap nor linked from a sitemap page.
//
// IMPORTANT caveat found while building this (2026-07-21): `/`, `/en/`, `/vi/` are a
// client-rendered React SPA shell — their raw server HTML has ZERO <a href> tags
// (Header/Footer/nav links only exist after JS runs). This script does a plain
// fetch(), not a headless browser, so it CANNOT discover links from those 3 pages —
// it only sees links from the static blog pages. It found the sitemap.xml gap
// (privacy-policy/terms pages were missing, fixed same day) precisely because that
// gap existed on both the sitemap AND the SPA pages this script can't crawl. Don't
// read "0 additional links found" as "no broken links exist" — it means "no broken
// links were found among the links this script is able to see." Full SPA crawling
// would need Playwright (already used for i18n QA in this project, not wired in
// here to keep this script dependency-free like check-mentions.mjs).
//
// Usage: node site-health-check.mjs [baseUrl]
// Default baseUrl: https://www.zhelezo.space

const BASE_URL = (process.argv[2] || 'https://www.zhelezo.space').replace(/\/$/, '');
const SLOW_THRESHOLD_MS = 2000;

async function timedFetch(url) {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ZhelezoHealthCheck/1.0)' },
      redirect: 'follow',
    });
    const ms = Date.now() - start;
    const body = res.ok ? await res.text() : '';
    return { url, status: res.status, ok: res.ok, ms, body };
  } catch (err) {
    return { url, status: null, ok: false, ms: Date.now() - start, body: '', error: err.message };
  }
}

function extractSitemapUrls(xml) {
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map((m) => m[1].trim());
}

function extractInternalLinks(html, baseUrl) {
  const links = new Set();
  const hrefPattern = /<a\b[^>]*href="([^"#]+)"/g;
  let match;
  while ((match = hrefPattern.exec(html)) !== null) {
    let href = match[1];
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    try {
      const resolved = new URL(href, baseUrl);
      if (resolved.origin === new URL(BASE_URL).origin) {
        links.add(resolved.href);
      }
    } catch {
      // malformed href, skip
    }
  }
  return links;
}

async function main() {
  console.log(`Site health check — ${BASE_URL} — ${new Date().toISOString()}\n`);

  const problems = [];
  const slow = [];

  // 1. robots.txt
  const robots = await timedFetch(`${BASE_URL}/robots.txt`);
  console.log(`robots.txt: ${robots.status ?? 'ERROR'} (${robots.ms}ms)${robots.error ? ' — ' + robots.error : ''}`);
  if (!robots.ok) problems.push(`robots.txt unreachable (${robots.status ?? robots.error})`);

  // 2. sitemap.xml
  const sitemap = await timedFetch(`${BASE_URL}/sitemap.xml`);
  console.log(`sitemap.xml: ${sitemap.status ?? 'ERROR'} (${sitemap.ms}ms)${sitemap.error ? ' — ' + sitemap.error : ''}`);
  if (!sitemap.ok) {
    problems.push(`sitemap.xml unreachable (${sitemap.status ?? sitemap.error})`);
    console.log('\nCannot continue without sitemap.xml — stopping here.');
    printSummary(problems, slow);
    return;
  }

  const sitemapUrls = extractSitemapUrls(sitemap.body);
  console.log(`\nFound ${sitemapUrls.length} URLs in sitemap.xml. Checking each...\n`);

  const checkedUrls = new Map(); // url -> result
  const allInternalLinks = new Set();

  for (const url of sitemapUrls) {
    const result = await timedFetch(url);
    checkedUrls.set(url, result);
    const flag = result.ok ? 'OK ' : 'FAIL';
    console.log(`  [${flag}] ${result.status ?? 'ERR'} ${result.ms}ms  ${url}`);
    if (!result.ok) problems.push(`sitemap URL broken: ${url} (${result.status ?? result.error})`);
    if (result.ms > SLOW_THRESHOLD_MS) slow.push(`${url} (${result.ms}ms)`);
    if (result.ok && result.body) {
      for (const link of extractInternalLinks(result.body, url)) {
        allInternalLinks.add(link);
      }
    }
    await new Promise((r) => setTimeout(r, 300)); // polite delay
  }

  const newLinks = [...allInternalLinks].filter((l) => !checkedUrls.has(l) && !checkedUrls.has(l.replace(/\/$/, '')));
  console.log(`\nFound ${newLinks.length} additional internal links not in sitemap. Checking each...\n`);

  for (const url of newLinks) {
    const result = await timedFetch(url);
    const flag = result.ok ? 'OK ' : 'FAIL';
    console.log(`  [${flag}] ${result.status ?? 'ERR'} ${result.ms}ms  ${url}`);
    if (!result.ok) problems.push(`internal link broken: ${url} (${result.status ?? result.error})`);
    if (result.ms > SLOW_THRESHOLD_MS) slow.push(`${url} (${result.ms}ms)`);
    await new Promise((r) => setTimeout(r, 300));
  }

  printSummary(problems, slow, sitemapUrls.length + newLinks.length);
}

function printSummary(problems, slow, totalChecked) {
  console.log('\n--- Summary ---');
  if (totalChecked !== undefined) console.log(`Checked: ${totalChecked} URLs`);
  if (problems.length === 0) {
    console.log('No broken URLs found.');
  } else {
    console.log(`${problems.length} problem(s) found:`);
    for (const p of problems) console.log(`  - ${p}`);
  }
  if (slow.length > 0) {
    console.log(`\n${slow.length} URL(s) slower than ${SLOW_THRESHOLD_MS}ms:`);
    for (const s of slow) console.log(`  - ${s}`);
  }
  process.exitCode = problems.length > 0 ? 1 : 0;
}

main();
