<template>
  <div class="mystical-interface">
    <!-- Cosmic Background Effects -->
    <div class="cosmic-background">
      <div class="stars-layer" ref="starsContainer"></div>
      <div class="nebula-layer"></div>
      <div class="aurora-layer"></div>
    </div>

    <!-- Sacred Geometry Overlay -->
    <div class="sacred-geometry">
      <svg class="geometry-pattern" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FFD700;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#FFA500;stop-opacity:0.3" />
          </linearGradient>
        </defs>
        
        <!-- Metatron's Cube -->
        <g class="metatron-cube" :class="{ active: isReading }">
          <circle cx="400" cy="300" r="100" fill="none" stroke="url(#goldGradient)" stroke-width="2" opacity="0.6"/>
          <circle cx="400" cy="300" r="150" fill="none" stroke="url(#goldGradient)" stroke-width="1" opacity="0.4"/>
          <circle cx="400" cy="300" r="200" fill="none" stroke="url(#goldGradient)" stroke-width="1" opacity="0.2"/>
          
          <!-- Sacred lines connecting the geometry -->
          <line x1="300" y1="200" x2="500" y2="400" stroke="url(#goldGradient)" stroke-width="1" opacity="0.3"/>
          <line x1="500" y1="200" x2="300" y2="400" stroke="url(#goldGradient)" stroke-width="1" opacity="0.3"/>
          <line x1="400" y1="150" x2="400" y2="450" stroke="url(#goldGradient)" stroke-width="1" opacity="0.3"/>
          <line x1="250" y1="300" x2="550" y2="300" stroke="url(#goldGradient)" stroke-width="1" opacity="0.3"/>
        </g>
      </svg>
    </div>

    <!-- Mystical Header -->
    <header class="mystical-header">
      <div class="header-content">
        <div class="brand-symbol">
          <div class="moon-phases">
            <span class="phase">🌑</span>
            <span class="phase active">🌙</span>
            <span class="phase">🌕</span>
          </div>
          <h1 class="brand-title">夜神塔羅</h1>
          <div class="subtitle">AI驅動的神秘占卜宇宙</div>
        </div>
        
        <!-- User Level Display -->
        <div class="user-level-widget">
          <div class="level-circle">
            <div class="level-number">{{ userLevel }}</div>
            <div class="level-ring"></div>
          </div>
          <div class="level-info">
            <div class="level-title">{{ getLevelTitle(userLevel) }}</div>
            <div class="experience-bar">
              <div class="exp-fill" :style="{ width: experiencePercentage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Divination Interface -->
    <main class="divination-main">
      <!-- Quick Action Portal -->
      <div class="action-portal">
        <button 
          @click="startQuickReading"
          class="portal-btn primary"
          :class="{ pulsing: isReady }"
        >
          <div class="btn-icon">🔮</div>
          <div class="btn-text">神諭開啟</div>
          <div class="btn-energy"></div>
        </button>
        
        <div class="portal-options">
          <button @click="openCardLibrary" class="portal-btn secondary">
            <span class="icon">🎴</span>
            <span>牌庫探索</span>
          </button>
          
          <button @click="viewHistory" class="portal-btn secondary">
            <span class="icon">📜</span>
            <span>占卜歷史</span>
          </button>
          
          <button @click="openSettings" class="portal-btn secondary">
            <span class="icon">⚙️</span>
            <span>系統設定</span>
          </button>
        </div>
      </div>

      <!-- Enhanced Card Display -->
      <div v-if="showCards" class="card-constellation">
        <h2 class="constellation-title">🌌 聖牌星座</h2>
        <div class="card-field">
          <div 
            v-for="(card, index) in displayCards" 
            :key="card.id"
            class="mystical-card"
            :class="{ 
              revealed: card.revealed, 
              selected: selectedCards.includes(card),
              [`card-${index}`]: true
            }"
            @click="selectCard(card, index)"
            :style="{ 
              '--delay': (index * 0.1) + 's',
              '--rotation': getCardRotation(index) + 'deg'
            }"
          >
            <div class="card-inner">
              <!-- Card Back -->
              <div class="card-back">
                <div class="back-pattern">
                  <div class="mystical-symbol">🌙</div>
                  <div class="energy-lines"></div>
                </div>
              </div>
              
              <!-- Card Front -->
              <div class="card-front">
                <div class="card-header">
                  <span class="card-number">{{ card.number || '??' }}</span>
                  <span class="card-arcana">{{ card.arcana }}</span>
                </div>
                <div class="card-symbol">{{ getCardSymbol(card) }}</div>
                <div class="card-name">{{ card.name }}</div>
                <div class="card-element" v-if="card.element">{{ getElementSymbol(card.element) }}</div>
              </div>
            </div>
            
            <!-- Selection Glow -->
            <div class="selection-glow"></div>
          </div>
        </div>
        
        <!-- Card Selection Counter -->
        <div class="selection-counter">
          <div class="counter-text">已選擇: {{ selectedCards.length }}/3</div>
          <div class="counter-dots">
            <div 
              v-for="i in 3" 
              :key="i" 
              class="dot" 
              :class="{ filled: i <= selectedCards.length }"
            ></div>
          </div>
        </div>
      </div>

      <!-- AI Reading Display -->
      <div v-if="currentReading" class="reading-display">
        <div class="reading-container">
          <div class="reading-header">
            <h2 class="reading-title">{{ currentReading.title || '✨ 神諭顯現' }}</h2>
            <div class="ai-models-used">
              <div v-for="model in usedModels" :key="model.name" class="model-badge">
                {{ model.icon }} {{ model.name }}
              </div>
            </div>
          </div>
          
          <div class="reading-content" v-html="currentReading.interpretation"></div>
          
          <div class="reading-actions">
            <button @click="shareReading" class="action-btn share">
              <span class="icon">📤</span>
              分享神諭
            </button>
            <button @click="saveReading" class="action-btn save">
              <span class="icon">💾</span>
              保存占卜
            </button>
            <button @click="newReading" class="action-btn new">
              <span class="icon">🔄</span>
              重新占卜
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="mystical-loading">
        <div class="loading-portal">
          <div class="portal-rings">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="ring ring-3"></div>
          </div>
          <div class="loading-text">{{ loadingText }}</div>
        </div>
      </div>
    </main>

    <!-- Herele Poetry Display -->
    <div v-if="showPoetry" class="herele-poetry" @click="hidePoetry">
      <div class="poetry-container">
        <div class="poetry-header">
          <h3 class="poetry-title">🌟 赫雷語神詩</h3>
          <div class="poetry-subtitle">Ancient Herele Prophecy</div>
        </div>
        <div class="poetry-content">
          <div class="herele-text">{{ currentPoetry.herele }}</div>
          <div class="translation">{{ currentPoetry.translation }}</div>
        </div>
        <div class="poetry-close">點擊任意處關閉</div>
      </div>
    </div>

    <!-- Floating Achievements -->
    <div class="floating-achievements">
      <div 
        v-for="achievement in recentAchievements" 
        :key="achievement.id"
        class="achievement-popup"
      >
        <div class="achievement-icon">{{ achievement.icon }}</div>
        <div class="achievement-text">{{ achievement.name }}</div>
      </div>
    </div>

    <!-- Ambient Audio Controller -->
    <div class="audio-controller">
      <button @click="toggleAmbientSound" class="audio-btn" :class="{ active: audioEnabled }">
        <span v-if="audioEnabled">🔊</span>
        <span v-else>🔇</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import type { TarotCard, TarotReading } from '../types/tarot'
