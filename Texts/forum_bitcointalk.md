# BitcoinTalk / крипто-форумы — контент-пакет

Дополняет `CONTENT_STRATEGY.md`. Канал одобрен в `REPORT/GROWTH_PLAN.md` как средне-высокий
приоритет — но специфика площадки требует **не спамить ссылкой**, а строить историю аккаунта.

## Правила площадки (bitcointalk.org, раздел Gambling)

- Ссылка живёт в подписи форума, не в теле постов.
- Новый аккаунт с нулевой историей и сразу постом с реф-ссылкой = мгновенный бан модераторами
  раздела. Сначала 15-20 содержательных постов без ссылки вообще (участие в чужих темах).
- Подпись подключается только после того, как ранг аккаунта позволяет (обычно Jr. Member,
  обычно от ~30 постов) — до этого момента ссылку никуда не вставлять.

## Подпись форума (после разблокировки)

```text
[b][url=https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist]BC.Game[/url][/b] — Provably Fair Crypto Casino | 360% Welcome Bonus | Daily Free Spin | Instant Payouts
```

Короткий вариант (некоторые разделы форума ограничивают размер подписи):

```text
[url=https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist]BC.Game — Provably Fair Casino, 360% Bonus[/url]
```

## Шаблоны содержательных постов (без ссылки в теле, для набора истории/кармы)

### Пост 1 — объяснение Provably Fair (образовательный, универсальный для любого крипто-треда)
```text
Title: How does Provably Fair actually work? (breakdown for anyone new to crypto gaming)

Provably Fair is a verification scheme that lets a player mathematically prove a game round
wasn't rigged, without trusting the operator. Short version:

1. Before the round, the server commits to a secret seed and shows you its SHA-256 hash
   (the "server seed hash") — so it can't change the seed after seeing your bet.
2. You (the client) provide your own seed, often combined with a nonce that increments
   each round.
3. The round result is derived from combining both seeds through a deterministic hash
   function.
4. After the round, the server reveals the original seed. You (or any third-party verifier
   tool) recompute the hash and confirm it matches what was shown before the round —
   proving the server didn't change anything after your bet.

Any casino claiming "Provably Fair" without a public verifier/recompute step is just using
the term as marketing. Worth checking that a platform's verify tool is actually independent
before trusting the label.
```

### Пост 2 — Crash-механика (математика, без промо)
```text
Title: Crash game math — why the house edge is baked into the multiplier curve, not the seed

A lot of new players think Crash is "riggable" because the multiplier looks random. It's not
riddable if Provably Fair is implemented correctly (see the verification thread above) — the
house edge instead comes from how the multiplier distribution is shaped: the probability of
busting early is deliberately higher than a "fair" exponential curve would produce, which is
what generates the operator's edge over a large sample. Verifying fairness only proves the
seed wasn't tampered with — it says nothing about whether the odds are favorable to you.
Worth separating these two questions when evaluating any Crash-style game.
```

### Пост 3 — сравнение подходов к выводу средств (обзорный, не рекламный)
```text
Title: What actually varies between crypto casino withdrawal flows

Comparing a few platforms I've used — the meaningful differences aren't "fast vs slow"
marketing claims, they're:
- Whether there's a manual review step for withdrawals above a threshold (adds hours/days)
- Whether the platform supports the token natively or routes through an internal
  conversion (extra fee, extra step)
- Whether KYC is required only above a withdrawal threshold or from account creation
Happy to compare notes if others have data points on specific platforms.
```

## Календарь набора истории аккаунта (2-3 недели)

Важно: это план ПО ТИПАМ активности и разделам, а не готовые посты на каждый день — ветки на
форуме существуют независимо от нас, отвечать нужно в реальные существующие темы, а не
постить в пустоту. Фабриковать вопросы/темы самому — это тот же риск, что и накрутка (см.
`quora_answers.md`, раздел "Что не делать").

**Неделя 1 (0 → ~7 постов, ссылки нигде нет)**
- Дни 1-2: зарегистрироваться, заполнить профиль (без ссылок), прочитать правила раздела
  Gambling на bitcointalk.org.
- Дни 3-7: найти 5-7 активных тем в разделах "Gambling" и "Crypto Currency Discussion", где
  реально спрашивают про Provably Fair / честность крипто-казино / выбор платформы — ответить
  по существу, используя факты из Постов 1-3 ниже как основу (переформулировать под конкретный
  вопрос, не копировать один в один).

**Неделя 2 (~7 → ~18 постов)**
- Продолжать отвечать в тех же разделах, 2-3 поста в день на активных ветках.
- Начать самому создавать содержательные (не рекламные) темы, если позволяет правила раздела:
  например, тема-разбор "Crash game math" (Пост 2 ниже) как отдельный топик, не только ответ.
- Следить за рангом аккаунта (обычно виден в профиле/под ником) — переход к Jr. Member обычно
  открывает подпись.

**Неделя 3 (~18-30 постов, подпись подключается по достижении ранга)**
- Как только ранг позволяет — подключить подпись (варианты ниже).
- Дальше — 3-5 содержательных постов/неделю на постоянной основе, ссылка остаётся только в
  подписи, не дублировать в тексте поста (иначе выглядит как реклама, а не подпись).

## Варианты подписи (5-7, разные форматы/длина под разные разделы)

Некоторые разделы форума ограничивают длину/форматирование подписи — держите под рукой
несколько вариантов.

**1. Полный, с bold:**
```text
[b][url=https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist]BC.Game[/url][/b] — Provably Fair Crypto Casino | 360% Welcome Bonus | Daily Free Spin | Instant Payouts
```

**2. Короткий:**
```text
[url=https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist]BC.Game — Provably Fair Casino, 360% Bonus[/url]
```

**3. Акцент на no-KYC:**
```text
[url=https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist]BC.Game — No-KYC Crypto Casino, Provably Fair Games[/url]
```

**4. Акцент на игры:**
```text
[url=https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist]Crash, Plinko, Hash Dice — Provably Fair on BC.Game[/url]
```

**5. Минималистичный (для строгих по длине разделов):**
```text
[url=https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist]BC.Game[/url] — Provably Fair
```

**6. С emoji-акцентом (где разрешено форматирование):**
```text
🎲 [url=https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist]BC.Game[/url] — Provably Fair Crypto Gaming
```

**7. Вопрос-приманка (для разделов, где такой стиль уместен):**
```text
Verified your casino's fairness lately? [url=https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist]BC.Game[/url] — Provably Fair, 360% bonus
```

## Порядок действий (кратко)
1. Завести аккаунт, 2-3 недели участвовать в существующих темах (см. календарь выше).
2. Как только ранг позволяет — подключить подпись (варианты выше).
3. Публиковать по 3-5 содержательных постов/неделю, ссылка остаётся только в подписи.
4. Трекать клики через `subId1=bitcointalk` (схема уже описана в `Analytics/HYPOTHESES.md`).
