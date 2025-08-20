<template>
  <div class="night-god-tarot-universe">
    <!-- Cosmic Canvas -->
    <div class="cosmic-canvas">
      <div class="star-field" ref="starField"></div>
      <div class="nebula-streams"></div>
      <div class="quantum-particles" ref="particles"></div>
      <div class="sacred-geometry-overlay">
        <svg class="sacred-svg" viewBox="0 0 1200 800">
          <defs>
            <radialGradient id="cosmicGold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#FF6B35;stop-opacity:0.3" />
            </radialGradient>
          </defs>
          
          <!-- Metatron's Cube -->
          <g class="metatron-cube" :class="{ activated: isReadingActive }">
            <circle cx="600" cy="400" r="120" fill="none" stroke="url(#cosmicGold)" stroke-width="2" opacity="0.6"/>
            <circle cx="600" cy="400" r="80" fill="none" stroke="url(#cosmicGold)" stroke-width="1.5" opacity="0.5"/>
            <circle cx="600" cy="400" r="40" fill="none" stroke="url(#cosmicGold)" stroke-width="1" opacity="0.4"/>
            
            <!-- Connecting Lines -->
            <line x1="480" y1="280" x2="720" y2="520" stroke="url(#cosmicGold)" stroke-width="0.8" opacity="0.3"/>
            <line x1="720" y1="280" x2="480" y2="520" stroke="url(#cosmicGold)" stroke-width="0.8" opacity="0.3"/>
            <line x1="600" y1="160" x2="600" y2="640" stroke="url(#cosmicGold)" stroke-width="0.8" opacity="0.3"/>
            <line x1="360" y1="400" x2="840" y2="400" stroke="url(#cosmicGold)" stroke-width="0.8" opacity="0.3"/>
          </g>
        </svg>
      </div>
    </div>

    <!-- Main Interface -->
    <div class="main-interface" :class="{ 'reading-mode': isReadingActive }">
      <!-- Mystical Header -->
      <header class="mystical-header">
        <div class="brand-constellation">
          <!-- Night God Logo Integration -->
          <div class="logo-sanctuary">
            <img src="/src/assets/night-god-logo.jpg" alt="Night God Tarot" class="night-god-logo" />
            <div class="logo-aura"></div>
          </div>
          
          <div class="lunar-phases">
            <span class="phase" v-for="(phase, index) in lunarPhases" :key="index" :class="{ active: index === currentPhase }">
              {{ phase }}
            </span>
          </div>
          <h1 class="cosmic-title">{{ tSync('title') }}</h1>
          <div class="subtitle-glow">{{ tSync('subtitle') }}</div>
        </div>

        <!-- Header Controls -->
        <div class="header-controls">
          <!-- Language Toggle -->
          <button @click="toggleLanguage" class="language-toggle" :class="{ active: currentLanguage !== 'zh' }">
            <span class="lang-icon">🌐</span>
            <span class="lang-text">{{ getLanguageToggleText() }}</span>
          </button>
          
        </div>

        <!-- User Ascension Display -->
        <div class="ascension-display">
          <div class="level-mandala">
            <div class="mandala-rings">
              <div class="ring primary"></div>
              <div class="ring secondary"></div>
              <div class="ring tertiary"></div>
            </div>
            <div class="level-core">
              <span class="level-number">{{ userLevel }}</span>
            </div>
          </div>
          <div class="ascension-info">
            <div class="soul-rank">{{ getSoulRank(userLevel) }}</div>
            <div class="experience-flow">
              <div class="exp-stream" :style="{ width: experiencePercentage + '%' }"></div>
            </div>
            <div class="next-unlock">解鎖: {{ getNextUnlock(userLevel) }}</div>
          </div>
        </div>
      </header>

      <!-- Divine Interface Tabs -->
      <div class="divine-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="divine-tab"
          :class="{ active: activeTab === tab.id }"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-name">{{ tab.name }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Warning Modal - Shows First -->
        <div v-if="showWarningModal" class="warning-modal">
          <div class="modal-overlay"></div>
          <div class="warning-portal">
            <div class="warning-header">
              <h3>⚠️ {{ tSync('importantWarning') }}</h3>
            </div>
            <div class="warning-content">
              <p>{{ tSync('warningMessage') }}</p>
              <ul class="warning-points">
                <li>{{ tSync('warningPoint1') }}</li>
                <li>{{ tSync('warningPoint2') }}</li>
                <li>{{ tSync('warningPoint3') }}</li>
              </ul>
            </div>
            <div class="warning-actions">
              <button @click="acceptWarning" class="accept-warning-btn">
                {{ tSync('iUnderstand') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Registration Modal - Shows after first card flip and warning accepted -->
        <div v-if="showRegistrationModal && !showWarningModal" class="memory-login-modal">
          <div class="modal-overlay"></div>
          <div class="login-portal">
            <div class="portal-header">
              <h3>🌙 {{ tSync('registrationTitle') }}</h3>
              <p>{{ tSync('registrationDescription') }}</p>
            </div>
            <div class="registration-form">
              <div class="form-group">
                <label class="form-label">{{ tSync('nameLabel') }}</label>
                <input 
                  type="text" 
                  v-model="userRegistration.name"
                  :placeholder="tSync('namePlaceholder')"
                  class="mystical-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">{{ tSync('emailLabel') }}</label>
                <input 
                  type="email" 
                  v-model="userRegistration.email"
                  :placeholder="tSync('emailPlaceholder')"
                  class="mystical-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">{{ tSync('passwordLabel') }}</label>
                <input 
                  type="password" 
                  v-model="userRegistration.password"
                  :placeholder="tSync('passwordPlaceholder')"
                  class="mystical-input"
                />
              </div>
              <button 
                @click="completeRegistration"
                class="activate-memory-btn"
                :disabled="!isValidRegistration()"
              >
                {{ tSync('completeRegistration') }}
              </button>
            </div>
            <div class="registration-benefits">
              <p class="free-trial-text">{{ tSync('freeTrialCompleted') }}</p>
              <div class="benefit-item">
                <span class="benefit-icon">📚</span>
                <span>{{ tSync('unlimitedFlips') }}</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">🎴</span>
                <span>{{ tSync('viewFlippedCards') }}</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">✨</span>
                <span>{{ tSync('saveProgress') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Oracle Tab -->
        <div v-if="activeTab === 'oracle'" class="oracle-realm">
          <div class="oracle-header">
            <h2 class="realm-title">🔮 神諭聖域</h2>
          </div>

          <!-- Quick Divination Portal -->
          <div class="divination-portal">
            <div class="portal-energy" :class="{ charging: isCharging }">
              <button @click="initiateQuickReading" class="portal-activator" :disabled="isLoading">
                <div class="activator-core">
                  <span class="core-symbol">🌙</span>
                  <span class="core-text">{{ tSync('activateOracle') }}</span>
                </div>
                <div class="energy-rings">
                  <div class="energy-ring ring-1"></div>
                  <div class="energy-ring ring-2"></div>
                  <div class="energy-ring ring-3"></div>
                </div>
              </button>
            </div>

            <!-- Question Interface -->
            <div class="question-altar">
              <label class="altar-label">{{ tSync('askUniverse') }}</label>
              <textarea 
                v-model="userQuestion" 
                class="question-input"
                :placeholder="tSync('questionPlaceholder')"
                maxlength="300"
              ></textarea>
              <div class="question-counter">{{ userQuestion.length }}/300</div>
            </div>

          </div>

          <!-- Card Constellation -->
          <div v-if="showCardSelection" class="card-constellation">
            <h3 class="constellation-title">⭐ 神牌星座</h3>
            <div class="card-grid">
              <div 
                v-for="(card, index) in availableCards" 
                :key="card.id"
                class="cosmic-card"
                :class="{ 
                  revealed: isCardFlipped(card.id),
                  selected: selectedCards.includes(card),
                  [`position-${index}`]: true
                }"
                @click="flipAndSelectCard(card)"
                :style="{ 
                  '--delay': (index * 0.15) + 's',
                  '--rotation': getCardRotation(index) + 'deg'
                }"
              >
                <div class="card-container">
                  <!-- Card Back -->
                  <div class="card-back">
                    <div class="back-mandala">
                      <div class="mandala-center">🌙</div>
                      <div class="mandala-rings">
                        <div class="mandala-ring"></div>
                        <div class="mandala-ring"></div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Card Front -->
                  <div class="card-front">
                    <div class="card-header">
                      <span class="card-number">{{ card.number ?? '∞' }}</span>
                      <span class="card-arcana">{{ getArcanaIcon(card.arcana) }}</span>
                    </div>
                    <div class="card-artwork">
                      <img :src="card.image" :alt="card.name" loading="lazy" />
                    </div>
                    <div class="card-title">{{ card.name }}</div>
                    <div class="card-element" v-if="card.element">{{ getElementIcon(card.element) }}</div>
                  </div>
                </div>
                
                <!-- Selection Aura -->
                <div class="selection-aura"></div>
              </div>
            </div>

            <!-- Selection Status -->
            <div class="selection-status">
              <div class="status-text">已選擇牌組: {{ selectedCards.length }}/3</div>
              <div class="status-indicators">
                <div 
                  v-for="i in 3" 
                  :key="i"
                  class="indicator"
                  :class="{ filled: i <= selectedCards.length }"
                ></div>
              </div>
            </div>

            <!-- Flipped Cards Gallery -->
            <div v-if="flippedCards.length > 0" class="flipped-cards-gallery">
              <h4 class="gallery-title">🎴 {{ tSync('flippedCardsGallery') }}</h4>
              <div class="flipped-cards-grid">
                <div 
                  v-for="flippedCard in flippedCards" 
                  :key="`flipped-${flippedCard.cardId}`"
                  class="flipped-card-display"
                >
                  <div class="flipped-card-image">
                    <img 
                      :src="getCardById(flippedCard.cardId)?.image" 
                      :alt="flippedCard.cardName"
                      loading="lazy"
                    />
                  </div>
                  <div class="flipped-card-info">
                    <div class="flipped-card-name">{{ flippedCard.cardName }}</div>
                    <div class="flipped-timestamp">{{ formatFlipTime(flippedCard.flippedAt) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reading Display -->
          <div v-if="currentReading" class="reading-display">
            <div class="reading-container">
              <!-- Reading Header -->
              <div class="reading-header">
                <h3 class="reading-title">{{ currentReading.title || '✨ 宇宙神諭顯現' }}</h3>
                <div class="ai-ensemble">
                  <div v-for="model in activeModels" :key="model.name" class="ai-badge">
                    {{ model.icon }} {{ model.name }}
                  </div>
                </div>
              </div>

              <!-- Reading Content -->
              <div class="reading-content" v-html="currentReading.interpretation"></div>

              <!-- Action Buttons -->
              <div class="reading-actions">
                <button @click="shareReading" class="action-btn share-btn">
                  📤 {{ tSync('shareReading') }}
                </button>
                <button @click="saveReading" class="action-btn save-btn">
                  💾 {{ tSync('saveReading') }}
                </button>
                <button @click="resetReading" class="action-btn reset-btn">
                  🔄 {{ tSync('resetReading') }}
                </button>
              </div>
            </div>
          </div>
        </div>


        <!-- Novel Tab -->
        <div v-if="activeTab === 'novel'" class="novel-realm">
          <h2 class="realm-title">📖 夜神史詩</h2>
          <div class="novel-interface">
            <div class="chapter-selector">
              <div class="chapters-grid">
                <div 
                  v-for="chapter in novelChapters" 
                  :key="chapter.id"
                  class="chapter-card"
                  :class="{ unlocked: chapter.unlocked, current: chapter.id === currentChapter }"
                  @click="selectChapter(chapter)"
                >
                  <div class="chapter-number">{{ chapter.number }}</div>
                  <div class="chapter-title">{{ chapter.title }}</div>
                  <div class="chapter-status">
                    <span v-if="!chapter.unlocked">🔒</span>
                    <span v-else>📖</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Tab -->
        <div v-if="activeTab === 'progress'" class="progress-realm">
          <h2 class="realm-title">📊 靈魂成長</h2>
          <div class="progress-dashboard">
            <!-- Achievement Gallery -->
            <div class="achievement-gallery">
              <h3>🏆 成就殿堂</h3>
              <div class="achievements-grid">
                <div 
                  v-for="achievement in userAchievements" 
                  :key="achievement.id"
                  class="achievement-card"
                  :class="{ unlocked: achievement.unlocked }"
                >
                  <div class="achievement-icon">{{ achievement.icon }}</div>
                  <div class="achievement-name">{{ achievement.name }}</div>
                  <div class="achievement-desc">{{ achievement.description }}</div>
                </div>
              </div>
            </div>

            <!-- Statistics -->
            <div class="statistics-panel">
              <h3>📈 占卜統計</h3>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-number">{{ userStats.totalReadings }}</div>
                  <div class="stat-label">總占卜次數</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ userStats.accuracy }}%</div>
                  <div class="stat-label">預測準確率</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ userStats.favoriteCard }}</div>
                  <div class="stat-label">命運之牌</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Herele Poetry Modal -->
    <div v-if="showHerelePoetry" class="herele-modal" @click="hideHerelePoetry">
      <div class="herele-container" @click.stop>
        <div class="herele-header">
          <h3>🌟 赫雷語神詩 🌟</h3>
          <div class="herele-subtitle">Ancient Herele Prophecy</div>
        </div>
        <div class="herele-content">
          <div class="herele-original">{{ currentHerelePoetry.original }}</div>
          <div class="herele-translation">{{ currentHerelePoetry.translation }}</div>
        </div>
        <div class="herele-close">點擊任意處關閉</div>
      </div>
    </div>

    <!-- Loading Portal -->
    <div v-if="isLoading" class="loading-portal">
      <div class="portal-vortex">
        <div class="vortex-ring ring-1"></div>
        <div class="vortex-ring ring-2"></div>
        <div class="vortex-ring ring-3"></div>
        <div class="vortex-ring ring-4"></div>
      </div>
      <div class="loading-message">{{ loadingMessage }}</div>
      <div class="loading-submessage">{{ loadingSubmessage }}</div>
    </div>

    <!-- Floating Notifications -->
    <div class="notification-cosmos">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="cosmic-notification"
        :class="notification.type"
      >
        <div class="notification-icon">{{ notification.icon }}</div>
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
        </div>
      </div>
    </div>

    <!-- Weather & News Widget -->
    <WeatherNewsWidget />

  </div>
  
  <!-- Binaural Audio Player for Wealth Clearing -->
  <BinauralAudioPlayer :currentLanguage="currentLanguage" />
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import type { TarotCard, TarotReading } from '../types/tarot'
import { useTarotStore } from '../stores/tarot'
import { aiSystem } from '../services/ai'
import { monicaTranslator } from '../services/monicaTranslator'
import { cardMemorySystem } from '../services/cardMemorySystem'
import type { FlippedCardRecord } from '../services/cardMemorySystem'
import WeatherNewsWidget from './WeatherNewsWidget.vue'
import BinauralAudioPlayer from './BinauralAudioPlayer.vue'

