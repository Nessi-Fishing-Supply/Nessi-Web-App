import React from 'react';
import styles from './Navbar.module.scss';
import NotificationBar from '@components/NotificationBar';
import LogoFull from '@logos/logo_full.svg';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { HiSearch } from 'react-icons/hi';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
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
    </nav>
  );
}
