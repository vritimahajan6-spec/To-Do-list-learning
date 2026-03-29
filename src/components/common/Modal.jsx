// ============================================================
// Modal.jsx
// Demonstrates: React Portals, useEffect (focus trap), ESC key
// ============================================================

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import styles from '../../assets/styles/common.module.css';
import Button from './Button';

export default function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Focus the modal when it opens
  useEffect(() => {
    if (isOpen) modalRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  // createPortal renders into #portal-root (outside the React tree root)
  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={styles.modal}
        tabIndex={-1}
      >
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>
            {title}
          </h2>
          <Button variant="icon" onClick={onClose} aria-label="Close modal">
            <FiX size={20} />
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.getElementById('portal-root'),
  );
}