// Store
const tarotStore = useTarotStore()

// Reactive State
const activeTab = ref('oracle')
const isReadingActive = ref(false)
const isLoading = ref(false)
const showCardSelection = ref(false)
const showHerelePoetry = ref(false)
const currentHerelePoetry = ref({
  original: '夜神塔羅，宇宙智慧流淌，\n命運之輪轉動，真理之光閃亮。\n在這神聖時刻，聆聽內心聲響，\n未來的路已現，勇敢前往。',
  translation: 'Night God Tarot, cosmic wisdom flows,\nThe wheel of fate turns, truth\'s light glows.\nIn this sacred moment, hear your inner voice,\nThe future path reveals, make your choice.'
})
const isCharging = ref(false)
// Audio now handled by BinauralAudioPlayer component
// Monica connection status is internal - not displayed to users
const currentLanguage = ref<'zh' | 'en' | 'ja'>('zh')

// Monica ChatGPT-5 Dynamic Translation System
const translationCache = ref<{ [key: string]: string }>({})
const isTranslating = ref(false)

// Base content in Chinese (source language)
const baseTexts = {
  title: '夜神塔羅',
  subtitle: 'AI驅動神秘占卜宇宙 • 31萬字史詩小說',
  activateOracle: '啟動神諭',
  askUniverse: '🕯️ 向宇宙提問',
  questionPlaceholder: '在這個神聖時刻，您最想了解什麼？讓宇宙的智慧為您指引方向...',
  // Notification messages
  cardsRevealed: '神牌已顯現',
  selectCards: '請選擇三張與您心靈共鳴的牌',
  readingComplete: '神諭完成',
  wisdomRevealed: '宇宙的智慧已為您展現',
  connectionLost: '連接中斷',
  backupSystem: '正在使用備用神諭系統',
  levelUp: '等級提升！',
  copied: '已複製',
  resultCopied: '占卜結果已複製到剪貼板',
  saved: '已保存',
  readingSaved: '占卜記錄已保存到您的收藏',
  chapterLocked: '章節鎖定',
  audioSuggestion: '建議啟動財富清理音頻',
  enhanceConnection: '增強占卜效果與宇宙連結',
  // Warning System
  importantWarning: '重要警告',
  warningMessage: '夜神塔羅包含神秘力量，使用前請仔細閱讀以下注意事項：',
  warningPoint1: '此系統僅供娛樂和精神指導，不應用於重要決策',
  warningPoint2: '塔羅占卜結果僅為參考，請勿過度依賴',
  warningPoint3: '如有心理健康問題，請諮詢專業醫療人員',
  iUnderstand: '我已理解並同意',
  // Registration System
  registrationTitle: '完成註冊享受完整體驗',
  registrationDescription: '您已使用完免費試用，請先確認條款後註冊帳戶以繼續探索神秘塔羅世界',
  nameLabel: '姓名',
  namePlaceholder: '請輸入您的姓名',
  emailLabel: '電子郵件地址',
  emailPlaceholder: 'your.email@example.com',
  passwordLabel: '密碼',
  passwordPlaceholder: '請設定安全密碼',
  completeRegistration: '完成註冊',
  freeTrialCompleted: '🎯 免費試用已完成',
  unlimitedFlips: '無限制翻牌體驗',
  viewFlippedCards: '查看已翻牌組',
  saveProgress: '保存進度記錄',
  flippedCardsGallery: '已翻牌組殿堂',
  // Action buttons
  shareReading: '分享神諭',
  saveReading: '珍藏占卜',
  resetReading: '重新占卜',
  // Tab names
  oracleTab: '神諭',
  novelTab: '史詩',
  progressTab: '成長'
}

