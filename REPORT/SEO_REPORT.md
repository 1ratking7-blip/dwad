# SEO Report — ZHELEZO Landing

Дата: 2026-07-18. Основной SEO-аудит и фиксы выполнены в предыдущей сессии (`39e386b`,
SEO 91→100 Lighthouse) — здесь свежая перепроверка + рост за пределы одностраничника
(см. также `REPORT/GROWTH_PLAN.md`, раздел "SEO-рост").

## Проверено в этой сессии — без регрессий

| Пункт | Статус |
|---|---|
| Lighthouse SEO | 100/100 (перепроверено локальным headless Lighthouse после всех правок этой сессии) |
| `robots.txt` | Присутствует, корректен (`Landing/public/robots.txt`) |
| `sitemap.xml` | Присутствует (`Landing/public/sitemap.xml`) |
| `canonical` | `<link rel="canonical" href="https://www.zhelezo.space/">` в `index.html` |
| OpenGraph | Полный набор (`og:type/site_name/locale/url/title/description/image` + размеры) |
| Twitter Cards | `summary_large_image` с title/description/image |
| Schema.org / JSON-LD | Organization + WebSite в `index.html`, FAQPage генерируется динамически из `FAQ.tsx` (5 вопросов) |
| Favicon/иконки | `favicon.svg`, `apple-touch-icon.png`, `icon-192/512/maskable-512.png`, `site.webmanifest` — все присутствуют |
| Alt-теги | Иконки (`lucide-react`) корректно помечены `aria-hidden="true"` там, где декоративны; текстовые лейблы — там, где несут смысл |
| Заголовки (h1-h2 структура) | Один `h1` (Hero), последовательные `h2` по секциям — иерархия корректна |
| Внутренняя перелинковка | Якорные ссылки на все секции (`#games`, `#faq`, `#how-it-works`, `#bonuses`) в Header/Footer |
| Индексация | `meta name="robots" content="index, follow, max-image-preview:large"` |

## Не закрыто — ждёт данных от пользователя

**Google Search Console verification** — заготовка meta-тега уже есть в `index.html`
(закомментирована), ждёт реального verification-кода из GSC. Без него нельзя подтвердить
владение доменом в Search Console и получить данные индексации/запросов напрямую от Google —
не то, что можно сделать без доступа к аккаунту GSC пользователя.

## Рекомендация: рост за пределы одностраничника

Подробности и конкретные ключевые запросы — см. `REPORT/GROWTH_PLAN.md`, раздел "SEO-рост".
Коротко: у одностраничного лендинга физически некуда расти в SEO дальше 100/100 Lighthouse —
следующий уровень органического роста требует контентных страниц (блог под конкретные запросы:
"BC.Game промокод", "BC.Game отзывы", "Provably Fair — как проверить", "Crash/Plinko
стратегия"). Это архитектурное решение (новый раздел сайта), не багфикс — не создаю сам без
явного запроса, но фиксирую как открытую возможность роста.

## Приоритеты

1. GSC verification — дайте код, вставлю и раскомментирую (1 минута работы с моей стороны).
2. Блог-раздел для SEO-роста — решение по объёму/срокам за вами, см. `GROWTH_PLAN.md`.
