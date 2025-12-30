import { Redis } from '@upstash/redis';

/**
 * Upstash Redis client instance
 * Uses REST-based connection for serverless environments
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

/**
 * Verify Redis connectivity
 * @returns true if Redis is accessible
 */
export async function checkRedisHealth(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}
