/**
 * @file LoginForm.jsx
 * @description Login form using react-hook-form + zod resolver.
 *
 * Demonstrates:
 *  - react-hook-form for form state management
 *  - Zod schema validation via @hookform/resolvers/zod
 *  - Controlled form fields with register()
 *  - Error messages from formState.errors
 *  - Tracking failed attempts for UI lockout feedback
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import styles from '../../assets/styles/auth.module.css';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await login({ email: values.email, password: values.password });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className={styles.formTitle}>Sign In</h1>

      {serverError && <ErrorMessage error={serverError} />}

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <label className={styles.checkboxLabel}>
        <input type="checkbox" {...register('rememberMe')} />
        Remember me
      </label>

      <Button type="submit" loading={isSubmitting} className={styles.submitBtn}>
        Sign In
      </Button>

      <p className={styles.formFooter}>
        Don&apos;t have an account?{' '}
        <Link to="/register" className={styles.formLink}>
          Create one
        </Link>
      </p>

      <div className={styles.demoCredentials}>
        <p><strong>Demo credentials:</strong></p>
        <p>Admin: admin@example.com / Admin@123</p>
        <p>User: user@example.com / User@123</p>
      </div>
    </form>
  );
}
