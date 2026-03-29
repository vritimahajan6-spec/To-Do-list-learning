// ============================================================
// Input.jsx
// Demonstrates: forwardRef (allows parent to access DOM node),
//               props, controlled inputs, composition
// ============================================================

import { forwardRef } from 'react';
import styles from '../../assets/styles/common.module.css';

// forwardRef lets parent components attach a ref to the <input>
const Input = forwardRef(function Input(
  { label, error, id, type = 'text', className = '', ...rest },
  ref,
) {
  return (
    <div className={styles.fieldWrapper}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        ref={ref}           // forwarded ref attached to the DOM input
        id={id}
        type={type}
        className={`${styles.input} ${error ? styles.inputError : ''} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <span id={`${id}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

export default Input;
