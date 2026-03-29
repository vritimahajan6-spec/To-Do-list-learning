/**
 * @file TodoStats.jsx
 * @description Displays aggregate statistics about the todo list.
 *
 * Demonstrates:
 *  - useMemo: expensive computation memoised so it only runs when todos change
 *  - Derived state: stats are computed from props, not stored separately
 */

import { useMemo } from 'react';
import styles from '../../assets/styles/todo.module.css';

export default function TodoStats({ todos = [] }) {
  // useMemo ensures this only recalculates when the todos array changes
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, active, completionRate };
  }, [todos]);

  return (
    <div className={styles.stats}>
      <div className={styles.statCard}>
        <span className={styles.statNumber}>{stats.total}</span>
        <span className={styles.statLabel}>Total</span>
      </div>
      <div className={styles.statCard}>
        <span className={[styles.statNumber, styles.statActive].join(' ')}>
          {stats.active}
        </span>
        <span className={styles.statLabel}>Active</span>
      </div>
      <div className={styles.statCard}>
        <span className={[styles.statNumber, styles.statCompleted].join(' ')}>
          {stats.completed}
        </span>
        <span className={styles.statLabel}>Completed</span>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statNumber}>{stats.completionRate}%</span>
        <span className={styles.statLabel}>Done</span>
      </div>
    </div>
  );
}
