/**
 * @file Button.jsx
 * @description Reusable button component with variants, sizes and loading state.
 *
 * Demonstrates:
 *  - React.memo to prevent unnecessary re-renders
 *  - Props API design for reusable components
 *  - Conditional class names
 */

import { memo } from 'react';
import styles from '../../assets/styles/common.module.css';
import { Spinner } from './Spinner';

const Button = memo(function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      className={[
        styles.btn,
        styles[`btn-${variant}`],
        styles[`btn-${size}`],
        loading ? styles.btnLoading : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
});

export default Button;
