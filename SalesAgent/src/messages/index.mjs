import { TEMPLATES } from './templates.mjs';
import { SENDER_CONFIG } from './config.mjs';
import { generateInsight } from './insight.mjs';
import { addMessageDraft } from '../crm/index.mjs';

/**
 * @param {'first_email'|'follow_up_1'|'follow_up_2'|'reply'|'proposal'} type
 * @param {object} lead - row from crm.getLead()
 * @param {object} company - row from crm.getCompany()
 * @param {boolean} [persist=true] - false to preview without writing to the DB
 */
export function generateDraft(type, lead, company, persist = true) {
  const template = TEMPLATES[type];
  if (!template) throw new Error(`Unknown draft type: ${type}`);

  const ctx = {
    company,
    insight: generateInsight(company),
    sender: SENDER_CONFIG,
  };
  const { subject, body } = template(ctx);

  if (persist) {
    return addMessageDraft(lead.id, { type, subject, body });
  }
  return { type, subject, body };
}
