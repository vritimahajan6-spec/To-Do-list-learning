/**
 * @file useClickOutside.js
 * @description Detects clicks outside of a referenced element.
 *
 * Demonstrates:
 *  - useRef to reference DOM nodes
 *  - useEffect for event listener lifecycle management
 */

import { useEffect } from 'react';

/**
 * @param {React.RefObject} ref     - Ref of the element to watch.
 * @param {Function}        handler - Called when a click is detected outside.
 */
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
