/**
 * Enhanced AI Reading Engine - Ultimate Tarot Experience
 * Combines all AI models with advanced features
 */

import { secureConfig } from '../../config/secureConfig'
import { cacheService } from '../cacheService'
import { advancedMonicaService } from './advancedMonicaService'

export interface EnhancedReadingConfig {
  enableCache: boolean
  enableVoice: boolean
  enableAnimation: boolean
  enableMultiModel: boolean
  enableRealTime: boolean
  enablePersonalization: boolean
}

export interface PersonalizedProfile {
  userId: string
  preferences: {
    language: 'en' | 'zh' | 'ja'
    readingStyle: 'detailed' | 'concise' | 'poetic'
    preferredModels: string[]
    theme: 'light' | 'dark' | 'mystical'
  }
  history: {
    totalReadings: number
    favoriteCards: string[]
    commonQuestions: string[]
    lastReading: Date
  }
}

export interface EnhancedReadingResult {
  id: string
  timestamp: Date
  question: string
  cards: Array<{
    name: string
    position: string
    interpretation: string
    keywords: string[]
    imageUrl?: string
  }>
  mainReading: string
  insights: {
    past: string
    present: string
    future: string
  }
  advice: string
  affirmation: string
  voiceUrl?: string
  animations?: Array<{
    type: string
    duration: number
    config: any
  }>
  confidence: number
  models: string[]
  processingTime: number
  personalizationScore: number
}

export class EnhancedReadingEngine {
  private static instance: EnhancedReadingEngine
  private config: EnhancedReadingConfig
  private activeReadings: Map<string, any>
  private userProfiles: Map<string, PersonalizedProfile>

  private constructor() {
    this.config = {
      enableCache: true,
      enableVoice: secureConfig.isFeatureEnabled('enableVoice'),
      enableAnimation: true,
      enableMultiModel: true,
      enableRealTime: true,
      enablePersonalization: true
    }
    this.activeReadings = new Map()
    this.userProfiles = new Map()
  }

  static getInstance(): EnhancedReadingEngine {
    if (!EnhancedReadingEngine.instance) {
      EnhancedReadingEngine.instance = new EnhancedReadingEngine()
    }
    return EnhancedReadingEngine.instance
  }

  /**
   * Perform an enhanced AI tarot reading
   */
  async performEnhancedReading(
    userId: string,
    question: string,
    cards: string[],
    spreadType: string = 'celtic-cross'
  ): Promise<EnhancedReadingResult> {
    const startTime = Date.now()
    const readingId = this.generateReadingId()

    // Get user profile for personalization
    const profile = await this.getUserProfile(userId)

    // Check cache first
    if (this.config.enableCache) {
      const cacheKey = `reading_${userId}_${this.hashQuestion(question)}_${cards.join(',')}`
      const cachedReading = await cacheService.get<EnhancedReadingResult>(cacheKey)
      if (cachedReading) {
        console.log('📚 Returning cached reading')
        return cachedReading
      }
    }

    // Initialize reading progress
    this.activeReadings.set(readingId, {
      status: 'initializing',
      progress: 0
    })

    try {
      // Step 1: Multi-model AI reading
      let mainReading = ''
      let modelResults: any[] = []

      if (this.config.enableMultiModel) {
        const multiModelResult = await advancedMonicaService.performMultiModelReading({
          question,
          cards: cards.map(name => ({ name, description: '' })),
          models: profile.preferences.preferredModels || ['gpt-4o', 'claude-3-5-sonnet-20241022'],
          compareResponses: true
        })
        
        mainReading = multiModelResult.bestReading
        modelResults = multiModelResult.readings
        
        this.updateReadingProgress(readingId, 30, 'AI analysis complete')
      } else {
        // Single model reading
        mainReading = await this.performSingleModelReading(question, cards, profile.preferences.language)
        this.updateReadingProgress(readingId, 30, 'Reading generated')
      }

      // Step 2: Generate card interpretations
      const cardInterpretations = await this.generateCardInterpretations(
        cards,
        question,
        spreadType,
        profile.preferences.language
      )
      this.updateReadingProgress(readingId, 50, 'Card interpretations ready')

      // Step 3: Extract insights
      const insights = await this.extractInsights(mainReading, cards, question)
      this.updateReadingProgress(readingId, 65, 'Insights extracted')

      // Step 4: Generate personalized advice
      const advice = await this.generatePersonalizedAdvice(
        question,
        insights,
        profile
      )
      this.updateReadingProgress(readingId, 75, 'Advice prepared')

      // Step 5: Create affirmation
      const affirmation = await this.generateAffirmation(
        question,
        insights,
        profile.preferences.language
      )
      this.updateReadingProgress(readingId, 85, 'Affirmation created')

      // Step 6: Generate voice reading (if enabled)
      let voiceUrl: string | undefined
      if (this.config.enableVoice) {
        voiceUrl = await advancedMonicaService.generateVoiceReading({
          text: mainReading,
          voice: 'mystical',
          language: profile.preferences.language,
          speed: 0.9
        })
        this.updateReadingProgress(readingId, 95, 'Voice generated')
      }

      // Step 7: Prepare animations (if enabled)
      const animations = this.config.enableAnimation ? 
        this.generateAnimations(cards, spreadType) : undefined

      // Compile final result
      const result: EnhancedReadingResult = {
        id: readingId,
        timestamp: new Date(),
        question,
        cards: cardInterpretations,
        mainReading,
        insights,
        advice,
        affirmation,
        voiceUrl,
        animations,
        confidence: this.calculateConfidence(modelResults),
        models: modelResults.map(r => r.model),
        processingTime: Date.now() - startTime,
        personalizationScore: this.calculatePersonalizationScore(profile)
      }

      // Cache the result
      if (this.config.enableCache) {
        const cacheKey = `reading_${userId}_${this.hashQuestion(question)}_${cards.join(',')}`
        await cacheService.set(cacheKey, result, 3600000) // Cache for 1 hour
        await cacheService.cacheReading(result) // Store in reading history
      }

      // Update user profile
      await this.updateUserProfile(userId, result)

      this.updateReadingProgress(readingId, 100, 'Complete')
      this.activeReadings.delete(readingId)

      return result

    } catch (error) {
      console.error('Enhanced reading failed:', error)
      this.activeReadings.delete(readingId)
      throw error
    }
  }

