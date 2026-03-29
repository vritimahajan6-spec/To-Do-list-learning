// ============================================================
// ErrorMessage.jsx — Displays an error string
// Demonstrates: conditional rendering, props
// ============================================================

import styles from '../../assets/styles/common.module.css';

export default function ErrorMessage({ message }) {
  if (!message) return null; // conditional rendering
  return (
    <div className={styles.errorBox} role="alert">
      {message}
    </div>
  );
}
