import * as Yup from 'yup';

// Form validation schemas for authentication
export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const registerSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  terms: Yup.boolean().oneOf([true], 'Terms must be accepted').required(),
});

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string().min(8, 'Minimum 8 characters').required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required(),
});
