/**
 * Monica AI Orchestration Service
 * Advanced multi-AI system combining Perplexity, Gemini, and ChatGPT-5
 * for comprehensive tarot readings with deep research and poetic delivery
 */

export interface TarotCard {
  id: string
  name: string
  nameEn: string
  suit?: string
  number?: number
  description: string
  keywords: string[]
  upright: string[]
  reversed: string[]
  imagery: string
}

export interface CustomerQuery {
  question: string
  cards: TarotCard[]
  spread: string
  mood?: string
  context?: string
  language: 'zh' | 'en' | 'ja'
  customerBackground?: {
    age?: number
    gender?: string
    lifeStage?: string
    concerns?: string[]
  }
}

export interface MonicaResponse {
  stage: 'research' | 'combination' | 'final'
  model: string
  content: string
  confidence: number
  processingTime: number
}

export interface OrchestrationResult {
  finalReading: string
  researchData: MonicaResponse
  combinationData: MonicaResponse
  poeticResponse: MonicaResponse
  totalProcessingTime: number
  confidence: number
  mood: string
  energyReading: string
}

class MonicaAIOrchestrator {
  private monicaApiKey: string | null = null
  private baseUrl = 'https://openapi.monica.im'
  private requestTimeout = 45000 // 45 seconds for complex queries

  // Available working models through Monica (verified)
  private models = {
    deepseek: 'deepseek-chat',  // Working DeepSeek model for research
    gemini: 'gemini-1.5-pro',   // Working Gemini model for analysis
    chatgpt5: 'gpt-4o',        // Working GPT-4o for poetry
    claude: 'claude-3-5-sonnet-20241022',  // Working Claude for backup
    llama: 'llama-3.1-405b-instruct',      // Working Llama for diversity
    gpt4omini: 'gpt-4o-mini'   // Working efficient GPT model
  }

  async initialize(): Promise<void> {
    this.monicaApiKey = 'demo-key'
    console.log('Monica AI initialized in demo mode')
  }

