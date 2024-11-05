import React from 'react';
import styles from './SideNav.module.scss';
import { HiOutlineHome, HiOutlineUserCircle } from 'react-icons/hi';
import AppLink from '@components/controls/AppLink';

const SideNav = () => {
  return (
    <nav className={styles.sideNav}>
      <ul>
        <li>
          <AppLink href="/dashboard" icon={<HiOutlineHome />}>Dashboard</AppLink>
        </li>
        <li>
          <AppLink href="/dashboard/account" icon={<HiOutlineUserCircle />}>Account</AppLink>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
