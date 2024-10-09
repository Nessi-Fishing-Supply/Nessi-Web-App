"use client";

import React from 'react';
import styles from './ResetPassword.module.scss'
import ResetPasswordForm from '@components/forms/ResetPassword';

export default function ResetPassword() {

  interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

  const handleForgotPasswordSubmit = (data: ResetPasswordFormData) => {
    console.log('Forgot Password Form Data:', data);
  };
  
  return (
    <div className={styles.container}>
      <section className={styles.form}>
        <h5>Reset Password</h5>
        <p>Enter a new password for your account.</p>
        <ResetPasswordForm onSubmit={handleForgotPasswordSubmit} />
      </section>
    </div>
  );
}
