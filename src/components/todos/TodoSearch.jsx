// ============================================================
// TodoSearch.jsx — Debounced search input
// Demonstrates: controlled input, useDebounce, lifting state up
// ============================================================

import { FiSearch } from 'react-icons/fi';
import styles from '../../assets/styles/todo.module.css';

export default function TodoSearch({ value, onChange }) {
  return (
    <div className={styles.searchWrap}>
      <FiSearch className={styles.searchIcon} size={16} />
      <input
        type="search"
        className={styles.searchInput}
        placeholder="Search todos…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search todos"
      />
    </div>
  );
}
