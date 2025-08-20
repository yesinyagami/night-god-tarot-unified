/**
 * News Service with Localized Content
 * Provides news relevant to user's location and interests
 */

interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: NewsAPIArticle[]
}

interface NewsAPIArticle {
  title: string
  description: string | null
  content: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  source: {
    id: string | null
    name: string
  }
}

export interface NewsArticle {
  id: string
  title: string
  description: string
  content: string
  url: string
  urlToImage: string | null
  publishedAt: Date
  source: {
    id: string
    name: string
  }
  category: string
  country: string
  language: string
  relevanceScore?: number
}

export interface NewsResponse {
  articles: NewsArticle[]
  totalResults: number
  lastUpdated: Date
  location: string
  category: string
}

export interface TarotNewsInterpretation {
  headline: string
  mysticalInsight: string
  cardConnection: string
  energyReading: string
  guidanceMessage: string
}

class NewsService {
  private apiKey: string | null = null
  private monicaApiKey: string | null = null
  private lastNewsUpdate: Date | null = null
  private cachedNews = new Map<string, NewsResponse>()
  private cacheTimeout = 15 * 60 * 1000 // 15 minutes

  async initialize(): Promise<void> {
    this.apiKey = import.meta.env.VITE_NEWS_API_KEY || 
                  await this.getSecureApiKey('news')
                  
    // Initialize Monica AI integration for news interpretations
    this.monicaApiKey = import.meta.env.VITE_MONICA_API_KEY || 
                       await this.getSecureApiKey('monica')
  }

  async getLocalizedNews(category: string = 'general', pageSize: number = 10): Promise<NewsResponse> {
    const cacheKey = `${category}-${pageSize}`
    
    // Check cache first
    if (this.cachedNews.has(cacheKey)) {
      const cached = this.cachedNews.get(cacheKey)!
      const timeSinceUpdate = Date.now() - cached.lastUpdated.getTime()
      if (timeSinceUpdate < this.cacheTimeout) {
        return cached
      }
    }

    try {
      // Get user's country for localized news
      const userLocation = await this.getUserLocation()
      
      // Fetch news from multiple sources
      const [generalNews, localNews] = await Promise.all([
        this.fetchNewsFromAPI('general', userLocation.country, pageSize),
        this.fetchLocalNews(userLocation.country, pageSize / 2)
      ])

      // Combine and process news
      const allArticles = [...generalNews.articles, ...localNews.articles]
      const processedArticles = this.processAndRankArticles(allArticles, userLocation)

      const newsResponse: NewsResponse = {
        articles: processedArticles.slice(0, pageSize),
        totalResults: processedArticles.length,
        lastUpdated: new Date(),
        location: `${userLocation.city}, ${userLocation.country}`,
        category
      }

      // Cache the result
      this.cachedNews.set(cacheKey, newsResponse)
      
      return newsResponse
    } catch (error) {
      console.error('News service error:', error)
      return this.getFallbackNews(category)
    }
  }

  async getTarotNewsInterpretation(articles: NewsArticle[]): Promise<TarotNewsInterpretation[]> {
    const topArticles = articles.slice(0, 3)
    
    if (this.monicaApiKey) {
      try {
        // Use Monica AI for enhanced interpretations
        const aiInterpretations = await Promise.all(
          topArticles.map(article => this.getMonicaNewsInterpretation(article))
        )
        return aiInterpretations
      } catch (error) {
        console.warn('Monica news interpretation failed, using fallback:', error)
      }
    }
    
    // Fallback to basic interpretations
    return topArticles.map((article, index) => {
      return this.generateMysticalInterpretation(article, index)
    })
  }

