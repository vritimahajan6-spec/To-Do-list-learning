// ============================================================
// TodoItem.jsx
// Demonstrates: React.memo, props destructuring, useCallback,
//               conditional rendering, event handling
// ============================================================

import { memo, useState, useCallback } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDate, isOverdue } from '../../utils/helpers';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import Modal from '../common/Modal';
import TodoForm from './TodoForm';
import styles from '../../assets/styles/todo.module.css';

// React.memo: only re-render when props change
const TodoItem = memo(function TodoItem({ todo, onToggle, onUpdate, onDelete, isUpdating, isDeleting }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // useCallback: stable reference for child callbacks
  const handleToggle = useCallback(() => onToggle(todo.id), [onToggle, todo.id]);
  const handleDelete = useCallback(() => setShowConfirm(true), []);
  const handleEdit = useCallback(() => setShowEdit(true), []);

  const confirmDelete = useCallback(() => {
    onDelete(todo.id);
    setShowConfirm(false);
  }, [onDelete, todo.id]);

  const handleUpdate = useCallback(
    (values) => {
      onUpdate({ id: todo.id, updates: values });
      setShowEdit(false);
    },
    [onUpdate, todo.id],
  );

  const overdue = !todo.completed && isOverdue(todo.dueDate);

  return (
    <>
      <div className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
        {/* Checkbox to toggle completion */}
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={todo.completed}
          onChange={handleToggle}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />

        <div className={styles.content}>
          <p className={`${styles.title} ${todo.completed ? styles.strikethrough : ''}`}>
            {todo.title}
          </p>

          {/* Conditional rendering: only show description if it exists */}
          {todo.description && (
            <p className={styles.description}>{todo.description}</p>
          )}

          <div className={styles.meta}>
            {/* Priority badge */}
            <span className={`${styles.badge} ${styles[todo.priority]}`}>
              {todo.priority}
            </span>

            {/* Due date — overdue styling */}
            {todo.dueDate && (
              <span className={`${styles.dueDate} ${overdue ? styles.overdue : ''}`}>
                {overdue ? '⚠ Overdue · ' : ''}
                {formatDate(todo.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className={styles.actions}>
          <Button
            variant="icon"
            size="sm"
            onClick={handleEdit}
            aria-label="Edit todo"
            disabled={isUpdating}
          >
            <FiEdit2 size={15} />
          </Button>
          <Button
            variant="icon"
            size="sm"
            onClick={handleDelete}
            aria-label="Delete todo"
            disabled={isDeleting}
          >
            <FiTrash2 size={15} />
          </Button>
        </div>
      </div>

      {/* Delete confirmation dialog (Portal) */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete todo?"
        message={`"${todo.title}" will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />

      {/* Edit modal (Portal) */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Todo">
        <TodoForm
          defaultValues={{
            title: todo.title,
            description: todo.description || '',
            priority: todo.priority,
            dueDate: todo.dueDate || '',
          }}
          onSubmit={handleUpdate}
          onCancel={() => setShowEdit(false)}
          isLoading={isUpdating}
        />
      </Modal>
    </>
  );
});

export default TodoItem;
