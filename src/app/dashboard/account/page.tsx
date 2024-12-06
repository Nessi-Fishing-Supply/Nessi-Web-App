"use client";

import React, { useEffect } from 'react';
import { useAuth, withAuth } from '@context/auth';
import { getUserProfile } from '@services/user';
import { logout, resendVerificationEmail } from '@services/auth';

const Account: React.FC = () => {
  const { isAuthenticated, token, setAuthenticated, setToken, userProfile, setUserProfile } = useAuth();

  useEffect(() => {
    async function fetchUserProfile() {
      if (isAuthenticated && token) {
        try {
          const profile = await getUserProfile(token);
          setUserProfile(profile);
        } catch (error) {
          if (error instanceof Error && error.message === 'Unauthorized') {
            await handleLogout();
          }
        }
      }
    }

    fetchUserProfile();
  }, [isAuthenticated, token]);

  const handleLogout = async () => {
    try {
      if (token) {
        await logout(token, setAuthenticated, setToken);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleResendVerificationEmail = async () => {
    if (userProfile?.email) {
      try {
        const result = await resendVerificationEmail(userProfile.email);
        alert(result.message);
      } catch (error) {
        console.error('Error resending verification email:', error);
        alert('Failed to resend verification email. Please try again later.');
      }
    }
  };

  return (
    <div>
      <h1>Account</h1>
      {isAuthenticated ? (
        userProfile ? (
          <div>
            <h2>User Profile</h2>
            <p>First Name: {userProfile.firstName}</p>
            <p>Last Name: {userProfile.lastName}</p>
            <p>Email: {userProfile.email}</p>
            <p>Email Verified: {userProfile.emailVerified ? "Yes" : "No"}</p>
            {!userProfile.emailVerified && (
              <button onClick={handleResendVerificationEmail}>Resend Verification Email</button>
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <p>Loading user profile...</p>
        )
      ) : (
        <p>Please log in to see your profile.</p>
      )}
    </div>
  );
};

export default withAuth(Account);
