
/**
 * A simple in-memory cache for API requests to reduce duplicate calls to Supabase
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  loading?: boolean;
  expiresAt: number;
}

const cache: Record<string, CacheEntry> = {};

// Default cache expiration time (5 minutes)
const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

// Rate limiter settings
const MAX_REQUESTS_PER_MINUTE = 80; // Lower than Supabase's limit
let requestCount = 0;
let requestResetTime = Date.now() + 60 * 1000;

export const requestCache = {
  /**
   * Get a value from the cache
   */
  get: (key: string): any | null => {
    const entry = cache[key];
    if (!entry) return null;
    
    const now = Date.now();
    if (now > entry.expiresAt) {
      // Cache expired
      delete cache[key];
      return null;
    }
    
    return entry.data;
  },
  
  /**
   * Store a value in the cache
   * @param key Cache key
   * @param data Data to store
   * @param ttl Optional time-to-live in milliseconds (defaults to DEFAULT_CACHE_TIME)
   */
  set: (key: string, data: any, ttl = DEFAULT_CACHE_TIME): void => {
    cache[key] = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      loading: false
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
        expiresAt: Date.now() + DEFAULT_CACHE_TIME,
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
   * Check if we've hit rate limits
   * Returns true if we should throttle requests
   */
  shouldThrottle: (): boolean => {
    const now = Date.now();
    
    // Reset counter if minute has passed
    if (now > requestResetTime) {
      requestCount = 0;
      requestResetTime = now + 60 * 1000;
    }
    
    // Increment counter and check if we're over limit
    requestCount++;
    return requestCount > MAX_REQUESTS_PER_MINUTE;
  },
  
  /**
   * Track a new request for rate limiting
   */
  trackRequest: (): void => {
    const now = Date.now();
    
    // Reset counter if minute has passed
    if (now > requestResetTime) {
      requestCount = 0;
      requestResetTime = now + 60 * 1000;
    }
    
    requestCount++;
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
