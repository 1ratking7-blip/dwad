# Лог автономных постов (news/SMM routine + fallback pool)

Формат строки: `YYYY-MM-DDTHH:MMZ | slug | message_id | краткое описание`

2026-07-22T17:29Z | manual-test-lucky-spin | 285 | ручная проверка отправки текстового поста (Lucky Spin, Day 2 из telegram_30day_calendar.txt), не через рутину
2026-07-26T06:23Z | cs2-season5-cache-premier | 290 | CS2 Season 5 патч: Cache в Premier вместо Overpass, переработка C4, новые скины/карты. Проверено через HLTV/dotesports/esports.gg/ghacks.

## 2026-07-26 (вечер) — Анонс обновления сайта
Опубликован альбом (message_id 291-293) с 3 реальными скриншотами live-сайта
(секция "Обо мне" с фото, секция "Миссия", страница соцсетей с живым Twitch) +
текст-анонс в стиле канала. Проверено copyMessage-трюком — реально в канале.
Текст: Scripts/posts/site_update_announcement.txt
