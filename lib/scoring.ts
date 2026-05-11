import { XProfile, XTweet } from './xapi';

const CRYPTO_KEYWORDS = [
  '$btc', '$eth', '$sol', '$bnb', 'altcoin', 'call', 'entry', 'target',
  'pump', 'moon', 'tp', 'sl', 'signal', 'portfolio', 'trade', 'long',
  'short', 'degen', 'bullish', 'bearish', 'chart', 'resistance', 'support',
];

export type Tier = 'Rookie' | 'Signal' | 'Pro' | 'Elite';

export interface ScoreResult {
  total: number;
  tier: Tier;
  relevanceScore: number;
  engagementScore: number;
  consistencyScore: number;
  reachScore: number;
  stats: {
    cryptoTweetPct: number;
    avgEngagementRate: number;
    tweetsPerWeek: number;
    followerCount: number;
  };
}

export function getTier(score: number): Tier {
  if (score >= 75) return 'Elite';
  if (score >= 50) return 'Pro';
  if (score >= 25) return 'Signal';
  return 'Rookie';
}

function isCryptoTweet(text: string): boolean {
  const lower = text.toLowerCase();
  return CRYPTO_KEYWORDS.some((kw) => lower.includes(kw));
}

function calcRelevance(tweets: XTweet[]): { score: number; pct: number } {
  if (!tweets.length) return { score: 0, pct: 0 };
  const cryptoCount = tweets.filter((t) => isCryptoTweet(t.text)).length;
  const pct = cryptoCount / tweets.length;
  return { score: Math.round(pct * 35), pct: Math.round(pct * 100) };
}

function calcEngagement(tweets: XTweet[], followers: number): { score: number; rate: number } {
  if (!tweets.length || followers === 0) return { score: 0, rate: 0 };
  const avgEngagement =
    tweets.reduce((sum, t) => {
      const { like_count, retweet_count, impression_count } = t.public_metrics;
      return sum + like_count + retweet_count + impression_count;
    }, 0) / tweets.length;
  const rate = avgEngagement / followers;
  const normalized = Math.min(rate / 10, 1);
  return { score: Math.round(normalized * 25), rate: Math.round(rate * 100) / 100 };
}

function calcConsistency(tweets: XTweet[]): { score: number; tweetsPerWeek: number } {
  if (!tweets.length) return { score: 0, tweetsPerWeek: 0 };
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const recent = tweets.filter((t) => new Date(t.created_at).getTime() > thirtyDaysAgo);
  const tweetsPerWeek = (recent.length / 30) * 7;
  const normalized = Math.min(tweetsPerWeek / 14, 1);
  return { score: Math.round(normalized * 20), tweetsPerWeek: Math.round(tweetsPerWeek * 10) / 10 };
}

function calcReach(followers: number): number {
  if (followers <= 0) return 0;
  const normalized = Math.min(Math.log10(followers + 1) / Math.log10(50000), 1);
  return Math.round(normalized * 20);
}

export function scoreProfile(profile: XProfile, tweets: XTweet[]): ScoreResult {
  const followers = profile.public_metrics.followers_count;
  const { score: relevanceScore, pct: cryptoTweetPct } = calcRelevance(tweets);
  const { score: engagementScore, rate: avgEngagementRate } = calcEngagement(tweets, followers);
  const { score: consistencyScore, tweetsPerWeek } = calcConsistency(tweets);
  const reachScore = calcReach(followers);
  const reachContribution = tweets.length > 0 ? reachScore : 0;
  const total = Math.min(relevanceScore + engagementScore + consistencyScore + reachContribution, 100);

  return {
    total,
    tier: getTier(total),
    relevanceScore,
    engagementScore,
    consistencyScore,
    reachScore,
    stats: { cryptoTweetPct, avgEngagementRate, tweetsPerWeek, followerCount: followers },
  };
}
