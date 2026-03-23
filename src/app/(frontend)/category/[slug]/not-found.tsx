import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: 'var(--space-3xl) var(--space-sm)',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-sm)' }}>
        Category Not Found
      </h1>
      <p
        style={{
          color: 'var(--color-gray-600)',
          fontSize: 'var(--font-size-base)',
          marginBottom: 'var(--space-md)',
        }}
      >
        The category you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/"
        style={{
          color: 'var(--color-primary-600)',
          fontSize: 'var(--font-size-base)',
          textDecoration: 'none',
        }}
      >
        Back to home
      </Link>
    </div>
  );
}