  private async fetchNewsFromAPI(category: string, country: string, pageSize: number): Promise<{ articles: NewsArticle[] }> {
    if (!this.apiKey) {
      throw new Error('News API key not configured')
    }

    // Use NewsAPI.org
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${country.toLowerCase()}&category=${category}&pageSize=${pageSize}&apiKey=${this.apiKey}`
    )

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`)
    }

    const data: NewsAPIResponse = await response.json()
    
    return {
      articles: data.articles.map((article: NewsAPIArticle) => ({
        id: this.generateArticleId(article),
        title: article.title,
        description: article.description || '',
        content: article.content || '',
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: new Date(article.publishedAt),
        source: {
          id: article.source.id || 'unknown',
          name: article.source.name || 'Unknown Source'
        },
        category,
        country: country.toUpperCase(),
        language: this.getLanguageFromCountry(country)
      }))
    }
  }

  private async fetchLocalNews(country: string, pageSize: number): Promise<{ articles: NewsArticle[] }> {
    // Fetch news using alternative sources for better local coverage
    try {
      if (country.toLowerCase() === 'tw' || country.toLowerCase() === 'cn') {
        return await this.fetchAsianNews()
      } else {
        return await this.fetchGlobalNews(country, pageSize)
      }
    } catch (error) {
      console.warn('Local news fetch failed:', error)
      return { articles: [] }
    }
  }

  private async fetchAsianNews(): Promise<{ articles: NewsArticle[] }> {
    // For Taiwan/China, use specific sources or RSS feeds
    // This is a placeholder - you would implement specific sources

    const articles: NewsArticle[] = []
    
    // Simulate fetching from local sources
    // In a real implementation, you'd fetch from RSS feeds or other APIs
    
    return { articles }
  }

  private async fetchGlobalNews(country: string, pageSize: number): Promise<{ articles: NewsArticle[] }> {
    // Use alternative news sources for global news
    try {
      const response = await fetch(
        `https://api.currentsapi.services/v1/latest-news?country=${country}&apiKey=${this.apiKey}`
      )
      
      if (response.ok) {
        const data = await response.json()
        return {
          articles: data.news.slice(0, pageSize).map((article: NewsAPIArticle) => ({
            id: this.generateArticleId(article),
            title: article.title,
            description: article.description || '',
            content: article.description || '',
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: new Date(article.publishedAt),
            source: {
              id: 'currents-api',
              name: 'Currents API'
            },
            category: 'general',
            country: country.toUpperCase(),
            language: this.getLanguageFromCountry(country)
          }))
        }
      }
    } catch (error) {
      console.warn('Alternative news source failed:', error)
    }
    
    return { articles: [] }
  }

  private async getUserLocation(): Promise<{ city: string, country: string, latitude: number, longitude: number }> {
    try {
      // Reuse weather service location detection
      const response = await fetch('https://ipinfo.io/json')
      const data = await response.json()
      const [lat, lon] = data.loc.split(',')
      
      return {
        city: data.city,
        country: data.country,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
      }
    } catch {
      // Fallback to Taiwan
      return {
        city: 'Taipei',
        country: 'TW',
        latitude: 25.0330,
        longitude: 121.5654
      }
    }
  }

  private processAndRankArticles(articles: NewsArticle[], location: LocationInfo): NewsArticle[] {
    // Remove duplicates and rank by relevance
    const uniqueArticles = new Map<string, NewsArticle>()
    
    articles.forEach(article => {
      const key = article.title.toLowerCase().trim()
      if (!uniqueArticles.has(key)) {
        // Calculate relevance score
        article.relevanceScore = this.calculateRelevanceScore(article, location)
        uniqueArticles.set(key, article)
      }
    })

    // Sort by relevance score and recency
    return Array.from(uniqueArticles.values())
      .filter(article => article.title && article.description)
      .sort((a, b) => {
        const scoreA = (a.relevanceScore || 0) + this.getRecencyScore(a.publishedAt)
        const scoreB = (b.relevanceScore || 0) + this.getRecencyScore(b.publishedAt)
        return scoreB - scoreA
      })
  }

  private calculateRelevanceScore(article: NewsArticle, location: LocationInfo): number {
    let score = 0
    
    // Local relevance
    if (article.country === location.country) score += 10
    if (article.title.toLowerCase().includes(location.city.toLowerCase())) score += 15
    
    // Content quality
    if (article.description && article.description.length > 100) score += 5
    if (article.urlToImage) score += 3
    
    // Source reliability (you could maintain a list of trusted sources)
    const trustedSources = ['reuters', 'bbc', 'ap-news', 'cnn', 'liberty-times']
    if (trustedSources.some(source => 
      article.source.name.toLowerCase().includes(source) ||
      article.source.id.includes(source)
    )) {
      score += 8
    }
    
    return score
  }

  private getRecencyScore(publishedAt: Date): number {
    const hoursSincePublished = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60)
    
    if (hoursSincePublished < 1) return 10
    if (hoursSincePublished < 6) return 8
    if (hoursSincePublished < 24) return 5
    if (hoursSincePublished < 72) return 2
    return 0
  }

  // Monica AI news interpretation
  private async getMonicaNewsInterpretation(article: NewsArticle): Promise<TarotNewsInterpretation> {
    const prompt = `你是夜神塔羅的首席新聞靈性解讀師，擅長從時事新聞中發現深層的塔羅能量與靈性啟示。請為以下新聞提供神秘學解讀：

📰 新聞標題：${article.title}
📝 新聞描述：${article.description}
🗞️ 新聞來源：${article.source.name}
📅 發布時間：${article.publishedAt.toLocaleString('zh-TW')}
🏷️ 新聞分類：${article.category}

請提供完整的塔羅新聞解讀，包含：
1. mysticalInsight：80字內的靈性洞察，解讀此新聞的深層能量意義
2. cardConnection：指出此新聞與哪張塔羅牌能量最為相符，說明連結原因
3. energyReading：描述此新聞反映的當前宇宙能量流動
4. guidanceMessage：給讀者的個人靈性指引和行動建議

請用充滿智慧且實用的中文回答，融合古老塔羅智慧與現代理解。回答格式：
{
  "mysticalInsight": "...",
  "cardConnection": "...", 
  "energyReading": "...",
  "guidanceMessage": "..."
}`

    const response = await fetch('https://openapi.monica.im/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.monicaApiKey}`
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        messages: [
          {
            role: 'system',
            content: '你是夜神塔羅的首席新聞靈性解讀師，精通從時事新聞中發現塔羅能量與靈性啟示，提供深邃而實用的指引。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error(`Monica API Error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(aiResponse)
      return {
        headline: article.title,
        mysticalInsight: parsed.mysticalInsight || '宇宙正在為你揭示重要的訊息',
        cardConnection: parsed.cardConnection || '此新聞與隱者牌的能量共鳴',
        energyReading: parsed.energyReading || '當前的轉化能量特別強烈',
        guidanceMessage: parsed.guidanceMessage || '關注周圍發生的事件，它們可能包含著對你個人旅程的重要啟示'
      }
    } catch {
      // If not JSON, extract content manually
      return {
        headline: article.title,
        mysticalInsight: aiResponse.slice(0, 150) + '...',
        cardConnection: '此新聞與當前宇宙能量流動密切相關',
        energyReading: '深層的靈性訊息正在透過這則新聞傳達',
        guidanceMessage: '保持覺察，從日常事件中汲取智慧與指引'
      }
    }
  }

  private generateMysticalInterpretation(article: NewsArticle, index: number): TarotNewsInterpretation {
    const cards = ['愚者', '魔術師', '女祭司', '皇后', '皇帝']
    const energies = ['變革', '顯化', '直覺', '豐盛', '權威']
    const insights = [
      '新的開始即將來臨，保持開放的心態',
      '運用你的技能和資源創造改變',
      '相信你的直覺，內在智慧將指引方向',
      '豐盛和成長的機會正在顯現',
      '領導力和穩定性是當前的關鍵'
    ]

    return {
      headline: article.title,
      mysticalInsight: insights[index] || '宇宙正在為你揭示重要的訊息',
      cardConnection: `此新聞與${cards[index] || '隱者'}牌的能量共鳴`,
      energyReading: `當前的${energies[index] || '轉化'}能量特別強烈`,
      guidanceMessage: '關注周圍發生的事件，它們可能包含著對你個人旅程的重要啟示'
    }
  }

  private getFallbackNews(category: string): NewsResponse {
    const fallbackArticles: NewsArticle[] = [
      {
        id: 'fallback-1',
        title: '宇宙能量今日特別活躍',
        description: '星象學家觀察到今日宇宙能量場發生顯著變化，建議進行冥想和內省。',
        content: '根據古老的星象智慧...',
        url: '#',
        urlToImage: null,
        publishedAt: new Date(),
        source: { id: 'cosmic-news', name: 'Cosmic News' },
        category,
        country: 'TW',
        language: 'zh-TW'
      },
      {
        id: 'fallback-2',
        title: '靈性成長：現代人的古老智慧',
        description: '探索如何在現代生活中融入古老的靈性實踐和塔羅智慧。',
        content: '在快節奏的現代生活中...',
        url: '#',
        urlToImage: null,
        publishedAt: new Date(),
        source: { id: 'wisdom-daily', name: 'Wisdom Daily' },
        category,
        country: 'TW',
        language: 'zh-TW'
      }
    ]

    return {
      articles: fallbackArticles,
      totalResults: fallbackArticles.length,
      lastUpdated: new Date(),
      location: 'Unknown',
      category
    }
  }

  private generateArticleId(article: NewsAPIArticle): string {
    return `${article.source?.id || 'unknown'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private getLanguageFromCountry(country: string): string {
    const countryLanguageMap: Record<string, string> = {
      'TW': 'zh-TW',
      'CN': 'zh-CN',
      'HK': 'zh-HK',
      'JP': 'ja',
      'KR': 'ko',
      'US': 'en',
      'GB': 'en',
      'DE': 'de',
      'FR': 'fr',
      'ES': 'es'
    }
    return countryLanguageMap[country.toUpperCase()] || 'en'
  }

  private async getSecureApiKey(service: 'news' | 'monica'): Promise<string> {
    try {
      const response = await fetch(`/api/keys/${service}`, {
        credentials: 'include'
      })
      
      if (!response.ok) throw new Error('Failed to get API key')
      
      const data = await response.json()
      return data.apiKey
    } catch (error) {
      console.warn(`Could not get secure ${service} API key:`, error)
      return ''
    }
  }

  // Get news categories that align with tarot themes
  getNewsCategories(): Array<{ id: string, name: string, tarotTheme: string }> {
    return [
      { id: 'general', name: '綜合新聞', tarotTheme: '全面洞察' },
      { id: 'business', name: '商業財經', tarotTheme: '物質顯化' },
      { id: 'technology', name: '科技創新', tarotTheme: '變革能量' },
      { id: 'health', name: '健康醫療', tarotTheme: '身心平衡' },
      { id: 'entertainment', name: '娛樂文化', tarotTheme: '創意表達' },
      { id: 'sports', name: '體育運動', tarotTheme: '競爭與合作' },
      { id: 'science', name: '科學探索', tarotTheme: '智慧追求' }
    ]
  }
}

interface LocationInfo {
  city: string
  country: string
  latitude: number
  longitude: number
}


export const newsService = new NewsService()