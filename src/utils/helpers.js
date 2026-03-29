/**
 * @file helpers.js
 * @description Utility / helper functions used throughout the application.
 * Demonstrates: Pure functions, date-fns for formatting, uuid for ID generation.
 */

import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { PRIORITY } from './constants';

/**
 * Formats an ISO date string to a human-readable format.
 * Falls back gracefully when the date is invalid.
 */
export function formatDate(dateString, pattern = 'MMM d, yyyy') {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return '';
  return format(date, pattern);
}

/**
 * Returns a relative time string, e.g. "3 days ago".
 */
export function formatRelativeDate(dateString) {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return '';
  return formatDistanceToNow(date, { addSuffix: true });
}

/** Generates a universally unique identifier using uuid v4. */
export function generateId() {
  return uuidv4();
}

/** Truncates a string to maxLength characters, appending '…' if needed. */
export function truncateText(text, maxLength = 80) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/** Returns a CSS colour token based on priority level. */
export function getPriorityColor(priority) {
  switch (priority) {
    case PRIORITY.HIGH:   return 'var(--color-priority-high)';
    case PRIORITY.MEDIUM: return 'var(--color-priority-medium)';
    case PRIORITY.LOW:    return 'var(--color-priority-low)';
    default:              return 'var(--color-text-muted)';
  }
}

/**
 * Sorts an array of todos.
 * @param {'createdAt'|'dueDate'|'priority'|'title'} sortBy
 * @param {'asc'|'desc'} order
 */
export function sortTodos(todos, sortBy = 'createdAt', order = 'desc') {
  const priorityWeight = { high: 3, medium: 2, low: 1 };

  return [...todos].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = (a.title || '').localeCompare(b.title || '');
        break;
      case 'priority':
        comparison = (priorityWeight[a.priority] || 0) - (priorityWeight[b.priority] || 0);
        break;
      case 'dueDate':
        comparison =
          (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) -
          (b.dueDate ? new Date(b.dueDate).getTime() : Infinity);
        break;
      case 'createdAt':
      default:
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    return order === 'asc' ? comparison : -comparison;
  });
}

/** Filters todos by status and priority. */
export function filterTodos(todos, { status, priority, search }) {
  return todos.filter((todo) => {
    if (status === 'active' && todo.completed) return false;
    if (status === 'completed' && !todo.completed) return false;
    if (priority && priority !== 'all' && todo.priority !== priority) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        todo.title.toLowerCase().includes(q) ||
        (todo.description || '').toLowerCase().includes(q)
      );
    }
    return true;
  });
}
