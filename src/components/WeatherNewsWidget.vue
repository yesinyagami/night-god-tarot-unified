<template>
  <div class="weather-news-cosmic-widget">
    <!-- Toggle Button -->
    <button 
      @click="isExpanded = !isExpanded" 
      class="cosmic-toggle"
      :class="{ expanded: isExpanded }"
    >
      <span class="toggle-icon">{{ isExpanded ? '🌙' : '📰' }}</span>
      <span class="toggle-text">{{ isExpanded ? '收起' : '資訊' }}</span>
    </button>

    <!-- Expanded Widget -->
    <div v-if="isExpanded" class="cosmic-content">
      <!-- Navigation Tabs -->
      <div class="cosmic-tabs">
        <button 
          @click="activeTab = 'weather'"
          class="cosmic-tab"
          :class="{ active: activeTab === 'weather' }"
        >
          🌤️ 天象
        </button>
        <button 
          @click="activeTab = 'news'"
          class="cosmic-tab"
          :class="{ active: activeTab === 'news' }"
        >
          📰 世事
        </button>
        <button 
          @click="activeTab = 'mystical'"
          class="cosmic-tab"
          :class="{ active: activeTab === 'mystical' }"
        >
          🔮 解讀
        </button>
      </div>

      <!-- Weather Tab -->
      <div v-if="activeTab === 'weather'" class="weather-realm">
        <div v-if="weatherLoading" class="cosmic-loading">
          <div class="loading-rings">
            <div class="ring"></div>
            <div class="ring"></div>
            <div class="ring"></div>
          </div>
          <div class="loading-text">感知天象能量...</div>
        </div>

        <div v-else-if="weatherData" class="weather-display">
          <!-- Current Weather -->
          <div class="current-weather">
            <div class="weather-header">
              <h3 class="location-title">
                {{ weatherData.location.city }}, {{ weatherData.location.country }}
              </h3>
              <div class="mystical-time">{{ formatTime(weatherData.timestamp) }}</div>
            </div>

            <div class="weather-main">
              <div class="weather-icon-section">
                <div class="weather-emoji">{{ getWeatherEmoji(weatherData.current.weather.main) }}</div>
                <div class="weather-desc">{{ weatherData.current.weather.description }}</div>
              </div>
              
              <div class="temperature-section">
                <div class="main-temp">{{ weatherData.current.temperature }}°C</div>
                <div class="feels-like">體感 {{ weatherData.current.feels_like }}°C</div>
              </div>
            </div>

            <div class="weather-details">
              <div class="detail-item">
                <span class="detail-icon">💧</span>
                <span class="detail-label">濕度</span>
                <span class="detail-value">{{ weatherData.current.humidity }}%</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">🌪️</span>
                <span class="detail-label">風速</span>
                <span class="detail-value">{{ weatherData.current.wind.speed }} m/s</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">👁️</span>
                <span class="detail-label">能見度</span>
                <span class="detail-value">{{ weatherData.current.visibility }} km</span>
              </div>
            </div>
          </div>

          <!-- Forecast -->
          <div class="forecast-section">
            <h4 class="forecast-title">🔮 未來天象</h4>
            <div class="forecast-grid">
              <div 
                v-for="day in weatherData.forecast" 
                :key="day.date" 
                class="forecast-day"
              >
                <div class="forecast-date">{{ formatDate(day.date) }}</div>
                <div class="forecast-icon">{{ getWeatherEmoji(day.weather.main) }}</div>
                <div class="forecast-temps">
                  <span class="temp-high">{{ day.temp_max }}°</span>
                  <span class="temp-low">{{ day.temp_min }}°</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="weatherError" class="error-state">
          <div class="error-icon">🌫️</div>
          <div class="error-message">天象感知失靈</div>
          <button @click="refreshWeather" class="retry-button">重新感知</button>
        </div>
      </div>

      <!-- News Tab -->
      <div v-if="activeTab === 'news'" class="news-realm">
        <div v-if="newsLoading" class="cosmic-loading">
          <div class="loading-rings">
            <div class="ring"></div>
            <div class="ring"></div>
            <div class="ring"></div>
          </div>
          <div class="loading-text">收集世間訊息...</div>
        </div>

        <div v-else-if="newsData" class="news-display">
          <!-- News Categories -->
          <div class="news-categories">
            <select v-model="selectedCategory" @change="loadNews" class="category-selector">
              <option 
                v-for="category in newsCategories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- News Articles -->
          <div class="news-articles">
            <article 
              v-for="article in newsData.articles.slice(0, 5)" 
              :key="article.id"
              class="news-article"
              @click="openArticle(article)"
            >
              <div class="article-meta">
                <span class="article-source">{{ article.source.name }}</span>
                <span class="article-time">{{ formatTime(article.publishedAt) }}</span>
              </div>
              <h4 class="article-title">{{ article.title }}</h4>
              <p class="article-description">{{ truncateText(article.description, 100) }}</p>
              
              <div v-if="article.urlToImage" class="article-image">
                <img :src="article.urlToImage" :alt="article.title" loading="lazy" />
              </div>
            </article>
          </div>

          <div class="news-footer">
            <div class="news-location">📍 {{ newsData.location }}</div>
            <div class="news-count">共 {{ newsData.totalResults }} 條訊息</div>
          </div>
        </div>

        <div v-else-if="newsError" class="error-state">
          <div class="error-icon">📜</div>
          <div class="error-message">訊息傳遞受阻</div>
          <button @click="refreshNews" class="retry-button">重新收集</button>
        </div>
      </div>

      <!-- Mystical Interpretation Tab -->
      <div v-if="activeTab === 'mystical'" class="mystical-realm">
        <div class="mystical-content">
          <!-- Weather Interpretation -->
          <div v-if="weatherData" class="weather-interpretation">
            <h4 class="interpretation-title">🌤️ 天象解讀</h4>
            <div class="mystical-text">
              {{ getMysticalWeatherInterpretation() }}
            </div>
          </div>

          <!-- News Interpretations -->
          <div v-if="newsInterpretations.length" class="news-interpretations">
            <h4 class="interpretation-title">📰 世事啟示</h4>
            <div 
              v-for="interpretation in newsInterpretations" 
              :key="interpretation.headline"
              class="news-interpretation"
            >
              <div class="interpretation-headline">{{ truncateText(interpretation.headline, 60) }}</div>
              <div class="interpretation-insight">{{ interpretation.mysticalInsight }}</div>
              <div class="interpretation-card">{{ interpretation.cardConnection }}</div>
            </div>
          </div>

          <!-- Combined Guidance -->
          <div class="combined-guidance">
            <h4 class="interpretation-title">🔮 綜合指引</h4>
            <div class="guidance-text">
              {{ getCombinedGuidance() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { weatherService } from '../services/weather'
import { newsService } from '../services/news'
import { useConsent } from '../utils/consent'
import type { WeatherData } from '../services/weather'
import type { NewsResponse, TarotNewsInterpretation } from '../services/news'

// Reactive State
const isExpanded = ref(false)
const activeTab = ref<'weather' | 'news' | 'mystical'>('weather')

const weatherLoading = ref(false)
const weatherError = ref(false)
const weatherData = ref<WeatherData | null>(null)

const newsLoading = ref(false)
const newsError = ref(false)
const newsData = ref<NewsResponse | null>(null)
const selectedCategory = ref('general')
const newsInterpretations = ref<TarotNewsInterpretation[]>([])

const newsCategories = newsService.getNewsCategories()

// Consent Management
const consent = useConsent()

// Computed Properties
const getMysticalWeatherInterpretation = () => {
  if (!weatherData.value) return ''
  return weatherService.getMysticalInterpretation(weatherData.value)
}

const getCombinedGuidance = () => {
  const weatherGuidance = weatherData.value ? 
    `天象顯示${weatherData.value.current.weather.description}，` : ''
  
  const newsGuidance = newsInterpretations.value.length > 0 ?
    `當前世事反映出${newsInterpretations.value[0]?.energyReading}。` : ''
  
  return `${weatherGuidance}${newsGuidance}宇宙建議您保持內在平衡，用智慧觀察周遭變化，每個訊息都可能是指引您前進的星光。`
}

// Methods
const loadWeather = async () => {
  weatherLoading.value = true
  weatherError.value = false
  
  try {
    // Check consent before loading weather data
    if (!consent.canUseWeather()) {
      console.log('🌫️ Weather disabled - no consent for weather data')
      weatherError.value = true
      return
    }
    
    await weatherService.initialize()
    weatherData.value = await weatherService.getCurrentWeather()
  } catch (error) {
    console.error('Weather loading error:', error)
    weatherError.value = true
  } finally {
    weatherLoading.value = false
  }
}

const loadNews = async () => {
  newsLoading.value = true
  newsError.value = false
  
  try {
    // Check consent before loading news data
    if (!consent.canUseNews()) {
      console.log('📜 News disabled - no consent for news data')
      newsError.value = true
      return
    }
    
    await newsService.initialize()
    newsData.value = await newsService.getLocalizedNews(selectedCategory.value, 8)
    
    if (newsData.value.articles.length > 0) {
      newsInterpretations.value = await newsService.getTarotNewsInterpretation(
        newsData.value.articles.slice(0, 3)
      )
    }
  } catch (error) {
    console.error('News loading error:', error)
    newsError.value = true
  } finally {
    newsLoading.value = false
  }
}

const refreshWeather = () => {
  loadWeather()
}

const refreshNews = () => {
  loadNews()
}

const openArticle = (article: any) => {
  if (article.url && article.url !== '#') {
    window.open(article.url, '_blank', 'noopener,noreferrer')
  }
}

const getWeatherEmoji = (weatherMain: string): string => {
  return weatherService.getWeatherEmoji(weatherMain)
}

const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-TW', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('zh-TW', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// Lifecycle
onMounted(() => {
  // Load both weather and news on component mount
  loadWeather()
  loadNews()
})
</script>

<style scoped>
.weather-news-cosmic-widget {
  position: fixed;
  top: 120px;
  right: 20px;
  z-index: 1000;
  font-family: 'Noto Serif TC', serif;
}

.cosmic-toggle {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(255, 107, 53, 0.8));
  border: 2px solid rgba(255, 215, 0, 0.6);
  border-radius: 25px;
  padding: 0.8rem 1.2rem;
  color: #000;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
  backdrop-filter: blur(10px);
}

.cosmic-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
}

