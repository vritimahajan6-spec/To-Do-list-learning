/**
 * @file ProfilePage.jsx
 * @description User profile page – lazy-loaded for code splitting demonstration.
 *
 * Demonstrates:
 *  - React.lazy + Suspense (code splitting)
 *  - Displaying user information from AuthContext
 *  - Simple in-place name editing with local state
 */

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';
import styles from '../assets/styles/auth.module.css';
import Button from '../components/common/Button';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  const handleSave = () => {
    // In a real app you would call an updateProfile API here
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard} style={{ maxWidth: 480 }}>
        <h1 className={styles.formTitle}>My Profile</h1>

        <div className={styles.profileSection}>
          <div className={styles.profileAvatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className={styles.profileInfo}>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  className={styles.profileNameInput}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
                <Button size="sm" onClick={handleSave}>Save</Button>
                <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className={styles.profileName}>{user.name}</span>
                <button
                  className={styles.editNameBtn}
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit name"
                >
                  ✏️
                </button>
              </div>
            )}
            <span className={styles.profileEmail}>{user.email}</span>
            <span className={styles.profileRole}>
              Role:{' '}
              <strong>
                {user.role === ROLES.ADMIN ? '🛡 Administrator' : '👤 User'}
              </strong>
            </span>
          </div>
        </div>

        <p className={styles.profileNote}>
          This page is <strong>lazy-loaded</strong> — it is split into a
          separate JS chunk and only downloaded when you visit this route.
          Open the Network tab to see the extra chunk load on first visit.
        </p>
      </div>
    </div>
  );
}
