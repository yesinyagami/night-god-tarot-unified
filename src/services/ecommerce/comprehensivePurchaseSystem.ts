/**
 * COMPREHENSIVE PURCHASE SYSTEM 2030
 * Complete e-commerce integration for all Night God Tarot services
 */

import { blockchainIntegration } from '../web3/blockchainIntegration'
import { securityManager } from '../security/securityManager'
import type { UserId } from '@/types/enhanced-types'

export interface Product {
  id: string
  name: string
  description: string
  category: 'reading' | 'nft' | 'subscription' | 'addon' | 'premium' | 'consultation'
  prices: {
    usd: number
    eth?: number
    btc?: number
    tokens?: number // Social tokens
  }
  features: string[]
  duration?: number // For subscriptions (in days)
  isPopular?: boolean
  isLimited?: boolean
  limitQuantity?: number
  prerequisites?: string[]
  benefits: string[]
  images: string[]
  videoPreview?: string
}

export interface PurchaseTransaction {
  id: string
  userId: UserId
  productId: string
  paymentMethod: 'crypto' | 'credit_card' | 'paypal' | 'tokens' | 'stripe'
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  timestamp: number
  receipt?: string
  blockchainHash?: string
  nftTokenId?: string
}

export interface UserPurchases {
  userId: UserId
  activeSubscriptions: string[]
  ownedNFTs: string[]
  purchaseHistory: PurchaseTransaction[]
  credits: number
  socialTokens: number
  membershipTier: 'free' | 'premium' | 'ultimate' | 'cosmic'
}

class ComprehensivePurchaseSystem {
  private static instance: ComprehensivePurchaseSystem
  private products: Map<string, Product> = new Map()
  private transactions: Map<string, PurchaseTransaction> = new Map()
  private userPurchases: Map<UserId, UserPurchases> = new Map()

  private constructor() {
    this.initializeProducts()
  }

  static getInstance(): ComprehensivePurchaseSystem {
    if (!ComprehensivePurchaseSystem.instance) {
      ComprehensivePurchaseSystem.instance = new ComprehensivePurchaseSystem()
    }
    return ComprehensivePurchaseSystem.instance
  }

