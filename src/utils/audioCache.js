// utils/audioCache.js
class AudioCacheManager {
  constructor(options = {}) {
    // הגדרות Cache
    this.maxSize = options.maxSize || 100 * 1024 * 1024; // 100MB
    this.maxItems = options.maxItems || 10000; // backup מגבלה
    this.ttl = options.ttl || 7 * 24 * 60 * 60 * 1000; // שבוע
    this.persistentCacheEnabled = options.persistentCache !== false;
    this.cacheName = 'audio-cache-v1';
    
    // Memory Cache
    this.memoryCache = new Map();
    
    // סטטיסטיקות
    this.stats = {
      memoryHits: 0,
      persistentHits: 0,
      misses: 0,
      evictions: 0,
      errors: 0
    };
    
    // אתחול
    this.init();
  }

  async init() {
    try {
      // בדיקת תמיכה ב-Persistent Cache
      if (this.persistentCacheEnabled) {
        this.persistentCacheSupported = 'caches' in window;
        if (this.persistentCacheSupported) {
          await this.cleanExpiredPersistent();
        }
      }
      
      // ניקוי Memory Cache מפריטים פגי תוקף
      this.cleanExpiredMemory();
      
      console.log('AudioCacheManager initialized', {
        persistentSupported: this.persistentCacheSupported,
        memoryItems: this.memoryCache.size
      });
    } catch (error) {
      console.warn('AudioCache init failed:', error);
      this.stats.errors++;
    }
  }

  // בדיקת quota של הדפדפן
  async checkStorageQuota() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const usedMB = Math.round(estimate.usage / (1024 * 1024));
        const availableMB = Math.round(estimate.quota / (1024 * 1024));
        const usagePercent = Math.round((estimate.usage / estimate.quota) * 100);
        
