// ============================================================
// Button.jsx
// Demonstrates: React.memo (performance optimisation), props,
//               default props, children, forwardRef not needed here
// ============================================================

import { memo } from 'react';
import styles from '../../assets/styles/common.module.css';

// React.memo prevents re-renders when props haven't changed
const Button = memo(function Button({
  children,
  variant = 'primary', // 'primary' | 'danger' | 'ghost' | 'icon'
  size = 'md',         // 'md' | 'sm'
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) {
  const variantClass = {
    primary: styles.btnPrimary,
    danger: styles.btnDanger,
    ghost: styles.btnGhost,
    icon: styles.btnIcon,
  }[variant] || styles.btnPrimary;

  const sizeClass = size === 'sm' ? styles.btnSm : '';
  const widthClass = fullWidth ? styles.btnFull : '';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${styles.btn} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
