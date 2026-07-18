# X (Twitter) — органический контент-микс

Дополняет `Generated/twitter_var_1.txt`, `twitter_var_2.txt` и `twitter_30day_calendar.txt` —
те файлы чисто промо (каждый твит = CTA на реф-ссылку). `REPORT/GROWTH_PLAN.md` отмечает риск:
аккаунт, где 100% контента — промо-ссылка, читается как spam-бот и хуже ранжируется/чаще
шэдоубанится. Ниже — контент для интервала *между* промо-твитами, без ссылки вообще.

Рекомендуемая пропорция: на каждый 1 промо-твит — 2-3 твита отсюда.

## Треды (разбор без промо)

### Тред 1 — как проверить Provably Fair самому
```
1/ "Provably Fair" gets thrown around a lot in crypto gaming. Most people never actually
verify it. Here's the 60-second version of how the math works 🧵

2/ Before you bet, the platform shows you a hash of its server seed. A hash is one-way —
you can't reverse it to get the seed, but once revealed, you can check it matches.

3/ You also supply a client seed (yours, or auto-generated). The round result comes from
combining both seeds + a nonce that increments each bet.

4/ After the round, the server reveals its seed. Now you (or a verifier tool) recompute
the hash from step 1 and check it matches. If it does — the server couldn't have changed
the outcome after seeing your bet.

5/ What this DOESN'T prove: that the odds/house edge are good. It only proves the result
wasn't tampered with after the fact. Two separate questions — worth not conflating them.
```

### Тред 2 — Crash-игра, математика мультипликатора
```
1/ Crash games look chaotic but the multiplier curve is deliberately shaped. Quick
breakdown of why the house edge lives in the curve, not in "rigging" 🧵

2/ If busts were purely exponential/fair, expected value would be neutral. Instead the
early-bust probability is nudged up slightly — that's where the edge comes from.

3/ This is orthogonal to Provably Fair verification (see previous thread) — a game can be
100% verifiably un-tampered-with and still have a house edge baked into the curve shape.
Both things are true at once.
```

## Одиночные твиты (без ссылки)

```
Hot take: "no KYC" crypto casinos aren't inherently sketchier than KYC ones — they just
shift where the risk sits (custody/withdrawal limits vs identity exposure). Different
tradeoff, not automatically worse.
```

```
Every crash game colors below 2x differently, above 2x differently — but they're the same
probability curve wearing different UI paint. Compare the actual house edge % if a platform
publishes it, not the color scheme.
```

```
The most underrated crypto casino feature isn't the bonus %, it's whether you can withdraw
at 3am on a Sunday without a support ticket. Test that before you judge a platform on
marketing copy.
```

## Мемы (концепции для дизайнера/видеографа)

- "Waiting for KYC approval" vs "already cashed out" — split-image meme, no-KYC crypto casino
  vs traditional online casino withdrawal flow.
- "Me explaining Provably Fair to my friend at 2am" — standard crypto-Twitter reaction-meme
  format, punchline about hash verification being simpler than it sounds.

## Правило по ссылке
Ссылка на BC.Game — только в bio аккаунта и в отдельных промо-твитах (уже готовы в
`Generated/twitter_var_*.txt`), не в тредах/твитах этого файла.
