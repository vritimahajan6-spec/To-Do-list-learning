// ============================================================
// todoHandlers.js — Dummy CRUD operations backed by localStorage
// Each todo: { id, userId, title, description, priority,
//              completed, createdAt, updatedAt, dueDate }
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import { DB_TODOS_KEY } from '../../utils/constants';

function getTodos() {
  return JSON.parse(localStorage.getItem(DB_TODOS_KEY) || '[]');
}

function saveTodos(todos) {
  localStorage.setItem(DB_TODOS_KEY, JSON.stringify(todos));
}

// Validate that the requesting user owns the todo (or is admin)
function assertOwner(todo, userId, role) {
  if (role !== 'admin' && todo.userId !== userId) {
    throw { status: 403, message: 'Forbidden' };
  }
}

export async function handleGetTodos({ userId, role }) {
  const todos = getTodos();
  const result = role === 'admin' ? todos : todos.filter((t) => t.userId === userId);
  return result;
}

export async function handleCreateTodo({ userId, body }) {
  const todos = getTodos();
  const todo = {
    id: uuidv4(),
    userId,
    title: body.title,
    description: body.description || '',
    priority: body.priority || 'medium',
    completed: false,
    dueDate: body.dueDate || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  todos.push(todo);
  saveTodos(todos);
  return todo;
}

export async function handleUpdateTodo({ userId, role, todoId, body }) {
  const todos = getTodos();
  const idx = todos.findIndex((t) => t.id === todoId);
  if (idx === -1) throw { status: 404, message: 'Todo not found' };

  assertOwner(todos[idx], userId, role);

  todos[idx] = {
    ...todos[idx],
    ...body,
    id: todos[idx].id,
    userId: todos[idx].userId,
    createdAt: todos[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };
  saveTodos(todos);
  return todos[idx];
}

export async function handleDeleteTodo({ userId, role, todoId }) {
  const todos = getTodos();
  const idx = todos.findIndex((t) => t.id === todoId);
  if (idx === -1) throw { status: 404, message: 'Todo not found' };

  assertOwner(todos[idx], userId, role);

  todos.splice(idx, 1);
  saveTodos(todos);
  return { message: 'Todo deleted' };
}

export async function handleToggleTodo({ userId, role, todoId }) {
  const todos = getTodos();
  const idx = todos.findIndex((t) => t.id === todoId);
  if (idx === -1) throw { status: 404, message: 'Todo not found' };

  assertOwner(todos[idx], userId, role);

  todos[idx].completed = !todos[idx].completed;
  todos[idx].updatedAt = new Date().toISOString();
  saveTodos(todos);
  return todos[idx];
}
