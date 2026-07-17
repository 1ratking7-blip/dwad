# CasinoReferral — ZHELEZO Crypto Gaming

Партнёрский маркетинг-проект по продвижению BC.Game под брендом **ZHELEZO**: лендинг, контент-стратегия и аналитика.

## Структура репозитория

```text
├── Landing/      # Лендинг (React + TypeScript + Vite + Tailwind) — см. Landing/README.md
├── Scripts/      # Генератор контента для соцсетей (JS/Python)
├── Texts/        # Контент-стратегия и сгенерированные посты (Telegram, Twitter)
├── Banners/      # ТЗ на баннеры и креативы для дизайнера
├── Analytics/    # Маркетинговый анализ и A/B-гипотезы с их статусом реализации
├── Images/       # Графические ресурсы (заполняется дизайнером)
├── Videos/       # Видео-креативы (заполняется видеографом)
├── Assets/       # Общие ресурсы (шрифты, конфиги)
└── GEMINI.md     # Регламент и роль агента для этого проекта
```

## Текущий статус

Лендинг полностью реализован и собирается без ошибок (`Landing/`). Все 4 A/B-гипотезы из
`Analytics/HYPOTHESES.md` реализованы в коде. 30-дневный контент-план для Telegram/Twitter
сгенерирован в `Texts/Generated/`.

## Что нужно для запуска в продакшн

1. **Хостинг** — `Landing/vercel.json` и `Landing/netlify.toml` готовы для zero-config деплоя
   через Vercel или Netlify (нужен аккаунт/токен пользователя).
2. **Аналитика** — GA4 подключён (`G-0RLZ7LGT08`). Yandex Metrica опциональна — счётчик
   пока не заведён, блок закомментирован в `Landing/index.html`.
3. **CI** — `.github/workflows/build.yml` проверяет сборку лендинга при пуше (нужен GitHub-репозиторий).
4. **Медиа-креативы** — баннеры/видео по ТЗ из `Banners/CREATIVE_BRIEFS.md` (вне скоупа кода).
5. **Домен** — `zhelezo.io` проверен через RDAP и свободен на момент проверки (регистрация требует
   аккаунта у регистратора — Namecheap/Cloudflare Registrar/и т.п.).

## Разработка лендинга

```bash
cd Landing
npm install
npm run dev      # http://localhost:3000
npm run build    # production-сборка в dist/
```
