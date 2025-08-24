/**
 * Night God Tarot - Performance Optimization Engine
 * World-class performance optimizations for AI-driven tarot platform
 */

import { ref, computed, watch } from 'vue';

export class PerformanceOptimizationEngine {
  private static instance: PerformanceOptimizationEngine;
  private performanceMetrics = ref<Map<string, number>>(new Map());
  private resourceHints = new Set<string>();
  private workerPool: Worker[] = [];
  private maxWorkers = navigator.hardwareConcurrency || 4;

  private constructor() {
    this.initializeOptimizations();
  }

  static getInstance(): PerformanceOptimizationEngine {
    if (!PerformanceOptimizationEngine.instance) {
      PerformanceOptimizationEngine.instance = new PerformanceOptimizationEngine();
    }
    return PerformanceOptimizationEngine.instance;
  }

  private initializeOptimizations() {
    // Enable aggressive caching
    this.setupServiceWorkerCache();
    
    // Preload critical resources
    this.preloadCriticalAssets();
    
    // Initialize Web Workers for heavy computations
    this.initializeWorkerPool();
    
    // Setup performance monitoring
    this.setupPerformanceObserver();
    
    // Enable resource hints
    this.setupResourceHints();
    
    // Implement request batching
    this.setupRequestBatching();
  }

  private setupServiceWorkerCache() {
    if ('serviceWorker' in navigator) {
      // Enhanced service worker with intelligent caching strategies
      const cacheStrategies = {
        networkFirst: ['/api/', '/monica/'],
        cacheFirst: ['/assets/', '/images/', '/fonts/'],
        staleWhileRevalidate: ['/data/', '/config/']
      };
      
      // Store strategies in global scope for service worker
      (window as any).__CACHE_STRATEGIES__ = cacheStrategies;
    }
  }

  private preloadCriticalAssets() {
    const criticalAssets = [
      '/assets/tarot-cards/',
      '/assets/cosmic-bg.jpg',
      '/fonts/mystical.woff2'
    ];

    criticalAssets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = asset;
      link.as = asset.includes('font') ? 'font' : 'image';
      if (asset.includes('font')) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }

