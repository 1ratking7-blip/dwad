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
  target_industries: [], // e.g. ['iGaming', 'crypto', 'affiliate marketing'] — empty = no filter
  target_countries: [],  // e.g. ['US', 'GB', 'CA'] — empty = no filter
  thresholds: {
    hot: 70,
    warm: 40, // below this = 'cold'
  },
};