.cosmic-toggle.expanded {
  background: linear-gradient(135deg, rgba(78, 205, 196, 0.9), rgba(255, 107, 53, 0.8));
  border-color: rgba(78, 205, 196, 0.6);
}

.toggle-icon {
  font-size: 1.2rem;
}

.toggle-text {
  font-weight: 600;
  font-size: 0.9rem;
}

.cosmic-content {
  position: absolute;
  top: 60px;
  right: 0;
  width: 380px;
  max-height: 600px;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(22, 33, 62, 0.95));
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideIn 0.3s ease;
  color: #ffffff;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.cosmic-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.cosmic-tab {
  flex: 1;
  padding: 1rem 0.5rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.cosmic-tab:hover {
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
}

.cosmic-tab.active {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  border-bottom: 2px solid #ffd700;
}

.weather-realm,
.news-realm,
.mystical-realm {
  padding: 1.5rem;
  max-height: 520px;
  overflow-y: auto;
}

.cosmic-loading {
  text-align: center;
  padding: 2rem;
}

.loading-rings {
  position: relative;
  margin: 0 auto 1rem;
  width: 60px;
  height: 60px;
}

.ring {
  position: absolute;
  border: 2px solid transparent;
  border-top: 2px solid #ffd700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.ring:nth-child(1) {
  width: 60px;
  height: 60px;
  animation-duration: 1s;
}