  /**
   * Get or create user profile
   */
  private async getUserProfile(userId: string): Promise<PersonalizedProfile> {
    // Check memory cache
    if (this.userProfiles.has(userId)) {
      return this.userProfiles.get(userId)!
    }

    // Check persistent cache
    const cached = await cacheService.get<PersonalizedProfile>(`profile_${userId}`)
    if (cached) {
      this.userProfiles.set(userId, cached)
      return cached
    }

    // Create new profile
    const newProfile: PersonalizedProfile = {
      userId,
      preferences: {
        language: 'en',
        readingStyle: 'detailed',
        preferredModels: ['gpt-4o', 'claude-3-5-sonnet-20241022'],
        theme: 'mystical'
      },
      history: {
        totalReadings: 0,
        favoriteCards: [],
        commonQuestions: [],
        lastReading: new Date()
      }
    }

    this.userProfiles.set(userId, newProfile)
    await cacheService.set(`profile_${userId}`, newProfile)
    
    return newProfile
  }

  /**
   * Update user profile after reading
   */
  private async updateUserProfile(userId: string, reading: EnhancedReadingResult): Promise<void> {
    const profile = await this.getUserProfile(userId)
    
    profile.history.totalReadings++
    profile.history.lastReading = reading.timestamp
    
    // Update favorite cards based on frequency
    reading.cards.forEach(card => {
      if (!profile.history.favoriteCards.includes(card.name)) {
        profile.history.favoriteCards.push(card.name)
      }
    })
    
    // Keep only top 10 favorite cards
    if (profile.history.favoriteCards.length > 10) {
      profile.history.favoriteCards = profile.history.favoriteCards.slice(0, 10)
    }
    
    // Update common questions
    if (!profile.history.commonQuestions.includes(reading.question)) {
      profile.history.commonQuestions.push(reading.question)
      if (profile.history.commonQuestions.length > 5) {
        profile.history.commonQuestions.shift()
      }
    }
    
    await cacheService.set(`profile_${userId}`, profile)
  }

  /**
   * Generate card interpretations with positions
   */
  private async generateCardInterpretations(
    cards: string[],
    question: string,
    spreadType: string,
    language: string
  ): Promise<Array<any>> {
    const positions = this.getSpreadPositions(spreadType)
    
    return Promise.all(cards.map(async (card, index) => {
      const position = positions[index] || `Position ${index + 1}`
      const interpretation = await this.generateSingleCardInterpretation(
        card,
        position,
        question,
        language
      )
      
      return {
        name: card,
        position,
        interpretation,
        keywords: this.extractKeywords(interpretation),
        imageUrl: `/assets/${card.replace(/\s+/g, '_')}.png`
      }
    }))
  }

  /**
   * Extract insights from reading
   */
  private async extractInsights(reading: string, cards: string[], question: string): Promise<any> {
    // Use AI to extract temporal insights
    const prompt = `Extract past, present, and future insights from this tarot reading:
    Cards: ${cards.join(', ')}
    Question: ${question}
    Reading: ${reading}
    
    Provide concise insights for:
    1. Past influences
    2. Present situation
    3. Future potential`

    // In production, this would call the AI service
    return {
      past: 'The foundation of your journey shows strength and determination.',
      present: 'Current energies suggest a time of transformation and growth.',
      future: 'The path ahead promises new opportunities and spiritual awakening.'
    }
  }

