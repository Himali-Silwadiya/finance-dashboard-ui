import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapid state changes (like typing in a search bar),
 * preventing excessive re-renders or premature algorithmic computations.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
