// lib/xapi.ts
const BASE = 'https://api.twitter.com/2';

export interface XProfile {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

export interface XTweet {
  id: string;
  text: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
    impression_count: number;
  };
  created_at: string;
}

interface XUserResponse {
  data?: XProfile;
  errors?: Array<{ detail: string }>;
}

interface XTweetsResponse {
  data?: XTweet[];
  errors?: Array<{ detail: string }>;
}

function getBearerToken(): string {
  const token = process.env.X_API_BEARER_TOKEN;
  if (!token) throw new Error('X_API_BEARER_TOKEN env var is not set');
  return token;
}

async function xFetch(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${getBearerToken()}`,
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`X API error ${res.status}: ${body}`);
  }
  return res.json();
}

export async function getUserByUsername(username: string): Promise<XProfile> {
  const data = await xFetch(
    `/users/by/username/${encodeURIComponent(username)}?user.fields=profile_image_url,public_metrics`
  ) as XUserResponse;
  if (data.errors) throw new Error(data.errors[0].detail);
  return data.data!;
}

export async function getRecentTweets(userId: string, max = 100): Promise<XTweet[]> {
  const clampedMax = Math.min(100, Math.max(5, max));
  const data = await xFetch(
    `/users/${userId}/tweets?max_results=${clampedMax}&tweet.fields=public_metrics,created_at&exclude=retweets,replies`
  ) as XTweetsResponse;
  if (data.errors) throw new Error(data.errors[0].detail);
  return data.data ?? [];
}
