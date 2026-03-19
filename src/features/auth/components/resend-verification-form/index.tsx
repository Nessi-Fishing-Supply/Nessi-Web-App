'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Input, Button } from '@/components/controls';
import { resendVerification } from '@/features/auth/services/auth';
import { useFormState } from '@/features/shared/hooks/use-form-state';
import { HiOutlineExclamation } from 'react-icons/hi';
import styles from './resend-verification-form.module.scss';

interface ResendVerificationFormProps {
  onBackToLogin?: () => void;
  onSuccess?: (email: string) => void;
}

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const ResendVerificationForm: React.FC<ResendVerificationFormProps> = ({
  onBackToLogin,
  onSuccess,
}) => {
  const { isLoading, error, setLoading, setError } = useFormState();

  const methods = useForm<{ email: string }>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    setError(null);
    try {
      await resendVerification({ email: data.email });
      if (onSuccess) onSuccess(data.email);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={`${styles.iconCircle} ${styles.warningIcon}`}>
          <HiOutlineExclamation aria-hidden="true" />
        </div>
        <h6 className={styles.title}>Verification link expired</h6>
        <p className={styles.subtitle}>Enter your email to resend the verification link.</p>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="authForm">
          <Input name="email" label="Email" type="email" isRequired autoComplete="email" />
          {error && <p className="errorMessage">{error}</p>}
          <Button type="submit" fullWidth loading={isLoading}>
            Resend Verification Email
          </Button>
        </form>
      </FormProvider>
      {onBackToLogin && (
        <div className={styles.backLink}>
          <button onClick={onBackToLogin} className={styles.backLinkButton}>
            Back to Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default ResendVerificationForm;
