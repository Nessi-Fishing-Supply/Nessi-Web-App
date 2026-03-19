import { createClient } from '@/libs/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Sanitizes the `next` redirect parameter to prevent open redirect attacks.
 * Only allows relative paths starting with `/` that don't start with `//`
 * (protocol-relative URLs like `//evil.com` would redirect off-site).
 */
function sanitizeRedirectPath(next: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/dashboard';
  }
  return next;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');
  const next = sanitizeRedirectPath(searchParams.get('next'));

  const headers = { 'Cache-Control': 'private, no-store' };

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', { type, error: error.message });
      return NextResponse.redirect(`${origin}/?auth_error=true`, { headers });
    }

    if (type === 'recovery') {
      return NextResponse.redirect(`${origin}/auth/callback?status=recovery`, { headers });
    }
    if (type === 'signup') {
      return NextResponse.redirect(`${origin}/?verified=true`, { headers });
    }
    return NextResponse.redirect(`${origin}${next}`, { headers });
  }

  console.error('Auth callback error: no code parameter provided', { type });
  return NextResponse.redirect(`${origin}/?auth_error=true`, { headers });
}