  /**
   * Generate personalized advice
   */
  private async generatePersonalizedAdvice(
    question: string,
    insights: any,
    profile: PersonalizedProfile
  ): Promise<string> {
    const style = profile.preferences.readingStyle
    
    // Generate advice based on user's preferred style
    let advice = 'Based on your reading, '
    
    switch (style) {
      case 'detailed':
        advice += 'here is comprehensive guidance for your situation...'
        break
      case 'concise':
        advice += 'focus on these key actions...'
        break
      case 'poetic':
        advice += 'let these words guide your heart...'
        break
    }
    
    return advice
  }

  /**
   * Generate affirmation
   */
  private async generateAffirmation(
    question: string,
    insights: any,
    language: string
  ): Promise<string> {
    const affirmations = {
      en: 'I am aligned with my highest purpose and trust the universe to guide me.',
      zh: '我与最高的目标保持一致，相信宇宙会指引我。',
      ja: '私は最高の目的と調和し、宇宙が私を導くことを信じています。'
    }
    
    return affirmations[language as keyof typeof affirmations] || affirmations.en
  }

  /**
   * Generate animations configuration
   */
  private generateAnimations(cards: string[], spreadType: string): Array<any> {
    return [
      {
        type: 'card-reveal',
        duration: 800,
        config: {
          stagger: 200,
          easing: 'easeOutQuart'
        }
      },
      {
        type: 'glow-effect',
        duration: 2000,
        config: {
          color: '#9333ea',
          intensity: 0.8
        }
      },
      {
        type: 'particle-burst',
        duration: 3000,
        config: {
          particles: 50,
          spread: 360
        }
      }
    ]
  }

  /**
   * Helper methods
   */
  private generateReadingId(): string {
    return `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private hashQuestion(question: string): string {
    // Simple hash for cache key
    return question.toLowerCase().replace(/[^a-z0-9]/g, '').substr(0, 20)
  }

  private updateReadingProgress(readingId: string, progress: number, status: string): void {
    if (this.activeReadings.has(readingId)) {
      this.activeReadings.set(readingId, { progress, status })
    }
  }

  private calculateConfidence(modelResults: any[]): number {
    if (!modelResults.length) return 0.7
    const avg = modelResults.reduce((sum, r) => sum + (r.confidence || 0.7), 0) / modelResults.length
    return Math.min(1.0, avg)
  }

  private calculatePersonalizationScore(profile: PersonalizedProfile): number {
    let score = 0.5
    if (profile.history.totalReadings > 5) score += 0.2
    if (profile.history.totalReadings > 10) score += 0.1
    if (profile.history.favoriteCards.length > 5) score += 0.1
    if (profile.preferences.preferredModels.length > 1) score += 0.1
    return Math.min(1.0, score)
  }

  private getSpreadPositions(spreadType: string): string[] {
    const spreads = {
      'celtic-cross': [
        'Present Situation',
        'Cross/Challenge',
        'Distant Past',
        'Recent Past',
        'Possible Future',
        'Near Future',
        'Your Approach',
        'External Influences',
        'Hopes & Fears',
        'Final Outcome'
      ],
      'three-card': ['Past', 'Present', 'Future'],
      'single': ['Focus'],
      'relationship': ['You', 'Partner', 'Relationship', 'Challenge', 'Outcome']
    }
    
    return spreads[spreadType as keyof typeof spreads] || spreads['three-card']
  }

  private extractKeywords(text: string): string[] {
    // Extract key words from interpretation
    const keywords = text.match(/\b[A-Z][a-z]+\b/g) || []
    return [...new Set(keywords)].slice(0, 5)
  }

  private async generateSingleCardInterpretation(
    card: string,
    position: string,
    question: string,
    language: string
  ): Promise<string> {
    // In production, this would call AI for specific interpretation
    return `The ${card} in the ${position} position suggests profound insights related to your question about ${question}.`
  }

  private async performSingleModelReading(
    question: string,
    cards: string[],
    language: string
  ): Promise<string> {
    // Fallback single model reading
    return `Your cards ${cards.join(', ')} reveal important guidance for "${question}".`
  }

  /**
   * Get reading progress for real-time updates
   */
  getReadingProgress(readingId: string): any {
    return this.activeReadings.get(readingId) || { status: 'unknown', progress: 0 }
  }

  /**
   * Stream reading updates via WebSocket
   */
  async *streamReading(
    userId: string,
    question: string,
    cards: string[]
  ): AsyncGenerator<any> {
    const readingId = this.generateReadingId()
    
    yield { type: 'start', readingId, progress: 0 }
    
    // Simulate progressive updates
    const steps = [
      { progress: 10, message: 'Connecting to cosmic energies...' },
      { progress: 25, message: 'Analyzing card patterns...' },
      { progress: 40, message: 'Consulting AI oracles...' },
      { progress: 60, message: 'Weaving insights together...' },
      { progress: 80, message: 'Personalizing your message...' },
      { progress: 95, message: 'Finalizing divine guidance...' }
    ]
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 500))
      yield { type: 'progress', ...step }
    }
    
    const result = await this.performEnhancedReading(userId, question, cards)
    yield { type: 'complete', result }
  }
}

export const enhancedReadingEngine = EnhancedReadingEngine.getInstance()
export default enhancedReadingEngine