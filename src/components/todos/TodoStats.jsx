// ============================================================
// TodoStats.jsx
// Demonstrates: useMemo (computed stats), presentational component
// ============================================================

import styles from '../../assets/styles/todo.module.css';

export default function TodoStats({ stats }) {
  const { total, active, completed } = stats;

  return (
    <div className={styles.stats}>
      <div className={styles.statCard}>
        <div className={styles.statNumber}>{total}</div>
        <div className={styles.statLabel}>Total</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statNumber}>{active}</div>
        <div className={styles.statLabel}>Active</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statNumber}>{completed}</div>
        <div className={styles.statLabel}>Done</div>
      </div>
    </div>
  );
}
