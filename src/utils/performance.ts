// Performance Optimization Utilities
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private requestCache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  private debounceTimers = new Map<string, NodeJS.Timeout>()
  private performanceMetrics = {
    totalRequests: 0,
    cacheHits: 0,
    averageResponseTime: 0,
    lastOptimized: new Date()
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer()
    }
    return PerformanceOptimizer.instance
  }

  // Advanced Request Caching with TTL
  cacheRequest<T>(key: string, data: T, ttlMs = 300000): void {
    this.requestCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    })
    
    // Auto-cleanup expired entries
    setTimeout(() => {
      this.requestCache.delete(key)
    }, ttlMs)
  }

  getCachedRequest<T>(key: string): T | null {
    const cached = this.requestCache.get(key)
    if (!cached) return null
    
    const isExpired = Date.now() - cached.timestamp > cached.ttl
    if (isExpired) {
      this.requestCache.delete(key)
      return null
    }
    
    this.performanceMetrics.cacheHits++
    return cached.data as T
  }

  // Smart Request Debouncing
  debounceApiCall<T>(
    key: string,
    apiCall: () => Promise<T>,
    delayMs = 500
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      // Clear existing timer
      const existingTimer = this.debounceTimers.get(key)
      if (existingTimer) {
        clearTimeout(existingTimer)
      }

      // Set new timer
      const timer = setTimeout(async () => {
        try {
          const startTime = Date.now()
          const result = await apiCall()
          
          // Update performance metrics
          this.updateResponseTime(Date.now() - startTime)
          this.performanceMetrics.totalRequests++
          
          resolve(result)
        } catch (error) {
          reject(error)
        } finally {
          this.debounceTimers.delete(key)
        }
      }, delayMs)

      this.debounceTimers.set(key, timer)
    })
  }

  // Request Batching for Multiple API Calls
  async batchRequests<T>(
    requests: (() => Promise<T>)[],
    batchSize = 3,
    delayBetweenBatches = 100
  ): Promise<T[]> {
    const results: T[] = []
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize)
      const batchResults = await Promise.all(batch.map(req => req()))
      results.push(...batchResults)
      
      // Small delay between batches to prevent overwhelming
      if (i + batchSize < requests.length) {
        await this.delay(delayBetweenBatches)
      }
    }
    
    return results
  }

  // Smart Error Handling with Exponential Backoff
  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    baseDelayMs = 1000,
    exponentialBase = 2
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error: any) {
        lastError = error
        
        if (attempt === maxRetries) {
          throw lastError
        }
        
        // Exponential backoff: baseDelay * (exponentialBase ^ attempt)
        const delay = baseDelayMs * Math.pow(exponentialBase, attempt)
        const jitter = Math.random() * 0.3 * delay // Add 30% jitter
        
        await this.delay(delay + jitter)
      }
    }
    
    throw lastError!
  }

  // Memory Usage Optimization
  optimizeMemoryUsage(): void {
    // Clear expired cache entries
    const now = Date.now()
    for (const [key, cached] of this.requestCache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.requestCache.delete(key)
      }
    }
    
    // Clear completed debounce timers
    this.debounceTimers.clear()
    
    // Force garbage collection if available
    if (typeof window !== 'undefined' && (window as any).gc) {
      (window as any).gc()
    }
    
    this.performanceMetrics.lastOptimized = new Date()
  }

  // Performance Monitoring
  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      cacheSize: this.requestCache.size,
      cacheHitRate: this.performanceMetrics.totalRequests > 0 
        ? (this.performanceMetrics.cacheHits / this.performanceMetrics.totalRequests) * 100 
        : 0,
      memoryUsage: this.getMemoryUsage()
    }
  }

  private updateResponseTime(responseTime: number): void {
    const { totalRequests, averageResponseTime } = this.performanceMetrics
    this.performanceMetrics.averageResponseTime = 
      ((averageResponseTime * totalRequests) + responseTime) / (totalRequests + 1)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private getMemoryUsage(): any {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return {
        used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024)
      }
    }
    return { message: 'Memory info not available' }
  }

  // Preload Critical Resources
  preloadResource(url: string, type: 'script' | 'style' | 'font' | 'image' = 'script'): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = url
      link.as = type
      
      link.onload = () => resolve()
      link.onerror = () => reject(new Error(`Failed to preload ${url}`))
      
      document.head.appendChild(link)
    })
  }

  // Service Worker Registration for Caching
  async registerServiceWorker(swPath = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(swPath)
        console.log('🔧 Service Worker registered for caching')
        return registration
      } catch (error) {
        console.error('Service Worker registration failed:', error)
        return null
      }
    }
    return null
  }

  // Image Lazy Loading Optimization
  setupLazyImages(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.classList.remove('lazy')
              imageObserver.unobserve(img)
            }
          }
        })
      })

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img)
      })
    }
  }

  // Critical CSS Inlining
  inlineCriticalCSS(css: string): void {
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)
  }

  // Resource Hints for Better Loading
  addResourceHints(urls: { url: string; type: 'dns-prefetch' | 'preconnect' | 'prefetch' }[]): void {
    urls.forEach(({ url, type }) => {
      const link = document.createElement('link')
      link.rel = type
      link.href = url
      document.head.appendChild(link)
    })
  }
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance()

// Auto-cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    performanceOptimizer.optimizeMemoryUsage()
  }, 5 * 60 * 1000)
}