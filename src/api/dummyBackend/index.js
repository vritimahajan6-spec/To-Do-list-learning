// ============================================================
// dummyBackend/index.js
// Sets up an axios request interceptor that handles requests
// locally without hitting a real server.
//
// Pattern: intercept → route → resolve / reject
// To switch to a real API: remove the import of this file from
// apiClient.js and point VITE_API_BASE_URL at your server.
// ============================================================

import {
  handleLogin,
  handleRegister,
  handleRefreshToken,
  handleGetProfile,
  seedUsers,
} from './authHandlers';
import {
  handleGetTodos,
  handleCreateTodo,
  handleUpdateTodo,
  handleDeleteTodo,
  handleToggleTodo,
} from './todoHandlers';

// Seed demo data on first load
seedUsers();

/**
 * Extract the authenticated user from the Authorization header.
 * Returns { userId, email, role } or null.
 */
function extractUser(config) {
  const auth = config.headers?.Authorization || config.headers?.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Artificial network delay (300–800 ms) to simulate latency.
 */
function delay() {
  return new Promise((r) => setTimeout(r, 300 + Math.random() * 500));
}

/**
 * Build a fake axios-like response object.
 */
function ok(data, status = 200) {
  return { data, status, headers: {}, config: {} };
}

/**
 * Build a fake axios-like error object and reject.
 */
function fail(status, message) {
  return Promise.reject({ response: { status, data: { message } } });
}

/**
 * Install the interceptor on the provided axios instance.
 */
export function installDummyBackend(axiosInstance) {
  axiosInstance.interceptors.request.use(async (config) => {
    await delay();

    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();
    const body = config.data ? JSON.parse(config.data) : {};

    // ---- Auth routes ----
    if (url.endsWith('/auth/login') && method === 'post') {
      try {
        const data = await handleLogin(body);
        return Promise.reject({ __dummyResponse: ok(data) });
      } catch (err) {
        return Promise.reject({ __dummyError: fail(err.status || 500, err.message) });
      }
    }

    if (url.endsWith('/auth/register') && method === 'post') {
      try {
        const data = await handleRegister(body);
        return Promise.reject({ __dummyResponse: ok(data, 201) });
      } catch (err) {
        return Promise.reject({ __dummyError: fail(err.status || 500, err.message) });
      }
    }

    if (url.endsWith('/auth/refresh') && method === 'post') {
      try {
        const data = await handleRefreshToken(body);
        return Promise.reject({ __dummyResponse: ok(data) });
      } catch (err) {
        return Promise.reject({ __dummyError: fail(err.status || 401, err.message) });
      }
    }

    if (url.endsWith('/auth/me') && method === 'get') {
      const token = (config.headers?.Authorization || '').replace('Bearer ', '');
      try {
        const data = await handleGetProfile({ token });
        return Promise.reject({ __dummyResponse: ok(data) });
      } catch (err) {
        return Promise.reject({ __dummyError: fail(err.status || 401, err.message) });
      }
    }

    // ---- Todo routes ----
    const user = extractUser(config);
    if (!user && url.includes('/todos')) {
      return Promise.reject({ __dummyError: fail(401, 'Unauthorized') });
    }

    // GET /todos
    if (url.match(/\/todos$/) && method === 'get') {
      try {
        const data = await handleGetTodos({ userId: user.userId, role: user.role });
        return Promise.reject({ __dummyResponse: ok(data) });
      } catch (err) {
        return Promise.reject({ __dummyError: fail(err.status || 500, err.message) });
      }
    }

    // POST /todos
    if (url.match(/\/todos$/) && method === 'post') {
      try {
        const data = await handleCreateTodo({ userId: user.userId, body });
        return Promise.reject({ __dummyResponse: ok(data, 201) });
      } catch (err) {
        return Promise.reject({ __dummyError: fail(err.status || 500, err.message) });
      }
    }

    // PUT /todos/:id
    const putMatch = url.match(/\/todos\/([^/]+)$/) ;
    if (putMatch && method === 'put') {
      try {
        const data = await handleUpdateTodo({
          userId: user.userId,
          role: user.role,
          todoId: putMatch[1],
          body,
        });
        return Promise.reject({ __dummyResponse: ok(data) });
      } catch (err) {
        return Promise.reject({ __dummyError: fail(err.status || 500, err.message) });
      }
    }

    // DELETE /todos/:id
    const delMatch = url.match(/\/todos\/([^/]+)$/);
    if (delMatch && method === 'delete') {
      try {
        const data = await handleDeleteTodo({
          userId: user.userId,
          role: user.role,
          todoId: delMatch[1],
        });
        return Promise.reject({ __dummyResponse: ok(data) });
      } catch (err) {
        return Promise.reject({ __dummyError: fail(err.status || 500, err.message) });
      }
    }

    // PATCH /todos/:id/toggle
    const toggleMatch = url.match(/\/todos\/([^/]+)\/toggle$/);
    if (toggleMatch && method === 'patch') {
      try {
        const data = await handleToggleTodo({
          userId: user.userId,
          role: user.role,
          todoId: toggleMatch[1],
        });
        return Promise.reject({ __dummyResponse: ok(data) });
      } catch (err) {
        return Promise.reject({ __dummyError: fail(err.status || 500, err.message) });
      }
    }

    // Unknown route — pass through (would fail on a real server anyway)
    return config;
  });

  // Response interceptor: unwrap dummy responses/errors
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.__dummyResponse) return Promise.resolve(error.__dummyResponse);
      if (error.__dummyError) return error.__dummyError;
      return Promise.reject(error);
    },
  );
}
