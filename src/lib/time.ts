/**
 * Get current timestamp in milliseconds
 * In TEST_MODE, reads from x-test-now-ms header
 * @param headers - Request headers (optional)
 * @returns Current timestamp in milliseconds
 */
export function getCurrentTime(headers?: Headers): number {
  if (process.env.TEST_MODE === '1' && headers) {
    const testNow = headers.get('x-test-now-ms');
    if (testNow) {
      const parsed = parseInt(testNow, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
  }
  return Date.now();
}

/**
 * Calculate expiry timestamp from TTL seconds
 * @param ttlSeconds - Time to live in seconds
 * @param currentTime - Current timestamp in milliseconds
 * @returns Expiry timestamp in milliseconds
 */
export function calculateExpiryTime(ttlSeconds: number, currentTime: number): number {
  return currentTime + (ttlSeconds * 1000);
}

/**
 * Check if a timestamp has expired
 * @param expiresAt - Expiry timestamp in milliseconds
 * @param currentTime - Current timestamp in milliseconds
 * @returns true if expired
 */
export function isExpired(expiresAt: number, currentTime: number): boolean {
  return currentTime >= expiresAt;
}
