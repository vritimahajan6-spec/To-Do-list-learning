// ============================================================
// TodoList.jsx
// Demonstrates: Lists & Keys, conditional rendering,
//               props (filteredTodos, callbacks)
// ============================================================

import TodoItem from './TodoItem';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import styles from '../../assets/styles/todo.module.css';

export default function TodoList({
  todos,
  isLoading,
  isError,
  error,
  onToggle,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}) {
  // Conditional rendering: loading state
  if (isLoading) return <Spinner />;

  // Conditional rendering: error state
  if (isError) {
    return (
      <ErrorMessage
        message={error?.response?.data?.message || 'Failed to load todos'}
      />
    );
  }

  // Conditional rendering: empty state
  if (todos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📝</div>
        <p className={styles.emptyTitle}>No todos found</p>
        <p>Add a new todo or adjust your filters.</p>
      </div>
    );
  }

  return (
    // Lists & Keys: each TodoItem needs a unique key
    <div className={styles.container}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}   // stable unique key
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}
