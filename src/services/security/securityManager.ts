/**
 * ULTIMATE SECURITY MANAGER 2030
 * Enterprise-grade security system for Night God Tarot
 */

import CryptoJS from 'crypto-js'
import type { UserId, SessionId } from '@/types/enhanced-types'

export interface SecurityConfig {
  encryption: {
    algorithm: string
    keySize: number
    iterations: number
  }
  rateLimit: {
    windowMs: number
    maxRequests: number
    skipSuccessfulRequests: boolean
  }
  session: {
    maxDuration: number
    refreshThreshold: number
    maxConcurrentSessions: number
  }
  validation: {
    maxInputLength: number
    allowedHtmlTags: string[]
    forbiddenPatterns: RegExp[]
  }
  csrf: {
    enabled: boolean
    tokenLength: number
    headerName: string
  }
}

export interface RateLimitEntry {
  count: number
  resetTime: number
  blocked: boolean
}

export interface SecurityEvent {
  id: string
  type: 'rate_limit_exceeded' | 'invalid_input' | 'session_hijack' | 'suspicious_activity'
  userId?: UserId
  sessionId?: SessionId
  timestamp: number
  details: Record<string, unknown>
  severity: 'low' | 'medium' | 'high' | 'critical'
}

class SecurityManager {
  private static instance: SecurityManager
  private config: SecurityConfig
  private rateLimitStore = new Map<string, RateLimitEntry>()
  private sessionStore = new Map<SessionId, { userId: UserId; lastActivity: number; fingerprint: string }>()
  private csrfTokens = new Map<SessionId, string>()
  private securityEvents: SecurityEvent[] = []
  private encryptionKey: string

