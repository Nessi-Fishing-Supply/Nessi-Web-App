'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
      <h2>Something went wrong</h2>
      <p>{error.message || 'An unexpected error occurred.'}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
