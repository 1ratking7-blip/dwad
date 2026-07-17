# CasinoReferral — ZHELEZO Crypto Gaming

Партнёрский маркетинг-проект по продвижению BC.Game под брендом **ZHELEZO**: лендинг, контент-стратегия и аналитика.

**Сайт запущен:** https://zhelezo.pages.dev (Cloudflare Pages)

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

Лендинг задеплоен и доступен по адресу **https://zhelezo.pages.dev** (Cloudflare Pages,
аккаунт `1ratking7@gmail.com`, проект `zhelezo`). Все 4 A/B-гипотезы из
`Analytics/HYPOTHESES.md` реализованы в коде, аналитика (GA4 + Yandex Metrica) собирает
данные с реальными ID. 30-дневный контент-план для Telegram/Twitter сгенерирован в
`Texts/Generated/`.

Передеплой после изменений: `cd Landing && npm run deploy`.

## Что осталось (вне скоупа кода)

1. **Домен** — `zhelezo.space` зарегистрирован и подключён как custom domain к Cloudflare
   Pages, но ждёт DNS-записи у регистратора (Namecheap): нужна ALIAS/CNAME-запись
   `@ → zhelezo.pages.dev`. До этого шага сайт доступен только по `zhelezo.pages.dev`.
2. **Медиа-креативы** — баннеры/видео по ТЗ из `Banners/CREATIVE_BRIEFS.md`.
3. **CI** — `.github/workflows/build.yml` готов, но требует пуша в GitHub-репозиторий,
   чтобы реально запускаться (авторизация `gh` в процессе).

## Разработка лендинга

```bash
cd Landing
npm install
npm run dev      # http://localhost:3000
npm run build    # production-сборка в dist/
```
