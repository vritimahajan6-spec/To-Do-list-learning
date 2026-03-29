/**
 * @file Modal.jsx
 * @description Modal dialog rendered via ReactDOM.createPortal.
 *
 * Demonstrates:
 *  - ReactDOM.createPortal to escape CSS stacking context
 *  - useEffect for keyboard event listeners (Escape to close)
 *  - useRef + useClickOutside for overlay click
 */

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../assets/styles/common.module.css';

export default function Modal({ isOpen, onClose, title, children }) {
  const panelRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const portalRoot = document.getElementById('portal-root') || document.body;

  return createPortal(
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={styles.modalPanel} ref={panelRef}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>,
    portalRoot
  );
}
