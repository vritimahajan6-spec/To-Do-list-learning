// ============================================================
// LoginForm.jsx
// Demonstrates: react-hook-form, Zod validation, useAuth,
//               controlled inputs, event handling
// ============================================================

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginSchema } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import styles from '../../assets/styles/auth.module.css';

export default function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  // react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      // Error already stored in AuthContext state
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>✅</div>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>

        {/* Show auth error from context */}
        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Your password"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className={styles.row}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" {...register('rememberMe')} />
              Remember me
            </label>
          </div>

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className={styles.divider}>
          No account?{' '}
          <Link to="/register">Create one</Link>
        </p>

        {/* Demo credentials hint */}
        <p style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          Demo: admin@example.com / Admin@123
        </p>
      </div>
    </div>
  );
}
