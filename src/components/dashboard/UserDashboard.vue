<template>
  <div class="dashboard-cosmos">
    <!-- Cosmic Background -->
    <div class="dashboard-background">
      <div class="floating-runes" v-for="i in 8" :key="i" :style="getRuneStyle(i)">
        {{ mysticalRunes[i % mysticalRunes.length] }}
      </div>
    </div>

    <!-- Dashboard Header -->
    <header class="dashboard-header">
      <div class="user-avatar-section">
        <div class="avatar-container" :class="getUserRankClass()">
          <img :src="userAvatar" :alt="userData.name" class="user-avatar" />
          <div class="avatar-aura" :class="getUserRankClass()"></div>
          <div class="level-badge">{{ userData.level }}</div>
        </div>
        <div class="user-info">
          <h2 class="user-name">{{ userData.name }}</h2>
          <p class="soul-rank">{{ getSoulRank(userData.level) }}</p>
          <div class="next-rank-progress">
            <div class="progress-text">{{ $t('nextRank') }}: {{ getNextRank(userData.level) }}</div>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: rankProgress + '%' }">
                <span class="progress-percentage">{{ Math.round(rankProgress) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cosmic-time-display">
        <div class="time-section">
          <div class="current-time">{{ currentTime }}</div>
          <div class="cosmic-date">{{ cosmicDate }}</div>
        </div>
        <div class="lunar-phase-display">
          <div class="moon-icon" :class="currentMoonPhase.class">{{ currentMoonPhase.icon }}</div>
          <div class="moon-name">{{ currentMoonPhase.name }}</div>
        </div>
      </div>
    </header>

    <!-- Main Statistics Grid -->
    <section class="stats-constellation">
      <h3 class="section-title">{{ $t('mysticalJourney') }}</h3>
      
      <div class="stats-grid">
        <!-- Primary Stats -->
        <div class="stat-card primary" @click="showDetailModal('draws')">
          <div class="stat-icon">🎴</div>
          <div class="stat-value">{{ userData.stats.totalDraws.toLocaleString() }}</div>
          <div class="stat-label">{{ $t('cardsDrawn') }}</div>
          <div class="stat-trend" :class="getTrendClass(userData.stats.drawsTrend)">
            {{ formatTrend(userData.stats.drawsTrend) }}
          </div>
        </div>

        <div class="stat-card primary" @click="showDetailModal('streak')">
          <div class="stat-icon">🔥</div>
          <div class="stat-value">{{ userData.stats.currentStreak }}</div>
          <div class="stat-label">{{ $t('dayStreak') }}</div>
          <div class="stat-trend" :class="getTrendClass(userData.stats.streakTrend)">
            {{ $t('bestStreak') }}: {{ userData.stats.bestStreak }}
          </div>
        </div>

        <div class="stat-card primary" @click="showDetailModal('readings')">
          <div class="stat-icon">📖</div>
          <div class="stat-value">{{ userData.stats.totalReadings }}</div>
          <div class="stat-label">{{ $t('readingsCompleted') }}</div>
          <div class="stat-trend positive">
            {{ $t('thisWeek') }}: +{{ userData.stats.weeklyReadings }}
          </div>
        </div>

        <div class="stat-card primary" @click="showDetailModal('accuracy')">
          <div class="stat-icon">🎯</div>
          <div class="stat-value">{{ userData.stats.accuracy }}%</div>
          <div class="stat-label">{{ $t('divineAccuracy') }}</div>
          <div class="stat-trend" :class="getTrendClass(userData.stats.accuracyTrend)">
            {{ formatTrend(userData.stats.accuracyTrend) }}
          </div>
        </div>

        <!-- Secondary Stats -->
        <div class="stat-card secondary">
          <div class="stat-icon">⭐</div>
          <div class="stat-value">{{ userData.stats.uniqueCards }}</div>
          <div class="stat-label">{{ $t('uniqueCards') }}</div>
          <div class="completion-bar">
            <div class="completion-progress" :style="{ width: cardCompletionPercentage + '%' }"></div>
            <span class="completion-text">{{ cardCompletionPercentage }}% {{ $t('complete') }}</span>
          </div>
        </div>

        <div class="stat-card secondary">
          <div class="stat-icon">🏆</div>
          <div class="stat-value">{{ userData.achievements.length }}</div>
          <div class="stat-label">{{ $t('achievementsUnlocked') }}</div>
          <div class="recent-achievement" v-if="userData.achievements.length > 0">
            <span class="achievement-icon">{{ getLatestAchievement().icon }}</span>
            <span class="achievement-name">{{ getLatestAchievement().name }}</span>
          </div>
        </div>

        <div class="stat-card secondary">
          <div class="stat-icon">🌟</div>
          <div class="stat-value">{{ userData.stats.favoriteCard || 'None' }}</div>
          <div class="stat-label">{{ $t('favoriteCard') }}</div>
          <div class="card-affinity">
            {{ $t('drawnTimes', { count: userData.stats.favoriteCardCount }) }}
          </div>
        </div>

        <div class="stat-card secondary">
          <div class="stat-icon">💎</div>
          <div class="stat-value">{{ userData.subscription.tier }}</div>
          <div class="stat-label">{{ $t('currentTier') }}</div>
          <div class="subscription-info">
            <span v-if="userData.subscription.daysRemaining > 0">
              {{ userData.subscription.daysRemaining }} {{ $t('daysRemaining') }}
            </span>
            <span v-else class="upgrade-prompt" @click="showUpgradeModal">
              {{ $t('upgradeNow') }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- AI Usage Analytics -->
    <section class="ai-analytics-section" v-if="showAIAnalytics">
      <h3 class="section-title">{{ $t('aiInsights') }}</h3>
      
      <div class="analytics-grid">
        <div class="analytics-card">
          <div class="analytics-header">
            <h4>{{ $t('tokenUsage') }}</h4>
            <div class="usage-period">{{ $t('thisMonth') }}</div>
          </div>
          <div class="usage-chart">
            <!-- Simplified usage visualization -->
            <div class="usage-bars">
              <div 
                v-for="day in last7Days" 
                :key="day.date"
                class="usage-bar"
                :style="{ height: (day.usage / maxDailyUsage * 100) + '%' }"
                :title="`${day.date}: ${day.usage} tokens`"
              ></div>
            </div>
            <div class="usage-labels">
              <span>{{ $t('used') }}: {{ tokenUsage.used.toLocaleString() }}</span>
              <span>{{ $t('remaining') }}: {{ tokenUsage.remaining.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <div class="analytics-card">
          <div class="analytics-header">
            <h4>{{ $t('readingTypes') }}</h4>
          </div>
          <div class="reading-types-chart">
            <div 
              v-for="type in readingTypes" 
              :key="type.name"
              class="reading-type-bar"
            >
              <div class="type-label">{{ type.name }}</div>
              <div class="type-bar-container">
                <div 
                  class="type-bar" 
                  :style="{ 
                    width: (type.count / maxReadingType * 100) + '%',
                    backgroundColor: type.color 
                  }"
                ></div>
                <span class="type-count">{{ type.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="analytics-card">
          <div class="analytics-header">
            <h4>{{ $t('accuracyTrend') }}</h4>
          </div>
          <div class="accuracy-trend">
            <div class="trend-line">
              <svg viewBox="0 0 200 100" class="trend-svg">
                <path 
                  :d="accuracyTrendPath" 
                  fill="none" 
                  stroke="#ffd700" 
                  stroke-width="2"
                  class="trend-path"
                />
                <circle 
                  v-for="(point, index) in accuracyPoints" 
                  :key="index"
                  :cx="point.x" 
                  :cy="point.y" 
                  r="3" 
                  fill="#ffd700"
                  class="trend-point"
                />
              </svg>
            </div>
            <div class="trend-stats">
              <div class="trend-stat">
                <span class="trend-label">{{ $t('average') }}</span>
                <span class="trend-value">{{ averageAccuracy }}%</span>
              </div>
              <div class="trend-stat">
                <span class="trend-label">{{ $t('improvement') }}</span>
                <span class="trend-value positive">+{{ accuracyImprovement }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Activity Feed -->
    <section class="activity-stream">
      <h3 class="section-title">{{ $t('recentActivity') }}</h3>
      
      <div class="activity-timeline">
        <div 
          v-for="activity in recentActivities" 
          :key="activity.id"
          class="activity-item"
          :class="activity.type"
        >
          <div class="activity-icon">{{ getActivityIcon(activity.type) }}</div>
          <div class="activity-content">
            <div class="activity-description">{{ activity.description }}</div>
            <div class="activity-timestamp">{{ formatTimestamp(activity.timestamp) }}</div>
          </div>
          <div class="activity-reward" v-if="activity.reward">
            <span class="reward-icon">{{ activity.reward.icon }}</span>
            <span class="reward-text">{{ activity.reward.text }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Achievements Showcase -->
    <section class="achievements-gallery" v-if="userData.achievements.length > 0">
      <h3 class="section-title">{{ $t('achievementGallery') }}</h3>
      
      <div class="achievements-grid">
        <div 
          v-for="achievement in displayAchievements" 
          :key="achievement.id"
          class="achievement-card"
          :class="achievement.rarity"
          @click="showAchievementDetails(achievement)"
        >
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div class="achievement-info">
            <h4 class="achievement-name">{{ achievement.name }}</h4>
            <p class="achievement-description">{{ achievement.description }}</p>
            <div class="achievement-date">{{ formatDate(achievement.unlockedAt) }}</div>
          </div>
          <div class="achievement-rarity-gem" :class="achievement.rarity"></div>
        </div>
      </div>
      
      <div class="view-all-achievements" v-if="userData.achievements.length > 6">
        <button class="btn-mystical" @click="showAllAchievements">
          {{ $t('viewAllAchievements') }} ({{ userData.achievements.length }})
        </button>
      </div>
    </section>

    <!-- Quick Actions Panel -->
    <section class="quick-actions">
      <h3 class="section-title">{{ $t('quickActions') }}</h3>
      
      <div class="actions-grid">
        <button class="action-btn primary" @click="startQuickReading">
          <span class="action-icon">🔮</span>
          <span class="action-text">{{ $t('quickReading') }}</span>
        </button>
        
        <button class="action-btn secondary" @click="viewCardCollection">
          <span class="action-icon">🎴</span>
          <span class="action-text">{{ $t('cardCollection') }}</span>
        </button>
        
        <button class="action-btn secondary" @click="shareProgress">
          <span class="action-icon">📤</span>
          <span class="action-text">{{ $t('shareProgress') }}</span>
        </button>
        
        <button class="action-btn vip" @click="exploreVIP" v-if="!isVIPMember">
          <span class="action-icon">👑</span>
          <span class="action-text">{{ $t('exploreVIP') }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTarotStore } from '@/stores/tarot'

const { t } = useI18n()
const tarotStore = useTarotStore()

// Props
interface Props {
  showAIAnalytics?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAIAnalytics: true
})

// State
const currentTime = ref('')
const currentDate = ref(new Date())
const mysticalRunes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ']

// Mock user data (would come from store/API)
const userData = ref({
  name: 'Mystic Seeker',
  email: 'seeker@nightgod.tarot',
  level: 7,
  experience: 2450,
  experienceToNext: 3000,
  joinDate: new Date('2024-01-15'),
  stats: {
    totalDraws: 127,
    currentStreak: 5,
    bestStreak: 12,
    totalReadings: 43,
    weeklyReadings: 8,
    accuracy: 87,
    uniqueCards: 34,
    favoriteCard: 'The Moon',
    favoriteCardCount: 7,
    drawsTrend: 12,
    streakTrend: 2,
    accuracyTrend: 5
  },
  subscription: {
    tier: 'Mystic',
    daysRemaining: 23,
    renewalDate: new Date('2024-12-15')
  },
  achievements: [
    {
      id: 'first_draw',
      name: 'First Steps',
      description: 'Drew your first tarot card',
      icon: '🌟',
      rarity: 'common',
      unlockedAt: new Date('2024-01-15')
    },
    {
      id: 'streak_7',
      name: 'Week Warrior',
      description: 'Maintained a 7-day streak',
      icon: '🔥',
      rarity: 'rare',
      unlockedAt: new Date('2024-02-10')
    },
    {
      id: 'accuracy_90',
      name: 'Divine Oracle',
      description: 'Achieved 90% accuracy',
      icon: '🎯',
      rarity: 'legendary',
      unlockedAt: new Date('2024-03-05')
    }
  ]
})

// Token usage data
const tokenUsage = ref({
  used: 7543,
  remaining: 12457,
  dailyLimit: 1000,
  monthlyLimit: 20000
})

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    type: 'card_draw',
    description: 'Drew The Star - Hope and renewal guide your path',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    reward: { icon: '⭐', text: '+50 XP' }
  },
  {
    id: 2,
    type: 'streak',
    description: 'Maintained 5-day streak!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    reward: { icon: '🔥', text: 'Streak Bonus' }
  },
  {
    id: 3,
    type: 'achievement',
    description: 'Unlocked "Divine Oracle" achievement',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    reward: { icon: '🏆', text: 'Achievement Badge' }
  }
])

// Usage analytics
const last7Days = ref([
  { date: 'Mon', usage: 850 },
  { date: 'Tue', usage: 920 },
  { date: 'Wed', usage: 780 },
  { date: 'Thu', usage: 1200 },
  { date: 'Fri', usage: 990 },
  { date: 'Sat', usage: 650 },
  { date: 'Sun', usage: 1100 }
])

const readingTypes = ref([
  { name: 'Quick Draw', count: 45, color: '#3b82f6' },
  { name: 'Celtic Cross', count: 23, color: '#8b5cf6' },
  { name: 'Love Reading', count: 18, color: '#ec4899' },
  { name: 'Career Focus', count: 12, color: '#10b981' }
])

// Computed properties
const userAvatar = computed(() => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.value.name}`
})

const rankProgress = computed(() => {
  return (userData.value.experience / userData.value.experienceToNext) * 100
})

const cardCompletionPercentage = computed(() => {
  const totalCards = 94 // Total cards in deck
  return Math.round((userData.value.stats.uniqueCards / totalCards) * 100)
})

const cosmicDate = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

const currentMoonPhase = computed(() => {
  // Simplified moon phase calculation
  const phases = [
    { name: 'New Moon', icon: '🌑', class: 'new-moon' },
    { name: 'Waxing Crescent', icon: '🌒', class: 'waxing-crescent' },
    { name: 'First Quarter', icon: '🌓', class: 'first-quarter' },
    { name: 'Waxing Gibbous', icon: '🌔', class: 'waxing-gibbous' },
    { name: 'Full Moon', icon: '🌕', class: 'full-moon' },
    { name: 'Waning Gibbous', icon: '🌖', class: 'waning-gibbous' },
    { name: 'Last Quarter', icon: '🌗', class: 'last-quarter' },
    { name: 'Waning Crescent', icon: '🌘', class: 'waning-crescent' }
  ]
  
  const phaseIndex = Math.floor(Math.random() * phases.length)
  return phases[phaseIndex]
})

const displayAchievements = computed(() => {
  return userData.value.achievements.slice(0, 6)
})

const isVIPMember = computed(() => {
  return ['Silver VIP', 'Gold VIP', 'Platinum VIP'].includes(userData.value.subscription.tier)
})

const maxDailyUsage = computed(() => {
  return Math.max(...last7Days.value.map(d => d.usage))
})

const maxReadingType = computed(() => {
  return Math.max(...readingTypes.value.map(t => t.count))
})

const averageAccuracy = computed(() => {
  return userData.value.stats.accuracy
})

const accuracyImprovement = computed(() => {
  return userData.value.stats.accuracyTrend
})

const accuracyPoints = ref([
  { x: 20, y: 80 },
  { x: 60, y: 70 },
  { x: 100, y: 60 },
  { x: 140, y: 45 },
  { x: 180, y: 30 }
])

const accuracyTrendPath = computed(() => {
  return accuracyPoints.value
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
})

// Methods
const getSoulRank = (level: number): string => {
  if (level < 5) return '🌱 Novice Seeker'
  if (level < 10) return '🔮 Mystic Apprentice'
  if (level < 20) return '⭐ Cosmic Oracle'
  if (level < 50) return '👑 Divine Master'
  return '✨ Ascended Being'
}

const getNextRank = (level: number): string => {
  if (level < 5) return 'Mystic Apprentice'
  if (level < 10) return 'Cosmic Oracle'
  if (level < 20) return 'Divine Master'
  if (level < 50) return 'Ascended Being'
  return 'Universal Consciousness'
}

const getUserRankClass = (): string => {
  const level = userData.value.level
  if (level < 5) return 'novice'
  if (level < 10) return 'apprentice'
  if (level < 20) return 'oracle'
  if (level < 50) return 'master'
  return 'ascended'
}

const getTrendClass = (trend: number): string => {
  return trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral'
}

const formatTrend = (trend: number): string => {
  const sign = trend > 0 ? '+' : ''
  return `${sign}${trend} this week`
}

const getLatestAchievement = () => {
  return userData.value.achievements[userData.value.achievements.length - 1]
}

const getActivityIcon = (type: string): string => {
  const icons: Record<string, string> = {
    card_draw: '🎴',
    streak: '🔥',
    achievement: '🏆',
    reading: '📖',
    level_up: '⭐'
  }
  return icons[type] || '✨'
}

const formatTimestamp = (timestamp: Date): string => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

const getRuneStyle = (index: number) => {
  const positions = [
    { top: '10%', left: '5%' },
    { top: '20%', right: '8%' },
    { top: '40%', left: '3%' },
    { top: '60%', right: '5%' },
    { top: '80%', left: '7%' },
    { top: '15%', left: '50%' },
    { top: '70%', right: '50%' },
    { top: '90%', left: '45%' }
  ]
  
  const pos = positions[index % positions.length]
  return {
    ...pos,
    animationDelay: `${index * 2}s`,
    fontSize: '2rem',
    opacity: '0.3'
  }
}

// Event handlers
const showDetailModal = (type: string) => {
  console.log('Show detail modal for:', type)
  // Implementation would show detailed statistics
}

const showUpgradeModal = () => {
  console.log('Show upgrade modal')
  // Implementation would show upgrade options
}

const showAchievementDetails = (achievement: any) => {
  console.log('Show achievement details:', achievement)
  // Implementation would show achievement details
}

const showAllAchievements = () => {
  console.log('Show all achievements')
  // Implementation would show full achievements list
}

const startQuickReading = () => {
  console.log('Start quick reading')
  // Implementation would start a quick tarot reading
}

const viewCardCollection = () => {
  console.log('View card collection')
  // Implementation would show user's card collection
}

const shareProgress = () => {
  console.log('Share progress')
  // Implementation would share user's progress
}

const exploreVIP = () => {
  console.log('Explore VIP')
  // Implementation would show VIP options
}

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit'
  })
}

// Lifecycle
let timeInterval: NodeJS.Timeout

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 60000) // Update every minute
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
@import './dashboard-styles.css';
</style>