// Dynamic translation function powered by Monica ChatGPT-5
const t = async (key: string): Promise<string> => {
  const sourceText = baseTexts[key as keyof typeof baseTexts]
  if (!sourceText) return key

  // Return source text if language is Chinese
  if (currentLanguage.value === 'zh') {
    return sourceText
  }

  // Check cache first
  const cacheKey = `${key}-${currentLanguage.value}`
  if (translationCache.value[cacheKey]) {
    return translationCache.value[cacheKey]
  }

  // Use Monica ChatGPT-5 for translation
  try {
    const translation = await monicaTranslator.translate({
      text: sourceText,
      fromLanguage: 'zh',
      toLanguage: currentLanguage.value,
      context: 'Night God Tarot mystical interface'
    })
    
    // Cache the translation
    translationCache.value[cacheKey] = translation
    return translation
  } catch (error) {
    console.error('Translation failed for:', key, error)
    return sourceText // Fallback to source text
  }
}

// Synchronous version for reactive elements that need immediate response
const tSync = (key: string): string => {
  const sourceText = baseTexts[key as keyof typeof baseTexts]
  if (!sourceText) return key

  if (currentLanguage.value === 'zh') {
    return sourceText
  }

  // Return cached translation or source text
  const cacheKey = `${key}-${currentLanguage.value}`
  return translationCache.value[cacheKey] || sourceText
}

// Batch translation for efficiency
const translateAllTexts = async () => {
  if (currentLanguage.value === 'zh') {
    return // No translation needed
  }

  isTranslating.value = true
  
  try {
    const textKeys = Object.keys(baseTexts)
    const textValues = Object.values(baseTexts)
    
    const translations = await monicaTranslator.batchTranslate({
      texts: textValues,
      fromLanguage: 'zh',
      toLanguage: currentLanguage.value,
      context: 'Night God Tarot mystical interface - maintain spiritual atmosphere'
    })
    
    // Update cache
    textKeys.forEach((key, index) => {
      const cacheKey = `${key}-${currentLanguage.value}`
      translationCache.value[cacheKey] = translations[index]
    })
    
    console.log(`🌐 All texts translated to ${currentLanguage.value} by Monica ChatGPT-5`)
  } catch (error) {
    console.error('Batch translation failed:', error)
  } finally {
    isTranslating.value = false
  }
}

const userLevel = ref(parseInt(localStorage.getItem('userLevel') || '8'))
const userExperience = ref(parseInt(localStorage.getItem('userExperience') || '450'))
const maxExperience = ref(600)

const userQuestion = ref('')
const selectedCards = ref<TarotCard[]>([])
const availableCards = ref<TarotCard[]>([])
const currentReading = ref<TarotReading | null>(null)

// Memory System
const showWarningModal = ref(true)
const showRegistrationModal = ref(false)
const isMemorySystemActive = ref(false)
const freeCardFlipsUsed = ref(0)
const maxFreeFlips = ref(1)
const warningAcceptedOnce = ref(false)
const userRegistration = ref({
  name: '',
  email: '',
  password: ''
})
const flippedCards = ref<FlippedCardRecord[]>([])
const sessionStats = ref({ totalFlips: 0, uniqueCards: 0 })
const currentPhase = ref(1)
// Library functionality removed
const currentChapter = ref('chapter-1')

const loadingMessage = ref('連接宇宙意識...')
const loadingSubmessage = ref('正在召喚宇宙多重智慧')

// Constants
const lunarPhases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']

const tabs = computed(() => [
  { id: 'oracle', name: tSync('oracleTab'), icon: '🔮' },
  { id: 'novel', name: tSync('novelTab'), icon: '📖' },
  { id: 'progress', name: tSync('progressTab'), icon: '📊' }
])

// Card filters removed with library

const activeModels = ref([
  { name: 'Claude-3.5', icon: '🎭' },
  { name: 'GPT-4o', icon: '🧠' },
  { name: 'Gemini Pro', icon: '💎' }
])

const herelePoetryCollection = [
  {
    original: "Keth'mor nala theren vash'tai mundo kalar",
    translation: "當星辰指引道路，靈魂便尋找真理"
  },
  {
    original: "Thulos vek narai keth'om salar therun",
    translation: "時間之輪轉動，命運之線編織未來"
  },
  {
    original: "Mira'sol kethalen vash'nur therim golar",
    translation: "光明驱散黑暗，智慧照亮前程"
  },
  {
    original: "Yshan'dal kephoth nara thesilon valeth",
    translation: "古老的智慧在夜空中低語秘密"
  }
]

const novelChapters = reactive([
  { id: 'prologue', number: '序章', title: '夜神的覺醒', unlocked: true },
  { id: 'chapter-1', number: '第一章', title: '命運的召喚', unlocked: true },
  { id: 'chapter-2', number: '第二章', title: '塔羅的奧秘', unlocked: userLevel.value >= 5 },
  { id: 'chapter-3', number: '第三章', title: 'AI神諭的誕生', unlocked: userLevel.value >= 10 },
  { id: 'chapter-4', number: '第四章', title: '靈魂的對話', unlocked: userLevel.value >= 15 },
  { id: 'chapter-5', number: '第五章', title: '宇宙的真相', unlocked: userLevel.value >= 20 }
])