  private initializeWorkerPool() {
    // Create worker pool for parallel AI processing
    for (let i = 0; i < this.maxWorkers; i++) {
      const workerCode = `
        self.addEventListener('message', async (e) => {
          const { type, data } = e.data;
          
          switch(type) {
            case 'processAI':
              // Parallel AI processing logic
              const result = await processAIRequest(data);
              self.postMessage({ type: 'aiResult', data: result });
              break;
              
            case 'imageOptimization':
              // Image processing in worker
              const optimized = await optimizeImage(data);
              self.postMessage({ type: 'imageResult', data: optimized });
              break;
          }
        });
        
        async function processAIRequest(data) {
          // Simulate AI processing
          return { processed: true, ...data };
        }
        
        async function optimizeImage(imageData) {
          // Image optimization logic
          return imageData;
        }
      `;
      
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));
      this.workerPool.push(worker);
    }
  }

  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.performanceMetrics.value.set(entry.name, entry.startTime);
          
          // Log critical performance issues
          if (entry.entryType === 'largest-contentful-paint' && entry.startTime > 2500) {
            console.warn('LCP exceeds target:', entry.startTime);
            this.optimizeLCP();
          }
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
  }

  private optimizeLCP() {
    // Dynamically optimize Largest Contentful Paint
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img, index) => {
      if (index < 3) {
        img.setAttribute('loading', 'eager');
      }
    });
  }

  private setupResourceHints() {
    // DNS prefetch for external APIs
    const apiDomains = [
      'https://api.anthropic.com',
      'https://api.openai.com',
      'https://generativelanguage.googleapis.com'
    ];

    apiDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  private setupRequestBatching() {
    // Batch multiple API requests
    let requestQueue: any[] = [];
    let batchTimeout: NodeJS.Timeout | null = null;

    (window as any).__batchRequest = (request: any) => {
      requestQueue.push(request);
      
      if (batchTimeout) clearTimeout(batchTimeout);
      
      batchTimeout = setTimeout(() => {
        this.processBatchRequests(requestQueue);
        requestQueue = [];
      }, 50); // 50ms debounce
    };
  }

  private processBatchRequests(requests: any[]) {
    // Process batched requests efficiently
    const grouped = this.groupRequestsByEndpoint(requests);
    
    Object.entries(grouped).forEach(([endpoint, reqs]) => {
      // Send batched request
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch: reqs })
      });
    });
  }

  private groupRequestsByEndpoint(requests: any[]) {
    return requests.reduce((acc, req) => {
      const endpoint = req.url.split('?')[0];
      if (!acc[endpoint]) acc[endpoint] = [];
      acc[endpoint].push(req);
      return acc;
    }, {} as Record<string, any[]>);
  }

  // Public API for component optimization
  public async optimizeComponent(componentName: string) {
    const startTime = performance.now();
    
    // Dynamic import with prefetch
    const component = await import(
      /* webpackPrefetch: true */
      /* webpackChunkName: "[request]" */
      `@/components/${componentName}.vue`
    );
    
    const loadTime = performance.now() - startTime;
    this.performanceMetrics.value.set(`component-${componentName}`, loadTime);
    
    return component;
  }

  public parallelizeAIRequests(requests: Promise<any>[]) {
    // Use Promise.allSettled for resilient parallel processing
    return Promise.allSettled(requests).then(results => {
      const successful = results
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<any>).value);
      
      const failed = results
        .filter(r => r.status === 'rejected')
        .map(r => (r as PromiseRejectedResult).reason);
      
      if (failed.length > 0) {
        console.warn('Some AI requests failed:', failed);
      }
      
      return successful;
    });
  }

  public enableIntersectionObserver(elements: Element[], callback: IntersectionObserverCallback) {
    const observer = new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.01
    });

    elements.forEach(el => observer.observe(el));
    return observer;
  }

  public virtualizeList<T>(items: T[], containerHeight: number, itemHeight: number) {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const totalHeight = items.length * itemHeight;
    
    return {
      visibleItems: computed(() => {
        const scrollTop = window.scrollY;
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
        
        return items.slice(startIndex, endIndex).map((item, index) => ({
          item,
          style: {
            position: 'absolute',
            top: `${(startIndex + index) * itemHeight}px`,
            height: `${itemHeight}px`
          }
        }));
      }),
      containerStyle: {
        position: 'relative',
        height: `${totalHeight}px`
      }
    };
  }

  public memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map();
    
    return ((...args: Parameters<T>) => {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = fn(...args);
      cache.set(key, result);
      
      // Limit cache size
      if (cache.size > 100) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      
      return result;
    }) as T;
  }

  public debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
    let timeoutId: NodeJS.Timeout;
    
    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      
      return new Promise((resolve) => {
        timeoutId = setTimeout(() => {
          resolve(fn(...args));
        }, delay);
      });
    }) as T;
  }

  public throttle<T extends (...args: any[]) => any>(fn: T, limit: number): T {
    let inThrottle = false;
    
    return ((...args: Parameters<T>) => {
      if (!inThrottle) {
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
        return fn(...args);
      }
    }) as T;
  }

  public getMetrics() {
    return {
      metrics: Object.fromEntries(this.performanceMetrics.value),
      recommendations: this.generateRecommendations()
    };
  }

  private generateRecommendations() {
    const recommendations = [];
    const metrics = this.performanceMetrics.value;
    
    if (metrics.get('largest-contentful-paint') > 2500) {
      recommendations.push('Optimize largest contentful paint by preloading critical images');
    }
    
    if (metrics.get('first-input-delay') > 100) {
      recommendations.push('Reduce JavaScript execution time to improve interactivity');
    }
    
    return recommendations;
  }
}

export const performanceEngine = PerformanceOptimizationEngine.getInstance();