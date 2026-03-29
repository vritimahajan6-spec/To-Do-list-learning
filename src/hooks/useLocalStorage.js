// ============================================================
// useLocalStorage.js — Custom hook for localStorage state
// Demonstrates: custom hooks, useState, lazy initialiser
// ============================================================

import { useState, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  // Lazy initialiser: only read from localStorage once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        // Allow functional updates (like useState)
        setStoredValue((prev) => {
          const next = typeof value === 'function' ? value(prev) : value;
          window.localStorage.setItem(key, JSON.stringify(next));
          return next;
        });
      } catch (err) {
        console.warn(`useLocalStorage: failed to save key "${key}"`, err);
      }
    },
    [key],
  );

  return [storedValue, setValue];
}
