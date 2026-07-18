// Company Analyzer — fetches ONLY the company's own public website (never a third-party
// platform) and extracts what's genuinely inferable from static HTML/headers. No headless
// browser, no JS execution — this reads what a normal HTTP client sees, same as any search
// engine crawler would.
import * as cheerio from 'cheerio';
import { isAllowed, USER_AGENT } from '../lib/robots.mjs';

const SOCIAL_PATTERNS = {
  twitter: /(?:twitter\.com|x\.com)\/([A-Za-z0-9_]+)/,
  linkedin_company: /linkedin\.com\/company\/([A-Za-z0-9-_]+)/,
  facebook: /facebook\.com\/([A-Za-z0-9.\-_]+)/,
  instagram: /instagram\.com\/([A-Za-z0-9_.]+)/,
};

const TECH_SIGNATURES = [
  { name: 'WordPress', test: (html) => /wp-content|generator["']\s*content=["']WordPress/i.test(html) },
  { name: 'Shopify', test: (html) => /cdn\.shopify\.com/i.test(html) },
  { name: 'Wix', test: (html) => /static\.wixstatic\.com|wix\.com\/serviceworker/i.test(html) },
  { name: 'Webflow', test: (html) => /webflow\.js|data-wf-site/i.test(html) },
  { name: 'Next.js', test: (html) => /__NEXT_DATA__/i.test(html) },
  { name: 'React', test: (html) => /id=["']root["']/i.test(html) },
  { name: 'Google Analytics', test: (html) => /googletagmanager\.com|gtag\(/i.test(html) },
  { name: 'HubSpot', test: (html) => /js\.hs-scripts\.com|hubspot/i.test(html) },
  { name: 'Cloudflare', test: (html, headers) => headers?.get('server') === 'cloudflare' },
];

const BOT_CHALLENGE_TITLE_PATTERNS = [
  /^just a moment/i,
  /^one moment,? please/i,
  /^checking your browser/i,
  /^attention required/i, // classic Cloudflare title
];

// The auto-reload-and-retry script is close to a unique fingerprint of an interstitial
// challenge page — real pages essentially never self-reload on a timer like this.
const AUTO_RELOAD_SIGNATURE = /setTimeout\s*\(\s*function\s*\(\s*\)\s*\{\s*window\.location\.reload/i;

function isBotChallengePage(html) {
  // First attempt (awisee.com) used a raw HTML-length threshold and missed this exact page —
  // a challenge page's CSS/animation payload can be 10KB+, so length alone is not a reliable
  // signal. Titles for challenge pages are short and specific; combine that with the
  // auto-reload script, which real content pages essentially never contain.
  const titleMatch = /<title>([^<]*)<\/title>/i.exec(html);
  const title = titleMatch?.[1]?.trim() ?? '';
  const titleLooksLikeChallenge = BOT_CHALLENGE_TITLE_PATTERNS.some((p) => p.test(title));
  return titleLooksLikeChallenge && AUTO_RELOAD_SIGNATURE.test(html);
}

/**
 * @param {string} url - the company's homepage (or any page — will be treated as the source of truth)
 * @returns {Promise<object>} data shaped for crm.upsertCompany, plus a `contactCandidates`
 *   array of same-site links worth following up with Contact Discovery
 */
export async function analyzeCompany(url) {
  const allowed = await isAllowed(url);
  if (!allowed) {
    return { error: 'blocked_by_robots_txt', url };
  }

  let res;
  try {
    res = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, redirect: 'follow' });
  } catch (err) {
    return { error: 'fetch_failed', url, detail: err.message };
  }
  if (!res.ok) {
    return { error: 'http_error', url, status: res.status };
  }

  const html = await res.text();

  // Bot-challenge pages (Cloudflare "Just a moment...", etc.) return 200 with almost no real
  // content — without this check the analyzer would silently store the challenge page's own
  // title as the "company name" and report high confidence in empty data. Caught during real
  // testing (awisee.com), not a hypothetical.
  if (isBotChallengePage(html)) {
    return { error: 'blocked_by_bot_protection', url };
  }

  const $ = cheerio.load(html);
  const origin = new URL(res.url).origin;

  const name =
    $('meta[property="og:site_name"]').attr('content') ||
    $('title').first().text().trim().split(/[|\-–]/)[0].trim() ||
    new URL(url).hostname;

  const description =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    null;

  const socialLinks = {};
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    for (const [platform, pattern] of Object.entries(SOCIAL_PATTERNS)) {
      if (!socialLinks[platform] && pattern.test(href)) {
        socialLinks[platform] = href;
      }
    }
  });

  const techStack = TECH_SIGNATURES.filter((sig) => sig.test(html, res.headers)).map((s) => s.name);

  // Same-site links whose path/text suggest a contact or about page — handed to Contact
  // Discovery so it doesn't have to re-crawl the homepage itself.
  const contactCandidates = new Set();
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().toLowerCase();
    if (/contact|kontakt|contacto|связ|napisz/i.test(href) || /contact|reach us|get in touch/i.test(text)) {
      try {
        const abs = new URL(href, origin);
        if (abs.origin === origin) contactCandidates.add(abs.href);
      } catch {
        /* ignore malformed href */
      }
    }
  });

  return {
    name,
    website: origin,
    description,
    social_links: socialLinks,
    tech_stack: techStack,
    source: 'websearch_session',
    contactCandidates: [...contactCandidates],
  };
}
