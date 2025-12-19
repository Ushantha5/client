"use client";

import { useState, useEffect, useCallback } from "react";

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface UseCacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items in cache
}

export function useAdvancedCache<T>(options: UseCacheOptions = {}) {
  const { ttl = 5 * 60 * 1000, maxSize = 100 } = options; // Default 5 minutes TTL, 100 items max
  
  const [cache, setCache] = useState<Map<string, CacheItem<T>>>(new Map());
  
  // Cleanup expired items periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newCache = new Map(cache);
      
      for (const [key, item] of newCache.entries()) {
        if (now > item.timestamp + item.expiry) {
          newCache.delete(key);
        }
      }
      
      setCache(newCache);
    }, 60 * 1000); // Check every minute
    
    return () => clearInterval(interval);
  }, [cache]);
  
  const get = useCallback((key: string): T | null => {
    const item = cache.get(key);
    
    if (!item) return null;
    
    const now = Date.now();
    if (now > item.timestamp + item.expiry) {
      // Item expired, remove it
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(key);
        return newCache;
      });
      return null;
    }
    
    return item.data;
  }, [cache]);
  
  const set = useCallback((key: string, data: T) => {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: ttl
    };
    
    setCache(prev => {
      const newCache = new Map(prev);
      
      // If we're at max size, remove the oldest item
      if (newCache.size >= maxSize) {
        const firstKey = newCache.keys().next().value;
        if (firstKey) {
          newCache.delete(firstKey);
        }
      }
      
      newCache.set(key, item);
      return newCache;
    });
  }, [ttl, maxSize]);
  
  const remove = useCallback((key: string) => {
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
  }, []);
  
  const clear = useCallback(() => {
    setCache(new Map());
  }, []);
  
  const has = useCallback((key: string): boolean => {
    return cache.has(key) && 
           Date.now() <= (cache.get(key)?.timestamp || 0) + (cache.get(key)?.expiry || 0);
  }, [cache]);
  
  return {
    get,
    set,
    remove,
    clear,
    has,
    size: cache.size
  };
}

// Specialized cache for API responses with automatic revalidation
export function useAPICache<T>(key: string, fetcher: () => Promise<T>, options: UseCacheOptions = {}) {
  const cache = useAdvancedCache<T>(options);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = cache.get(key);
      if (cached) {
        setData(cached);
        return cached;
      }
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetcher();
      cache.set(key, result);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, cache]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    mutate: (newData: T) => {
      cache.set(key, newData);
      setData(newData);
    }
  };
}