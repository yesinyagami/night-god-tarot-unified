/**
 * Monica ChatGPT-5 Powered Dynamic Translation Service
 * Real-time AI translation for the Night God Tarot interface
 */

interface TranslationCache {
  [key: string]: {
    translation: string
    timestamp: number
  }
}

interface TranslationRequest {
  text: string
  fromLanguage: 'zh' | 'en' | 'ja'
  toLanguage: 'zh' | 'en' | 'ja'
  context?: string
}

interface BatchTranslationRequest {
  texts: string[]
  fromLanguage: 'zh' | 'en' | 'ja'
  toLanguage: 'zh' | 'en' | 'ja'
  context?: string
}

class MonicaTranslationService {
  private monicaApiKey: string | null = null
  private baseUrl = 'https://openapi.monica.im'
  private cache: TranslationCache = {}
  private cacheTimeout = 24 * 60 * 60 * 1000 // 24 hours
  private pendingRequests = new Map<string, Promise<string>>()

  async initialize(): Promise<void> {
    this.monicaApiKey = import.meta.env.VITE_MONICA_API_KEY
    
    if (!this.monicaApiKey) {
      console.warn('Monica API key not found. Translation will use fallback static translations.')
      return
    }

    // Load cached translations from localStorage
    const savedCache = localStorage.getItem('monicaTranslationCache')
    if (savedCache) {
      try {
        this.cache = JSON.parse(savedCache)
        // Clean expired cache entries
        this.cleanExpiredCache()
      } catch (error) {
        console.warn('Failed to load translation cache:', error)
      }
    }

    console.log('🌐 Monica Translation Service initialized')
  }

  /**
   * Translate a single text using Monica ChatGPT-5
   */
  async translate(request: TranslationRequest): Promise<string> {
    if (!this.monicaApiKey) {
      return this.getFallbackTranslation(request.text, request.toLanguage)
    }

    if (request.fromLanguage === request.toLanguage) {
      return request.text
    }

    const cacheKey = this.getCacheKey(request.text, request.fromLanguage, request.toLanguage)
    
    // Check cache first
    const cached = this.getFromCache(cacheKey)
    if (cached) {
      return cached
    }

    // Check for pending request to avoid duplicates
    if (this.pendingRequests.has(cacheKey)) {
      return await this.pendingRequests.get(cacheKey)!
    }

    // Create new translation request
    const translationPromise = this.performTranslation(request)
    this.pendingRequests.set(cacheKey, translationPromise)

    try {
      const result = await translationPromise
      this.setCache(cacheKey, result)
      return result
    } catch (error) {
      console.error('Monica translation failed:', error)
      return this.getFallbackTranslation(request.text, request.toLanguage)
    } finally {
      this.pendingRequests.delete(cacheKey)
    }
  }

  /**
   * Translate multiple texts in a single request for efficiency
   */
  async batchTranslate(request: BatchTranslationRequest): Promise<string[]> {
    if (!this.monicaApiKey) {
      return request.texts.map(text => this.getFallbackTranslation(text, request.toLanguage))
    }

    if (request.fromLanguage === request.toLanguage) {
      return request.texts
    }

    const results: string[] = []
    const textsToTranslate: { text: string; index: number }[] = []

    // Check cache for each text
    for (let i = 0; i < request.texts.length; i++) {
      const text = request.texts[i]
      const cacheKey = this.getCacheKey(text, request.fromLanguage, request.toLanguage)
      const cached = this.getFromCache(cacheKey)
      
      if (cached) {
        results[i] = cached
      } else {
        textsToTranslate.push({ text, index: i })
      }
    }

    // Translate remaining texts
    if (textsToTranslate.length > 0) {
      try {
        const batchTranslations = await this.performBatchTranslation({
          texts: textsToTranslate.map(item => item.text),
          fromLanguage: request.fromLanguage,
          toLanguage: request.toLanguage,
          context: request.context
        })

        // Map results back to original positions
        textsToTranslate.forEach((item, batchIndex) => {
          const translation = batchTranslations[batchIndex]
          results[item.index] = translation
          
          // Cache the result
          const cacheKey = this.getCacheKey(item.text, request.fromLanguage, request.toLanguage)
          this.setCache(cacheKey, translation)
        })
      } catch (error) {
        console.error('Monica batch translation failed:', error)
        // Fill remaining with fallbacks
        textsToTranslate.forEach(item => {
          results[item.index] = this.getFallbackTranslation(item.text, request.toLanguage)
        })
      }
    }

    return results
  }

