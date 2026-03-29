/**
 * @file authApi.js
 * @description Authentication API functions.
 * Demonstrates: Thin API layer, separation of HTTP concerns from business logic.
 */

import apiClient from './apiClient';

/** @param {{ email: string, password: string }} credentials */
export async function loginUser(credentials) {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data;
}

/** @param {{ name: string, email: string, password: string }} userData */
export async function registerUser(userData) {
  const { data } = await apiClient.post('/auth/register', userData);
  return data;
}

/** @param {string} refreshToken */
export async function refreshAccessToken(refreshToken) {
  const { data } = await apiClient.post('/auth/refresh', { refreshToken });
  return data;
}

export async function logoutUser() {
  const { data } = await apiClient.post('/auth/logout');
  return data;
}

export async function validateToken() {
  const { data } = await apiClient.get('/auth/validate');
  return data;
}
