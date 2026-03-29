// ============================================================
// ConfirmDialog.jsx
// Demonstrates: React Portals, props, event handling
// ============================================================

import { createPortal } from 'react-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import styles from '../../assets/styles/common.module.css';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.overlay}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className={styles.confirm}>
        <div className={styles.confirmIcon}>
          <FiAlertTriangle color="var(--color-warning)" />
        </div>
        <h3 id="confirm-title" className={styles.confirmTitle}>
          {title}
        </h3>
        <p className={styles.confirmMessage}>{message}</p>
        <div className={styles.confirmActions}>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById('portal-root'),
  );
}
