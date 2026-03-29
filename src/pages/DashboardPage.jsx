// ============================================================
// DashboardPage.jsx — Main todo page
// Demonstrates: lifting state up, useState for filters,
//               useDebounce, useTodos, useCallback
// ============================================================

import { useState, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useTodos } from '../hooks/useTodos';
import { useDebounce } from '../hooks/useDebounce';
import { FILTER_STATUS, SORT_BY } from '../utils/constants';
import TodoList from '../components/todos/TodoList';
import TodoSearch from '../components/todos/TodoSearch';
import TodoFilters from '../components/todos/TodoFilters';
import TodoStats from '../components/todos/TodoStats';
import TodoForm from '../components/todos/TodoForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

const defaultFilters = {
  status: FILTER_STATUS.ALL,
  priority: 'all',
  sortBy: SORT_BY.DATE,
};

export default function DashboardPage() {
  // Filters are lifted up to DashboardPage and passed down
  const [filters, setFilters] = useState(defaultFilters);
  const [searchRaw, setSearchRaw] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  // Debounce search input (demonstrates useDebounce hook)
  const search = useDebounce(searchRaw, 400);

  // useTodos custom hook — all CRUD operations
  const {
    filteredTodos,
    stats,
    isLoading,
    isError,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTodos({ ...filters, search });

  const handleCreate = useCallback(
    (values) => {
      createTodo(values, { onSuccess: () => setShowCreate(false) });
    },
    [createTodo],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>My Todos</h1>
        <Button onClick={() => setShowCreate(true)}>
          <FiPlus /> New Todo
        </Button>
      </div>

      {/* Stats */}
      <TodoStats stats={stats} />

      {/* Search */}
      <TodoSearch value={searchRaw} onChange={setSearchRaw} />

      {/* Filters — lifting state up: filters live in DashboardPage */}
      <TodoFilters filters={filters} onChange={setFilters} />

      {/* List */}
      <TodoList
        todos={filteredTodos}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onToggle={toggleTodo}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />

      {/* Create modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Todo"
      >
        <TodoForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          isLoading={isCreating}
        />
      </Modal>
    </div>
  );
}
