/**
 * pageCache.ts
 * Simple in-memory cache for paginated results to avoid redundant computation.
 */

export interface CacheEntry<T> {
  key: string;
  value: T;
  createdAt: number;
  ttl: number; // milliseconds, 0 = no expiry
}

export interface PageCacheOptions {
  ttl?: number;
  maxSize?: number;
}

const DEFAULT_TTL = 0;
const DEFAULT_MAX_SIZE = 100;

export function createPageCache<T>(options: PageCacheOptions = {}) {
  const ttl = options.ttl ?? DEFAULT_TTL;
  const maxSize = options.maxSize ?? DEFAULT_MAX_SIZE;
  const store = new Map<string, CacheEntry<T>>();

  function isExpired(entry: CacheEntry<T>): boolean {
    if (entry.ttl === 0) return false;
    return Date.now() - entry.createdAt > entry.ttl;
  }

  function set(key: string, value: T): void {
    if (store.size >= maxSize) {
      const firstKey = store.keys().next().value;
      if (firstKey !== undefined) store.delete(firstKey);
    }
    store.set(key, { key, value, createdAt: Date.now(), ttl });
  }

  function get(key: string): T | undefined {
    const entry = store.get(key);
    if (!entry) return undefined;
    if (isExpired(entry)) {
      store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  function has(key: string): boolean {
    return get(key) !== undefined;
  }

  function clear(): void {
    store.clear();
  }

  function size(): number {
    return store.size;
  }

  return { set, get, has, clear, size };
}

export function buildCacheKey(parts: Record<string, unknown>): string {
  return JSON.stringify(
    Object.keys(parts)
      .sort()
      .reduce<Record<string, unknown>>((acc, k) => { acc[k] = parts[k]; return acc; }, {})
  );
}
