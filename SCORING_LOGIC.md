# Scoring Logic

All weights live in `lib/scoring.ts`. Edit there to tune.

## Signals (max 100 pts total)

| Signal | Measure | Max pts |
|---|---|---|
| Crypto relevance | % of last 100 tweets with crypto keywords / $tickers | 35 |
| Engagement rate | avg (likes + retweets + impressions) ÷ followers | 25 |
| Posting consistency | tweets/week over last 30 days (cap 14/wk) | 20 |
| Reach | follower count log scale (caps at 50k followers) | 20 |

## Tiers

| Score | Tier |
|---|---|
| 0–24 | Rookie |
| 25–49 | Signal |
| 50–74 | Pro |
| 75–100 | Elite |

## Score-gated CTA

- Elite / Pro → "Get verified as a caller on Altcoinist"
- Signal / Rookie → "Discover top callers on Altcoinist"

## Crypto keyword list

Located in `lib/scoring.ts` as `CRYPTO_KEYWORDS` array. Add/remove terms there.

## V2 ideas (not built yet)

- Detect actual calls ($TICKER + entry/target patterns)
- Verify call performance via CoinGecko price API
- Use Conor's caller scoring weights
