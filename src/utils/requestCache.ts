
/**
 * A simple in-memory cache for API requests to reduce duplicate calls to Supabase
 * with rate limiting, request tracking, and exponential backoff for retries
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
const MAX_REQUESTS_PER_MINUTE = 80; // Lower than Supabase's limit to provide buffer
let requestCount = 0;
let requestResetTime = Date.now() + 60 * 1000;
let isThrottled = false;
let throttleEndTime = 0;

// Request tracking
type RequestLog = {
  timestamp: number;
  key?: string;
  success: boolean;
  error?: any;
  source?: string;
};

const recentRequests: RequestLog[] = [];
const MAX_REQUEST_LOGS = 100;

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
   * Check if we're currently throttled
   * Returns true if we should throttle requests
   */
  shouldThrottle: (): boolean => {
    const now = Date.now();
    
    // If we're in a throttled state and the throttle period hasn't expired
    if (isThrottled && now < throttleEndTime) {
      return true;
    }
    
    // If throttle period expired, reset the throttle state
    if (isThrottled && now >= throttleEndTime) {
      isThrottled = false;
    }
    
    // Reset counter if minute has passed
    if (now > requestResetTime) {
      requestCount = 0;
      requestResetTime = now + 60 * 1000;
      return false;
    }
    
    // If we've exceeded our rate limit, enable throttling
    if (requestCount > MAX_REQUESTS_PER_MINUTE) {
      isThrottled = true;
      throttleEndTime = now + 60 * 1000; // Throttle for 1 minute
      console.warn(`Rate limit hit: Throttling requests for 1 minute until ${new Date(throttleEndTime).toLocaleTimeString()}`);
      return true;
    }
    
    return false;
  },
  
  /**
   * Track a new request for rate limiting
   * @param source Optional source identifier for debugging
   */
  trackRequest: (source?: string): void => {
    const now = Date.now();
    
    // Add to recent requests log
    recentRequests.unshift({
      timestamp: now,
      source: source || 'unknown',
      success: true
    });
    
    // Trim log if it gets too large
    if (recentRequests.length > MAX_REQUEST_LOGS) {
      recentRequests.length = MAX_REQUEST_LOGS;
    }
    
    // Reset counter if minute has passed
    if (now > requestResetTime) {
      requestCount = 0;
      requestResetTime = now + 60 * 1000;
    }
    
    requestCount++;
  },
  
  /**
   * Log an error with a request
   * @param error The error that occurred
   * @param key Optional cache key
   * @param source Optional source identifier
   */
  logError: (error: any, key?: string, source?: string): void => {
    const now = Date.now();
    
    // Add to recent requests log
    recentRequests.unshift({
      timestamp: now,
      key,
      source: source || 'unknown',
      success: false,
      error
    });
    
    // Trim log if it gets too large
    if (recentRequests.length > MAX_REQUEST_LOGS) {
      recentRequests.length = MAX_REQUEST_LOGS;
    }
    
    console.error(`Request error from ${source || 'unknown'}${key ? ` (${key})` : ''}:`, error);
  },
  
  /**
   * Get recent request logs for debugging
   */
  getRequestLogs: (): RequestLog[] => {
    return [...recentRequests];
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
  },
  
  /**
   * Get the current throttling status
   */
  getThrottleStatus: () => ({
    isThrottled,
    requestCount,
    maxRequests: MAX_REQUESTS_PER_MINUTE,
    throttleEndTime: isThrottled ? new Date(throttleEndTime).toLocaleTimeString() : null,
    resetTime: new Date(requestResetTime).toLocaleTimeString()
  })
};
