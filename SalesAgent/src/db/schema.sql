-- ZHELEZO Sales Agent — CRM schema (SQLite via node:sqlite, no native bindings needed).
-- Separates "company" (factual data about a business) from "lead" (our CRM pipeline state
-- for that company) — the same company could theoretically be re-evaluated as a lead twice
-- (e.g. lost, then revisited a year later) without losing the original research.

CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  website TEXT NOT NULL UNIQUE,
  industry TEXT,
  country TEXT,
  city TEXT,
  size_estimate TEXT,           -- free-text bucket: 'solo', '2-10', '11-50', '50+', 'unknown'
  description TEXT,
  social_links TEXT,            -- JSON: { "twitter": "...", "linkedin_company": "...", ... }
  tech_stack TEXT,               -- JSON array of detected technology signals
  source TEXT NOT NULL,          -- 'seed_list' | 'manual' | 'websearch_session'
  discovered_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_analyzed_at TEXT
);

CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL,            -- 'email' | 'contact_form' | 'phone' | 'linkedin_company_page'
  value TEXT NOT NULL,
  source_page TEXT,              -- URL where this was found — always the company's own site
  discovered_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'new',  -- new|contacted|replied|qualified|won|lost|on_hold
  score INTEGER,
  score_breakdown TEXT,           -- JSON: { "has_website": 10, "has_contact_email": 15, ... }
  priority TEXT,                  -- 'hot' | 'warm' | 'cold', derived from score
  next_action_date TEXT,
  next_action_note TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL,             -- 'note'|'status_change'|'draft_created'|'manual_contact_logged'
  content TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- message_drafts.status only ever moves to 'sent' via a human logging that THEY sent it
-- (see bin/draft.mjs --mark-sent) — nothing in this codebase sends anything automatically.
CREATE TABLE IF NOT EXISTS message_drafts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL,             -- 'first_email'|'follow_up_1'|'follow_up_2'|'reply'|'proposal'
  subject TEXT,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',  -- 'draft'|'approved'|'sent'|'rejected'
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_leads_company ON leads(company_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_next_action ON leads(next_action_date);
CREATE INDEX IF NOT EXISTS idx_interactions_lead ON interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_drafts_lead ON message_drafts(lead_id);
