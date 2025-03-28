
// Map to track request counts by key
const requestLimits: Record<string, { count: number, resetAt: number }> = {};

// Limit settings
const DEFAULT_LIMIT = 80; // Requests per minute
const DEFAULT_PERIOD = 60 * 1000; // 1 minute in milliseconds

/**
 * Handles rate limiting for API requests
 * 
 * @param key Unique identifier for the request type
 * @param limit Maximum number of requests in the period (default: 80)
 * @param period Time period in milliseconds (default: 60000 - 1 minute)
 * @returns true if request should be throttled, false if allowed
 */
export function handleRequestRateLimit(
  key: string, 
  limit: number = DEFAULT_LIMIT,
  period: number = DEFAULT_PERIOD
): boolean {
  const now = Date.now();
  
  // Initialize tracking for this key if it doesn't exist
  if (!requestLimits[key]) {
    requestLimits[key] = {
      count: 0,
      resetAt: now + period
    };
  }
  
  const tracker = requestLimits[key];
  
  // Reset counter if period has elapsed
  if (now > tracker.resetAt) {
    tracker.count = 0;
    tracker.resetAt = now + period;
  }
  
  // Increment counter
  tracker.count++;
  
  // Return true (throttle) if over limit
  return tracker.count > limit;
}

/**
 * Gets the current rate limit status for a specific key
 */
export function getRateLimitStatus(key: string) {
  if (!requestLimits[key]) {
    return { 
      count: 0, 
      limit: DEFAULT_LIMIT, 
      remaining: DEFAULT_LIMIT,
      resetAt: Date.now() + DEFAULT_PERIOD,
      isRateLimited: false
    };
  }
  
  const tracker = requestLimits[key];
  const remaining = Math.max(0, DEFAULT_LIMIT - tracker.count);
  
  return {
    count: tracker.count,
    limit: DEFAULT_LIMIT,
    remaining,
    resetAt: tracker.resetAt,
    isRateLimited: remaining === 0
  };
}

/**
 * Clears rate limit tracking for a specific key
 */
export function clearRateLimit(key: string) {
  delete requestLimits[key];
}

/**
 * Gets all current rate limit tracking data
 */
export function getAllRateLimits() {
  return { ...requestLimits };
}