  private initializeProducts(): void {
    const products: Product[] = [
      // === AI READINGS ===
      {
        id: 'quick-ai-reading',
        name: 'Quick AI Reading',
        description: 'Fast 3-card reading powered by multiple AI models',
        category: 'reading',
        prices: { usd: 5, eth: 0.002, tokens: 500 },
        features: ['3 cards', 'AI analysis', '5-minute response'],
        benefits: ['Instant clarity', 'Multiple AI perspectives', 'Detailed interpretation'],
        images: ['/images/products/quick-reading.jpg'],
        isPopular: true
      },
      {
        id: 'premium-ai-reading',
        name: 'Premium AI Reading',
        description: 'Comprehensive Celtic Cross with advanced AI analysis',
        category: 'reading',
        prices: { usd: 25, eth: 0.01, tokens: 2500 },
        features: ['10 cards', 'Advanced AI', 'Voice synthesis', 'PDF report'],
        benefits: ['Deep insights', 'Professional analysis', 'Downloadable report'],
        images: ['/images/products/premium-reading.jpg']
      },
      {
        id: 'ultimate-ai-reading',
        name: 'Ultimate AI Reading',
        description: 'Master-level reading with all AI models + human verification',
        category: 'reading',
        prices: { usd: 50, eth: 0.02, tokens: 5000 },
        features: ['21 cards', 'All AI models', 'Human review', 'Video consultation'],
        benefits: ['Maximum accuracy', 'Human + AI wisdom', 'Personal consultation'],
        images: ['/images/products/ultimate-reading.jpg']
      },

      // === NFT COLLECTIONS ===
      {
        id: 'genesis-nft-reading',
        name: 'Genesis NFT Reading',
        description: 'Limited edition blockchain-verified reading as NFT',
        category: 'nft',
        prices: { usd: 100, eth: 0.04 },
        features: ['Blockchain verified', 'Unique artwork', 'Transferable', 'Royalties'],
        benefits: ['Investment value', 'Authenticity proof', 'Collectible artwork'],
        images: ['/images/products/genesis-nft.jpg'],
        isLimited: true,
        limitQuantity: 1000
      },
      {
        id: 'legendary-nft-collection',
        name: 'Legendary NFT Collection',
        description: 'Rare collection of 7 readings with mythic-level AI analysis',
        category: 'nft',
        prices: { usd: 500, eth: 0.2 },
        features: ['7 unique NFTs', 'Legendary rarity', 'Special artwork', 'Trading rights'],
        benefits: ['High investment potential', 'Exclusive access', 'Community status'],
        images: ['/images/products/legendary-collection.jpg'],
        isLimited: true,
        limitQuantity: 100
      },

      // === SUBSCRIPTIONS ===
      {
        id: 'premium-monthly',
        name: 'Premium Monthly',
        description: 'Unlimited AI readings + advanced features',
        category: 'subscription',
        prices: { usd: 29.99, tokens: 3000 },
        duration: 30,
        features: ['Unlimited readings', 'All AI models', 'Priority support', 'Advanced spreads'],
        benefits: ['No reading limits', 'Premium AI access', 'Faster responses'],
        images: ['/images/products/premium-monthly.jpg'],
        isPopular: true
      },
      {
        id: 'ultimate-yearly',
        name: 'Ultimate Yearly',
        description: 'Everything included + NFT privileges + consultation credits',
        category: 'subscription',
        prices: { usd: 299.99, eth: 0.12 },
        duration: 365,
        features: ['Everything Premium', 'NFT discounts', 'Live consultations', 'Early access'],
        benefits: ['Best value', 'VIP treatment', 'Exclusive features'],
        images: ['/images/products/ultimate-yearly.jpg']
      },

      // === LIVE CONSULTATIONS ===
      {
        id: 'live-consultation-30min',
        name: '30min Live Consultation',
        description: 'Personal video consultation with tarot master',
        category: 'consultation',
        prices: { usd: 75, eth: 0.03 },
        features: ['30 minutes', 'Video call', 'Real-time reading', 'Recording included'],
        benefits: ['Personal attention', 'Interactive experience', 'Immediate answers'],
        images: ['/images/products/live-consultation.jpg']
      },
      {
        id: 'group-reading-session',
        name: 'Group Reading Session',
        description: 'Collaborative reading session for up to 6 people',
        category: 'consultation',
        prices: { usd: 150, eth: 0.06 },
        features: ['Up to 6 people', 'WebRTC powered', 'Shared insights', '90 minutes'],
        benefits: ['Social experience', 'Shared wisdom', 'Group dynamics'],
        images: ['/images/products/group-session.jpg']
      },

      // === PREMIUM ADDONS ===
      {
        id: 'voice-synthesis-addon',
        name: 'Voice Synthesis Addon',
        description: 'AI-generated voice readings with mystical narration',
        category: 'addon',
        prices: { usd: 15, tokens: 1500 },
        features: ['AI voice', 'Multiple accents', 'Download option', 'Background music'],
        benefits: ['Immersive experience', 'Audio convenience', 'Professional quality'],
        images: ['/images/products/voice-addon.jpg']
      },
      {
        id: 'custom-deck-addon',
        name: 'Custom Deck Design',
        description: 'Personalized tarot deck with your preferences',
        category: 'addon',
        prices: { usd: 50, eth: 0.02 },
        features: ['Custom artwork', 'Personal symbols', 'HD quality', 'Digital + print'],
        benefits: ['Unique design', 'Personal connection', 'Artistic value'],
        images: ['/images/products/custom-deck.jpg']
      },

      // === SOCIAL TOKENS & CREDITS ===
      {
        id: 'social-tokens-1000',
        name: '1000 Social Tokens',
        description: 'Community tokens for platform rewards and benefits',
        category: 'premium',
        prices: { usd: 10, eth: 0.004 },
        features: ['Community access', 'Discount privileges', 'Voting rights', 'Rewards'],
        benefits: ['Community participation', 'Future discounts', 'Platform governance'],
        images: ['/images/products/social-tokens.jpg']
      },
      {
        id: 'reading-credits-bundle',
        name: 'Reading Credits Bundle',
        description: '10 reading credits for future use (better value)',
        category: 'premium',
        prices: { usd: 40, tokens: 4000 },
        features: ['10 credits', 'Never expire', 'Any reading type', 'Transferable'],
        benefits: ['Better value', 'Flexibility', 'No expiration', 'Gift option'],
        images: ['/images/products/credits-bundle.jpg']
      }
    ]

    products.forEach(product => {
      this.products.set(product.id, product)
    })
  }

