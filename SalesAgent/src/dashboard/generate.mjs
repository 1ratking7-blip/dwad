import { generateStats } from '../reports/index.mjs';
import { listLeads } from '../crm/index.mjs';

function bar(label, value, max) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return `
    <div class="bar-row">
      <span class="bar-label">${escapeHtml(label)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <span class="bar-value">${value}</span>
    </div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function generateDashboardHtml() {
  const stats = generateStats();
  const leads = listLeads({ sortBy: 'score' }).slice(0, 20);

  const maxCountry = Math.max(1, ...stats.byCountry.map((r) => r.n));
  const maxIndustry = Math.max(1, ...stats.byIndustry.map((r) => r.n));

  const hot = stats.leadsByPriority.find((r) => r.priority === 'hot')?.n ?? 0;
  const warm = stats.leadsByPriority.find((r) => r.priority === 'warm')?.n ?? 0;
  const cold = stats.leadsByPriority.find((r) => r.priority === 'cold')?.n ?? 0;

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Sales Agent Dashboard</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  :root { color-scheme: dark; }
  body { background:#0B0E14; color:#d1d5db; font-family:'Inter',system-ui,sans-serif; margin:0; padding:40px 24px; }
  h1 { color:#fff; font-size:1.75rem; margin-bottom:4px; }
  .subtitle { color:#6b7280; font-size:0.875rem; margin-bottom:32px; }
  .stat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; margin-bottom:40px; }
  .stat-card { background:#121824; border:1px solid #1F293D; border-radius:16px; padding:20px; }
  .stat-card .value { font-size:2rem; font-weight:800; color:#00E676; }
  .stat-card .label { color:#9ca3af; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em; margin-top:4px; }
  .priority-row { display:flex; gap:12px; margin-bottom:40px; }
  .priority-pill { flex:1; border-radius:12px; padding:16px; text-align:center; font-weight:700; }
  .priority-pill.hot { background:rgba(239,68,68,0.15); color:#f87171; }
  .priority-pill.warm { background:rgba(245,158,11,0.15); color:#fbbf24; }
  .priority-pill.cold { background:rgba(107,114,128,0.15); color:#9ca3af; }
  section { margin-bottom:40px; }
  h2 { color:#00E676; font-size:1.1rem; margin-bottom:16px; }
  .bar-row { display:flex; align-items:center; gap:12px; margin-bottom:8px; font-size:0.875rem; }
  .bar-label { width:140px; flex-shrink:0; color:#d1d5db; }
  .bar-track { flex:1; background:#1F293D; border-radius:6px; height:10px; overflow:hidden; }
  .bar-fill { background:linear-gradient(90deg,#00E676,#00B359); height:100%; }
  .bar-value { width:30px; text-align:right; color:#9ca3af; }
  table { width:100%; border-collapse:collapse; font-size:0.875rem; }
  th, td { text-align:left; padding:10px 12px; border-bottom:1px solid #1F293D; }
  th { color:#6b7280; font-weight:600; text-transform:uppercase; font-size:0.7rem; letter-spacing:0.05em; }
  .score-hot { color:#f87171; font-weight:700; }
  .score-warm { color:#fbbf24; font-weight:700; }
  .score-cold { color:#9ca3af; }
  .empty { color:#6b7280; font-style:italic; }
</style>
</head>
<body>
  <h1>Sales Agent Dashboard</h1>
  <div class="subtitle">Сгенерировано ${new Date().toLocaleString('ru-RU')}</div>

  <div class="stat-grid">
    <div class="stat-card"><div class="value">${stats.totalCompanies}</div><div class="label">Компаний найдено</div></div>
    <div class="stat-card"><div class="value">${stats.totalLeads}</div><div class="label">Лидов создано</div></div>
    <div class="stat-card"><div class="value">${stats.totalDrafts}</div><div class="label">Черновиков подготовлено</div></div>
    <div class="stat-card"><div class="value">${stats.upcomingActions.length}</div><div class="label">Запланированных действий</div></div>
  </div>

  <div class="priority-row">
    <div class="priority-pill hot">🔥 Hot: ${hot}</div>
    <div class="priority-pill warm">🌤️ Warm: ${warm}</div>
    <div class="priority-pill cold">❄️ Cold: ${cold}</div>
  </div>

  <section>
    <h2>По странам</h2>
    ${stats.byCountry.length ? stats.byCountry.map((r) => bar(r.country, r.n, maxCountry)).join('') : '<p class="empty">Нет данных</p>'}
  </section>

  <section>
    <h2>По индустриям</h2>
    ${stats.byIndustry.length ? stats.byIndustry.map((r) => bar(r.industry, r.n, maxIndustry)).join('') : '<p class="empty">Нет данных</p>'}
  </section>

  <section>
    <h2>Топ лидов по скору</h2>
    ${
      leads.length
        ? `<table><thead><tr><th>Компания</th><th>Статус</th><th>Скор</th><th>Приоритет</th><th>Следующее действие</th></tr></thead><tbody>
      ${leads
        .map(
          (l) => `<tr>
        <td>${escapeHtml(l.company?.name ?? '—')}</td>
        <td>${escapeHtml(l.status)}</td>
        <td>${l.score ?? '—'}</td>
        <td class="score-${l.priority ?? 'cold'}">${l.priority ?? '—'}</td>
        <td>${l.next_action_date ? `${l.next_action_date} — ${escapeHtml(l.next_action_note ?? '')}` : '—'}</td>
      </tr>`
        )
        .join('')}
      </tbody></table>`
        : '<p class="empty">Лидов пока нет</p>'
    }
  </section>

  <section>
    <h2>Ближайшие действия</h2>
    ${
      stats.upcomingActions.length
        ? `<table><thead><tr><th>Дата</th><th>Компания</th><th>Заметка</th></tr></thead><tbody>
      ${stats.upcomingActions
        .map((a) => `<tr><td>${a.next_action_date}</td><td>${escapeHtml(a.company_name)}</td><td>${escapeHtml(a.next_action_note ?? '')}</td></tr>`)
        .join('')}
      </tbody></table>`
        : '<p class="empty">Нет запланированных действий</p>'
    }
  </section>
</body>
</html>`;
}
