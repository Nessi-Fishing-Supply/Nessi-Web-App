"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { UserProfileDto, getUserProfile } from '@services/user'; // Import getUserProfile
import axios from 'axios'; // Import axios

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setToken: (token: string | null) => void;
  userProfile: UserProfileDto | null;
  setUserProfile: (profile: UserProfileDto | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileDto | null>(null);

  useEffect(() => {
    const fetchUserProfile = async (token: string) => {
      try {
        const profile = await getUserProfile(token);
        setUserProfile(profile);
      } catch (error) {
        if (axios.isAxiosError(error) && error.message === 'Unauthorized') {
          setAuthenticated(false);
          setToken(null);
        } else {
          console.error('Unexpected error fetching user profile:', error);
        }
      }
    };

    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setAuthenticated(true);
      fetchUserProfile(storedToken); // Fetch user profile if token exists
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, setAuthenticated, setToken, userProfile, setUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
