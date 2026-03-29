// ============================================================
// authApi.js — Auth-related API calls
// Demonstrates: module pattern, promise-based API calls
// ============================================================

import apiClient from './apiClient';

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  refreshToken: (refreshToken) => apiClient.post('/auth/refresh', { refreshToken }),
  getProfile: () => apiClient.get('/auth/me'),
};