import { useTarotStore } from '../stores/tarot'
import { aiSystem } from '../services/ai'

// Store
const tarotStore = useTarotStore()

// Reactive State
const isReady = ref(true)
const isReading = ref(false)
const isLoading = ref(false)
const showCards = ref(false)
const showPoetry = ref(false)
const audioEnabled = ref(false)

const userLevel = ref(parseInt(localStorage.getItem('userLevel') || '5'))
const userExp = ref(parseInt(localStorage.getItem('userExp') || '120'))
const maxExp = ref(300)

const displayCards = ref<TarotCard[]>([])
const selectedCards = ref<TarotCard[]>([])
const currentReading = ref<TarotReading | null>(null)
const loadingText = ref('連接宇宙意識...')

const usedModels = ref([
  { icon: '🧠', name: 'GPT-4 Turbo' },
  { icon: '🎭', name: 'Claude-3.5' },
  { icon: '💎', name: 'Gemini Pro' }
])

const recentAchievements = ref<Array<{ id: string; icon: string; name: string }>>([])

// Herele Poetry System
const herelePoetry = [
  {
    herele: "Keth'mor nala theren, vash'tai mundo kalar",
    translation: "当星辰指引道路，灵魂便寻找真理"
  },
  {
    herele: "Thulos vek narai, keth'om salar therun",
    translation: "时间之轮转动，命运之线编织未来"
  },
  {
    herele: "Mira'sol kethalen, vash'nur therim golar",
    translation: "光明驱散黑暗，智慧照亮前程"
  }
]

