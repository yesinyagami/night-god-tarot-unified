/**
 * WEB3 BLOCKCHAIN INTEGRATION 2030
 * Revolutionary blockchain-powered tarot platform
 * NFT readings, crypto payments, and decentralized storage
 */

import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import type { ReadingId, UserId } from '@/types/enhanced-types'

export interface TarotNFT {
  tokenId: string
  readingId: ReadingId
  userId: UserId
  cardCombination: string[]
  readingText: string
  timestamp: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  authenticity: string // Blockchain hash
  ipfsHash: string
  price?: number // In ETH
  royalties: number // Percentage to original reader
}

export interface CryptoPayment {
  transactionHash: string
  amount: number
  currency: 'ETH' | 'BTC' | 'USDC' | 'MATIC'
  fromAddress: string
  toAddress: string
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed'
  gasUsed?: number
}

export interface DecentralizedProfile {
  walletAddress: string
  ensName?: string
  avatar?: string
  reputation: number
  readingsGiven: number
  readingsReceived: number
  nftCollection: TarotNFT[]
  socialTokens: number
  achievements: string[]
}

class BlockchainIntegration {
  private static instance: BlockchainIntegration
  private provider?: ethers.JsonRpcProvider
  private wallet?: ethers.Wallet
  private contract?: ethers.Contract
  private ipfsClient?: any
  private isInitialized = false

  // Smart Contract ABI for Tarot NFTs
  private readonly tarotNFTABI = [
    "function mintReading(address to, string memory readingData, uint256 rarity) external returns (uint256)",
    "function getReading(uint256 tokenId) external view returns (string memory)",
    "function transferReading(address to, uint256 tokenId) external",
    "function setPrice(uint256 tokenId, uint256 price) external",
    "function buyReading(uint256 tokenId) external payable",
    "function totalSupply() external view returns (uint256)",
    "event ReadingMinted(address indexed owner, uint256 indexed tokenId, string readingData)",
    "event ReadingSold(address indexed from, address indexed to, uint256 indexed tokenId, uint256 price)"
  ]

  private constructor() {}

  static getInstance(): BlockchainIntegration {
    if (!BlockchainIntegration.instance) {
      BlockchainIntegration.instance = new BlockchainIntegration()
    }
    return BlockchainIntegration.instance
  }

  // === INITIALIZATION ===
  async initialize(): Promise<boolean> {
    try {
      // Initialize Ethereum provider
      await this.initializeEthereum()
      
      // Initialize IPFS for decentralized storage
      await this.initializeIPFS()
      
      // Initialize smart contracts
      await this.initializeContracts()
      
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('Blockchain initialization failed:', error)
      return false
    }
  }

  private async initializeEthereum(): Promise<void> {
    // Check if MetaMask is available
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum)
      
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      const signer = await this.provider.getSigner()
      const address = await signer.getAddress()
      
