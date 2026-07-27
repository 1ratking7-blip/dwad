# 01 — Hero: премиальный спортивный автомобиль

## Назначение
Главное изображение первого экрана (`Hero.tsx`), средний план композиции — справа от
заголовка/CTA. Сейчас на этом месте CSS/SVG-заглушка (`LuxuryCar.tsx`).

## Формат
- Соотношение сторон: **16:9** (fallback) или **21:9** (предпочтительно, для полноширинного hero).
- Минимальное разрешение: 3360×1440 (21:9) / 2560×1440 (16:9).
- Экспорт: WebP (качество 82–88) + AVIF, без альфа-канала.
- Negative space: **35–40% слева** — под H1/subtitle/CTA, ничего важного по композиции в этой зоне.

## Prompt (English)
```
Ultra-detailed cinematic photo of a generic unbranded dark sports car, 3/4 front angle,
low camera angle, positioned on the right side of the frame with 35-40% empty negative
space on the left. Wet asphalt reflections beneath the car. Blurred dark city skyline in
deep fog in the background. Backlit from behind-right with soft emerald-green rim light
tracing the car's body edges, warm amber fill light on the hood. Color palette: near-black
#0A0D12 background, graphite #1B1F26 and steel #2C3138 metal tones, chrome highlights
#C9D2DD, emerald accent #00C879 and #0A7A5A, gold #D6B35E and amber #FFB24C used sparingly
on reflections only. Glass and gloss surface finish, volumetric fog, cinematic lighting,
shallow depth of field, subtle film grain, photorealistic, 8k detail.
No real car brand logos, no badges, no emblems, no license plates, no readable text,
no watermarks — completely generic/fictional car design.
```

## Параметры
- **Свет**: контровой (backlight) справа-сзади + мягкий фронтальный fill, изумрудный рим-лайт по кромкам кузова.
- **Палитра**: `#0A0D12`, `#1B1F26`, `#2C3138`, `#C9D2DD`, `#00C879`, `#0A7A5A`, `#D6B35E`, `#FFB24C`.
- **Детализация**: фотореализм, 8k, шум плёнки 2–4%.
- **Без брендов**: да, обязательно — ни одного узнаваемого элемента дизайна кузова/лого.
- **Место под текст**: 35–40% слева, свободно от объектов.
- **Стиль**: тёмный премиальный, кинематографический свет, стекло/глянец.