  private constructor() {
    this.config = this.loadSecurityConfig()
    this.encryptionKey = this.generateEncryptionKey()
    this.startCleanupTasks()
  }

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager()
    }
    return SecurityManager.instance
  }

  private loadSecurityConfig(): SecurityConfig {
    return {
      encryption: {
        algorithm: 'AES',
        keySize: 256,
        iterations: 10000
      },
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100,
        skipSuccessfulRequests: false
      },
      session: {
        maxDuration: 24 * 60 * 60 * 1000, // 24 hours
        refreshThreshold: 60 * 60 * 1000, // 1 hour
        maxConcurrentSessions: 3
      },
      validation: {
        maxInputLength: 10000,
        allowedHtmlTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
        forbiddenPatterns: [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /javascript:/gi,
          /vbscript:/gi,
          /on\w+\s*=/gi,
          /data:text\/html/gi
        ]
      },
      csrf: {
        enabled: true,
        tokenLength: 32,
        headerName: 'X-CSRF-Token'
      }
    }
  }

  private generateEncryptionKey(): string {
    // In production, this would come from secure environment variables
    const baseKey = import.meta.env.VITE_SECURITY_KEY || 'default-key-change-in-production'
    return CryptoJS.SHA256(baseKey + Date.now().toString()).toString()
  }

  // === ENCRYPTION/DECRYPTION ===
  encryptSensitiveData(data: string): string {
    try {
      const salt = CryptoJS.lib.WordArray.random(128/8)
      const key = CryptoJS.PBKDF2(this.encryptionKey, salt, {
        keySize: this.config.encryption.keySize/32,
        iterations: this.config.encryption.iterations
      })
      
      const iv = CryptoJS.lib.WordArray.random(128/8)
      const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv })
      
      return salt.toString() + iv.toString() + encrypted.toString()
    } catch (error) {
      this.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'high',
        details: { action: 'encryption_failed', error: error instanceof Error ? error.message : 'Unknown error' }
      })
      throw new Error('Encryption failed')
    }
  }

  decryptSensitiveData(encryptedData: string): string {
    try {
      const saltLength = 32
      const ivLength = 32
      
      const salt = CryptoJS.enc.Hex.parse(encryptedData.substr(0, saltLength))
      const iv = CryptoJS.enc.Hex.parse(encryptedData.substr(saltLength, ivLength))
      const encrypted = encryptedData.substring(saltLength + ivLength)
      
      const key = CryptoJS.PBKDF2(this.encryptionKey, salt, {
        keySize: this.config.encryption.keySize/32,
        iterations: this.config.encryption.iterations
      })
      
      const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv })
      return decrypted.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      this.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'high',
        details: { action: 'decryption_failed', error: error instanceof Error ? error.message : 'Unknown error' }
      })
      throw new Error('Decryption failed')
    }
  }

  // === INPUT VALIDATION & SANITIZATION ===
  validateAndSanitizeInput(input: string, context: 'question' | 'username' | 'email' | 'general' = 'general'): string {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string')
    }

    // Length validation
    if (input.length > this.config.validation.maxInputLength) {
      throw new Error(`Input exceeds maximum length of ${this.config.validation.maxInputLength}`)
    }

    // Check for forbidden patterns
    for (const pattern of this.config.validation.forbiddenPatterns) {
      if (pattern.test(input)) {
        this.logSecurityEvent({
          type: 'invalid_input',
          severity: 'medium',
          details: { pattern: pattern.source, input: input.substring(0, 100) }
        })
        throw new Error('Input contains forbidden patterns')
      }
    }

    // Context-specific validation
    let sanitized = input
    switch (context) {
      case 'question':
        sanitized = this.sanitizeQuestionInput(input)
        break
      case 'username':
        sanitized = this.sanitizeUsername(input)
        break
      case 'email':
        sanitized = this.sanitizeEmail(input)
        break
      default:
        sanitized = this.sanitizeGeneralInput(input)
    }

    return sanitized
  }

  private sanitizeQuestionInput(input: string): string {
    // Remove HTML tags except allowed ones
    let sanitized = input.replace(/<(?!\/?(?:b|i|em|strong|p|br)\b)[^>]*>/gi, '')
    
    // Remove excessive whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim()
    
    // Limit question length for tarot context
    if (sanitized.length > 500) {
      sanitized = sanitized.substring(0, 500) + '...'
    }
    
    return sanitized
  }

  private sanitizeUsername(input: string): string {
    // Allow only alphanumeric characters, underscores, and hyphens
    return input.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50)
  }

  private sanitizeEmail(input: string): string {
    // Basic email sanitization
    return input.toLowerCase().trim().substring(0, 255)
  }

  private sanitizeGeneralInput(input: string): string {
    // Remove all HTML tags
    return input.replace(/<[^>]*>/g, '').trim()
  }

  // === RATE LIMITING ===
  checkRateLimit(identifier: string): boolean {
    const now = Date.now()
    const entry = this.rateLimitStore.get(identifier)

    if (!entry) {
      this.rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + this.config.rateLimit.windowMs,
        blocked: false
      })
      return true
    }

    // Reset if window has passed
    if (now > entry.resetTime) {
      entry.count = 1
      entry.resetTime = now + this.config.rateLimit.windowMs
      entry.blocked = false
      return true
    }

    // Increment count
    entry.count++

    // Check if limit exceeded
    if (entry.count > this.config.rateLimit.maxRequests) {
      if (!entry.blocked) {
        entry.blocked = true
        this.logSecurityEvent({
          type: 'rate_limit_exceeded',
          severity: 'medium',
          details: { identifier, count: entry.count, limit: this.config.rateLimit.maxRequests }
        })
      }
      return false
    }

    return true
  }

  getRateLimitStatus(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const entry = this.rateLimitStore.get(identifier)
    
    if (!entry) {
      return {
        allowed: true,
        remaining: this.config.rateLimit.maxRequests - 1,
        resetTime: Date.now() + this.config.rateLimit.windowMs
      }
    }

    return {
      allowed: !entry.blocked,
      remaining: Math.max(0, this.config.rateLimit.maxRequests - entry.count),
      resetTime: entry.resetTime
    }
  }

  // === SESSION SECURITY ===
  validateSession(sessionId: SessionId, userId: UserId, fingerprint: string): boolean {
    const session = this.sessionStore.get(sessionId)
    
    if (!session) {
      return false
    }

    // Check if session belongs to user
    if (session.userId !== userId) {
      this.logSecurityEvent({
        type: 'session_hijack',
        severity: 'critical',
        sessionId,
        userId,
        details: { expectedUserId: session.userId, receivedUserId: userId }
      })
      return false
    }

    // Check fingerprint for session hijacking
    if (session.fingerprint !== fingerprint) {
      this.logSecurityEvent({
        type: 'session_hijack',
        severity: 'critical',
        sessionId,
        userId,
        details: { fingerprintMismatch: true }
      })
      return false
    }

    // Update last activity
    session.lastActivity = Date.now()
    return true
  }

  createSession(sessionId: SessionId, userId: UserId, fingerprint: string): void {
    // Remove old sessions for user if at limit
    const userSessions = Array.from(this.sessionStore.entries())
      .filter(([_, session]) => session.userId === userId)
    
    if (userSessions.length >= this.config.session.maxConcurrentSessions) {
      // Remove oldest session
      const oldestSession = userSessions.sort((a, b) => a[1].lastActivity - b[1].lastActivity)[0]
      this.sessionStore.delete(oldestSession[0])
    }

    this.sessionStore.set(sessionId, {
      userId,
      lastActivity: Date.now(),
      fingerprint
    })
  }

  invalidateSession(sessionId: SessionId): void {
    this.sessionStore.delete(sessionId)
    this.csrfTokens.delete(sessionId)
  }

  // === CSRF PROTECTION ===
  generateCSRFToken(sessionId: SessionId): string {
    const token = CryptoJS.lib.WordArray.random(this.config.csrf.tokenLength).toString()
    this.csrfTokens.set(sessionId, token)
    return token
  }

  validateCSRFToken(sessionId: SessionId, token: string): boolean {
    const storedToken = this.csrfTokens.get(sessionId)
    return storedToken === token
  }

  // === SECURITY EVENT LOGGING ===
  private logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...event
    }

    this.securityEvents.push(securityEvent)

    // In production, send to security monitoring system
    if (import.meta.env.DEV) {
      console.warn('🚨 Security Event:', securityEvent)
    }

    // Keep only recent events in memory
    if (this.securityEvents.length > 1000) {
      this.securityEvents.splice(0, 500)
    }
  }

  getSecurityEvents(filters?: {
    type?: SecurityEvent['type']
    severity?: SecurityEvent['severity']
    userId?: UserId
    since?: number
  }): SecurityEvent[] {
    let events = [...this.securityEvents]

    if (filters) {
      if (filters.type) {
        events = events.filter(e => e.type === filters.type)
      }
      if (filters.severity) {
        events = events.filter(e => e.severity === filters.severity)
      }
      if (filters.userId) {
        events = events.filter(e => e.userId === filters.userId)
      }
      if (filters.since) {
        events = events.filter(e => e.timestamp >= filters.since)
      }
    }

    return events.sort((a, b) => b.timestamp - a.timestamp)
  }

  // === DEVICE FINGERPRINTING ===
  generateDeviceFingerprint(): string {
    if (typeof window === 'undefined') return 'server-side'

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx?.fillText('Fingerprint', 10, 10)
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvasFingerprint: canvas.toDataURL(),
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack
    }

    return CryptoJS.SHA256(JSON.stringify(fingerprint)).toString()
  }

  // === CLEANUP TASKS ===
  private startCleanupTasks(): void {
    // Clean expired rate limit entries
    setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.rateLimitStore.entries()) {
        if (now > entry.resetTime) {
          this.rateLimitStore.delete(key)
        }
      }
    }, 5 * 60 * 1000) // Every 5 minutes

    // Clean expired sessions
    setInterval(() => {
      const now = Date.now()
      const maxAge = this.config.session.maxDuration
      
      for (const [sessionId, session] of this.sessionStore.entries()) {
        if (now - session.lastActivity > maxAge) {
          this.invalidateSession(sessionId)
        }
      }
    }, 10 * 60 * 1000) // Every 10 minutes
  }

  // === CONTENT SECURITY POLICY ===
  generateCSPHeader(): string {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://api.monica.im https://openapi.monica.im",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.monica.im https://openapi.monica.im https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com",
      "media-src 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'"
    ]

    return csp.join('; ')
  }

  // === SECURITY HEADERS ===
  getSecurityHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': this.generateCSPHeader(),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    }
  }

  // === THREAT DETECTION ===
  detectSuspiciousActivity(userId: UserId, activity: {
    type: string
    metadata: Record<string, unknown>
  }): boolean {
    const recentEvents = this.getSecurityEvents({
      userId,
      since: Date.now() - 60 * 60 * 1000 // Last hour
    })

    // Check for rapid requests
    const recentRequests = recentEvents.filter(e => 
      e.type === 'rate_limit_exceeded' && 
      e.timestamp > Date.now() - 5 * 60 * 1000 // Last 5 minutes
    )

    if (recentRequests.length > 3) {
      this.logSecurityEvent({
        type: 'suspicious_activity',
        userId,
        severity: 'high',
        details: { reason: 'multiple_rate_limit_violations', count: recentRequests.length }
      })
      return true
    }

    return false
  }

  // === PUBLIC API METHODS ===
  async secureAPIRequest<T>(
    endpoint: string, 
    data: unknown, 
    sessionId: SessionId, 
    userId: UserId
  ): Promise<T> {
    // Rate limiting
    if (!this.checkRateLimit(userId)) {
      throw new Error('Rate limit exceeded')
    }

    // CSRF protection
    if (this.config.csrf.enabled) {
      const csrfToken = this.generateCSRFToken(sessionId)
      // In real implementation, this would be added to request headers
    }

    // Input validation
    if (typeof data === 'string') {
      this.validateAndSanitizeInput(data, 'general')
    }

    // Encrypt sensitive data
    const encryptedData = typeof data === 'string' ? 
      this.encryptSensitiveData(data) : data

    // Log security event for monitoring
    this.logSecurityEvent({
      type: 'suspicious_activity',
      userId,
      sessionId,
      severity: 'low',
      details: { action: 'api_request', endpoint }
    })

    // In production, this would make the actual API call
    return {} as T
  }
}

export const securityManager = SecurityManager.getInstance()
export default securityManager