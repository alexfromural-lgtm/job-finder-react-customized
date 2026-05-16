import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Page Not Found');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        gap: '1.25rem',
        textAlign: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '6rem', fontWeight: 700, margin: 0, lineHeight: 1, color: '#4f46e5' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
        Page Not Found
      </h2>
      <p style={{ color: '#6b7280', maxWidth: '360px', margin: 0 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          marginTop: '0.5rem',
          padding: '0.75rem 1.5rem',
          background: '#4f46e5',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
