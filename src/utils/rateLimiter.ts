
// Simple rate limiter implementation
const rateLimits: Record<string, { count: number, lastReset: number }> = {};

export const rateLimit = (key: string, maxRequests: number, timeWindowMs: number): boolean => {
  const now = Date.now();
  
  // Initialize or reset if time window has passed
  if (!rateLimits[key] || now - rateLimits[key].lastReset > timeWindowMs) {
    rateLimits[key] = {
      count: 1,
      lastReset: now
    };
    return true;
  }
  
  // Check if we're under the limit
  if (rateLimits[key].count < maxRequests) {
    rateLimits[key].count++;
    return true;
  }
  
  return false;
};

// Helper function for handling rate limits
export const handleRequestRateLimit = (key: string): boolean => {
  // Allow 10 requests per minute
  return rateLimit(key, 10, 60 * 1000);
};