  /**
   * Translate entire UI context with awareness
   */
  async translateUIContext(texts: string[], fromLanguage: 'zh' | 'en' | 'ja', toLanguage: 'zh' | 'en' | 'ja'): Promise<string[]> {
    return await this.batchTranslate({
      texts,
      fromLanguage,
      toLanguage,
      context: 'Night God Tarot mystical interface - preserve mystical tone and spiritual terminology'
    })
  }

  private async performTranslation(request: TranslationRequest): Promise<string> {
    const prompt = this.buildTranslationPrompt(request)

    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.monicaApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Monica's ChatGPT-5 model
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(request.fromLanguage, request.toLanguage)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for consistent translations
        max_tokens: 500,
        timeout: 10000
      })
    })

    if (!response.ok) {
      throw new Error(`Monica API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content.trim()
  }

  private async performBatchTranslation(request: BatchTranslationRequest): Promise<string[]> {
    const prompt = this.buildBatchTranslationPrompt(request)

    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.monicaApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(request.fromLanguage, request.toLanguage)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        timeout: 15000
      })
    })

    if (!response.ok) {
      throw new Error(`Monica API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const result = data.choices[0].message.content.trim()
    
    // Parse the batch response
    try {
      const translations = JSON.parse(result)
      if (Array.isArray(translations)) {
        return translations
      } else {
        throw new Error('Invalid batch translation format')
      }
    } catch {
      // Fallback: split by lines if JSON parsing fails
      return result.split('\n').map((line: string) => line.trim()).filter((line: string) => line)
    }
  }

  private buildTranslationPrompt(request: TranslationRequest): string {
    const contextNote = request.context ? `\n\nContext: ${request.context}` : ''
    const fromLangName = this.getLanguageName(request.fromLanguage)
    const toLangName = this.getLanguageName(request.toLanguage)
    
    return `Translate the following text from ${fromLangName} to ${toLangName}:

"${request.text}"${contextNote}

Requirements:
- Maintain the mystical and spiritual tone
- Preserve any special formatting or symbols
- Keep the same emotional intensity
- Ensure cultural appropriateness
- Return only the translated text, no explanations`
  }

  private buildBatchTranslationPrompt(request: BatchTranslationRequest): string {
    const contextNote = request.context ? `\n\nContext: ${request.context}` : ''
    const textList = request.texts.map((text, index) => `${index + 1}. "${text}"`).join('\n')
    const fromLangName = this.getLanguageName(request.fromLanguage)
    const toLangName = this.getLanguageName(request.toLanguage)
    
    return `Translate the following texts from ${fromLangName} to ${toLangName}:

${textList}${contextNote}

Requirements:
- Maintain the mystical and spiritual tone for all texts
- Preserve any special formatting or symbols
- Keep the same emotional intensity
- Ensure cultural appropriateness
- Return as a JSON array of strings: ["translation1", "translation2", ...]
- Return only the JSON array, no explanations`
  }

  private getLanguageName(lang: 'zh' | 'en' | 'ja'): string {
    const names = { zh: 'Chinese', en: 'English', ja: 'Japanese' }
    return names[lang]
  }

  private getSystemPrompt(fromLanguage: 'zh' | 'en' | 'ja', toLanguage: 'zh' | 'en' | 'ja'): string {
    if (toLanguage === 'zh') {
      return `You are an expert translator specializing in mystical and spiritual content for the Night God Tarot system. 
      
Translate to Chinese with these guidelines:
- Use elegant, classical Chinese when appropriate
- Maintain the mystical and spiritual atmosphere
- Keep technical terms consistent (AI models, interface elements)
- Preserve the poetic and profound nature of tarot language
- Use traditional mystical terminology where suitable
- Ensure the translation sounds natural and flowing in Chinese`
    } else if (toLanguage === 'ja') {
      return `You are an expert translator specializing in mystical and spiritual content for the Night God Tarot system.
      
Translate to Japanese with these guidelines:
- Use appropriate levels of formality (keigo when suitable)
- Maintain the mystical and spiritual atmosphere
- Keep technical terms consistent (AI models, interface elements)
- Preserve the poetic and profound nature of tarot language
- Use traditional Japanese mystical and spiritual terminology
- Ensure cultural appropriateness for Japanese spiritual contexts
- Use elegant, sophisticated Japanese expressions`
    } else {
      return `You are an expert translator specializing in mystical and spiritual content for the Night God Tarot system.
      
Translate to English with these guidelines:
- Maintain the mystical and spiritual atmosphere
- Use elegant, sophisticated English
- Keep technical terms consistent (AI models, interface elements)
- Preserve the poetic and profound nature of tarot language
- Ensure the translation captures the essence and cultural nuances
- Use appropriate mystical terminology in English`
    }
  }

  private getCacheKey(text: string, fromLang: string, toLang: string): string {
    return `${fromLang}-${toLang}-${btoa(encodeURIComponent(text))}`
  }

  private getFromCache(cacheKey: string): string | null {
    const cached = this.cache[cacheKey]
    if (!cached) return null

    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      delete this.cache[cacheKey]
      return null
    }

    return cached.translation
  }

  private setCache(cacheKey: string, translation: string): void {
    this.cache[cacheKey] = {
      translation,
      timestamp: Date.now()
    }

    // Save to localStorage periodically (debounced)
    this.debouncedSaveCache()
  }

  private debouncedSaveCache = this.debounce(() => {
    try {
      localStorage.setItem('monicaTranslationCache', JSON.stringify(this.cache))
    } catch (error) {
      console.warn('Failed to save translation cache:', error)
    }
  }, 1000)

  private debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
    let timeout: number
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  private cleanExpiredCache(): void {
    const now = Date.now()
    for (const key in this.cache) {
      if (now - this.cache[key].timestamp > this.cacheTimeout) {
        delete this.cache[key]
      }
    }
  }

  private getFallbackTranslation(text: string, targetLanguage: 'zh' | 'en' | 'ja'): string {
    // Basic fallback translations for key interface elements
    const fallbacks: { [key: string]: { zh: string; en: string; ja: string } } = {
      'Night God Tarot': { zh: '夜神塔羅', en: 'Night God Tarot', ja: '夜神タロット' },
      'Monica AI': { zh: 'Monica AI', en: 'Monica AI', ja: 'Monica AI' },
      'Cards Revealed': { zh: '神牌已顯現', en: 'Cards Revealed', ja: 'カードが現れました' },
      'Reading Complete': { zh: '神諭完成', en: 'Reading Complete', ja: 'リーディング完了' },
      'Level Up!': { zh: '等級提升！', en: 'Level Up!', ja: 'レベルアップ！' },
      'Activate Oracle': { zh: '啟動神諭', en: 'Activate Oracle', ja: '神託を起動' },
      'Ask the Universe': { zh: '🕯️ 向宇宙提問', en: '🕯️ Ask the Universe', ja: '🕯️ 宇宙に問いかける' }
    }

    const fallback = fallbacks[text]
    if (fallback) {
      return fallback[targetLanguage]
    }

    // If no fallback found, return original text
    return text
  }

  /**
   * Get health status of the translation service
   */
  async healthCheck(): Promise<{ available: boolean; cached: number; lastError?: string }> {
    return {
      available: !!this.monicaApiKey,
      cached: Object.keys(this.cache).length,
      lastError: this.monicaApiKey ? undefined : 'No Monica API key configured'
    }
  }

  /**
   * Clear all cached translations
   */
  clearCache(): void {
    this.cache = {}
    localStorage.removeItem('monicaTranslationCache')
    console.log('🗑️ Translation cache cleared')
  }
}

export const monicaTranslator = new MonicaTranslationService()