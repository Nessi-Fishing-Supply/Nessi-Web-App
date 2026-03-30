import { createClient } from '@/libs/supabase/server';
import { AUTH_CACHE_HEADERS } from '@/libs/api-headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getThreadByIdServer } from '@/features/messaging/services/messaging-server';

// Get thread details including participants and context
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ thread_id: string }> },
) {
  try {
    const { thread_id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: AUTH_CACHE_HEADERS },
      );
    }

    const thread = await getThreadByIdServer(user.id, thread_id);

    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404, headers: AUTH_CACHE_HEADERS },
      );
    }

    return NextResponse.json(thread, { headers: AUTH_CACHE_HEADERS });
  } catch (error) {
    console.error('Failed to get thread:', error);
    return NextResponse.json(
      { error: 'Failed to get thread' },
      { status: 500, headers: AUTH_CACHE_HEADERS },
    );
  }
}
