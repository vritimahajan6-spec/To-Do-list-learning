// ============================================================
// Footer.jsx — Simple footer
// ============================================================

import styles from '../../assets/styles/layout.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        © {new Date().getFullYear()} TodoApp Learning — Built with React + Vite
      </p>
    </footer>
  );
}