const userAchievements = reactive([
  { id: 'first-reading', name: '初次神諭', description: '完成第一次塔羅占卜', icon: '✨', unlocked: true },
  { id: 'herele-unlock', name: '赫雷語啟示', description: '解鎖古老預言詩句', icon: '🌟', unlocked: userLevel.value >= 3 },
  { id: 'ai-master', name: 'AI占卜大師', description: '使用多個AI模型進行占卜', icon: '🤖', unlocked: userLevel.value >= 10 },
  { id: 'novel-reader', name: '史詩探索者', description: '閱讀完整小說章節', icon: '📚', unlocked: userLevel.value >= 5 },
  { id: 'soul-guide', name: '靈魂導師', description: '達到最高占卜等級', icon: '👑', unlocked: userLevel.value >= 20 }
])

const userStats = reactive({
  totalReadings: parseInt(localStorage.getItem('totalReadings') || '23'),
  accuracy: 87,
  favoriteCard: '愚者'
})

const notifications = ref<Array<{
  id: string
  type: 'success' | 'info' | 'warning' | 'achievement'
  icon: string
  title: string
  message: string
}>>([])

// Computed Properties
const experiencePercentage = computed(() => {
  return (userExperience.value / maxExperience.value) * 100
})

// Filtered cards computed function removed with library

// Methods
const getSoulRank = (level: number): string => {
  if (level >= 20) return '👑 夜神至尊'
  if (level >= 15) return '🔮 神聖先知'
  if (level >= 10) return '👁️ 智慧賢者'
  if (level >= 5) return '⭐ 星辰學徒'
  return '🌙 月光新手'
}

const getNextUnlock = (level: number): string => {
  if (level < 5) return '星辰學徒特權'
  if (level < 10) return '智慧賢者能力'
  if (level < 15) return '神聖先知模式'
  if (level < 20) return '夜神至尊權限'
  return '所有功能已解鎖'
}

const getCardRotation = (index: number): number => {
  const rotations = [-12, -6, 0, 6, 12, -9, 9, -15, 15]
  return rotations[index % rotations.length]
}

const getArcanaIcon = (arcana: string): string => {
  const icons = {
    'major': '🌟',
    'minor': '✨',
    'hidden': '🌙'
  }
  return icons[arcana as keyof typeof icons] || '✨'
}

const getElementIcon = (element: string): string => {
  const icons = {
    'fire': '🔥',
    'water': '💧',
    'air': '💨',
    'earth': '🌍'
  }
  return icons[element as keyof typeof icons] || ''
}

const initiateQuickReading = async () => {
  if (isLoading.value) return
  
  isCharging.value = true
  setTimeout(() => { isCharging.value = false }, 1000)
  
  // Show Herele poetry for advanced users
  if (userLevel.value >= 3) {
    showRandomHerelePoetry()
  }
  
  await nextTick()
  
  isReadingActive.value = true
  showCardSelection.value = true
  
  // Populate available cards based on user level
  const cardCount = Math.min(7 + Math.floor(userLevel.value / 3), 12)
  availableCards.value = shuffleCards(tarotStore.cards).slice(0, cardCount)
  
  // Animate cards appearing
  availableCards.value.forEach((card, index) => {
    setTimeout(() => {
      card.revealed = true
    }, index * 200)
  })
  
  addNotification('info', '🎴', tSync('cardsRevealed'), tSync('selectCards'))
}

// Warning and Registration Functions
const acceptWarning = () => {
  showWarningModal.value = false
  warningAcceptedOnce.value = true
  
  // If user has used their free flip, show registration modal
  if (freeCardFlipsUsed.value >= maxFreeFlips.value && !isMemorySystemActive.value) {
    setTimeout(() => {
      showRegistrationModal.value = true
    }, 300) // Small delay for smooth transition
  }
  // Otherwise, user can start using the system with 1 free card flip
}

const completeRegistration = async () => {
  if (!isValidRegistration()) {
    return
  }
  
  try {
    // Start memory system with user's email
    await cardMemorySystem.startSession(userRegistration.value.email)
    isMemorySystemActive.value = true
    showRegistrationModal.value = false
    
    // Save registration info (in production, send to backend)
    const registrationData = {
      name: userRegistration.value.name,
      email: userRegistration.value.email,
      password: userRegistration.value.password, // Hash in production
      timestamp: new Date().toISOString()
    }
    
    console.log('🌙 User registered:', registrationData)
    
    // Load existing flipped cards for this email
    loadFlippedCards()
    
  } catch (error) {
    console.error('Failed to complete registration:', error)
  }
}

const isValidRegistration = (): boolean => {
  return userRegistration.value.name.trim().length > 0 &&
         isValidEmail(userRegistration.value.email) &&
         userRegistration.value.password.length >= 6
}

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const flipAndSelectCard = (card: TarotCard) => {
  // Check if user has used their free card flip(s)
  if (!isMemorySystemActive.value) {
    if (freeCardFlipsUsed.value >= maxFreeFlips.value) {
      // Show registration modal
      showRegistrationModal.value = true
      return
    } else {
      // Allow free flip
      freeCardFlipsUsed.value++
    }
  }
  
  // Record the card flip (only if memory system is active)
  if (isMemorySystemActive.value) {
    try {
      cardMemorySystem.flipCard(card)
      loadFlippedCards() // Refresh the flipped cards display
    } catch (error) {
      console.error('Failed to record card flip:', error)
    }
  }
  
  // Original selection logic
  if (selectedCards.value.includes(card)) {
    selectedCards.value = selectedCards.value.filter(c => c.id !== card.id)
  } else if (selectedCards.value.length < 3) {
    selectedCards.value.push(card)
    
    // Card selection provides visual feedback via animations
    
    if (selectedCards.value.length === 3) {
      setTimeout(performDivination, 800)
    }
  }
  
  // Show warning modal first, then registration modal after first free flip
  if (!isMemorySystemActive.value && freeCardFlipsUsed.value >= maxFreeFlips.value) {
    setTimeout(() => {
      showWarningModal.value = true // Show warning first
      showRegistrationModal.value = false // Ensure registration is hidden
    }, 1500) // Delay to let card flip animation complete
  }
}

const isCardFlipped = (cardId: string): boolean => {
  return cardMemorySystem.isCardFlipped(cardId)
}

const loadFlippedCards = () => {
  if (cardMemorySystem.userEmail) {
    flippedCards.value = cardMemorySystem.getCardsByEmail(cardMemorySystem.userEmail)
    const stats = cardMemorySystem.getUserStats(cardMemorySystem.userEmail)
    sessionStats.value = {
      totalFlips: stats.totalFlips,
      uniqueCards: stats.uniqueCards
    }
  }
}

const getCardById = (cardId: string): TarotCard | undefined => {
  return tarotStore.cards.find(card => card.id === cardId)
}

const formatFlipTime = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-TW', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const selectCard = (card: TarotCard) => {
  // Deprecated - use flipAndSelectCard instead
  flipAndSelectCard(card)
}

const performDivination = async () => {
  isLoading.value = true
  
  const loadingMessages = [
    '連接宇宙意識...',
    '召喚神聖智慧...',
    '解析星象配置...',
    '編織命運之線...',
    '啟動神諭模式...'
  ]
  
  let messageIndex = 0
  const messageInterval = setInterval(() => {
    if (messageIndex < loadingMessages.length - 1) {
      messageIndex++
      loadingMessage.value = loadingMessages[messageIndex]
    }
  }, 1500)
  
  try {
    const modelCount = getModelCountForLevel(userLevel.value)
    loadingSubmessage.value = `正在調用${modelCount}個頂級AI模型`
    
    const reading = await aiSystem.performReading({
      userId: 'user-' + Date.now(),
      spreadId: 'three-card-spread',
      cards: selectedCards.value,
      question: userQuestion.value || '請為我的人生提供神聖指引',
      language: currentLanguage.value as 'zh' | 'en' | 'ja',
      mood: 'seeking guidance'
    })
    
    currentReading.value = reading.finalReading
    
    // Add experience and check for level up
    addExperience(35)
    
    // Update statistics
    userStats.totalReadings++
    localStorage.setItem('totalReadings', userStats.totalReadings.toString())
    
    addNotification('success', '✨', tSync('readingComplete'), tSync('wisdomRevealed'))
    
    // Suggest binaural audio for enhanced experience
    if (Math.random() < 0.3) { // 30% chance to suggest audio
      setTimeout(() => {
        addNotification('info', '🎵', tSync('audioSuggestion'), tSync('enhanceConnection'))
      }, 2000)
    }
    
  } catch (error) {
    console.error('Divination error:', error)
    addNotification('warning', '⚠️', tSync('connectionLost'), tSync('backupSystem'))
    
    // Fallback reading
    currentReading.value = generateFallbackReading()
  } finally {
    clearInterval(messageInterval)
    isLoading.value = false
  }
}

