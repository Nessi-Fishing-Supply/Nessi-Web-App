'use client';

import React from 'react';
import styles from './forgot-password.module.scss';
import ForgotPasswordForm from '@/features/auth/components/forgot-password-form';

export default function ForgotPassword() {
  return (
    <main className={styles.container}>
      <section className={styles.form}>
        <h1>Forgot your password?</h1>
        <p>Enter your email address and we&apos;ll send you a link to reset your password.</p>
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
