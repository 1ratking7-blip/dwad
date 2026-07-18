// CRM data-access layer — every other module (analyzer, scoring, messages, dashboard, reports)
// goes through this, not raw SQL, so the schema can change in one place.
import { getDb } from '../db/index.mjs';

function nowIso() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

export function upsertCompany(company) {
  const db = getDb();
  const existing = db
    .prepare('SELECT * FROM companies WHERE website = ?')
    .get(company.website);

  if (existing) {
    db.prepare(
      `UPDATE companies SET name = ?, industry = ?, country = ?, city = ?, size_estimate = ?,
       description = ?, social_links = ?, tech_stack = ?, last_analyzed_at = ?
       WHERE id = ?`
    ).run(
      company.name ?? existing.name,
      company.industry ?? existing.industry,
      company.country ?? existing.country,
      company.city ?? existing.city,
      company.size_estimate ?? existing.size_estimate,
      company.description ?? existing.description,
      company.social_links ? JSON.stringify(company.social_links) : existing.social_links,
      company.tech_stack ? JSON.stringify(company.tech_stack) : existing.tech_stack,
      nowIso(),
      existing.id
    );
    return getCompany(existing.id);
  }

  const result = db
    .prepare(
      `INSERT INTO companies (name, website, industry, country, city, size_estimate,
       description, social_links, tech_stack, source, last_analyzed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      company.name,
      company.website,
      company.industry ?? null,
      company.country ?? null,
      company.city ?? null,
      company.size_estimate ?? null,
      company.description ?? null,
      company.social_links ? JSON.stringify(company.social_links) : null,
      company.tech_stack ? JSON.stringify(company.tech_stack) : null,
      company.source,
      company.last_analyzed_at ? nowIso() : null
    );
  return getCompany(Number(result.lastInsertRowid));
}

export function getCompany(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM companies WHERE id = ?').get(id);
  return row ? deserializeCompany(row) : null;
}

export function getCompanyByWebsite(website) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM companies WHERE website = ?').get(website);
  return row ? deserializeCompany(row) : null;
}

export function listCompanies() {
  const db = getDb();
  return db.prepare('SELECT * FROM companies ORDER BY discovered_at DESC').all().map(deserializeCompany);
}

function deserializeCompany(row) {
  return {
    ...row,
    social_links: row.social_links ? JSON.parse(row.social_links) : {},
    tech_stack: row.tech_stack ? JSON.parse(row.tech_stack) : [],
  };
}

export function addContact(companyId, contact) {
  const db = getDb();
  const result = db
    .prepare(
      'INSERT INTO contacts (company_id, type, value, source_page) VALUES (?, ?, ?, ?)'
    )
    .run(companyId, contact.type, contact.value, contact.source_page ?? null);
  return db.prepare('SELECT * FROM contacts WHERE id = ?').get(Number(result.lastInsertRowid));
}

export function getContactsForCompany(companyId) {
  const db = getDb();
  return db.prepare('SELECT * FROM contacts WHERE company_id = ?').all(companyId);
}

export function createLead(companyId) {
  const db = getDb();
  const existing = db
    .prepare("SELECT * FROM leads WHERE company_id = ? AND status NOT IN ('won','lost')")
    .get(companyId);
  if (existing) return existing;

  const result = db
    .prepare('INSERT INTO leads (company_id) VALUES (?)')
    .run(companyId);
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(Number(result.lastInsertRowid));
  addInteraction(lead.id, 'note', 'Lead created');
  return lead;
}

export function getLead(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
}

export function getLeadWithCompany(id) {
  const db = getDb();
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
  if (!lead) return null;
  return { ...lead, company: getCompany(lead.company_id) };
}

export function listLeads({ status, minScore, sortBy = 'score' } = {}) {
  const db = getDb();
  let sql = 'SELECT * FROM leads WHERE 1=1';
  const params = [];
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (minScore != null) {
    sql += ' AND score >= ?';
    params.push(minScore);
  }
  sql += sortBy === 'score' ? ' ORDER BY score DESC' : ' ORDER BY updated_at DESC';
  const leads = db.prepare(sql).all(...params);
  return leads.map((l) => ({ ...l, company: getCompany(l.company_id) }));
}

export function updateLeadStatus(leadId, status, note) {
  const db = getDb();
  db.prepare('UPDATE leads SET status = ?, updated_at = ? WHERE id = ?').run(status, nowIso(), leadId);
  addInteraction(leadId, 'status_change', note ?? `Status changed to ${status}`);
}

export function updateLeadScore(leadId, score, breakdown, priority) {
  const db = getDb();
  db.prepare(
    'UPDATE leads SET score = ?, score_breakdown = ?, priority = ?, updated_at = ? WHERE id = ?'
  ).run(score, JSON.stringify(breakdown), priority, nowIso(), leadId);
}

export function setNextAction(leadId, date, note) {
  const db = getDb();
  db.prepare(
    'UPDATE leads SET next_action_date = ?, next_action_note = ?, updated_at = ? WHERE id = ?'
  ).run(date, note ?? null, nowIso(), leadId);
}

export function addInteraction(leadId, type, content) {
  const db = getDb();
  db.prepare('INSERT INTO interactions (lead_id, type, content) VALUES (?, ?, ?)').run(
    leadId,
    type,
    content ?? null
  );
}

export function getInteractions(leadId) {
  const db = getDb();
  return db
    .prepare('SELECT * FROM interactions WHERE lead_id = ? ORDER BY created_at ASC')
    .all(leadId);
}

export function addMessageDraft(leadId, draft) {
  const db = getDb();
  // Regenerating a draft (e.g. after a template fix) must not leave the old, superseded
  // version sitting in the CRM as if it were still a live option to send — someone reviewing
  // pending drafts could pick the stale one. Reject any earlier un-actioned draft of the same
  // type for this lead before inserting the new one.
  db.prepare(
    "UPDATE message_drafts SET status = 'rejected' WHERE lead_id = ? AND type = ? AND status = 'draft'"
  ).run(leadId, draft.type);
  const result = db
    .prepare(
      'INSERT INTO message_drafts (lead_id, type, subject, body) VALUES (?, ?, ?, ?)'
    )
    .run(leadId, draft.type, draft.subject ?? null, draft.body);
  addInteraction(leadId, 'draft_created', `${draft.type} draft prepared`);
  return db.prepare('SELECT * FROM message_drafts WHERE id = ?').get(Number(result.lastInsertRowid));
}

export function listDraftsForLead(leadId) {
  const db = getDb();
  return db
    .prepare('SELECT * FROM message_drafts WHERE lead_id = ? ORDER BY created_at DESC')
    .all(leadId);
}

/**
 * The ONLY place a draft's status can become 'sent' — always a human recording that THEY
 * sent it. Nothing in this codebase calls an email/SMTP API on its own.
 */
export function markDraftSent(draftId) {
  const db = getDb();
  const draft = db.prepare('SELECT * FROM message_drafts WHERE id = ?').get(draftId);
  if (!draft) throw new Error(`Draft ${draftId} not found`);
  db.prepare("UPDATE message_drafts SET status = 'sent' WHERE id = ?").run(draftId);
  addInteraction(draft.lead_id, 'manual_contact_logged', `${draft.type} marked as sent by user`);
  return db.prepare('SELECT * FROM message_drafts WHERE id = ?').get(draftId);
}
