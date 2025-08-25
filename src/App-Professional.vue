<template>
  <div id="app-professional">
    <!-- Professional Header -->
    <ProfessionalHeader />
    
    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Hero Section with Tarot Reading -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-content">
            <div class="hero-logo-title">
              <img src="/src/assets/logo/mainlogo.jpg" alt="Night God Tarot" class="hero-logo" />
              <h1 class="hero-title">
                Night God Tarot
                <span class="title-icon">✨</span>
              </h1>
            </div>
            <p class="hero-subtitle">
              免費AI塔羅牌占卜・超準線上塔羅牌占卜愛情事業運勢
            </p>
            <p class="hero-description">
              融合古老智慧與現代AI科技，為您提供最準確的塔羅指引
            </p>
            
            <!-- Quick Reading Buttons -->
            <div class="hero-actions">
              <button class="hero-btn primary" @click="startReading('ai')">
                <span class="btn-icon">🔮</span>
                AI智能占卜
              </button>
              <button class="hero-btn secondary" @click="startReading('love')">
                <span class="btn-icon">💕</span>
                愛情塔羅
              </button>
              <button class="hero-btn secondary" @click="startReading('career')">
                <span class="btn-icon">💼</span>
                事業運勢
              </button>
              <button class="hero-btn secondary" @click="startReading('daily')">
                <span class="btn-icon">☀️</span>
                每日塔羅
              </button>
            </div>
          </div>
          
          <!-- Featured Card Display -->
          <div class="hero-visual">
            <div class="card-showcase">
              <img src="/src/assets/cardspicture/01_The_Fool.png" alt="The Fool" class="showcase-card card-1" />
              <img src="/src/assets/cardspicture/02_The_Magician.png" alt="The Magician" class="showcase-card card-2" />
              <img src="/src/assets/cardspicture/03_The_High_Priestess.png" alt="The High Priestess" class="showcase-card card-3" />
            </div>
          </div>
        </div>
      </section>

      <!-- Tarot Masters Section -->
      <section class="masters-section">
        <TarotMasters />
      </section>

      <!-- Services Grid -->
      <section class="services-section">
        <div class="container">
          <h2 class="section-title">
            <span class="title-decoration">✦</span>
            專業占卜服務
            <span class="title-decoration">✦</span>
          </h2>
          
          <div class="services-grid">
            <div class="service-card" v-for="service in services" :key="service.id">
              <div class="service-icon">{{ service.icon }}</div>
              <h3 class="service-title">{{ service.title }}</h3>
              <p class="service-description">{{ service.description }}</p>
              <button class="service-btn" @click="selectService(service)">
                開始占卜 →
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <h2 class="section-title">
            <span class="title-decoration">⭐</span>
            為什麼選擇 Night God Tarot
            <span class="title-decoration">⭐</span>
          </h2>
          
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">🤖</div>
              <h3>AI智能解讀</h3>
              <p>結合GPT-4、Claude等頂尖AI模型，提供深度精準的塔羅解讀</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🌍</div>
              <h3>多語言支援</h3>
              <p>支援繁體中文、簡體中文、英文、日文四種語言</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">👥</div>
              <h3>專業占卜師</h3>
              <p>5位資深塔羅師提供個性化指導</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🔒</div>
              <h3>隱私保護</h3>
              <p>完全保護您的個人資訊與占卜記錄</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📱</div>
              <h3>全平台支援</h3>
              <p>支援手機、平板、電腦等所有裝置</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">✨</div>
              <h3>免費使用</h3>
              <p>核心功能完全免費，無需註冊即可使用</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Statistics Section -->
      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">1,000,000+</div>
              <div class="stat-label">占卜次數</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">500,000+</div>
              <div class="stat-label">滿意用戶</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">4.9/5.0</div>
              <div class="stat-label">用戶評分</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">24/7</div>
              <div class="stat-label">全天候服務</div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Professional Footer -->
    <ProfessionalFooter />

    <!-- Floating Widgets -->
    <div class="floating-widgets">
      <!-- Crystal Ball Widget with AI Bot Logo -->
      <div class="widget crystal-ball" @click="toggleCrystalBall">
        <img src="/src/assets/logo/aibotlogo.png" alt="AI Bot" class="widget-logo" />
        <span class="widget-label">AI</span>
      </div>
      
      <!-- Audio Player Widget -->
      <div class="widget audio-player" @click="toggleAudioPlayer">
        <span class="widget-icon">🎵</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfessionalHeader from './components/ProfessionalHeader.vue'
import ProfessionalFooter from './components/ProfessionalFooter.vue'
import TarotMasters from './components/TarotMastersFixed.vue'

const services = ref([
  {
    id: 'year',
    icon: '📅',
    title: '塔羅年運',
    description: '預測您的年度運勢走向，掌握重要機會與挑戰'
  },
  {
    id: 'love',
    icon: '💕',
    title: '愛情塔羅',
    description: '深入解析感情狀況，找到愛情的最佳方向'
  },
  {
    id: 'career',
    icon: '💼',
    title: '事業占卜',
    description: '洞察職場機遇，規劃事業發展藍圖'
  },
  {
    id: 'wealth',
    icon: '💰',
    title: '財富運勢',
    description: '分析財運走向，把握投資理財良機'
  },
  {
    id: 'daily',
    icon: '☀️',
    title: '每日塔羅',
    description: '每日運勢指引，讓您做出最佳決策'
  },
  {
    id: 'yesno',
    icon: '❓',
    title: '是否占卜',
    description: '快速獲得是或否的明確答案'
  }
])

