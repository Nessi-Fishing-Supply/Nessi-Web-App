import React from 'react';
import styles from './Navbar.module.scss';
import NotificationBar from '@components/NotificationBar';

export default function NavBar() {
  return (
    <div>
      <NotificationBar />
      <h1 className={styles.title}>Navbar component</h1>
    </div>
  );
}
