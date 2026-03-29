// ============================================================
// Header.jsx — Navigation header
// Demonstrates: useAuth, useTheme, NavLink, conditional rendering
// ============================================================

import { NavLink, Link } from 'react-router-dom';
import { FiSun, FiMoon, FiLogOut, FiUser, FiCheckSquare } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { THEMES, ROLES } from '../../utils/constants';
import Button from '../common/Button';
import styles from '../../assets/styles/layout.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {/* Brand / Logo — uses Link from react-router-dom */}
        <Link to="/dashboard" className={styles.brand}>
          <FiCheckSquare className={styles.brandIcon} />
          <span>TodoApp</span>
        </Link>

        <nav className={styles.nav}>
          {/* NavLink applies 'active' class automatically */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            Profile
          </NavLink>

          {/* Role-based rendering: admin panel link only for admins */}
          {user?.role === ROLES.ADMIN && (
            <span className={styles.roleTag}>Admin</span>
          )}

          {/* User info */}
          {user && (
            <span className={styles.userInfo}>
              <FiUser size={14} />
              {user.name}
            </span>
          )}

          {/* Theme toggle button */}
          <Button
            variant="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === THEMES.LIGHT ? 'dark' : 'light'} mode`}
          >
            {theme === THEMES.LIGHT ? <FiMoon size={18} /> : <FiSun size={18} />}
          </Button>

          {/* Logout button */}
          <Button
            variant="icon"
            onClick={logout}
            aria-label="Logout"
            title="Logout"
          >
            <FiLogOut size={18} />
          </Button>
        </nav>
      </div>
    </header>
  );
}
