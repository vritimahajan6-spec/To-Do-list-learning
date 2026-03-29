/**
 * @file TodoFilters.jsx
 * @description Filter controls for the todo list.
 *
 * Demonstrates:
 *  - Lifting state up: parent owns filter state, this component is controlled
 *  - Controlled select components
 *  - Props as the single source of truth for form state
 */

import styles from '../../assets/styles/todo.module.css';

export default function TodoFilters({ filters, onFiltersChange }) {
  const handleChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className={styles.filters}>
      {/* Status filter */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-status">
          Status
        </label>
        <select
          id="filter-status"
          className={styles.filterSelect}
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Priority filter */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-priority">
          Priority
        </label>
        <select
          id="filter-priority"
          className={styles.filterSelect}
          value={filters.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Sort */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-sort">
          Sort by
        </label>
        <select
          id="filter-sort"
          className={styles.filterSelect}
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
        >
          <option value="createdAt">Created Date</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* Order */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-order">
          Order
        </label>
        <select
          id="filter-order"
          className={styles.filterSelect}
          value={filters.order}
          onChange={(e) => handleChange('order', e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}
