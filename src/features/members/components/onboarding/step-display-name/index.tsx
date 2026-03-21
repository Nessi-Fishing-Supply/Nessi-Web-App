'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { step1Schema } from '@/features/members/validations/onboarding';
import { generateSlug } from '@/features/members/services/member';
import AvatarUpload from '@/features/members/components/avatar-upload';
import useOnboardingStore from '@/features/members/stores/onboarding-store';
import Button from '@/components/controls/button';
import type { OnboardingStep1Data } from '@/features/members/types/onboarding';
import styles from './step-display-name.module.scss';

export default function StepDisplayName() {
  const step1Data = useOnboardingStore.use.step1Data();
  const avatarUrl = useOnboardingStore.use.avatarUrl();
  const setStep1Data = useOnboardingStore.use.setStep1Data();
  const setAvatarUrl = useOnboardingStore.use.setAvatarUrl();
  const nextStep = useOnboardingStore.use.nextStep();

  const methods = useForm<OnboardingStep1Data>({
    resolver: yupResolver(step1Schema),
    mode: 'onBlur',
    defaultValues: {
      displayName: step1Data.displayName,
    },
  });

  const {
    register,
    watch,
    formState: { errors, isValid },
  } = methods;

  // eslint-disable-next-line react-hooks/incompatible-library -- watch() from react-hook-form is inherently non-memoizable
  const watchedName = watch('displayName') ?? '';
  const slug = generateSlug(watchedName);

  const canProceed = watchedName.length >= 3 && isValid && !errors.displayName;

  const handleNext = () => {
    setStep1Data({ displayName: watchedName });
    setAvatarUrl(avatarUrl);
    nextStep();
  };

  const displayNameId = 'display-name-input';
  const errorId = 'display-name-error';
  const slugPreviewId = 'slug-preview';

  const describedBy = [errors.displayName ? errorId : null, slugPreviewId]
    .filter(Boolean)
    .join(' ');

  return (
    <FormProvider {...methods}>
      <div className={styles.container}>
        <div className={styles.formBody}>
          <div className={styles.stepHeader}>
            <h2 className={styles.stepTitle}>Let&#39;s get you set up</h2>
            <p className={styles.stepSubtitle}>
              Choose a name and photo that other anglers will see.
            </p>
          </div>

          <div className={styles.avatarSection}>
            <AvatarUpload
              displayName={watchedName}
              avatarUrl={avatarUrl}
              onUpload={(url) => setAvatarUrl(url)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor={displayNameId} className={styles.label}>
              Display name
              <span className={styles.required} aria-hidden="true">
                {' '}
                *
              </span>
            </label>

            <div className={styles.inputRow}>
              <input
                {...register('displayName')}
                id={displayNameId}
                type="text"
                className={`${styles.input}${errors.displayName ? ` ${styles.inputError}` : ''}`}
                aria-required="true"
                aria-invalid={!!errors.displayName}
                aria-describedby={describedBy || undefined}
                autoComplete="nickname"
                placeholder="e.g. BassKing"
              />
            </div>

            {errors.displayName && (
              <p id={errorId} className={styles.errorText} role="alert">
                {errors.displayName.message}
              </p>
            )}

            {watchedName.length > 0 && (
              <p id={slugPreviewId} className={styles.slugPreview} aria-live="polite">
                @{slug}
              </p>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            type="button"
            style="primary"
            fullWidth
            disabled={!canProceed}
            onClick={handleNext}
            ariaLabel="Continue to next step"
          >
            Next
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