  // === PRODUCT CATALOG ===
  getAllProducts(): Product[] {
    return Array.from(this.products.values())
  }

  getProductsByCategory(category: Product['category']): Product[] {
    return this.getAllProducts().filter(p => p.category === category)
  }

  getPopularProducts(): Product[] {
    return this.getAllProducts().filter(p => p.isPopular)
  }

  getLimitedProducts(): Product[] {
    return this.getAllProducts().filter(p => p.isLimited)
  }

  getProduct(productId: string): Product | null {
    return this.products.get(productId) || null
  }

  // === PURCHASE PROCESSING ===
  async initiatePurchase(
    userId: UserId,
    productId: string,
    paymentMethod: PurchaseTransaction['paymentMethod'],
    currency: string = 'usd'
  ): Promise<{ transactionId: string; paymentUrl?: string; instructions?: string }> {
    const product = this.getProduct(productId)
    if (!product) {
      throw new Error('Product not found')
    }

    // Check availability for limited products
    if (product.isLimited) {
      const purchased = await this.checkLimitedProductAvailability(productId)
      if (purchased >= (product.limitQuantity || 0)) {
        throw new Error('Product sold out')
      }
    }

    // Check prerequisites
    if (product.prerequisites) {
      const userPurchases = this.getUserPurchases(userId)
      const hasPrereqs = product.prerequisites.every(prereq => 
        userPurchases.purchaseHistory.some(p => p.productId === prereq && p.status === 'completed')
      )
      if (!hasPrereqs) {
        throw new Error('Prerequisites not met')
      }
    }

    // Create transaction
    const transactionId = crypto.randomUUID()
    const amount = this.getProductPrice(product, currency)
    
    const transaction: PurchaseTransaction = {
      id: transactionId,
      userId,
      productId,
      paymentMethod,
      amount,
      currency,
      status: 'pending',
      timestamp: Date.now()
    }

    this.transactions.set(transactionId, transaction)

    // Process payment based on method
    let result: { paymentUrl?: string; instructions?: string } = {}

    switch (paymentMethod) {
      case 'crypto':
        result = await this.processCryptoPayment(transaction, currency)
        break
      case 'credit_card':
        result = await this.processStripePayment(transaction)
        break
      case 'paypal':
        result = await this.processPayPalPayment(transaction)
        break
      case 'tokens':
        result = await this.processSocialTokenPayment(transaction)
        break
      default:
        throw new Error('Unsupported payment method')
    }

    return { transactionId, ...result }
  }

  private async processCryptoPayment(
    transaction: PurchaseTransaction, 
    currency: string
  ): Promise<{ paymentUrl?: string; instructions?: string }> {
    try {
      const recipientAddress = this.getCryptoAddress(currency)
      
      // Update transaction status
      transaction.status = 'processing'
      this.transactions.set(transaction.id, transaction)

      if (currency === 'eth' && blockchainIntegration.isConnected()) {
        // Use Web3 integration for Ethereum
        const payment = await blockchainIntegration.processCryptoPayment(
          transaction.amount,
          'ETH',
          recipientAddress
        )
        
        transaction.blockchainHash = payment.transactionHash
        transaction.status = payment.status === 'confirmed' ? 'completed' : 'processing'
        this.transactions.set(transaction.id, transaction)

        if (transaction.status === 'completed') {
          await this.completePurchase(transaction)
        }

        return { 
          instructions: `Payment initiated on blockchain. Hash: ${payment.transactionHash}` 
        }
      } else {
        // Provide payment instructions for manual payment
        return {
          instructions: `Send ${transaction.amount} ${currency.toUpperCase()} to: ${recipientAddress}. Transaction ID: ${transaction.id}`
        }
      }
    } catch (error) {
      transaction.status = 'failed'
      this.transactions.set(transaction.id, transaction)
      throw error
    }
  }

