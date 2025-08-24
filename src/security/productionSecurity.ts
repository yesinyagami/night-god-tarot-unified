import { z } from 'zod'
import CryptoJS from 'crypto-js'

export interface SecurityConfig {
  encryption: {
    algorithm: string
    keySize: number
    iterations: number
    saltLength: number
  }
  rateLimit: {
    windowMs: number
    maxRequests: number
    blockDuration: number
  }
  csrf: {
    tokenLength: number
    expiration: number
  }
  headers: Record<string, string>
  ssl: {
    hsts: boolean
    certificatePinning: boolean
    redirectHttps: boolean
  }
  monitoring: {
    logLevel: 'info' | 'warn' | 'error' | 'debug'
    alertThresholds: {
      failedAttempts: number
      suspiciousActivity: number
      dataBreachAttempts: number
    }
  }
}

const defaultSecurityConfig: SecurityConfig = {
  encryption: {
    algorithm: 'AES-256-GCM',
    keySize: 256,
    iterations: 100000,
    saltLength: 16
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    blockDuration: 60 * 60 * 1000 // 1 hour
  },
  csrf: {
    tokenLength: 32,
    expiration: 24 * 60 * 60 * 1000 // 24 hours
  },
  headers: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' wss: https:; font-src 'self'; object-src 'none'; media-src 'self'; frame-src 'none'",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Feature-Policy': "geolocation 'none'; microphone 'none'; camera 'none'",
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  },
  ssl: {
    hsts: true,
    certificatePinning: true,
    redirectHttps: true
  },
  monitoring: {
    logLevel: 'warn',
    alertThresholds: {
      failedAttempts: 5,
      suspiciousActivity: 10,
      dataBreachAttempts: 1
    }
  }
}

