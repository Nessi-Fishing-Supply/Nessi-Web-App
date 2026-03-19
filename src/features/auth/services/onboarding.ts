/**
 * Check if the current user has completed onboarding.
 * TODO: Query the profiles table for completeness when it exists.
 * Currently defaults to complete (skip onboarding).
 */
export async function checkOnboardingComplete(): Promise<{ isComplete: boolean }> {
  return { isComplete: true };
}
