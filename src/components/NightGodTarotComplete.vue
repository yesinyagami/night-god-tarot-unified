<template>
  <div class="night-god-tarot-complete">
    <!-- Cosmic Background -->
    <div class="cosmic-background">
      <div class="stars"></div>
      <div class="nebula"></div>
    </div>

    <!-- Main Interface -->
    <div class="main-container">
      <!-- Header -->
      <header class="cosmic-header">
        <div class="logo-container">
          <h1 class="logo-title">{{ t.title }}</h1>
          <p class="logo-subtitle">{{ t.subtitle }}</p>
        </div>
        <div class="header-controls">
          <div class="language-switcher">
            <button 
              v-for="lang in ['en', 'zh', 'ja']" 
              :key="lang"
              @click="switchLanguage(lang)"
              :class="{ active: currentLanguage === lang }"
              class="lang-btn"
            >test
              {{ lang.toUpperCase() }}
            </button>
          </div>
          <div class="status-bar">
            <div class="ai-status">{{ t.aiStatus }}</div>
            <div class="security-status">{{ t.securityStatus }}</div>
          </div>
        </div>
      </header>

      <!-- Question Input -->
      <div class="question-section">
        <div class="question-container">
          <label class="question-label">{{ t.askQuestion }}</label>
          <textarea
            v-model="question"
            :placeholder="t.questionPlaceholder"
            class="question-input"
            rows="3"
            @keydown.enter.meta="startReading"
            @keydown.enter.ctrl="startReading"
          ></textarea>
          <button
            @click="startReading"
            :disabled="isLoading || !question.trim()"
            class="oracle-button"
          >
            <span v-if="!isLoading">{{ t.activateOracle }}</span>
            <span v-else>{{ t.consulting }}</span>
          </button>
        </div>
      </div>

      <!-- Reading Progress -->
      <div v-if="isLoading" class="reading-progress">
        <div class="progress-container">
          <div class="progress-circle">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#334155"
                stroke-width="8"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                :stroke-dasharray="314"
                :stroke-dashoffset="314 - (progress * 3.14)"
                stroke="#FFD700"
                stroke-width="8"
                fill="transparent"
                class="progress-ring"
              />
            </svg>
            <div class="progress-text">{{ Math.round(progress) }}%</div>
          </div>
          <div class="progress-stages">
            <div class="stage-item" v-for="(stage, index) in stages" :key="index" 
                 :class="{ active: currentStage === index, completed: currentStage > index }">
              <div class="stage-icon">{{ stage.icon }}</div>
              <div class="stage-name">{{ stage.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cards Display -->
      <div v-if="selectedCards.length > 0" class="cards-section">
        <div class="cards-container">
          <div
            v-for="(card, index) in selectedCards"
            :key="index"
            class="tarot-card"
            :class="{ revealed: card.revealed }"
            @click="revealCard(index)"
          >
            <div class="card-inner">
              <div class="card-back">
                <div class="card-pattern">🌙</div>
              </div>
              <div class="card-front">
                <h3 class="card-name">{{ card.name }}</h3>
                <div class="card-image">🃏</div>
                <p class="card-meaning">{{ card.meaning }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reading Result -->
      <div v-if="readingResult" class="reading-result">
        <div class="result-container">
          <h2 class="result-title">{{ t.divineReading }}</h2>
          <div class="result-content">
            <div class="reading-text">{{ readingResult.interpretation }}</div>
            
            <div class="insights-section">
              <h3 class="insights-title">{{ t.cosmicInsights }}</h3>
              <div class="insight-item" v-for="(insight, key) in readingResult.insights" :key="key">
                <strong>{{ formatKey(key) }}:</strong> {{ insight }}
              </div>
            </div>

            <div class="advice-section">
              <h3 class="advice-title">{{ t.divineGuidance }}</h3>
              <p class="advice-text">{{ readingResult.advice }}</p>
            </div>

            <div class="affirmation-section">
              <h3 class="affirmation-title">{{ t.yourAffirmation }}</h3>
              <p class="affirmation-text">"{{ readingResult.affirmation }}"</p>
            </div>
          </div>

          <div class="result-actions">
            <button @click="saveReading" class="save-button">{{ t.saveReading }}</button>
            <button @click="shareReading" class="share-button">{{ t.share }}</button>
            <button @click="newReading" class="new-reading-button">{{ t.newReading }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="cosmic-footer">
      <p>{{ t.footer }}</p>
      <p><a href="https://yesinyagami-jp.carrd.co/" target="_blank" class="creator-link">🌟 Created by YesinYagami</a></p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { enhancedReadingEngine } from '../services/ai/enhancedReadingEngine'

// Language Support
interface Translations {
  [key: string]: {
    [key: string]: string
  }
}

const translations: Translations = {
  en: {
    title: '🌙 NIGHT GOD TAROT',
    subtitle: 'Ultimate AI-Powered Divination Platform',
    aiStatus: '🤖 Multi-AI Active',
    securityStatus: '🔐 Secure',
    askQuestion: 'Ask the Universe Your Question',
    questionPlaceholder: 'What guidance do you seek from the cosmic energies?',
    activateOracle: '🔮 Activate Oracle',
    consulting: '✨ Consulting Universe...',
    connecting: '🌌 Connecting',
    drawingCards: '🃏 Drawing Cards',
    aiAnalysis: '🤖 AI Analysis',
    interpreting: '✨ Interpreting',
    finalizing: '🔮 Finalizing',
    divineReading: '🌟 Your Divine Reading',
    cosmicInsights: '✨ Cosmic Insights',
    divineGuidance: '🔮 Divine Guidance',
    yourAffirmation: '💫 Your Affirmation',
    saveReading: '💾 Save Reading',
    share: '📤 Share',
    newReading: '🔄 New Reading',
    readingSaved: '✨ Reading saved successfully!',
    readingCopied: '📋 Reading copied to clipboard!',
    past: 'Past',
    present: 'Present',
    future: 'Future',
    footer: '© 2024 Night God Tarot • Powered by Advanced AI • Secured & Optimized'
  },
  zh: {
    title: '🌙 夜神塔羅',
    subtitle: '終極AI神諭占卜平台',
    aiStatus: '🤖 多重AI啟動中',
    securityStatus: '🔐 安全防護',
    askQuestion: '向宇宙詢問您的問題',
    questionPlaceholder: '您想從宇宙能量中尋求什麼指引？',
    activateOracle: '🔮 啟動神諭',
    consulting: '✨ 請示宇宙中...',
    connecting: '🌌 連接中',
    drawingCards: '🃏 抽取卡牌',
    aiAnalysis: '🤖 AI分析',
    interpreting: '✨ 解讀中',
    finalizing: '🔮 最終確認',
    divineReading: '🌟 您的神諭解讀',
    cosmicInsights: '✨ 宇宙洞察',
    divineGuidance: '🔮 神聖指引',
    yourAffirmation: '💫 您的肯定語',
    saveReading: '💾 保存解讀',
    share: '📤 分享',
    newReading: '🔄 新的解讀',
    readingSaved: '✨ 解讀已成功保存！',
    readingCopied: '📋 解讀已復製到剪貼板！',
    past: '過去',
    present: '現在',
    future: '未來',
    footer: '© 2024 夜神塔羅 • 先進AI驅動 • 安全優化'
  },
  ja: {
    title: '🌙 夜神タロット',
    subtitle: '究極のAI占いプラットフォーム',
    aiStatus: '🤖 マルチAI作動中',
    securityStatus: '🔐 セキュア',
    askQuestion: '宇宙にあなたの質問を聞く',
    questionPlaceholder: '宇宙のエネルギーからどんな導きを求めますか？',
    activateOracle: '🔮 オラクル起動',
    consulting: '✨ 宇宙に相談中...',
    connecting: '🌌 接続中',
    drawingCards: '🃏 カード抽選',
    aiAnalysis: '🤖 AI分析',
    interpreting: '✨ 解釈中',
    finalizing: '🔮 最終確認',
    divineReading: '🌟 あなたの神託',
    cosmicInsights: '✨ 宇宙の洞察',
    divineGuidance: '🔮 神聖な導き',
    yourAffirmation: '💫 あなたのアファメーション',
    saveReading: '💾 リーディング保存',
    share: '📤 シェア',
    newReading: '🔄 新しいリーディング',
    readingSaved: '✨ リーディングが正常に保存されました！',
    readingCopied: '📋 リーディングがクリップボードにコピーされました！',
    past: '過去',
    present: '現在',
    future: '未来',
    footer: '© 2024 夜神タロット • 高度なAI搭載 • セキュア・最適化'
  }
}

interface TarotCard {
  name: string
  meaning: string
  revealed: boolean
}

interface ReadingResult {
  interpretation: string
  insights: {
    past: string
    present: string
    future: string
  }
  advice: string
  affirmation: string
}

const currentLanguage = ref('en')
const question = ref('')

const t = computed(() => translations[currentLanguage.value])

const switchLanguage = (lang: string) => {
  currentLanguage.value = lang
  localStorage.setItem('nightGodTarotLanguage', lang)
}
const isLoading = ref(false) // Loading disabled by default
const progress = ref(0)
const currentStage = ref(0)
const selectedCards = ref<TarotCard[]>([])
const readingResult = ref<ReadingResult | null>(null)

const stages = computed(() => [
  { icon: '🌌', name: t.value.connecting },
  { icon: '🃏', name: t.value.drawingCards },
  { icon: '🤖', name: t.value.aiAnalysis },
  { icon: '✨', name: t.value.interpreting },
  { icon: '🔮', name: t.value.finalizing }
])

const tarotDeck = [
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
  'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
  'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
  'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'
]

const startReading = async () => {
  if (!question.value.trim()) return
  
  isLoading.value = true
  progress.value = 0
  currentStage.value = 0
  selectedCards.value = []
  readingResult.value = null

  try {
    // Stage 1: Connecting
    await simulateProgress(20, 1000)
    currentStage.value = 1

    // Stage 2: Drawing Cards
    const shuffled = [...tarotDeck].sort(() => Math.random() - 0.5)
    const cardNames = shuffled.slice(0, 3)
    selectedCards.value = cardNames.map(name => ({
      name,
      meaning: generateCardMeaning(name),
      revealed: false
    }))
    await simulateProgress(40, 1500)
    currentStage.value = 2

    // Stage 3: AI Analysis
    await simulateProgress(60, 2000)
    currentStage.value = 3

    // Stage 4: Interpreting
    await simulateProgress(80, 1500)
    currentStage.value = 4

    // Stage 5: Generate Result
    const userId = 'user_' + Date.now()
    const result = await enhancedReadingEngine.performEnhancedReading(
      userId,
      question.value,
      cardNames
    )

    readingResult.value = {
      interpretation: result.mainReading,
      insights: result.insights,
      advice: result.advice,
      affirmation: result.affirmation
    }

    await simulateProgress(100, 500)
    isLoading.value = false

    // Auto-reveal cards
    setTimeout(() => {
      selectedCards.value.forEach((_, index) => {
        setTimeout(() => revealCard(index), index * 500)
      })
    }, 500)

  } catch (error) {
    console.error('Reading failed:', error)
    isLoading.value = false
    // Fallback result
    readingResult.value = {
      interpretation: `The cards have spoken about your question: "${question.value}". Your selected cards - ${selectedCards.value.map(c => c.name).join(', ')} - reveal a powerful message of transformation and growth ahead.`,
      insights: {
        past: 'Your past experiences have prepared you for this moment of clarity.',
        present: 'The present offers opportunities for positive change and new beginnings.',
        future: 'The future holds promise and potential for achieving your deepest desires.'
      },
      advice: 'Trust your intuition and embrace the changes coming your way. The universe is aligning to support your highest good.',
      affirmation: 'I am open to receiving divine guidance and trust in the wisdom of the universe.'
    }
  }
}

const simulateProgress = (target: number, duration: number): Promise<void> => {
  return new Promise(resolve => {
    const start = progress.value
    const increment = (target - start) / (duration / 50)
    
    const interval = setInterval(() => {
      progress.value += increment
      if (progress.value >= target) {
        progress.value = target
        clearInterval(interval)
        resolve()
      }
    }, 50)
  })
}

const revealCard = (index: number) => {
  selectedCards.value[index].revealed = true
}

const generateCardMeaning = (cardName: string): string => {
  const meanings: Record<string, string> = {
    'The Fool': 'New beginnings, innocence, spontaneity',
    'The Magician': 'Manifestation, resourcefulness, power',
    'The High Priestess': 'Intuition, sacred knowledge, divine feminine',
    'The Empress': 'Femininity, beauty, nature, abundance',
    'The Emperor': 'Authority, establishment, structure, father figure'
  }
  return meanings[cardName] || 'Transformation, wisdom, spiritual growth'
}

const formatKey = (key: string): string => {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

const saveReading = () => {
  const reading = {
    question: question.value,
    cards: selectedCards.value,
    result: readingResult.value,
    timestamp: new Date().toISOString(),
    language: currentLanguage.value
  }
  localStorage.setItem(`reading_${Date.now()}`, JSON.stringify(reading))
  alert(t.value.readingSaved)
}

const shareReading = () => {
  const text = `${t.value.title}\n\n${t.value.askQuestion}: ${question.value}\nCards: ${selectedCards.value.map(c => c.name).join(', ')}\n\nGet your own reading at: ${window.location.origin}`
  navigator.share?.({ text }) || navigator.clipboard.writeText(text)
  alert(t.value.readingCopied)
}

const newReading = () => {
  question.value = ''
  selectedCards.value = []
  readingResult.value = null
  progress.value = 0
  currentStage.value = 0
}

onMounted(() => {
  // Load saved language preference
  const savedLang = localStorage.getItem('nightGodTarotLanguage')
  if (savedLang && translations[savedLang]) {
    currentLanguage.value = savedLang
  }
  console.log('🌙 Night God Tarot initialized with enhanced AI engine')
})
</script>

<style scoped>
.night-god-tarot-complete {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Cosmic Background */
.cosmic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%);
  z-index: -1;
}

.stars {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #FFD700, transparent),
    radial-gradient(2px 2px at 40px 70px, #87CEEB, transparent),
    radial-gradient(1px 1px at 90px 40px, #FFD700, transparent),
    radial-gradient(1px 1px at 130px 80px, #87CEEB, transparent),
    radial-gradient(2px 2px at 160px 30px, #FFD700, transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: sparkle 4s ease-in-out infinite alternate;
}

.nebula {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, rgba(147, 51, 234, 0.1) 0%, transparent 70%);
  animation: nebulaPulse 6s ease-in-out infinite alternate;
}

@keyframes sparkle {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}

@keyframes nebulaPulse {
  0% { opacity: 0.3; }
  100% { opacity: 0.6; }
}

/* Main Container */
.main-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header */
.cosmic-header {
  text-align: center;
  margin-bottom: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.logo-title {
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
}

.logo-subtitle {
  color: #CBD5E1;
  font-size: 1.2rem;
  margin: 0.5rem 0 0 0;
}

.header-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #475569;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.8);
  color: #CBD5E1;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 0.9rem;
}

.lang-btn:hover {
  border-color: #FFD700;
  color: #FFD700;
}

.lang-btn.active {
  border-color: #FFD700;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
}

.status-bar {
  display: flex;
  gap: 1rem;
}

.ai-status, .security-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

.ai-status {
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
}

.security-status {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  color: white;
}

/* Question Section */
.question-section {
  margin-bottom: 3rem;
}

.question-container {
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.9), rgba(49, 46, 129, 0.9));
  border: 2px solid #FFD700;
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.question-label {
  display: block;
  color: #FFD700;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.question-input {
  width: 100%;
  background: rgba(15, 23, 42, 0.8);
  border: 2px solid #475569;
  border-radius: 15px;
  padding: 1rem;
  color: #F1F5F9;
  font-size: 1.1rem;
  resize: none;
  outline: none;
  transition: border-color 0.3s ease;
}

.question-input:focus {
  border-color: #FFD700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.oracle-button {
  width: 100%;
  background: linear-gradient(135deg, #9333ea, #7c3aed);
  border: none;
  border-radius: 15px;
  padding: 1rem 2rem;
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.oracle-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(147, 51, 234, 0.4);
}

.oracle-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Reading Progress */
.reading-progress {
  margin: 3rem 0;
  text-align: center;
}

.progress-container {
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.9), rgba(49, 46, 129, 0.9));
  border: 2px solid #FFD700;
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.progress-circle {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.progress-ring {
  transition: stroke-dashoffset 0.5s ease;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: bold;
  color: #FFD700;
}

.progress-stages {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
}

.stage-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.stage-item.active {
  opacity: 1;
  transform: scale(1.1);
}

.stage-item.completed {
  opacity: 0.8;
  color: #10B981;
}

.stage-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stage-name {
  font-size: 0.9rem;
  color: #CBD5E1;
  font-weight: bold;
}

/* Cards Section */
.cards-section {
  margin: 3rem 0;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.tarot-card {
  width: 200px;
  height: 320px;
  perspective: 1000px;
  cursor: pointer;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.tarot-card.revealed .card-inner {
  transform: rotateY(180deg);
}

.card-back, .card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.card-back {
  background: linear-gradient(135deg, #1e1b4b, #312e81);
  border: 2px solid #FFD700;
}

.card-front {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  border: 2px solid #FFD700;
  transform: rotateY(180deg);
  color: #F1F5F9;
}

.card-pattern {
  font-size: 4rem;
  color: #FFD700;
  opacity: 0.8;
}

.card-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 1rem;
}

.card-image {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card-meaning {
  font-size: 0.9rem;
  color: #CBD5E1;
  text-align: center;
  line-height: 1.4;
}

/* Reading Result */
.reading-result {
  margin: 3rem 0;
}

.result-container {
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.9), rgba(49, 46, 129, 0.9));
  border: 2px solid #FFD700;
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.result-title {
  color: #FFD700;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.reading-text {
  background: rgba(15, 23, 42, 0.6);
  padding: 1.5rem;
  border-radius: 15px;
  color: #F1F5F9;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.insights-section, .advice-section, .affirmation-section {
  margin: 2rem 0;
}

.insights-title, .advice-title, .affirmation-title {
  color: #FFD700;
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.insight-item {
  background: rgba(15, 23, 42, 0.4);
  padding: 1rem;
  border-radius: 10px;
  color: #CBD5E1;
  margin-bottom: 0.5rem;
}

.advice-text, .affirmation-text {
  background: rgba(15, 23, 42, 0.4);
  padding: 1.5rem;
  border-radius: 10px;
  color: #F1F5F9;
  line-height: 1.6;
  font-size: 1.1rem;
}

.affirmation-text {
  font-style: italic;
  text-align: center;
  font-size: 1.2rem;
  color: #FFD700;
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.save-button, .share-button, .new-reading-button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-button {
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
}

.share-button {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  color: white;
}

.new-reading-button {
  background: linear-gradient(135deg, #F59E0B, #D97706);
  color: white;
}

.save-button:hover, .share-button:hover, .new-reading-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

/* Footer */
.cosmic-footer {
  text-align: center;
  padding: 2rem;
  color: #64748B;
  font-size: 0.9rem;
}

.creator-link {
  color: #FFD700;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

.creator-link:hover {
  color: #FFA500;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-container {
    padding: 1rem;
  }
  
  .cosmic-header {
    flex-direction: column;
    text-align: center;
  }
  
  .logo-title {
    font-size: 2.5rem;
  }
  
  .cards-container {
    gap: 1rem;
  }
  
  .tarot-card {
    width: 150px;
    height: 240px;
  }
  
  .result-actions {
    flex-direction: column;
  }
}
</style>