// ============================================================
// ThemeContext.jsx
// Demonstrates: Context API, custom hook consumption, side effects
// ============================================================

import { createContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { THEME_KEY, THEMES } from '../utils/constants';

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // useLocalStorage custom hook — persists theme preference
  const [theme, setTheme] = useLocalStorage(THEME_KEY, THEMES.LIGHT);

  // Apply theme class to <html> element (CSS variables switch)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
