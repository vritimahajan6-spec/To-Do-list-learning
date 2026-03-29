/**
 * @file RegisterForm.jsx
 * @description Registration form using react-hook-form + zod.
 *
 * Demonstrates:
 *  - Schema-level cross-field validation (confirmPassword)
 *  - Async form submission with error handling
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import styles from '../../assets/styles/auth.module.css';

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className={styles.formTitle}>Create Account</h1>

      {serverError && <ErrorMessage error={serverError} />}

      <Input
        label="Full name"
        type="text"
        placeholder="Jane Smith"
        error={errors.name?.message}
        {...register('name')}
      />

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

      <Input
        label="Confirm password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" loading={isSubmitting} className={styles.submitBtn}>
        Create Account
      </Button>

      <p className={styles.formFooter}>
        Already have an account?{' '}
        <Link to="/login" className={styles.formLink}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