  private async processStripePayment(transaction: PurchaseTransaction): Promise<{ paymentUrl: string }> {
    try {
      // In production, integrate with Stripe API
      const stripeSession = await this.createStripeSession(transaction)
      
      transaction.status = 'processing'
      this.transactions.set(transaction.id, transaction)

      return { paymentUrl: stripeSession.url }
    } catch (error) {
      transaction.status = 'failed'
      this.transactions.set(transaction.id, transaction)
      throw error
    }
  }

  private async processPayPalPayment(transaction: PurchaseTransaction): Promise<{ paymentUrl: string }> {
    // Similar to Stripe but for PayPal
    const paypalUrl = `https://www.paypal.com/checkout?token=${transaction.id}&amount=${transaction.amount}`
    
    transaction.status = 'processing'
    this.transactions.set(transaction.id, transaction)

    return { paymentUrl: paypalUrl }
  }

  private async processSocialTokenPayment(transaction: PurchaseTransaction): Promise<{ instructions: string }> {
    const userPurchases = this.getUserPurchases(transaction.userId)
    
    if (userPurchases.socialTokens < transaction.amount) {
      throw new Error('Insufficient social tokens')
    }

    // Deduct tokens immediately
    userPurchases.socialTokens -= transaction.amount
    this.userPurchases.set(transaction.userId, userPurchases)

    transaction.status = 'completed'
    this.transactions.set(transaction.id, transaction)

    await this.completePurchase(transaction)

    return { instructions: 'Payment completed using social tokens!' }
  }

  // === PURCHASE COMPLETION ===
  private async completePurchase(transaction: PurchaseTransaction): Promise<void> {
    const product = this.getProduct(transaction.productId)
    if (!product) return

    const userPurchases = this.getUserPurchases(transaction.userId)

    // Apply purchase based on product type
    switch (product.category) {
      case 'reading':
        userPurchases.credits += this.getReadingCredits(product.id)
        break

      case 'nft':
        // Mint NFT
        if (blockchainIntegration.isConnected()) {
          const nft = await this.mintReadingNFT(transaction, product)
          transaction.nftTokenId = nft.tokenId
          userPurchases.ownedNFTs.push(nft.tokenId)
        }
        break

      case 'subscription':
        userPurchases.activeSubscriptions.push(transaction.productId)
        userPurchases.membershipTier = this.getSubscriptionTier(product.id)
        break

      case 'addon':
      case 'premium':
        // Add to purchase history for feature unlocking
        break

      case 'consultation':
        // Schedule consultation
        await this.scheduleConsultation(transaction, product)
        break
    }

    // Add to purchase history
    userPurchases.purchaseHistory.push(transaction)
    this.userPurchases.set(transaction.userId, userPurchases)

    // Generate receipt
    transaction.receipt = await this.generateReceipt(transaction, product)

    // Send confirmation
    await this.sendPurchaseConfirmation(transaction, product)

    console.log(`✅ Purchase completed: ${product.name} for user ${transaction.userId}`)
  }

  // === USER MANAGEMENT ===
  getUserPurchases(userId: UserId): UserPurchases {
    if (!this.userPurchases.has(userId)) {
      this.userPurchases.set(userId, {
        userId,
        activeSubscriptions: [],
        ownedNFTs: [],
        purchaseHistory: [],
        credits: 0,
        socialTokens: 1000, // Starting tokens
        membershipTier: 'free'
      })
    }
    return this.userPurchases.get(userId)!
  }

  hasAccess(userId: UserId, feature: string): boolean {
    const purchases = this.getUserPurchases(userId)
    
    // Check subscription access
    const activeSubscription = purchases.activeSubscriptions.find(sub => {
      const product = this.getProduct(sub)
      return product?.features.includes(feature)
    })
    
    if (activeSubscription) return true

    // Check one-time purchases
    return purchases.purchaseHistory.some(p => {
      const product = this.getProduct(p.productId)
      return product?.features.includes(feature) && p.status === 'completed'
    })
  }

  canUseReading(userId: UserId, readingType: string): boolean {
    const purchases = this.getUserPurchases(userId)
    
    // Check credits
    if (purchases.credits > 0) return true
    
    // Check unlimited subscription
    return purchases.activeSubscriptions.some(sub => {
      const product = this.getProduct(sub)
      return product?.features.includes('Unlimited readings')
    })
  }

