# CasinoReferral — ZHELEZO Crypto Gaming

Партнёрский маркетинг-проект по продвижению BC.Game под брендом **ZHELEZO**: лендинг, контент-стратегия и аналитика.

**Сайт запущен:** https://www.zhelezo.space (`zhelezo.space` редиректит на www; также доступен на https://zhelezo.pages.dev)
**Репозиторий:** https://github.com/1ratking7-blip/dwad

## Структура репозитория

```text
├── Landing/      # Лендинг (React + TypeScript + Vite + Tailwind) — см. Landing/README.md
│   └── blog/     # Статический блог (5 статей, отдельный от React-приложения) — см. Landing/blog/README.md
├── Scripts/      # Генератор контента для соцсетей (JS/Python) + Discord-бот
│   └── discord-bot/  # !spin/!bonus/!faq/!leaderboard — см. Scripts/discord-bot/README.md
├── SalesAgent/   # Внутренняя CRM для B2B-лидогенерации (продажа growth/SEO-консалтинга другим сайтам) — см. SalesAgent/docs/ARCHITECTURE.md
├── Texts/        # Контент-стратегия и готовые тексты под все каналы продвижения (Telegram, Twitter, bitcointalk, Quora, каталоги)
├── Banners/      # ТЗ на баннеры и креативы для дизайнера
├── Analytics/    # Маркетинговый анализ, A/B-гипотезы, реальный конкурентный анализ
├── Images/       # Графические ресурсы (заполняется дизайнером)
├── Videos/       # Видео-креативы (заполняется видеографом)
├── Assets/       # Общие ресурсы (шрифты, конфиги)
├── REPORT/       # Аудиты (Security/Performance/SEO/Bug), Growth Plan, Action Plan, TODO
├── Experts/      # Библиотека из 26 ролевых инструкций (SEO, Lawyer, Security, Backend...) для Claude Code
├── Память/       # Журнал сессий и накопленный контекст работы над проектом
├── GEMINI.md     # Регламент и роль агента для этого проекта
└── CLAUDE.md     # Регламент работы Claude Code + правила использования /Experts
```

## Текущий статус

Лендинг + блог (5 статей, `Landing/blog/`) задеплоены и доступны по адресу
**https://www.zhelezo.space** (кастомный домен на Cloudflare Pages, аккаунт
`1ratking7@gmail.com`, проект `zhelezo`). DNS домена управляется через Namecheap API (не
через Cloudflare-зону — apex не поддерживает нативный CNAME у внешнего DNS, поэтому основной
сайт живёт на `www`, а apex `zhelezo.space` настроен как 301-редирект на
`www.zhelezo.space` — HTTPS на самом apex пока не работает, см. TODO ниже). Все 4
A/B-гипотезы из `Analytics/HYPOTHESES.md` реализованы в коде, аналитика (GA4 + Yandex
Metrica) собирает данные с реальными ID. Google Search Console — плейсхолдер готов, ждёт
кода; Bing Webmaster и Яндекс.Вебмастер — подключены и верифицированы. Discord-бот
(`Scripts/discord-bot/`) реализован и проверен локально, не запущен (нужен токен + хостинг).
Полный набор готового контента под все одобренные каналы продвижения — в `Texts/` (см.
`REPORT/CONTENT_CALENDAR_30DAY.md` за сводным планом запуска).

Передеплой после изменений: `cd Landing && npm run deploy`.

## Что осталось

1. **Медиа-креативы** — баннеры/видео по ТЗ из `Banners/CREATIVE_BRIEFS.md`.
2. **CI** — `.github/workflows/build.yml` уже активен на GitHub, проверяет сборку при каждом пуше в `Landing/**`.
3. **Требует доступа/решения пользователя** (полный список — `REPORT/TODO.md`,
   `REPORT/ACTION_PLAN.md`): GSC-код, apex-домен HTTPS, PageSpeed API-ключ, партнёрская
   панель BC.Game (LTV/retention по subId — ключевой блокер приоритизации), Discord-токен,
   регистрация аккаунтов на GPWA/bitcointalk/Quora/X для публикации готового контента.

## Разработка лендинга

```bash
cd Landing
npm install
npm run dev      # http://localhost:3000
npm run build    # production-сборка в dist/
```
