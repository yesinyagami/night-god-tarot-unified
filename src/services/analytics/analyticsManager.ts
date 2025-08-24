/**
 * Night God Tarot - Advanced Analytics & User Tracking
 * Privacy-focused analytics with comprehensive insights
 */

import { ref, computed, watch } from 'vue';

export interface AnalyticsEvent {
  id: string;
  event: string;
  category: 'user' | 'reading' | 'engagement' | 'conversion' | 'error' | 'performance';
  action: string;
  label?: string;
  value?: number;
  properties: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  userId?: string;
}

export interface UserSession {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  pageViews: number;
  events: string[];
  referrer: string;
  userAgent: string;
  location: UserLocation;
  device: DeviceInfo;
}

export interface UserLocation {
  country?: string;
  region?: string;
  city?: string;
  timezone: string;
  language: string;
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
  screenResolution: string;
  colorDepth: number;
  cookiesEnabled: boolean;
}

export interface ConversionFunnel {
  step: string;
  users: number;
  conversionRate: number;
  dropOffRate: number;
  averageTimeSpent: number;
}

export interface UserJourney {
  userId: string;
  touchpoints: TouchPoint[];
  totalSessions: number;
  totalReadings: number;
  conversionEvents: string[];
  lifetimeValue: number;
}

export interface TouchPoint {
  timestamp: Date;
  type: 'page_view' | 'interaction' | 'conversion';
  page: string;
  action?: string;
  value?: number;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

export interface ABTestConfig {
  testId: string;
  name: string;
  variants: ABVariant[];
  trafficSplit: number; // 0-100
  status: 'active' | 'paused' | 'completed';
  metrics: string[];
  startDate: Date;
  endDate?: Date;
}

export interface ABVariant {
  id: string;
  name: string;
  weight: number; // 0-1
  config: Record<string, any>;
}

export class AnalyticsManager {
  private static instance: AnalyticsManager;
  
  private currentSession = ref<UserSession | null>(null);
  private events = ref<AnalyticsEvent[]>([]);
  private performanceMetrics = ref<PerformanceMetrics | null>(null);
  private abTests = ref<ABTestConfig[]>([]);
  private userConsent = ref<boolean>(false);
  
  private eventQueue: AnalyticsEvent[] = [];
  private batchSize = 20;
  private flushInterval = 30000; // 30 seconds
  private flushTimer?: NodeJS.Timeout;

  private constructor() {
    this.initializeSession();
    this.setupPerformanceTracking();
    this.setupErrorTracking();
    this.setupConversionTracking();
    this.startEventBatching();
    this.loadUserConsent();
  }

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  private initializeSession() {
    const sessionId = this.generateSessionId();
    const userAgent = navigator.userAgent;
    const referrer = document.referrer || 'direct';
    
    this.currentSession.value = {
      id: sessionId,
      startTime: new Date(),
      pageViews: 0,
      events: [],
      referrer,
      userAgent,
      location: this.getUserLocation(),
      device: this.getDeviceInfo()
    };

    // Track session start
    this.track('session_start', 'user', 'session', {
      sessionId,
      referrer,
      userAgent: userAgent,
      timestamp: new Date().toISOString()
    });

    // Setup session end tracking
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden', 'engagement', 'visibility');
      } else {
        this.track('page_visible', 'engagement', 'visibility');
      }
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserLocation(): UserLocation {
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language || 'en'
    };
  }

  private getDeviceInfo(): DeviceInfo {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (screenWidth <= 768) deviceType = 'mobile';
    else if (screenWidth <= 1024) deviceType = 'tablet';
    
    return {
      type: deviceType,
      os: this.getOperatingSystem(),
      browser: this.getBrowser(),
      screenResolution: `${screenWidth}x${screenHeight}`,
      colorDepth: window.screen.colorDepth,
      cookiesEnabled: navigator.cookieEnabled
    };
  }

  private getOperatingSystem(): string {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    
    return 'Unknown';
  }

  private getBrowser(): string {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    
    return 'Unknown';
  }

