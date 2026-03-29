// ============================================================
// TodoForm.jsx — Create / Edit a todo
// Demonstrates: react-hook-form, Zod, controlled inputs,
//               defaultValues for editing
// ============================================================

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema } from '../../utils/validators';
import { PRIORITIES } from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from '../../assets/styles/todo.module.css';

export default function TodoForm({ onSubmit, onCancel, defaultValues, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: defaultValues || {
      title: '',
      description: '',
      priority: PRIORITIES.MEDIUM,
      dueDate: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formGrid} noValidate>
      <h3 className={styles.formTitle}>
        {defaultValues ? 'Edit Todo' : 'New Todo'}
      </h3>

      <Input
        id="title"
        label="Title *"
        placeholder="What needs to be done?"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label
          htmlFor="description"
          style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: 4 }}
        >
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Optional details…"
          style={{
            width: '100%',
            padding: '10px 8px',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            resize: 'vertical',
          }}
          {...register('description')}
        />
        {errors.description && (
          <span style={{ fontSize: '0.8rem', color: 'var(--color-danger)' }}>
            {errors.description.message}
          </span>
        )}
      </div>

      <div className={styles.formRow}>
        <div>
          <label
            htmlFor="priority"
            style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: 4 }}
          >
            Priority
          </label>
          <select
            id="priority"
            style={{
              width: '100%',
              padding: '10px 8px',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
            }}
            {...register('priority')}
          >
            <option value={PRIORITIES.LOW}>Low</option>
            <option value={PRIORITIES.MEDIUM}>Medium</option>
            <option value={PRIORITIES.HIGH}>High</option>
          </select>
          {errors.priority && (
            <span style={{ fontSize: '0.8rem', color: 'var(--color-danger)' }}>
              {errors.priority.message}
            </span>
          )}
        </div>

        <Input
          id="dueDate"
          label="Due date"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving…' : defaultValues ? 'Save changes' : 'Add todo'}
        </Button>
      </div>
    </form>
  );
}
