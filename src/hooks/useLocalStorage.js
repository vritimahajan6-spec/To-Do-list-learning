/**
 * @file useLocalStorage.js
 * @description useState-like hook that automatically persists to localStorage.
 *
 * Demonstrates:
 *  - Custom hook with useState initialiser
 *  - JSON serialisation / deserialisation
 *  - Error-safe localStorage access
 */

import { useState, useCallback } from 'react';

/**
 * @param {string} key   - localStorage key
 * @param {*}      initialValue - default value when key is absent
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        // Allow functional updates, just like useState
        const valueToStore =
          typeof value === 'function' ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.warn(`useLocalStorage: could not write key "${key}"`, err);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    localStorage.removeItem(key);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
