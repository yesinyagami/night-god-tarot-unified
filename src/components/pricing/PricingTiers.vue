<template>
  <div class="pricing-universe">
    <!-- Cosmic Pricing Background -->
    <div class="pricing-cosmos">
      <div class="pricing-particles" v-for="i in 5" :key="i" :style="`animation-delay: ${i * 3}s`">
        {{ ['✨', '🌟', '⭐', '💫', '🌠'][i-1] }}
      </div>
    </div>

    <!-- Main Pricing Section -->
    <section class="pricing-realm">
      <div class="realm-header">
        <h2 class="realm-title">{{ t('chooseMysticalJourney') }}</h2>
        <p class="realm-subtitle">{{ t('unlockDivineWisdom') }}</p>
      </div>

      <!-- Progress Gamification -->
      <div class="progress-sanctuary" v-if="userProgress">
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: progressPercentage + '%' }">
            <span class="progress-text">{{ userProgress.current }}/{{ userProgress.target }} {{ t('dailyDraws') }}</span>
          </div>
        </div>
        
        <div class="milestone-indicators">
          <div 
            v-for="milestone in milestones" 
            :key="milestone.value"
            class="milestone"
            :class="{ achieved: userProgress.current >= milestone.value }"
          >
            <div class="milestone-dot"></div>
            <span>{{ milestone.label }}</span>
          </div>
        </div>
      </div>

      <!-- Pricing Grid -->
      <div class="pricing-grid">
        <!-- Seeker Tier (Free) -->
        <div class="price-card" :class="{ 'current-tier': currentTier === 'seeker' }">
          <div class="price-header">
            <div class="tier-icon">🌙</div>
            <div class="tier-name">{{ t('seeker') }}</div>
            <div class="price-display">
              <span class="current-price">{{ t('free') }}</span>
            </div>
            <p class="tier-tagline">{{ t('perfectForBeginners') }}</p>
          </div>
          
          <ul class="feature-list">
            <li v-for="feature in seekerFeatures" :key="feature">
              <span class="feature-icon">✨</span>
              <span>{{ feature }}</span>
            </li>
          </ul>
          
          <button 
            class="btn-tier btn-secondary"
            @click="selectTier('seeker')"
            :disabled="currentTier === 'seeker'"
          >
            {{ currentTier === 'seeker' ? t('currentPlan') : t('startFree') }}
          </button>
        </div>

        <!-- Mystic Tier (Most Popular) -->
        <div class="price-card featured">
          <div class="popular-badge">{{ t('mostPopular') }}</div>
          <div class="price-header">
            <div class="tier-icon">🔮</div>
            <div class="tier-name">{{ t('mystic') }}</div>
            <div class="price-display">
              <span class="original-price" v-if="prices.mystic.original">
                {{ formatPrice(prices.mystic.original) }}
              </span>
              <span class="current-price">{{ formatPrice(prices.mystic.current) }}</span>
            </div>
            <span class="savings-badge" v-if="prices.mystic.savings">
              {{ t('save') }} {{ prices.mystic.savings }}%
            </span>
            <p class="tier-tagline">{{ t('mostPopularChoice') }}</p>
          </div>
          
          <ul class="feature-list">
            <li v-for="feature in mysticFeatures" :key="feature">
              <span class="feature-icon">🎴</span>
              <span>{{ feature }}</span>
            </li>
          </ul>
          
          <button 
            class="btn-tier btn-primary"
            @click="selectTier('mystic')"
          >
            {{ t('unlockNow') }}
          </button>
        </div>

        <!-- Oracle Tier (Advanced) -->
        <div class="price-card">
          <div class="price-header">
            <div class="tier-icon">⚜️</div>
            <div class="tier-name">{{ t('oracle') }}</div>
            <div class="price-display">
              <span class="current-price">{{ formatPrice(prices.oracle.current) }}</span>
            </div>
            <p class="tier-tagline">{{ t('advancedInsights') }}</p>
          </div>
          
          <ul class="feature-list">
            <li v-for="feature in oracleFeatures" :key="feature">
              <span class="feature-icon">📚</span>
              <span>{{ feature }}</span>
            </li>
          </ul>
          
          <button 
            class="btn-tier btn-primary"
            @click="selectTier('oracle')"
          >
            {{ t('upgradeNow') }}
          </button>
        </div>
      </div>

      <!-- VIP Section -->
      <div class="vip-section" v-if="showVipSection">
        <div class="vip-header">
          <h3 class="vip-title">{{ t('vipExclusiveAccess') }}</h3>
          <p class="vip-subtitle">{{ t('invitationOnly') }}</p>
        </div>

        <div class="vip-grid">
          <!-- Silver VIP -->
          <div class="vip-card silver">
            <div class="vip-shine"></div>
            <div class="vip-content">
              <div class="vip-tier-name">
                <span class="vip-icon">🥈</span>
                {{ t('silverVip') }}
              </div>
              <div class="vip-price">
                {{ formatPrice(prices.vip.silver) }}
                <span class="vip-duration">/30 {{ t('days') }}</span>
              </div>
              <ul class="vip-features">
                <li v-for="feature in vipFeatures.silver" :key="feature">
                  {{ feature }}
                </li>
              </ul>
              <button 
                class="btn-vip btn-silver"
                @click="requestVipInvitation('silver')"
                :disabled="!canRequestVip"
              >
                {{ canRequestVip ? t('requestInvitation') : t('unlockAt100Draws') }}
              </button>
            </div>
          </div>

          <!-- Gold VIP -->
          <div class="vip-card gold">
            <div class="vip-shine"></div>
            <div class="vip-content">
              <div class="vip-tier-name">
                <span class="vip-icon">🥇</span>
                {{ t('goldVip') }}
              </div>
              <div class="vip-price">
                {{ formatPrice(prices.vip.gold) }}
                <span class="vip-duration">/30 {{ t('days') }}</span>
              </div>
              <ul class="vip-features">
                <li v-for="feature in vipFeatures.gold" :key="feature">
                  {{ feature }}
                </li>
              </ul>
              <button 
                class="btn-vip btn-gold"
                @click="requestVipInvitation('gold')"
                :disabled="!canRequestVip"
              >
                {{ canRequestVip ? t('requestInvitation') : t('unlockAt100Draws') }}
              </button>
            </div>
          </div>

          <!-- Platinum VIP -->
          <div class="vip-card platinum">
            <div class="vip-shine"></div>
            <div class="vip-content">
              <div class="vip-tier-name">
                <span class="vip-icon">💎</span>
                {{ t('platinumVip') }}
              </div>
              <div class="vip-price">
                {{ formatPrice(prices.vip.platinum) }}
                <span class="vip-duration">/30 {{ t('days') }}</span>
              </div>
              <ul class="vip-features">
                <li v-for="feature in vipFeatures.platinum" :key="feature">
                  {{ feature }}
                </li>
              </ul>
              <button 
                class="btn-vip btn-platinum"
                @click="requestVipInvitation('platinum')"
                :disabled="!canRequestVip"
              >
                {{ canRequestVip ? t('requestInvitation') : t('unlockAt100Draws') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Token Usage Display -->
      <div class="token-tracker" v-if="showTokenUsage">
        <h4>{{ t('aiTokenUsage') }}</h4>
        <div class="token-stats">
          <div class="token-stat">
            <span class="token-value">{{ tokenUsage.used }}</span>
            <span class="token-label">{{ t('tokensUsed') }}</span>
          </div>
          <div class="token-stat">
            <span class="token-value">{{ tokenUsage.remaining }}</span>
            <span class="token-label">{{ t('tokensRemaining') }}</span>
          </div>
          <div class="token-stat">
            <span class="token-value">{{ tokenUsage.dailyLimit }}</span>
            <span class="token-label">{{ t('dailyLimit') }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTarotStore } from '@/stores/tarot'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const tarotStore = useTarotStore()
const router = useRouter()

// State
const currentTier = ref('seeker')
const showVipSection = ref(false)
const showTokenUsage = ref(false)

// User Progress
const userProgress = ref({
  current: 7,
  target: 20,
  totalDraws: 93,
  streak: 3
})

// Pricing Data
const prices = ref({
  mystic: {
    original: 399,
    current: 299,
    savings: 25,
    currency: 'NT$'
  },
  oracle: {
    current: 499,
    currency: 'NT$'
  },
  vip: {
    silver: 1599,
    gold: 2999,
    platinum: 4999,
    currency: 'NT$'
  }
})

// Features Lists
const seekerFeatures = [
  '1-3 Daily Card Draws',
  'Holy Triangle Spread',
  '500-word Interpretations', 
  'Reward after 20 draws',
  '3 AI Q&A per day'
]

const mysticFeatures = [
  '5-Card Spreads',
  'Upright/Reversed Meanings',
  '1,000-word AI Reports',
  '5 AI Q&A Sessions',
  'Priority Support',
  'Card Memory System'
]

const oracleFeatures = [
  'Celtic Cross Spread',
  'Multi-AI Validation',
  'Story Integration',
  'Unlimited Q&A',
  'Life Goal Guidance',
  'Weather Integration'
]

const vipFeatures = ref({
  silver: [
    '5 Daily Q&A Sessions',
    'Hidden Card Access',
    'Khrael Translation',
    'Custom Spreads',
    'Healing Stories'
  ],
  gold: [
    '10 Daily Q&A Sessions',
    'Daily AI Reports',
    '3 Story Branches',
    'Life Goal Assistant',
    'Deep Insights',
    'Monica AI Priority'
  ],
  platinum: [
    'All Algorithms (3x daily)',
    '5 Khrael Courses',
    'Exclusive Stories',
    'Luxury Experience',
    'Ultimate Insights',
    'Personal AI Assistant'
  ]
})

// Token Usage
const tokenUsage = ref({
  used: 1247,
  remaining: 8753,
  dailyLimit: 10000
})

// Milestones
const milestones = [
  { value: 5, label: '5 Draws', reward: 'Bonus Card' },
  { value: 10, label: '10 Draws', reward: 'AI Insight' },
  { value: 15, label: '15 Draws', reward: 'Story Chapter' },
  { value: 20, label: '20 Draws', reward: 'Free Upgrade' }
]

// Computed
const progressPercentage = computed(() => {
  return (userProgress.value.current / userProgress.value.target) * 100
})

const canRequestVip = computed(() => {
  return userProgress.value.totalDraws >= 100
})

// Methods
const formatPrice = (price: number, currency = 'NT$') => {
  return `${currency}${price.toLocaleString()}`
}

const selectTier = async (tier: string) => {
  if (tier === 'seeker') {
    currentTier.value = tier
    return
  }

  // Track selection
  tarotStore.trackEvent('tier_selected', { tier })

  // Process payment
  const success = await processPayment(tier)
  if (success) {
    currentTier.value = tier
    showSuccessAnimation(tier)
    unlockTierFeatures(tier)
  }
}

const processPayment = async (tier: string) => {
  // Payment processing logic
  const tierPrices: Record<string, number> = {
    mystic: prices.value.mystic.current,
    oracle: prices.value.oracle.current
  }

  try {
    // Simulate payment flow
    const confirmed = confirm(`Upgrade to ${tier} tier for ${formatPrice(tierPrices[tier])}?`)
    
    if (confirmed) {
      // API call would go here
      await tarotStore.upgradeTier(tier)
      return true
    }
  } catch (error) {
    console.error('Payment failed:', error)
  }
  
  return false
}

const requestVipInvitation = async (level: string) => {
  if (!canRequestVip.value) {
    alert(`You need ${100 - userProgress.value.totalDraws} more draws to qualify for VIP`)
    return
  }

  // Process VIP request
  const vipPrice = (prices.value.vip as any)[level] as number
  const confirmed = confirm(`Request ${level} VIP access for ${formatPrice(vipPrice)}/30 days?`)
  
  if (confirmed) {
    await tarotStore.requestVipAccess(level)
    showVipWelcome(level)
  }
}

const showSuccessAnimation = (tier: string) => {
  // Create success animation
  const successEl = document.createElement('div')
  successEl.className = 'upgrade-success'
  const successIcon = document.createElement('div')
  successIcon.className = 'success-icon'
  successIcon.textContent = '✨'
  
  const successText = document.createElement('div')
  successText.className = 'success-text'
  successText.textContent = `Welcome to ${tier} tier!`
  
  successEl.appendChild(successIcon)
  successEl.appendChild(successText)
  document.body.appendChild(successEl)
  
  setTimeout(() => successEl.remove(), 3000)
}

const showVipWelcome = (level: string) => {
  // VIP welcome animation
  const vipEl = document.createElement('div')
  vipEl.className = 'vip-welcome'
  const vipCrown = document.createElement('div')
  vipCrown.className = 'vip-crown'
  vipCrown.textContent = '👑'
  
  const vipText = document.createElement('div')
  vipText.className = 'vip-text'
  vipText.textContent = `Welcome to ${level} VIP!`
  
  const vipSubtitle = document.createElement('div')
  vipSubtitle.className = 'vip-subtitle'
  vipSubtitle.textContent = 'Your exclusive access is now active'
  
  vipEl.appendChild(vipCrown)
  vipEl.appendChild(vipText)
  vipEl.appendChild(vipSubtitle)
  document.body.appendChild(vipEl)
  
  setTimeout(() => vipEl.remove(), 5000)
}

const unlockTierFeatures = (tier: string) => {
  // Unlock features based on tier
  const features: Record<string, string[]> = {
    mystic: ['5-card-spread', 'upright-reversed', '1000-words', '5-qa'],
    oracle: ['celtic-cross', 'multi-ai', 'story-integration', 'unlimited-qa']
  }
  
  if (features[tier]) {
    tarotStore.unlockFeatures(features[tier])
  }
}

// Lifecycle
onMounted(() => {
  // Load user data
  const userData = tarotStore.getUserData()
  if (userData) {
    currentTier.value = (userData as any).subscription || 'seeker'
    userProgress.value = (userData as any).progress || userProgress.value
    showVipSection.value = (userData as any).totalDraws >= 50
    showTokenUsage.value = (userData as any).subscription !== 'seeker'
  }
})
</script>

<style scoped>
@import './pricing-styles.css';
</style>