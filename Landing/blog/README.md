# Блог — как добавить новую статью

Статический многостраничный блог на том же Vite-билде, без React — чистый HTML/Tailwind для
максимальной crawlability (Bing/Yandex надёжнее индексируют статический HTML, чем
JS-рендеринг SPA). Стилизация переиспользует `src/index.css` через `blog/blog-entry.ts`.

## Чтобы добавить статью

1. Создать `blog/<slug>/index.html` (копировать структуру существующей статьи как шаблон:
   head с полным набором meta/OG/Twitter/canonical/Article schema.org, `<script type="module"
   src="../blog-entry.ts">` для стилей).
2. Добавить `<slug>` в `vite.config.ts` → `build.rollupOptions.input` (иначе Vite не соберёт
   и не задеплоит страницу — это единственный неочевидный шаг).
3. Добавить ссылку в `blog/index.html` (иначе страница будет orphan-страницей без внутренних
   ссылок — хуже индексируется).
4. Добавить `<url>` в `public/sitemap.xml`.
5. Реф-ссылка на BC.Game — с `&subId1=seo&subId2=<slug>` (схема трекинга по
   `Analytics/HYPOTHESES.md`), чтобы видеть, какая статья реально конвертит.
6. `npm run build` — проверить, что новая страница появилась в `dist/blog/<slug>/index.html`.

## Кандидаты на следующие статьи (см. `REPORT/GROWTH_PLAN.md`, раздел SEO)
- "BC.Game отзывы"
- "Crash игра стратегия" / "Plinko стратегия"
- "Криптовалюта казино без верификации" (No KYC)
