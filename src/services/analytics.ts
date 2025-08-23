/**
 * Advanced Analytics & Monitoring Service
 * Tracks user behavior, performance metrics, and system health
 */

import { secureConfig } from '../config/secureConfig'
import { cacheService } from './cacheService'

interface AnalyticsEvent {
  id: string
  type: 'reading' | 'card-draw' | 'user-action' | 'system' | 'performance' | 'error'
  category: string
  action: string
  label?: string
  value?: number
  timestamp: Date
  userId?: string
  sessionId: string
  metadata?: Record<string, any>
  customDimensions?: Record<string, string>
}

interface PerformanceMetric {
  name: string
  value: number
  timestamp: Date
  category: 'loading' | 'rendering' | 'api' | 'animation' | 'cache'
}

interface UserSession {
  id: string
  userId?: string
  startTime: Date
  lastActivity: Date
  pageViews: number
  events: string[]
  userAgent: string
  referrer: string
  language: string
  timezone: string
  screenSize: string
  deviceType: 'desktop' | 'tablet' | 'mobile'
}

export class AnalyticsService {
  private static instance: AnalyticsService
  private events: AnalyticsEvent[] = []
  private performanceMetrics: PerformanceMetric[] = []
  private currentSession: UserSession | null = null
  private batchTimer: number | null = null
  private isEnabled: boolean = false

  private constructor() {
    this.isEnabled = secureConfig.isFeatureEnabled('enableAnalytics')
    
    if (this.isEnabled) {
      this.initializeSession()
      this.setupPerformanceObserver()
      this.setupErrorTracking()
      this.startBatchTimer()
    }
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  /**
   * Initialize user session
   */
  private initializeSession(): void {
    const sessionId = this.generateSessionId()
    
    this.currentSession = {
      id: sessionId,
      startTime: new Date(),
      lastActivity: new Date(),
      pageViews: 1,
      events: [],
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenSize: `${screen.width}x${screen.height}`,
      deviceType: this.detectDeviceType()
    }

    // Store session in cache
    cacheService.set(`session_${sessionId}`, this.currentSession)
    
    // Track session start
    this.track('system', 'session-start', 'new-session')
  }

  /**
   * Track analytics event
   */
  track(
    category: string, 
    action: string, 
    label?: string, 
    value?: number,
    metadata?: Record<string, any>
  ): void {
    if (!this.isEnabled || !this.currentSession) return

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      type: this.categorizeEvent(category, action),
      category,
      action,
      label,
      value,
      timestamp: new Date(),
      sessionId: this.currentSession.id,
      metadata,
      customDimensions: this.getCustomDimensions()
    }

    this.events.push(event)
    this.currentSession.events.push(event.id)
    this.currentSession.lastActivity = new Date()

    // Send critical events immediately
    if (this.isCriticalEvent(category, action)) {
      this.sendEventsBatch([event])
    }

    console.log('📊 Analytics Event:', event)
  }

  /**
   * Track tarot reading events
   */
  trackReading(
    action: 'start' | 'complete' | 'error',
    details: {
      cards?: string[]
      question?: string
      model?: string
      duration?: number
      errorType?: string
    }
  ): void {
    this.track('reading', `reading-${action}`, details.model, details.duration, {
      cardCount: details.cards?.length || 0,
      questionLength: details.question?.length || 0,
      ...details
    })
  }

  /**
   * Track user interactions
   */
  trackUserAction(
    action: string,
    element?: string,
    context?: Record<string, any>
  ): void {
    this.track('user', action, element, undefined, context)
  }

  /**
   * Track performance metrics
   */
  trackPerformance(name: string, value: number, category: PerformanceMetric['category']): void {
    if (!this.isEnabled) return

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      category
    }

    this.performanceMetrics.push(metric)
    
