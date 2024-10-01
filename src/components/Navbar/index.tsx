import React from 'react';
import styles from './Navbar.module.scss';
import NotificationBar from '@components/NotificationBar';
import LogoFull from '@logos/logo_full.svg';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { HiSearch } from 'react-icons/hi';

export default function Navbar() {
  return (
    <div>
      <NotificationBar />
      <div className={styles.container}>
        <LogoFull className={styles.logo} />
        <form className={styles.form}>
          <input type="search" placeholder="Search Fishing Gear"></input>
          <button className={styles.form__button} type="submit">
            <HiSearch/>
          </button>
        </form>
        <button className={styles.button}>Sell Your Gear</button>
        <a className={styles.link}>Sign Up / Log In</a>
        <HiOutlineShoppingBag className={styles.icon}/>
      </div>
    </div>
  );
}
