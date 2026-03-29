// ============================================================
// TodoFilters.jsx — Status, priority & sort filters
// Demonstrates: lifting state up, controlled selects
// ============================================================

import { FILTER_STATUS, PRIORITIES, SORT_BY } from '../../utils/constants';
import styles from '../../assets/styles/todo.module.css';

export default function TodoFilters({ filters, onChange }) {
  const handle = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className={styles.filters}>
      {/* Status filter */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Status</label>
        <select
          className={styles.filterSelect}
          value={filters.status}
          onChange={handle('status')}
          aria-label="Filter by status"
        >
          <option value={FILTER_STATUS.ALL}>All</option>
          <option value={FILTER_STATUS.ACTIVE}>Active</option>
          <option value={FILTER_STATUS.COMPLETED}>Completed</option>
        </select>
      </div>

      {/* Priority filter */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Priority</label>
        <select
          className={styles.filterSelect}
          value={filters.priority}
          onChange={handle('priority')}
          aria-label="Filter by priority"
        >
          <option value="all">All</option>
          <option value={PRIORITIES.LOW}>Low</option>
          <option value={PRIORITIES.MEDIUM}>Medium</option>
          <option value={PRIORITIES.HIGH}>High</option>
        </select>
      </div>

      {/* Sort by */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Sort by</label>
        <select
          className={styles.filterSelect}
          value={filters.sortBy}
          onChange={handle('sortBy')}
          aria-label="Sort todos"
        >
          <option value={SORT_BY.DATE}>Created date</option>
          <option value={SORT_BY.PRIORITY}>Priority</option>
          <option value={SORT_BY.DUE_DATE}>Due date</option>
        </select>
      </div>
    </div>
  );
}
