# Reddit — контент-пакет

Подтверждено дважды (сессия `GROWTH_PLAN.md`, и повторно 2026-07-20 через веб-поиск по
актуальным правилам): прямые реферальные/аффилиат-ссылки в постах/комментариях r/gambling,
r/CryptoCurrency и похожих сабов **банятся модерацией почти everywhere**, часто с первого
поста. Общее правило Reddit — "10%-rule" (не больше 1 из 10 постов самопромо), у гемблинг-
сабов поверх этого свои, ещё более строгие anti-affiliate правила.

## Единственная безопасная модель
Образовательный контент **без бренда и без ссылки в теле поста/комментария**. Ссылка — только
в профиле (bio), и только если правила конкретного саба это разрешают (проверить перед первым
постом — правила саба, не общие правила Reddit). Публиковать под личным аккаунтом с реальной
историей других постов/комментариев в теме — свежий аккаунт с одним топиком "казино" выглядит
как spam-бот и банится быстрее.

## Куда постить
- r/CryptoCurrency (общие посты о механике, не о конкретной платформе)
- r/CasinoRoyaleDiscussion, r/onlinegambling — только если явно разрешают образовательный
  контент, проверить правила саба перед постингом
- НЕ r/gambling напрямую с чем-либо похожим на рекламу — самый строгий саб в нише

## Пост 1 — Provably Fair (образовательный, без бренда)
```text
Title: How Provably Fair verification actually works (the math, not the marketing term)

"Provably Fair" gets thrown around by every crypto casino's marketing, but most people never
actually check what it means. Here's the mechanism, no platform name attached:

1. Before you place a bet, the platform shows you a hash of its server seed. A hash is
   one-way — you can't reverse it to get the original seed, but once revealed, you can verify
   it matches.
2. You also supply a client seed (yours, or auto-generated), usually combined with an
   incrementing nonce that changes every bet.
3. The round result is derived deterministically from both seeds.
4. After the round, the server reveals its seed. Now you (or any independent verifier tool
   online) recompute the hash from step 1 and check it matches what was shown before your bet.
   If it matches, the operator couldn't have altered the outcome after seeing what you bet on.

What this DOESN'T prove: that the house edge/odds are good. It only proves the round wasn't
tampered with after the fact — two separate questions people often conflate. If a platform
shows Provably Fair badges but doesn't let you actually see/verify the seeds, that badge is
decorative, not functional.

Happy to walk through a live verification example if anyone wants to see one done on a real
round.
```
Без ссылки. Если кто-то в комментариях спросит "а на какой платформе ты это проверял" —
можно честно ответить с названием (BC.Game) без ссылки в тексте, ссылка только в профиле.

## Пост 2 — честный разбор No-KYC (для r/CryptoCurrency, образовательный угол)
```text
Title: What "No-KYC casino" actually means (and what it doesn't change)

Seeing more crypto casinos advertise "No KYC" and wanted to break down what that phrase
actually changes vs. what people assume it changes:

What it DOES mean: identity verification isn't required below a certain withdrawal
threshold — faster onboarding, no ID upload for casual play.

What it DOESN'T mean:
- Not automatically "unlicensed" — check the platform's actual gambling license
  independently (e.g. Curaçao registry) rather than assuming no-KYC = no oversight.
- Doesn't affect game fairness — that's a separate mechanism (Provably Fair, if the platform
  has it) with nothing to do with identity verification.
- Recovery options if something goes wrong (lost access, disputed withdrawal) are often more
  limited with less identity tied to the account — that's the real tradeoff, not "riskier
  games" or "shadier operator" by default.

TL;DR: no-KYC shifts where account-recovery risk sits, it's not a fairness or legitimacy
signal by itself. Check licensing and Provably Fair separately, on their own merits.
```
Без ссылки, без упоминания конкретной платформы, если не спросят напрямую.

## Правило по частоте
Максимум 1 пост в 1-2 недели на аккаунт, комментарии — по существу в чужих ветках, где вопрос
реально об этом (та же логика, что и Quora — искать реальные обсуждения, не создавать поводы
самому). Перед первым постом — прочитать правила конкретного саба (Community Rules в сайдбаре),
не полагаться на общий Reddit ToS.