const getModelCountForLevel = (level: number): number => {
  if (level >= 20) return 8  // Supreme: All models
  if (level >= 15) return 6  // Prophet: 6 models
  if (level >= 10) return 4  // Sage: 4 models
  if (level >= 5) return 3   // Adept: 3 models
  return 2                   // Novice: 2 models
}

const generateFallbackReading = (): TarotReading => {
  const cardNames = selectedCards.value.map(c => c.name).join('、')
  
  return {
    id: `fallback-${Date.now()}`,
    userId: 'demo-user',
    spreadId: 'three-card-spread',
    question: userQuestion.value || '人生指引',
    cards: selectedCards.value.map((card, index) => ({
      positionId: `position-${index}`,
      cardId: card.id,
      reversed: Math.random() < 0.2
    })),
    interpretation: `
      <div class="fallback-reading">
        <h3>🌙 夜神塔羅 - 神聖解讀</h3>
        <p><strong>🎴 所選神牌：</strong>${cardNames}</p>
        <p><strong>💫 宇宙訊息：</strong>這次的抽牌蘊含著深刻的宇宙智慧。每一張牌都在告訴您，當前的人生階段正是成長與轉化的關鍵時期。</p>
        <p>星辰的排列暗示著，您內在的力量正在覺醒，過去的經歷將成為您前進的養分。相信自己的直覺，跟隨內心的聲音，宇宙會為您指引正確的道路。</p>
        <p><strong>🔮 神諭建議：</strong>保持開放的心態，擁抱變化，並相信每一個挑戰都是成長的機會。您的靈魂正在向更高的層次進化。</p>
      </div>
    `,
    timestamp: new Date(),
    isPublic: false,
    tags: ['fallback', 'divine-guidance'],
    title: '✨ 神聖指引'
  }
}

const showRandomHerelePoetry = () => {
  currentHerelePoetry.value = herelePoetryCollection[
    Math.floor(Math.random() * herelePoetryCollection.length)
  ]
  showHerelePoetry.value = true
  
  setTimeout(() => {
    showHerelePoetry.value = false
  }, 5000)
}

const hideHerelePoetry = () => {
  showHerelePoetry.value = false
}

const addExperience = (amount: number) => {
  const oldLevel = userLevel.value
  userExperience.value += amount
  
  if (userExperience.value >= maxExperience.value) {
    userLevel.value++
    userExperience.value = 0
    maxExperience.value = Math.floor(maxExperience.value * 1.5)
    
    localStorage.setItem('userLevel', userLevel.value.toString())
    localStorage.setItem('userExperience', '0')
    
    if (oldLevel !== userLevel.value) {
      addNotification('achievement', '🎉', tSync('levelUp'), 
        `恭喜升級到${getSoulRank(userLevel.value)}`)
    }
  } else {
    localStorage.setItem('userExperience', userExperience.value.toString())
  }
}

const shuffleCards = (cards: TarotCard[]): TarotCard[] => {
  const shuffled = [...cards]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const addNotification = (
  type: 'success' | 'info' | 'warning' | 'achievement',
  icon: string,
  title: string,
  message: string
) => {
  const notification = {
    id: `notif-${Date.now()}`,
    type,
    icon,
    title,
    message
  }
  
  notifications.value.push(notification)
  
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== notification.id)
  }, 4500) // Extended to 4.5s to match CSS animation timing
}


const resetReading = () => {
  currentReading.value = null
  selectedCards.value = []
  availableCards.value = []
  showCardSelection.value = false
  isReadingActive.value = false
  userQuestion.value = ''
}

const shareReading = () => {
  if (currentReading.value) {
    const shareText = `我剛在夜神塔羅獲得了神聖的占卜結果！ ✨\n\n${currentReading.value.title}\n\n來體驗AI驅動的神秘占卜吧：https://nightgodtarot.com`
    
    if (navigator.share) {
      navigator.share({
        title: '夜神塔羅 - 神諭分享',
        text: shareText,
        url: 'https://nightgodtarot.com'
      })
    } else {
      navigator.clipboard.writeText(shareText)
      addNotification('success', '📋', tSync('copied'), tSync('resultCopied'))
    }
  }
}

const saveReading = () => {
  if (currentReading.value) {
    const savedReadings = JSON.parse(localStorage.getItem('savedReadings') || '[]')
    savedReadings.push(currentReading.value)
    localStorage.setItem('savedReadings', JSON.stringify(savedReadings))
    
    addNotification('success', '💾', tSync('saved'), tSync('readingSaved'))
  }
}

// showCardDetails function removed with library functionality

const selectChapter = (chapter: typeof novelChapters[0]) => {
  if (chapter.unlocked) {
    currentChapter.value = chapter.id
    // Implementation for chapter reading
    // Opening chapter
  } else {
    addNotification('info', '🔒', tSync('chapterLocked'), `需要達到${chapter.id === 'chapter-2' ? '星辰學徒' : '更高'}等級`)
  }
}

// Audio toggle removed - using BinauralAudioPlayer instead

const toggleLanguage = async () => {
  // Cycle through languages: Chinese → English → Japanese → Chinese
  if (currentLanguage.value === 'zh') {
    currentLanguage.value = 'en'
  } else if (currentLanguage.value === 'en') {
    currentLanguage.value = 'ja'
  } else {
    currentLanguage.value = 'zh'
  }
  
  localStorage.setItem('preferredLanguage', currentLanguage.value)
  
  // Trigger batch translation for any non-Chinese language
  if (currentLanguage.value !== 'zh') {
    await translateAllTexts()
  }
  
  // Force reactive updates by triggering component re-render
  await nextTick()
}

const getLanguageToggleText = () => {
  switch (currentLanguage.value) {
    case 'zh': return 'EN'
    case 'en': return '日'
    case 'ja': return '中'
    default: return 'EN'
  }
}

const createStarField = () => {
  const starField = document.querySelector('.star-field')
  if (!starField) return
  
  for (let i = 0; i < 150; i++) {
    const star = document.createElement('div')
    star.className = 'star'
    star.style.left = Math.random() * 100 + '%'
    star.style.top = Math.random() * 100 + '%'
    star.style.animationDelay = Math.random() * 3 + 's'
    star.style.opacity = (Math.random() * 0.8 + 0.2).toString()
    starField.appendChild(star)
  }
}

const initializeParticleSystem = () => {
  // Particle system initialization would go here
  // Particle system initialized
}

// Lifecycle
onMounted(async () => {
  // Load saved language preference
  const savedLanguage = localStorage.getItem('preferredLanguage')
  if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en' || savedLanguage === 'ja')) {
    currentLanguage.value = savedLanguage as 'zh' | 'en' | 'ja'
  }
  
  createStarField()
  initializeParticleSystem()
  
  // Initialize AI system and Monica translator
  await Promise.all([
    aiSystem.initialize(),
    monicaTranslator.initialize()
  ])
  
  // Pre-translate if non-Chinese language is selected
  if (currentLanguage.value !== 'zh') {
    await translateAllTexts()
  }
  
  // Check if user has already registered and activate memory system
  const savedEmail = cardMemorySystem.getSavedEmail()
  if (savedEmail) {
    showWarningModal.value = false
    warningAcceptedOnce.value = true
    isMemorySystemActive.value = true
    await cardMemorySystem.startSession(savedEmail)
    loadFlippedCards()
  }
  
  // Cycle lunar phases
  setInterval(() => {
    currentPhase.value = (currentPhase.value + 1) % lunarPhases.length
  }, 3000)
  
  // Audio settings managed by BinauralAudioPlayer
  
  // Ultimate Night God Tarot initialized
})