const currentPoetry = ref(herelePoetry[0])

// Computed Properties
const experiencePercentage = computed(() => {
  return (userExp.value / maxExp.value) * 100
})

// Methods
const getLevelTitle = (level: number): string => {
  const titles: Record<number, string> = {
    1: '初學探索者',
    5: '入門修士',
    10: '智慧賢者',
    15: '神聖先知',
    20: '至尊神諭'
  }
  
  let currentTitle = '初學探索者'
  for (const [lvl, title] of Object.entries(titles)) {
    if (level >= parseInt(lvl)) {
      currentTitle = title
    }
  }
  return currentTitle
}

const getCardRotation = (index: number): number => {
  const baseRotations = [-15, -7, 0, 7, 15, -10, 10]
  return baseRotations[index % baseRotations.length]
}

const getCardSymbol = (card: TarotCard): string => {
  const symbols: Record<string, string> = {
    'major': '🌟',
    'wands': '🔥',
    'cups': '💧',
    'swords': '⚔️',
    'pentacles': '🪙',
    'hidden': '🌙'
  }
  return symbols[card.arcana] || symbols[card.suit || 'major'] || '✨'
}

const getElementSymbol = (element: string): string => {
  const elements: Record<string, string> = {
    'fire': '🔥',
    'water': '💧', 
    'air': '💨',
    'earth': '🌍'
  }
  return elements[element] || ''
}

const startQuickReading = async () => {
  if (isLoading.value) return
  
  isReading.value = true
  showCards.value = true
  
  // Generate mystical cards
  displayCards.value = await generateMysticalCards()
  
  // Show cards with animation delay
  nextTick(() => {
    displayCards.value.forEach((card, index) => {
      setTimeout(() => {
        card.revealed = true
      }, index * 200)
    })
  })
}

const generateMysticalCards = async (): Promise<TarotCard[]> => {
  // In a real app, this would fetch from the tarot store
  const mockCards: TarotCard[] = [
    {
      id: 'fool',
      name: '愚者',
      number: 0,
      arcana: 'major',
      image: '',
      description: '新的开始',
      meanings: {
        upright: { general: '新开始', love: '纯真爱情', career: '新机会', spiritual: '灵性觉醒' },
        reversed: { general: '鲁莽', love: '不成熟', career: '错误决定', spiritual: '盲目追求' }
      },
      keywords: {
        upright: ['新开始', '纯真', '自发性'],
        reversed: ['鲁莽', '愚蠢', '风险']
      },
      revealed: false
    },
    {
      id: 'magician',
      name: '魔术师',
      number: 1,
      arcana: 'major',
      image: '',
      description: '意志力与技巧',
      meanings: {
        upright: { general: '技巧', love: '吸引力', career: '成功', spiritual: '意志力' },
        reversed: { general: '操控', love: '欺骗', career: '滥用权力', spiritual: '缺乏专注' }
      },
      keywords: {
        upright: ['技巧', '意志力', '资源'],
        reversed: ['操控', '欺骗', '滥用权力']
      },
      revealed: false
    },
    {
      id: 'high-priestess',
      name: '女祭司',
      number: 2,
      arcana: 'major',
      image: '',
      description: '直觉与智慧',
      meanings: {
        upright: { general: '直觉', love: '神秘吸引', career: '内在知识', spiritual: '精神指导' },
        reversed: { general: '隐藏秘密', love: '缺乏理解', career: '错误信息', spiritual: '断开连接' }
      },
      keywords: {
        upright: ['直觉', '神秘', '潜意识'],
        reversed: ['秘密', '缺乏洞察', '断开']
      },
      revealed: false
    },
    {
      id: 'empress',
      name: '皇后',
      number: 3,
      arcana: 'major',
      image: '',
      description: '丰盛与创造力',
      meanings: {
        upright: { general: '丰盛', love: '生育力', career: '创造性项目', spiritual: '母性能量' },
        reversed: { general: '创造性阻塞', love: '过度依赖', career: '缺乏成长', spiritual: '自我怀疑' }
      },
      keywords: {
        upright: ['丰盛', '生育力', '母性'],
        reversed: ['创造性阻塞', '依赖', '自我怀疑']
      },
      revealed: false
    },
    {
      id: 'emperor',
      name: '皇帝',
      number: 4,
      arcana: 'major',
      image: '',
      description: '权威与稳定',
      meanings: {
        upright: { general: '权威', love: '稳定关系', career: '领导力', spiritual: '结构' },
        reversed: { general: '专制', love: '控制', career: '滥用权力', spiritual: '缺乏纪律' }
      },
      keywords: {
        upright: ['权威', '稳定', '领导力'],
        reversed: ['专制', '控制', '缺乏纪律']
      },
      revealed: false
    }
  ]
  
  return mockCards.slice(0, 5)
}