  async consumeReadingCredit(userId: UserId): Promise<boolean> {
    const purchases = this.getUserPurchases(userId)
    
    if (purchases.credits > 0) {
      purchases.credits--
      this.userPurchases.set(userId, purchases)
      return true
    }
    
    return false
  }

  // === TRANSACTION MANAGEMENT ===
  getTransaction(transactionId: string): PurchaseTransaction | null {
    return this.transactions.get(transactionId) || null
  }

  async confirmPayment(transactionId: string, paymentProof?: string): Promise<boolean> {
    const transaction = this.getTransaction(transactionId)
    if (!transaction) return false

    transaction.status = 'completed'
    if (paymentProof) {
      transaction.blockchainHash = paymentProof
    }

    await this.completePurchase(transaction)
    return true
  }

  async refundTransaction(transactionId: string, reason: string): Promise<boolean> {
    const transaction = this.getTransaction(transactionId)
    if (!transaction || transaction.status !== 'completed') return false

    // Process refund based on payment method
    let refundSuccess = false

    try {
      switch (transaction.paymentMethod) {
        case 'crypto':
          refundSuccess = await this.processCryptoRefund(transaction)
          break
        case 'credit_card':
          refundSuccess = await this.processStripeRefund(transaction)
          break
        case 'tokens':
          refundSuccess = await this.processSocialTokenRefund(transaction)
          break
      }

      if (refundSuccess) {
        transaction.status = 'refunded'
        await this.reversePurchaseBenefits(transaction)
        console.log(`✅ Refund processed: ${transactionId}`)
      }

      return refundSuccess
    } catch (error) {
      console.error('Refund failed:', error)
      return false
    }
  }

  // === UTILITY METHODS ===
  private getProductPrice(product: Product, currency: string): number {
    switch (currency.toLowerCase()) {
      case 'usd':
        return product.prices.usd
      case 'eth':
        return product.prices.eth || product.prices.usd * 0.0004 // Rough conversion
      case 'btc':
        return product.prices.btc || product.prices.usd * 0.000015 // Rough conversion
      case 'tokens':
        return product.prices.tokens || product.prices.usd * 100
      default:
        return product.prices.usd
    }
  }

  private getCryptoAddress(currency: string): string {
    const addresses = {
      'eth': '0x742d35Cc6634C0532925a3b8D2980E1dE95a5c99',
      'btc': '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      'usdc': '0x742d35Cc6634C0532925a3b8D2980E1dE95a5c99'
    }
    return addresses[currency as keyof typeof addresses] || addresses.eth
  }

  private async createStripeSession(transaction: PurchaseTransaction): Promise<{ url: string }> {
    // Mock Stripe session creation
    return {
      url: `https://checkout.stripe.com/pay/${transaction.id}#fidkdWxhYHithHUOalBXMU1sICM1MFFqMGpFT2NjJGBxcGN1aXZzQCVBdmJjNEdCQHFjZE5hMkJIZCd9%3D`
    }
  }

  private getReadingCredits(productId: string): number {
    const creditMap: { [key: string]: number } = {
      'quick-ai-reading': 1,
      'premium-ai-reading': 1,
      'ultimate-ai-reading': 1,
      'reading-credits-bundle': 10
    }
    return creditMap[productId] || 0
  }

  private getSubscriptionTier(productId: string): UserPurchases['membershipTier'] {
    if (productId.includes('ultimate')) return 'ultimate'
    if (productId.includes('premium')) return 'premium'
    if (productId.includes('cosmic')) return 'cosmic'
    return 'free'
  }

  private async mintReadingNFT(transaction: PurchaseTransaction, product: Product): Promise<{ tokenId: string }> {
    // Mock NFT minting - in production, integrate with blockchain
    const mockReading = {
      readingId: `reading_${transaction.id}` as any,
      userId: transaction.userId,
      cards: ['The Fool', 'The Magician', 'The High Priestess'],
      readingText: `Premium NFT reading for ${product.name}`,
      rarity: 'legendary' as const
    }

    if (blockchainIntegration.isConnected()) {
      return await blockchainIntegration.mintTarotReading(mockReading)
    } else {
      return { tokenId: `mock_nft_${Date.now()}` }
    }
  }

  private async scheduleConsultation(transaction: PurchaseTransaction, product: Product): Promise<void> {
    // Integration with calendar/scheduling system
    console.log(`📅 Scheduling consultation: ${product.name} for ${transaction.userId}`)
  }

