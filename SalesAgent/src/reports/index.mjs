import { getDb } from '../db/index.mjs';

const PERIOD_SQL = {
  daily: "datetime('now', '-1 day')",
  weekly: "datetime('now', '-7 days')",
  monthly: "datetime('now', '-30 days')",
};

export function generateStats({ since } = {}) {
  const db = getDb();
  const whereCompanies = since ? 'WHERE discovered_at >= ?' : '';
  const whereLeads = since ? 'WHERE created_at >= ?' : '';
  const whereDrafts = since ? 'WHERE created_at >= ?' : '';
  const sinceParams = since ? [since] : [];

  const totalCompanies = db.prepare(`SELECT COUNT(*) AS n FROM companies ${whereCompanies}`).get(...sinceParams).n;
  const totalLeads = db.prepare(`SELECT COUNT(*) AS n FROM leads ${whereLeads}`).get(...sinceParams).n;
  const totalDrafts = db.prepare(`SELECT COUNT(*) AS n FROM message_drafts ${whereDrafts}`).get(...sinceParams).n;

  const leadsByStatus = db
    .prepare(`SELECT status, COUNT(*) AS n FROM leads ${whereLeads} GROUP BY status`)
    .all(...sinceParams);
  const priorityClause = since ? 'WHERE created_at >= ? AND priority IS NOT NULL' : 'WHERE priority IS NOT NULL';
  const leadsByPriority = db
    .prepare(`SELECT priority, COUNT(*) AS n FROM leads ${priorityClause} GROUP BY priority`)
    .all(...sinceParams);
  const draftsByStatus = db
    .prepare(`SELECT status, COUNT(*) AS n FROM message_drafts ${whereDrafts} GROUP BY status`)
    .all(...sinceParams);
  const byCountry = db
    .prepare(
      `SELECT COALESCE(country, 'Unknown') AS country, COUNT(*) AS n FROM companies ${whereCompanies} GROUP BY country ORDER BY n DESC`
    )
    .all(...sinceParams);
  const byIndustry = db
    .prepare(
      `SELECT COALESCE(industry, 'Unknown') AS industry, COUNT(*) AS n FROM companies ${whereCompanies} GROUP BY industry ORDER BY n DESC`
    )
    .all(...sinceParams);

  const upcomingActions = db
    .prepare(
      `SELECT l.id, l.next_action_date, l.next_action_note, c.name AS company_name
       FROM leads l JOIN companies c ON c.id = l.company_id
       WHERE l.next_action_date IS NOT NULL AND l.next_action_date >= date('now')
       ORDER BY l.next_action_date ASC LIMIT 10`
    )
    .all();

  return {
    totalCompanies,
    totalLeads,
    totalDrafts,
    leadsByStatus,
    leadsByPriority,
    draftsByStatus,
    byCountry,
    byIndustry,
    upcomingActions,
  };
}

export function generateReport(period) {
  const since = PERIOD_SQL[period] ? sqlNow(period) : null;
  return generateStats({ since });
}

function sqlNow(period) {
  const db = getDb();
  return db.prepare(`SELECT ${PERIOD_SQL[period]} AS ts`).get().ts;
}

export function renderReportMarkdown(period, stats) {
  const lines = [
    `# Sales Agent — отчёт (${period})`,
    ``,
    `Сформировано: ${new Date().toISOString()}`,
    ``,
    `## Сводка`,
    `- Найдено компаний: ${stats.totalCompanies}`,
    `- Лидов создано: ${stats.totalLeads}`,
    `- Черновиков сообщений подготовлено: ${stats.totalDrafts}`,
    ``,
    `## Лиды по статусу`,
    ...stats.leadsByStatus.map((r) => `- ${r.status}: ${r.n}`),
    ``,
    `## Лиды по приоритету`,
    ...stats.leadsByPriority.map((r) => `- ${r.priority}: ${r.n}`),
    ``,
    `## Черновики по статусу`,
    ...stats.draftsByStatus.map((r) => `- ${r.status}: ${r.n}`),
    ``,
    `## По странам`,
    ...stats.byCountry.map((r) => `- ${r.country}: ${r.n}`),
    ``,
    `## По индустриям`,
    ...stats.byIndustry.map((r) => `- ${r.industry}: ${r.n}`),
    ``,
    `## Ближайшие действия`,
    ...(stats.upcomingActions.length
      ? stats.upcomingActions.map((a) => `- ${a.next_action_date} — ${a.company_name}: ${a.next_action_note ?? '(без заметки)'}`)
      : ['_Нет запланированных действий_']),
  ];
  return lines.join('\n');
}
