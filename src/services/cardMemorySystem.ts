import { ref, reactive } from 'vue'
import type { TarotCard } from '../types/tarot'

// Types for the memory system
export interface FlippedCardRecord {
  cardId: string
  cardName: string
  flippedAt: Date
  sessionId: string
  userEmail?: string
}

export interface CardMemorySession {
  sessionId: string
  userEmail: string
  startTime: Date
  flippedCards: FlippedCardRecord[]
  totalFlips: number
}

export interface MemorySystemState {
  currentSession: CardMemorySession | null
  allSessions: CardMemorySession[]
  flippedCardIds: Set<string>
  userEmail: string | null
}

class CardMemorySystem {
  private state: MemorySystemState = reactive({
    currentSession: null,
    allSessions: [],
    flippedCardIds: new Set(),
    userEmail: null
  })

  private readonly STORAGE_KEY = 'night-god-tarot-memory'
  private readonly EMAIL_STORAGE_KEY = 'night-god-tarot-email'

  constructor() {
    this.loadFromStorage()
  }

  // Initialize session with user email
  async startSession(userEmail: string): Promise<string> {
    const sessionId = this.generateSessionId()
    
    const newSession: CardMemorySession = {
      sessionId,
      userEmail,
      startTime: new Date(),
      flippedCards: [],
      totalFlips: 0
    }

    this.state.currentSession = newSession
    this.state.userEmail = userEmail
    this.state.flippedCardIds.clear()
    
    // Save email for future sessions
    localStorage.setItem(this.EMAIL_STORAGE_KEY, userEmail)
    
    // Log session start
    console.log(`🌙 Night God Tarot Session Started for ${userEmail}`, {
      sessionId,
      timestamp: new Date().toISOString()
    })

    this.saveToStorage()
    return sessionId
  }

  // Record a card flip
  flipCard(card: TarotCard): FlippedCardRecord {
    if (!this.state.currentSession) {
      throw new Error('No active session. Please start a session first.')
    }

    const record: FlippedCardRecord = {
      cardId: card.id,
      cardName: card.name,
      flippedAt: new Date(),
      sessionId: this.state.currentSession.sessionId,
      userEmail: this.state.currentSession.userEmail
    }

    // Add to current session
    this.state.currentSession.flippedCards.push(record)
    this.state.currentSession.totalFlips++
    this.state.flippedCardIds.add(card.id)

    // Log the card flip
    this.logCardFlip(record)
    
    this.saveToStorage()
    return record
  }

  // Check if a card has been flipped in current session
  isCardFlipped(cardId: string): boolean {
    return this.state.flippedCardIds.has(cardId)
  }

  // Get all flipped cards in current session
  getFlippedCards(): FlippedCardRecord[] {
    return this.state.currentSession?.flippedCards || []
  }

  // Get cards flipped by specific email across all sessions
  getCardsByEmail(email: string): FlippedCardRecord[] {
    const allCards: FlippedCardRecord[] = []
    
    // Current session cards
    if (this.state.currentSession?.userEmail === email) {
      allCards.push(...this.state.currentSession.flippedCards)
    }
    
    // Historical session cards
    this.state.allSessions.forEach(session => {
      if (session.userEmail === email) {
        allCards.push(...session.flippedCards)
      }
    })
    
    return allCards.sort((a, b) => b.flippedAt.getTime() - a.flippedAt.getTime())
  }

  // Get memory statistics for user
  getUserStats(email: string): {
    totalSessions: number
    totalFlips: number
    uniqueCards: number
    lastActivity: Date | null
  } {
    const userSessions = this.state.allSessions.filter(s => s.userEmail === email)
    if (this.state.currentSession?.userEmail === email) {
      userSessions.push(this.state.currentSession)
    }

    const allUserCards = this.getCardsByEmail(email)
    const uniqueCardIds = new Set(allUserCards.map(c => c.cardId))
    
    return {
      totalSessions: userSessions.length,
      totalFlips: allUserCards.length,
      uniqueCards: uniqueCardIds.size,
      lastActivity: allUserCards.length > 0 ? allUserCards[0].flippedAt : null
    }
  }

  // End current session
  endSession(): void {
    if (this.state.currentSession) {
      // Move current session to history
      this.state.allSessions.push({ ...this.state.currentSession })
      
      // Log session end
      console.log(`🌙 Night God Tarot Session Ended`, {
        sessionId: this.state.currentSession.sessionId,
        email: this.state.currentSession.userEmail,
        totalFlips: this.state.currentSession.totalFlips,
        duration: Date.now() - this.state.currentSession.startTime.getTime()
      })

      // Reset current session
      this.state.currentSession = null
      this.state.flippedCardIds.clear()
      
      this.saveToStorage()
    }
  }

  // Get saved email for auto-login
  getSavedEmail(): string | null {
    return localStorage.getItem(this.EMAIL_STORAGE_KEY) || this.state.userEmail
  }

  // Email-based logging system
  private logCardFlip(record: FlippedCardRecord): void {
    const logEntry = {
      timestamp: record.flippedAt.toISOString(),
      email: record.userEmail,
      sessionId: record.sessionId,
      cardId: record.cardId,
      cardName: record.cardName,
      event: 'CARD_FLIP'
    }

    // Log to console (in production, this would send to a logging service)
    console.log('🎴 Card Flip Event:', logEntry)

    // In production, you could send this to your backend:
    // await fetch('/api/log-card-flip', { method: 'POST', body: JSON.stringify(logEntry) })
  }

  // Generate unique session ID
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substr(2, 9)
    return `session-${timestamp}-${randomStr}`
  }

  // Save state to localStorage
  private saveToStorage(): void {
    try {
      const serializedState = {
        allSessions: this.state.allSessions,
        userEmail: this.state.userEmail
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializedState))
    } catch (error) {
      console.error('Failed to save card memory state:', error)
    }
  }

  // Load state from localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      const savedEmail = localStorage.getItem(this.EMAIL_STORAGE_KEY)
      
      if (stored) {
        const parsed = JSON.parse(stored)
        this.state.allSessions = parsed.allSessions || []
        this.state.userEmail = parsed.userEmail || savedEmail
        
        // Convert date strings back to Date objects
        this.state.allSessions.forEach(session => {
          session.startTime = new Date(session.startTime)
          session.flippedCards.forEach(card => {
            card.flippedAt = new Date(card.flippedAt)
          })
        })
      }
      
      if (savedEmail) {
        this.state.userEmail = savedEmail
      }
    } catch (error) {
      console.error('Failed to load card memory state:', error)
    }
  }

  // Reactive state getters
  get currentSession(): CardMemorySession | null {
    return this.state.currentSession
  }

  get userEmail(): string | null {
    return this.state.userEmail
  }

  get isSessionActive(): boolean {
    return this.state.currentSession !== null
  }

  get currentSessionFlipCount(): number {
    return this.state.currentSession?.totalFlips || 0
  }
}

// Export singleton instance
export const cardMemorySystem = new CardMemorySystem()