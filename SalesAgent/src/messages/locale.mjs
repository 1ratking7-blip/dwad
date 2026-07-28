// Picks which language a draft should be written in, from the company's country field. Kept as
// its own module (not inlined in index.mjs) so the VN-country-string matching logic has one
// place to update if a seed uses an unexpected spelling ("Vietnam" vs "VN" vs "Việt Nam").
const VI_COUNTRY_MATCHES = new Set(['vn', 'vnm', 'vietnam', 'viet nam', 'việt nam']);

/**
 * @param {{country?: string|null}} company
 * @returns {'ru'|'vi'}
 */
export function resolveLocale(company) {
  const country = (company?.country || '').trim().toLowerCase();
  return VI_COUNTRY_MATCHES.has(country) ? 'vi' : 'ru';
}
