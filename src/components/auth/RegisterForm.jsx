// ============================================================
// RegisterForm.jsx
// Demonstrates: react-hook-form, Zod schema with .refine(),
//               form validation, navigation after success
// ============================================================

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerSchema } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import styles from '../../assets/styles/auth.module.css';

export default function RegisterForm() {
  const { register: registerUser, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      toast.success('Account created! Welcome!');
      navigate('/dashboard');
    } catch {
      // Error stored in context
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>✅</div>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>Start managing your todos</p>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <Input
            id="name"
            label="Full name"
            placeholder="Jane Doe"
            error={errors.name?.message}
            {...register('name')}
          />

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
            placeholder="Min 8 chars, uppercase, number, special"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            id="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className={styles.divider}>
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