    // Track as analytics event
    this.track('performance', name, category, value)
  }

  /**
   * Track page view
   */
  trackPageView(page: string, title?: string): void {
    if (!this.currentSession) return

    this.currentSession.pageViews++
    this.track('navigation', 'page-view', page, undefined, {
      title: title || document.title,
      url: window.location.href,
      path: window.location.pathname
    })
  }

  /**
   * Track errors
   */
  trackError(
    error: Error | string,
    context?: {
      component?: string
      action?: string
      userId?: string
      additionalData?: Record<string, any>
    }
  ): void {
    const errorMessage = typeof error === 'string' ? error : error.message
    const errorStack = typeof error === 'string' ? undefined : error.stack

    this.track('error', 'javascript-error', context?.component, undefined, {
      errorMessage,
      errorStack,
      ...context?.additionalData,
      url: window.location.href,
      userAgent: navigator.userAgent
    })

    // Send error immediately
    const errorEvent: AnalyticsEvent = {
      id: this.generateEventId(),
      type: 'error',
      category: 'error',
      action: 'javascript-error',
      label: context?.component,
      timestamp: new Date(),
      sessionId: this.currentSession?.id || 'unknown',
      metadata: {
        errorMessage,
        errorStack,
        ...context?.additionalData
      }
    }

    this.sendEventsBatch([errorEvent])
  }

  /**
   * Get analytics dashboard data
   */
  async getDashboardData(): Promise<{
    sessions: number
    events: number
    topEvents: Array<{ name: string; count: number }>
    performance: Array<{ metric: string; average: number }>
    errors: number
  }> {
    const cachedSessions = await cacheService.get<UserSession[]>('all-sessions') || []
    const topEvents = this.getTopEvents()
    const avgPerformance = this.getAveragePerformance()

    return {
      sessions: cachedSessions.length,
      events: this.events.length,
      topEvents,
      performance: avgPerformance,
      errors: this.events.filter(e => e.type === 'error').length
    }
  }

  /**
   * Setup performance observer
   */
  private setupPerformanceObserver(): void {
    if (typeof PerformanceObserver === 'undefined') return

    // Observe navigation timing
    const navObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          this.trackPerformance('page-load', navEntry.loadEventEnd - navEntry.fetchStart, 'loading')
          this.trackPerformance('dom-content-loaded', navEntry.domContentLoadedEventEnd - navEntry.fetchStart, 'loading')
        }
      }
    })

    try {
      navObserver.observe({ entryTypes: ['navigation'] })
    } catch (e) {
      console.warn('Navigation timing observer not supported')
    }

    // Observe resource timing
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming
          if (resourceEntry.duration > 1000) { // Only track slow resources
            this.trackPerformance('resource-load', resourceEntry.duration, 'loading')
          }
        }
      }
    })

    try {
      resourceObserver.observe({ entryTypes: ['resource'] })
    } catch (e) {
      console.warn('Resource timing observer not supported')
    }

    // Observe paint timing
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.trackPerformance('first-contentful-paint', entry.startTime, 'rendering')
        }
        if (entry.name === 'largest-contentful-paint') {
          this.trackPerformance('largest-contentful-paint', entry.startTime, 'rendering')
        }
      }
    })

    try {
      paintObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] })
    } catch (e) {
      console.warn('Paint timing observer not supported')
    }
  }

  /**
   * Setup error tracking
   */
  private setupErrorTracking(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError(event.error || event.message, {
        component: 'global',
        action: 'unhandled-error',
        additionalData: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      })
    })

    // Unhandled promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(`Unhandled Promise Rejection: ${event.reason}`, {
        component: 'global',
        action: 'unhandled-promise',
        additionalData: {
          reason: String(event.reason)
        }
      })
    })
  }

  /**
   * Start batch timer for sending events
   */
  private startBatchTimer(): void {
    this.batchTimer = window.setInterval(() => {
      if (this.events.length > 0) {
        this.sendEventsBatch()
      }
    }, 30000) // Send every 30 seconds
  }

  /**
   * Send events to analytics endpoint
   */
  private async sendEventsBatch(events?: AnalyticsEvent[]): Promise<void> {
    const eventsToSend = events || [...this.events]
    if (eventsToSend.length === 0) return

    try {
      // In production, this would send to your analytics service
      console.log('📊 Sending analytics batch:', eventsToSend.length, 'events')
      
      // Store events in cache for offline support
      await cacheService.set(
        `analytics_batch_${Date.now()}`,
        eventsToSend,
        86400000 // 24 hours
      )

      // For now, just log to console in development
      if (import.meta.env.DEV) {
        console.table(eventsToSend.map(e => ({
          type: e.type,
          category: e.category,
          action: e.action,
          label: e.label,
          value: e.value
        })))
      }

      // Clear sent events
      if (!events) {
        this.events = []
      }
    } catch (error) {
      console.error('Failed to send analytics:', error)
    }
  }

  /**
   * Helper methods
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private detectDeviceType(): 'desktop' | 'tablet' | 'mobile' {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  private categorizeEvent(category: string, action: string): AnalyticsEvent['type'] {
    if (category === 'reading' || action.includes('reading')) return 'reading'
    if (category === 'card' || action.includes('card')) return 'card-draw'
    if (category === 'user' || category === 'interaction') return 'user-action'
    if (category === 'performance') return 'performance'
    if (category === 'error') return 'error'
    return 'system'
  }

  private isCriticalEvent(category: string, action: string): boolean {
    return category === 'error' || 
           action === 'payment-complete' || 
           action === 'reading-error' ||
           action === 'system-crash'
  }

  private getCustomDimensions(): Record<string, string> {
    return {
      userType: localStorage.getItem('userType') || 'anonymous',
      theme: localStorage.getItem('theme') || 'dark',
      language: localStorage.getItem('language') || 'en',
      deviceType: this.detectDeviceType(),
      sessionDuration: this.getSessionDuration()
    }
  }

  private getSessionDuration(): string {
    if (!this.currentSession) return '0'
    const duration = Date.now() - this.currentSession.startTime.getTime()
    return Math.floor(duration / 1000).toString()
  }

  private getTopEvents(): Array<{ name: string; count: number }> {
    const eventCounts = new Map<string, number>()
    
    this.events.forEach(event => {
      const key = `${event.category}-${event.action}`
      eventCounts.set(key, (eventCounts.get(key) || 0) + 1)
    })

    return Array.from(eventCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  private getAveragePerformance(): Array<{ metric: string; average: number }> {
    const performanceMap = new Map<string, number[]>()
    
    this.performanceMetrics.forEach(metric => {
      if (!performanceMap.has(metric.name)) {
        performanceMap.set(metric.name, [])
      }
      performanceMap.get(metric.name)!.push(metric.value)
    })

    return Array.from(performanceMap.entries())
      .map(([metric, values]) => ({
        metric,
        average: values.reduce((sum, val) => sum + val, 0) / values.length
      }))
  }

  /**
   * A/B Testing support
   */
  getExperimentVariant(experimentName: string): 'A' | 'B' {
    // Simple hash-based variant assignment
    const hash = this.simpleHash(this.currentSession?.id + experimentName)
    return hash % 2 === 0 ? 'A' : 'B'
  }

  trackExperiment(experimentName: string, variant: 'A' | 'B', action: string): void {
    this.track('experiment', action, `${experimentName}-${variant}`)
  }

  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Privacy compliance
   */
  setUserConsent(hasConsent: boolean): void {
    this.isEnabled = hasConsent && secureConfig.isFeatureEnabled('enableAnalytics')
    
    if (!hasConsent) {
      this.clearAllData()
    }
  }

  private clearAllData(): void {
    this.events = []
    this.performanceMetrics = []
    this.currentSession = null
    
    if (this.batchTimer) {
      clearInterval(this.batchTimer)
    }
  }

  /**
   * Export data for GDPR compliance
   */
  async exportUserData(userId: string): Promise<any> {
    const userEvents = this.events.filter(e => e.userId === userId)
    const userSessions = await cacheService.get<UserSession[]>('all-sessions') || []
    const userSessionData = userSessions.filter(s => s.userId === userId)

    return {
      events: userEvents,
      sessions: userSessionData,
      exportDate: new Date().toISOString()
    }
  }

  /**
   * Delete user data for GDPR compliance
   */
  async deleteUserData(userId: string): Promise<void> {
    this.events = this.events.filter(e => e.userId !== userId)
    // In production, also delete from backend storage
  }
}

// Create singleton instance
export const analytics = AnalyticsService.getInstance()
export default analytics

// Global error tracking helper
export const trackError = (error: Error | string, context?: any) => {
  analytics.trackError(error, context)
}

// Performance tracking helper
export const trackPerformance = (name: string, value: number, category?: string) => {
  analytics.trackPerformance(name, value, category as any || 'api')
}

// User action tracking helper
export const trackUserAction = (action: string, element?: string, context?: any) => {
  analytics.trackUserAction(action, element, context)
}