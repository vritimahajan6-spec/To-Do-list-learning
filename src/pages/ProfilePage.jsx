// ============================================================
// ProfilePage.jsx — User profile page
// Demonstrates: React.lazy + Suspense (lazy-loaded page),
//               useAuth, useEffect, useState
// ============================================================

import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/authApi';
import Spinner from '../components/common/Spinner';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect: fetch full profile on mount
  useEffect(() => {
    authApi
      .getProfile()
      .then(({ data }) => setProfile(data))
      .catch(() => setProfile(user))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Spinner />;

  const p = profile || user;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 'var(--spacing-lg)' }}>
        Profile
      </h1>

      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-xl)',
        }}
      >
        {/* Avatar placeholder */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: '#fff',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          {p?.name?.[0]?.toUpperCase() || '?'}
        </div>

        <dl style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
          {[
            ['Name', p?.name],
            ['Email', p?.email],
            ['Role', p?.role],
          ].map(([label, value]) => (
            <div key={label}>
              <dt style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                {label}
              </dt>
              <dd style={{ fontWeight: 500 }}>{value || '—'}</dd>
            </div>
          ))}
        </dl>

        <button
          onClick={logout}
          style={{
            marginTop: 'var(--spacing-lg)',
            padding: '8px 20px',
            background: 'var(--color-danger)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
