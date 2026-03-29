/**
 * @file useTodos.js
 * @description React Query hooks for todo CRUD operations.
 *
 * Demonstrates:
 *  - useQuery for data fetching with caching
 *  - useMutation for create/update/delete
 *  - Optimistic updates (update UI before server response)
 *  - Cache invalidation after mutations
 *  - Error rollback on optimistic updates
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getTodos,
  createTodo,
  updateTodo,
  patchTodo,
  deleteTodo,
} from '../api/todoApi';
import toast from 'react-hot-toast';

export const TODOS_QUERY_KEY = 'todos';

/**
 * Fetches todos with optional filters/search/sort params.
 * @param {object} params
 */
export function useTodosQuery(params = {}) {
  return useQuery({
    queryKey: [TODOS_QUERY_KEY, params],
    queryFn: () => getTodos(params),
    select: (data) => data.todos ?? [],
    staleTime: 30_000,
  });
}

/** Creates a new todo with cache invalidation. */
export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
      toast.success('Todo created!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create todo');
    },
  });
}

/** Updates an existing todo (full update). Uses optimistic updates. */
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateTodo(id, data),
    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [TODOS_QUERY_KEY] });
      const previousData = queryClient.getQueriesData({ queryKey: [TODOS_QUERY_KEY] });

      queryClient.setQueriesData({ queryKey: [TODOS_QUERY_KEY] }, (old) => {
        if (!old) return old;
        // Handle both array and object with todos property
        const todos = Array.isArray(old) ? old : old.todos;
        if (!todos) return old;
        const updated = todos.map((t) => (t.id === id ? { ...t, ...data } : t));
        return Array.isArray(old) ? updated : { ...old, todos: updated };
      });

      return { previousData };
    },
    onError: (err, _vars, context) => {
      // Roll back on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(err.response?.data?.message || 'Failed to update todo');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

/** Partial update (toggle complete, etc.). Uses optimistic updates. */
export function usePatchTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => patchTodo(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [TODOS_QUERY_KEY] });
      const previousData = queryClient.getQueriesData({ queryKey: [TODOS_QUERY_KEY] });

      queryClient.setQueriesData({ queryKey: [TODOS_QUERY_KEY] }, (old) => {
        if (!old) return old;
        const todos = Array.isArray(old) ? old : old.todos;
        if (!todos) return old;
        const updated = todos.map((t) => (t.id === id ? { ...t, ...data } : t));
        return Array.isArray(old) ? updated : { ...old, todos: updated };
      });

      return { previousData };
    },
    onError: (err, _vars, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(err.response?.data?.message || 'Failed to update todo');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

/** Deletes a todo with optimistic removal. */
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [TODOS_QUERY_KEY] });
      const previousData = queryClient.getQueriesData({ queryKey: [TODOS_QUERY_KEY] });

      queryClient.setQueriesData({ queryKey: [TODOS_QUERY_KEY] }, (old) => {
        if (!old) return old;
        const todos = Array.isArray(old) ? old : old.todos;
        if (!todos) return old;
        const updated = todos.filter((t) => t.id !== id);
        return Array.isArray(old) ? updated : { ...old, todos: updated };
      });

      return { previousData };
    },
    onError: (err, _id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(err.response?.data?.message || 'Failed to delete todo');
    },
    onSuccess: () => {
      toast.success('Todo deleted');
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}
