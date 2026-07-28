// Contact Discovery — extracts ONLY what a company has chosen to publish on its own site for
// exactly this purpose (a contact page exists so people can get in touch). Deliberately does
// NOT touch LinkedIn or any third-party platform: LinkedIn's own Terms of Service prohibit
// automated scraping (this has real legal precedent — LinkedIn has sued and blocked scrapers
// repeatedly), so that data source is out of scope here regardless of what's technically
// fetchable. If a LinkedIn company URL is already known (from Company Analyzer's social_links,
// itself just a link found in the company's own HTML), it's stored as-is — never crawled.
import * as cheerio from 'cheerio';
import { isAllowed, USER_AGENT } from '../lib/robots.mjs';

// Filters out placeholder/obfuscated addresses (example.com, image-filename-shaped strings,
// Sentry/analytics tracking pixels that happen to look like emails in minified JS).
//
// Widened 2026-07-28 after the first real bilingual send caught two live false positives that
// slipped through: sentry.wixpress.com/sentry-next.wixpress.com (Wix's own Sentry proxy — same
// problem as sentry.io, different domain, wasn't covered) and "you@company.com" — a literal
// HTML placeholder attribute value on Pancake's contact form that got sent an actual cold email
// instead of their real support@pancake.vn (which was also on the page but not picked). Also
// added the other placeholder shapes seen in the same batch (name@company.com, example@mysite.com,
// example@usermail.com) so the same class of bug doesn't repeat on the next seed batch.
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const EMAIL_DENYLIST_DOMAINS = /example\.(com|org)|sentry\.io|sentry(-next)?\.wixpress\.com|schema\.org|w3\.org|company\.com|mysite\.com|usermail\.com/i;
// Prefix match — these only ever showed up as the start of an image-filename-shaped string
// (e.g. "logo@2x.png"), so matching the start of the local part is intentionally broad.
const EMAIL_DENYLIST_LOCALPART_PREFIX = /^(image|icon|logo|photo|screenshot)/i;
// Exact match only — "you"/"name"/"test"/"email" are common REAL local parts too
// (youremail@gmail.com, testov@mail.ru), so these must match the whole local part, not just
// its start, or real contacts would get wrongly dropped.
const EMAIL_DENYLIST_LOCALPART_EXACT = /^(you|name|test|email)$/i;

function extractEmails(html) {
  const matches = html.match(EMAIL_RE) || [];
  const seen = new Set();
  for (const raw of matches) {
    const email = raw.toLowerCase();
    const localPart = email.split('@')[0];
    if (EMAIL_DENYLIST_DOMAINS.test(email)) continue;
    if (EMAIL_DENYLIST_LOCALPART_PREFIX.test(localPart)) continue;
    if (EMAIL_DENYLIST_LOCALPART_EXACT.test(localPart)) continue;
    if (/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(email)) continue; // filename mistaken for TLD
    seen.add(email);
  }
  return [...seen];
}

function findContactForm($) {
  let found = null;
  $('form').each((_, el) => {
    const formHtml = $(el).html() || '';
    const looksLikeContactForm =
      /name=["']?(name|email|message|subject)/i.test(formHtml) ||
      /(contact|message|enquiry|inquiry)/i.test($(el).attr('id') || '') ||
      /(contact|message|enquiry|inquiry)/i.test($(el).attr('class') || '');
    if (looksLikeContactForm && !found) {
      found = { action: $(el).attr('action') || null };
    }
  });
  return found;
}

/**
 * @param {string} url - typically a contact/about page found by Company Analyzer
 * @returns {Promise<object>} { emails: string[], hasContactForm: boolean, formAction: string|null }
 */
export async function discoverContacts(url) {
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
  const $ = cheerio.load(html);

  const emails = extractEmails(html);
  const form = findContactForm($);

  return {
    source_page: url,
    emails,
    hasContactForm: !!form,
    formAction: form?.action ?? null,
  };
}
