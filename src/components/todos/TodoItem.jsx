/**
 * @file TodoItem.jsx
 * @description Single todo item with toggle, edit and delete actions.
 *
 * Demonstrates:
 *  - React.memo with custom comparison
 *  - Conditional rendering ({condition && <Element />})
 *  - Event handling (onClick, onChange)
 *  - Dynamic class names for priority and completed state
 */

import { memo } from 'react';
import { formatDate } from '../../utils/helpers';
import styles from '../../assets/styles/todo.module.css';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const TodoItem = memo(function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const priorityClass = styles[`priority-${todo.priority}`] || '';

  return (
    <li className={[styles.todoItem, todo.completed ? styles.todoCompleted : ''].join(' ')}>
      {/* Completion toggle */}
      <input
        type="checkbox"
        className={styles.todoCheckbox}
        checked={todo.completed}
        onChange={() => onToggle(todo.id, !todo.completed)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'active' : 'completed'}`}
      />

      {/* Content */}
      <div className={styles.todoContent}>
        <div className={styles.todoTitleRow}>
          <span className={styles.todoTitle}>{todo.title}</span>
          <span className={[styles.priorityBadge, priorityClass].join(' ')}>
            {todo.priority}
          </span>
        </div>

        {/* Description – only shown when present */}
        {todo.description && (
          <p className={styles.todoDescription}>{todo.description}</p>
        )}

        {/* Due date – only shown when set */}
        {todo.dueDate && (
          <span className={styles.todoDueDate}>
            📅 Due: {formatDate(todo.dueDate)}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className={styles.todoActions}>
        <button
          className={styles.iconBtnSm}
          onClick={() => onEdit(todo)}
          aria-label={`Edit "${todo.title}"`}
        >
          <FiEdit2 />
        </button>
        <button
          className={[styles.iconBtnSm, styles.deleteBtn].join(' ')}
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete "${todo.title}"`}
        >
          <FiTrash2 />
        </button>
      </div>
    </li>
  );
});

export default TodoItem;
