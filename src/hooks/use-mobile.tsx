import { useState, useEffect } from 'react';

// Custom hook to check if the current viewport matches a media query
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // It's important to check if window is defined for SSR environments
    if (typeof window !== 'undefined') {
      const mediaQueryList = window.matchMedia(query);

      const updateMatches = () => {
        setMatches(mediaQueryList.matches);
      };

      // Set the initial state
      updateMatches();

      // Listen for changes
      // Using addEventListener/removeEventListener for modern browsers
      mediaQueryList.addEventListener('change', updateMatches);

      return () => {
        mediaQueryList.removeEventListener('change', updateMatches);
      };
    }
  }, [query]); // Re-run effect if query changes

  return matches;
}

// Example of useIsMobile using the more generic useMediaQuery
// Tailwind's 'lg' breakpoint is 1024px. We want to consider mobile anything less than 'lg'.
const LG_BREAKPOINT = 1024;

export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${LG_BREAKPOINT - 1}px)`);
}
