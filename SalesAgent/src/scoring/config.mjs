// Scoring weights — tune freely, the engine itself (index.mjs) doesn't need to change.
// target_industries/target_countries are optional filters: leave empty to score every lead
// the same regardless of niche/geography, or fill in once you know who converts best (see
// docs/ARCHITECTURE.md — this is meant to be revisited after real replies come in, not guessed
// once and left alone).
export const SCORING_CONFIG = {
  weights: {
    has_website: 10,
    has_description: 5,
    has_contact_email: 25,
    has_contact_form: 10,
    has_social_link: 3,       // per platform found, capped by max_social_points
    max_social_points: 9,
    has_tech_stack_detected: 5, // site is active/maintained, not abandoned
    industry_match: 15,
    country_match: 10,
  },
  // Set 2026-07-28 per Plan 1 Month/plan.md "День 2": first 30 days = ONE category, not all of
  // marketing agencies / SaaS / affiliate / creator-economy / education at once. Starting with
  // agencies + online services running cold outreach themselves — they have budget, an
  // understood need, and a short decision cycle. Widen this list only after the first pilot,
  // not before (plan explicitly forbids "менять направление каждую неделю").
  target_industries: ['marketing agency', 'digital agency', 'SaaS', 'online service'],
  target_countries: [],  // e.g. ['US', 'GB', 'CA'] — empty = no filter. Kept unfiltered even
                          // though outreach is currently split RU/CIS + Vietnam (two locales,
                          // see src/messages/locale.mjs) — country drives WHICH template
                          // language a lead gets, not whether it's scored lower
  thresholds: {
    hot: 70,
    warm: 40, // below this = 'cold'
  },
};
