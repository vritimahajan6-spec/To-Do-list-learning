// ============================================================
// AuthContext.jsx
// Demonstrates: Context API, useReducer, useEffect, custom events
// ============================================================

import { createContext, useReducer, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import {
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
} from '../utils/constants';
import { decodeToken } from '../utils/helpers';

// ---- Context ----
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// ---- Initial state ----
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // true while we check stored tokens on startup
  error: null,
};

// ---- Reducer — demonstrates useReducer ----
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'REFRESH_TOKEN':
      return { ...state, ...action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload.user, isLoading: false };
    default:
      return state;
  }
}

// ---- Provider ----
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ---- Actions (defined before useEffects so they can be listed as deps) ----
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    dispatch({ type: 'LOGOUT' });
  }, []);

  // On startup: check if valid tokens exist in localStorage
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const stored = localStorage.getItem(USER_KEY);

    if (token && stored) {
      const payload = decodeToken(token);
      if (payload) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: JSON.parse(stored) },
        });
      } else {
        // Token expired — clear storage
        logout();
      }
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, [logout]);

  // Listen for forced logout events (e.g. from apiClient token refresh failure)
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [logout]);

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { data } = await authApi.login(credentials);
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.user } });
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: { error: msg } });
      throw new Error(msg);
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { data } = await authApi.register(userData);
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.user } });
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: { error: msg } });
      throw new Error(msg);
    }
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
