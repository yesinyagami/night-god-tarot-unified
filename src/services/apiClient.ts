// API Client for Real Docker Services
import { ref } from 'vue'

// Environment variables
const MONICA_API_KEY = import.meta.env.VITE_MONICA_API_KEY
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY
const MONGODB_URI = import.meta.env.VITE_MONGODB_URI
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY
const VERCEL_TOKEN = import.meta.env.VITE_VERCEL_TOKEN

// API Base URLs
const API_ENDPOINTS = {
  MONICA: 'https://openapi.monica.im/v1',
  CLAUDE: 'https://api.anthropic.com/v1',
  LOCAL_API: 'http://localhost:8080/api',
  AUTH_SERVICE: 'http://localhost:3002',
  TAROT_DB: 'http://localhost:3001',
  WEBSOCKET: 'ws://localhost:3004/ws',
  IMAGE_GEN: 'http://localhost:3005'
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  status?: number
}

export interface ServiceStatus {
  name: string
  status: 'online' | 'offline' | 'error'
  endpoint: string
  responseTime?: number
  lastChecked: Date
}

// Monica AI Service
export class MonicaAiService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = MONICA_API_KEY || ''
    this.baseUrl = API_ENDPOINTS.MONICA
  }

  async testConnection(): Promise<ApiResponse> {
    try {
      const startTime = Date.now()
      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      const responseTime = Date.now() - startTime

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          data: { models: data, responseTime },
          status: response.status
        }
      } else {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  async generateTarotReading(prompt: string, model = 'gpt-4o'): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert tarot reader with deep knowledge of the Song of the Silent universe. Provide insightful, mystical interpretations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      })

      if (response.ok) {
        const data = await response.json()
        return { success: true, data }
      } else {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Claude AI Service
export class ClaudeAiService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = CLAUDE_API_KEY || ''
    this.baseUrl = API_ENDPOINTS.CLAUDE
  }

  async testConnection(): Promise<ApiResponse> {
    try {
      const startTime = Date.now()
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 10,
          messages: [
            {
              role: 'user',
              content: 'Test connection'
            }
          ]
        })
      })

      const responseTime = Date.now() - startTime

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          data: { response: data, responseTime },
          status: response.status
        }
      } else {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// MongoDB Service
export class MongoDbService {
  private uri: string

  constructor() {
    this.uri = MONGODB_URI || ''
  }

  async testConnection(): Promise<ApiResponse> {
    try {
      // For security, we'll test through a backend endpoint
      const response = await fetch('/api/db/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        return { success: true, data }
      } else {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: 'MongoDB test endpoint not available - database connection should be tested server-side'
      }
    }
  }

  async saveReading(reading: any): Promise<ApiResponse> {
    try {
      const response = await fetch('/api/readings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reading)
      })

      if (response.ok) {
        const data = await response.json()
        return { success: true, data }
      } else {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Stripe Payment Service
export class StripeService {
  private publicKey: string

  constructor() {
    this.publicKey = STRIPE_PUBLIC_KEY || ''
  }

  async testConnection(): Promise<ApiResponse> {
    try {
      // Test Stripe by checking if we can load the Stripe JS library
      if (!window.Stripe && this.publicKey) {
        const script = document.createElement('script')
        script.src = 'https://js.stripe.com/v3/'
        document.head.appendChild(script)
        
        return new Promise((resolve) => {
          script.onload = () => {
            const stripe = window.Stripe(this.publicKey)
            if (stripe) {
              resolve({
                success: true,
                data: { message: 'Stripe SDK loaded successfully', publicKey: this.publicKey.slice(0, 10) + '...' }
              })
            } else {
              resolve({
                success: false,
                error: 'Failed to initialize Stripe'
              })
            }
          }
          script.onerror = () => {
            resolve({
              success: false,
              error: 'Failed to load Stripe SDK'
            })
          }
        })
      } else if (window.Stripe) {
        return {
          success: true,
          data: { message: 'Stripe SDK already loaded', publicKey: this.publicKey.slice(0, 10) + '...' }
        }
      } else {
        return {
          success: false,
          error: 'No Stripe public key configured'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Docker Service Manager
export class DockerServiceManager {
  private services: Map<string, any> = new Map()

  constructor() {
    this.services.set('monica', new MonicaAiService())
    this.services.set('claude', new ClaudeAiService())
    this.services.set('mongodb', new MongoDbService())
    this.services.set('stripe', new StripeService())
  }

  async testService(serviceName: string): Promise<ServiceStatus> {
    const service = this.services.get(serviceName)
    const startTime = Date.now()
    
    if (!service) {
      return {
        name: serviceName,
        status: 'error',
        endpoint: 'unknown',
        lastChecked: new Date()
      }
    }

    try {
      const result = await service.testConnection()
      const responseTime = Date.now() - startTime

      return {
        name: serviceName,
        status: result.success ? 'online' : 'error',
        endpoint: this.getEndpointForService(serviceName),
        responseTime,
        lastChecked: new Date()
      }
    } catch (error) {
      return {
        name: serviceName,
        status: 'offline',
        endpoint: this.getEndpointForService(serviceName),
        responseTime: Date.now() - startTime,
        lastChecked: new Date()
      }
    }
  }

  async testAllServices(): Promise<ServiceStatus[]> {
    const results: ServiceStatus[] = []
    const serviceNames = ['monica', 'claude', 'mongodb', 'stripe']
    
    for (const serviceName of serviceNames) {
      const status = await this.testService(serviceName)
      results.push(status)
    }
    
    return results
  }

  private getEndpointForService(serviceName: string): string {
    const endpoints: Record<string, string> = {
      monica: API_ENDPOINTS.MONICA,
      claude: API_ENDPOINTS.CLAUDE,
      mongodb: 'MongoDB Atlas',
      stripe: 'Stripe API'
    }
    return endpoints[serviceName] || 'unknown'
  }

  getService(serviceName: string) {
    return this.services.get(serviceName)
  }
}

// Export singleton instance
export const dockerServiceManager = new DockerServiceManager()
export const monicaAi = new MonicaAiService()
export const claudeAi = new ClaudeAiService()
export const mongoDb = new MongoDbService()
export const stripeService = new StripeService()

// Types for Stripe (if not available globally)
declare global {
  interface Window {
    Stripe: any
  }
}