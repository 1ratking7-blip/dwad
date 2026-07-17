# Summary — текущее состояние проекта

*Обновлено: 2026-07-18*

## Проект
ZHELEZO Crypto Gaming — партнёрский лендинг под BC.Game.
Домен: **https://www.zhelezo.space** (Cloudflare Pages, проект `zhelezo`, аккаунт `1ratking7@gmail.com`).
Репозиторий: https://github.com/1ratking7-blip/dwad
Стек: React + TypeScript + Vite + Tailwind, деплой `cd Landing && npm run deploy`.

## Текущее состояние (после аудита 2026-07-18)
Полный аудит и рефакторинг лендинга выполнен и задеплоен на прод:

- **SEO**: 91 → 100 (Lighthouse). robots.txt, sitemap.xml, manifest, реальные favicon/OG-картинка, canonical, Schema.org (Organization + WebSite), fix домена в схеме.
- **Accessibility**: 71 → 100. ARIA на меню/FAQ, контраст текста, порядок заголовков, prefers-reduced-motion, живые Privacy/Terms страницы.
- **Performance**: 56 → 73. Исправлен шрифт (font-black=900 не грузился), dns-prefetch вместо лишних preconnect.
- **Security**: полноценный CSP через `public/_headers` (sha256-хэши инлайн-скриптов, не unsafe-inline), rel=noopener на всех target=_blank, X-Frame-Options/Referrer-Policy/Permissions-Policy.
- **UI/UX**: убран баг с перекрытием CTA/футера плавающим тостом, исправлена поломка шапки на 768px, убраны мёртвые hover-эффекты и вечная анимация логотипа.
- Удалены неиспользуемые netlify.toml/vercel.json (деплой только Cloudflare Pages), мёртвый Tailwind-конфиг.
- Ссылки на Privacy/Terms переведены на чистые URL без .html (без лишнего редиректа).

**Best Practices остался 77/100** — не баг, это собственные cookie Яндекс.Метрики (было так и до аудита).

## Последние коммиты
- `39e386b` — основной аудит (28 файлов)
- `5198681` — чистые URL для /privacy-policy и /terms

Оба запушены в `origin/main` и задеплоены на прод. Всё проверено напрямую на живом домене через curl (заголовки, CSP, новые файлы).

## Что дальше (см. todo.md)
- Реальный прогон PageSpeed Insights на проде (я тестировал локально — числа FCP/LCP шумные)
- Медиа-креативы (баннеры/видео) — вне скоупа кода, см. Banners/CREATIVE_BRIEFS.md
- ID для Meta Pixel / TikTok Pixel / Microsoft Clarity — заготовки в index.html есть, ждут реальных ID
- GSC verification meta-тег — заготовка есть, ждёт кода из Google Search Console

## Как продолжить работу с этой памятью
1. Прочитать этот файл (summary.md)
2. Прочитать todo.md
3. При необходимости — index.md → нужная сессия в sessions/
