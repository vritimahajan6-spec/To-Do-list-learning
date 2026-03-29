// ============================================================
// constants.js — App-wide constants
// ============================================================

// Base URL for the dummy API (intercepted by axios)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Auth-related localStorage keys
export const TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'auth_refresh_token';
export const USER_KEY = 'auth_user';

// Token expiry (milliseconds)
export const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
export const REMEMBER_ME_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

// Login lockout settings
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Todo priorities
export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Todo filter options
export const FILTER_STATUS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

// Sort options
export const SORT_BY = {
  DATE: 'date',
  PRIORITY: 'priority',
  DUE_DATE: 'dueDate',
};

// User roles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// localStorage keys for the dummy backend
export const DB_USERS_KEY = 'db_users';
export const DB_TODOS_KEY = 'db_todos';

// Theme
export const THEME_KEY = 'app_theme';
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Priority order for sorting (higher = more urgent)
export const PRIORITY_ORDER = {
  [PRIORITIES.HIGH]: 3,
  [PRIORITIES.MEDIUM]: 2,
  [PRIORITIES.LOW]: 1,
};
