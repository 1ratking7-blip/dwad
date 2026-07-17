# Changelog — ZHELEZO Landing

Формат: дата — коммит — что и почему. Полные диффы — `git log`/`git show <hash>`.

## 2026-07-18 — Сессия 3 (текущая): "Autonomous CTO + Security + Growth"

- `589fe3b` — Fix: `LuckyWheel.tsx` `setTimeout` без cleanup (потенциальный setState-после-
  unmount) + safe patch-bump `autoprefixer` из свежего dependency-аудита.
- `05b0d80` — Fix: Footer social-иконки — `<a href="#">`+preventDefault → `<button disabled>`
  (видимая обратная связь для зрячих пользователей, корректная семантика для ассистивных
  технологий).
- `80c9579` — Feature: `ErrorBoundary` + `window.onerror`/`unhandledrejection` листенеры,
  репортящие в существующий GA4/Yandex Metrica пайплайн как `client_error`.
- `REPORT/` — новые документы: `SECURITY_REPORT.md`, `PERFORMANCE_REPORT.md`, `BUG_REPORT.md`,
  `SEO_REPORT.md`, `GROWTH_PLAN.md`, `TODO.md`, этот файл.
- `Память/summary.md` — синхронизировано с состоянием после сессий 2 и 3 (было не обновлено
  после коммитов `377c754`..`ecaeb2b`).

Также проверено в этой сессии и не потребовало изменений (см. соответствующие REPORT-файлы за
деталями): `npm audit` (0 уязвимостей), CI (`build.yml`, все 4 прогона success), CSP-хэши
(в синхронизации с текущей сборкой), секреты в истории git (нет), Lighthouse Accessibility/
SEO/errors-in-console (100/100/1-1, без регрессий от правок этой сессии).

## 2026-07-18 — Сессия 2: второй проход аудита (см. `Landing/REPORT.md` за полным отчётом)

- `377c754` — Add HSTS header (`max-age=63072000; includeSubDomains; preload`).
- `a564bcc` — Bump Vite 5→8 (CVE fix: path traversal + `fs.deny` bypass в dev-сервере).
- `7ccecff` — Code-split ниже-первого-экрана секций через `React.lazy`/`Suspense` (Performance
  70, главный чанк 298КБ→272КБ).
- `b76da24` — Google Fonts CSS: блокирующий stylesheet → preload+swap.
- `abcef4b` — Добавлен `public/404.html` (Cloudflare Pages отдавал 200 на любой несуществующий
  путь).
- `ecaeb2b` — `Landing/REPORT.md`, документирующий этот проход.

## 2026-07-18 — Сессия 1: основной аудит

- `39e386b` — Полный SEO/CRO/perf/a11y/security аудит: SEO 91→100, Accessibility 71→100,
  Performance 56→73, CSP через sha256-хэши, убраны UI-баги (toast/CTA overlap, header
  breakpoint), удалены netlify.toml/vercel.json/мёртвый Tailwind-конфиг.
- `5198681` — Чистые URL для `/privacy-policy` и `/terms` (убран лишний redirect hop).
- `83641ae` — Добавлена система персистентной памяти проекта (`Память/`).
- `7db5fb8` — Подключён кастомный домен www.zhelezo.space (Namecheap API + Cloudflare Pages).
