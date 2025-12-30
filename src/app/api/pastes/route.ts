import { NextRequest, NextResponse } from 'next/server';
import { createPaste } from '@/lib/paste';
import { getCurrentTime } from '@/lib/time';

interface CreatePasteRequest {
  content?: string;
  ttl_seconds?: number;
  max_views?: number;
}

/**
 * Create a new paste
 * POST /api/pastes
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreatePasteRequest = await request.json();

    // Validate content
    if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required and must be non-empty' },
        { status: 400 }
      );
    }

    // Validate ttl_seconds
    if (body.ttl_seconds !== undefined) {
      if (
        typeof body.ttl_seconds !== 'number' ||
        !Number.isInteger(body.ttl_seconds) ||
        body.ttl_seconds < 1
      ) {
        return NextResponse.json(
          { error: 'ttl_seconds must be an integer >= 1' },
          { status: 400 }
        );
      }
    }

    // Validate max_views
    if (body.max_views !== undefined) {
      if (
        typeof body.max_views !== 'number' ||
        !Number.isInteger(body.max_views) ||
        body.max_views < 1
      ) {
        return NextResponse.json(
          { error: 'max_views must be an integer >= 1' },
          { status: 400 }
        );
      }
    }

    // Get current time (supports TEST_MODE)
    const currentTime = getCurrentTime(request.headers);

    // Create paste
    const id = await createPaste(
      {
        content: body.content,
        ttl_seconds: body.ttl_seconds,
        max_views: body.max_views,
      },
      currentTime
    );

    // Build URL dynamically
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const url = `${protocol}://${host}/p/${id}`;

    return NextResponse.json(
      {
        id,
        url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating paste:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
