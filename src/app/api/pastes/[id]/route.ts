import { NextRequest, NextResponse } from 'next/server';
import { fetchPaste } from '@/lib/paste';
import { getCurrentTime } from '@/lib/time';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const currentTime = getCurrentTime(request.headers);

  try {
    const paste = await fetchPaste(id, currentTime);

    // Missing / expired / view-limit exceeded
    if (!paste) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(paste, { status: 200 });
  } catch (err: any) {
    // IMPORTANT: treat constraint failures as 404 (per PDF)
    if (
      err?.code === 'PASTE_EXPIRED' ||
      err?.code === 'PASTE_VIEWS_EXCEEDED'
    ) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }

    console.error('Unexpected error fetching paste:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
