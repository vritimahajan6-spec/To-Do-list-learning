/**
 * @file ThemeContext.jsx
 * @description Light / dark theme toggle persisted to localStorage.
 *
 * Demonstrates:
 *  - createContext + useState
 *  - Persisting UI preferences with localStorage
 *  - Context Provider pattern for global state
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

export const ThemeContext = createContext(null); // eslint-disable-line react-refresh/only-export-components

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  });

  // Apply the theme class to <html> so CSS variables take effect globally
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() { // eslint-disable-line react-refresh/only-export-components
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used inside <ThemeProvider>');
  return ctx;
}
