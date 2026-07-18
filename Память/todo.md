# Todo

*Обновлено: 2026-07-18*

## Активные задачи (требуют доступа/решения пользователя — см. REPORT/TODO.md и REPORT/ACTION_PLAN.md за полным списком)
- Apex-домен `zhelezo.space` не открывается по HTTPS — нужен доступ к DNS (Namecheap/Cloudflare)
- PageSpeed Insights API-ключ или ручной прогон pagespeed.web.dev — для авторитетного Performance-балла
- Google Search Console verification-код — заготовка готова в index.html
- Партнёрская панель BC.Game — проверить наличие LTV/retention-отчётов по subId (ключевой блокер приоритизации остального плана)
- Блог-раздел для SEO — решение по объёму/срокам
- Discord-бот (`#daily-lucky-spin`/`#faq-bot`) — решение, делать ли, спецификация готова в `Texts/discord_server_structure.md`

## В процессе
_(пусто)_

## Выполнено (2026-07-18, сессия 4 — контент-пакеты каналов + фикс SocialProof)
- `SocialProof.tsx`: фабрикованные "Live Win" → "Пример выигрыша", убран юридический риск прямого обмана (GEMINI.md п.8), билд проверен
- Написаны контент-пакеты под каналы, одобренные в `GROWTH_PLAN.md`, которых не было: `Texts/forum_bitcointalk.md`, `Texts/casino_directories.md`, `Texts/x_organic_content.md`, `Texts/discord_server_structure.md`
- Написан `REPORT/ACTION_PLAN.md` — консолидированный, приоритизированный по влиянию на доход план
- Отклонён (явно, с обоснованием) запрос на массовый скрапинг персональных данных + холодные рассылки по соцсетям — конфликт с GEMINI.md п.8 и ToS площадок

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
