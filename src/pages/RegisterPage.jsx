/**
 * @file RegisterPage.jsx
 * @description Public registration page.
 * Demonstrates: Page-level component.
 */

import RegisterForm from '../components/auth/RegisterForm';
import styles from '../assets/styles/auth.module.css';

export default function RegisterPage() {
  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <RegisterForm />
      </div>
    </div>
  );
}
