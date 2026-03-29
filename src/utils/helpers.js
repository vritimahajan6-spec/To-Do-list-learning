// ============================================================
// helpers.js — Reusable utility / helper functions
// ============================================================

import { format, isValid, parseISO } from 'date-fns';
import { PRIORITY_ORDER, SORT_BY } from './constants';

/**
 * Format a date string to a human-readable format.
 * Demonstrates: pure utility functions
 */
export function formatDate(dateStr, pattern = 'MMM dd, yyyy') {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return isValid(date) ? format(date, pattern) : '';
}

/**
 * Truncate a string to a maximum length, appending "…" if needed.
 */
export function truncate(str, maxLen = 80) {
  if (!str) return '';
  return str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;
}

/**
 * Capitalise the first letter of a string.
 */
export function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Sort todos by a given field.
 * Demonstrates: array manipulation, sort comparators
 */
export function sortTodos(todos, sortBy) {
  const copy = [...todos];
  switch (sortBy) {
    case SORT_BY.PRIORITY:
      return copy.sort(
        (a, b) =>
          (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0),
      );
    case SORT_BY.DUE_DATE:
      return copy.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case SORT_BY.DATE:
    default:
      return copy.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
  }
}

/**
 * Filter todos by status and priority.
 */
export function filterTodos(todos, { status = 'all', priority = 'all', search = '' }) {
  return todos.filter((todo) => {
    const matchStatus =
      status === 'all' ||
      (status === 'active' && !todo.completed) ||
      (status === 'completed' && todo.completed);

    const matchPriority = priority === 'all' || todo.priority === priority;

    const query = search.trim().toLowerCase();
    const matchSearch =
      !query ||
      todo.title.toLowerCase().includes(query) ||
      (todo.description || '').toLowerCase().includes(query);

    return matchStatus && matchPriority && matchSearch;
  });
}

/**
 * Generate simple stats from a list of todos.
 */
export function computeStats(todos) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  return { total, completed, active };
}

/**
 * Decode a base64-encoded JSON token and return the payload.
 * Returns null if the token is missing or expired.
 */
export function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Check whether an ISO date string is past its due date.
 */
export function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}
