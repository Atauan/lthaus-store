
// A simple in-memory cache for API requests
const cache: Record<string, { data: any, timestamp: number, expiry: number }> = {};

// Default cache time (5 minutes)
const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

/**
 * Get data from cache by key
 * @param key Cache key
 * @returns The cached data or null if not found or expired
 */
export async function getFromCache(key: string): Promise<any | null> {
  const entry = cache[key];
  if (!entry) return null;
  
  const now = Date.now();
  if (now > entry.expiry) {
    // Expired, remove from cache
    delete cache[key];
    return null;
  }
  
  return entry.data;
}

/**
 * Save data to cache
 * @param key Cache key
 * @param data Data to cache
 * @param ttl Time to live in milliseconds (default: 5 minutes)
 */
export function saveToCache(key: string, data: any, ttl: number = DEFAULT_CACHE_TIME): void {
  const now = Date.now();
  
  cache[key] = {
    data,
    timestamp: now,
    expiry: now + ttl
  };
}

/**
 * Clear an item from cache
 * @param key Cache key to clear
 */
export function clearCache(key: string): void {
  delete cache[key];
}

/**
 * Clear all items from cache
 */
export function clearAllCache(): void {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
}

/**
 * Get cache information
 * @returns Object with cache stats
 */
export function getCacheInfo(): { keys: string[], count: number, oldestTimestamp: number | null } {
  const keys = Object.keys(cache);
  
  let oldestTimestamp: number | null = null;
  if (keys.length > 0) {
    oldestTimestamp = Math.min(...Object.values(cache).map(entry => entry.timestamp));
  }
  
  return {
    keys,
    count: keys.length,
    oldestTimestamp
  };
}
