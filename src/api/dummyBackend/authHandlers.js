// ============================================================
// authHandlers.js — Dummy auth operations backed by localStorage
// Demonstrates: token generation, hashing (btoa), expiry checks
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import {
  DB_USERS_KEY,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  REMEMBER_ME_EXPIRY,
  MAX_FAILED_ATTEMPTS,
  LOCKOUT_DURATION,
} from '../../utils/constants';

// ---------- Storage helpers ----------

function getUsers() {
  return JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
}

// ---------- Custom error helper ----------

function apiError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// ---------- Token helpers ----------

function createToken(payload, expiresIn) {
  return btoa(JSON.stringify({ ...payload, exp: Date.now() + expiresIn }));
}

function validateToken(token) {
  try {
    const payload = JSON.parse(atob(token));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// ---------- Seed data ----------

export function seedUsers() {
  const existing = getUsers();
  if (existing.length > 0) return;

  const seed = [
    {
      id: uuidv4(),
      name: 'Admin User',
      email: 'admin@example.com',
      password: btoa('Admin@123'),
      role: 'admin',
      createdAt: new Date().toISOString(),
      failedAttempts: 0,
      lockUntil: null,
    },
    {
      id: uuidv4(),
      name: 'Regular User',
      email: 'user@example.com',
      password: btoa('User@123'),
      role: 'user',
      createdAt: new Date().toISOString(),
      failedAttempts: 0,
      lockUntil: null,
    },
  ];
  saveUsers(seed);
}

// ---------- Handler functions ----------

export async function handleLogin({ email, password, rememberMe }) {
  const users = getUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    throw apiError(401, 'Invalid email or password');
  }

  // Check lockout
  if (user.lockUntil && Date.now() < user.lockUntil) {
    const remaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw apiError(429, `Account locked. Try again in ${remaining} minute(s).`);
  }

  // Validate password
  if (btoa(password) !== user.password) {
    user.failedAttempts = (user.failedAttempts || 0) + 1;
    if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockUntil = Date.now() + LOCKOUT_DURATION;
      user.failedAttempts = 0;
    }
    saveUsers(users);
    throw apiError(401, 'Invalid email or password');
  }

  // Successful login — reset lockout fields
  user.failedAttempts = 0;
  user.lockUntil = null;
  saveUsers(users);

  const expiry = rememberMe ? REMEMBER_ME_EXPIRY : ACCESS_TOKEN_EXPIRY;
  const tokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = createToken(tokenPayload, expiry);
  const refreshToken = createToken(tokenPayload, REFRESH_TOKEN_EXPIRY);

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function handleRegister({ name, email, password }) {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    throw apiError(409, 'Email is already registered');
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: btoa(password),
    role: 'user',
    createdAt: new Date().toISOString(),
    failedAttempts: 0,
    lockUntil: null,
  };
  users.push(newUser);
  saveUsers(users);

  const tokenPayload = { userId: newUser.id, email: newUser.email, role: newUser.role };
  const accessToken = createToken(tokenPayload, ACCESS_TOKEN_EXPIRY);
  const refreshToken = createToken(tokenPayload, REFRESH_TOKEN_EXPIRY);

  return {
    accessToken,
    refreshToken,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
  };
}

export async function handleRefreshToken({ refreshToken }) {
  const payload = validateToken(refreshToken);
  if (!payload) {
    throw apiError(401, 'Refresh token expired or invalid');
  }

  const users = getUsers();
  const user = users.find((u) => u.id === payload.userId);
  if (!user) {
    throw apiError(401, 'User not found');
  }

  const tokenPayload = { userId: user.id, email: user.email, role: user.role };
  const newAccessToken = createToken(tokenPayload, ACCESS_TOKEN_EXPIRY);
  const newRefreshToken = createToken(tokenPayload, REFRESH_TOKEN_EXPIRY);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function handleGetProfile({ token }) {
  const payload = validateToken(token);
  if (!payload) throw apiError(401, 'Unauthorized');

  const users = getUsers();
  const user = users.find((u) => u.id === payload.userId);
  if (!user) throw apiError(404, 'User not found');

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
