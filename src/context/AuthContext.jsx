/**
 * @file AuthContext.jsx
 * @description Global authentication state managed with useReducer.
 *
 * Demonstrates:
 *  - React Context API (createContext, useContext, Provider pattern)
 *  - useReducer for complex state transitions
 *  - Side effects in useEffect (session restoration on mount)
 *  - Async actions dispatching
 */

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { loginUser, registerUser, logoutUser, validateToken } from '../api/authApi';
import { STORAGE_KEYS } from '../utils/constants';

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext(null); // eslint-disable-line react-refresh/only-export-components

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // true while checking stored tokens on mount
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload.error,
      };

    case 'LOGOUT':
      return { ...initialState, isLoading: false };

    case 'SET_USER':
      return { ...state, user: action.payload.user, isAuthenticated: true, isLoading: false };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function persistTokens({ accessToken, refreshToken, user }) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

function clearTokens() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on mount by validating stored token
  useEffect(() => {
    async function restoreSession() {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (!accessToken || !storedUser) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        const { user } = await validateToken();
        dispatch({ type: 'SET_USER', payload: { user } });
      } catch {
        // Token invalid/expired – clear storage and show login
        clearTokens();
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    restoreSession();
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const data = await loginUser(credentials);
      persistTokens(data);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.user } });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: { error: message } });
      throw err;
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const data = await registerUser(userData);
      persistTokens(data);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.user } });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: { error: message } });
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore logout errors – clear local state regardless
    } finally {
      clearTokens();
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Named export so useAuth.js can import it
export function useAuthContext() { // eslint-disable-line react-refresh/only-export-components
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
}
