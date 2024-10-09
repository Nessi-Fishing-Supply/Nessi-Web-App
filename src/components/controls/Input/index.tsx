import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styles from './Input.module.scss';
import { HiEye, HiEyeOff } from 'react-icons/hi'; // Icons for visibility toggle

interface InputProps {
  name: string;
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  isRequired?: boolean;
  showPasswordStrength?: boolean; // New prop to conditionally show the strength bar
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  helperText,
  icon,
  type = 'text',
  placeholder,
  isRequired = false,
  showPasswordStrength = false, // Default to false
}) => {
  const { control } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // State to track password strength
  const [showProgressBar, setShowProgressBar] = useState(false); // State to control the display of progress bar

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  // Check password strength based on validation rules
  const checkPasswordStrength = (password: string) => {
    let strength = 0;

    if (password.length >= 8) strength += 1; // Minimum length
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase letter
    if (/[a-z]/.test(password)) strength += 1; // Lowercase letter
    if (/\d/.test(password)) strength += 1; // Numeric digit
    if (/[\W_]/.test(password)) strength += 1; // Special character

    setPasswordStrength(strength); // Set strength score (0-4)
  };

  // Get class based on password strength
  const getStrengthClass = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return styles.weak;
      case 2:
        return styles.fair;
      case 3:
        return styles.good;
      case 4:
        return styles.strong;
      default:
        return '';
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, isTouched, isDirty } }) => (
        <div className={`${styles.wrapper}`}>
          {label && (
            <label className={styles.label} htmlFor={name}>
              {label}
              {isRequired && <span>*</span>} {/* Required indicator */}
            </label>
          )}
          <div className={`${styles.container} 
              ${error ? styles.error : ''} 
              ${isTouched && !error && isDirty ? styles.success : ''} 
              ${isFocused ? styles.focused : ''}`}
          >
            <input
              id={name}
              type={type === 'password' && isPasswordVisible ? 'text' : type}
              placeholder={placeholder}
              {...field}
              className={styles.input}
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => {
                setIsFocused(false);
                if (!e.target.value) {
                  setShowProgressBar(false); // Hide progress bar if the input is empty
                }
              }}
              onChange={(e) => {
                field.onChange(e); // React Hook Form's event handler
                if (type === 'password' && showPasswordStrength) {
                  checkPasswordStrength(e.target.value); // Check strength if password
                  setShowProgressBar(!!e.target.value); // Show progress bar if there's a value
                }
              }}
            />
            {icon && <span className={styles.icon}>{icon}</span>}

            {/* Password visibility toggle */}
            {type === 'password' && (
              <button
                type="button"
                className={styles.toggleButton}
                onClick={togglePasswordVisibility}
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              >
                {isPasswordVisible ? <HiEyeOff /> : <HiEye />}
              </button>
            )}
          </div>

          {/* Password strength progress bar, shown only after typing */}
          {showPasswordStrength && showProgressBar && (
            <div className={styles.passwordStrengthBar}>
              <div
                className={`${styles.passwordStrengthProgress} ${getStrengthClass()}`} // Add strength class dynamically
                style={{ width: `${(passwordStrength / 4) * 100}%` }} // Divided by 4 since we removed "Very Weak"
              />
              <small className={styles.passwordStrengthText}>
                {passwordStrength === 0 || passwordStrength === 1 && 'Weak'}
                {passwordStrength === 2 && 'Fair'}
                {passwordStrength === 3 && 'Good'}
                {passwordStrength === 4 && 'Strong'}
              </small>
            </div>
          )}

          {helperText && !error && <small className={styles.helperText}>{helperText}</small>}
          {error && <small className={styles.errorText}>{error.message}</small>}
        </div>
      )}
    />
  );
};

export default Input;
