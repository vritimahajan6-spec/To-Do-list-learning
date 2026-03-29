/**
 * @file useAuth.js
 * @description Custom hook for consuming AuthContext.
 * Demonstrates: Custom hook pattern, encapsulation of context consumption.
 */

import { useAuthContext } from '../context/AuthContext';

export function useAuth() {
  return useAuthContext();
}
