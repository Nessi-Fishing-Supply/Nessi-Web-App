import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/libs/supabase';

// Handle user session termination
export async function POST() {
  const supabase = createSupabaseServer();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Logout successful' });
}
