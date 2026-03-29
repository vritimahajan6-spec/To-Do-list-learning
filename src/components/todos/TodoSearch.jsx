/**
 * @file TodoSearch.jsx
 * @description Search input with debouncing to avoid excessive API calls.
 *
 * Demonstrates:
 *  - useRef for accessing DOM element imperatively
 *  - useCallback to stabilise handler reference
 *  - useDebounce custom hook
 *  - Controlled input with local state + debounced propagation
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import styles from '../../assets/styles/todo.module.css';
import { FiSearch, FiX } from 'react-icons/fi';

export default function TodoSearch({ value, onChange }) {
  // Local state for instant UI feedback
  const [localValue, setLocalValue] = useState(value || '');
  const inputRef = useRef(null);

  // Debounce the local value – only fire onChange after 400 ms of inactivity
  const debouncedValue = useDebounce(localValue, 400);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  // Sync if parent resets the value (e.g. clear filters)
  useEffect(() => {
    if (value === '' && localValue !== '') {
      setLocalValue('');
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback((e) => {
    setLocalValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setLocalValue('');
    inputRef.current?.focus();
  }, []);

  return (
    <div className={styles.searchWrapper}>
      <FiSearch className={styles.searchIcon} aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        className={styles.searchInput}
        placeholder="Search todos…"
        value={localValue}
        onChange={handleChange}
        aria-label="Search todos"
      />
      {localValue && (
        <button
          className={styles.searchClear}
          onClick={handleClear}
          aria-label="Clear search"
          type="button"
        >
          <FiX />
        </button>
      )}
    </div>
  );
}
