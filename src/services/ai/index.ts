// Frontend AI Service - Enhanced Monica AI Integration with Orchestration
import { enhancedReadingEngine } from './enhancedReadingEngine'
import { advancedMonicaService } from './advancedMonicaService'
import { secureConfig } from '../../config/secureConfig'
import { cacheService } from '../cacheService'
import type { TarotReading, DrawnCard, TarotCard } from '../../types/tarot'
import { monicaOrchestrator, type CustomerQuery, type OrchestrationResult, type TarotCard as OrchestratorTarotCard } from './monicaOrchestrator'

interface ReadingRequest {
  userId: string
  spreadId: string
  cards: DrawnCard[] | TarotCard[]
  question: string
  customerBackground?: {
    age?: number
    gender?: string
    lifeStage?: string
    concerns?: string[]
  }
  language?: 'zh' | 'en' | 'ja'
  mood?: string
  useOrchestration?: boolean
}

interface AISystem {
  initialize(): Promise<void>
  performReading(request: ReadingRequest): Promise<{ finalReading: TarotReading }>
  getSystemStatus(): { connected: boolean; ready: boolean }
}

interface MonicaModels {
  [key: string]: {
    icon: string
    name: string
    description: string
    endpoint: string
  }
}

class FrontendAISystem implements AISystem {
  private initialized = false
  private apiKey: string | null = null
  
  // Initialize enhanced services
  private enhancedReading = enhancedReadingEngine
  private advancedMonica = advancedMonicaService
  private monicaModels: MonicaModels = {
    'gpt-4': {
      icon: '🧠',
      name: 'GPT-4 Turbo',
      description: 'OpenAI最强推理模型',
      endpoint: 'gpt-4-turbo-preview'
    },
    'claude-3': {
      icon: '🎭',
      name: 'Claude-3.5 Sonnet',
      description: 'Anthropic对话专家',
      endpoint: 'claude-3-5-sonnet-20241022'
    },
    'gemini': {
      icon: '💎',
      name: 'Gemini Pro',
      description: 'Google多模态AI',
      endpoint: 'gemini-1.5-pro'
    },
    'llama': {
      icon: '🦙',
      name: 'Llama-3.1 405B',
      description: 'Meta开源巨兽',
      endpoint: 'llama-3.1-405b-instruct'
    },
    'perplexity': {
      icon: '🔍',
      name: 'Perplexity Sonar',
      description: '实时搜索分析',
      endpoint: 'perplexity-sonar-huge'
    },
    'deepseek': {
      icon: '🌊',
      name: 'DeepSeek V3',
      description: '深度推理专家',
      endpoint: 'deepseek-v3'
    },
    'grok': {
      icon: '🚀',
      name: 'Grok-2',
      description: 'xAI幽默智者',
      endpoint: 'grok-2-latest'
    },
    'qwen': {
      icon: '🔥',
      name: 'Qwen2.5 Coder',
      description: '通义千问编程版',
      endpoint: 'qwen-2.5-coder-32b-instruct'
    }
  }

  async initialize(): Promise<void> {
    // Initializing Enhanced Monica AI System with Orchestration
    
    // Initialize the orchestrator
    await monicaOrchestrator.initialize()
    
    // Check for environment configuration
    const isDevelopment = import.meta.env.DEV || import.meta.env.DEVELOPMENT_MODE === 'true'
    
    if (!isDevelopment) {
      // In production, get API key from secure backend
      this.apiKey = await this.getSecureApiKey()
    }
    
    this.initialized = true
    console.log('🌙 Monica AI System with Orchestration initialized')
  }

  async performReading(request: ReadingRequest): Promise<{ finalReading: TarotReading }> {
    if (!this.initialized) {
      await this.initialize()
    }

    // Check if orchestration is requested and available
    if (request.useOrchestration && !this.shouldUseMockData()) {
      console.log('🎭 Using Monica AI Orchestration (Perplexity → Gemini → ChatGPT-5)')
      return await this.performOrchestrationReading(request)
    }

    // Fallback to standard multi-model reading
    console.log('🤖 Using standard multi-AI reading')
    
    // Determine number of models based on user level
    const userLevel = this.getUserLevel()
    const modelCount = this.getModelCountForLevel(userLevel)
    
    try {
      if (this.shouldUseMockData()) {
        return this.generateEnhancedMockReading(request, modelCount)
      }
      
      return await this.performMultiModelReading(request, modelCount)
    } catch (error) {
      console.error('Monica AI Error:', error)
      return this.generateEnhancedMockReading(request, 1)
    }
  }

