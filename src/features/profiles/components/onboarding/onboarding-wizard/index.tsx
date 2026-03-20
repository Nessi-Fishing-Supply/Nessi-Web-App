'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context';
import useOnboardingStore from '@/features/profiles/stores/onboarding-store';
import ProgressIndicator from '@/features/profiles/components/onboarding/progress-indicator';
import StepDisplayName from '@/features/profiles/components/onboarding/step-display-name';
import StepFishingIdentity from '@/features/profiles/components/onboarding/step-fishing-identity';
import StepBio from '@/features/profiles/components/onboarding/step-bio';
import styles from './onboarding-wizard.module.scss';

export default function OnboardingWizard() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const currentStep = useOnboardingStore.use.currentStep();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.wizard}>
      <div className={styles.progressWrapper}>
        <ProgressIndicator currentStep={currentStep} />
      </div>
      <div className={styles.stepContent}>
        {currentStep === 1 && <StepDisplayName />}
        {currentStep === 2 && <StepFishingIdentity />}
        {currentStep === 3 && <StepBio />}
      </div>
    </div>
  );
}
