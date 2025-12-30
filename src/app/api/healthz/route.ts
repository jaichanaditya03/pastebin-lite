import { NextResponse } from 'next/server';
import { checkRedisHealth } from '@/lib/redis';

/**
 * Health check endpoint
 * GET /api/healthz
 * Must always return 200 with JSON
 */
export async function GET() {
  const isHealthy = await checkRedisHealth();

  return NextResponse.json(
    { ok: isHealthy },
    { status: 200 }
  );
}
