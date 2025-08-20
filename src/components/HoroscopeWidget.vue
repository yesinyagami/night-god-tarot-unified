<template>
  <!-- Floating Icon -->
  <div 
    class="widget-icon" 
    :class="{ hidden: isWidgetOpen }"
    @click="toggleWidget"
  >
    <span class="icon-symbol">🔮</span>
    <span class="notification-badge">AI</span>
  </div>

  <!-- Main Widget Interface -->
  <div 
    class="horoscope-widget" 
    :class="{ show: isWidgetOpen }"
  >
    <!-- Close Button -->
    <div class="close-btn" @click="toggleWidget"></div>

    <!-- Header Section -->
    <div class="widget-header">
      <!-- Language Switcher -->
      <div class="language-switcher">
        <button 
          v-for="lang in languages" 
          :key="lang.code"
          class="lang-btn" 
          :class="{ active: currentLang === lang.code }"
          @click="changeLanguage(lang.code)"
        >
          {{ lang.label }}
        </button>
      </div>
      
      <!-- AI Badge -->
      <div class="ai-badge">{{ t('ai-powered') }}</div>
      
      <!-- Title -->
      <h1 class="widget-title">{{ t('title') }}</h1>
      
      <!-- Subtitle -->
      <p class="widget-subtitle">{{ t('subtitle') }}</p>
    </div>

    <!-- Content Area -->
    <div class="widget-content">
      <!-- Zodiac Selection Grid -->
      <div class="zodiac-grid">
        <div 
          v-for="sign in zodiacSigns" 
          :key="sign.id"
          class="zodiac-item" 
          :class="{ selected: selectedZodiac === sign.id }"
          @click="selectZodiac(sign.id)"
        >
          <span class="zodiac-symbol">{{ sign.symbol }}</span>
          <span class="zodiac-name">{{ t(sign.id) }}</span>
        </div>
      </div>

      <!-- Generate Button -->
      <button 
        class="action-button" 
        @click="generateHoroscope"
        :disabled="loading"
      >
        {{ t('generate') }}
      </button>

      <!-- Loading Animation -->
      <div class="loading" :class="{ show: loading }">
        <div class="loading-spinner"></div>
        <div class="loading-text">{{ t('loading') }}</div>
      </div>

      <!-- Result Container -->
      <div class="result-container" :class="{ show: showResult }">
        <div class="result-header">
          <span class="result-type" :class="resultType">
            {{ t(`${resultType}-result`) }}
          </span>
          <span class="ai-indicator">{{ t('ai-analysis') }}</span>
        </div>
        <div class="result-content" v-html="resultContent"></div>
      </div>
    </div>
  </div>

  <!-- Payment Modal -->
  <div class="payment-modal" :class="{ show: showPaymentModal }">
    <div class="payment-content">
      <div class="payment-header">
        <h2 class="payment-title">{{ t('upgrade') }}</h2>
        <span class="payment-badge">{{ t('limited') }}</span>
      </div>

      <div class="price-info">
        <div class="original-price">{{ t('original') }}</div>
        <div class="discount-price">{{ t('discount') }}</div>
        <div class="savings">{{ t('save') }}</div>
      </div>

      <div class="payment-features">
        <div v-for="i in 5" :key="i" class="feature-item">
          {{ t(`feature${i}`) }}
        </div>
      </div>

      <div class="payment-buttons">
        <button class="pay-button" @click="processPayment">
          {{ t('pay') }}
        </button>
        <button class="cancel-button" @click="closePayment">
          {{ t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Type definitions
type LanguageCode = 'zh' | 'en' | 'ja'
type ZodiacSign = 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces'

interface Translations {
  [key: string]: Record<string, string>
}

interface HoroscopeContent {
  [key: string]: {
    free: Record<ZodiacSign, string>
    premium: Record<ZodiacSign, string>
  }
}

// Reactive state
const isWidgetOpen = ref(false)
const currentLang = ref<LanguageCode>('en')
const selectedZodiac = ref<ZodiacSign | null>(null)
const loading = ref(false)
const showResult = ref(false)
const showPaymentModal = ref(false)
const resultType = ref<'free' | 'premium'>('free')
const resultContent = ref('')

// Language configuration
const languages = [
  { code: 'zh' as LanguageCode, label: '中' },
  { code: 'en' as LanguageCode, label: 'EN' },
  { code: 'ja' as LanguageCode, label: '日' }
]

// Zodiac signs data
const zodiacSigns = [
  { id: 'aries' as ZodiacSign, symbol: '♈' },
  { id: 'taurus' as ZodiacSign, symbol: '♉' },
  { id: 'gemini' as ZodiacSign, symbol: '♊' },
  { id: 'cancer' as ZodiacSign, symbol: '♋' },
  { id: 'leo' as ZodiacSign, symbol: '♌' },
  { id: 'virgo' as ZodiacSign, symbol: '♍' },
  { id: 'libra' as ZodiacSign, symbol: '♎' },
  { id: 'scorpio' as ZodiacSign, symbol: '♏' },
  { id: 'sagittarius' as ZodiacSign, symbol: '♐' },
  { id: 'capricorn' as ZodiacSign, symbol: '♑' },
  { id: 'aquarius' as ZodiacSign, symbol: '♒' },
  { id: 'pisces' as ZodiacSign, symbol: '♓' }
]

// Translation system
const translations: Translations = reactive({
  zh: {
    'ai-powered': 'AI GPT-5 強化',
    'title': '星座運勢占卜',
    'subtitle': 'Monica AI 智能分析系統',
    'aries': '牡羊座', 'taurus': '金牛座', 'gemini': '雙子座', 'cancer': '巨蟹座',
    'leo': '獅子座', 'virgo': '處女座', 'libra': '天秤座', 'scorpio': '天蠍座',
    'sagittarius': '射手座', 'capricorn': '摩羯座', 'aquarius': '水瓶座', 'pisces': '雙魚座',
    'generate': '🔮 生成AI運勢分析',
    'loading': 'AI正在分析中...',
    'ai-analysis': 'GPT-5 深度分析',
    'upgrade': '升級至專業版',
    'limited': '限時優惠',
    'original': '原價 NT$300',
    'discount': 'NT$100',
    'save': '節省67%！',
    'feature1': 'GPT-5 深度個人化分析',
    'feature2': '完整運勢報告（愛情、事業、財運）',
    'feature3': '每日幸運指南',
    'feature4': '專屬開運建議',
    'feature5': 'Monica AI 智能互動諮詢',
    'pay': '立即支付',
    'cancel': '取消',
    'free-result': '免費版',
    'premium-result': '專業版',
    'select-zodiac': '請先選擇您的星座'
  },
  en: {
    'ai-powered': 'AI GPT-5 Enhanced',
    'title': 'Horoscope Fortune',
    'subtitle': 'Monica AI Analysis System',
    'aries': 'Aries', 'taurus': 'Taurus', 'gemini': 'Gemini', 'cancer': 'Cancer',
    'leo': 'Leo', 'virgo': 'Virgo', 'libra': 'Libra', 'scorpio': 'Scorpio',
    'sagittarius': 'Sagittarius', 'capricorn': 'Capricorn', 'aquarius': 'Aquarius', 'pisces': 'Pisces',
    'generate': '🔮 Generate AI Analysis',
    'loading': 'AI Analyzing...',
    'ai-analysis': 'GPT-5 Deep Analysis',
    'upgrade': 'Upgrade to Premium',
    'limited': 'Limited Offer',
    'original': 'Original $10',
    'discount': '$3.33',
    'save': 'Save 67%!',
    'feature1': 'GPT-5 Personalized Analysis',
    'feature2': 'Complete Fortune Report (Love, Career, Wealth)',
    'feature3': 'Daily Lucky Guide',
    'feature4': 'Exclusive Fortune Tips',
    'feature5': 'Monica AI Interactive Consultation',
    'pay': 'Pay Now',
    'cancel': 'Cancel',
    'free-result': 'Free Version',
    'premium-result': 'Premium Version',
    'select-zodiac': 'Please select your zodiac sign first'
  },
  ja: {
    'ai-powered': 'AI GPT-5 強化',
    'title': '星座占い',
    'subtitle': 'Monica AI 分析システム',
    'aries': '牡羊座', 'taurus': '牡牛座', 'gemini': '双子座', 'cancer': '蟹座',
    'leo': '獅子座', 'virgo': '乙女座', 'libra': '天秤座', 'scorpio': '蠍座',
    'sagittarius': '射手座', 'capricorn': '山羊座', 'aquarius': '水瓶座', 'pisces': '魚座',
    'generate': '🔮 AI運勢分析を生成',
    'loading': 'AI分析中...',
    'ai-analysis': 'GPT-5 詳細分析',
    'upgrade': 'プレミアム版へ',
    'limited': '期間限定',
    'original': '通常価格 ¥500',
    'discount': '¥167',
    'save': '67%オフ！',
    'feature1': 'GPT-5 パーソナライズ分析',
    'feature2': '完全な運勢レポート（恋愛、キャリア、財運）',
    'feature3': '毎日のラッキーガイド',
    'feature4': '専用の開運アドバイス',
    'feature5': 'Monica AI インタラクティブ相談',
    'pay': '今すぐ支払う',
    'cancel': 'キャンセル',
    'free-result': '無料版',
    'premium-result': 'プレミアム版',
    'select-zodiac': '星座を選択してください'
  }
})

// Horoscope content database
const horoscopeContent: HoroscopeContent = reactive({
  zh: {
    free: {
      aries: "今日運勢：充滿活力的一天，適合開展新計劃。幸運數字：7",
      taurus: "今日運勢：財運不錯，投資需謹慎。幸運顏色：綠色",
      gemini: "今日運勢：社交運佳，容易結識新朋友。幸運方向：東南",
      cancer: "今日運勢：感情運勢上升，適合表白。幸運時間：下午3點",
      leo: "今日運勢：事業有突破，展現領導才能。幸運物品：金飾",
      virgo: "今日運勢：健康需注意，保持規律作息。幸運花：百合",
      libra: "今日運勢：人際關係和諧，合作順利。幸運星座：雙子座",
      scorpio: "今日運勢：直覺敏銳，適合做重要決定。幸運寶石：黑曜石",
      sagittarius: "今日運勢：旅行運佳，可計劃出遊。幸運地點：山區",
      capricorn: "今日運勢：工作效率高，容易獲得認可。幸運食物：堅果",
      aquarius: "今日運勢：創意爆發，適合創新思考。幸運音樂：爵士樂",
      pisces: "今日運勢：藝術靈感豐富，情感細膩。幸運藝術：繪畫"
    },
    premium: {
      aries: `
        <h3>♈ 牡羊座完整運勢分析</h3>
        <div class="result-section">
          <h4>整體運勢</h4>
          <p>今日能量指數：95/100。火星的正面影響讓您充滿鬥志，是展現領導力的絕佳時機。Monica AI分析顯示，您的決策準確率提升38%。</p>
        </div>
        <div class="result-section">
          <h4>愛情運勢</h4>
          <p>單身者：桃花運旺盛，在社交場合容易遇到心儀對象。AI建議穿著紅色系服裝增加吸引力。<br>
          有伴者：與伴侶默契十足，適合共同規劃未來。避免過於強勢。</p>
        </div>
        <div class="result-section">
          <h4>事業運勢</h4>
          <p>工作表現出色，領導才能獲得認可。GPT-5預測：本週內有85%機率獲得新機會。建議主動爭取重要項目。</p>
        </div>
        <div class="result-section">
          <h4>財運分析</h4>
          <p>正財運穩定，偏財運活躍。投資建議：科技股短期看漲，可適度布局。避免高風險投機。預期收益：+12-18%</p>
        </div>
      `,
      taurus: `
        <h3>♉ 金牛座完整運勢分析</h3>
        <div class="result-section">
          <h4>整體運勢</h4>
          <p>今日能量指數：88/100。金星帶來穩定能量，適合處理財務和長期規劃。Monica AI顯示您的理財決策成功率達92%。</p>
        </div>
        <div class="result-section">
          <h4>愛情運勢</h4>
          <p>單身者：緣分需要耐心等待，不宜急於求成。專注自我提升更容易吸引優質對象。<br>
          有伴者：關係穩定甜蜜，適合共同理財或購置家居用品。</p>
        </div>
      `,
      gemini: `<h3>♊ 雙子座完整運勢分析</h3><div class="result-section"><h4>整體運勢</h4><p>水星能量活躍，溝通表達力絕佳。Monica AI預測您的社交影響力將提升45%。</p></div>`,
      cancer: `<h3>♋ 巨蟹座完整運勢分析</h3><div class="result-section"><h4>整體運勢</h4><p>月亮守護帶來直覺力提升，適合處理情感相關事務。家庭運勢特別旺盛。</p></div>`,
      leo: `<h3>♌ 獅子座完整運勢分析</h3><div class="result-section"><h4>整體運勢</h4><p>太陽能量強勁，領導魅力無人能敵。事業發展將迎來重大突破。</p></div>`,
      virgo: `<h3>♍ 處女座完整運勢分析</h3><div class="result-section"><h4>整體運勢</h4><p>細緻認真的態度獲得回報，健康運勢穩定上升。工作效率達到顛峰狀態。</p></div>`,
      libra: `<h3>♎ 天秤座完整運勢分析</h3><div class="result-section"><h4>整體運勢</h4><p>和諧美感天賦發揮，人際關係如魚得水。合作項目將帶來意想不到的收穫。</p></div>`,
      scorpio: `<h3>♏ 天蠍座完整運勢分析</h3><div class="result-section"><h4>整體運勢</h4><p>神秘直覺力爆表，深度洞察帶來重要發現。適合進行深層次的心靈探索。</p></div>`,
      sagittarius: `<h3>♐ 射手座完整運勢分析</h3><div class="result-section"><h4>整體運勢</h4><p>木星擴展能量強勁，視野格局大幅提升。遠行或學習將帶來新機遇。</p></div>`,
      capricorn: `<h3>♑ 摩羯座完整運勢分析</h3><div class="result-section"><h4>整體運勢</h4><p>土星穩健力量加持，事業基礎更加穩固。長期規劃將看見具體成果。</p></div>`,
      aquarius: `<h3>♒ 水瓶座完整運勢分析</h3><div class="result-section"><h4>整體運勢</h4><p>天王星創新能量活躍，獨特想法獲得認同。科技相關領域特別有利。</p></div>`,
      pisces: `<h3>♓ 雙魚座完整運勢分析</h3><div class="result-section"><h4>整體運勢</h4><p>海王星夢幻力量增強，藝術直覺達到新高度。靈感創作將獲得意外成功。</p></div>`
    }
  }
})

// Translation helper
const t = (key: string) => {
  return translations[currentLang.value]?.[key] || key
}

// Methods
const toggleWidget = () => {
  isWidgetOpen.value = !isWidgetOpen.value
  if (!isWidgetOpen.value) {
    // Reset state when closing
    showResult.value = false
    loading.value = false
  }
}

const changeLanguage = (lang: LanguageCode) => {
  currentLang.value = lang
}

const selectZodiac = (sign: ZodiacSign) => {
  selectedZodiac.value = sign
}

const generateHoroscope = async () => {
  if (!selectedZodiac.value) {
    alert(t('select-zodiac'))
    return
  }
  
  loading.value = true
  showResult.value = false
  
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  loading.value = false
  
  // 50% chance for free result
  const isFree = Math.random() < 0.5
  
  if (isFree) {
    showFreeResult()
  } else {
    showPaymentModal.value = true
  }
}

const showFreeResult = () => {
  resultType.value = 'free'
  const langData = horoscopeContent[currentLang.value] || horoscopeContent.zh
  const content = selectedZodiac.value ? langData.free[selectedZodiac.value] : langData.free.aries
  resultContent.value = `<p>${content}</p>`
  showResult.value = true
}

const showPremiumResult = () => {
  resultType.value = 'premium'
  const langData = horoscopeContent[currentLang.value] || horoscopeContent.zh
  const content = selectedZodiac.value ? langData.premium[selectedZodiac.value] : langData.premium.aries
  resultContent.value = content || langData.premium.aries
  showResult.value = true
}

const processPayment = () => {
  // Simulate payment processing
  showPaymentModal.value = false
  showPremiumResult()
  // Here you would integrate with actual payment system
}

const closePayment = () => {
  showPaymentModal.value = false
}
</script>

<style scoped>
/* Widget Icon Styles */
.widget-icon {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(103, 126, 234, 0.4), 0 0 0 3px rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  animation: float 3s ease-in-out infinite;
  overflow: hidden;
}

.widget-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.widget-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(103, 126, 234, 0.5), 0 0 0 5px rgba(255, 255, 255, 0.2);
}

.widget-icon.hidden {
  transform: scale(0);
  opacity: 0;
  pointer-events: none;
}

.icon-symbol {
  font-size: 28px;
  color: white;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  animation: pulse-badge 2s infinite;
}

@keyframes pulse-badge {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Main Widget Styles */
.horoscope-widget {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 420px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  z-index: 10000;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transform: scale(0);
  opacity: 0;
  pointer-events: none;
  transform-origin: top left;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.horoscope-widget.show {
  transform: scale(1);
  opacity: 1;
  pointer-events: all;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: rotate(90deg);
}

.close-btn::before,
.close-btn::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 2px;
  background: white;
  border-radius: 2px;
}

.close-btn::before {
  transform: rotate(45deg);
}

.close-btn::after {
  transform: rotate(-45deg);
}

/* Header Styles */
.widget-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 25px;
  color: white;
  position: relative;
  overflow: hidden;
}

.widget-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  margin-bottom: 10px;
  backdrop-filter: blur(10px);
}

