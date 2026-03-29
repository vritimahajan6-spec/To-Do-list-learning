/**
 * @file Header.jsx
 * @description Application header with navigation, user info, theme toggle, logout.
 *
 * Demonstrates:
 *  - NavLink active styling from react-router-dom
 *  - Consuming multiple contexts (auth + theme)
 *  - Conditional rendering based on auth state and user role
 */

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { ROLES } from '../../utils/constants';
import styles from '../../assets/styles/layout.module.css';
import { FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {/* Brand */}
        <NavLink to="/dashboard" className={styles.brand}>
          ✅ TodoApp
        </NavLink>

        {/* Navigation */}
        <nav className={styles.nav} aria-label="Main navigation">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              [styles.navLink, isActive ? styles.navLinkActive : ''].join(' ')
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              [styles.navLink, isActive ? styles.navLinkActive : ''].join(' ')
            }
          >
            Profile
          </NavLink>
        </nav>

        {/* Right section */}
        <div className={styles.headerRight}>
          {user && (
            <span className={styles.userInfo}>
              <FiUser className={styles.userIcon} />
              {user.name}
              {user.role === ROLES.ADMIN && (
                <span className={styles.adminBadge}>Admin</span>
              )}
            </span>
          )}

          {/* Theme toggle */}
          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>

          {/* Logout */}
          <button
            className={[styles.iconBtn, styles.logoutBtn].join(' ')}
            onClick={logout}
            aria-label="Log out"
          >
            <FiLogOut />
            <span className={styles.logoutLabel}>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
