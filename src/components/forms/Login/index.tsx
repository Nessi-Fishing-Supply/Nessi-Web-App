import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Input from '@components/controls/Input';
import Button from '@components/controls/Button';
import Checkbox from '@components/controls/Checkbox';
import GoogleIcon from '@icons/google.svg';
import FacebookIcon from '@icons/facebook.svg';
import Divider from '@components/layout/Divider';
import AppLink from '@components/controls/AppLink';
import { login } from '@services/auth';
import { useAuth } from '@context/auth';

interface LoginFormData {
  email: string;
  password: string;
  stayLoggedIn?: boolean;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const { setAuthenticated, setToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validation schema for the form
  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    // stayLoggedIn: Yup.boolean(),
  });

  const methods = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
  });

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await login(data);
      console.log('Login response:', response); // Log the response
      const { AccessToken } = response;
      if (!AccessToken) {
        throw new Error('AccessToken is missing in the response');
      }
      setAuthenticated(true);
      setToken(AccessToken);
      if (data.stayLoggedIn) {
        localStorage.setItem('authToken', AccessToken);
      }
      setErrorMessage(null);
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Login failed. Please try again.');
    }
    setIsLoading(false);
    await onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="authForm">
        {errorMessage && <div className="errorMessage">{errorMessage}</div>}
        <Input name="email" label="Email" type="email" isRequired />
        <Input name="password" label="Password" type="password" isRequired />
        {/* TODO: Add Stay Logged In Logic */}
        {/* <Checkbox label="Stay logged in" {...methods.register('stayLoggedIn')} /> */}
        <Button
          type="submit"
          fullWidth
          marginBottom
          loading={isLoading}
          onClick={() => console.log('Submit Form')}>
          Submit
        </Button>
        <AppLink fullWidth center underline size="sm" href="/forgot-password">
          Forgot your password?
        </AppLink>
        <Divider text="OR" />
        <Button
          style="dark"
          outline
          fullWidth
          round
          marginBottom
          icon={<GoogleIcon />}
          iconPosition='left'
          onClick={() => console.log('Google SSO')}>
          Continue with Google
        </Button>
        <Button
          style="dark"
          outline
          fullWidth
          round
          icon={<FacebookIcon />}
          iconPosition='left'
          onClick={() => console.log('Facebook SSO')}>
          Continue with Facebook
        </Button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;