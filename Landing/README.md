# ZHELEZO Crypto Gaming Landing Page

Этот проект представляет собой современный, высококонверсионный лендинг для продвижения партнерской программы BC.Game под брендом **ZHELEZO**.

**Живой сайт:** https://www.zhelezo.space (apex `zhelezo.space` редиректит на www; также доступен на https://zhelezo.pages.dev)
**Репозиторий:** https://github.com/1ratking7-blip/dwad

## Стек технологий
- **React 18** + **TypeScript**
- **Vite** (сверхбыстрая сборка)
- **Tailwind CSS** (стилизация и адаптивность)
- **Framer Motion** (анимации)
- **Lucide React** (иконки)

## Структура компонентов
- `Header.tsx` — Навигация и основной призыв к действию (CTA).
- `Hero.tsx` — Главный экран с уникальным торговым предложением (УТП).
- `LuckyWheel.tsx` — Интерактивное колесо фортуны на первом экране (A/B-гипотеза 1, см. `Analytics/HYPOTHESES.md`).
- `Games.tsx` — Витрина оригинальных игр (Crash, Plinko и др.).
- `HowItWorks.tsx` — Пошаговая воронка регистрации.
- `FAQ.tsx` — Ответы на популярные вопросы с SEO-оптимизацией.
- `UrgencyTimer.tsx` — Таймер обратного отсчёта, синхронизированный с 24-часовым окном Daily Lucky Spin.
- `SocialProof.tsx` — Виджет с иллюстративными примерами выигрышей (подписан как "Пример
  выигрыша", не как реальные live-данные — см. `REPORT/BUG_REPORT.md`, GEMINI.md п.8).
- `ErrorBoundary.tsx` — React error boundary, репортит ошибки в GA4/Metrica как `client_error`
  через `lib/monitoring.ts` (без него любое исключение рендера показывало бы посетителю пустой
  экран без пути к реф-ссылке).
- `Footer.tsx` — Подвал с контактами, дисклеймерами и ссылкой на блог.
- `lib/analytics.ts` — Единая точка отправки событий (`page_view`, `wheel_spin`, `cta_click`, `faq_expand`) в GA4 / Yandex Metrica / dataLayer.
- `lib/links.ts` — Единая реферальная ссылка (`REF_LINK`) и хелпер `refLinkWithSubId` для меток атрибуции.
- `lib/monitoring.ts` — Глобальные обработчики `window.onerror`/`unhandledrejection` + репортинг из `ErrorBoundary`.

## Блог
`blog/` — статический многостраничный раздел (5 статей), отдельный от React-приложения:
чистый HTML/Tailwind без гидратации, для надёжной индексации Bing/Yandex. См. `blog/README.md`
за структурой и инструкцией по добавлению новой статьи.

## Инструкция по запуску
1. Перейдите в папку проекта: `cd Landing`
2. Установите зависимости: `npm install`
3. Запустите режим разработки: `npm run dev`
4. Для сборки проекта в продакшн: `npm run build`

## Деплой
Хостится на Cloudflare Pages (проект `zhelezo`, аккаунт `1ratking7@gmail.com`).
Передеплой одной командой:
```bash
npm run deploy
```
Требует авторизации `wrangler` (`npx wrangler login`), уже выполнена на этой машине —
токен хранится в `~/.wrangler/config/default.toml`.

### Домен
`www.zhelezo.space` подключён как custom domain в Cloudflare Pages (CNAME → `zhelezo.pages.dev`,
настроен через Namecheap API). Apex `zhelezo.space` не может напрямую использовать custom domain
Cloudflare Pages, так как DNS-зона домена не на Cloudflare (apex требует либо Cloudflare-зону,
либо буквальную CNAME-запись, которую большинство регистраторов, включая Namecheap, не позволяют
поставить на `@`). Поэтому apex настроен как 301-редирект (Namecheap URL Record) на
`https://www.zhelezo.space`.

## Настройка аналитики
GA4 (`G-0RLZ7LGT08`) и Yandex Metrica (`110820422`) подключены реальными ID в `index.html` — события уходят в обе системы.

## Цветовые темы (A/B-гипотеза 2)
Лендинг поддерживает два визуальных варианта, определённых как CSS-переменные в `src/index.css`:
- `cyberpunk` (по умолчанию) — неоновый зелёный на тёмно-сером.
- `web3` — золото на глубоком фиолетовом.

Переключение — параметром URL: `?theme=web3` или `?theme=cyberpunk`. Выбор сохраняется в `localStorage`, поэтому реф-ссылки для разных сегментов трафика можно направлять на нужный вариант без дублирования лендинга.

## SEO и Маркетинг
- Все тексты оптимизированы под ключевые запросы (BC.Game, бонусы, крипто-казино).
- Настроены мета-теги и Open Graph для корректного отображения в соцсетях.
- Использована психология цвета (неоновый зеленый на темном фоне) для повышения доверия и вовлеченности.
