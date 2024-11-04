"use client";

import React from 'react';
import styles from './Navbar.module.scss';
import NotificationBar from '@components/navigation/NotificationBar';
import LogoFull from '@logos/logo_full.svg';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { HiSearch } from 'react-icons/hi';
import Link from 'next/link';
import { useState } from 'react';
import Modal from '@components/layout/Modal';
import LoginForm from '@components/forms/Login';
import Button from '@components/controls/Button';
import RegisterForm from '@components/forms/Registration';
import { useAuth } from '@context/auth';
import Dropdown from '@components/controls/Dropdown';
import { logout } from "@services/auth";
import AppLink from '@components/controls/AppLink';

export default function Navbar() {
  const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  const { isAuthenticated, userProfile, token, setAuthenticated, setToken, setUserProfile } = useAuth();

  const toggleLoginModal = () => {
    setLoginModalOpen(prev => !prev);
    if (isRegisterModalOpen) setRegisterModalOpen(false);
  };

  const toggleRegisterModal = () => {
    setRegisterModalOpen(prev => !prev);
    if (isLoginModalOpen) setLoginModalOpen(false);
  };

  interface LoginFormData {
    email: string;
    password: string;
  }

  interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  const handleLoginSubmit = (data: LoginFormData) => {
    console.log('Login Form Data:', data);
    setLoginModalOpen(false);
  };

  const handleRegisterSubmit = (data: RegisterFormData) => {
    console.log('Register Form Data:', data);
    setRegisterModalOpen(false);
  };

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

  return (
    <nav>
      <NotificationBar />
      <div className={styles.container}>
        <Link href="/">
          <LogoFull className={styles.logo} />
        </Link>
        <form className={styles.form}>
          <input type="search" placeholder="Search Fishing Gear"></input>
          <button className={styles.form__button} type="submit">
            <HiSearch />
          </button>
        </form>
        <button className={styles.button}>Sell Your Gear</button>
        {isAuthenticated && userProfile ? (
          <Dropdown label={`Hi, ${userProfile.firstName}`}>
            <AppLink href="/dashboard">Dashboard</AppLink>
            <AppLink href="/dashboard/account">Account</AppLink>
            <Button onClick={handleLogout}>Log Out</Button>
          </Dropdown>
        ) : (
          <button onClick={toggleLoginModal} className={styles.link}>Sign Up / Log In</button>
        )}
        <HiOutlineShoppingBag className={styles.icon} />
      </div>
      <div className={styles.categories}>
        <Link href="#">Rods</Link>
        <Link href="#">Reels</Link>
        <Link href="#">Combos</Link>
        <Link href="#">Baits</Link>
        <Link href="#">Lures</Link>
        <Link href="#">Tackle</Link>
        <Link href="#">Line</Link>
        <Link href="#">Storage</Link>
        <Link href="#">Apparel</Link>
        <Link href="#">Bargain Bin</Link>
      </div>

      {/* Login Modal */}
      <Modal isOpen={isLoginModalOpen} onClose={toggleLoginModal} >
        <div className={styles.modalHeader}>
          <h6>Log In</h6>
          <Button
            style="dark"
            round
            outline
            onClick={toggleRegisterModal}>
            Register
          </Button>
        </div>
        <LoginForm onSubmit={handleLoginSubmit} />
      </Modal>

      {/* Register Modal */}
      <Modal isOpen={isRegisterModalOpen} onClose={toggleRegisterModal}>
        <h6>Create Your Account</h6>
        <RegisterForm onSubmit={handleRegisterSubmit}></RegisterForm>
      </Modal>
    </nav>
  );
}
