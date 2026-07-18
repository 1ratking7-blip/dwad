// Lead Discovery — see docs/ARCHITECTURE.md "Lead Discovery: what's actually automatic" for
// the honest version of what this does and doesn't do. This module runs the full pipeline
// (analyze -> find contacts -> create lead -> score) for a LIST OF URLS you already have —
// finding those URLs in the first place from a keyword/industry/city query is the one piece
// that isn't fully self-running (see the note below and in ARCHITECTURE.md).
import { analyzeCompany } from '../analyzer/index.mjs';
import { discoverContacts } from '../contacts/index.mjs';
import { scoreLead } from '../scoring/index.mjs';
import {
  upsertCompany,
  addContact,
  createLead,
  updateLeadScore,
  getContactsForCompany,
} from '../crm/index.mjs';

const POLITE_DELAY_MS = 1500; // don't hammer target sites — this is research, not a crawler

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {{website: string, industry?: string, country?: string}} seed
 * @returns {Promise<object>} { company, lead, score, priority, error? }
 */
export async function processSeed(seed) {
  const analyzed = await analyzeCompany(seed.website);
  if (analyzed.error) {
    return { error: analyzed.error, website: seed.website };
  }

  const company = upsertCompany({
    ...analyzed,
    industry: seed.industry ?? null,
    country: seed.country ?? null,
  });

  // Follow at most 2 same-site "contact"-shaped links found by the analyzer — enough to find
  // a published email/form without turning this into a full-site crawl.
  for (const candidateUrl of (analyzed.contactCandidates || []).slice(0, 2)) {
    await sleep(POLITE_DELAY_MS);
    const contactResult = await discoverContacts(candidateUrl);
    if (contactResult.error) continue;
    for (const email of contactResult.emails) {
      addContact(company.id, { type: 'email', value: email, source_page: candidateUrl });
    }
    if (contactResult.hasContactForm) {
      addContact(company.id, { type: 'contact_form', value: candidateUrl, source_page: candidateUrl });
    }
  }

  const lead = createLead(company.id);
  const { score, breakdown, priority } = scoreLead(company, getContactsForCompany(company.id));
  updateLeadScore(lead.id, score, breakdown, priority);

  return { company, lead: { ...lead, score, priority }, error: null };
}

/**
 * @param {Array<{website: string, industry?: string, country?: string}>} seeds
 */
export async function processSeedList(seeds) {
  const results = [];
  for (const seed of seeds) {
    results.push(await processSeed(seed));
    await sleep(POLITE_DELAY_MS);
  }
  return results;
}
