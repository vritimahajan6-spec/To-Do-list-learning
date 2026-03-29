// ============================================================
// NotFoundPage.jsx — 404 page
// Demonstrates: useNavigate, conditional rendering
// ============================================================

import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        gap: 'var(--spacing-md)',
      }}
    >
      <div style={{ fontSize: '5rem' }}>🔍</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>404 — Page Not Found</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>
        The page you are looking for does not exist.
      </p>
      <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
    </div>
  );
}