const selectCard = (card: TarotCard, index: number) => {
  if (selectedCards.value.length >= 3 && !selectedCards.value.includes(card)) {
    return
  }
  
  const cardIndex = selectedCards.value.indexOf(card)
  if (cardIndex > -1) {
    selectedCards.value.splice(cardIndex, 1)
  } else {
    selectedCards.value.push(card)
  }
  
  // Add selection effect
  playSelectionSound()
  
  // Auto-perform reading when 3 cards selected
  if (selectedCards.value.length === 3) {
    setTimeout(performReading, 500)
  }
}

const performReading = async () => {
  if (selectedCards.value.length < 3) return
  
  isLoading.value = true
  loadingText.value = '召喚AI神諭...'
  
  // Show Herele poetry for higher level users
  if (userLevel.value >= 3) {
    showHerelePoetry()
  }
  
  try {
    setTimeout(() => {
      loadingText.value = '解析宇宙訊息...'
    }, 1000)
    
    setTimeout(() => {
      loadingText.value = '編織智慧圖景...'
    }, 2000)
    
    const reading = await aiSystem.performReading({
      userId: 'demo-user',
      spreadId: 'three-card',
      cards: selectedCards.value,
      question: '請為我提供生活指引'
    })
    
    currentReading.value = reading.finalReading
    addExperience(25)
    
    // Show achievement if milestone reached
    checkForAchievements()
    
  } catch (error) {
    console.error('Reading error:', error)
  } finally {
    isLoading.value = false
  }
}

const showHerelePoetry = () => {
  currentPoetry.value = herelePoetry[Math.floor(Math.random() * herelePoetry.length)]
  showPoetry.value = true
  setTimeout(() => {
    hidePoetry()
  }, 4000)
}

const hidePoetry = () => {
  showPoetry.value = false
}

const addExperience = (amount: number) => {
  userExp.value += amount
  if (userExp.value >= maxExp.value) {
    levelUp()
  }
  localStorage.setItem('userExp', userExp.value.toString())
}

const levelUp = () => {
  userLevel.value++
  userExp.value = 0
  maxExp.value = Math.floor(maxExp.value * 1.5)
  
  localStorage.setItem('userLevel', userLevel.value.toString())
  localStorage.setItem('userExp', '0')
  
  showAchievement({
    id: `level-${userLevel.value}`,
    icon: '🎉',
    name: `升級到 ${getLevelTitle(userLevel.value)}！`
  })
}

const checkForAchievements = () => {
  const readingCount = parseInt(localStorage.getItem('readingCount') || '0') + 1
  localStorage.setItem('readingCount', readingCount.toString())
  
  if (readingCount === 1) {
    showAchievement({ id: 'first', icon: '✨', name: '首次神諭' })
  } else if (readingCount === 10) {
    showAchievement({ id: 'ten', icon: '🌟', name: '神諭探索者' })
  }
}

const showAchievement = (achievement: { id: string; icon: string; name: string }) => {
  recentAchievements.value.push(achievement)
  setTimeout(() => {
    recentAchievements.value = recentAchievements.value.filter(a => a.id !== achievement.id)
  }, 3000)
}

const newReading = () => {
  currentReading.value = null
  selectedCards.value = []
  showCards.value = false
  isReading.value = false
  displayCards.value = []
}

const playSelectionSound = () => {
  // In a real app, this would play an audio file
  if (audioEnabled.value) {
    // Card selection sound
  }
}

const toggleAmbientSound = () => {
  audioEnabled.value = !audioEnabled.value
  // In a real app, this would control actual audio
}

const shareReading = () => {
  // Sharing reading functionality
}

const saveReading = () => {
  // Saving reading functionality
}

const openCardLibrary = () => {
  // Opening card library
}

const viewHistory = () => {
  // Opening history
}

const openSettings = () => {
  // Opening settings
}

