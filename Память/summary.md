# Summary — текущее состояние проекта

*Обновлено: 2026-07-18*

## Проект
ZHELEZO Crypto Gaming — партнёрский лендинг под BC.Game.
Домен: **https://www.zhelezo.space** (Cloudflare Pages, проект `zhelezo`, аккаунт `1ratking7@gmail.com`).
Репозиторий: https://github.com/1ratking7-blip/dwad
Стек: React + TypeScript + Vite + Tailwind, деплой `cd Landing && npm run deploy`.

## Текущее состояние (после двух проходов аудита, последний — 2026-07-18)

**Первый проход (`39e386b`)**: SEO 91→100, Accessibility 71→100, Performance 56→73, полноценный CSP
(`public/_headers`, sha256-хэши инлайн-скриптов), убраны UI-баги (перекрытие CTA/футера тостом,
поломка шапки на 768px, мёртвые hover/анимации), убраны netlify.toml/vercel.json/мёртвый Tailwind-конфиг,
чистые URL для /privacy-policy и /terms.

**Второй проход (`377c754`..`ecaeb2b`, см. `Landing/REPORT.md` за деталями)**:
- HSTS добавлен (`max-age=63072000; includeSubDomains; preload`)
- CVE в vite/esbuild (dev-server-only path traversal) закрыты апгрейдом vite 5→8
- Код-сплиттинг ниже первого экрана (LuckyWheel/Games/HowItWorks/FAQ/Footer через React.lazy) — главный чанк 298КБ→272КБ
- Google Fonts CSS переведён с блокирующего `<link rel=stylesheet>` на preload+swap
- Добавлен настоящий `public/404.html` (Cloudflare Pages раньше отдавал 200+index.html на любой несуществующий путь)
- Проверено и признано чистым: XSS/секреты/дубли-код/битые ссылки/CORS — см. REPORT.md
- **Честная оговорка от прошлой сессии**: локальный Lighthouse в этой песочнице даёт Performance ~70,
  но 85% "Script Evaluation" времени помечено Unattributable — не наш JS, а особенности headless-среды.
  Рекомендовали перепроверить на pagespeed.web.dev вместо доверия локальным цифрам.

**Не исправлено (нужен доступ, которого нет в проекте)**: голый домен `zhelezo.space` (без www) не
открывается по HTTPS — таймаут; по HTTP редиректит на www нормально. Нужен доступ к Namecheap/Cloudflare
DNS API, которого нет ни в `.env`, ни в `Память/context.md`.

## Последние коммиты
- `39e386b` — основной аудит (28 файлов)
- `5198681` — чистые URL для /privacy-policy и /terms
- `83641ae` — система памяти (Память/)
- `377c754` `a564bcc` `7ccecff` `b76da24` `abcef4b` — второй проход (HSTS/CVE/perf/404), см. выше
- `ecaeb2b` — `Landing/REPORT.md` документирующий второй проход

Все запушены в `origin/main` и задеплоены на прод.

## Что дальше (см. todo.md)
Активная сессия 2026-07-18 (после этой записи) — расширенный мандат "Autonomous CTO + Security +
Growth": живой PageSpeed Insights через публичный API, свежий security/deps sweep, UX/UI, добавление
мониторинга/error-reporting, growth/маркетинг-план, финальные отчёты в `REPORT/`. См. todo.md.

Отложено (не в скоупе кода):
- Медиа-креативы (баннеры/видео) — вне скоупа кода, см. Banners/CREATIVE_BRIEFS.md
- ID для Meta Pixel / TikTok Pixel / Microsoft Clarity — заготовки в index.html есть, ждут реальных ID
- GSC verification meta-тег — заготовка есть, ждёт кода из Google Search Console
- Apex-домен HTTPS — ждёт доступа к DNS (Namecheap API-токен или перенос зоны на Cloudflare)

## Как продолжить работу с этой памятью
1. Прочитать этот файл (summary.md)
2. Прочитать todo.md
3. При необходимости — index.md → нужная сессия в sessions/
