import { nanoid } from 'nanoid';
import { redis } from './redis';
import { calculateExpiryTime, getCurrentTime, isExpired } from './time';

export interface PasteData {
  content: string;
  created_at: number;
  expires_at: number | null;
  remaining_views: number | null;
}

export interface CreatePasteInput {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
}

export interface PasteResponse {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
}

/**
 * Generate Redis key for a paste
 */
function getPasteKey(id: string): string {
  return `paste:${id}`;
}

/**
 * Create a new paste in Redis
 * @param input - Paste creation parameters
 * @param currentTime - Current timestamp in milliseconds
 * @returns Paste ID
 */
export async function createPaste(
  input: CreatePasteInput,
  currentTime: number
): Promise<string> {
  const id = nanoid(10);
  const key = getPasteKey(id);

  const expiresAt = input.ttl_seconds
    ? calculateExpiryTime(input.ttl_seconds, currentTime)
    : null;

  const pasteData: PasteData = {
    content: input.content,
    created_at: currentTime,
    expires_at: expiresAt,
    remaining_views: input.max_views ?? null,
  };

  // Store in Redis (Upstash REST API handles JSON serialization)
  await redis.set(key, pasteData);

  // Set Redis TTL if ttl_seconds is provided
  if (input.ttl_seconds) {
    await redis.expire(key, input.ttl_seconds);
  }

  return id;
}

/**
 * Fetch and consume a paste (decrements view count)
 * @param id - Paste ID
 * @param currentTime - Current timestamp in milliseconds
 * @returns Paste data or null if unavailable
 */
export async function fetchPaste(
  id: string,
  currentTime: number
): Promise<PasteResponse | null> {
  const key = getPasteKey(id);
  const pasteData = await redis.get<PasteData>(key);

  if (!pasteData) {
    return null;
  }

  // Check if expired by time
  if (pasteData.expires_at && isExpired(pasteData.expires_at, currentTime)) {
    await redis.del(key);
    return null;
  }

  // Check if view limit exceeded (remaining_views must be > 0 to allow access)
  if (pasteData.remaining_views !== null && pasteData.remaining_views <= 0) {
    await redis.del(key);
    return null;
  }

  // Decrement view count if applicable
if (pasteData.remaining_views !== null) {
  if (pasteData.remaining_views <= 0) {
    await redis.del(key);
    return null;
  }

  const newRemaining = pasteData.remaining_views - 1;

  await redis.set(key, {
    ...pasteData,
    remaining_views: newRemaining,
  });

  if (newRemaining <= 0) {
    await redis.del(key);
  }

  pasteData.remaining_views = newRemaining;
}

  return {
    content: pasteData.content,
    remaining_views: pasteData.remaining_views,
    expires_at: pasteData.expires_at ? new Date(pasteData.expires_at).toISOString() : null,
  };
}