// Generate stars on mount
const createStarField = () => {
  const container = document.querySelector('.stars-layer')
  if (!container) return
  
  for (let i = 0; i < 200; i++) {
    const star = document.createElement('div')
    star.className = 'star'
    star.style.left = Math.random() * 100 + '%'
    star.style.top = Math.random() * 100 + '%'
    star.style.animationDelay = Math.random() * 3 + 's'
    star.style.opacity = (Math.random() * 0.8 + 0.2).toString()
    container.appendChild(star)
  }
}

onMounted(() => {
  createStarField()
  // Mystical Interface initialized
})
</script>

<style scoped>
.mystical-interface {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  overflow-x: hidden;
}

/* Cosmic Background */
.cosmic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.stars-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.nebula-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%);
}

.aurora-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 150, 0.05), transparent);
  animation: aurora 20s ease-in-out infinite;
}

@keyframes aurora {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

/* Sacred Geometry */
.sacred-geometry {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.geometry-pattern {
  width: 100%;
  height: 100%;
  opacity: 0.3;
}

.metatron-cube.active {
  animation: geometryPulse 3s ease-in-out infinite;
}

@keyframes geometryPulse {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.3; }
  50% { transform: scale(1.1) rotate(5deg); opacity: 0.6; }
}

/* Mystical Header */
.mystical-header {
  position: relative;
  z-index: 10;
  padding: 2rem;
  text-align: center;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.brand-symbol {
  text-align: left;
}

.moon-phases {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.phase {
  font-size: 1.5rem;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.phase.active {
  opacity: 1;
  transform: scale(1.2);
  text-shadow: 0 0 20px #ffd700;
}

.brand-title {
  font-size: 3rem;
  background: linear-gradient(135deg, #ffd700 0%, #ff6b6b 50%, #4ecdc4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  font-weight: 700;
}

.subtitle {
  color: #c9b037;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

/* User Level Widget */
.user-level-widget {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.level-circle {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.level-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffd700;
  z-index: 2;
}

.level-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid rgba(255, 215, 0, 0.3);
  border-top: 3px solid #ffd700;
  border-radius: 50%;
  animation: spin 3s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.level-info {
  min-width: 150px;
}

.level-title {
  color: #ffd700;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.experience-bar {
  width: 150px;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd700, #ff6b6b);
  border-radius: 4px;
  transition: width 1s ease;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

/* Main Divination Interface */
.divination-main {
  position: relative;
  z-index: 5;
  padding: 2rem;
  min-height: 80vh;
}

/* Action Portal */
.action-portal {
  text-align: center;
  margin-bottom: 3rem;
}

.portal-btn {
  background: transparent;
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 15px;
  padding: 1rem 2rem;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.portal-btn.primary {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 107, 107, 0.1));
  border-color: #ffd700;
  padding: 1.5rem 3rem;
  margin-bottom: 2rem;
}

.portal-btn.primary:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(255, 215, 0, 0.4);
  border-color: #fff;
}

.portal-btn.primary.pulsing {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
  50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
}

.btn-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.btn-text {
  font-size: 1.2rem;
  font-weight: 600;
}

.btn-energy {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
}

.portal-btn.primary:hover .btn-energy {
  width: 200px;
  height: 200px;
}

.portal-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.portal-btn.secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
}

.portal-btn.secondary:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: #ffd700;
}

/* Card Constellation */
.card-constellation {
  margin: 3rem 0;
}

.constellation-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #ffd700, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-field {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  perspective: 1000px;
}

.mystical-card {
  width: 120px;
  height: 200px;
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation: cardAppear 0.8s ease forwards;
  animation-delay: var(--delay);
  opacity: 0;
  transform: translateY(50px) rotateX(-90deg);
}

@keyframes cardAppear {
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0deg) rotateZ(var(--rotation));
  }
}

.mystical-card:hover {
  transform: translateY(-20px) scale(1.05) rotateZ(0deg);
  z-index: 10;
}

.mystical-card.selected {
  transform: translateY(-20px) scale(1.1) rotateZ(0deg);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s ease;
}

.mystical-card.revealed .card-inner {
  transform: rotateY(180deg);
}

.card-back,
.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  overflow: hidden;
}

.card-back {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 2px solid #ffd700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-pattern {
  text-align: center;
}

