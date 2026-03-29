/**
 * @file index.js  (dummyBackend)
 * @description Installs axios interceptors that short-circuit real HTTP requests
 * and route them to in-memory handler functions instead.
 *
 * Demonstrates:
 *  - Axios request/response interceptors
 *  - Interceptor-based mock API pattern (no MSW / fetch-mock needed)
 *  - How to swap in a real backend: remove this import in apiClient.js
 *    and set VITE_API_BASE_URL to a real server URL.
 */

import axios from 'axios';
import { handleAuthRequest } from './authHandlers';
import { handleTodoRequest } from './todoHandlers';

// ─── Request interceptor ──────────────────────────────────────────────────────
// Intercepts every outgoing axios request before it hits the network.
// If the URL matches our dummy API paths we handle it locally and
// short-circuit the request by rejecting with a special sentinel object.
axios.interceptors.request.use(async (config) => {
  const url = config.url || '';

  if (url.includes('/api/auth/')) {
    const response = await handleAuthRequest(config);
    // Reject with sentinel so the response interceptor below can resolve it
    return Promise.reject({ isDummyResponse: true, response });
  }

  if (url.includes('/api/todos')) {
    const response = await handleTodoRequest(config);
    return Promise.reject({ isDummyResponse: true, response });
  }

  // Not a dummy URL – let the request proceed normally
  return config;
});

// ─── Response interceptor ─────────────────────────────────────────────────────
// Catches the sentinel rejection and converts it back to a resolved response.
// Real HTTP errors pass through unchanged.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.isDummyResponse) {
      const { response } = error;
      // Simulate network errors for non-2xx status codes
      if (response.status >= 400) {
        const axiosError = new Error(response.data?.message || 'Request failed');
        axiosError.response = {
          status: response.status,
          data: response.data,
        };
        return Promise.reject(axiosError);
      }
      return Promise.resolve({ data: response.data, status: response.status });
    }
    return Promise.reject(error);
  }
);
