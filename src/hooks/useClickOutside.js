// ============================================================
// useClickOutside.js — Detect clicks outside a ref element
// Demonstrates: custom hooks, useRef, useEffect, event listeners
// ============================================================

import { useEffect } from 'react';

export function useClickOutside(ref, handler) {
  useEffect(() => {
    function listener(event) {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    }

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