.ai-badge::before {
  content: '⚡';
  margin-right: 5px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.widget-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.widget-subtitle {
  font-size: 14px;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

.language-switcher {
  position: absolute;
  bottom: 15px;
  right: 15px;
  display: flex;
  gap: 5px;
  z-index: 2;
}

.lang-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.lang-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.3);
}

.lang-btn.active {
  background: rgba(255, 255, 255, 0.4);
  border-color: white;
  transform: scale(1.05);
}

/* Content Styles */
.widget-content {
  padding: 25px;
  max-height: 500px;
  overflow-y: auto;
}

.widget-content::-webkit-scrollbar {
  width: 6px;
}

.widget-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.widget-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

/* Zodiac Grid */
.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 25px;
}

.zodiac-item {
  aspect-ratio: 1;
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.zodiac-item::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(103, 126, 234, 0.4) 0%, transparent 70%);
  transition: all 0.5s ease;
  transform: translate(-50%, -50%);
}

.zodiac-item:hover::before {
  width: 100%;
  height: 100%;
}

.zodiac-item:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 10px 30px rgba(103, 126, 234, 0.3);
}

.zodiac-item.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(103, 126, 234, 0.4);
}

.zodiac-symbol {
  font-size: 28px;
  margin-bottom: 4px;
}