// Watchers
watch(userLevel, (newLevel, oldLevel) => {
  if (newLevel > oldLevel) {
    // Update chapter unlocks
    novelChapters.forEach(chapter => {
      if (chapter.id === 'chapter-2' && newLevel >= 5) chapter.unlocked = true
      if (chapter.id === 'chapter-3' && newLevel >= 10) chapter.unlocked = true
      if (chapter.id === 'chapter-4' && newLevel >= 15) chapter.unlocked = true
      if (chapter.id === 'chapter-5' && newLevel >= 20) chapter.unlocked = true
    })
    
    // Update achievements
    userAchievements.forEach(achievement => {
      if (achievement.id === 'herele-unlock' && newLevel >= 3) achievement.unlocked = true
      if (achievement.id === 'ai-master' && newLevel >= 10) achievement.unlocked = true
      if (achievement.id === 'novel-reader' && newLevel >= 5) achievement.unlocked = true
      if (achievement.id === 'soul-guide' && newLevel >= 20) achievement.unlocked = true
    })
  }
})
</script>

<style scoped>
/* Cosmic Foundation */
.night-god-tarot-universe {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(circle at center, #1a1a2e 0%, #16213e 50%, #0a0a0a 100%);
  color: #ffffff;
  overflow-x: hidden;
  font-family: 'Noto Serif TC', serif;
}

/* Cosmic Canvas */
.cosmic-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.star-field {
  position: absolute;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #ffffff;
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.nebula-streams {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at 20% 70%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 30%, rgba(255, 20, 147, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 40% 40%, rgba(0, 191, 255, 0.06) 0%, transparent 50%);
  animation: nebulaFlow 20s ease-in-out infinite;
}

@keyframes nebulaFlow {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(-10px) translateY(-5px); }
  50% { transform: translateX(5px) translateY(10px); }
  75% { transform: translateX(-5px) translateY(-10px); }
}

.quantum-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(1px 1px at 10px 20px, #ffd700, transparent),
    radial-gradient(1px 1px at 80px 90px, #ff6b35, transparent),
    radial-gradient(1px 1px at 40px 70px, #4ecdc4, transparent);
  animation: quantumShift 15s linear infinite;
}

@keyframes quantumShift {
  0% { transform: translateY(0); }
  100% { transform: translateY(-100px); }
}

.sacred-geometry-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  pointer-events: none;
}

.sacred-svg {
  width: 100%;
  height: 100%;
}

.metatron-cube {
  transform-origin: center;
  transition: all 1s ease;
}

.metatron-cube.activated {
  animation: geometryActivation 3s ease-in-out infinite;
}

@keyframes geometryActivation {
  0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.3; }
  50% { transform: rotate(5deg) scale(1.05); opacity: 0.6; }
}

/* Main Interface */
.main-interface {
  position: relative;
  z-index: 10;
  transition: all 0.8s ease;
  padding: 1rem;
}

.main-interface.reading-mode {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

/* Mystical Header */
.mystical-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  max-width: 1400px;
  margin: 0 auto;
}

.brand-constellation {
  text-align: center;
  flex: 1;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.language-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  backdrop-filter: blur(10px);
}

.language-toggle:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}

.language-toggle.active {
  background: rgba(255, 215, 0, 0.3);
  border-color: rgba(255, 215, 0, 0.8);
}

.lang-icon {
  font-size: 1.2rem;
}

.lang-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffd700;
  margin-left: 0.2rem;
}

.lunar-phases {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.phase {
  font-size: 1.8rem;
  opacity: 0.4;
  transition: all 0.5s ease;
  cursor: default;
}

.phase.active {
  opacity: 1;
  transform: scale(1.3);
  text-shadow: 0 0 20px #ffd700;
}

.cosmic-title {
  font-size: 4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffd700 0%, #ff6b35 50%, #4ecdc4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
}

.subtitle-glow {
  color: #c9b037;
  font-size: 1.2rem;
  margin-top: 0.5rem;
  opacity: 0.9;
}

/* Ascension Display */
.ascension-display {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  backdrop-filter: blur(15px);
}

.level-mandala {
  position: relative;
  width: 80px;
  height: 80px;
}

.mandala-rings {
  position: absolute;
  width: 100%;
  height: 100%;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
}

.ring.primary {
  width: 100%;
  height: 100%;
  border-top: 2px solid #ffd700;
  animation: mandalaRotate 4s linear infinite;
}

.ring.secondary {
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  border-right: 2px solid #ff6b35;
  animation: mandalaRotate 3s linear infinite reverse;
}

.ring.tertiary {
  width: 40%;
  height: 40%;
  top: 30%;
  left: 30%;
  border-bottom: 2px solid #4ecdc4;
  animation: mandalaRotate 2s linear infinite;
}

@keyframes mandalaRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.level-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 215, 0, 0.2);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.level-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffd700;
}

.ascension-info {
  min-width: 200px;
}

.soul-rank {
  font-size: 1.1rem;
  color: #ffd700;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.experience-flow {
  width: 200px;
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.exp-stream {
  height: 100%;
  background: linear-gradient(90deg, #ffd700, #ff6b35, #4ecdc4);
  border-radius: 5px;
  transition: width 1s ease;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.next-unlock {
  font-size: 0.9rem;
  color: #c9b037;
}

/* Divine Tabs */
.divine-tabs {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 3rem 0;
}

.divine-tab {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 1rem 2rem;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.divine-tab:hover {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
  transform: translateY(-2px);
}

.divine-tab.active {
  border-color: #ffd700;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 107, 53, 0.1));
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
}

.tab-icon {
  font-size: 1.5rem;
}

.tab-name {
  font-weight: 600;
  font-size: 1.1rem;
}

/* Tab Content */
.tab-content {
  max-width: 1200px;
  margin: 0 auto;
}

.oracle-realm,
.novel-realm,
.progress-realm {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.realm-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Oracle Realm */
.oracle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}


@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Divination Portal */
.divination-portal {
  text-align: center;
  margin-bottom: 4rem;
}

.portal-energy {
  position: relative;
  margin-bottom: 3rem;
}

.portal-energy.charging {
  animation: portalCharge 2s ease-in-out;
}

@keyframes portalCharge {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); filter: brightness(1.2); }
}

.portal-activator {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 107, 53, 0.1));
  border: 3px solid #ffd700;
  border-radius: 50%;
  width: 200px;
  height: 200px;
  cursor: pointer;
  transition: all 0.5s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.portal-activator:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 50px rgba(255, 215, 0, 0.6);
}

.portal-activator:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.activator-core {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
}

.core-symbol {
  font-size: 3rem;
  text-shadow: 0 0 20px #ffd700;
}

.core-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffd700;
}

.energy-rings {
  position: absolute;
  width: 100%;
  height: 100%;
}

.energy-ring {
  position: absolute;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  animation: energyPulse 2s linear infinite;
}

.energy-ring.ring-1 {
  width: 90%;
  height: 90%;
  top: 5%;
  left: 5%;
}

.energy-ring.ring-2 {
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  animation-delay: 0.7s;
}

.energy-ring.ring-3 {
  width: 50%;
  height: 50%;
  top: 25%;
  left: 25%;
  animation-delay: 1.4s;
}

@keyframes energyPulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.2); opacity: 0; }
}

/* Question Altar */
.question-altar {
  max-width: 600px;
  margin: 0 auto;
  text-align: left;
}

.altar-label {
  display: block;
  font-size: 1.2rem;
  color: #ffd700;
  margin-bottom: 1rem;
  font-weight: 600;
}

.question-input {
  width: 100%;
  min-height: 120px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 1.5rem;
  color: #ffffff;
  font-size: 1.1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
}

.question-input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.question-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

.question-counter {
  text-align: right;
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

/* Card Constellation */
.card-constellation {
  margin: 4rem 0;
}

.constellation-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #ffd700, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-grid {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  perspective: 1000px;
  margin-bottom: 3rem;
}

.cosmic-card {
  width: 140px;
  height: 220px;
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation: cardMaterialize 1s ease forwards;
  animation-delay: var(--delay);
  opacity: 0;
  transform: translateY(100px) rotateX(-90deg);
}

@keyframes cardMaterialize {
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0deg) rotateZ(var(--rotation));
  }
}