const startReading = (type: string) => {
  console.log('Starting reading:', type)
  // Implement reading logic
}

const selectService = (service: any) => {
  console.log('Selected service:', service)
  // Implement service selection
}

const toggleCrystalBall = () => {
  console.log('Toggle crystal ball')
  // Implement crystal ball toggle
}

const toggleAudioPlayer = () => {
  console.log('Toggle audio player')
  // Implement audio player toggle
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app-professional {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0015 0%, #1a0033 50%, #0a0015 100%);
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero-section {
  padding: 80px 20px;
  background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd700' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  animation: drift 20s linear infinite;
}

@keyframes drift {
  from { transform: translate(0, 0); }
  to { transform: translate(60px, 60px); }
}

.hero-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-content {
  animation: fadeInLeft 1s ease;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.hero-logo-title {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 20px;
}

.hero-logo {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(255, 215, 0, 0.4);
  border: 3px solid rgba(255, 215, 0, 0.6);
  animation: glow 3s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { 
    box-shadow: 0 8px 24px rgba(255, 215, 0, 0.4);
  }
  50% { 
    box-shadow: 0 8px 40px rgba(255, 215, 0, 0.8);
  }
}

.hero-title {
  font-size: 3.5rem;
  background: linear-gradient(45deg, #ffd700, #ff6b35);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 20px;
}

.title-icon {
  font-size: 3rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #ffd700;
  margin-bottom: 15px;
}

.hero-description {
  font-size: 1.1rem;
  color: #d0d0d0;
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.hero-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.hero-btn.primary {
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  color: white;
}

.hero-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
}

.hero-btn.secondary {
  background: rgba(139, 92, 246, 0.2);
  border: 2px solid rgba(139, 92, 246, 0.5);
  color: #dbb8ff;
}

.hero-btn.secondary:hover {
  background: rgba(139, 92, 246, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
}

.btn-icon {
  font-size: 1.3rem;
}

.hero-visual {
  position: relative;
  animation: fadeInRight 1s ease;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.card-showcase {
  position: relative;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.showcase-card {
  position: absolute;
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 215, 0, 0.3);
}

.showcase-card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 20px 60px rgba(255, 215, 0, 0.5);
  border-color: #ffd700;
  z-index: 10;
}

.card-1 {
  transform: rotate(-10deg) translateX(-50px);
  z-index: 1;
}

.card-2 {
  z-index: 2;
}

.card-3 {
  transform: rotate(10deg) translateX(50px);
  z-index: 1;
}

/* Masters Section */
.masters-section {
  padding: 80px 0;
  background: linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.05), transparent);
}

/* Services Section */
.services-section {
  padding: 80px 20px;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: #ffd700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.title-decoration {
  font-size: 1.5rem;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.service-card {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(255, 215, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.service-card:hover::before {
  opacity: 1;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(255, 215, 0, 0.3);
  border-color: #ffd700;
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.service-title {
  font-size: 1.5rem;
  color: #ffd700;
  margin-bottom: 15px;
}

.service-description {
  color: #d0d0d0;
  line-height: 1.6;
  margin-bottom: 25px;
}

.service-btn {
  background: transparent;
  border: 2px solid #ffd700;
  color: #ffd700;
  padding: 10px 25px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.service-btn:hover {
  background: #ffd700;
  color: #0a0015;
  transform: scale(1.05);
}

/* Features Section */
.features-section {
  padding: 80px 20px;
  background: rgba(0, 0, 0, 0.3);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
}

.feature-item {
  text-align: center;
  padding: 30px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 15px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 215, 0, 0.05);
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-item h3 {
  font-size: 1.3rem;
  color: #ffd700;
  margin-bottom: 15px;
}

.feature-item p {
  color: #b0b0b0;
  line-height: 1.6;
}

/* Statistics Section */
.stats-section {
  padding: 60px 20px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(139, 92, 246, 0.1));
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  text-align: center;
}

.stat-item {
  padding: 20px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #ffd700, #ff6b35);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1.1rem;
  color: #d0d0d0;
}

/* Floating Widgets */
.floating-widgets {
  position: fixed;
  bottom: 30px;
  left: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 999;
}

.widget {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  position: relative;
}

.widget:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 30px rgba(255, 215, 0, 0.6);
}

.widget-icon {
  font-size: 1.8rem;
}

.widget-logo {
  width: 35px;
  height: 35px;
  object-fit: cover;
  border-radius: 50%;
}

.widget-label {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: #8b5cf6;
  color: white;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 10px;
  font-weight: bold;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-logo-title {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-logo {
    width: 80px;
    height: 80px;
  }
  
  .hero-title {
    font-size: 2.5rem;
    justify-content: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .card-showcase {
    margin-top: 40px;
  }
}

@media (max-width: 768px) {
  .hero-logo {
    width: 70px;
    height: 70px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .services-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .floating-widgets {
    bottom: 20px;
    left: 20px;
  }
  
  .widget {
    width: 50px;
    height: 50px;
  }
  
  .widget-icon {
    font-size: 1.5rem;
  }
}
</style>