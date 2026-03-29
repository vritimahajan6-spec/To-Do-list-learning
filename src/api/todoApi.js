// ============================================================
// todoApi.js — Todo-related API calls
// Demonstrates: RESTful CRUD with axios
// ============================================================

import apiClient from './apiClient';

export const todoApi = {
  getAll: () => apiClient.get('/todos'),
  create: (todo) => apiClient.post('/todos', todo),
  update: (id, updates) => apiClient.put(`/todos/${id}`, updates),
  remove: (id) => apiClient.delete(`/todos/${id}`),
  toggle: (id) => apiClient.patch(`/todos/${id}/toggle`),
};