  private async generateReceipt(transaction: PurchaseTransaction, product: Product): Promise<string> {
    const receipt = {
      transactionId: transaction.id,
      date: new Date(transaction.timestamp).toISOString(),
      product: product.name,
      amount: transaction.amount,
      currency: transaction.currency,
      paymentMethod: transaction.paymentMethod
    }
    
    return btoa(JSON.stringify(receipt)) // Base64 encoded receipt
  }

  private async sendPurchaseConfirmation(transaction: PurchaseTransaction, product: Product): Promise<void> {
    // Send email/notification confirmation
    console.log(`📧 Sending purchase confirmation for ${product.name}`)
  }

  private async checkLimitedProductAvailability(productId: string): Promise<number> {
    // Count how many of this limited product have been sold
    return Array.from(this.transactions.values())
      .filter(t => t.productId === productId && t.status === 'completed')
      .length
  }

  private async processCryptoRefund(transaction: PurchaseTransaction): Promise<boolean> {
    // Process crypto refund
    console.log(`🔄 Processing crypto refund for ${transaction.id}`)
    return true // Mock success
  }

  private async processStripeRefund(transaction: PurchaseTransaction): Promise<boolean> {
    // Process Stripe refund
    console.log(`🔄 Processing Stripe refund for ${transaction.id}`)
    return true // Mock success
  }

  private async processSocialTokenRefund(transaction: PurchaseTransaction): Promise<boolean> {
    // Refund social tokens
    const userPurchases = this.getUserPurchases(transaction.userId)
    userPurchases.socialTokens += transaction.amount
    this.userPurchases.set(transaction.userId, userPurchases)
    return true
  }

  private async reversePurchaseBenefits(transaction: PurchaseTransaction): Promise<void> {
    const userPurchases = this.getUserPurchases(transaction.userId)
    const product = this.getProduct(transaction.productId)
    
    if (!product) return

    // Reverse the benefits that were applied
    switch (product.category) {
      case 'reading':
        userPurchases.credits = Math.max(0, userPurchases.credits - this.getReadingCredits(product.id))
        break
      case 'subscription':
        userPurchases.activeSubscriptions = userPurchases.activeSubscriptions.filter(s => s !== product.id)
        break
      case 'nft':
        if (transaction.nftTokenId) {
          userPurchases.ownedNFTs = userPurchases.ownedNFTs.filter(nft => nft !== transaction.nftTokenId)
        }
        break
    }

    this.userPurchases.set(transaction.userId, userPurchases)
  }

  // === PUBLIC API ===
  getPurchaseHistory(userId: UserId): PurchaseTransaction[] {
    return this.getUserPurchases(userId).purchaseHistory
  }

  getActiveSubscriptions(userId: UserId): Product[] {
    const purchases = this.getUserPurchases(userId)
    return purchases.activeSubscriptions
      .map(subId => this.getProduct(subId))
      .filter(p => p !== null) as Product[]
  }

  getUserCreditsBalance(userId: UserId): number {
    return this.getUserPurchases(userId).credits
  }

  getSocialTokenBalance(userId: UserId): number {
    return this.getUserPurchases(userId).socialTokens
  }

  getMembershipTier(userId: UserId): UserPurchases['membershipTier'] {
    return this.getUserPurchases(userId).membershipTier
  }

  async awardSocialTokens(userId: UserId, amount: number, reason: string): Promise<void> {
    const purchases = this.getUserPurchases(userId)
    purchases.socialTokens += amount
    this.userPurchases.set(userId, purchases)
    
    console.log(`🪙 Awarded ${amount} social tokens to ${userId}: ${reason}`)
  }

  getRecommendedProducts(userId: UserId): Product[] {
    const purchases = this.getUserPurchases(userId)
    const tier = purchases.membershipTier
    
    // Recommend products based on tier and purchase history
    if (tier === 'free') {
      return this.getProductsByCategory('reading').slice(0, 3)
    } else if (tier === 'premium') {
      return this.getProductsByCategory('nft').slice(0, 2)
    } else {
      return this.getLimitedProducts()
    }
  }
}

export const comprehensivePurchaseSystem = ComprehensivePurchaseSystem.getInstance()
export default comprehensivePurchaseSystem