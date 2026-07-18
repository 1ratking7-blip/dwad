// Lead Scoring — rule-based on purpose: with zero historical conversion data (no leads
// contacted yet), a transparent, explainable rule-based score is more honest than a
// black-box model trained on nothing. Revisit weights in config.mjs once real replies/deals
// give you actual signal on what predicts a good lead in this niche.
import { SCORING_CONFIG } from './config.mjs';

/**
 * @param {object} company - row from crm.getCompany()
 * @param {object[]} contacts - rows from crm.getContactsForCompany()
 * @returns {{ score: number, breakdown: object, priority: 'hot'|'warm'|'cold' }}
 */
export function scoreLead(company, contacts) {
  const w = SCORING_CONFIG.weights;
  const breakdown = {};

  if (company.website) breakdown.has_website = w.has_website;
  if (company.description) breakdown.has_description = w.has_description;

  const hasEmail = contacts.some((c) => c.type === 'email');
  if (hasEmail) breakdown.has_contact_email = w.has_contact_email;

  const hasForm = contacts.some((c) => c.type === 'contact_form');
  if (hasForm) breakdown.has_contact_form = w.has_contact_form;

  const socialCount = Object.keys(company.social_links || {}).length;
  if (socialCount > 0) {
    breakdown.has_social_link = Math.min(socialCount * w.has_social_link, w.max_social_points);
  }

  if ((company.tech_stack || []).length > 0) {
    breakdown.has_tech_stack_detected = w.has_tech_stack_detected;
  }

  if (
    SCORING_CONFIG.target_industries.length > 0 &&
    company.industry &&
    SCORING_CONFIG.target_industries.some((i) => i.toLowerCase() === company.industry.toLowerCase())
  ) {
    breakdown.industry_match = w.industry_match;
  }

  if (
    SCORING_CONFIG.target_countries.length > 0 &&
    company.country &&
    SCORING_CONFIG.target_countries.some((c) => c.toUpperCase() === company.country.toUpperCase())
  ) {
    breakdown.country_match = w.country_match;
  }

  const score = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  const priority =
    score >= SCORING_CONFIG.thresholds.hot
      ? 'hot'
      : score >= SCORING_CONFIG.thresholds.warm
        ? 'warm'
        : 'cold';

  return { score, breakdown, priority };
}
