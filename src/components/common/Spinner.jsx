// ============================================================
// Spinner.jsx — Loading indicator
// Demonstrates: simple presentational component
// ============================================================

import styles from '../../assets/styles/common.module.css';

export default function Spinner({ fullPage = false }) {
  // Conditional rendering based on prop
  if (fullPage) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.spinnerOverlay}>
      <div className={styles.spinner} />
    </div>
  );
}
