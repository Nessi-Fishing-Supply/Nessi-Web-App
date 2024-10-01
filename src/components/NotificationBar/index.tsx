import React from 'react';
import styles from './NotificationBar.module.scss';

export default function NotificationBar() {
  return (
    <div className={styles.container}>
      <p className={styles.text}>Maker’s Week | Shop Unique and Custom Baits</p>
      <a className={styles.link}>
        Link Text
        {/* TODO: Setup Icons */}
        <span>^</span>
      </a>
    </div>
  );
}
