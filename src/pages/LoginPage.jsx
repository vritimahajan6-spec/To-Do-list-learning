/**
 * @file LoginPage.jsx
 * @description Public login page.
 * Demonstrates: Page-level component, centering layout.
 */

import LoginForm from '../components/auth/LoginForm';
import styles from '../assets/styles/auth.module.css';

export default function LoginPage() {
  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <LoginForm />
      </div>
    </div>
  );
}
