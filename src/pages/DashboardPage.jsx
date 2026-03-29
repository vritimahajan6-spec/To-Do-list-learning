/**
 * @file DashboardPage.jsx
 * @description Main todo dashboard page (protected).
 *
 * Demonstrates:
 *  - Composing multiple components together
 *  - Lifting state up (filters, search, modal visibility)
 *  - useCallback for stable handlers passed to memoised children
 *  - Wrapping list in ErrorBoundary
 *  - Optimistic UI via usePatchTodo
 */

import { useState, useCallback } from 'react';
import TodoSearch from '../components/todos/TodoSearch';
import TodoFilters from '../components/todos/TodoFilters';
import TodoStats from '../components/todos/TodoStats';
import TodoList from '../components/todos/TodoList';
import TodoForm from '../components/todos/TodoForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ErrorBoundary from '../components/common/ErrorBoundary';
import Button from '../components/common/Button';
import {
  useTodosQuery,
  useCreateTodo,
  useUpdateTodo,
  usePatchTodo,
  useDeleteTodo,
} from '../hooks/useTodos';
import styles from '../assets/styles/todo.module.css';

const DEFAULT_FILTERS = {
  status: 'all',
  priority: 'all',
  sortBy: 'createdAt',
  order: 'desc',
};

export default function DashboardPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const queryParams = { ...filters, search: search || undefined };
  const { data: todos = [], isLoading } = useTodosQuery(queryParams);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const { mutateAsync: createTodo, isPending: isCreating } = useCreateTodo();
  const { mutateAsync: updateTodo, isPending: isUpdating } = useUpdateTodo();
  const { mutateAsync: patchTodo } = usePatchTodo();
  const { mutateAsync: deleteTodo } = useDeleteTodo();

  // ── Handlers (useCallback keeps references stable for memoised children) ──
  const handleToggle = useCallback(
    (id, completed) => patchTodo({ id, data: { completed } }),
    [patchTodo]
  );

  const handleEdit = useCallback((todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id) => {
    setDeletingId(id);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (deletingId) {
      await deleteTodo(deletingId);
      setDeletingId(null);
    }
  }, [deletingId, deleteTodo]);

  const handleFormSubmit = useCallback(
    async (values) => {
      if (editingTodo) {
        await updateTodo({ id: editingTodo.id, data: values });
      } else {
        await createTodo(values);
      }
      setShowForm(false);
      setEditingTodo(null);
    },
    [editingTodo, createTodo, updateTodo]
  );

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingTodo(null);
  }, []);

  const handleSearchChange = useCallback((val) => setSearch(val), []);

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.pageTitle}>My Todos</h1>
        <Button onClick={() => setShowForm(true)}>+ Add Todo</Button>
      </div>

      <TodoSearch value={search} onChange={handleSearchChange} />
      <TodoFilters filters={filters} onFiltersChange={setFilters} />
      <TodoStats todos={todos} />

      {/* ErrorBoundary wraps only the list so an error there won't crash the full page */}
      <ErrorBoundary>
        <TodoList
          todos={todos}
          isLoading={isLoading}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ErrorBoundary>

      {/* Create / Edit modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingTodo ? 'Edit Todo' : 'New Todo'}
      >
        <TodoForm
          onSubmit={handleFormSubmit}
          initialValues={editingTodo}
          isSubmitting={isCreating || isUpdating}
          onCancel={handleCloseForm}
        />
      </Modal>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Todo"
        message="Are you sure you want to delete this todo? This action cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
