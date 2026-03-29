/**
 * @file TodoForm.jsx
 * @description Add / edit todo form, reused for both create and update.
 *
 * Demonstrates:
 *  - react-hook-form with defaultValues for editing
 *  - Resetting form values when initialValues prop changes (useEffect)
 *  - Select element registration with react-hook-form
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from '../../assets/styles/todo.module.css';

export default function TodoForm({ onSubmit, initialValues, isSubmitting, onCancel }) {
  const isEditing = !!initialValues;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: initialValues || {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
    },
  });

  // When editing a different todo, reset form with new values
  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    } else {
      reset({ title: '', description: '', priority: 'medium', dueDate: '' });
    }
  }, [initialValues, reset]);

  return (
    <form className={styles.todoForm} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Title *"
        type="text"
        placeholder="What needs to be done?"
        error={errors.title?.message}
        {...register('title')}
      />

      <div className={styles.fieldWrapper}>
        <label className={styles.label} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className={[styles.textarea, errors.description ? styles.inputError : '']
            .filter(Boolean)
            .join(' ')}
          placeholder="Optional details…"
          rows={3}
          {...register('description')}
        />
        {errors.description && (
          <span className={styles.errorText}>{errors.description.message}</span>
        )}
      </div>

      <div className={styles.formRow}>
        <div className={styles.fieldWrapper}>
          <label className={styles.label} htmlFor="priority">
            Priority *
          </label>
          <select
            id="priority"
            className={[styles.select, errors.priority ? styles.inputError : '']
              .filter(Boolean)
              .join(' ')}
            {...register('priority')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && (
            <span className={styles.errorText}>{errors.priority.message}</span>
          )}
        </div>

        <Input
          label="Due date"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
      </div>

      <div className={styles.formActions}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? 'Save Changes' : 'Add Todo'}
        </Button>
      </div>
    </form>
  );
}