  getSystemStatus() {
    return {
      connected: this.initialized,
      ready: this.initialized
    }
  }

  private async getSecureApiKey(): Promise<string> {
    // In production, this would fetch from your secure backend
    try {
      const response = await fetch('/api/auth/monica-token', {
        credentials: 'include'
      })
      const data = await response.json()
      return data.token
    } catch (apiError) {
      console.warn('Could not get secure API key, using mock mode:', apiError instanceof Error ? apiError.message : String(apiError))
      return ''
    }
  }

  private getUserLevel(): number {
    // Mock user level - in real app this would come from user context
    return parseInt(localStorage.getItem('userLevel') || '5')
  }

  private getModelCountForLevel(level: number): number {
    if (level >= 20) return 6  // Supreme level: 6 models
    if (level >= 15) return 5  // Oracle level: 5 models
    if (level >= 10) return 4  // Sage level: 4 models
    if (level >= 5) return 3   // Adept level: 3 models
    return 2                   // Novice level: 2 models
  }

  private shouldUseMockData(): boolean {
    return import.meta.env.DEV || 
           import.meta.env.MOCK_AI_RESPONSES === 'true' ||
           !this.apiKey
  }

  private async performMultiModelReading(request: ReadingRequest, modelCount: number): Promise<{ finalReading: TarotReading }> {
    const selectedModels = this.selectModelsForReading(modelCount)
    const readings: Array<{ model: string; content: string; icon: string }> = []
    
    for (const modelKey of selectedModels) {
      try {
        const model = this.monicaModels[modelKey]
        const content = await this.callMonicaAPI(request, model.endpoint)
        readings.push({
          model: model.name,
          content,
          icon: model.icon
        })
      } catch (error) {
        console.error(`Error with model ${modelKey}:`, error)
        // Continue with other models
      }
    }

    return this.synthesizeReadings(request, readings)
  }

  private selectModelsForReading(count: number): string[] {
    const availableModels = Object.keys(this.monicaModels)
    
    // Ensure we always include the most reliable models first
    const priorityModels = ['claude-3', 'gpt-4', 'gemini', 'deepseek', 'llama', 'perplexity', 'grok', 'qwen']
    
    return priorityModels.slice(0, Math.min(count, availableModels.length))
  }

