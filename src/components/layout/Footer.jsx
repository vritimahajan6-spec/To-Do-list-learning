/**
 * @file Footer.jsx
 * @description Simple application footer.
 * Demonstrates: Minimal presentational component.
 */

import styles from '../../assets/styles/layout.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.footerText}>
        © {new Date().getFullYear()} React Todo Learning App — built to demonstrate React concepts.
      </p>
    </footer>
  );
}
