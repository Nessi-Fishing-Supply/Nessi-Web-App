import styles from './page.module.scss';
import Navbar from '@components/Navbar';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-inter',
});

export default function Home() {
  return (
    <div className={inter.className}>
      <main>
        <Navbar />
        <h1 className={styles.title}>The start of Nessi Fishing Supply&#39;s dev environment. I should be orange! Cache invalidation in Ci/CD</h1>
        <Link href="/marketplace">
          Go to Marketplace
        </Link>
      </main>
    </div>
  );
}
