/**
 * @file todoApi.js
 * @description Todo CRUD API functions.
 * Demonstrates: RESTful API conventions, query params, HTTP methods.
 */

import apiClient from './apiClient';

/** @param {object} params - Filter/sort/search params */
export async function getTodos(params = {}) {
  const { data } = await apiClient.get('/todos', { params });
  return data;
}

/** @param {string} id */
export async function getTodoById(id) {
  const { data } = await apiClient.get(`/todos/${id}`);
  return data;
}

/** @param {{ title: string, description?: string, priority: string, dueDate?: string }} todoData */
export async function createTodo(todoData) {
  const { data } = await apiClient.post('/todos', todoData);
  return data;
}

/** @param {string} id @param {object} todoData */
export async function updateTodo(id, todoData) {
  const { data } = await apiClient.put(`/todos/${id}`, todoData);
  return data;
}

/** @param {string} id @param {object} patch */
export async function patchTodo(id, patch) {
  const { data } = await apiClient.patch(`/todos/${id}`, patch);
  return data;
}

/** @param {string} id */
export async function deleteTodo(id) {
  const { data } = await apiClient.delete(`/todos/${id}`);
  return data;
}