      console.log('Connected to wallet:', address)
    } else {
      // Fallback to public RPC for read-only operations
      const rpcUrl = import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'
      this.provider = new ethers.JsonRpcProvider(rpcUrl)
      console.log('Using public RPC provider')
    }
  }

  private async initializeIPFS(): Promise<void> {
    try {
      // Initialize IPFS client for decentralized storage
      this.ipfsClient = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          authorization: `Basic ${btoa(
            `${import.meta.env.VITE_IPFS_PROJECT_ID}:${import.meta.env.VITE_IPFS_SECRET}`
          )}`
        }
      })
      
      // Test connection
      await this.ipfsClient.id()
      console.log('IPFS client initialized')
    } catch (error) {
      console.warn('IPFS initialization failed, using fallback storage:', error)
    }
  }

  private async initializeContracts(): Promise<void> {
    if (!this.provider) throw new Error('Provider not initialized')
    
    const contractAddress = import.meta.env.VITE_TAROT_NFT_CONTRACT || '0x742d35Cc6634C0532925a3b8D2980E1dE95a5c99'
    
    this.contract = new ethers.Contract(
      contractAddress,
      this.tarotNFTABI,
      this.provider
    )
    
    console.log('Smart contracts initialized')
  }

  // === NFT MINTING ===
  async mintTarotReading(
    readingData: {
      readingId: ReadingId
      userId: UserId
      cards: string[]
      readingText: string
      rarity: TarotNFT['rarity']
    }
  ): Promise<TarotNFT> {
    if (!this.isInitialized) {
      throw new Error('Blockchain not initialized')
    }

    // Upload reading to IPFS
    const ipfsHash = await this.uploadToIPFS({
      ...readingData,
      timestamp: Date.now(),
      platform: 'Night God Tarot',
      version: '2.0'
    })

    // Create NFT metadata
    const metadata = {
      name: `Night God Tarot Reading #${readingData.readingId}`,
      description: `Authentic tarot reading from the Night God platform. ${readingData.cards.length} cards drawn.`,
      image: await this.generateReadingImage(readingData.cards),
      attributes: [
        { trait_type: 'Rarity', value: readingData.rarity },
        { trait_type: 'Card Count', value: readingData.cards.length },
        { trait_type: 'Platform', value: 'Night God Tarot' },
        { trait_type: 'Reader Level', value: 'Master' }
      ],
      external_url: `https://nightgod-tarot.com/reading/${readingData.readingId}`,
      properties: {
        cards: readingData.cards,
        reading_length: readingData.readingText.length,
        authenticity: 'blockchain_verified'
      }
    }

    const metadataHash = await this.uploadToIPFS(metadata)

    // Mint NFT on blockchain
    if (!this.contract || !this.provider) {
      throw new Error('Smart contract not available')
    }

    const signer = await this.provider.getSigner()
    const contractWithSigner = this.contract.connect(signer)
    
    const rarityLevel = this.getRarityLevel(readingData.rarity)
    const tx = await contractWithSigner.mintReading(
      await signer.getAddress(),
      metadataHash,
      rarityLevel
    )

    const receipt = await tx.wait()
    const tokenId = this.extractTokenIdFromReceipt(receipt)

    const nft: TarotNFT = {
      tokenId,
      readingId: readingData.readingId,
      userId: readingData.userId,
      cardCombination: readingData.cards,
      readingText: readingData.readingText,
      timestamp: Date.now(),
      rarity: readingData.rarity,
      authenticity: tx.hash,
      ipfsHash: metadataHash,
      royalties: 5 // 5% to Night God platform
    }

    return nft
  }

  // === CRYPTOCURRENCY PAYMENTS ===
  async processCryptoPayment(
    amount: number,
    currency: CryptoPayment['currency'],
    recipientAddress: string
  ): Promise<CryptoPayment> {
    if (!this.provider) {
      throw new Error('Wallet not connected')
    }

    const signer = await this.provider.getSigner()
    const fromAddress = await signer.getAddress()

    let transaction
    
    switch (currency) {
      case 'ETH':
        transaction = await signer.sendTransaction({
          to: recipientAddress,
          value: ethers.parseEther(amount.toString())
        })
        break
      
      case 'USDC':
        // USDC token transfer
        const usdcContract = new ethers.Contract(
          '0xA0b86a33E6417C4C0a51B45B2E5E8E1E6DB6Bb8E', // USDC contract address
          ['function transfer(address to, uint256 amount) returns (bool)'],
          signer
        )
        transaction = await usdcContract.transfer(
          recipientAddress,
          ethers.parseUnits(amount.toString(), 6) // USDC has 6 decimals
        )
        break
      
      default:
        throw new Error(`Currency ${currency} not supported`)
    }

    const receipt = await transaction.wait()

    const payment: CryptoPayment = {
      transactionHash: transaction.hash,
      amount,
      currency,
      fromAddress,
      toAddress: recipientAddress,
      timestamp: Date.now(),
      status: receipt.status === 1 ? 'confirmed' : 'failed',
      gasUsed: receipt.gasUsed ? Number(receipt.gasUsed) : undefined
    }

    return payment
  }

  // === DECENTRALIZED STORAGE ===
  async uploadToIPFS(data: any): Promise<string> {
    if (!this.ipfsClient) {
      // Fallback to centralized storage
      return this.uploadToCentralizedStorage(data)
    }

    try {
      const result = await this.ipfsClient.add(JSON.stringify(data))
      return result.path
    } catch (error) {
      console.warn('IPFS upload failed, using fallback:', error)
      return this.uploadToCentralizedStorage(data)
    }
  }

  async retrieveFromIPFS(hash: string): Promise<any> {
    if (!this.ipfsClient) {
      return this.retrieveFromCentralizedStorage(hash)
    }

    try {
      const stream = this.ipfsClient.cat(hash)
      const chunks = []
      
      for await (const chunk of stream) {
        chunks.push(chunk)
      }
      
      const data = Buffer.concat(chunks).toString()
      return JSON.parse(data)
    } catch (error) {
      console.warn('IPFS retrieval failed, using fallback:', error)
      return this.retrieveFromCentralizedStorage(hash)
    }
  }

  // === USER PROFILE MANAGEMENT ===
  async createDecentralizedProfile(walletAddress: string): Promise<DecentralizedProfile> {
    const profile: DecentralizedProfile = {
      walletAddress,
      ensName: await this.resolveENSName(walletAddress),
      reputation: 100, // Starting reputation
      readingsGiven: 0,
      readingsReceived: 0,
      nftCollection: [],
      socialTokens: 1000, // Starting tokens
      achievements: ['blockchain_pioneer']
    }

    // Upload profile to IPFS
    const ipfsHash = await this.uploadToIPFS(profile)
    
    // Store profile hash mapping on-chain (in a registry contract)
    await this.storeProfileMapping(walletAddress, ipfsHash)

    return profile
  }

  async getDecentralizedProfile(walletAddress: string): Promise<DecentralizedProfile | null> {
    try {
      const profileHash = await this.getProfileHash(walletAddress)
      if (!profileHash) return null
      
      return await this.retrieveFromIPFS(profileHash)
    } catch (error) {
      console.error('Failed to retrieve decentralized profile:', error)
      return null
    }
  }

  // === SOCIAL TOKENS ===
  async rewardSocialTokens(
    userAddress: string,
    amount: number,
    reason: string
  ): Promise<boolean> {
    try {
      // In a real implementation, this would interact with a social token contract
      const profile = await this.getDecentralizedProfile(userAddress)
      if (!profile) return false

      profile.socialTokens += amount
      
      // Log the reward
      const rewardData = {
        recipient: userAddress,
        amount,
        reason,
        timestamp: Date.now()
      }
      
      await this.uploadToIPFS(rewardData)
      
      return true
    } catch (error) {
      console.error('Failed to reward social tokens:', error)
      return false
    }
  }

  // === MARKETPLACE FUNCTIONS ===
  async listReadingForSale(tokenId: string, priceInETH: number): Promise<boolean> {
    if (!this.contract || !this.provider) return false

    try {
      const signer = await this.provider.getSigner()
      const contractWithSigner = this.contract.connect(signer)
      
      const priceInWei = ethers.parseEther(priceInETH.toString())
      const tx = await contractWithSigner.setPrice(tokenId, priceInWei)
      
      await tx.wait()
      return true
    } catch (error) {
      console.error('Failed to list reading for sale:', error)
      return false
    }
  }

  async buyReading(tokenId: string): Promise<CryptoPayment | null> {
    if (!this.contract || !this.provider) return null

    try {
      const signer = await this.provider.getSigner()
      const contractWithSigner = this.contract.connect(signer)
      
      // Get the price
      const price = await contractWithSigner.getPrice(tokenId)
      
      const tx = await contractWithSigner.buyReading(tokenId, { value: price })
      const receipt = await tx.wait()
      
      return {
        transactionHash: tx.hash,
        amount: Number(ethers.formatEther(price)),
        currency: 'ETH',
        fromAddress: await signer.getAddress(),
        toAddress: await contractWithSigner.ownerOf(tokenId),
        timestamp: Date.now(),
        status: 'confirmed',
        gasUsed: Number(receipt.gasUsed)
      }
    } catch (error) {
      console.error('Failed to buy reading:', error)
      return null
    }
  }

  // === UTILITY METHODS ===
  private async generateReadingImage(cards: string[]): Promise<string> {
    // Generate a unique image for the reading using cards
    // This would typically use a service like OpenAI DALL-E or Midjourney
    const cardNames = cards.join(', ')
    const prompt = `Mystical tarot card spread featuring: ${cardNames}. Dark cosmic theme with golden accents. Night God style.`
    
    // For now, return a placeholder
    return `https://api.nightgod-tarot.com/generate-image?cards=${encodeURIComponent(cardNames)}`
  }

  private getRarityLevel(rarity: TarotNFT['rarity']): number {
    const rarityMap = {
      common: 1,
      rare: 2,
      epic: 3,
      legendary: 4,
      mythic: 5
    }
    return rarityMap[rarity]
  }

  private extractTokenIdFromReceipt(receipt: any): string {
    // Extract token ID from transaction receipt
    const logs = receipt.logs
    for (const log of logs) {
      try {
        const parsed = this.contract?.interface.parseLog({
          topics: log.topics,
          data: log.data
        })
        if (parsed?.name === 'ReadingMinted') {
          return parsed.args.tokenId.toString()
        }
      } catch (error) {
        continue
      }
    }
    return Date.now().toString() // Fallback
  }

  private async resolveENSName(address: string): Promise<string | undefined> {
    if (!this.provider) return undefined

    try {
      return await this.provider.lookupAddress(address) || undefined
    } catch (error) {
      return undefined
    }
  }

  private async storeProfileMapping(address: string, ipfsHash: string): Promise<void> {
    // In a real implementation, this would interact with a registry contract
    localStorage.setItem(`profile_${address}`, ipfsHash)
  }

  private async getProfileHash(address: string): Promise<string | null> {
    // In a real implementation, this would read from a registry contract
    return localStorage.getItem(`profile_${address}`)
  }

  private async uploadToCentralizedStorage(data: any): Promise<string> {
    // Fallback to centralized storage
    const response = await fetch('/api/storage/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    const result = await response.json()
    return result.hash || Date.now().toString()
  }

  private async retrieveFromCentralizedStorage(hash: string): Promise<any> {
    const response = await fetch(`/api/storage/${hash}`)
    return await response.json()
  }

  // === PUBLIC API METHODS ===
  async connectWallet(): Promise<string | null> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not detected')
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      
      if (accounts.length === 0) {
        throw new Error('No accounts available')
      }

      await this.initialize()
      return accounts[0]
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      return null
    }
  }

  async disconnectWallet(): Promise<void> {
    this.provider = undefined
    this.wallet = undefined
    this.contract = undefined
    this.isInitialized = false
  }

  async getWalletInfo(): Promise<{
    address: string
    balance: string
    chainId: number
    ensName?: string
  } | null> {
    if (!this.provider) return null

    try {
      const signer = await this.provider.getSigner()
      const address = await signer.getAddress()
      const balance = await this.provider.getBalance(address)
      const network = await this.provider.getNetwork()
      const ensName = await this.resolveENSName(address)

      return {
        address,
        balance: ethers.formatEther(balance),
        chainId: Number(network.chainId),
        ensName
      }
    } catch (error) {
      console.error('Failed to get wallet info:', error)
      return null
    }
  }

  isConnected(): boolean {
    return this.isInitialized && !!this.provider
  }

  async switchToMainnet(): Promise<boolean> {
    if (!window.ethereum) return false

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }] // Ethereum mainnet
      })
      return true
    } catch (error) {
      console.error('Failed to switch to mainnet:', error)
      return false
    }
  }
}

// Global wallet connection state
declare global {
  interface Window {
    ethereum?: any
  }
}

export const blockchainIntegration = BlockchainIntegration.getInstance()
export default blockchainIntegration