  /**
   * Master orchestration method - coordinates all AI models
   */
  async orchestrateReading(query: CustomerQuery): Promise<OrchestrationResult> {
    const startTime = Date.now()
    
    try {
      // Stage 1: Research with DeepSeek Chat
      console.log('🌊 Stage 1: Deep research of tarot symbolism with DeepSeek Chat...')
      const researchData = await this.researchWithDeepSeek(query)
      
      // Stage 2: Combine data with Gemini
      console.log('🧠 Stage 2: Analyzing and combining data with Gemini...')
      const combinationData = await this.combineWithGemini(query, researchData)
      
      // Stage 3: Final poetic response with ChatGPT-5
      console.log('🎭 Stage 3: Creating poetic reading with ChatGPT-5...')
      const poeticResponse = await this.createPoeticReading(query, researchData, combinationData)
      
      const totalTime = Date.now() - startTime
      
      // Extract mood and energy from the final response
      const { mood, energyReading } = this.extractMoodAndEnergy(poeticResponse.content)
      
      return {
        finalReading: poeticResponse.content,
        researchData,
        combinationData,
        poeticResponse,
        totalProcessingTime: totalTime,
        confidence: (researchData.confidence + combinationData.confidence + poeticResponse.confidence) / 3,
        mood,
        energyReading
      }
    } catch (error) {
      console.error('Monica AI Orchestration failed:', error)
      throw new Error(`AI Orchestration failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Stage 1: Deep research of tarot meanings and symbolism with DeepSeek
   */
  private async researchWithDeepSeek(query: CustomerQuery): Promise<MonicaResponse> {
    const startTime = Date.now()
    
    const cardNames = query.cards.map(card => `${card.name} (${card.nameEn})`).join(', ')
    
    const researchPrompt = `As a master tarot scholar with deep analytical capabilities, please provide comprehensive research on these specific tarot cards and their profound meanings in the context of the question: "${query.question}"

Cards to analyze: ${cardNames}
Spread type: ${query.spread}

Please provide deep analysis on:
1. Historical origins and symbolic foundations of each card
2. Psychological archetypes and modern interpretations
3. Synergistic meanings when these cards appear together
4. Cross-cultural perspectives (Western, Eastern, mystical traditions)
5. Numerological and astrological correspondences
6. Practical applications to the specific question asked
7. Advanced symbolic connections and hidden meanings

Draw upon classical tarot scholarship, Jungian psychology, comparative mythology, and contemporary spiritual understanding. Provide thorough, scholarly insights that bridge ancient wisdom with modern understanding.`

    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.monicaApiKey}`
        },
        body: JSON.stringify({
          model: this.models.deepseek,
          messages: [
            {
              role: 'system',
              content: 'You are DeepSeek Chat, an advanced AI with exceptional analytical depth and scholarly research capabilities. You excel at comprehensive tarot analysis, drawing connections between symbols, archetypes, and meanings across multiple traditions and time periods.'
            },
            {
              role: 'user',
              content: researchPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1500,
          timeout: this.requestTimeout
        })
      })

      if (!response.ok) {
        throw new Error(`DeepSeek API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      
      return {
        stage: 'research',
        model: this.models.deepseek,
        content,
        confidence: this.calculateConfidence(content, 'research'),
        processingTime: Date.now() - startTime
      }
    } catch (error) {
      console.error('DeepSeek research failed:', error)
      throw new Error(`Research stage failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Stage 2: Analyze and combine data with Gemini
   */
  private async combineWithGemini(query: CustomerQuery, researchData: MonicaResponse): Promise<MonicaResponse> {
    const startTime = Date.now()
    
    const combinationPrompt = `You are an advanced AI analyst specializing in tarot interpretation. Your task is to synthesize research data with the customer's specific situation and create a comprehensive analysis.

CUSTOMER QUERY:
Question: "${query.question}"
Cards: ${query.cards.map(card => `${card.name} (${card.description})`).join('\n')}
Spread: ${query.spread}
Language: ${query.language}
${query.customerBackground ? `Customer Background: ${JSON.stringify(query.customerBackground)}` : ''}

RESEARCH DATA FROM PERPLEXITY:
${researchData.content}

Your analysis should:
1. Connect the research findings directly to the customer's question
2. Identify the most relevant interpretations for their situation
3. Analyze card combinations and their synergistic meanings
4. Consider the customer's emotional state and life context
5. Synthesize contradictions or complex meanings
6. Prepare insights for the final poetic interpretation

Provide a structured analysis that bridges academic knowledge with personal relevance. Focus on actionable insights and emotional resonance.`

    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.monicaApiKey}`
        },
        body: JSON.stringify({
          model: this.models.gemini,
          messages: [
            {
              role: 'system',
              content: 'You are Gemini, an advanced AI with exceptional analytical and synthesis capabilities. You excel at combining complex information and finding meaningful patterns that resonate with human experience.'
            },
            {
              role: 'user',
              content: combinationPrompt
            }
          ],
          temperature: 0.6,
          max_tokens: 2000,
          timeout: this.requestTimeout
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      
      return {
        stage: 'combination',
        model: this.models.gemini,
        content,
        confidence: this.calculateConfidence(content, 'combination'),
        processingTime: Date.now() - startTime
      }
    } catch (error) {
      console.error('Gemini combination failed:', error)
      throw new Error(`Combination stage failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Stage 3: Create final poetic reading with ChatGPT-5
   */
  private async createPoeticReading(
    query: CustomerQuery, 
    researchData: MonicaResponse, 
    combinationData: MonicaResponse
  ): Promise<MonicaResponse> {
    const startTime = Date.now()
    
    const poeticPrompt = `You are the legendary Night God Tarot Master, a mystical oracle who speaks in beautiful, profound poetry while delivering practical wisdom. You have access to deep research and analytical insights, which you now transform into an enchanting, personalized reading.

CUSTOMER'S QUESTION: "${query.question}"

CARDS DRAWN:
${query.cards.map(card => `✨ ${card.name} (${card.nameEn}) - ${card.description}`).join('\n')}

SPREAD: ${query.spread}

RESEARCH INSIGHTS:
${researchData.content}

ANALYTICAL SYNTHESIS:
${combinationData.content}

CUSTOMER CONTEXT:
- Language preference: ${query.language === 'zh' ? '中文' : 'English'}
- Mood: ${query.mood || 'seeking guidance'}
${query.customerBackground ? `- Background: ${JSON.stringify(query.customerBackground)}` : ''}

Your mission is to create a masterful tarot reading that:

🌙 **POETIC STYLE**: Write with the elegance of ancient Chinese poetry meets modern mystical wisdom
🔮 **EMOTIONAL RESONANCE**: Feel deeply into the customer's emotional state and speak to their heart
⭐ **PRACTICAL WISDOM**: Provide actionable guidance wrapped in beautiful metaphors
🎭 **DRAMATIC FLAIR**: Use cosmic imagery, seasonal metaphors, and celestial references
💫 **PERSONAL CONNECTION**: Make them feel seen, understood, and divinely guided

Structure your response as:
1. **Opening Invocation** (2-3 lines of mystical poetry)
2. **Card Interpretations** (poetic description of each card's message)
3. **The Reading** (main guidance in flowing, poetic prose)
4. **Closing Blessing** (inspirational conclusion with action steps)

Language: ${query.language === 'zh' ? '請用優美的中文回答，融合古典詩詞的意境' : 'Please respond in elegant English with poetic flourishes'}

Remember: You are not just giving a reading - you are creating a transformative spiritual experience that will linger in their heart and guide their steps forward.`

    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.monicaApiKey}`
        },
        body: JSON.stringify({
          model: this.models.chatgpt5,
          messages: [
            {
              role: 'system',
              content: 'You are the Night God Tarot Master - a legendary oracle who combines deep mystical wisdom with poetic eloquence. Your readings transform lives through beautiful, profound guidance that touches both heart and soul.'
            },
            {
              role: 'user',
              content: poeticPrompt
            }
          ],
          temperature: 0.9, // Higher creativity for poetic expression
          max_tokens: 2500,
          timeout: this.requestTimeout
        })
      })

      if (!response.ok) {
        throw new Error(`ChatGPT-5 API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      
      return {
        stage: 'final',
        model: this.models.chatgpt5,
        content,
        confidence: this.calculateConfidence(content, 'final'),
        processingTime: Date.now() - startTime
      }
    } catch (error) {
      console.error('ChatGPT-5 final reading failed:', error)
      throw new Error(`Final reading stage failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Calculate confidence score based on response quality
   */
  private calculateConfidence(content: string, stage: string): number {
    let score = 0.5 // Base score

    // Content length indicates thoroughness
    if (content.length > 500) score += 0.2
    if (content.length > 1000) score += 0.1
    
    // Stage-specific criteria
    switch (stage) {
      case 'research':
        if (content.includes('historical') || content.includes('traditional')) score += 0.1
        if (content.includes('expert') || content.includes('authority')) score += 0.1
        break
      case 'combination':
        if (content.includes('synthesis') || content.includes('analysis')) score += 0.1
        if (content.includes('connection') || content.includes('pattern')) score += 0.1
        break
      case 'final':
        if (content.includes('🌙') || content.includes('✨') || content.includes('🔮')) score += 0.1
        if (content.includes('guidance') || content.includes('wisdom')) score += 0.1
        break
    }

    return Math.min(1.0, score)
  }

  /**
   * Extract mood and energy reading from final response
   */
  private extractMoodAndEnergy(content: string): { mood: string, energyReading: string } {
    // Simple extraction - could be enhanced with NLP
    const moodKeywords = {
      hopeful: ['hope', 'optimism', 'bright', 'positive', '希望', '樂觀'],
      contemplative: ['reflect', 'ponder', 'meditation', 'introspect', '反思', '沉思'],
      transformative: ['change', 'transform', 'renewal', 'rebirth', '轉變', '蛻變'],
      peaceful: ['calm', 'serenity', 'peace', 'harmony', '平靜', '和諧'],
      empowered: ['strength', 'power', 'confidence', 'courage', '力量', '勇氣']
    }

    let detectedMood = 'mystical'
    let moodScore = 0

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (content.toLowerCase().includes(keyword.toLowerCase()) ? 1 : 0)
      }, 0)
      
      if (score > moodScore) {
        moodScore = score
        detectedMood = mood
      }
    }

    // Extract a key phrase for energy reading
    const sentences = content.split(/[.!?。！？]/)
    const energyReading = sentences.find(s => 
      s.includes('energy') || s.includes('力量') || s.includes('能量') || 
      s.includes('cosmic') || s.includes('universe') || s.includes('宇宙')
    ) || '宇宙能量正在為你的旅程注入神聖的指引'

    return {
      mood: detectedMood,
      energyReading: energyReading.trim()
    }
  }

  /**
   * Health check for all AI models
   */
  async healthCheck(): Promise<{ [key: string]: boolean }> {
    const results: { [key: string]: boolean } = {}
    
    for (const [name, model] of Object.entries(this.models)) {
      try {
        const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.monicaApiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: 'Hello' }],
            max_tokens: 10
          })
        })
        
        results[name] = response.ok
      } catch {
        results[name] = false
      }
    }
    
    return results
  }

  /**
   * Get available models and their capabilities
   */
  getModelCapabilities() {
    return {
      deepseek: {
        name: 'DeepSeek Chat',
        purpose: 'Deep analytical research and comprehensive analysis',
        strengths: ['Analytical depth', 'Scholarly research', 'Complex reasoning', 'Symbolic analysis'],
        stage: 1
      },
      gemini: {
        name: 'Gemini 1.5 Pro',
        purpose: 'Advanced analysis and synthesis',
        strengths: ['Pattern recognition', 'Complex reasoning', 'Data combination'],
        stage: 2
      },
      chatgpt5: {
        name: 'GPT-4o (Latest ChatGPT)',
        purpose: 'Creative and poetic final response',
        strengths: ['Creative writing', 'Emotional intelligence', 'Personalization'],
        stage: 3
      }
    }
  }
}

export const monicaOrchestrator = new MonicaAIOrchestrator()