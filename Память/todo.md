# Todo

*Обновлено: 2026-07-18*

## Активные задачи (требуют доступа/решения пользователя — см. REPORT/TODO.md за полным списком)
- Apex-домен `zhelezo.space` не открывается по HTTPS — нужен доступ к DNS (Namecheap/Cloudflare)
- PageSpeed Insights API-ключ или ручной прогон pagespeed.web.dev — для авторитетного Performance-балла
- Google Search Console verification-код — заготовка готова в index.html
- Решение по `SocialProof.tsx` (фабрикованные "live wins") — пометить как иллюстративные или подключить реальные данные
- Партнёрская панель BC.Game — проверить наличие LTV/retention-отчётов по subId

## В процессе
_(пусто)_

## Выполнено (2026-07-18, сессия 3 — "Autonomous CTO + Security + Growth")
- Полный повторный аудит: зависимости (`npm audit` чисто), CI (все прогоны success), CSP-хэши в синхроне, секреты в истории — нет
- Найден и исправлен реальный баг: `LuckyWheel.tsx` setTimeout без cleanup
- UX-фикс: Footer social-иконки → `disabled button` вместо мёртвых ссылок
- Добавлен ErrorBoundary + client-side error reporting в GA4/Metrica
- Написан `REPORT/` с полным комплектом отчётов (Security/Performance/Bug/SEO/Growth/TODO/Changelog)
- 3 коммита запушены и задеплоены на прод, проверено через curl с cache-busting

## Выполнено (2026-07-18, сессия 2 — второй проход аудита)
- HSTS, CVE-фикс vite 5→8, code-splitting, non-blocking fonts, custom 404 — см. `Landing/REPORT.md`

## Выполнено (2026-07-18, сессия 1 — основной аудит)
- Полный SEO/CRO/perf/a11y/security аудит лендинга
- Коммит + пуш + деплой на прод (дважды)
- Проверка живого домена curl'ом

## Отложено
- Медиа-креативы (баннеры/видео) — ждут дизайнера/видеографа, см. `Banners/CREATIVE_BRIEFS.md`. Вне скоупа кода.
- Подключение Meta Pixel / TikTok Pixel / Microsoft Clarity — код-заготовки готовы, нужны реальные ID
- Блог-раздел для SEO-роста — новый раздел сайта, решение по объёму за пользователем (см. GROWTH_PLAN.md)

## Удалённые задачи
_(пусто)_