        return {
          used: estimate.usage,
          available: estimate.quota,
          usedMB,
          availableMB,
          usagePercent,
          hasSpace: usagePercent < 90
        };
      }
    } catch (error) {
      console.warn('Could not check storage quota:', error);
    }
    return { hasSpace: true }; // אם לא יכולים לבדוק, נניח שיש מקום
  }

  // חישוב גודל Memory Cache הנוכחי
  getCurrentMemorySize() {
    return Array.from(this.memoryCache.values())
      .reduce((total, item) => total + (item.size || 0), 0);
  }

  // חישוב מגבלת פריטים דינמית
  getDynamicMaxItems() {
    const currentSize = this.getCurrentMemorySize();
    const avgItemSize = currentSize / Math.max(this.memoryCache.size, 1);
    const dynamicMax = Math.floor(this.maxSize / Math.max(avgItemSize, 1024)) * 1.2;
    return Math.min(dynamicMax, this.maxItems);
  }

  // בדיקה אם פריט תקף
  isValid(item) {
    return Date.now() - item.timestamp < this.ttl;
  }

  // ניקוי פריטים פגי תוקף מ-Memory
  cleanExpiredMemory() {
    const now = Date.now();
    let removedCount = 0;
    
    for (const [key, item] of this.memoryCache.entries()) {
      if (now - item.timestamp > this.ttl) {
        if (item.url) URL.revokeObjectURL(item.url);
        this.memoryCache.delete(key);
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      console.log(`Cleaned ${removedCount} expired memory cache items`);
    }
    return removedCount;
  }

  // ניקוי פריטים פגי תוקף מ-Persistent Cache
  async cleanExpiredPersistent() {
    if (!this.persistentCacheSupported) return 0;
    
    try {
      const cache = await caches.open(this.cacheName);
      const requests = await cache.keys();
      let removedCount = 0;
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const timestampHeader = response.headers.get('x-cache-timestamp');
          if (timestampHeader) {
            const timestamp = parseInt(timestampHeader);
            if (Date.now() - timestamp > this.ttl) {
              await cache.delete(request);
              removedCount++;
            }
          }
        }
      }
      
      if (removedCount > 0) {
        console.log(`Cleaned ${removedCount} expired persistent cache items`);
      }
      return removedCount;
    } catch (error) {
      console.warn('Failed to clean persistent cache:', error);
      this.stats.errors++;
      return 0;
    }
  }

  // אסטרטגיית LRU לMemory Cache
  evictLRUMemory(targetRatio = 0.7) {
    const items = Array.from(this.memoryCache.entries())
      .map(([key, item]) => ({ key, ...item }))
      .sort((a, b) => a.lastAccessed - b.lastAccessed);

    const targetSize = Math.floor(items.length * targetRatio);
    const itemsToRemove = items.slice(0, items.length - targetSize);

    itemsToRemove.forEach(item => {
      if (item.url) URL.revokeObjectURL(item.url);
      this.memoryCache.delete(item.key);
      this.stats.evictions++;
    });

    console.log(`LRU evicted ${itemsToRemove.length} memory cache items`);
    return itemsToRemove.length;
  }

  // בדיקה אם Memory Cache צריך פינוי
  shouldEvictMemory() {
    const dynamicMaxItems = this.getDynamicMaxItems();
    return (
      this.memoryCache.size > dynamicMaxItems ||
      this.getCurrentMemorySize() > this.maxSize
    );
  }

  // קבלת פריט מ-Memory Cache
  getFromMemory(key) {
    const item = this.memoryCache.get(key);
    
    if (!item || !this.isValid(item)) {
      if (item) {
        if (item.url) URL.revokeObjectURL(item.url);
        this.memoryCache.delete(key);
      }
      return null;
    }

    // עדכון זמן גישה אחרון
    item.lastAccessed = Date.now();
    this.memoryCache.set(key, item);
    this.stats.memoryHits++;
    
    return item;
  }

  // קבלת פריט מ-Persistent Cache
  async getFromPersistent(key) {
    if (!this.persistentCacheSupported) return null;
    
    try {
      const cache = await caches.open(this.cacheName);
      const response = await cache.match(key);
      
      if (!response) return null;
      
      // בדיקת TTL
      const timestampHeader = response.headers.get('x-cache-timestamp');
      if (timestampHeader) {
        const timestamp = parseInt(timestampHeader);
        if (Date.now() - timestamp > this.ttl) {
          await cache.delete(key);
          return null;
        }
      }
      
      const audioBlob = await response.blob();
      this.stats.persistentHits++;
      
      return {
        blob: audioBlob,
        timestamp: timestampHeader ? parseInt(timestampHeader) : Date.now()
      };
    } catch (error) {
      console.warn('Failed to get from persistent cache:', error);
      this.stats.errors++;
      return null;
    }
  }

  // שמירה ב-Memory Cache
  setInMemory(key, audioBlob, metadata = {}) {
    const now = Date.now();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const cacheItem = {
      url: audioUrl,
      size: audioBlob.size,
      timestamp: now,
      lastAccessed: now,
      ...metadata
    };

    this.memoryCache.set(key, cacheItem);

    // פינוי אם צריך
    if (this.shouldEvictMemory()) {
      this.evictLRUMemory();
    }

    return cacheItem;
  }

  // שמירה ב-Persistent Cache
  async setInPersistent(key, audioBlob) {
    if (!this.persistentCacheSupported) return false;
    
    try {
      // בדיקת מקום לפני שמירה
      const quota = await this.checkStorageQuota();
      if (!quota.hasSpace) {
        console.warn('Not enough storage space for persistent cache');
        return false;
      }
      
      const cache = await caches.open(this.cacheName);
      const response = new Response(audioBlob, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'x-cache-timestamp': Date.now().toString(),
          'x-cache-size': audioBlob.size.toString()
        }
      });
      
      await cache.put(key, response);
      return true;
    } catch (error) {
      console.warn('Failed to save to persistent cache:', error);
      this.stats.errors++;
      return false;
    }
  }

  // קבלת פריט (ממשק עיקרי)
  async get(key) {
    this.cleanExpiredMemory(); // ניקוי קל בכל גישה
    
    // נסה Memory Cache תחילה
    const memoryItem = this.getFromMemory(key);
    if (memoryItem) {
      return memoryItem;
    }

    // נסה Persistent Cache
    const persistentItem = await this.getFromPersistent(key);
    if (persistentItem) {
      // העבר חזרה ל-Memory Cache לגישה מהירה הבאה
      const memoryItem = this.setInMemory(key, persistentItem.blob, {
        fromPersistent: true
      });
      return memoryItem;
    }

    this.stats.misses++;
    return null;
  }

  // שמירת פריט (ממשק עיקרי)
  async set(key, audioBlob, metadata = {}) {
    this.cleanExpiredMemory();
    
    // שמירה ב-Memory Cache
    const memoryItem = this.setInMemory(key, audioBlob, metadata);

    // שמירה ב-Persistent Cache (אסינכרוני, לא חוסם)
    this.setInPersistent(key, audioBlob).catch(error => {
      console.warn('Background persistent cache save failed:', error);
    });

    return memoryItem;
  }

  // ניקוי כל הCache
  async clear() {
    // ניקוי Memory Cache
    for (const item of this.memoryCache.values()) {
      if (item.url) URL.revokeObjectURL(item.url);
    }
    this.memoryCache.clear();

    // ניקוי Persistent Cache
    if (this.persistentCacheSupported) {
      try {
        await caches.delete(this.cacheName);
      } catch (error) {
        console.warn('Failed to clear persistent cache:', error);
      }
    }

    // איפוס סטטיסטיקות
    this.stats = {
      memoryHits: 0,
      persistentHits: 0,
      misses: 0,
      evictions: 0,
      errors: 0
    };

    console.log('Audio cache cleared');
  }

  // סטטיסטיקות מפורטות
  async getStats() {
    const totalRequests = this.stats.memoryHits + this.stats.persistentHits + this.stats.misses;
    const hitRate = totalRequests > 0 ? 
      ((this.stats.memoryHits + this.stats.persistentHits) / totalRequests * 100).toFixed(1) : 0;
    
    const quota = await this.checkStorageQuota();
    
    return {
      ...this.stats,
      totalRequests,
      hitRate: parseFloat(hitRate),
      memory: {
        items: this.memoryCache.size,
        sizeBytes: this.getCurrentMemorySize(),
        sizeMB: (this.getCurrentMemorySize() / (1024 * 1024)).toFixed(2),
        maxItems: this.getDynamicMaxItems()
      },
      persistent: {
        supported: this.persistentCacheSupported,
        ...quota
      },
      config: {
        maxSizeMB: Math.round(this.maxSize / (1024 * 1024)),
        ttlDays: Math.round(this.ttl / (24 * 60 * 60 * 1000))
      }
    };
  }
}

// יצירת instance גלובלי
let globalAudioCache = null;

export const getAudioCache = (options = {}) => {
  if (!globalAudioCache) {
    globalAudioCache = new AudioCacheManager({
      maxSize: 100 * 1024 * 1024, // 100MB
      maxItems: 10000,
      ttl: 7 * 24 * 60 * 60 * 1000, // שבוע
      persistentCache: true,
      ...options
    });
  }
  return globalAudioCache;
};

export default AudioCacheManager;