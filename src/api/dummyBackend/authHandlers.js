/**
 * @file authHandlers.js
 * @description Dummy backend auth handlers.
 * Simulates a real auth API using localStorage as a database.
 *
 * Demonstrates:
 *  - Token-based authentication (JWT-like structure encoded with btoa/atob)
 *  - Refresh-token pattern
 *  - Account lockout after repeated failed attempts
 *  - Seeding initial data
 */

import { generateId } from '../../utils/helpers';
import {
  STORAGE_KEYS,
  TOKEN_EXPIRY,
  LOCKOUT_ATTEMPTS,
  LOCKOUT_DURATION,
  ROLES,
} from '../../utils/constants';

// ─────────────────────────────────────────────
// Token helpers
// ─────────────────────────────────────────────

function generateToken(payload, expiryMs) {
  return btoa(JSON.stringify({ ...payload, exp: Date.now() + expiryMs }));
}

function validateToken(token) {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// "Database" helpers
// ─────────────────────────────────────────────

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS_DB) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
}

// ─────────────────────────────────────────────
// Seed default users on first load
// ─────────────────────────────────────────────

function seedUsers() {
  const existing = getUsers();
  if (existing.length > 0) return;

  const seed = [
    {
      id: generateId(),
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: ROLES.ADMIN,
      createdAt: new Date().toISOString(),
      failedAttempts: 0,
      lockedUntil: null,
    },
    {
      id: generateId(),
      name: 'Regular User',
      email: 'user@example.com',
      password: 'User@123',
      role: ROLES.USER,
      createdAt: new Date().toISOString(),
      failedAttempts: 0,
      lockedUntil: null,
    },
  ];

  saveUsers(seed);
}

// Seed immediately when this module is imported
seedUsers();

// ─────────────────────────────────────────────
// Artificial delay
// ─────────────────────────────────────────────

function delay(min = 300, max = 800) {
  return new Promise((r) => setTimeout(r, Math.random() * (max - min) + min));
}

// ─────────────────────────────────────────────
// Handler implementations
// ─────────────────────────────────────────────

async function handleLogin(config) {
  await delay();

  const { email, password } = JSON.parse(config.data || '{}');
  const users = getUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return { status: 401, data: { message: 'Invalid email or password' } };
  }

  // Lockout check
  if (user.lockedUntil && Date.now() < user.lockedUntil) {
    const remaining = Math.ceil((user.lockedUntil - Date.now()) / 60000);
    return {
      status: 423,
      data: { message: `Account locked. Try again in ${remaining} minute(s).` },
    };
  }

  if (user.password !== password) {
    user.failedAttempts = (user.failedAttempts || 0) + 1;
    if (user.failedAttempts >= LOCKOUT_ATTEMPTS) {
      user.lockedUntil = Date.now() + LOCKOUT_DURATION;
      user.failedAttempts = 0;
    }
    saveUsers(users);
    return { status: 401, data: { message: 'Invalid email or password' } };
  }

  // Success – reset counters
  user.failedAttempts = 0;
  user.lockedUntil = null;
  saveUsers(users);

  const { password: _pw, ...safeUser } = user;
  const accessToken = generateToken(
    { userId: user.id, email: user.email, role: user.role },
    TOKEN_EXPIRY.ACCESS
  );
  const refreshToken = generateToken(
    { userId: user.id, type: 'refresh' },
    TOKEN_EXPIRY.REFRESH
  );

  return {
    status: 200,
    data: { user: safeUser, accessToken, refreshToken },
  };
}

async function handleRegister(config) {
  await delay();

  const { name, email, password } = JSON.parse(config.data || '{}');
  const users = getUsers();

  if (users.find((u) => u.email === email)) {
    return { status: 409, data: { message: 'Email already in use' } };
  }

  const newUser = {
    id: generateId(),
    name,
    email,
    password,
    role: ROLES.USER,
    createdAt: new Date().toISOString(),
    failedAttempts: 0,
    lockedUntil: null,
  };

  users.push(newUser);
  saveUsers(users);

  const { password: _pw, ...safeUser } = newUser;
  const accessToken = generateToken(
    { userId: newUser.id, email: newUser.email, role: newUser.role },
    TOKEN_EXPIRY.ACCESS
  );
  const refreshToken = generateToken(
    { userId: newUser.id, type: 'refresh' },
    TOKEN_EXPIRY.REFRESH
  );

  return {
    status: 201,
    data: { user: safeUser, accessToken, refreshToken },
  };
}

async function handleRefreshToken(config) {
  await delay(100, 300);

  const { refreshToken } = JSON.parse(config.data || '{}');
  if (!refreshToken) {
    return { status: 400, data: { message: 'Refresh token required' } };
  }

  const payload = validateToken(refreshToken);
  if (!payload || payload.type !== 'refresh') {
    return { status: 401, data: { message: 'Invalid or expired refresh token' } };
  }

  const users = getUsers();
  const user = users.find((u) => u.id === payload.userId);
  if (!user) {
    return { status: 401, data: { message: 'User not found' } };
  }

  const newAccessToken = generateToken(
    { userId: user.id, email: user.email, role: user.role },
    TOKEN_EXPIRY.ACCESS
  );
  const newRefreshToken = generateToken(
    { userId: user.id, type: 'refresh' },
    TOKEN_EXPIRY.REFRESH
  );

  return {
    status: 200,
    data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
  };
}

async function handleLogout() {
  await delay(100, 300);
  return { status: 200, data: { message: 'Logged out successfully' } };
}

async function handleValidateToken(config) {
  await delay(100, 300);

  const authHeader = config.headers?.Authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return { status: 401, data: { message: 'No token provided' } };

  const payload = validateToken(token);
  if (!payload) return { status: 401, data: { message: 'Token expired or invalid' } };

  const users = getUsers();
  const user = users.find((u) => u.id === payload.userId);
  if (!user) return { status: 401, data: { message: 'User not found' } };

  const { password: _pw, ...safeUser } = user;
  return { status: 200, data: { user: safeUser } };
}

// ─────────────────────────────────────────────
// Main router
// ─────────────────────────────────────────────

export async function handleAuthRequest(config) {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();

  if (url.endsWith('/auth/login') && method === 'post') return handleLogin(config);
  if (url.endsWith('/auth/register') && method === 'post') return handleRegister(config);
  if (url.endsWith('/auth/refresh') && method === 'post') return handleRefreshToken(config);
  if (url.endsWith('/auth/logout') && method === 'post') return handleLogout(config);
  if (url.endsWith('/auth/validate') && method === 'get') return handleValidateToken(config);

  return { status: 404, data: { message: 'Auth route not found' } };
}
