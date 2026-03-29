/**
 * @file useTheme.js
 * @description Custom hook for consuming ThemeContext.
 * Demonstrates: Custom hook pattern.
 */

import { useThemeContext } from '../context/ThemeContext';

export function useTheme() {
  return useThemeContext();
}
