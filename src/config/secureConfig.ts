/**
 * Secure Configuration Management
 * Centralizes all API keys and sensitive configuration
 */

interface SecureConfig {
  monica: {
    apiKey: string
    baseUrl: string
  }
  deepseek: {
    apiKey: string
    baseUrl: string
  }
  openweather: {
    apiKey: string
    baseUrl: string
  }
  news: {
    apiKey: string
    baseUrl: string
  }
  stripe: {
    publicKey: string
    secretKey: string
  }
  features: {
    enableAI: boolean
    enablePayments: boolean
    enableAnalytics: boolean
    enableVoice: boolean
    enableImageGen: boolean
  }
  security: {
    rateLimit: number
    sessionTimeout: number
    maxFileSize: number
  }
}

class ConfigManager {
  private static instance: ConfigManager
  private config: SecureConfig

  private constructor() {
    this.config = {
      monica: {
        apiKey: import.meta.env.VITE_MONICA_API_KEY || '',
        baseUrl: import.meta.env.VITE_MONICA_API_URL || 'https://openapi.monica.im'
      },
      deepseek: {
        apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
        baseUrl: import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com'
      },
      openweather: {
        apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
        baseUrl: import.meta.env.VITE_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5'
      },
      news: {
        apiKey: import.meta.env.VITE_NEWS_API_KEY || '',
        baseUrl: import.meta.env.VITE_NEWS_API_URL || 'https://newsapi.org/v2'
      },
      stripe: {
        publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
        secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || ''
      },
      features: {
        enableAI: import.meta.env.VITE_ENABLE_AI_READINGS === 'true',
        enablePayments: import.meta.env.VITE_ENABLE_PAYMENT === 'true',
        enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
        enableVoice: import.meta.env.VITE_ENABLE_VOICE_SYNTHESIS === 'true',
        enableImageGen: import.meta.env.VITE_ENABLE_IMAGE_GENERATION === 'true'
      },
      security: {
        rateLimit: parseInt(import.meta.env.VITE_RATE_LIMIT_REQUESTS || '100'),
        sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600000'),
        maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880')
      }
    }

    this.validateConfig()
  }

  private validateConfig(): void {
    const warnings: string[] = []
    
    if (!this.config.monica.apiKey) {
      warnings.push('Monica API key is missing')
    }
    
    if (warnings.length > 0 && import.meta.env.DEV) {
      console.warn('⚠️ Configuration warnings:', warnings)
    }
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  get(key: keyof SecureConfig): any {
    return this.config[key]
  }

  isFeatureEnabled(feature: keyof SecureConfig['features']): boolean {
    return this.config.features[feature]
  }

  getApiKey(service: 'monica' | 'deepseek' | 'openweather' | 'news'): string {
    return this.config[service].apiKey
  }

  getApiUrl(service: 'monica' | 'deepseek' | 'openweather' | 'news'): string {
    return this.config[service].baseUrl
  }
}

export const secureConfig = ConfigManager.getInstance()
export default secureConfig