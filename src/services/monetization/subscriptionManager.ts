/**
 * Night God Tarot - Advanced Subscription & Monetization System
 * Professional revenue management with multiple payment methods
 */

import { ref, computed } from 'vue';

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  limits: {
    readingsPerDay: number;
    readingsPerMonth: number;
    aiModels: string[];
    languages: string[];
    exportFormats: string[];
    prioritySupport: boolean;
    customThemes: boolean;
    advancedInsights: boolean;
    historicalReadings: number;
  };
  popular?: boolean;
  discount?: number;
  stripePriceId?: string;
  paypalPlanId?: string;
}

export interface UserSubscription {
  userId: string;
  tierId: string;
  status: 'active' | 'canceled' | 'expired' | 'trial' | 'past_due';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: 'stripe' | 'paypal' | 'crypto' | 'apple' | 'google';
  transactionId?: string;
  trialEndsAt?: Date;
  usage: {
    readingsToday: number;
    readingsThisMonth: number;
    lastResetDate: Date;
  };
}

export interface PaymentProvider {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  testMode: boolean;
}

export class SubscriptionManager {
  private static instance: SubscriptionManager;
  
  private currentSubscription = ref<UserSubscription | null>(null);
  private availableTiers = ref<SubscriptionTier[]>([]);
  private paymentProviders = ref<PaymentProvider[]>([]);
  private isLoading = ref(false);

  private constructor() {
    this.initializeSubscriptionTiers();
    this.initializePaymentProviders();
    this.loadUserSubscription();
  }

