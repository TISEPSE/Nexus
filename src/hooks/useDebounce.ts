import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to create a debounced function
 * @param callback Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function with flush method
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T & { flush: () => void } {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  ) as T & { flush: () => void };

  // Add flush method to immediately execute pending callback
  debouncedFn.flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return debouncedFn;
}
