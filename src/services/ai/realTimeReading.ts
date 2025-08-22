/**
 * Real-time Tarot Reading System
 * Leverages unlimited Monica AI for instant, streaming responses
 */

import { monicaOrchestrator } from './monicaOrchestrator'
import type { TarotCard, CustomerQuery, OrchestrationResult } from './monicaOrchestrator'

export interface StreamingReading {
  id: string
  progress: number
  currentStage: 'preparing' | 'research' | 'analysis' | 'creation' | 'complete'
  stageContent: string
  finalReading?: string
  error?: string
}

export class RealTimeTarotReader {
  private activeReadings = new Map<string, StreamingReading>()
  
  /**
   * Start a real-time streaming reading
   */
  async startStreamingReading(
    query: CustomerQuery,
    onProgress: (reading: StreamingReading) => void
  ): Promise<string> {
    const readingId = `reading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Initialize reading
    const reading: StreamingReading = {
      id: readingId,
      progress: 0,
      currentStage: 'preparing',
      stageContent: '🌟 Connecting to the cosmic energies...'
    }
    
    this.activeReadings.set(readingId, reading)
    onProgress(reading)
    
    try {
      // Stage 1: Research Phase
      reading.currentStage = 'research'
      reading.progress = 25
      reading.stageContent = '🌊 Deep research of tarot symbolism with DeepSeek Chat...'
      onProgress(reading)
      
      // Stage 2: Analysis Phase  
      reading.currentStage = 'analysis'
      reading.progress = 50
      reading.stageContent = '🧠 Analyzing and combining mystical insights with Gemini...'
      onProgress(reading)
      
      // Stage 3: Creation Phase
      reading.currentStage = 'creation'
      reading.progress = 75
      reading.stageContent = '🎭 Creating your personalized poetic reading with GPT-4o...'
      onProgress(reading)
      
      // Execute full orchestration
      const result = await monicaOrchestrator.orchestrateReading(query)
      
      // Complete
      reading.currentStage = 'complete'
      reading.progress = 100
      reading.finalReading = result.finalReading
      reading.stageContent = '✨ Your cosmic reading is complete!'
      onProgress(reading)
      
      this.activeReadings.delete(readingId)
      return result.finalReading
      
    } catch (error) {
      reading.error = error instanceof Error ? error.message : 'Unknown error occurred'
      reading.stageContent = '⚠️ The cosmic energies encountered turbulence. Falling back to divine wisdom...'
      onProgress(reading)
      
      // Fallback reading
      const fallbackReading = this.generateFallbackReading(query)
      reading.finalReading = fallbackReading
      reading.currentStage = 'complete'
      reading.progress = 100
      onProgress(reading)
      
      this.activeReadings.delete(readingId)
      return fallbackReading
    }
  }
  
  /**
   * Enhanced instant card interpretation
   */
  async getInstantCardInterpretation(card: TarotCard, context?: string): Promise<string> {
    const prompt = `Provide an instant mystical interpretation of the tarot card "${card.name}".
    
Context: ${context || 'General guidance needed'}

Give a beautiful, inspiring 2-3 sentence interpretation that captures:
- The card's core energy and message  
- Practical guidance for the querent
- Poetic, mystical language that resonates emotionally

Keep it concise but powerful - this is for instant display as the user draws the card.`

    try {
      const response = await fetch('https://openapi.monica.im/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_MONICA_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Fast model for instant responses
          messages: [
            {
              role: 'system',
              content: 'You are a mystical tarot oracle providing instant, beautiful card interpretations. Your words are concise but deeply meaningful, inspiring and practical.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.8
        })
      })

      if (response.ok) {
        const data = await response.json()
        return data.choices[0].message.content
      }
    } catch (error) {
      console.error('Instant interpretation failed:', error)
    }
    
    // Fallback interpretation
    return `✨ ${card.name} calls to you with ancient wisdom. This card represents ${card.keywords.upright.slice(0, 2).join(' and ')}, guiding you toward your highest path. Trust in the divine timing of this message.`
  }
  
  /**
   * Multi-perspective reading (Love, Career, Spiritual simultaneously)
   */
  async getMultiPerspectiveReading(cards: TarotCard[], question: string): Promise<{
    love: string
    career: string
    spiritual: string
    overall: string
  }> {
    const cardNames = cards.map(c => c.name).join(', ')
    
    const perspectivePrompts = {
      love: `Focus on love, relationships, and emotional connections regarding: "${question}" with cards: ${cardNames}`,
      career: `Focus on career, professional growth, and material success regarding: "${question}" with cards: ${cardNames}`,
      spiritual: `Focus on spiritual growth, inner wisdom, and soul journey regarding: "${question}" with cards: ${cardNames}`,
      overall: `Provide an integrative overview that weaves together all aspects regarding: "${question}" with cards: ${cardNames}`
    }
    
    // Execute all perspectives in parallel with unlimited Monica
    const promises = Object.entries(perspectivePrompts).map(async ([perspective, prompt]) => {
      try {
        const response = await fetch('https://openapi.monica.im/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_MONICA_API_KEY}`
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            messages: [
              {
                role: 'system',
                content: `You are a master tarot reader specializing in ${perspective} guidance. Provide deep, insightful interpretations with practical wisdom.`
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          return [perspective, data.choices[0].message.content]
        }
      } catch (error) {
        console.error(`${perspective} perspective failed:`, error)
      }
      
      return [perspective, `The cosmic energies reveal guidance in ${perspective} - trust your intuition as you navigate this path.`]
    })
    
    const results = await Promise.all(promises)
    const perspectives = Object.fromEntries(results) as {
      love: string
      career: string  
      spiritual: string
      overall: string
    }
    
    return perspectives
  }
  
  /**
   * Generate fallback reading when AI fails
   */
  private generateFallbackReading(query: CustomerQuery): string {
    const cardNames = query.cards.map(c => c.name).join(', ')
    
    return `🌟 **Divine Guidance from the Cosmos**

The sacred cards **${cardNames}** have chosen to speak to you today about "${query.question}".

✨ **The Reading:**
The universe acknowledges your question and offers this wisdom: Every card drawn carries the vibration of divine timing. These symbols have appeared to remind you that you already possess the inner wisdom needed to navigate your path.

🌙 **Your Path Forward:**
Trust in the unfolding of your journey. The cards suggest that clarity will emerge as you remain open to the subtle guidance of your intuition. Pay attention to synchronicities in the coming days.

💫 **Cosmic Blessing:**
May this reading serve as a beacon of light on your spiritual journey. The universe supports your highest good and guides you toward your destined path.

*Generated with love by the Night God Tarot AI system*`
  }
  
  /**
   * Get reading progress for active sessions
   */
  getReadingProgress(readingId: string): StreamingReading | null {
    return this.activeReadings.get(readingId) || null
  }
  
  /**
   * Cancel an active reading
   */
  cancelReading(readingId: string): boolean {
    return this.activeReadings.delete(readingId)
  }
}

export const realTimeTarotReader = new RealTimeTarotReader()