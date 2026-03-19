// User registration form data
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  terms: boolean;
}

// Login form data
export interface LoginData {
  email: string;
  password: string;
}

// Password reset form data
export interface ResetPasswordData {
  newPassword: string;
  confirmNewPassword: string;
}

// Standard API response format
export interface AuthResponse {
  message: string;
  error?: string;
  email?: string;
}
