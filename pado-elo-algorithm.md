# Pado.app Padel Rating Algorithm (Reverse-Engineered)

Source: "FINAL INTERMEDIATE" Americano tournament, Warsaw
(https://pado.app/poland/warsaw/tournaments/final-intermediate-4834)

Data used: 20 players, 90 scheduled matches (45 played at time of analysis),
pulled from the tournament's internal API (`api.pado.app/tournament/4834/matches`),
which exposes each match's score and the exact rating points (`change_rating`)
awarded/deducted to each pair. By reconstructing each player's rating history
match-by-match (working backward from their current rating using the recorded
deltas), the pre-match rating of every pair for every match could be recovered,
which made it possible to fit the underlying formula. The fitted model
reproduces the platform's actual rating change for **all 45 played matches
exactly**.

## Summary

Pado uses a **team-based Elo rating system with a margin-of-victory bonus**,
applied per Americano match (fixed partners for that match, 2v2).

Both players on a pair always receive the *same* rating change for a given
match — the change is computed once per pair, not per individual.

## Formula

For a match between Pair A (players with ratings `Ra1`, `Ra2`) and
Pair B (ratings `Rb1`, `Rb2`):

1. **Team ratings** — simple average of the two partners' current ratings:
   ```
   TeamA = (Ra1 + Ra2) / 2
   TeamB = (Rb1 + Rb2) / 2
   ```

2. **Expected score** (standard Elo logistic curve, divisor 400):
   ```
   ExpectedA = 1 / (1 + 10 ^ ((TeamB - TeamA) / 400))
   ExpectedB = 1 - ExpectedA
   ```

3. **Actual result** — binary, based on who won the match (NOT the point
   margin of the score):
   ```
   ActualA = 1.0  if ScoreA > ScoreB
           = 0.5  if ScoreA == ScoreB (tie)
           = 0.0  if ScoreA < ScoreB
   ```

4. **K-factor with a margin-of-victory bonus** — the bigger the winning
   margin, the larger the rating swing. The margin bonus is capped once the
   score difference reaches 5:
   ```
   margin  = min(|ScoreA - ScoreB|, 5)
   K       = 20 + 9.6 * margin
   ```
   So K ranges from **20** (a 1-point win, e.g. 3-2, or a tie) up to a cap of
   **~68** for any match decided by 5 or more points (e.g. 5-0, 6-1, 0-6 all
   use the same max K).

5. **Rating change** (rounded to the nearest integer), applied identically
   to both members of the pair:
   ```
   ΔA = round(K * (ActualA - ExpectedA))
   ΔB = -ΔA
   ```

## Worked examples (from real tournament data)

| Match | Team A avg | Team B avg | Score | Margin | K | Expected A | Actual A | Δ rating |
|---|---|---|---|---|---|---|---|---|
| 1 | 1302.5 | 1288.0 | 4-2 | 2 | 39.2 | 0.521 | 1.0 | +19 |
| 2 | 1367.0 | 1381.0 | 3-2 | 1 | 29.6 | 0.480 | 1.0 | +15 |
| 3 | 1416.5 | 1247.0 | 4-3 | 1 | 29.6 | 0.726 | 1.0 | +8 |
| 4 | 1412.0 | 1428.5 | 6-1 | 5 | 68.0 | 0.476 | 1.0 | +36 |
| 5 | 1193.0 | 1375.0 | 0-6 | 5 (capped) | 68.0 | 0.260 | 0.0 | -18 |
| 6 (tie) | 1403.0 | 1392.5 | 3-3 | 0 | 20.0 | 0.515 | 0.5 | 0 |

## Key takeaways

- **It's Elo, not points-based.** Winning 6-5 counts the same (margin=1) as
  winning 3-2 for K-factor purposes — only who won matters for the "actual
  score" term, not how many points were scored in total. The score margin
  only scales the *size* of the K-factor, it does not feed into the expected
  value or the "actual" result directly.
- **Underdogs who win big move more.** Beating a much stronger team by a
  wide margin produces the largest possible rating gains (high K from the
  margin bonus combined with a low expected-score base).
- **Favorites who barely win gain little; favorites who lose big lose a lot.**
  A heavy favorite winning by just 1 point still gets a positive but small
  change; the same favorite losing by 5+ points takes the maximum penalty.
- **Ties use the minimum K (20)** since there's no margin to speak of.
- **The margin bonus caps at a 5-point score difference** — blowouts beyond
  that (observed: 0-6) don't increase the swing any further.
- Partners always gain/lose the identical number of points for a shared
  match, regardless of their individual rating difference within the pair.
