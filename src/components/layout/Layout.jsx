// ============================================================
// Layout.jsx — Shared layout wrapper with Outlet
// Demonstrates: Composition pattern, react-router Outlet
// ============================================================

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import styles from '../../assets/styles/layout.module.css';

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Header />
      {/* Outlet renders the matched child route component */}
      <main className={styles.main}>
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
