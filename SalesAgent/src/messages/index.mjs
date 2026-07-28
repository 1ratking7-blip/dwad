import { TEMPLATES } from './templates.mjs';
import { SENDER_CONFIG } from './config.mjs';
import { generateInsight } from './insight.mjs';
import { resolveLocale } from './locale.mjs';
import { addMessageDraft } from '../crm/index.mjs';

/**
 * @param {'first_email'|'after_interest'|'follow_up_1'|'follow_up_2'|'reply'|'proposal'} type
 * @param {object} lead - row from crm.getLead()
 * @param {object} company - row from crm.getCompany()
 * @param {boolean} [persist=true] - false to preview without writing to the DB
 * @param {object} [extra={}] - manual fill-ins a template needs beyond company/insight/sender
 *   (e.g. after_interest's opportunity_1/2/3, follow_up_1's follow_up_detail/target_segment —
 *   see templates.mjs). Never guessed automatically; omit to get the bracketed placeholder.
 * @param {'ru'|'vi'} [localeOverride] - force a locale instead of auto-detecting from
 *   company.country (see locale.mjs) — useful when country is missing/ambiguous.
 */
export function generateDraft(type, lead, company, persist = true, extra = {}, localeOverride) {
  const locale = localeOverride || resolveLocale(company);
  const templatesForLocale = TEMPLATES[locale] || TEMPLATES.ru;
  const template = templatesForLocale[type];
  if (!template) throw new Error(`Unknown draft type: ${type} (locale: ${locale})`);

  const ctx = {
    ...extra,
    company,
    insight: generateInsight(company, locale),
    sender: SENDER_CONFIG[locale] || SENDER_CONFIG.ru,
  };
  const { subject, body } = template(ctx);

  if (persist) {
    // Note: message_drafts has no locale column — addMessageDraft() silently ignores extra
    // keys. Locale is derivable again from company.country at read time, so not persisting it
    // separately isn't a data loss, just don't expect draft.locale back from a DB read.
    return { ...addMessageDraft(lead.id, { type, subject, body }), locale };
  }
  return { type, subject, body, locale };
}