.cosmic-card:hover {
  transform: translateY(-20px) scale(1.05) rotateZ(0deg);
  z-index: 10;
}

.cosmic-card.selected {
  transform: translateY(-25px) scale(1.08) rotateZ(0deg);
  z-index: 15;
}

.card-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 1s ease;
}

.cosmic-card.revealed .card-container {
  transform: rotateY(180deg);
}

.card-back,
.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
}

.card-back {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #ffd700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-mandala {
  text-align: center;
  position: relative;
}

.mandala-center {
  font-size: 3rem;
  color: #ffd700;
  animation: mandalaPulse 3s ease-in-out infinite;
  position: relative;
  z-index: 2;
}

@keyframes mandalaPulse {
  0%, 100% { text-shadow: 0 0 20px #ffd700; transform: scale(1); }
  50% { text-shadow: 0 0 40px #ffd700, 0 0 60px #ff6b35; transform: scale(1.1); }
}

.mandala-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.mandala-ring {
  position: absolute;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  animation: mandalaRotate 4s linear infinite;
}

.mandala-ring:first-child {
  width: 80px;
  height: 80px;
  margin: -40px 0 0 -40px;
}

.mandala-ring:last-child {
  width: 60px;
  height: 60px;
  margin: -30px 0 0 -30px;
  animation-direction: reverse;
  animation-duration: 3s;
}

.card-front {
  background: linear-gradient(135deg, #2d1b69 0%, #11998e 100%);
  border: 2px solid #4ecdc4;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  padding: 1rem;
  color: #ffffff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #ffd700;
}

.card-artwork {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 8px;
}

.card-artwork img {
  width: 100%;
  height: auto;
  max-height: 120px;
  object-fit: cover;
}

.card-title {
  font-weight: 600;
  text-align: center;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.card-element {
  text-align: center;
  font-size: 1.5rem;
}

.selection-aura {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(45deg, #ffd700, #ff6b35, #4ecdc4, #ffd700);
  border-radius: 17px;
  opacity: 0;
  z-index: -1;
  animation: auraRotate 3s linear infinite;
}

.cosmic-card.selected .selection-aura {
  opacity: 1;
}

@keyframes auraRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Selection Status */
.selection-status {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.status-text {
  font-size: 1.2rem;
  color: #ffd700;
}

.status-indicators {
  display: flex;
  gap: 1rem;
}

.indicator {
  width: 16px;
  height: 16px;
  border: 2px solid #ffd700;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.indicator.filled {
  background: #ffd700;
  box-shadow: 0 0 15px #ffd700;
}

/* Reading Display */
.reading-display {
  margin-top: 4rem;
  animation: readingAppear 1s ease;
}

@keyframes readingAppear {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

.reading-container {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 25px;
  padding: 3rem;
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.reading-header {
  text-align: center;
  margin-bottom: 3rem;
}

.reading-title {
  font-size: 2.2rem;
  color: #ffd700;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.ai-ensemble {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.ai-badge {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.9rem;
  color: #c9b037;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.reading-content {
  line-height: 1.8;
  font-size: 1.15rem;
  margin-bottom: 3rem;
  color: #f0f0f0;
}

.reading-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 1rem 2rem;
  border: 2px solid;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 600;
}

.share-btn {
  border-color: #4ecdc4;
}

.share-btn:hover {
  background: rgba(78, 205, 196, 0.2);
  transform: translateY(-2px);
}

.save-btn {
  border-color: #ffd700;
}

.save-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: translateY(-2px);
}

.reset-btn {
  border-color: #ff6b35;
}

.reset-btn:hover {
  background: rgba(255, 107, 53, 0.2);
  transform: translateY(-2px);
}


/* Novel Realm */
.novel-interface {
  max-width: 800px;
  margin: 0 auto;
}

.chapters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.chapter-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.chapter-card.unlocked {
  border-color: rgba(255, 215, 0, 0.3);
}

.chapter-card.unlocked:hover {
  border-color: #ffd700;
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(255, 215, 0, 0.2);
}

.chapter-card.current {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
}

.chapter-number {
  font-size: 1.2rem;
  color: #ffd700;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.chapter-title {
  font-size: 1.4rem;
  color: #ffffff;
  margin-bottom: 1rem;
}

.chapter-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
}

/* Progress Realm */
.progress-dashboard {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  gap: 3rem;
}

.achievement-gallery h3,
.statistics-panel h3 {
  color: #ffd700;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.achievement-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.achievement-card.unlocked {
  border-color: rgba(255, 215, 0, 0.3);
  background: rgba(255, 215, 0, 0.05);
}

.achievement-card.unlocked:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.2);
}

.achievement-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.achievement-name {
  font-size: 1.2rem;
  color: #ffd700;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.achievement-desc {
  color: #c9b037;
  font-size: 0.9rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  color: #ffd700;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #c9b037;
  font-size: 1rem;
}

/* Herele Modal */
.herele-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  animation: fadeIn 0.5s ease;
}

.herele-container {
  max-width: 700px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid #ffd700;
  border-radius: 25px;
  padding: 3rem;
  text-align: center;
  backdrop-filter: blur(25px);
}

.herele-header h3 {
  color: #ffd700;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.herele-subtitle {
  color: #c9b037;
  font-style: italic;
  margin-bottom: 2rem;
}

.herele-original {
  font-size: 2rem;
  color: #ffffff;
  font-style: italic;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  line-height: 1.4;
}

.herele-translation {
  font-size: 1.3rem;
  color: #c9b037;
  font-style: italic;
  margin-bottom: 2rem;
}

.herele-close {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

/* Loading Portal */
.loading-portal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 4000;
}

.portal-vortex {
  position: relative;
  width: 150px;
  height: 150px;
  margin-bottom: 3rem;
}

.vortex-ring {
  position: absolute;
  border: 2px solid transparent;
  border-radius: 50%;
  animation: vortexSpin 3s linear infinite;
}

.vortex-ring.ring-1 {
  width: 150px;
  height: 150px;
  top: 0;
  left: 0;
  border-top: 2px solid #ffd700;
  animation-duration: 2s;
}

.vortex-ring.ring-2 {
  width: 120px;
  height: 120px;
  top: 15px;
  left: 15px;
  border-right: 2px solid #ff6b35;
  animation-duration: 1.5s;
  animation-direction: reverse;
}

.vortex-ring.ring-3 {
  width: 90px;
  height: 90px;
  top: 30px;
  left: 30px;
  border-bottom: 2px solid #4ecdc4;
  animation-duration: 1s;
}

.vortex-ring.ring-4 {
  width: 60px;
  height: 60px;
  top: 45px;
  left: 45px;
  border-left: 2px solid #ffd700;
  animation-duration: 0.7s;
  animation-direction: reverse;
}

@keyframes vortexSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-message {
  font-size: 1.5rem;
  color: #ffd700;
  font-weight: 600;
  margin-bottom: 1rem;
  animation: textPulse 2s ease-in-out infinite;
}

.loading-submessage {
  font-size: 1.1rem;
  color: #c9b037;
  animation: textPulse 2s ease-in-out infinite;
  animation-delay: 0.5s;
}

@keyframes textPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* Notification Cosmos */
.notification-cosmos {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 5000;
}

.cosmic-notification {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.95), rgba(255, 107, 53, 0.9));
  border-radius: 15px;
  border: 2px solid rgba(255, 215, 0, 0.8);
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: notificationSlide 0.5s ease, notificationFade 0.5s ease 3.5s forwards;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 215, 0, 0.3);
  color: #000;
  max-width: 350px;
  backdrop-filter: blur(10px);
  font-weight: 500;
}

.cosmic-notification.achievement {
  background: linear-gradient(135deg, rgba(255, 215, 0, 1), rgba(255, 0, 128, 0.8));
}

