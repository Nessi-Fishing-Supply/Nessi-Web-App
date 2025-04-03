'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/validations/auth';
import { RegisterData } from '@/types/auth';
import { useFormState } from '@/hooks/useFormState';
import { Input, Button, Checkbox } from '@/components/controls';
import { register as registerUser } from '@/services/auth';
import Grid from '@/components/layout/grid';
import { AuthFormProps, RegisterFormData, AuthFormResponse } from '@/types/forms';

/**
 * Registration form component
 * Handles new user registration with email verification
 * Collects user details and validates terms acceptance
 * Provides success/error feedback and loading states
 */
const RegisterForm: React.FC<AuthFormProps<RegisterFormData, AuthFormResponse>> = ({ onSuccess, onError }) => {
  const { isLoading, error, success, setLoading, setError, setSuccess } = useFormState();
  
  const methods = useForm<RegisterData>({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur',
  });

  const handleSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const response = await registerUser(data);
      setSuccess(response.message);
      if (onSuccess) onSuccess(response);
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Registration failed. Please try again.');
      }
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="authForm">
        {error && <div className="errorMessage">{error}</div>}
        {success && <div className="successMessage">{success}</div>}

        <Grid columns={2}>
          <Input name="firstName" label="First Name" type="text" isRequired />
          <Input name="lastName" label="Last Name" type="text" isRequired />
        </Grid>
        <Input name="email" label="Email" type="email" isRequired />
        <Input name="password" label="Password" type="password" showPasswordStrength isRequired />
        <Checkbox name="terms" label="I accept the terms and conditions" isRequired />
        <Button type="submit" fullWidth loading={isLoading}>
          Sign Up
        </Button>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
