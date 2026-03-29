/**
 * @file Spinner.jsx
 * @description Animated loading spinner with size variants.
 * Demonstrates: Simple presentational component, CSS animation via module.
 */

import styles from '../../assets/styles/common.module.css';

export function Spinner({ size = 'md', className = '' }) {
  return (
    <span
      className={[styles.spinner, styles[`spinner-${size}`], className]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-label="Loading…"
    />
  );
}

export default Spinner;