.zodiac-name {
  font-size: 11px;
  font-weight: 600;
  text-align: center;
}

/* Action Button */
.action-button {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.action-button:hover::before {
  width: 300px;
  height: 300px;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(103, 126, 234, 0.4);
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading Animation */
.loading {
  display: none;
  text-align: center;
  padding: 20px;
}

.loading.show {
  display: block;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #666;
  font-size: 14px;
}

/* Result Container */
.result-container {
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
  min-height: 150px;
  position: relative;
  display: none;
}

.result-container.show {
  display: block;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.result-type {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  margin-right: 10px;
}

.result-type.free {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  color: #0a5f4a;
}

.result-type.premium {
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  color: #7a5200;
}

.ai-indicator {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: rgba(103, 126, 234, 0.1);
  border-radius: 12px;
  font-size: 11px;
  color: #667eea;
}

.ai-indicator::before {
  content: '🤖';
  margin-right: 5px;
}

.result-content {
  color: #2c3e50;
  line-height: 1.6;
  font-size: 14px;
}

.result-content h3 {
  color: #667eea;
  margin-bottom: 10px;
  font-size: 18px;
}

.result-section {
  margin-bottom: 15px;
}

.result-section h4 {
  color: #764ba2;
  font-size: 14px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.result-section h4::before {
  content: '✨';
  margin-right: 6px;
}

/* Payment Modal */
.payment-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 20000;
  animation: fadeIn 0.3s ease;
}

.payment-modal.show {
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  animation: slideUp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.payment-header {
  text-align: center;
  margin-bottom: 20px;
}

.payment-title {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.payment-badge {
  display: inline-block;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}

.price-info {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
  text-align: center;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 18px;
}

.discount-price {
  font-size: 36px;
  color: #e74c3c;
  font-weight: bold;
  margin: 10px 0;
}

.savings {
  color: #27ae60;
  font-size: 16px;
  font-weight: bold;
}

.payment-features {
  margin: 20px 0;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: #555;
}

.feature-item::before {
  content: '✓';
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  color: white;
  border-radius: 50%;
  margin-right: 12px;
  font-weight: bold;
  font-size: 14px;
}

.payment-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.pay-button, .cancel-button {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pay-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.pay-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(103, 126, 234, 0.3);
}

.cancel-button {
  background: #e0e0e0;
  color: #666;
}

.cancel-button:hover {
  background: #d0d0d0;
}

/* Responsive Design */
@media (max-width: 480px) {
  .horoscope-widget {
    width: calc(100% - 40px);
    left: 20px;
    right: 20px;
  }

  .zodiac-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>