/**
 * @file ErrorMessage.jsx
 * @description Formats and displays error messages consistently.
 * Demonstrates: Defensive rendering, normalising different error shapes.
 */

import styles from '../../assets/styles/common.module.css';

export default function ErrorMessage({ error, className = '' }) {
  if (!error) return null;

  // Normalise various error shapes into a plain string
  const message =
    typeof error === 'string'
      ? error
      : error?.response?.data?.message || error?.message || 'An unexpected error occurred';

  return (
    <div className={[styles.errorMessage, className].filter(Boolean).join(' ')} role="alert">
      <span className={styles.errorIcon}>⚠</span>
      <span>{message}</span>
    </div>
  );
}
