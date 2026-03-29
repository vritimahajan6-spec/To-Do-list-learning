/**
 * @file todoHandlers.js
 * @description Dummy backend todo CRUD handlers.
 * Demonstrates: CRUD operations, filtering/sorting, role-based data access.
 */

import { generateId } from '../../utils/helpers';
import { STORAGE_KEYS, ROLES } from '../../utils/constants';

// ─────────────────────────────────────────────
// Token helpers (inline to avoid circular deps)
// ─────────────────────────────────────────────

function parseToken(token) {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function getAuthUser(config) {
  const authHeader = config.headers?.Authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return null;
  return parseToken(token);
}

// ─────────────────────────────────────────────
// "Database" helpers
// ─────────────────────────────────────────────

function getTodosDb() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TODOS_DB) || '[]');
  } catch {
    return [];
  }
}

function saveTodosDb(todos) {
  localStorage.setItem(STORAGE_KEYS.TODOS_DB, JSON.stringify(todos));
}

// ─────────────────────────────────────────────
// Artificial delay
// ─────────────────────────────────────────────

function delay(min = 300, max = 800) {
  return new Promise((r) => setTimeout(r, Math.random() * (max - min) + min));
}

// ─────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────

async function handleGetTodos(config) {
  await delay();

  const authUser = getAuthUser(config);
  if (!authUser) return { status: 401, data: { message: 'Unauthorised' } };

  const params = config.params || {};
  let todos = getTodosDb();

  // Admins see all todos; regular users see only their own
  if (authUser.role !== ROLES.ADMIN) {
    todos = todos.filter((t) => t.userId === authUser.userId);
  }

  // Filter by status
  if (params.status === 'active') todos = todos.filter((t) => !t.completed);
  if (params.status === 'completed') todos = todos.filter((t) => t.completed);

  // Filter by priority
  if (params.priority && params.priority !== 'all') {
    todos = todos.filter((t) => t.priority === params.priority);
  }

  // Search
  if (params.search) {
    const q = params.search.toLowerCase();
    todos = todos.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
    );
  }

  // Sort
  const sortBy = params.sortBy || 'createdAt';
  const order = params.order || 'desc';
  const priorityWeight = { high: 3, medium: 2, low: 1 };

  todos.sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'title') cmp = a.title.localeCompare(b.title);
    else if (sortBy === 'priority')
      cmp = (priorityWeight[a.priority] || 0) - (priorityWeight[b.priority] || 0);
    else if (sortBy === 'dueDate')
      cmp =
        (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) -
        (b.dueDate ? new Date(b.dueDate).getTime() : Infinity);
    else
      cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return order === 'asc' ? cmp : -cmp;
  });

  return { status: 200, data: { todos, total: todos.length } };
}

async function handleGetTodoById(config, id) {
  await delay();

  const authUser = getAuthUser(config);
  if (!authUser) return { status: 401, data: { message: 'Unauthorised' } };

  const todos = getTodosDb();
  const todo = todos.find((t) => t.id === id);

  if (!todo) return { status: 404, data: { message: 'Todo not found' } };

  if (authUser.role !== ROLES.ADMIN && todo.userId !== authUser.userId) {
    return { status: 403, data: { message: 'Forbidden' } };
  }

  return { status: 200, data: { todo } };
}

async function handleCreateTodo(config) {
  await delay();

  const authUser = getAuthUser(config);
  if (!authUser) return { status: 401, data: { message: 'Unauthorised' } };

  const body = JSON.parse(config.data || '{}');
  if (!body.title) return { status: 400, data: { message: 'Title is required' } };

  const now = new Date().toISOString();
  const newTodo = {
    id: generateId(),
    userId: authUser.userId,
    title: body.title,
    description: body.description || '',
    priority: body.priority || 'medium',
    completed: false,
    dueDate: body.dueDate || null,
    createdAt: now,
    updatedAt: now,
  };

  const todos = getTodosDb();
  todos.push(newTodo);
  saveTodosDb(todos);

  return { status: 201, data: { todo: newTodo } };
}

async function handleUpdateTodo(config, id) {
  await delay();

  const authUser = getAuthUser(config);
  if (!authUser) return { status: 401, data: { message: 'Unauthorised' } };

  const todos = getTodosDb();
  const idx = todos.findIndex((t) => t.id === id);

  if (idx === -1) return { status: 404, data: { message: 'Todo not found' } };

  if (authUser.role !== ROLES.ADMIN && todos[idx].userId !== authUser.userId) {
    return { status: 403, data: { message: 'Forbidden' } };
  }

  const body = JSON.parse(config.data || '{}');
  todos[idx] = {
    ...todos[idx],
    ...body,
    id,
    userId: todos[idx].userId, // userId cannot be changed
    updatedAt: new Date().toISOString(),
  };

  saveTodosDb(todos);
  return { status: 200, data: { todo: todos[idx] } };
}

async function handlePatchTodo(config, id) {
  // Same logic as PUT but semantically partial update
  return handleUpdateTodo(config, id);
}

async function handleDeleteTodo(config, id) {
  await delay();

  const authUser = getAuthUser(config);
  if (!authUser) return { status: 401, data: { message: 'Unauthorised' } };

  const todos = getTodosDb();
  const idx = todos.findIndex((t) => t.id === id);

  if (idx === -1) return { status: 404, data: { message: 'Todo not found' } };

  if (authUser.role !== ROLES.ADMIN && todos[idx].userId !== authUser.userId) {
    return { status: 403, data: { message: 'Forbidden' } };
  }

  todos.splice(idx, 1);
  saveTodosDb(todos);

  return { status: 200, data: { message: 'Todo deleted successfully' } };
}

// ─────────────────────────────────────────────
// Main router
// ─────────────────────────────────────────────

export async function handleTodoRequest(config) {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();

  // /api/todos/:id
  const idMatch = url.match(/\/api\/todos\/([^/?]+)/);
  if (idMatch) {
    const id = idMatch[1];
    if (method === 'get') return handleGetTodoById(config, id);
    if (method === 'put') return handleUpdateTodo(config, id);
    if (method === 'patch') return handlePatchTodo(config, id);
    if (method === 'delete') return handleDeleteTodo(config, id);
  }

  // /api/todos
  if (url.includes('/api/todos')) {
    if (method === 'get') return handleGetTodos(config);
    if (method === 'post') return handleCreateTodo(config);
  }

  return { status: 404, data: { message: 'Todo route not found' } };
}
