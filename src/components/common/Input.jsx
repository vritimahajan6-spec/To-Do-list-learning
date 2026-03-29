/**
 * @file Input.jsx
 * @description Reusable input component with forwardRef, label and error display.
 *
 * Demonstrates:
 *  - React.forwardRef for library-compatible inputs (react-hook-form)
 *  - Controlled vs uncontrolled inputs
 *  - Composable form-field pattern
 */

import { forwardRef } from 'react';
import styles from '../../assets/styles/common.module.css';

const Input = forwardRef(function Input(
  { label, error, id, type = 'text', className = '', ...rest },
  ref
) {
  const inputId = id || rest.name;

  return (
    <div className={styles.fieldWrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={[
          styles.input,
          error ? styles.inputError : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error && (
        <span id={`${inputId}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

export default Input;
