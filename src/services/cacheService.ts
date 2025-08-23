/**
 * Advanced Caching Service for Night God Tarot
 * Implements multi-layer caching with memory, localStorage, and IndexedDB
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiry: number
}

interface CacheConfig {
  defaultTTL: number // Time to live in milliseconds
  maxMemorySize: number // Max items in memory cache
  enablePersistence: boolean
}

export class CacheService {
  private static instance: CacheService
  private memoryCache: Map<string, CacheEntry<any>>
  private config: CacheConfig
  private dbName = 'NightGodTarotCache'
  private dbVersion = 1
  private db: IDBDatabase | null = null

  private constructor() {
    this.memoryCache = new Map()
    this.config = {
      defaultTTL: 3600000, // 1 hour
      maxMemorySize: 100,
      enablePersistence: true
    }
    
    if (this.config.enablePersistence) {
      this.initIndexedDB()
    }
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService()
    }
    return CacheService.instance
  }

  private async initIndexedDB(): Promise<void> {
    if (!window.indexedDB) {
      console.warn('IndexedDB not available')
      return
    }

    try {
      const request = indexedDB.open(this.dbName, this.dbVersion)
      
      request.onerror = () => {
        console.error('Failed to open IndexedDB')
      }

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' })
        }
        
        if (!db.objectStoreNames.contains('readings')) {
          const readingsStore = db.createObjectStore('readings', { keyPath: 'id' })
          readingsStore.createIndex('timestamp', 'timestamp', { unique: false })
          readingsStore.createIndex('userId', 'userId', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('aiResponses')) {
          const aiStore = db.createObjectStore('aiResponses', { keyPath: 'hash' })
          aiStore.createIndex('model', 'model', { unique: false })
        }
      }
    } catch (error) {
      console.error('IndexedDB initialization failed:', error)
    }
  }

  /**
   * Get item from cache (checks memory -> localStorage -> IndexedDB)
   */
  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    const memoryEntry = this.memoryCache.get(key)
    if (memoryEntry && memoryEntry.expiry > Date.now()) {
      return memoryEntry.data
    }

    // Check localStorage
    try {
      const localData = localStorage.getItem(`cache_${key}`)
      if (localData) {
        const entry: CacheEntry<T> = JSON.parse(localData)
        if (entry.expiry > Date.now()) {
          // Promote to memory cache
          this.memoryCache.set(key, entry)
          return entry.data
        } else {
          localStorage.removeItem(`cache_${key}`)
        }
      }
    } catch (error) {
      console.error('localStorage read error:', error)
    }

    // Check IndexedDB
    if (this.db) {
      try {
        const transaction = this.db.transaction(['cache'], 'readonly')
        const store = transaction.objectStore('cache')
        const request = store.get(key)

        return new Promise((resolve) => {
          request.onsuccess = () => {
            const result = request.result
            if (result && result.expiry > Date.now()) {
              // Promote to memory cache
              this.memoryCache.set(key, {
                data: result.data,
                timestamp: result.timestamp,
                expiry: result.expiry
              })
              resolve(result.data)
            } else {
              resolve(null)
            }
          }
          
          request.onerror = () => {
            resolve(null)
          }
        })
      } catch (error) {
        console.error('IndexedDB read error:', error)
      }
    }

    return null
  }

  /**
   * Set item in cache (saves to all layers)
   */
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    const expiry = Date.now() + (ttl || this.config.defaultTTL)
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiry
    }

    // Save to memory cache
    this.memoryCache.set(key, entry)
    
    // Enforce memory cache size limit
    if (this.memoryCache.size > this.config.maxMemorySize) {
      const firstKey = this.memoryCache.keys().next().value
      if (firstKey) {
        this.memoryCache.delete(firstKey)
      }
    }

    // Save to localStorage
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry))
    } catch (error) {
      console.warn('localStorage save failed:', error)
      // Clear old entries if quota exceeded
      this.clearOldLocalStorage()
    }

    // Save to IndexedDB
    if (this.db) {
      try {
        const transaction = this.db.transaction(['cache'], 'readwrite')
        const store = transaction.objectStore('cache')
        store.put({
          key,
          ...entry
        })
      } catch (error) {
        console.error('IndexedDB save error:', error)
      }
    }
  }

  /**
   * Cache AI reading responses
   */
  async cacheReading(reading: any): Promise<void> {
    if (!this.db) return

    try {
      const transaction = this.db.transaction(['readings'], 'readwrite')
      const store = transaction.objectStore('readings')
      store.add(reading)
    } catch (error) {
      console.error('Failed to cache reading:', error)
    }
  }

  /**
   * Get cached readings for a user
   */
  async getCachedReadings(userId: string, limit: number = 10): Promise<any[]> {
    if (!this.db) return []

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction(['readings'], 'readonly')
        const store = transaction.objectStore('readings')
        const index = store.index('userId')
        const request = index.getAll(userId)

        request.onsuccess = () => {
          const results = request.result
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit)
          resolve(results)
        }

        request.onerror = () => {
          resolve([])
        }
      } catch (error) {
        console.error('Failed to get cached readings:', error)
        resolve([])
      }
    })
  }

  /**
   * Cache AI model response for deduplication
   */
  async cacheAIResponse(prompt: string, model: string, response: string): Promise<void> {
    const hash = await this.hashString(`${prompt}_${model}`)
    
    if (this.db) {
      try {
        const transaction = this.db.transaction(['aiResponses'], 'readwrite')
        const store = transaction.objectStore('aiResponses')
        store.put({
          hash,
          prompt,
          model,
          response,
          timestamp: Date.now()
        })
      } catch (error) {
        console.error('Failed to cache AI response:', error)
      }
    }
  }

  /**
   * Get cached AI response
   */
  async getCachedAIResponse(prompt: string, model: string): Promise<string | null> {
    if (!this.db) return null

    const hash = await this.hashString(`${prompt}_${model}`)
    
    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction(['aiResponses'], 'readonly')
        const store = transaction.objectStore('aiResponses')
        const request = store.get(hash)

        request.onsuccess = () => {
          const result = request.result
          if (result) {
            // Check if response is less than 24 hours old
            if (Date.now() - result.timestamp < 86400000) {
              resolve(result.response)
            } else {
              resolve(null)
            }
          } else {
            resolve(null)
          }
        }

        request.onerror = () => {
          resolve(null)
        }
      } catch (error) {
        console.error('Failed to get cached AI response:', error)
        resolve(null)
      }
    })
  }

  /**
   * Clear all caches
   */
  async clearAll(): Promise<void> {
    // Clear memory cache
    this.memoryCache.clear()

    // Clear localStorage
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key)
      }
    })

    // Clear IndexedDB
    if (this.db) {
      const transaction = this.db.transaction(['cache', 'readings', 'aiResponses'], 'readwrite')
      transaction.objectStore('cache').clear()
      transaction.objectStore('readings').clear()
      transaction.objectStore('aiResponses').clear()
    }
  }

  /**
   * Clear old localStorage entries
   */
  private clearOldLocalStorage(): void {
    const keys = Object.keys(localStorage)
    const cacheKeys = keys.filter(k => k.startsWith('cache_'))
    
    // Remove oldest 25% of cache entries
    const toRemove = Math.ceil(cacheKeys.length * 0.25)
    cacheKeys
      .sort((a, b) => {
        try {
          const aData = JSON.parse(localStorage.getItem(a) || '{}')
          const bData = JSON.parse(localStorage.getItem(b) || '{}')
          return (aData.timestamp || 0) - (bData.timestamp || 0)
        } catch {
          return 0
        }
      })
      .slice(0, toRemove)
      .forEach(key => localStorage.removeItem(key))
  }

  /**
   * Hash string for cache keys
   */
  private async hashString(str: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Preload critical data
   */
  async preloadCriticalData(): Promise<void> {
    // Preload tarot card data
    const cardDataModule = await import('../data/cards')
    await this.set('tarotCards', cardDataModule.tarotCards, 86400000) // Cache for 24 hours

    // Preload language data
    const i18nModule = await import('../i18n')
    await this.set('i18nData', i18nModule.default, 86400000)
  }
}

export const cacheService = CacheService.getInstance()
export default cacheService