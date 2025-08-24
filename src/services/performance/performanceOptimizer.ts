/**
 * ULTIMATE PERFORMANCE OPTIMIZER 2030
 * Advanced performance monitoring and optimization system
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  fcp: number // First Contentful Paint
  ttfb: number // Time to First Byte
  
  // Custom Metrics
  aiResponseTime: number
  componentRenderTime: number
  bundleLoadTime: number
  memoryUsage: number
  networkLatency: number
  
  // User Experience
  interactionLatency: number
  scrollSmoothness: number
  animationFrameRate: number
  
  timestamp: number
}

export interface OptimizationStrategy {
  name: string
  type: 'preload' | 'lazy_load' | 'cache' | 'compress' | 'debounce' | 'virtualize'
  priority: 'high' | 'medium' | 'low'
  implementation: () => Promise<void>
  impact: number // Expected performance improvement (0-100)
  cost: number // Implementation complexity (0-100)
}

export interface ResourceUsage {
  cpu: number
  memory: number
  network: number
  storage: number
  timestamp: number
}

class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private metrics: PerformanceMetrics[] = []
  private observer?: PerformanceObserver
  private intersectionObserver?: IntersectionObserver
  private resourceUsage: ResourceUsage[] = []
  private optimizationStrategies: OptimizationStrategy[] = []
  private performanceTargets = {
    lcp: 2500, // 2.5s
    fid: 100,  // 100ms
    cls: 0.1,  // 0.1
    fcp: 1800, // 1.8s
    ttfb: 600  // 600ms
  }

  private constructor() {
    this.initializePerformanceMonitoring()
    this.initializeOptimizationStrategies()
    this.startContinuousOptimization()
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer()
    }
    return PerformanceOptimizer.instance
  }

  // === PERFORMANCE MONITORING ===
  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined') return

    // Web Vitals monitoring
    this.observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.processPerformanceEntry(entry)
      }
    })

    try {
      this.observer.observe({ entryTypes: ['navigation', 'measure', 'paint', 'largest-contentful-paint'] })
      
      // Monitor resource timing
      this.observer.observe({ entryTypes: ['resource'] })
      
      // Monitor user interactions
      this.observer.observe({ entryTypes: ['event'] })
    } catch (error) {
      console.warn('Performance Observer not fully supported:', error)
    }

    // Monitor memory usage
    setInterval(() => {
      this.collectResourceUsage()
    }, 5000)
  }

  private processPerformanceEntry(entry: PerformanceEntry): void {
    const now = Date.now()

    if (entry.entryType === 'navigation') {
      const navEntry = entry as PerformanceNavigationTiming
      this.updateMetric('ttfb', navEntry.responseStart - navEntry.fetchStart, now)
      this.updateMetric('fcp', navEntry.domContentLoadedEventEnd - navEntry.fetchStart, now)
    } else if (entry.entryType === 'paint') {
      const paintEntry = entry as PerformancePaintTiming
      if (paintEntry.name === 'first-contentful-paint') {
        this.updateMetric('fcp', paintEntry.startTime, now)
      }
    } else if (entry.entryType === 'largest-contentful-paint') {
      const lcpEntry = entry as any // LCP interface not fully standardized
      this.updateMetric('lcp', lcpEntry.startTime, now)
    }
  }

  private updateMetric(metric: keyof PerformanceMetrics, value: number, timestamp: number): void {
    const currentMetrics = this.getCurrentMetrics()
    currentMetrics[metric] = value
    currentMetrics.timestamp = timestamp

    // Trigger optimization if thresholds exceeded
    this.checkPerformanceThresholds(currentMetrics)
  }

  private getCurrentMetrics(): PerformanceMetrics {
    const latest = this.metrics[this.metrics.length - 1]
    if (latest && Date.now() - latest.timestamp < 5000) {
      return latest
    }

    const newMetrics: PerformanceMetrics = {
      lcp: 0, fid: 0, cls: 0, fcp: 0, ttfb: 0,
      aiResponseTime: 0, componentRenderTime: 0, bundleLoadTime: 0,
      memoryUsage: 0, networkLatency: 0, interactionLatency: 0,
      scrollSmoothness: 60, animationFrameRate: 60,
      timestamp: Date.now()
    }

    this.metrics.push(newMetrics)
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }

    return newMetrics
  }

  // === RESOURCE USAGE MONITORING ===
  private collectResourceUsage(): void {
    if (typeof window === 'undefined') return

    const now = Date.now()
    const usage: ResourceUsage = {
      cpu: this.estimateCPUUsage(),
      memory: this.getMemoryUsage(),
      network: this.estimateNetworkUsage(),
      storage: this.getStorageUsage(),
      timestamp: now
    }

    this.resourceUsage.push(usage)
    
    // Keep only last 50 readings
    if (this.resourceUsage.length > 50) {
      this.resourceUsage = this.resourceUsage.slice(-50)
    }

    // Trigger optimization if resources are strained
    if (usage.memory > 80 || usage.cpu > 90) {
      this.triggerEmergencyOptimization()
    }
  }

  private estimateCPUUsage(): number {
    // Estimate CPU usage based on frame rate
    if (!window.performance || !window.performance.now) return 0

    const startTime = performance.now()
    let iterations = 0
    const testDuration = 10 // ms

    while (performance.now() - startTime < testDuration) {
      iterations++
    }

    // Higher iterations = more available CPU
    // Convert to usage percentage (inverted)
    return Math.max(0, 100 - (iterations / 10000) * 100)
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    }
    return 0
  }

  private estimateNetworkUsage(): number {
    // Estimate based on recent resource loading times
    if (!window.performance || !window.performance.getEntriesByType) return 0

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const recentResources = resources.filter(r => 
      r.startTime > performance.now() - 10000 // Last 10 seconds
    )

    if (recentResources.length === 0) return 0

    const avgLoadTime = recentResources.reduce((sum, r) => 
      sum + (r.responseEnd - r.startTime), 0
    ) / recentResources.length

    // Convert to usage percentage (higher load time = more network usage)
    return Math.min(100, (avgLoadTime / 1000) * 10)
  }

  private getStorageUsage(): number {
    if (!navigator.storage || !navigator.storage.estimate) return 0

    navigator.storage.estimate().then(estimate => {
      if (estimate.quota && estimate.usage) {
        return (estimate.usage / estimate.quota) * 100
      }
    }).catch(() => 0)

    return 0
  }

  // === OPTIMIZATION STRATEGIES ===
  private initializeOptimizationStrategies(): void {
    this.optimizationStrategies = [
      {
        name: 'Image Lazy Loading',
        type: 'lazy_load',
        priority: 'high',
        impact: 30,
        cost: 20,
        implementation: this.implementImageLazyLoading.bind(this)
      },
      {
        name: 'Component Code Splitting',
        type: 'lazy_load',
        priority: 'high',
        impact: 40,
        cost: 30,
        implementation: this.implementCodeSplitting.bind(this)
      },
      {
        name: 'AI Response Caching',
        type: 'cache',
        priority: 'high',
        impact: 50,
        cost: 15,
        implementation: this.implementAIResponseCaching.bind(this)
      },
      {
        name: 'Bundle Compression',
        type: 'compress',
        priority: 'medium',
        impact: 25,
        cost: 10,
        implementation: this.implementBundleCompression.bind(this)
      },
      {
        name: 'Virtual Scrolling',
        type: 'virtualize',
        priority: 'medium',
        impact: 35,
        cost: 40,
        implementation: this.implementVirtualScrolling.bind(this)
      },
      {
        name: 'Resource Preloading',
        type: 'preload',
        priority: 'medium',
        impact: 20,
        cost: 25,
        implementation: this.implementResourcePreloading.bind(this)
      },
      {
        name: 'Input Debouncing',
        type: 'debounce',
        priority: 'low',
        impact: 15,
        cost: 5,
        implementation: this.implementInputDebouncing.bind(this)
      }
    ]
  }

  // === INDIVIDUAL OPTIMIZATION IMPLEMENTATIONS ===
  private async implementImageLazyLoading(): Promise<void> {
    if (this.intersectionObserver) return // Already implemented

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
            this.intersectionObserver?.unobserve(img)
          }
        }
      })
    }, {
      rootMargin: '50px'
    })

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.intersectionObserver?.observe(img)
    })
  }

  private async implementCodeSplitting(): Promise<void> {
    // This would typically be handled at build time
    // Here we can implement dynamic imports for heavy components
    
    // Example: Dynamically import heavy AI components only when needed
    const loadAIComponent = async () => {
      const { default: AIComponent } = await import('@/components/quantum/UltimateAI2030Reading.vue')
      return AIComponent
    }

    // Cache the import promise
    ;(window as any).__aiComponentLoader = loadAIComponent
  }

  private async implementAIResponseCaching(): Promise<void> {
    const cache = new Map<string, { response: any; timestamp: number; ttl: number }>()
    const maxCacheSize = 50
    const defaultTTL = 5 * 60 * 1000 // 5 minutes

    const originalFetch = window.fetch
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString()
      
      // Only cache AI API responses
      if (url.includes('api.monica.im') || url.includes('openapi.monica.im')) {
        const cacheKey = url + JSON.stringify(init?.body)
        const cached = cache.get(cacheKey)
        
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
          return new Response(JSON.stringify(cached.response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        }

        const response = await originalFetch(input, init)
        const cloned = response.clone()
        
        if (response.ok) {
          const data = await cloned.json()
          
          // Manage cache size
          if (cache.size >= maxCacheSize) {
            const oldestKey = Array.from(cache.keys())[0]
            cache.delete(oldestKey)
          }
          
          cache.set(cacheKey, {
            response: data,
            timestamp: Date.now(),
            ttl: defaultTTL
          })
        }
        
        return response
      }
      
      return originalFetch(input, init)
    }
  }

  private async implementBundleCompression(): Promise<void> {
    // This is typically handled at build time with Vite/Webpack
    // Here we can implement runtime compression for dynamic content
    
    if ('CompressionStream' in window) {
      const compressText = async (text: string): Promise<string> => {
        const stream = new CompressionStream('gzip')
        const writer = stream.writable.getWriter()
        const reader = stream.readable.getReader()
        
        writer.write(new TextEncoder().encode(text))
        writer.close()
        
        const chunks: Uint8Array[] = []
        let done = false
        
        while (!done) {
          const { value, done: readerDone } = await reader.read()
          done = readerDone
          if (value) chunks.push(value)
        }
        
        return btoa(String.fromCharCode(...new Uint8Array(
          chunks.reduce((acc, chunk) => [...acc, ...chunk], [] as number[])
        )))
      }
      
      // Make compression utility available globally
      ;(window as any).__compressText = compressText
    }
  }

  private async implementVirtualScrolling(): Promise<void> {
    // Implement virtual scrolling for large lists
    const createVirtualList = (container: HTMLElement, items: any[], itemHeight: number) => {
      const viewport = container.clientHeight
      const visibleCount = Math.ceil(viewport / itemHeight) + 2
      let scrollTop = 0
      
      const updateVisible = () => {
        const startIndex = Math.floor(scrollTop / itemHeight)
        const endIndex = Math.min(startIndex + visibleCount, items.length)
        
        // Update visible items
        container.style.height = `${items.length * itemHeight}px`
        container.style.paddingTop = `${startIndex * itemHeight}px`
        
        // Render only visible items
        const visibleItems = items.slice(startIndex, endIndex)
        // Implementation would continue here...
      }
      
      container.addEventListener('scroll', (e) => {
        scrollTop = (e.target as HTMLElement).scrollTop
        requestAnimationFrame(updateVisible)
      })
      
      updateVisible()
    }
    
    ;(window as any).__createVirtualList = createVirtualList
  }

  private async implementResourcePreloading(): Promise<void> {
    const criticalResources = [
      '/fonts/Inter-Regular.woff2',
      '/fonts/PlayfairDisplay-Regular.woff2',
      '/images/tarot-cards/major-arcana/',
      '/api/tarot/deck'
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      
      if (resource.includes('.woff2')) {
        link.as = 'font'
        link.type = 'font/woff2'
        link.crossOrigin = 'anonymous'
      } else if (resource.includes('/api/')) {
        link.as = 'fetch'
        link.crossOrigin = 'anonymous'
      } else if (resource.includes('/images/')) {
        link.as = 'image'
      }
      
      link.href = resource
      document.head.appendChild(link)
    })
  }

  private async implementInputDebouncing(): Promise<void> {
    const debounce = (func: Function, delay: number) => {
      let timeoutId: number
      return (...args: any[]) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func.apply(null, args), delay)
      }
    }

    // Apply debouncing to all search inputs
    document.querySelectorAll('input[type="search"], input[data-search]').forEach(input => {
      const originalHandler = (input as any).__originalInputHandler
      if (originalHandler) return // Already debounced

      const debouncedHandler = debounce((e: Event) => {
        const customEvent = new CustomEvent('debouncedInput', { detail: e })
        input.dispatchEvent(customEvent)
      }, 300)

      input.addEventListener('input', debouncedHandler)
      ;(input as any).__originalInputHandler = debouncedHandler
    })
  }

  // === PERFORMANCE THRESHOLD CHECKING ===
  private checkPerformanceThresholds(metrics: PerformanceMetrics): void {
    const violations: string[] = []

    if (metrics.lcp > this.performanceTargets.lcp) {
      violations.push(`LCP: ${metrics.lcp}ms > ${this.performanceTargets.lcp}ms`)
    }
    if (metrics.fid > this.performanceTargets.fid) {
      violations.push(`FID: ${metrics.fid}ms > ${this.performanceTargets.fid}ms`)
    }
    if (metrics.cls > this.performanceTargets.cls) {
      violations.push(`CLS: ${metrics.cls} > ${this.performanceTargets.cls}`)
    }
    if (metrics.fcp > this.performanceTargets.fcp) {
      violations.push(`FCP: ${metrics.fcp}ms > ${this.performanceTargets.fcp}ms`)
    }
    if (metrics.ttfb > this.performanceTargets.ttfb) {
      violations.push(`TTFB: ${metrics.ttfb}ms > ${this.performanceTargets.ttfb}ms`)
    }

    if (violations.length > 0) {
      this.triggerOptimization(violations)
    }
  }

  private async triggerOptimization(violations: string[]): Promise<void> {
    // Sort strategies by impact/cost ratio
    const sortedStrategies = this.optimizationStrategies
      .sort((a, b) => (b.impact / b.cost) - (a.impact / a.cost))

    // Implement high-priority optimizations first
    for (const strategy of sortedStrategies.filter(s => s.priority === 'high')) {
      try {
        await strategy.implementation()
        console.log(`✅ Implemented optimization: ${strategy.name}`)
      } catch (error) {
        console.warn(`❌ Failed to implement ${strategy.name}:`, error)
      }
    }
  }

  private async triggerEmergencyOptimization(): Promise<void> {
    // Immediate performance relief measures
    
    // 1. Clear unused caches
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      const oldCaches = cacheNames.filter(name => 
        !name.includes(new Date().toISOString().substring(0, 7)) // Not current month
      )
      
      await Promise.all(oldCaches.map(name => caches.delete(name)))
    }

    // 2. Reduce image quality temporarily
    document.querySelectorAll('img').forEach(img => {
      if (!img.dataset.originalSrc) {
        img.dataset.originalSrc = img.src
        // Replace with lower quality version if available
        img.src = img.src.replace(/\.(jpg|jpeg|png)$/, '-low.$1')
      }
    })

    // 3. Disable non-essential animations
    document.body.style.setProperty('--animation-duration', '0s')
    
    // 4. Cleanup DOM
    this.cleanupUnusedElements()
  }

  private cleanupUnusedElements(): void {
    // Remove hidden elements that aren't needed
    const hiddenElements = document.querySelectorAll('[style*="display: none"], .hidden')
    hiddenElements.forEach(element => {
      if (!element.dataset.keepAlive) {
        element.remove()
      }
    })

    // Cleanup event listeners on removed elements
    if ('getEventListeners' in window) {
      // This is only available in DevTools, but shows the concept
      // In production, we'd maintain our own registry
    }
  }

  // === CONTINUOUS OPTIMIZATION ===
  private startContinuousOptimization(): void {
    // Run optimization cycle every 30 seconds
    setInterval(() => {
      this.runOptimizationCycle()
    }, 30000)

    // Run more frequent lightweight checks
    setInterval(() => {
      this.runLightweightOptimization()
    }, 5000)
  }

  private runOptimizationCycle(): void {
    const currentMetrics = this.getCurrentMetrics()
    const recentUsage = this.resourceUsage.slice(-10)

    // Calculate performance score
    const performanceScore = this.calculatePerformanceScore(currentMetrics)
    
    if (performanceScore < 70) {
      // Implement medium priority optimizations
      this.optimizationStrategies
        .filter(s => s.priority === 'medium')
        .forEach(strategy => {
          strategy.implementation().catch(console.warn)
        })
    }
  }

  private runLightweightOptimization(): void {
    // Quick wins that can be applied frequently
    
    // Cleanup console logs in production
    if (!import.meta.env.DEV && console.log.toString().indexOf('native code') === -1) {
      console.log = () => {}
      console.warn = () => {}
      console.info = () => {}
    }

    // Optimize memory by clearing old metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-50)
    }
  }

  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    let score = 100

    // Deduct points for Core Web Vitals violations
    if (metrics.lcp > this.performanceTargets.lcp) {
      score -= 20
    }
    if (metrics.fid > this.performanceTargets.fid) {
      score -= 15
    }
    if (metrics.cls > this.performanceTargets.cls) {
      score -= 15
    }
    if (metrics.fcp > this.performanceTargets.fcp) {
      score -= 10
    }
    if (metrics.ttfb > this.performanceTargets.ttfb) {
      score -= 10
    }

    // Factor in resource usage
    const latestUsage = this.resourceUsage[this.resourceUsage.length - 1]
    if (latestUsage) {
      if (latestUsage.memory > 80) score -= 15
      if (latestUsage.cpu > 90) score -= 10
      if (latestUsage.network > 70) score -= 5
    }

    return Math.max(0, score)
  }

  // === PUBLIC API ===
  getPerformanceReport(): {
    currentMetrics: PerformanceMetrics
    performanceScore: number
    resourceUsage: ResourceUsage
    optimizationsApplied: string[]
    recommendations: string[]
  } {
    const currentMetrics = this.getCurrentMetrics()
    const latestUsage = this.resourceUsage[this.resourceUsage.length - 1] || {
      cpu: 0, memory: 0, network: 0, storage: 0, timestamp: Date.now()
    }

    return {
      currentMetrics,
      performanceScore: this.calculatePerformanceScore(currentMetrics),
      resourceUsage: latestUsage,
      optimizationsApplied: this.optimizationStrategies.map(s => s.name),
      recommendations: this.generateRecommendations(currentMetrics)
    }
  }

  private generateRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = []

    if (metrics.lcp > this.performanceTargets.lcp) {
      recommendations.push('Optimize largest contentful paint by lazy loading images and preloading critical resources')
    }
    if (metrics.fid > this.performanceTargets.fid) {
      recommendations.push('Reduce JavaScript execution time and break up long tasks')
    }
    if (metrics.cls > this.performanceTargets.cls) {
      recommendations.push('Ensure images and embeds have explicit dimensions to prevent layout shift')
    }
    if (metrics.aiResponseTime > 3000) {
      recommendations.push('Implement AI response streaming and caching to improve perceived performance')
    }

    return recommendations
  }

  async measureAIResponseTime<T>(aiCall: () => Promise<T>): Promise<T> {
    const startTime = performance.now()
    
    try {
      const result = await aiCall()
      const endTime = performance.now()
      const responseTime = endTime - startTime
      
      this.updateMetric('aiResponseTime', responseTime, Date.now())
      
      return result
    } catch (error) {
      const endTime = performance.now()
      this.updateMetric('aiResponseTime', endTime - startTime, Date.now())
      throw error
    }
  }

  trackComponentRender(componentName: string, renderTime: number): void {
    this.updateMetric('componentRenderTime', renderTime, Date.now())
    
    // Track individual component performance
    const componentMetrics = JSON.parse(
      localStorage.getItem('component-metrics') || '{}'
    )
    
    if (!componentMetrics[componentName]) {
      componentMetrics[componentName] = []
    }
    
    componentMetrics[componentName].push({
      renderTime,
      timestamp: Date.now()
    })
    
    // Keep only last 20 renders per component
    componentMetrics[componentName] = componentMetrics[componentName].slice(-20)
    
    localStorage.setItem('component-metrics', JSON.stringify(componentMetrics))
  }
}

export const performanceOptimizer = PerformanceOptimizer.getInstance()
export default performanceOptimizer