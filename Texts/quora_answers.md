# Quora — контент-пакет

Дополняет `CONTENT_STRATEGY.md`. Одобрено в дополнении к `REPORT/GROWTH_PLAN.md` (сессия 4):
Quora официально сняла запрет на self-promotion, но банит как спам ответы, которые дают мало
пользы и в основном ведут трафик на коммерческий сайт. Модель та же, что для bitcointalk —
ценный ответ по существу, ссылка не в каждом посте и не как первая строчка.

## Правило по ссылке
Ссылка уместна только в ответах, где вопрос прямо об этом просит (например "какую платформу
посоветуете" или "как проверить конкретное казино"). В чисто образовательных ответах
(Provably Fair, KYC) — без ссылки вообще, ссылка размывает ценность ответа и увеличивает
шанс жалобы "spam: undisclosed promotion".

## Ответы на типовые вопросы (искать реальные вопросы с похожей формулировкой, не создавать вопросы самому)

### "How does Provably Fair gambling actually work?"
```text
Provably Fair lets you mathematically verify a game round wasn't altered after you placed
your bet, without needing to trust the operator's word.

Simplified flow:
1. Before the round, the platform shows you a hash (one-way, can't be reversed) of its
   server seed.
2. You provide a client seed (yours or auto-generated), often combined with an
   incrementing nonce.
3. The result is derived by combining both seeds through a deterministic function.
4. After the round, the server reveals its seed. You (or a third-party verifier tool)
   recompute the hash from step 1 — if it matches, the server couldn't have changed
   anything after seeing your bet.

Worth noting: this only proves the round wasn't tampered with after the fact. It says
nothing about whether the underlying odds/house edge are favorable — that's a separate
question worth checking independently (some platforms publish their edge %, some don't).
```

### "Are no-KYC crypto casinos safe / legit?"
```text
"No KYC" just means identity verification isn't required below a certain withdrawal
threshold — it's not automatically a red flag, but it shifts where the risk sits compared
to a KYC platform:

- Custody risk: since there's less identity tied to your account, recovery options if
  something goes wrong (lost access, disputed transaction) are often more limited.
- Regulatory standing still matters independently of KYC: check whether the platform
  actually holds a real gambling license (e.g. Curaçao) rather than assuming "no KYC" and
  "unlicensed" are the same thing — they're not.
- Provably Fair verification (see the explanation in the linked answer) is a separate,
  checkable signal of game integrity that has nothing to do with KYC policy.

If you want a specific example of a licensed no-KYC platform with Provably Fair games, BC.Game
is one I've used — https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist
(referral link, disclosed).
```

### "What's the best strategy for Crash/Aviator-style games?"
```text
There's no strategy that overcomes the house edge in Crash-style games — the edge is baked
into the multiplier distribution (early-bust probability is nudged above what a "fair"
exponential curve would produce). That said, common approaches players use to manage
variance rather than beat the math:

- Fixed cash-out multiplier (e.g. always cash at 2x) — lower variance, more consistent
  small wins, still negative EV long-run.
- Martingale-style bet doubling after a loss — higher risk of a large drawdown wiping the
  bankroll before a "win" recovers it; mathematically doesn't change the expected value,
  just redistributes variance.
- Setting a session loss limit before playing, not during — the only "strategy" with
  actual evidence behind it is bankroll/session management, not multiplier timing.
```

## Что не делать
- Не отвечать на вопросы, где ссылка не в тему — Quora удаляет и банит за "little value,
  mainly directing traffic" даже без формального запрета self-promotion.
- Не постить идентичный ответ под разными вопросами (спам-паттерн, детектируется модерацией).
- Не создавать сам вопросы под ответ (выглядит как накрутка, тот же риск, что "vote
  manipulation" в правилах площадки).