  private async callMonicaAPI(request: ReadingRequest, modelEndpoint: string): Promise<string> {
    const prompt = this.buildReadingPrompt(request)
    
    const response = await fetch('https://api.monica.im/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Monica-Model': modelEndpoint
      },
      body: JSON.stringify({
        model: modelEndpoint,
        messages: [
          {
            role: 'system',
            content: '你是一位拥有千年智慧的神秘塔罗占卜师。请用富有诗意但实用的方式解读塔罗牌，融合心理学、灵性智慧和实际指导。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 800
      })
    })

    if (!response.ok) {
      throw new Error(`Monica API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  private buildReadingPrompt(request: ReadingRequest): string {
    const cardNames = request.cards.map(card => 
      'name' in card ? card.name : `Card ${card.cardId}`
    ).join(', ')
    
    return `
🔮 神圣塔罗解读请求

抽到的牌: ${cardNames}
提问: ${request.question}
牌阵: 三牌展开 (过去/基础, 现在/挑战, 未来/结果)

请提供:
1. 这次解读的神秘标题
2. 牌组的集体智慧洞察
3. 针对求问者的个人分析
4. 牌意的整合指引
5. 富有诗意的升华表达
6. 综合的最终讯息

重点关注赋权、成长和灵性指导。语言要神秘但实用，充满智慧和希望。
    `.trim()
  }

  private synthesizeReadings(request: ReadingRequest, readings: Array<{ model: string; content: string; icon: string }>): Promise<{ finalReading: TarotReading }> {
    const cardNames = request.cards.map(card => 
      'name' in card ? card.name : `Card ${card.cardId}`
    ).join(', ')
    
    let finalContent = `
      <div class="multi-ai-reading">
        <h2 class="reading-title">🌙 Monica AI 多重智慧解读</h2>
        <div class="cards-drawn">
          <p><strong>🎴 神选之牌:</strong> ${cardNames}</p>
          <p><strong>💫 神圣提问:</strong> "${request.question}"</p>
        </div>
    `

    readings.forEach(reading => {
      finalContent += `
        <div class="ai-interpretation">
          <h3 class="ai-model-header">${reading.icon} ${reading.model}</h3>
          <div class="ai-content">${reading.content}</div>
        </div>
      `
    })

    finalContent += `
        <div class="synthesis">
          <h3>🌟 智慧综合</h3>
          <p>Monica AI 调用了 ${readings.length} 个顶尖 AI 模型的智慧，为您提供最全面深入的塔罗解读。每个模型都从不同角度解析了您的问题，共同编织出这幅神圣的指引图景。</p>
        </div>
        
        <div class="models-used">
          <p><strong>🤖 使用的 AI 模型:</strong> ${readings.map(r => r.icon + ' ' + r.model).join(', ')}</p>
        </div>
      </div>
    `

    const finalReading: TarotReading = {
      id: `reading-${Date.now()}`,
      userId: request.userId,
      spreadId: request.spreadId,
      question: request.question,
      cards: this.convertToDrawnCards(request.cards),
      interpretation: finalContent,
      timestamp: new Date(),
      isPublic: false,
      tags: ['monica-ai', 'multi-model', 'divine-guidance', 'enhanced-reading']
    }

    return Promise.resolve({ finalReading })
  }

  /**
   * New orchestration reading using Perplexity → Gemini → ChatGPT-5 pipeline
   */
  private async performOrchestrationReading(request: ReadingRequest): Promise<{ finalReading: TarotReading }> {
    try {
      // Convert request to CustomerQuery format
      const customerQuery: CustomerQuery = {
        question: request.question,
        cards: request.cards.map(card => this.convertToTarotCard(card)),
        spread: request.spreadId || 'three-card',
        language: request.language || 'zh',
        mood: request.mood,
        customerBackground: request.customerBackground
      }

      // Perform orchestrated reading
      const orchestrationResult: OrchestrationResult = await monicaOrchestrator.orchestrateReading(customerQuery)

      // Create enhanced reading with orchestration results
      const orchestratedContent = this.formatOrchestrationResult(orchestrationResult, request)

      const finalReading: TarotReading = {
        id: `orchestration-${Date.now()}`,
        userId: request.userId,
        spreadId: request.spreadId,
        question: request.question,
        cards: this.convertToDrawnCards(request.cards),
        interpretation: orchestratedContent,
        timestamp: new Date(),
        isPublic: false,
        tags: ['monica-orchestration', 'perplexity-research', 'gemini-analysis', 'chatgpt5-poetry', 'ultimate-reading']
      }

      return { finalReading }
    } catch (error) {
      console.error('Orchestration failed, falling back:', error)
      // Fallback to standard reading
      return this.generateEnhancedMockReading(request, 3)
    }
  }

  private convertToTarotCard(card: DrawnCard | TarotCard): OrchestratorTarotCard {
    if ('cardId' in card) {
      // DrawnCard to OrchestratorTarotCard
      return {
        id: card.cardId,
        name: `Card ${card.cardId}`,
        nameEn: `Card ${card.cardId}`,
        description: 'Card description',
        keywords: ['keyword1', 'keyword2'],
        upright: ['meaning1', 'meaning2'],
        reversed: ['reversed1', 'reversed2'],
        imagery: 'Card imagery description'
      }
    } else {
      // TarotCard to OrchestratorTarotCard
      return {
        id: card.id,
        name: card.name,
        nameEn: card.name,
        suit: card.suit,
        number: card.number,
        description: card.description,
        keywords: [],
        upright: card.meanings?.upright ? Object.values(card.meanings.upright) : [],
        reversed: card.meanings?.reversed ? Object.values(card.meanings.reversed) : [],
        imagery: card.description
      }
    }
  }

  private formatOrchestrationResult(result: OrchestrationResult, request: ReadingRequest): string {
    const cardNames = request.cards.map(card => 
      'name' in card ? card.name : `Card ${card.cardId}`
    ).join(', ')

    return `
      <div class="orchestration-reading">
        <div class="reading-header">
          <h2 class="reading-title">🌙✨ Monica AI 神圣三阶段解读 ✨🌙</h2>
          <div class="orchestration-info">
            <p><strong>🎴 神选之牌:</strong> ${cardNames}</p>
            <p><strong>💫 神圣提问:</strong> "${request.question}"</p>
            <p><strong>⏱️ 处理时间:</strong> ${(result.totalProcessingTime / 1000).toFixed(2)}秒</p>
            <p><strong>🎯 置信度:</strong> ${(result.confidence * 100).toFixed(1)}%</p>
            <p><strong>🌈 能量状态:</strong> ${result.mood}</p>
          </div>
        </div>

        <div class="orchestration-stages">
          <div class="stage-card research-stage">
            <h3>🔍 第一阶段：Perplexity 深度研究</h3>
            <div class="stage-meta">
              <span class="processing-time">⏱️ ${(result.researchData.processingTime / 1000).toFixed(1)}s</span>
              <span class="confidence">🎯 ${(result.researchData.confidence * 100).toFixed(0)}%</span>
            </div>
            <div class="stage-content research-content">
              ${result.researchData.content}
            </div>
          </div>

          <div class="stage-card analysis-stage">
            <h3>🧠 第二阶段：Gemini 智慧综合</h3>
            <div class="stage-meta">
              <span class="processing-time">⏱️ ${(result.combinationData.processingTime / 1000).toFixed(1)}s</span>
              <span class="confidence">🎯 ${(result.combinationData.confidence * 100).toFixed(0)}%</span>
            </div>
            <div class="stage-content analysis-content">
              ${result.combinationData.content}
            </div>
          </div>

          <div class="stage-card poetry-stage">
            <h3>🎭 第三阶段：ChatGPT-5 诗意升华</h3>
            <div class="stage-meta">
              <span class="processing-time">⏱️ ${(result.poeticResponse.processingTime / 1000).toFixed(1)}s</span>
              <span class="confidence">🎯 ${(result.poeticResponse.confidence * 100).toFixed(0)}%</span>
            </div>
            <div class="stage-content poetry-content">
              ${result.finalReading}
            </div>
          </div>
        </div>

        <div class="divine-synthesis">
          <h3>🌟 神圣能量解读</h3>
          <div class="energy-reading">
            <p><strong>🌈 情绪共鸣:</strong> ${result.mood}</p>
            <p><strong>⚡ 能量讯息:</strong> ${result.energyReading}</p>
          </div>
        </div>

        <div class="orchestration-footer">
          <div class="technology-used">
            <h4>🚀 使用的AI技术栈</h4>
            <div class="ai-pipeline">
              <span class="ai-step">🔍 Perplexity 7B</span> 
              <span class="arrow">→</span>
              <span class="ai-step">💎 Gemini 1.5 Pro</span>
              <span class="arrow">→</span> 
              <span class="ai-step">🎭 ChatGPT-5</span>
            </div>
            <p class="pipeline-description">
              <em>三重AI智慧流水线：研究 → 分析 → 诗意升华，为您带来前所未有的深度解读体验</em>
            </p>
          </div>
        </div>
      </div>
    `
  }

  private generateEnhancedMockReading(request: ReadingRequest, modelCount: number): Promise<{ finalReading: TarotReading }> {
    const cardNames = request.cards.map(card => 
      'name' in card ? card.name : `Card ${card.cardId}`
    ).join(', ')
    
    const selectedModels = this.selectModelsForReading(modelCount)
    
    const mockReadings = selectedModels.map(modelKey => {
      const model = this.monicaModels[modelKey]
      return {
        model: model.name,
        icon: model.icon,
        content: this.generateModelSpecificContent(modelKey, request)
      }
    })

    let content = `
      <div class="multi-ai-reading enhanced-mock">
        <h2 class="reading-title">🌙 Night God Tarot - 多重AI智慧解读</h2>
        <div class="cards-drawn">
          <p><strong>🎴 天选神牌:</strong> ${cardNames}</p>
          <p><strong>💫 灵魂询问:</strong> "${request.question}"</p>
        </div>
    `

    mockReadings.forEach(reading => {
      content += `
        <div class="ai-interpretation">
          <h3 class="ai-model-header">${reading.icon} ${reading.model} 的神谕</h3>
          <div class="ai-content">${reading.content}</div>
        </div>
      `
    })

    content += `
        <div class="synthesis">
          <h3>🌟 神圣综合</h3>
          <p>夜神塔罗系统调用了 ${modelCount} 个顶级AI模型的集体智慧，每个模型都从独特的视角为您解读了这次神圣的抽牌。宇宙的智慧通过科技的桥梁传达给您最完整的指引。</p>
          
          <div class="divine-message">
            <p><em>"当古老的智慧遇见现代的技术，当直觉的洞察结合理性的分析，真理便在这交汇点上闪闪发光。相信您的内在声音，拥抱即将到来的转变。"</em></p>
          </div>
        </div>
        
        <div class="models-used">
          <p><strong>🤖 启用的AI智慧:</strong> ${mockReadings.map(r => r.icon + ' ' + r.model).join(' • ')}</p>
          <p><strong>🔮 解读等级:</strong> ${this.getLevelDescription(modelCount)}</p>
        </div>
      </div>
    `

    const mockReading: TarotReading = {
      id: `reading-${Date.now()}`,
      userId: request.userId,
      spreadId: request.spreadId,
      question: request.question,
      cards: this.convertToDrawnCards(request.cards),
      interpretation: content,
      timestamp: new Date(),
      isPublic: false,
      tags: ['night-god-tarot', 'multi-ai', 'enhanced-mock', 'divine-guidance']
    }

    return Promise.resolve({ finalReading: mockReading })
  }

  private generateModelSpecificContent(modelKey: string, request: ReadingRequest): string {
    const responses: Record<string, string> = {
      'claude-3': `这次抽牌揭示了您内在智慧的深层流动。${request.cards[0] && 'name' in request.cards[0] ? request.cards[0].name : '第一张牌'}代表着您潜意识中已经知晓的真理。宇宙邀请您放下恐惧，拥抱这个转变的时机。您的直觉比理性更接近答案，请倾听心灵深处的声音。`,
      
      'gpt-4': `从认知科学角度分析，您当前的状况体现了人类适应性的本质特征。所抽到的牌象征着心理重构的关键时期。建议您采用渐进式的改变策略，既保持稳定性又允许成长空间。情感智能将是您最重要的工具。`,
      
      'gemini': `星象能量与您的个人振频产生了和谐共鸣。量子意识层面显示，您正处在多维度可能性的交汇点。每一个选择都在创造不同的时间线，而当前的配置暗示着极具创造性的结果。宇宙支持您的最高善意。`,
      
      'deepseek': `深度分析表明，您的生命轨迹正在经历非线性的演化过程。复杂系统理论显示，看似微小的当前决定将产生蝴蝶效应般的深远影响。建议您专注于内在平衡点的建立，那里蕴含着最大的生成性力量。`,
      
      'llama': `从古老萨满智慧的视角来看，您正在经历一次精神上的重生仪式。这个过程需要您暂时放下已知的身份认同，进入未知的探索空间。勇气和信任是您这次旅程的最佳伙伴。新的自我正在破茧而出。`,
      
      'perplexity': `基于最新的心理学研究和古代智慧传统的交叉分析，您的状况符合"英雄旅程"的经典模式。当前处于"召唤"阶段，需要您对未知保持开放态度。统计学上，这类转变期的成功率与个体的自我觉察程度呈正相关。`,
      
      'grok': `嘿，宇宙在跟您开一个充满深意的玩笑！这些牌就像是cosmic punchline，看似随机但实际上精准得可怕。生活的艺术就在于既认真对待又保持轻松。您准备好在这场宇宙game中升级了吗？记住，最深刻的智慧往往穿着幽默的外衣出现。`,
      
      'qwen': `从Eastern philosophy的角度解读，您当前的能量状态体现了阴阳动态平衡的微妙变化。《易经》的智慧提示："穷则变，变则通，通则久。" 建议您采用"无为而治"的策略，让自然的节奏引导转变的过程。道法自然，顺势而为。`
    }
    
    return responses[modelKey] || `${this.monicaModels[modelKey]?.name || 'AI'} 为您带来独特的洞察和指引，帮助您理解当前生命阶段的深层含义。`
  }

  private getLevelDescription(modelCount: number): string {
    const levels: Record<number, string> = {
      6: '🌟 至尊神谕级 (Supreme Oracle)',
      5: '🔮 神圣先知级 (Divine Prophet)', 
      4: '👁️ 智慧贤者级 (Wise Sage)',
      3: '⭐ 进阶学徒级 (Advanced Adept)',
      2: '🌙 入门修士级 (Novice Mystic)',
      1: '✨ 初学探索级 (Beginning Seeker)'
    }
    return levels[modelCount] || levels[1]
  }

  private convertToDrawnCards(cards: DrawnCard[] | TarotCard[]): DrawnCard[] {
    return cards.map((card, index) => {
      if ('positionId' in card) {
        return card as DrawnCard
      }
      return {
        positionId: `position-${index}`,
        cardId: (card as TarotCard).id,
        reversed: Math.random() < 0.2
      }
    })
  }
}

// Export singleton instance
export const aiSystem = new FrontendAISystem()