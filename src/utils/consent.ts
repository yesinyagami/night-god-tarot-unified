/**
 * Consent Management Utilities
 * Global utilities for managing user consent across the application
 */

export interface ConsentStatus {
  granted: boolean | null
  timestamp: Date | null
  expired: boolean
}

export class ConsentManager {
  private static readonly CONSENT_COOKIE = 'nightGodTarotConsent'
  private static readonly CONSENT_DATE_COOKIE = 'nightGodTarotConsentDate'
  private static readonly CONSENT_EXPIRY_DAYS = 365

  /**
   * Get current consent status
   */
  static getConsentStatus(): ConsentStatus {
    const consent = this.getCookie(this.CONSENT_COOKIE)
    const consentDate = this.getCookie(this.CONSENT_DATE_COOKIE)
    
    if (!consent || !consentDate) {
      return {
        granted: null,
        timestamp: null,
        expired: false
      }
    }

    const timestamp = new Date(parseInt(consentDate))
    const daysSinceConsent = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60 * 24)
    const expired = daysSinceConsent > this.CONSENT_EXPIRY_DAYS

    return {
      granted: consent === 'true' && !expired,
      timestamp,
      expired
    }
  }

  /**
   * Check if user has granted consent for specific feature
   */
  static hasConsentForFeature(): boolean {
    const status = this.getConsentStatus()
    
    if (status.granted === null || status.expired) {
      return false
    }

    // For now, all features require basic consent
    // In the future, you could implement granular consent per feature
    return status.granted
  }

  /**
   * Check if full features are enabled
   */
  static hasFullFeaturesEnabled(): boolean {
    return this.getConsentStatus().granted === true
  }

  /**
   * Get consent for analytics/tracking
   */
  static canTrackAnalytics(): boolean {
    return this.hasConsentForFeature()
  }

  /**
   * Get consent for personalization
   */
  static canPersonalize(): boolean {
    return this.hasConsentForFeature()
  }

  /**
   * Get consent for weather data
   */
  static canUseWeatherData(): boolean {
    return this.hasConsentForFeature()
  }

  /**
   * Get consent for news data
   */
  static canUseNewsData(): boolean {
    return this.hasConsentForFeature()
  }

  /**
   * Clear consent data (for testing or user-requested deletion)
   */
  static clearConsent(): void {
    this.deleteCookie(this.CONSENT_COOKIE)
    this.deleteCookie(this.CONSENT_DATE_COOKIE)
    
    // Clear any related localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('featuresEnabled')
      localStorage.removeItem('userPreferences')
    }
    
    // Clear global consent flag
    if (typeof window !== 'undefined') {
      ;(window as any).nightGodTarotConsent = null
    }
  }

  /**
   * Set up consent event listeners
   */
  static setupConsentListeners(): void {
    if (typeof document === 'undefined') return

    // Listen for consent granted
    document.addEventListener('consentGranted', () => {
      console.log('🌟 Consent granted - enabling full features')
      this.enableAnalytics()
      this.enablePersonalization()
    })

    // Listen for consent denied
    document.addEventListener('consentDenied', () => {
      console.log('🌫️ Consent denied - limiting features')
      this.disableAnalytics()
      this.disablePersonalization()
    })
  }

  /**
   * Enable analytics tracking
   */
  private static enableAnalytics(): void {
    // Enable Google Analytics if available
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted'
      })
    }

    // Enable other analytics tools
    console.log('📊 Analytics enabled')
  }

  /**
   * Disable analytics tracking
   */
  private static disableAnalytics(): void {
    // Disable Google Analytics if available
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied'
      })
    }

    console.log('📊 Analytics disabled')
  }

  /**
   * Enable personalization features
   */
  private static enablePersonalization(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('personalizationEnabled', 'true')
    }
    console.log('🎭 Personalization enabled')
  }

  /**
   * Disable personalization features
   */
  private static disablePersonalization(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('personalizationEnabled', 'false')
    }
    console.log('🎭 Personalization disabled')
  }

  /**
   * Cookie utility - Get cookie value
   */
  private static getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  /**
   * Cookie utility - Delete cookie
   */
  private static deleteCookie(name: string): void {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  }
}

/**
 * Vue composable for consent management
 */
export function useConsent() {
  const getStatus = () => ConsentManager.getConsentStatus()
  const hasFullFeatures = () => ConsentManager.hasFullFeaturesEnabled()
  const canTrack = () => ConsentManager.canTrackAnalytics()
  const canPersonalize = () => ConsentManager.canPersonalize()
  const canUseWeather = () => ConsentManager.canUseWeatherData()
  const canUseNews = () => ConsentManager.canUseNewsData()
  const clearConsent = () => ConsentManager.clearConsent()

  return {
    getStatus,
    hasFullFeatures,
    canTrack,
    canPersonalize,
    canUseWeather,
    canUseNews,
    clearConsent
  }
}

/**
 * Initialize consent system
 */
export function initializeConsentSystem(): void {
  ConsentManager.setupConsentListeners()
  
  // Log current consent status for debugging
  const status = ConsentManager.getConsentStatus()
  console.log('🔮 Consent System Initialized:', {
    granted: status.granted,
    expired: status.expired,
    timestamp: status.timestamp
  })
}