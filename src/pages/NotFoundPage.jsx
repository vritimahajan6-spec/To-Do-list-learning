/**
 * @file NotFoundPage.jsx
 * @description 404 page shown for unmatched routes.
 * Demonstrates: Catch-all route, Link component.
 */

import { Link } from 'react-router-dom';
import styles from '../assets/styles/auth.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.authPage}>
      <div className={styles.authCard} style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '5rem', margin: 0 }}>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/dashboard" className={styles.formLink}>
          ← Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