.ring:nth-child(2) {
  width: 40px;
  height: 40px;
  top: 10px;
  left: 10px;
  animation-duration: 0.8s;
  animation-direction: reverse;
}

.ring:nth-child(3) {
  width: 20px;
  height: 20px;
  top: 20px;
  left: 20px;
  animation-duration: 0.6s;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #ffd700;
  font-size: 0.9rem;
}

.weather-display {
  space-y: 1.5rem;
}

.current-weather {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.location-title {
  color: #ffd700;
  font-size: 1.1rem;
  margin: 0;
}

.mystical-time {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
}

.weather-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.weather-icon-section {
  text-align: center;
}

.weather-emoji {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.weather-desc {
  color: #c9b037;
  font-size: 0.9rem;
  text-transform: capitalize;
}

.temperature-section {
  text-align: right;
}

.main-temp {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffd700;
}

.feels-like {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.detail-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.detail-icon {
  font-size: 1.2rem;
}

.detail-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
}

.detail-value {
  font-size: 0.8rem;
  color: #ffd700;
  font-weight: 600;
}

.forecast-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
}

.forecast-title {
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.8rem;
}

.forecast-day {
  text-align: center;
  padding: 0.8rem 0.3rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}

.forecast-date {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
}

.forecast-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.forecast-temps {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.temp-high {
  color: #ffd700;
  font-weight: 600;
  font-size: 0.8rem;
}

.temp-low {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.7rem;
}

.news-display {
  space-y: 1rem;
}

.news-categories {
  margin-bottom: 1.5rem;
}

.category-selector {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  padding: 0.8rem;
  color: #ffffff;
  font-size: 0.9rem;
}

.category-selector option {
  background: #1a1a2e;
  color: #ffffff;
}

.news-articles {
  space-y: 1rem;
}

.news-article {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.news-article:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 215, 0, 0.3);
  transform: translateY(-2px);
}

.article-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.7rem;
}