@keyframes notificationSlide {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes notificationFade {
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.notification-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notification-title {
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 0.2rem;
}

.notification-message {
  font-size: 0.9rem;
  opacity: 0.9;
}


/* Responsive Design */
@media (max-width: 768px) {
  .cosmic-title {
    font-size: 2.5rem;
  }
  
  .mystical-header {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
  
  .divine-tabs {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .divine-tab {
    flex: 1;
    min-width: 120px;
  }
  
  .card-grid {
    gap: 1rem;
  }
  
  .cosmic-card {
    width: 120px;
    height: 190px;
  }
  
  .portal-activator {
    width: 160px;
    height: 160px;
  }
  
  .reading-container {
    padding: 2rem;
  }
  
  .reading-actions {
    flex-direction: column;
  }
  
  .herele-container {
    margin: 1rem;
    padding: 2rem;
  }
  
  .herele-original {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .cosmic-title {
    font-size: 2rem;
  }
  
  .ascension-display {
    flex-direction: column;
    text-align: center;
  }
  
  .card-grid {
    justify-content: center;
  }
  
  .cosmic-card {
    width: 100px;
    height: 160px;
  }
}

/* Orchestration Controls */
.orchestration-controls {
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.15), rgba(75, 0, 130, 0.15));
  border: 2px solid rgba(138, 43, 226, 0.3);
  border-radius: 20px;
  padding: 2rem;
  margin-top: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.orchestration-controls:not(.available) {
  opacity: 0.6;
  filter: grayscale(50%);
}

.orchestration-controls.available {
  border-color: rgba(255, 215, 0, 0.4);
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.1));
}

.control-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.control-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6));
}

.control-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.level-requirement {
  font-size: 0.9rem;
  color: #888;
  font-style: italic;
}

.orchestration-toggle {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.toggle-container {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  cursor: pointer;
}

.orchestration-checkbox {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #4a0e4e, #2d1b69);
  border: 2px solid rgba(138, 43, 226, 0.5);
  transition: all 0.3s ease;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 24px;
  width: 24px;
  left: 3px;
  bottom: 3px;
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  transition: all 0.3s ease;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.orchestration-checkbox:checked + .toggle-slider {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  border-color: rgba(255, 215, 0, 0.8);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
}

.orchestration-checkbox:checked + .toggle-slider:before {
  transform: translateX(26px);
  background: linear-gradient(135deg, #4a0e4e, #2d1b69);
  box-shadow: 0 0 15px rgba(138, 43, 226, 0.5);
}

.toggle-description {
  flex: 1;
}

.description-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffd700;
  margin-bottom: 0.5rem;
}

.description-text {
  font-size: 0.95rem;
  color: #c9b037;
  line-height: 1.4;
}

.pipeline-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  animation: pipelineGlow 2s ease-in-out infinite alternate;
}

.pipeline-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
}

.stage-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
}

.stage-name {
  font-size: 0.85rem;
  color: #ffd700;
  text-align: center;
  font-weight: 500;
}

.pipeline-arrow {
  font-size: 1.5rem;
  color: #ffd700;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
  animation: arrowPulse 1.5s ease-in-out infinite;
}

@keyframes pipelineGlow {
  0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.1); }
  100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.3); }
}

@keyframes arrowPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* Mobile Responsiveness for Orchestration Controls */
@media (max-width: 768px) {
  .orchestration-controls {
    padding: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .control-title {
    font-size: 1.1rem;
  }
  
  .orchestration-toggle {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .pipeline-preview {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pipeline-arrow {
    transform: rotate(90deg);
  }
  
  .stage-name {
    font-size: 0.8rem;
  }
}

/* Warning Modal Styles */
.warning-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: modalFadeIn 0.5s ease;
}

.warning-portal {
  position: relative;
  background: linear-gradient(135deg, rgba(139, 0, 0, 0.95), rgba(178, 34, 34, 0.9));
  border: 2px solid #ff4444;
  border-radius: 20px;
  padding: 4rem 3rem;
  max-width: 800px;
  width: 95%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(255, 68, 68, 0.3);
  max-height: 90vh;
  overflow-y: auto;
}

.warning-header h3 {
  color: #ff4444;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
}

.warning-content {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 2.5rem;
  margin: 2rem 0;
  border: 1px solid rgba(255, 68, 68, 0.3);
}

.warning-content p {
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 2rem;
  font-size: 1.3rem;
  line-height: 1.8;
  font-weight: 500;
}

.warning-points {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  text-align: left;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 10px;
  padding: 2rem;
}

.warning-points li {
  color: rgba(255, 255, 255, 0.95);
  margin: 1.5rem 0;
  padding-left: 3rem;
  position: relative;
  line-height: 1.7;
  font-size: 1.1rem;
  font-weight: 500;
}

.warning-points li:before {
  content: "⚠️";
  position: absolute;
  left: 0;
  top: 0;
  font-size: 1.3rem;
}

.warning-actions {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 68, 68, 0.3);
}

.accept-warning-btn {
  background: linear-gradient(135deg, #ff4444, #ff6666);
  border: none;
  border-radius: 15px;
  color: white;
  font-weight: 700;
  font-size: 1.3rem;
  padding: 1.5rem 3rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: 0 5px 15px rgba(255, 68, 68, 0.4);
}

.accept-warning-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 68, 68, 0.4);
}

/* Memory System Styles */
.memory-login-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: modalFadeIn 0.5s ease;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.login-portal {
  position: relative;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(22, 33, 62, 0.9));
  border: 2px solid #ffd700;
  border-radius: 20px;
  padding: 3.5rem 3rem;
  max-width: 650px;
  width: 95%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
  max-height: 90vh;
  overflow-y: auto;
}

.portal-header h3 {
  color: #ffd700;
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.portal-header p {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
  line-height: 1.7;
  font-size: 1.1rem;
}

.email-input-section {
  margin-bottom: 2rem;
}

.email-label {
  display: block;
  color: #ffd700;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.mystical-email-input {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.mystical-email-input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

.mystical-email-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.activate-memory-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border: none;
  border-radius: 10px;
  color: #1a1a2e;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.activate-memory-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
}

.activate-memory-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.memory-benefits {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
  color: rgba(255, 255, 255, 0.9);
}

.benefit-icon {
  font-size: 1.5rem;
}

/* Registration Form Styles */
.registration-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-label {
  display: block;
  color: #ffd700;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.mystical-input {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.mystical-input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

.mystical-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.registration-benefits {
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  padding-top: 1.5rem;
}

.free-trial-text {
  color: #ffd700;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.1rem;
}

/* Flipped Cards Gallery */
.flipped-cards-gallery {
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.gallery-title {
  color: #ffd700;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.flipped-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.flipped-card-display {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.flipped-card-display:hover {
  transform: translateY(-5px);
  border-color: #ffd700;
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.2);
}

.flipped-card-image {
  height: 100px;
  overflow: hidden;
}

.flipped-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.flipped-card-info {
  padding: 0.5rem;
  text-align: center;
}

.flipped-card-name {
  color: #ffd700;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.flipped-timestamp {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.7rem;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive for memory system */
@media (max-width: 768px) {
  .warning-portal {
    padding: 2.5rem 1.5rem;
    max-width: 95%;
    width: 95%;
  }
  
  .warning-header h3 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .warning-content {
    padding: 1.5rem;
    margin: 1.5rem 0;
  }
  
  .warning-content p {
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  .warning-points {
    padding: 1.5rem;
  }
  
  .warning-points li {
    font-size: 1rem;
    line-height: 1.6;
    margin: 1rem 0;
    padding-left: 2.5rem;
  }
  
  .accept-warning-btn {
    font-size: 1.1rem;
    padding: 1.2rem 2rem;
  }
  
  .login-portal {
    padding: 2rem 1.5rem;
    max-width: 95%;
  }
  
  .portal-header h3 {
    font-size: 1.8rem;
  }
  
  .portal-header p {
    font-size: 1rem;
  }
  
  .flipped-cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.5rem;
  }
}

/* Large screen optimizations */
@media (min-width: 1200px) {
  .warning-portal {
    max-width: 900px;
    padding: 5rem 4rem;
  }
  
  .warning-content {
    padding: 3rem;
  }
  
  .warning-content p {
    font-size: 1.4rem;
  }
  
  .warning-points li {
    font-size: 1.2rem;
    margin: 2rem 0;
  }
  
  .login-portal {
    max-width: 750px;
    padding: 4rem;
  }
}
</style>