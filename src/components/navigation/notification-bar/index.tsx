import React from 'react';
import Link from 'next/link';
import styles from './notification-bar.module.scss';
import { HiChevronRight } from 'react-icons/hi';

export default function NotificationBar() {
  return (
    <div className={styles.container} role="banner">
      <p className={styles.text}>Maker&apos;s Week | Shop Unique and Custom Baits</p>
      <Link href="/" className={styles.link}>
        <span>Shop Now</span>
        <HiChevronRight className={styles.icon} aria-hidden="true" />
      </Link>
    </div>
  );
}