.article-source {
  color: #4ecdc4;
  font-weight: 600;
}

.article-time {
  color: rgba(255, 255, 255, 0.6);
}

.article-title {
  color: #ffd700;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.article-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  line-height: 1.4;
  margin-bottom: 0.8rem;
}

.article-image {
  border-radius: 8px;
  overflow: hidden;
  max-height: 120px;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
}

.mystical-content {
  space-y: 1.5rem;
}

.weather-interpretation,
.news-interpretations,
.combined-guidance {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
}

.interpretation-title {
  color: #ffd700;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.mystical-text,
.guidance-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.6;
  font-style: italic;
}

.news-interpretation {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 3px solid #4ecdc4;
}

.interpretation-headline {
  color: #ffd700;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.interpretation-insight {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  line-height: 1.4;
  margin-bottom: 0.3rem;
}

.interpretation-card {
  color: #4ecdc4;
  font-size: 0.7rem;
  font-style: italic;
}

.error-state {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.7);
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-message {
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.retry-button {
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  border: none;
  border-radius: 20px;
  padding: 0.8rem 1.5rem;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

/* Scrollbar Styling */
.weather-realm::-webkit-scrollbar,
.news-realm::-webkit-scrollbar,
.mystical-realm::-webkit-scrollbar {
  width: 6px;
}

.weather-realm::-webkit-scrollbar-track,
.news-realm::-webkit-scrollbar-track,
.mystical-realm::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.weather-realm::-webkit-scrollbar-thumb,
.news-realm::-webkit-scrollbar-thumb,
.mystical-realm::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  border-radius: 3px;
}

/* Mobile Responsiveness */
@media (max-width: 480px) {
  .cosmic-content {
    width: 320px;
    right: -10px;
  }
  
  .forecast-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .weather-details {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>