export class ProductionSecurityManager {
  private config: SecurityConfig
  private rateLimitStore = new Map<string, { count: number; resetTime: number; blocked: boolean }>()
  private csrfTokens = new Map<string, { token: string; expiration: number }>()
  private securityEvents: Array<{ timestamp: number; type: string; severity: 'low' | 'medium' | 'high' | 'critical'; details: any }> = []
  private encryptionKey: string

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...defaultSecurityConfig, ...config }
    this.encryptionKey = process.env.ENCRYPTION_KEY || CryptoJS.lib.WordArray.random(32).toString()
    this.startSecurityMonitoring()
  }

  async initializeProductionSecurity(): Promise<void> {
    console.log('🛡️ Initializing production security...')
    
    this.setupSecurityHeaders()
    this.initializeRateLimit()
    this.setupCSRFProtection()
    this.initializeEncryption()
    this.setupSecurityMonitoring()
    this.setupSSLConfiguration()
    this.initializeThreatDetection()
    
    console.log('✅ Production security initialized')
  }

  private setupSecurityHeaders(): void {
    if (typeof window !== 'undefined') {
      const meta = document.createElement('meta')
      meta.httpEquiv = 'Content-Security-Policy'
      meta.content = this.config.headers['Content-Security-Policy']
      document.head.appendChild(meta)
    }
  }

  private initializeRateLimit(): void {
    setInterval(() => {
      const now = Date.now()
      for (const [key, data] of this.rateLimitStore.entries()) {
        if (now > data.resetTime) {
          if (data.blocked && now > data.resetTime + this.config.rateLimit.blockDuration) {
            this.rateLimitStore.delete(key)
          } else if (!data.blocked) {
            data.count = 0
            data.resetTime = now + this.config.rateLimit.windowMs
          }
        }
      }
    }, 60000) // Clean up every minute
  }

  checkRateLimit(identifier: string): { allowed: boolean; remaining?: number; resetTime?: number } {
    const now = Date.now()
    const key = this.hashIdentifier(identifier)
    const current = this.rateLimitStore.get(key)

    if (!current) {
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + this.config.rateLimit.windowMs,
        blocked: false
      })
      return { allowed: true, remaining: this.config.rateLimit.maxRequests - 1 }
    }

    if (current.blocked) {
      this.logSecurityEvent('rate_limit_violation', 'medium', { identifier, blockedUntil: current.resetTime + this.config.rateLimit.blockDuration })
      return { allowed: false, resetTime: current.resetTime + this.config.rateLimit.blockDuration }
    }

    if (now > current.resetTime) {
      current.count = 1
      current.resetTime = now + this.config.rateLimit.windowMs
      current.blocked = false
      return { allowed: true, remaining: this.config.rateLimit.maxRequests - 1 }
    }

    current.count++
    
    if (current.count > this.config.rateLimit.maxRequests) {
      current.blocked = true
      this.logSecurityEvent('rate_limit_exceeded', 'high', { identifier, attempts: current.count })
      return { allowed: false, resetTime: current.resetTime + this.config.rateLimit.blockDuration }
    }

    return { 
      allowed: true, 
      remaining: this.config.rateLimit.maxRequests - current.count,
      resetTime: current.resetTime
    }
  }

  private setupCSRFProtection(): void {
    setInterval(() => {
      const now = Date.now()
      for (const [sessionId, tokenData] of this.csrfTokens.entries()) {
        if (now > tokenData.expiration) {
          this.csrfTokens.delete(sessionId)
        }
      }
    }, 5 * 60 * 1000) // Clean up every 5 minutes
  }

  generateCSRFToken(sessionId: string): string {
    const token = CryptoJS.lib.WordArray.random(this.config.csrf.tokenLength).toString()
    const expiration = Date.now() + this.config.csrf.expiration
    
    this.csrfTokens.set(sessionId, { token, expiration })
    return token
  }

  validateCSRFToken(sessionId: string, token: string): boolean {
    const tokenData = this.csrfTokens.get(sessionId)
    
    if (!tokenData || Date.now() > tokenData.expiration) {
      this.logSecurityEvent('csrf_token_invalid', 'high', { sessionId, reason: 'expired_or_missing' })
      return false
    }
    
    if (tokenData.token !== token) {
      this.logSecurityEvent('csrf_token_mismatch', 'critical', { sessionId })
      return false
    }
    
    return true
  }

  private initializeEncryption(): void {
    // Verify encryption key strength
    if (this.encryptionKey.length < 32) {
      console.warn('⚠️ Weak encryption key detected, generating stronger key')
      this.encryptionKey = CryptoJS.lib.WordArray.random(32).toString()
    }
  }

  encryptSensitiveData(data: string, additionalKey?: string): string {
    try {
      const key = additionalKey ? CryptoJS.SHA256(this.encryptionKey + additionalKey).toString() : this.encryptionKey
      const salt = CryptoJS.lib.WordArray.random(this.config.encryption.saltLength)
      const iv = CryptoJS.lib.WordArray.random(16)
      
      const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        salt: salt,
        keySize: this.config.encryption.keySize / 32,
        iterations: this.config.encryption.iterations
      })
      
      return JSON.stringify({
        ciphertext: encrypted.ciphertext.toString(),
        salt: salt.toString(),
        iv: iv.toString()
      })
    } catch (error) {
      this.logSecurityEvent('encryption_failure', 'critical', { error: error.message })
      throw new Error('Encryption failed')
    }
  }

  decryptSensitiveData(encryptedData: string, additionalKey?: string): string {
    try {
      const { ciphertext, salt, iv } = JSON.parse(encryptedData)
      const key = additionalKey ? CryptoJS.SHA256(this.encryptionKey + additionalKey).toString() : this.encryptionKey
      
      const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
        iv: CryptoJS.enc.Hex.parse(iv),
        salt: CryptoJS.enc.Hex.parse(salt),
        keySize: this.config.encryption.keySize / 32,
        iterations: this.config.encryption.iterations
      })
      
      return decrypted.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      this.logSecurityEvent('decryption_failure', 'critical', { error: error.message })
      throw new Error('Decryption failed')
    }
  }

  private setupSSLConfiguration(): void {
    if (typeof window !== 'undefined' && location.protocol !== 'https:' && this.config.ssl.redirectHttps) {
      if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        location.replace(`https:${location.href.substring(location.protocol.length)}`)
      }
    }
  }

  sanitizeInput(input: string, type: 'html' | 'sql' | 'xss' | 'path' = 'xss'): string {
    if (!input || typeof input !== 'string') return ''
    
    let sanitized = input
    
    switch (type) {
      case 'html':
        sanitized = sanitized
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;')
        break
        
      case 'sql':
        sanitized = sanitized
          .replace(/('|(\\'))/g, "\\'")
          .replace(/("|(\\\"))/g, '\\"')
          .replace(/;/g, '\\;')
          .replace(/--/g, '\\--')
          .replace(/\/\*/g, '\\/*')
          .replace(/\*\//g, '\\*/')
        break
        
      case 'xss':
        sanitized = sanitized
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
        break
        
      case 'path':
        sanitized = sanitized
          .replace(/\.\./g, '')
          .replace(/\\/g, '')
          .replace(/\//g, '')
          .replace(/:/g, '')
        break
    }
    
    if (sanitized !== input) {
      this.logSecurityEvent('input_sanitized', 'medium', { originalLength: input.length, sanitizedLength: sanitized.length, type })
    }
    
    return sanitized
  }

  private setupSecurityMonitoring(): void {
    this.startThreatDetection()
    this.setupPerformanceMonitoring()
    this.initializeSecurityHeaders()
  }

  private startThreatDetection(): void {
    setInterval(() => {
      this.analyzeSecurityEvents()
      this.detectAnomalies()
      this.checkSystemIntegrity()
    }, 30000) // Every 30 seconds
  }

  private analyzeSecurityEvents(): void {
    const recentEvents = this.securityEvents.filter(event => 
      Date.now() - event.timestamp < 5 * 60 * 1000 // Last 5 minutes
    )
    
    const criticalEvents = recentEvents.filter(event => event.severity === 'critical')
    const highEvents = recentEvents.filter(event => event.severity === 'high')
    
    if (criticalEvents.length > 0) {
      console.error('🚨 CRITICAL security events detected:', criticalEvents)
      this.triggerSecurityAlert('critical', criticalEvents)
    }
    
    if (highEvents.length >= this.config.monitoring.alertThresholds.suspiciousActivity) {
      console.warn('⚠️ High suspicious activity detected:', highEvents)
      this.triggerSecurityAlert('high', highEvents)
    }
  }

  private detectAnomalies(): void {
    const rateLimitViolations = Array.from(this.rateLimitStore.values()).filter(data => data.blocked).length
    
    if (rateLimitViolations > this.config.monitoring.alertThresholds.failedAttempts) {
      this.logSecurityEvent('anomaly_detected', 'high', { 
        type: 'excessive_rate_limits', 
        count: rateLimitViolations 
      })
    }
  }

  private checkSystemIntegrity(): void {
    try {
      const testEncryption = this.encryptSensitiveData('test')
      const testDecryption = this.decryptSensitiveData(testEncryption)
      
      if (testDecryption !== 'test') {
        this.logSecurityEvent('integrity_failure', 'critical', { component: 'encryption' })
      }
    } catch (error) {
      this.logSecurityEvent('integrity_failure', 'critical', { 
        component: 'encryption', 
        error: error.message 
      })
    }
  }

  private setupPerformanceMonitoring(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 5000) { // Slow operations > 5s
            this.logSecurityEvent('performance_anomaly', 'medium', {
              name: entry.name,
              duration: entry.duration,
              entryType: entry.entryType
            })
          }
        }
      })
      
      observer.observe({ entryTypes: ['navigation', 'resource', 'measure'] })
    }
  }

  private initializeSecurityHeaders(): void {
    if (typeof window !== 'undefined') {
      // Add security meta tags
      Object.entries(this.config.headers).forEach(([name, value]) => {
        if (name.startsWith('X-') || name === 'Content-Security-Policy') {
          const meta = document.createElement('meta')
          meta.setAttribute('http-equiv', name)
          meta.setAttribute('content', value)
          document.head.appendChild(meta)
        }
      })
    }
  }

  private initializeThreatDetection(): void {
    // Monitor for common attack patterns
    if (typeof window !== 'undefined') {
      // XSS detection
      const originalInnerHTML = Element.prototype.innerHTML
      Element.prototype.innerHTML = function(value: string) {
        if (typeof value === 'string' && value.includes('<script')) {
          this.logSecurityEvent('xss_attempt', 'critical', { content: value.substring(0, 100) })
          return
        }
        return originalInnerHTML.call(this, value)
      }.bind(this)
      
      // Monitor for suspicious network requests
      const originalFetch = window.fetch
      window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
        const url = typeof input === 'string' ? input : input.toString()
        
        if (url.includes('eval(') || url.includes('javascript:')) {
          this.logSecurityEvent('suspicious_request', 'high', { url })
          throw new Error('Suspicious request blocked')
        }
        
        return originalFetch.call(this, input, init)
      }.bind(this)
    }
  }

  private triggerSecurityAlert(level: 'low' | 'medium' | 'high' | 'critical', events: any[]): void {
    console.log(`🚨 Security Alert [${level.toUpperCase()}]:`, events)
    
    if (level === 'critical') {
      // In production, this would send alerts to security team
      this.implementEmergencyProtocols()
    }
  }

  private implementEmergencyProtocols(): void {
    console.log('🔒 Implementing emergency security protocols')
    
    // Increase rate limiting
    this.config.rateLimit.maxRequests = Math.floor(this.config.rateLimit.maxRequests / 2)
    this.config.rateLimit.blockDuration *= 2
    
    // Clear all sessions
    this.csrfTokens.clear()
    
    // Enhanced monitoring
    this.config.monitoring.logLevel = 'debug'
  }

  private logSecurityEvent(type: string, severity: 'low' | 'medium' | 'high' | 'critical', details: any): void {
    const event = {
      timestamp: Date.now(),
      type,
      severity,
      details
    }
    
    this.securityEvents.push(event)
    
    // Keep only last 1000 events
    if (this.securityEvents.length > 1000) {
      this.securityEvents.shift()
    }
    
    if (this.shouldLogEvent(severity)) {
      console.log(`🛡️ Security Event [${severity.toUpperCase()}] ${type}:`, details)
    }
  }

  private shouldLogEvent(severity: 'low' | 'medium' | 'high' | 'critical'): boolean {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 }
    const eventLevels = { low: 1, medium: 2, high: 3, critical: 3 }
    
    return eventLevels[severity] >= levels[this.config.monitoring.logLevel]
  }

  private hashIdentifier(identifier: string): string {
    return CryptoJS.SHA256(identifier + this.encryptionKey).toString()
  }

  private startSecurityMonitoring(): void {
    // Monitor system resources
    setInterval(() => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const memory = (window.performance as any).memory
        if (memory && memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          this.logSecurityEvent('memory_warning', 'medium', {
            used: memory.usedJSHeapSize,
            limit: memory.jsHeapSizeLimit
          })
        }
      }
    }, 60000) // Every minute
  }

  getSecurityStatus(): {
    isSecure: boolean
    rateLimitActive: boolean
    encryptionActive: boolean
    monitoringActive: boolean
    recentThreats: number
    systemHealth: 'healthy' | 'warning' | 'critical'
  } {
    const recentEvents = this.securityEvents.filter(event => 
      Date.now() - event.timestamp < 15 * 60 * 1000 // Last 15 minutes
    )
    
    const criticalEvents = recentEvents.filter(event => event.severity === 'critical')
    const highEvents = recentEvents.filter(event => event.severity === 'high')
    
    let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy'
    if (criticalEvents.length > 0) systemHealth = 'critical'
    else if (highEvents.length > 5) systemHealth = 'warning'
    
    return {
      isSecure: criticalEvents.length === 0,
      rateLimitActive: this.rateLimitStore.size > 0,
      encryptionActive: !!this.encryptionKey,
      monitoringActive: true,
      recentThreats: recentEvents.length,
      systemHealth
    }
  }
}

export const productionSecurity = new ProductionSecurityManager()