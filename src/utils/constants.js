/**
 * @file constants.js
 * @description Application-wide constants.
 * Demonstrates: Centralised configuration, environment variables via import.meta.env.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'current_user',
  USERS_DB: 'db_users',
  TODOS_DB: 'db_todos',
  THEME: 'theme',
};

export const ROLES = { ADMIN: 'admin', USER: 'user' };

export const PRIORITY = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

export const TODO_STATUS = { ALL: 'all', ACTIVE: 'active', COMPLETED: 'completed' };

export const TOKEN_EXPIRY = {
  ACCESS: 15 * 60 * 1000,   // 15 minutes
  REFRESH: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const LOCKOUT_ATTEMPTS = 5;
export const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
