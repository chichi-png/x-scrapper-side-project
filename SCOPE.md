# X Caller Score — Scope

Lead magnet tool for Altcoinist. Takes an X handle, scores the user's crypto calling activity from public X data, generates a shareable score card, and funnels them into the Altcoinist mini app.

## What it does

1. User enters their X handle on the landing page
2. Tool fetches their last 100 public tweets + profile via X API v2
3. Scores them across 4 signals (see SCORING_LOGIC.md)
4. Renders a shareable score card (tier badge + stats)
5. Shows a score-gated CTA into the Altcoinist mini app

## What it does NOT do

- No login required
- No data stored — stateless, each score computed fresh
- No financial advice or call verification in v1

## Tech stack

Next.js 14 · Tailwind CSS · GSAP · PostHog · X API v2 · Vercel

## Env vars required

See `.env.example`
