
/**
 * A simple in-memory cache for API requests to reduce duplicate calls to Supabase
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  loading?: boolean;
}

const cache: Record<string, CacheEntry> = {};

// Default cache expiration time (5 minutes)
const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

export const requestCache = {
  /**
   * Get a value from the cache
   */
  get: (key: string): any | null => {
    const entry = cache[key];
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > DEFAULT_CACHE_TIME) {
      // Cache expired
      delete cache[key];
      return null;
    }
    
    return entry.data;
  },
  
  /**
   * Store a value in the cache
   */
  set: (key: string, data: any): void => {
    cache[key] = {
      data,
      timestamp: Date.now()
    };
  },
  
  /**
   * Mark a key as loading
   */
  setLoading: (key: string): void => {
    if (!cache[key]) {
      cache[key] = {
        data: null,
        timestamp: Date.now(),
        loading: true
      };
    } else {
      cache[key].loading = true;
    }
  },
  
  /**
   * Check if a key is currently loading
   */
  isLoading: (key: string): boolean => {
    return cache[key]?.loading === true;
  },
  
  /**
   * Clear the cache for a specific key
   */
  clear: (key: string): void => {
    delete cache[key];
  },
  
  /**
   * Clear all cache entries
   */
  clearAll: (): void => {
    Object.keys(cache).forEach(key => {
      delete cache[key];
    });
  }
};