  static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager();
    }
    return SubscriptionManager.instance;
  }

  private initializeSubscriptionTiers() {
    this.availableTiers.value = [
      {
        id: 'free',
        name: 'Seeker',
        description: 'Perfect for occasional spiritual guidance',
        price: 0,
        currency: 'USD',
        billingCycle: 'monthly',
        features: [
          '3 readings per day',
          'Basic AI interpretation',
          'Standard card deck (78 cards)',
          'English language only',
          'Basic themes',
          'Limited export options'
        ],
        limits: {
          readingsPerDay: 3,
          readingsPerMonth: 90,
          aiModels: ['gpt-3.5-turbo'],
          languages: ['en'],
          exportFormats: ['text'],
          prioritySupport: false,
          customThemes: false,
          advancedInsights: false,
          historicalReadings: 30
        }
      },
      {
        id: 'mystic',
        name: 'Mystic Oracle',
        description: 'Enhanced spiritual journey with AI insights',
        price: 9.99,
        currency: 'USD',
        billingCycle: 'monthly',
        features: [
          'Unlimited daily readings',
          'Multi-AI model analysis',
          'Full tarot deck (94 cards)',
          '3 language support',
          'Premium themes',
          'PDF export',
          'Reading history (1 year)',
          'Priority processing'
        ],
        limits: {
          readingsPerDay: -1,
          readingsPerMonth: -1,
          aiModels: ['gpt-4', 'claude-3', 'gemini-pro'],
          languages: ['en', 'zh', 'ja'],
          exportFormats: ['text', 'pdf', 'json'],
          prioritySupport: true,
          customThemes: true,
          advancedInsights: true,
          historicalReadings: 365
        },
        popular: true,
        stripePriceId: 'price_mystic_monthly',
        paypalPlanId: 'P-mystic-monthly'
      },
      {
        id: 'sage',
        name: 'Cosmic Sage',
        description: 'Ultimate tarot experience for serious practitioners',
        price: 19.99,
        currency: 'USD',
        billingCycle: 'monthly',
        features: [
          'Everything in Mystic Oracle',
          'Advanced AI consensus reading',
          'Voice synthesis narration',
          'Custom card creation',
          'White-label readings',
          'API access',
          'Unlimited export formats',
          'Lifetime reading archive',
          '24/7 priority support',
          'Early access to new features'
        ],
        limits: {
          readingsPerDay: -1,
          readingsPerMonth: -1,
          aiModels: ['gpt-4o', 'claude-3.5-sonnet', 'gemini-pro', 'deepseek-chat'],
          languages: ['en', 'zh', 'ja', 'es', 'fr'],
          exportFormats: ['text', 'pdf', 'json', 'epub', 'audio'],
          prioritySupport: true,
          customThemes: true,
          advancedInsights: true,
          historicalReadings: -1
        },
        stripePriceId: 'price_sage_monthly',
        paypalPlanId: 'P-sage-monthly'
      },
      {
        id: 'mystic_yearly',
        name: 'Mystic Oracle (Yearly)',
        description: 'Save 40% with annual billing',
        price: 59.99,
        currency: 'USD',
        billingCycle: 'yearly',
        features: [
          'All Mystic Oracle features',
          '40% savings vs monthly',
          '2 bonus months free',
          'Annual gift readings',
          'Exclusive yearly themes'
        ],
        limits: {
          readingsPerDay: -1,
          readingsPerMonth: -1,
          aiModels: ['gpt-4', 'claude-3', 'gemini-pro'],
          languages: ['en', 'zh', 'ja'],
          exportFormats: ['text', 'pdf', 'json'],
          prioritySupport: true,
          customThemes: true,
          advancedInsights: true,
          historicalReadings: 365
        },
        discount: 40,
        stripePriceId: 'price_mystic_yearly',
        paypalPlanId: 'P-mystic-yearly'
      },
      {
        id: 'lifetime',
        name: 'Eternal Wisdom',
        description: 'One-time payment for lifetime access',
        price: 299.99,
        currency: 'USD',
        billingCycle: 'lifetime',
        features: [
          'All Cosmic Sage features',
          'Lifetime access',
          'No recurring payments',
          'Exclusive lifetime badge',
          'Special community access',
          'Founder benefits',
          'Future updates included'
        ],
        limits: {
          readingsPerDay: -1,
          readingsPerMonth: -1,
          aiModels: ['gpt-4o', 'claude-3.5-sonnet', 'gemini-pro', 'deepseek-chat'],
          languages: ['en', 'zh', 'ja', 'es', 'fr', 'de', 'it'],
          exportFormats: ['text', 'pdf', 'json', 'epub', 'audio', 'video'],
          prioritySupport: true,
          customThemes: true,
          advancedInsights: true,
          historicalReadings: -1
        },
        stripePriceId: 'price_lifetime',
        paypalPlanId: 'P-lifetime'
      }
    ];
  }

  private initializePaymentProviders() {
    this.paymentProviders.value = [
      {
        id: 'stripe',
        name: 'Credit/Debit Card',
        icon: '💳',
        enabled: true,
        testMode: process.env.NODE_ENV !== 'production'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        icon: '🅿️',
        enabled: true,
        testMode: process.env.NODE_ENV !== 'production'
      },
      {
        id: 'crypto',
        name: 'Cryptocurrency',
        icon: '₿',
        enabled: false, // Enable when crypto integration is ready
        testMode: true
      },
      {
        id: 'apple',
        name: 'Apple Pay',
        icon: '🍎',
        enabled: false, // Enable for mobile app
        testMode: true
      },
      {
        id: 'google',
        name: 'Google Pay',
        icon: '🔵',
        enabled: false, // Enable for mobile app
        testMode: true
      }
    ];
  }

  private loadUserSubscription() {
    // Load from localStorage for demo purposes
    const saved = localStorage.getItem('nightgod_subscription');
    if (saved) {
      const data = JSON.parse(saved);
      this.currentSubscription.value = {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        trialEndsAt: data.trialEndsAt ? new Date(data.trialEndsAt) : undefined,
        usage: {
          ...data.usage,
          lastResetDate: new Date(data.usage.lastResetDate)
        }
      };
    } else {
      // Set default free tier
      this.currentSubscription.value = {
        userId: 'demo-user',
        tierId: 'free',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        autoRenew: false,
        paymentMethod: 'stripe',
        usage: {
          readingsToday: 0,
          readingsThisMonth: 0,
          lastResetDate: new Date()
        }
      };
      this.saveUserSubscription();
    }
  }

  private saveUserSubscription() {
    if (this.currentSubscription.value) {
      localStorage.setItem('nightgod_subscription', JSON.stringify(this.currentSubscription.value));
    }
  }

  // Public API
  public getAvailableTiers(): SubscriptionTier[] {
    return this.availableTiers.value;
  }

  public getCurrentTier(): SubscriptionTier | null {
    if (!this.currentSubscription.value) return null;
    return this.availableTiers.value.find(tier => tier.id === this.currentSubscription.value?.tierId) || null;
  }

  public getCurrentSubscription(): UserSubscription | null {
    return this.currentSubscription.value;
  }

  public getPaymentProviders(): PaymentProvider[] {
    return this.paymentProviders.value.filter(provider => provider.enabled);
  }

  // Check if user has access to a feature
  public hasFeature(feature: keyof SubscriptionTier['limits']): boolean {
    const currentTier = this.getCurrentTier();
    if (!currentTier || !this.currentSubscription.value) return false;

    const subscription = this.currentSubscription.value;
    const limits = currentTier.limits;

    switch (feature) {
      case 'readingsPerDay':
        if (limits.readingsPerDay === -1) return true;
        this.resetUsageIfNeeded();
        return subscription.usage.readingsToday < limits.readingsPerDay;
      
      case 'readingsPerMonth':
        if (limits.readingsPerMonth === -1) return true;
        this.resetUsageIfNeeded();
        return subscription.usage.readingsThisMonth < limits.readingsPerMonth;
      
      default:
        return !!limits[feature];
    }
  }

  // Check reading limits
  public canPerformReading(): { allowed: boolean; reason?: string } {
    const currentTier = this.getCurrentTier();
    if (!currentTier || !this.currentSubscription.value) {
      return { allowed: false, reason: 'No active subscription' };
    }

    if (this.currentSubscription.value.status !== 'active') {
      return { allowed: false, reason: 'Subscription not active' };
    }

    this.resetUsageIfNeeded();
    
    const limits = currentTier.limits;
    const usage = this.currentSubscription.value.usage;

    if (limits.readingsPerDay !== -1 && usage.readingsToday >= limits.readingsPerDay) {
      return { allowed: false, reason: 'Daily reading limit reached' };
    }

    if (limits.readingsPerMonth !== -1 && usage.readingsThisMonth >= limits.readingsPerMonth) {
      return { allowed: false, reason: 'Monthly reading limit reached' };
    }

    return { allowed: true };
  }

  // Record a reading
  public recordReading() {
    if (!this.currentSubscription.value) return;

    this.resetUsageIfNeeded();
    this.currentSubscription.value.usage.readingsToday++;
    this.currentSubscription.value.usage.readingsThisMonth++;
    this.saveUserSubscription();
  }

  // Reset usage counters if needed
  private resetUsageIfNeeded() {
    if (!this.currentSubscription.value) return;

    const now = new Date();
    const lastReset = this.currentSubscription.value.usage.lastResetDate;
    
    // Reset daily counter
    if (now.getDate() !== lastReset.getDate() || 
        now.getMonth() !== lastReset.getMonth() || 
        now.getFullYear() !== lastReset.getFullYear()) {
      this.currentSubscription.value.usage.readingsToday = 0;
    }
    
    // Reset monthly counter
    if (now.getMonth() !== lastReset.getMonth() || 
        now.getFullYear() !== lastReset.getFullYear()) {
      this.currentSubscription.value.usage.readingsThisMonth = 0;
    }
    
    this.currentSubscription.value.usage.lastResetDate = now;
    this.saveUserSubscription();
  }

  // Subscription management
  public async subscribe(tierId: string, paymentProvider: string): Promise<{ success: boolean; error?: string; redirectUrl?: string }> {
    this.isLoading.value = true;
    
    try {
      const tier = this.availableTiers.value.find(t => t.id === tierId);
      if (!tier) {
        throw new Error('Invalid subscription tier');
      }

      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In production, this would integrate with actual payment processors
      switch (paymentProvider) {
        case 'stripe':
          return await this.processStripePayment(tier);
        case 'paypal':
          return await this.processPayPalPayment(tier);
        case 'crypto':
          return await this.processCryptoPayment(tier);
        default:
          throw new Error('Unsupported payment provider');
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    } finally {
      this.isLoading.value = false;
    }
  }

  private async processStripePayment(tier: SubscriptionTier): Promise<{ success: boolean; redirectUrl?: string }> {
    // Mock Stripe integration
    console.log('Processing Stripe payment for tier:', tier.name);
    
    // In production, use Stripe Checkout or Elements
    const mockSuccess = Math.random() > 0.1; // 90% success rate for demo
    
    if (mockSuccess) {
      this.updateSubscription(tier.id, 'stripe');
      return { success: true };
    } else {
      throw new Error('Payment failed. Please try again.');
    }
  }

  private async processPayPalPayment(tier: SubscriptionTier): Promise<{ success: boolean; redirectUrl?: string }> {
    // Mock PayPal integration
    console.log('Processing PayPal payment for tier:', tier.name);
    
    // In production, redirect to PayPal checkout
    const mockSuccess = Math.random() > 0.15; // 85% success rate for demo
    
    if (mockSuccess) {
      this.updateSubscription(tier.id, 'paypal');
      return { success: true, redirectUrl: 'https://paypal.com/checkout/...' };
    } else {
      throw new Error('PayPal payment canceled or failed');
    }
  }

  private async processCryptoPayment(tier: SubscriptionTier): Promise<{ success: boolean; redirectUrl?: string }> {
    // Mock cryptocurrency payment
    console.log('Processing crypto payment for tier:', tier.name);
    
    // In production, integrate with crypto payment processors
    const mockSuccess = Math.random() > 0.2; // 80% success rate for demo
    
    if (mockSuccess) {
      this.updateSubscription(tier.id, 'crypto');
      return { success: true };
    } else {
      throw new Error('Cryptocurrency payment failed or expired');
    }
  }

  private updateSubscription(tierId: string, paymentMethod: string) {
    if (!this.currentSubscription.value) return;

    const tier = this.availableTiers.value.find(t => t.id === tierId);
    if (!tier) return;

    const now = new Date();
    let endDate = new Date();

    switch (tier.billingCycle) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      case 'lifetime':
        endDate.setFullYear(endDate.getFullYear() + 100); // Effectively lifetime
        break;
    }

    this.currentSubscription.value = {
      ...this.currentSubscription.value,
      tierId,
      status: 'active',
      startDate: now,
      endDate,
      paymentMethod: paymentMethod as any,
      autoRenew: tier.billingCycle !== 'lifetime',
      transactionId: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    this.saveUserSubscription();
  }

  public async cancelSubscription(): Promise<{ success: boolean; error?: string }> {
    if (!this.currentSubscription.value) {
      return { success: false, error: 'No active subscription to cancel' };
    }

    this.isLoading.value = true;

    try {
      // Mock cancellation process
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.currentSubscription.value.status = 'canceled';
      this.currentSubscription.value.autoRenew = false;
      this.saveUserSubscription();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to cancel subscription' };
    } finally {
      this.isLoading.value = false;
    }
  }

  public async reactivateSubscription(): Promise<{ success: boolean; error?: string }> {
    if (!this.currentSubscription.value) {
      return { success: false, error: 'No subscription to reactivate' };
    }

    this.isLoading.value = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.currentSubscription.value.status = 'active';
      this.currentSubscription.value.autoRenew = true;
      this.saveUserSubscription();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to reactivate subscription' };
    } finally {
      this.isLoading.value = false;
    }
  }

  // Usage tracking
  public getRemainingReadings(): { daily: number; monthly: number } {
    const currentTier = this.getCurrentTier();
    if (!currentTier || !this.currentSubscription.value) {
      return { daily: 0, monthly: 0 };
    }

    this.resetUsageIfNeeded();
    const usage = this.currentSubscription.value.usage;
    const limits = currentTier.limits;

    return {
      daily: limits.readingsPerDay === -1 ? -1 : Math.max(0, limits.readingsPerDay - usage.readingsToday),
      monthly: limits.readingsPerMonth === -1 ? -1 : Math.max(0, limits.readingsPerMonth - usage.readingsThisMonth)
    };
  }

  // Computed properties
  public get isLoading(): boolean {
    return this.isLoading.value;
  }

  public get isSubscribed(): boolean {
    return this.currentSubscription.value?.tierId !== 'free' && 
           this.currentSubscription.value?.status === 'active';
  }

  public get isPremium(): boolean {
    return ['mystic', 'mystic_yearly', 'sage', 'lifetime'].includes(
      this.currentSubscription.value?.tierId || ''
    );
  }

  public get subscriptionExpiry(): Date | null {
    return this.currentSubscription.value?.endDate || null;
  }

  // Analytics for subscription optimization
  public getSubscriptionAnalytics() {
    return {
      currentTier: this.getCurrentTier()?.name || 'Free',
      daysRemaining: this.subscriptionExpiry ? 
        Math.ceil((this.subscriptionExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null,
      usagePercentage: {
        daily: this.calculateUsagePercentage('daily'),
        monthly: this.calculateUsagePercentage('monthly')
      },
      recommendedUpgrade: this.getRecommendedUpgrade()
    };
  }

  private calculateUsagePercentage(period: 'daily' | 'monthly'): number {
    const currentTier = this.getCurrentTier();
    if (!currentTier || !this.currentSubscription.value) return 0;

    const usage = this.currentSubscription.value.usage;
    const limits = currentTier.limits;

    if (period === 'daily') {
      return limits.readingsPerDay === -1 ? 0 : (usage.readingsToday / limits.readingsPerDay) * 100;
    } else {
      return limits.readingsPerMonth === -1 ? 0 : (usage.readingsThisMonth / limits.readingsPerMonth) * 100;
    }
  }

  private getRecommendedUpgrade(): string | null {
    const currentTier = this.getCurrentTier();
    if (!currentTier) return null;

    const usageDaily = this.calculateUsagePercentage('daily');
    const usageMonthly = this.calculateUsagePercentage('monthly');

    if (currentTier.id === 'free' && (usageDaily > 80 || usageMonthly > 80)) {
      return 'mystic';
    }

    if (currentTier.id === 'mystic' && (usageDaily > 90 || usageMonthly > 90)) {
      return 'sage';
    }

    return null;
  }
}

export const subscriptionManager = SubscriptionManager.getInstance();