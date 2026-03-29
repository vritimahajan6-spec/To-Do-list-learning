/**
 * @file useDebounce.js
 * @description Debounce hook – delays updating the returned value until
 * the input has stopped changing for `delay` milliseconds.
 *
 * Demonstrates:
 *  - useState + useEffect with cleanup
 *  - Practical custom hook abstraction
 */

import { useState, useEffect } from 'react';

/**
 * @param {*} value - The value to debounce.
 * @param {number} delay - Milliseconds to wait before updating.
 * @returns The debounced value.
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    // Cleanup: cancel the timer if value changes before delay expires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
