import Redis from 'ioredis';

let redis: Redis | null = null;

/**
 * Get or create a Redis connection.
 * Uses REDIS_URL from environment.
 */
export function getRedis(): Redis {
  if (!redis) {
    const url = process.env['REDIS_URL'];
    if (!url) {
      throw new Error('REDIS_URL environment variable is not set');
    }
    redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times: number) {
        const delay = Math.min(times * 200, 2000);
        return delay;
      },
      lazyConnect: true,
    });
  }
  return redis;
}

/**
 * Cache a quote response for a specific swap + block.
 *
 * Key format: bench:quote:{chainId}:{inputToken}:{outputToken}:{amount}:{blockNumber}
 * TTL: ~12 seconds (one EVM block)
 */
export async function cacheQuote(
  chainId: number,
  inputToken: string,
  outputToken: string,
  amount: string,
  blockNumber: number,
  data: unknown,
  ttlSeconds = 12,
): Promise<void> {
  const key = `bench:quote:${chainId}:${inputToken}:${outputToken}:${amount}:${blockNumber}`;
  await getRedis().set(key, JSON.stringify(data), 'EX', ttlSeconds);
}

/**
 * Retrieve a cached quote response.
 */
export async function getCachedQuote(
  chainId: number,
  inputToken: string,
  outputToken: string,
  amount: string,
  blockNumber: number,
): Promise<unknown | null> {
  const key = `bench:quote:${chainId}:${inputToken}:${outputToken}:${amount}:${blockNumber}`;
  const cached = await getRedis().get(key);
  return cached ? JSON.parse(cached) : null;
}

/**
 * Cache an agent's Bench Score.
 */
export async function cacheAgentScore(
  agentAddress: string,
  score: number,
  ttlSeconds = 300,
): Promise<void> {
  const key = `bench:score:${agentAddress}`;
  await getRedis().set(key, score.toString(), 'EX', ttlSeconds);
}

/**
 * Retrieve a cached agent score.
 */
export async function getCachedAgentScore(agentAddress: string): Promise<number | null> {
  const key = `bench:score:${agentAddress}`;
  const cached = await getRedis().get(key);
  return cached ? parseInt(cached, 10) : null;
}

/**
 * Gracefully close the Redis connection.
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
