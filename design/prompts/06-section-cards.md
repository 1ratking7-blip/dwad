# 06 — Набор мини-сцен для карточек разделов

## Назначение
Единый стиль иллюстраций для карточек `Games.tsx`/`HowItWorks.tsx` и похожих секций —
заменяет/дополняет текущие lucide-иконки более "предметными" мини-сценами.

## Формат
- Общий холст: **3:2** со спрайт-сеткой 3×2 (6 тайлов), каждый тайл — отдельный **4:3** кадр
  внутри общей сетки (после генерации — нарезать на 6 отдельных файлов).
- Минимальное разрешение тайла: 1600×1200.
- Экспорт: WebP/AVIF, тёмный или прозрачный фон.
- Negative space: 10% внутри каждого тайла (под наложение иконки/подписи при необходимости).

## Prompt (English)
```
A cohesive set of 6 dark premium miniature product-style scenes, arranged as a 3x2 sprite
sheet, each tile a self-contained 4:3 composition on a near-black or transparent
background: (1) a glowing emerald-lit metallic growth chart/graph, (2) an abstract
digital token/coin made of brushed metal and glass, (3) a generic unbranded car dashboard
speedometer detail glowing at night, (4) a metallic shield/lock representing security,
(5) a lightning bolt made of brushed chrome and emerald light representing speed, (6) a
generic unbranded game controller silhouette with emerald accent lighting. Single
consistent top key light plus soft rim light across all six tiles, same line weight and
corner radius, same lens/depth of field. Color palette: near-black #0A0D12 background,
steel #2C3138, chrome highlights #C9D2DD, emerald #00C879, gold #D6B35E accents.
Photorealistic macro product rendering, dark premium editorial style, consistent across
all tiles.
No real brand logos, no watermarks, no readable text — entirely generic shapes only.
```

## Параметры
- **Свет**: единый верхний ключевой свет + мягкий контровой, хром-блики.
- **Палитра**: `#0A0D12`, `#2C3138`, `#C9D2DD`, `#00C879`, `#D6B35E`.
- **Детализация**: фотореалистичные мини-сцены, единый стиль контуров/радиусов.
- **Без брендов**: да.
- **Место под текст**: 10% внутри каждого тайла.
- **Стиль**: тёмный премиальный, стекло/металл.
