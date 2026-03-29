// ============================================================
// useTodos.js — React Query hooks for CRUD operations on todos
// Demonstrates: useQuery, useMutation, optimistic updates,
//               useMemo, invalidation
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { todoApi } from '../api/todoApi';
import { filterTodos, sortTodos, computeStats } from '../utils/helpers';

const TODOS_KEY = ['todos'];

export function useTodos({ status, priority, search, sortBy } = {}) {
  const queryClient = useQueryClient();

  // ---- Query ----
  const {
    data: todos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: TODOS_KEY,
    queryFn: async () => {
      const { data } = await todoApi.getAll();
      return data;
    },
  });

  // ---- Derived data with useMemo ----
  const filtered = useMemo(
    () => filterTodos(todos, { status, priority, search }),
    [todos, status, priority, search],
  );

  const sorted = useMemo(
    () => sortTodos(filtered, sortBy),
    [filtered, sortBy],
  );

  const stats = useMemo(() => computeStats(todos), [todos]);

  // ---- Create mutation ----
  const createMutation = useMutation({
    mutationFn: (newTodo) => todoApi.create(newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
      toast.success('Todo created!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create todo'),
  });

  // ---- Update mutation (optimistic) ----
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => todoApi.update(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: TODOS_KEY });
      const previous = queryClient.getQueryData(TODOS_KEY);
      queryClient.setQueryData(TODOS_KEY, (old = []) =>
        old.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(TODOS_KEY, context.previous);
      toast.error('Failed to update todo');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
      toast.success('Todo updated!');
    },
  });

  // ---- Delete mutation (optimistic) ----
  const deleteMutation = useMutation({
    mutationFn: (id) => todoApi.remove(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TODOS_KEY });
      const previous = queryClient.getQueryData(TODOS_KEY);
      queryClient.setQueryData(TODOS_KEY, (old = []) =>
        old.filter((t) => t.id !== id),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(TODOS_KEY, context.previous);
      toast.error('Failed to delete todo');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
      toast.success('Todo deleted!');
    },
  });

  // ---- Toggle mutation (optimistic) ----
  const toggleMutation = useMutation({
    mutationFn: (id) => todoApi.toggle(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TODOS_KEY });
      const previous = queryClient.getQueryData(TODOS_KEY);
      queryClient.setQueryData(TODOS_KEY, (old = []) =>
        old.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(TODOS_KEY, context.previous);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TODOS_KEY }),
  });

  return {
    todos,
    filteredTodos: sorted,
    stats,
    isLoading,
    isError,
    error,
    createTodo: createMutation.mutate,
    updateTodo: updateMutation.mutate,
    deleteTodo: deleteMutation.mutate,
    toggleTodo: toggleMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
