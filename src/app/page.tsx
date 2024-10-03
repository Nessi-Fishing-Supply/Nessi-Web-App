"use client";

import styles from './page.module.scss';
import Button from '@components/controls/Button';
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Action completed!');
    }, 2000); // Simulate an async operation
  };

  return (
    <div>
      <main>
        <h1>My H1 font Size</h1>
      </main>
    </div>
  );
}
