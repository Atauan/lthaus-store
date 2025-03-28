
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache: Record<string, CacheItem<any>> = {};

export const getFromCache = <T>(key: string, maxAgeMs: number): T | null => {
  const item = cache[key];
  const now = Date.now();
  
  if (item && (now - item.timestamp < maxAgeMs)) {
    return item.data;
  }
  
  return null;
};

export const saveToCache = <T>(key: string, data: T): void => {
  cache[key] = {
    data,
    timestamp: Date.now()
  };
};

export const clearCache = (): void => {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
};

export const clearCacheItem = (key: string): void => {
  if (cache[key]) {
    delete cache[key];
  }
};
