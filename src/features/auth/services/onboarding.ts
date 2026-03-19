import { createClient } from '@/libs/supabase/client';

/**
 * Check if the current user has completed onboarding.
 * Queries the profiles table for `onboarding_completed_at`.
 */
export async function checkOnboardingComplete(): Promise<{ isComplete: boolean }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { isComplete: false };

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed_at')
    .eq('id', user.id)
    .single();

  if (!profile) return { isComplete: false };

  return { isComplete: profile.onboarding_completed_at !== null };
}
