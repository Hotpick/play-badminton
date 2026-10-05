# Badminton Doubles Rating Algorithm (Games to 15)

Team-based Elo with a margin-of-victory bonus. Format: best of 3 games to 15.
Calculated once per match; both partners receive the same rating change.

## Formula

1. **Team ratings**
   ```
   TeamA = (Ra1 + Ra2) / 2
   TeamB = (Rb1 + Rb2) / 2
   ```

2. **Expected score**
   ```
   ExpectedA = 1 / (1 + 10 ^ ((TeamB - TeamA) / 400))
   ```

3. **Actual result**
   ```
   ActualA = 1 if Pair A won the match, 0 otherwise
   ```

4. **Point dominance** (summed across all games)
   ```
   dominance = |PointsA - PointsB| / (PointsA + PointsB)
   ```

5. **K-factor**
   ```
   marginFactor = min(dominance / 0.4, 1)
   K            = 24 + 24 * marginFactor
   ```

6. **Favorite correction**
   ```
   WinnerDiff = TeamWinner - TeamLoser      (clamped to [-800, 800])
   K          = K * 2.2 / (WinnerDiff * 0.001 + 2.2)
   ```

7. **Provisional players**: if any player has fewer than 10 rated doubles
   matches, `K = K * 1.5`.

8. **Rating change**
   ```
   ΔA = round(K * (ActualA - ExpectedA))
   ΔB = -ΔA
   ```

Walkovers and retirements: no rating change.

## Examples

| # | Team A | Team B | Score (A–B) | Dominance | K final | Expected A | Δ A |
|---|---|---|---|---|---|---|---|
| 1 | 1500 | 1500 | 15-13, 13-15, 16-14 | 0.023 | 25.4 | 0.500 | +13 |
| 2 | 1550 | 1450 | 15-10, 15-9 | 0.224 | 35.8 | 0.640 | +13 |
| 3 | 1600 | 1400 | 15-5, 15-7 | 0.429 | 44.0 | 0.760 | +11 |
| 4 | 1400 | 1600 | 15-8, 15-10 | 0.250 | 42.9 | 0.240 | +33 |
| 5 | 1580 | 1500 | 15-12, 13-15, 14-16 | 0.012 | 25.6 | 0.613 | -16 |
| 6 | 1650 | 1450 | 6-15, 8-15 | 0.364 | 50.4 | 0.760 | -38 |

## Parameters

| Parameter | Value |
|---|---|
| Base K | 24 |
| Margin K | 24 |
| Dominance cap | 0.4 |
| WinnerDiff clamp | ±800 |
| Provisional threshold | 10 matches |
| Provisional multiplier | 1.5 |
