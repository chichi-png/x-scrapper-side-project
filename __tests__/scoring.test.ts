import { scoreProfile, getTier } from '@/lib/scoring';
import { XProfile, XTweet } from '@/lib/xapi';

const mockProfile: XProfile = {
  id: '123',
  name: 'Test Caller',
  username: 'testcaller',
  profile_image_url: 'https://example.com/img.jpg',
  public_metrics: { followers_count: 10000, following_count: 500, tweet_count: 800 },
};

const makeTweet = (text: string, likes = 100, retweets = 20, impressions = 5000): XTweet => ({
  id: Math.random().toString(),
  text,
  public_metrics: { like_count: likes, retweet_count: retweets, reply_count: 5, impression_count: impressions },
  created_at: new Date().toISOString(),
});

test('scores 0 for empty tweet list', () => {
  const result = scoreProfile(mockProfile, []);
  expect(result.total).toBe(0);
  expect(result.tier).toBe('Rookie');
});

test('crypto-heavy tweets score higher on relevance than non-crypto', () => {
  const cryptoTweets = Array(10).fill(null).map(() => makeTweet('$BTC looking bullish, entry 60k target 70k'));
  const nonCryptoTweets = Array(10).fill(null).map(() => makeTweet('had a great coffee today'));
  const cryptoResult = scoreProfile(mockProfile, cryptoTweets);
  const nonCryptoResult = scoreProfile(mockProfile, nonCryptoTweets);
  expect(cryptoResult.relevanceScore).toBeGreaterThan(nonCryptoResult.relevanceScore);
});

test('tier boundaries map correctly', () => {
  expect(getTier(0)).toBe('Rookie');
  expect(getTier(24)).toBe('Rookie');
  expect(getTier(25)).toBe('Signal');
  expect(getTier(49)).toBe('Signal');
  expect(getTier(50)).toBe('Pro');
  expect(getTier(74)).toBe('Pro');
  expect(getTier(75)).toBe('Elite');
  expect(getTier(100)).toBe('Elite');
});

test('total score is capped at 100', () => {
  const heavyCryptoTweets = Array(100).fill(null).map(() =>
    makeTweet('$BTC $ETH signal entry TP SL degen', 10000, 5000, 1000000)
  );
  const bigProfile = { ...mockProfile, public_metrics: { ...mockProfile.public_metrics, followers_count: 1000000 } };
  const result = scoreProfile(bigProfile, heavyCryptoTweets);
  expect(result.total).toBeLessThanOrEqual(100);
});