  private setupPerformanceTracking() {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry) {
          this.track('largest_contentful_paint', 'performance', 'core_web_vitals', {
            value: lastEntry.startTime,
            url: window.location.href
          });
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.track('first_input_delay', 'performance', 'core_web_vitals', {
            value: entry.processingStart - entry.startTime,
            url: window.location.href
          });
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        this.track('cumulative_layout_shift', 'performance', 'core_web_vitals', {
          value: clsValue,
          url: window.location.href
        });
      }).observe({ entryTypes: ['layout-shift'] });
    }

    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
          const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
          
          this.performanceMetrics.value = {
            pageLoadTime,
            firstContentfulPaint: 0, // Will be updated by observer
            largestContentfulPaint: 0, // Will be updated by observer
            cumulativeLayoutShift: 0, // Will be updated by observer
            firstInputDelay: 0, // Will be updated by observer
            timeToInteractive: domContentLoaded
          };

          this.track('page_load_complete', 'performance', 'timing', {
            pageLoadTime,
            domContentLoaded,
            url: window.location.href
          });
        }
      }, 0);
    });
  }

  private setupErrorTracking() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.track('javascript_error', 'error', 'runtime', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        url: window.location.href
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.track('unhandled_promise_rejection', 'error', 'promise', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack,
        url: window.location.href
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        const element = event.target as HTMLElement;
        this.track('resource_load_error', 'error', 'resource', {
          tagName: element.tagName,
          src: (element as any).src || (element as any).href,
          url: window.location.href
        });
      }
    }, true);
  }

  private setupConversionTracking() {
    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.track('form_submit', 'conversion', 'form', {
        formId: form.id,
        formName: form.name,
        action: form.action,
        method: form.method
      });
    });

    // Track button clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      if (target.matches('button, .btn, [role="button"]')) {
        this.track('button_click', 'engagement', 'interaction', {
          buttonText: target.textContent?.trim(),
          buttonId: target.id,
          className: target.className
        });
      }

      // Track CTA clicks
      if (target.matches('.cta, [data-cta]')) {
        this.track('cta_click', 'conversion', 'call_to_action', {
          ctaText: target.textContent?.trim(),
          ctaId: target.id,
          position: this.getElementPosition(target)
        });
      }
    });

    // Track scroll depth
    this.setupScrollTracking();
  }

  private setupScrollTracking() {
    let maxScrollDepth = 0;
    const scrollMilestones = [25, 50, 75, 100];
    const trackedMilestones = new Set<number>();

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = Math.round((scrollTop / documentHeight) * 100);

      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);

      scrollMilestones.forEach(milestone => {
        if (scrollDepth >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          this.track('scroll_depth', 'engagement', 'scroll', {
            depth: milestone,
            url: window.location.href
          });
        }
      });
    });

    // Track max scroll depth on page unload
    window.addEventListener('beforeunload', () => {
      this.track('max_scroll_depth', 'engagement', 'scroll', {
        maxDepth: maxScrollDepth,
        url: window.location.href
      });
    });
  }

  private getElementPosition(element: HTMLElement): string {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    if (rect.top < viewportHeight * 0.33) return 'above_fold';
    if (rect.top < viewportHeight * 0.66) return 'middle_fold';
    return 'below_fold';
  }

  private startEventBatching() {
    this.flushTimer = setInterval(() => {
      this.flushEvents();
    }, this.flushInterval);
  }

  private loadUserConsent() {
    const consent = localStorage.getItem('nightgod_analytics_consent');
    this.userConsent.value = consent === 'granted';
  }

  private endSession() {
    if (this.currentSession.value) {
      const endTime = new Date();
      const duration = endTime.getTime() - this.currentSession.value.startTime.getTime();
      
      this.currentSession.value.endTime = endTime;
      this.currentSession.value.duration = duration;

      this.track('session_end', 'user', 'session', {
        sessionId: this.currentSession.value.id,
        duration,
        pageViews: this.currentSession.value.pageViews,
        eventCount: this.currentSession.value.events.length
      });

      // Flush remaining events
      this.flushEvents(true);
    }
  }

  // Public API
  public track(
    event: string, 
    category: AnalyticsEvent['category'], 
    action: string, 
    properties: Record<string, any> = {},
    value?: number
  ) {
    if (!this.userConsent.value) return;

    const analyticsEvent: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      event,
      category,
      action,
      properties: {
        ...properties,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      },
      value,
      timestamp: new Date(),
      sessionId: this.currentSession.value?.id || 'unknown'
    };

    this.events.value.push(analyticsEvent);
    this.eventQueue.push(analyticsEvent);

    // Add to current session
    if (this.currentSession.value) {
      this.currentSession.value.events.push(event);
    }

    // Flush if queue is full
    if (this.eventQueue.length >= this.batchSize) {
      this.flushEvents();
    }
  }

  public trackPageView(page: string, title?: string) {
    if (this.currentSession.value) {
      this.currentSession.value.pageViews++;
    }

    this.track('page_view', 'user', 'navigation', {
      page,
      title: title || document.title,
      referrer: document.referrer
    });
  }

  public trackUserAction(action: string, target?: string, properties: Record<string, any> = {}) {
    this.track('user_action', 'engagement', action, {
      target,
      ...properties
    });
  }

  public trackConversion(event: string, value?: number, currency: string = 'USD') {
    this.track(event, 'conversion', 'purchase', {
      currency,
      items: [] // Could be populated with purchase details
    }, value);
  }

  public trackTarotReading(readingType: string, cardCount: number, language: string) {
    this.track('tarot_reading_complete', 'reading', 'complete', {
      readingType,
      cardCount,
      language,
      duration: 0 // Could be tracked separately
    });
  }

  public trackAIInteraction(model: string, responseTime: number, quality?: number) {
    this.track('ai_interaction', 'reading', 'ai_response', {
      model,
      responseTime,
      quality
    });
  }

  public trackFeatureUsage(feature: string, context?: string) {
    this.track('feature_used', 'engagement', 'feature', {
      feature,
      context
    });
  }

  public setUserConsent(granted: boolean) {
    this.userConsent.value = granted;
    localStorage.setItem('nightgod_analytics_consent', granted ? 'granted' : 'denied');

    this.track('consent_updated', 'user', 'privacy', {
      consentGranted: granted
    });
  }

  public setUserId(userId: string) {
    if (this.currentSession.value) {
      this.currentSession.value.userId = userId;
    }

    this.track('user_identified', 'user', 'identification', {
      userId
    });
  }

  public startABTest(testId: string, variantId: string) {
    this.track('ab_test_started', 'engagement', 'experiment', {
      testId,
      variantId
    });

    // Store variant for session
    sessionStorage.setItem(`ab_test_${testId}`, variantId);
  }

  public getABTestVariant(testId: string): string | null {
    return sessionStorage.getItem(`ab_test_${testId}`);
  }

  private flushEvents(force: boolean = false) {
    if (this.eventQueue.length === 0) return;
    if (!force && this.eventQueue.length < this.batchSize) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    // In production, send to analytics service
    this.sendEventsToAnalyticsService(eventsToSend);
  }

  private sendEventsToAnalyticsService(events: AnalyticsEvent[]) {
    // Mock implementation - in production, send to your analytics service
    console.group('Analytics Events Batch');
    events.forEach(event => {
      console.log(`${event.category}/${event.action}:`, event.properties);
    });
    console.groupEnd();

    // Store in localStorage for development
    const storedEvents = JSON.parse(localStorage.getItem('nightgod_analytics_events') || '[]');
    storedEvents.push(...events.map(e => ({
      ...e,
      timestamp: e.timestamp.toISOString()
    })));
    
    // Keep only last 1000 events
    if (storedEvents.length > 1000) {
      storedEvents.splice(0, storedEvents.length - 1000);
    }
    
    localStorage.setItem('nightgod_analytics_events', JSON.stringify(storedEvents));

    // Simulate network request
    // fetch('/api/analytics/events', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ events })
    // }).catch(console.error);
  }

  // Analytics insights and reporting
  public getEventStats(timeRange: 'hour' | 'day' | 'week' | 'month' = 'day') {
    const now = new Date();
    const cutoff = new Date();
    
    switch (timeRange) {
      case 'hour':
        cutoff.setHours(cutoff.getHours() - 1);
        break;
      case 'day':
        cutoff.setDate(cutoff.getDate() - 1);
        break;
      case 'week':
        cutoff.setDate(cutoff.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(cutoff.getMonth() - 1);
        break;
    }

    const recentEvents = this.events.value.filter(e => e.timestamp >= cutoff);
    
    const stats = {
      totalEvents: recentEvents.length,
      uniqueUsers: new Set(recentEvents.map(e => e.sessionId)).size,
      topEvents: this.getTopEvents(recentEvents),
      conversionRate: this.calculateConversionRate(recentEvents),
      averageSessionDuration: this.calculateAverageSessionDuration(recentEvents),
      deviceBreakdown: this.getDeviceBreakdown(recentEvents),
      locationBreakdown: this.getLocationBreakdown(recentEvents)
    };

    return stats;
  }

  private getTopEvents(events: AnalyticsEvent[]) {
    const eventCounts: Record<string, number> = {};
    
    events.forEach(event => {
      eventCounts[event.event] = (eventCounts[event.event] || 0) + 1;
    });

    return Object.entries(eventCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([event, count]) => ({ event, count }));
  }

  private calculateConversionRate(events: AnalyticsEvent[]): number {
    const conversionEvents = events.filter(e => e.category === 'conversion');
    const totalSessions = new Set(events.map(e => e.sessionId)).size;
    
    if (totalSessions === 0) return 0;
    return (conversionEvents.length / totalSessions) * 100;
  }

  private calculateAverageSessionDuration(events: AnalyticsEvent[]): number {
    const sessionDurations: Record<string, number> = {};
    
    events.forEach(event => {
      if (event.event === 'session_end') {
        sessionDurations[event.sessionId] = event.properties.duration || 0;
      }
    });

    const durations = Object.values(sessionDurations);
    if (durations.length === 0) return 0;
    
    return durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
  }

  private getDeviceBreakdown(events: AnalyticsEvent[]) {
    const devices: Record<string, number> = {};
    const sessionDevices = new Set<string>();

    events.forEach(event => {
      const sessionDevice = `${event.sessionId}:${event.properties.device?.type || 'unknown'}`;
      if (!sessionDevices.has(sessionDevice)) {
        sessionDevices.add(sessionDevice);
        const deviceType = event.properties.device?.type || 'unknown';
        devices[deviceType] = (devices[deviceType] || 0) + 1;
      }
    });

    return devices;
  }

  private getLocationBreakdown(events: AnalyticsEvent[]) {
    const locations: Record<string, number> = {};
    const sessionLocations = new Set<string>();

    events.forEach(event => {
      const timezone = event.properties.location?.timezone || 'unknown';
      const sessionLocation = `${event.sessionId}:${timezone}`;
      
      if (!sessionLocations.has(sessionLocation)) {
        sessionLocations.add(sessionLocation);
        locations[timezone] = (locations[timezone] || 0) + 1;
      }
    });

    return locations;
  }

  public generateReport(timeRange: 'day' | 'week' | 'month' = 'week') {
    const stats = this.getEventStats(timeRange);
    const performance = this.performanceMetrics.value;

    return {
      summary: {
        timeRange,
        totalEvents: stats.totalEvents,
        uniqueUsers: stats.uniqueUsers,
        conversionRate: `${stats.conversionRate.toFixed(2)}%`,
        averageSessionDuration: `${Math.round(stats.averageSessionDuration / 1000 / 60)} minutes`
      },
      engagement: {
        topEvents: stats.topEvents,
        deviceBreakdown: stats.deviceBreakdown,
        locationBreakdown: stats.locationBreakdown
      },
      performance: {
        pageLoadTime: performance?.pageLoadTime || 0,
        largestContentfulPaint: performance?.largestContentfulPaint || 0,
        cumulativeLayoutShift: performance?.cumulativeLayoutShift || 0,
        firstInputDelay: performance?.firstInputDelay || 0
      },
      generatedAt: new Date().toISOString()
    };
  }

  // Computed properties
  public get hasConsent(): boolean {
    return this.userConsent.value;
  }

  public get currentSessionId(): string | null {
    return this.currentSession.value?.id || null;
  }

  public get totalEvents(): number {
    return this.events.value.length;
  }

  public get sessionDuration(): number {
    if (!this.currentSession.value) return 0;
    return Date.now() - this.currentSession.value.startTime.getTime();
  }
}

export const analyticsManager = AnalyticsManager.getInstance();