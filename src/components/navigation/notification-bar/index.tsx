'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './notification-bar.module.scss';
import { HiChevronRight, HiX } from 'react-icons/hi';

interface NotificationBarProps {
  showOnboardingBanner?: boolean;
}

export default function NotificationBar({ showOnboardingBanner = false }: NotificationBarProps) {
  const [dismissed, setDismissed] = useState(false);

  // Read sessionStorage after mount to avoid hydration mismatch
  useEffect(() => {
    if (sessionStorage.getItem('nessi-onboarding-dismissed') === 'true') {
      setDismissed(true);
    }
  }, []);

  if (showOnboardingBanner && !dismissed) {
    return (
      <div className={`${styles.container} ${styles.onboarding}`} role="status" aria-live="polite">
        <p className={styles.text}>Complete your profile to start buying and selling on Nessi</p>
        <Link href="/onboarding" className={styles.link}>
          <span>Complete Profile</span>
          <HiChevronRight className={styles.icon} aria-hidden="true" />
        </Link>
        <button
          type="button"
          className={styles.dismissButton}
          onClick={() => {
            setDismissed(true);
            sessionStorage.setItem('nessi-onboarding-dismissed', 'true');
          }}
          aria-label="Dismiss onboarding banner"
        >
          <HiX aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container} role="banner">
      <p className={styles.text}>Maker&apos;s Week | Shop Unique and Custom Baits</p>
      <Link href="/" className={styles.link}>
        <span>Shop Now</span>
        <HiChevronRight className={styles.icon} aria-hidden="true" />
      </Link>
    </div>
  );
}
