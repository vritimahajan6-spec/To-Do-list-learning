/**
 * @file ConfirmDialog.jsx
 * @description Confirmation dialog rendered via ReactDOM.createPortal.
 * Demonstrates: Portal pattern, composable dialog component.
 */

import { createPortal } from 'react-dom';
import styles from '../../assets/styles/common.module.css';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger = false,
}) {
  if (!isOpen) return null;

  const portalRoot = document.getElementById('portal-root') || document.body;

  return createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.confirmPanel}>
        <h3 className={styles.confirmTitle}>{title}</h3>
        {message && <p className={styles.confirmMessage}>{message}</p>}
        <div className={styles.confirmActions}>
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    portalRoot
  );
}
