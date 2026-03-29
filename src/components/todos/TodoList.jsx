/**
 * @file TodoList.jsx
 * @description Renders the list of todos.
 *
 * Demonstrates:
 *  - Array rendering with .map() and unique keys
 *  - React.memo to avoid re-renders when props are unchanged
 *  - Empty state / loading state conditional rendering
 *  - Lifting handlers down as props
 */

import { memo } from 'react';
import TodoItem from './TodoItem';
import Spinner from '../common/Spinner';
import styles from '../../assets/styles/todo.module.css';

const TodoList = memo(function TodoList({
  todos,
  isLoading,
  onToggle,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className={styles.listCenter}>
        <Spinner size="lg" />
        <p className={styles.listHint}>Loading todos…</p>
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyIcon}>📋</p>
        <p className={styles.emptyTitle}>No todos yet</p>
        <p className={styles.emptyHint}>Click &quot;Add Todo&quot; to create your first task.</p>
      </div>
    );
  }

  return (
    <ul className={styles.todoList} aria-label="Todo items">
      {/* Each item MUST have a stable, unique key – never use array index for dynamic lists */}
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
});

export default TodoList;