.mystical-symbol {
  font-size: 3rem;
  color: #ffd700;
  margin-bottom: 1rem;
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { text-shadow: 0 0 10px #ffd700; }
  50% { text-shadow: 0 0 20px #ffd700, 0 0 30px #ffa500; }
}

.card-front {
  background: linear-gradient(135deg, #2d1b69, #11998e);
  border: 2px solid #4ecdc4;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  color: white;
}

.card-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 0.8rem;
  color: #ffd700;
}

.card-symbol {
  font-size: 2.5rem;
  margin: 1rem 0;
}

.card-name {
  font-weight: 600;
  text-align: center;
  font-size: 0.9rem;
}

.card-element {
  font-size: 1.2rem;
}

.selection-glow {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(135deg, #ffd700, #ff6b6b, #4ecdc4, #ffd700);
  border-radius: 15px;
  opacity: 0;
  z-index: -1;
  animation: borderRotate 3s linear infinite;
}

.mystical-card.selected .selection-glow {
  opacity: 1;
}

@keyframes borderRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Selection Counter */
.selection-counter {
  text-align: center;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.counter-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #ffd700;
  transition: all 0.3s ease;
}

.dot.filled {
  background: #ffd700;
  box-shadow: 0 0 10px #ffd700;
}

/* Reading Display */
.reading-display {
  margin-top: 3rem;
  animation: fadeInUp 0.8s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reading-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  max-width: 800px;
  margin: 0 auto;
}

.reading-header {
  text-align: center;
  margin-bottom: 2rem;
}

.reading-title {
  font-size: 1.8rem;
  color: #ffd700;
  margin-bottom: 1rem;
}

.ai-models-used {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.model-badge {
  padding: 0.3rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  font-size: 0.8rem;
  color: #c9b037;
}

.reading-content {
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.reading-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: #ffd700;
  transform: translateY(-2px);
}

/* Mystical Loading */
.mystical-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-portal {
  text-align: center;
}

.portal-rings {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
}

.ring {
  position: absolute;
  border: 2px solid transparent;
  border-top: 2px solid #ffd700;
  border-radius: 50%;
  animation: ringRotate 2s linear infinite;
}

.ring-1 {
  width: 120px;
  height: 120px;
  top: 0;
  left: 0;
}

.ring-2 {
  width: 80px;
  height: 80px;
  top: 20px;
  left: 20px;
  border-top-color: #ff6b6b;
  animation-duration: 1.5s;
  animation-direction: reverse;
}

.ring-3 {
  width: 40px;
  height: 40px;
  top: 40px;
  left: 40px;
  border-top-color: #4ecdc4;
  animation-duration: 1s;
}

@keyframes ringRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: 600;
  animation: textPulse 1.5s ease-in-out infinite;
}

@keyframes textPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* Herele Poetry */
.herele-poetry {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  cursor: pointer;
  animation: fadeIn 0.5s ease;
}

.poetry-container {
  max-width: 600px;
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid #ffd700;
  border-radius: 20px;
  backdrop-filter: blur(20px);
}

.poetry-title {
  color: #ffd700;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.poetry-subtitle {
  color: #c9b037;
  font-size: 1rem;
  margin-bottom: 2rem;
  font-style: italic;
}

.herele-text {
  font-size: 1.8rem;
  color: #ffffff;
  font-style: italic;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  line-height: 1.4;
}

.translation {
  color: #c9b037;
  font-size: 1.2rem;
  font-style: italic;
}

.poetry-close {
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

/* Floating Achievements */
.floating-achievements {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 1500;
}

.achievement-popup {
  background: linear-gradient(135deg, #ffd700, #ff6b6b);
  color: #000;
  padding: 1rem 1.5rem;
  border-radius: 15px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: slideInRight 0.5s ease, fadeOutRight 0.5s ease 2.5s forwards;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOutRight {
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.achievement-icon {
  font-size: 1.5rem;
}

.achievement-text {
  font-weight: 600;
}

/* Audio Controller */
.audio-controller {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
}

.audio-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgba(255, 215, 0, 0.5);
  background: rgba(255, 255, 255, 0.1);
  color: #ffd700;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.audio-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: #ffd700;
  transform: scale(1.1);
}

.audio-btn.active {
  background: rgba(255, 215, 0, 0.2);
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 2rem;
  }
  
  .card-field {
    gap: 1rem;
  }
  
  .mystical-card {
    width: 100px;
    height: 160px;
  }
  
  .portal-options {
    flex-direction: column;
    align-items: center;
  }
  
  .brand-title {
    font-size: 2rem;
  }
}
</style>