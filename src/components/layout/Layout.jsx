/**
 * @file Layout.jsx
 * @description Shared page layout wrapping Header, Outlet (child route content), Footer.
 *
 * Demonstrates:
 *  - Outlet from react-router-dom for nested route rendering
 *  - Consuming ThemeContext for data-theme attribute on the wrapper
 */

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../../hooks/useTheme';
import styles from '../../assets/styles/layout.module.css';

export default function Layout() {
  const { theme } = useTheme();

  return (
    <div className={styles.appWrapper} data-theme={theme}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
