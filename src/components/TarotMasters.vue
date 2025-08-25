<template>
  <div class="tarot-masters-section">
    <div class="masters-header">
      <h2 class="section-title">
        <span class="title-icon">✨</span>
        {{ $t('masters.title', '專業塔羅占卜師') }}
        <span class="title-icon">✨</span>
      </h2>
      <p class="section-subtitle">{{ $t('masters.subtitle', '選擇您的專屬占卜師，解開命運的奧秘') }}</p>
    </div>

    <div class="masters-grid">
      <div v-for="master in tarotMasters" :key="master.id" 
           class="master-card"
           @click="selectMaster(master)"
           :class="{ active: selectedMaster?.id === master.id }">
        
        <div class="master-image-container">
          <img :src="master.avatar" :alt="master.name" class="master-avatar">
          <div class="master-status" :class="master.status">
            <span class="status-dot"></span>
            {{ getStatusText(master.status) }}
          </div>
          <div class="master-badge" v-if="master.featured">
            <span>⭐ 推薦</span>
          </div>
        </div>

        <div class="master-info">
          <h3 class="master-name">{{ master.name }}</h3>
          <p class="master-title">{{ master.title }}</p>
          
          <div class="master-specialties">
            <span v-for="specialty in master.specialties" 
                  :key="specialty" 
                  class="specialty-tag">
              {{ specialty }}
            </span>
          </div>

          <div class="master-stats">
            <div class="stat-item">
              <span class="stat-icon">⭐</span>
              <span class="stat-value">{{ master.rating }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">💬</span>
              <span class="stat-value">{{ master.consultations }}+</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🏆</span>
              <span class="stat-value">{{ master.experience }}年</span>
            </div>
          </div>

          <p class="master-description">{{ master.description }}</p>

          <div class="master-actions">
            <button class="consult-btn primary" @click.stop="startReading(master)">
              <span class="btn-icon">🔮</span>
              立即占卜
            </button>
            <button class="consult-btn secondary" @click.stop="viewProfile(master)">
              <span class="btn-icon">👤</span>
              查看簡介
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Master Profile Modal -->
    <div v-if="showProfile" class="profile-modal" @click="closeProfile">
      <div class="profile-content" @click.stop>
        <button class="close-btn" @click="closeProfile">✕</button>
        
        <div class="profile-header">
          <img :src="profileMaster.avatar" :alt="profileMaster.name" class="profile-avatar">
          <div class="profile-info">
            <h2>{{ profileMaster.name }}</h2>
            <p class="profile-title">{{ profileMaster.title }}</p>
            <div class="profile-ratings">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= profileMaster.rating }">★</span>
              <span class="rating-text">{{ profileMaster.rating }} ({{ profileMaster.reviews }} 評價)</span>
            </div>
          </div>
        </div>

        <div class="profile-body">
          <section class="profile-section">
            <h3>🌟 專長領域</h3>
            <div class="specialty-list">
              <span v-for="specialty in profileMaster.specialties" :key="specialty" class="specialty-badge">
                {{ specialty }}
              </span>
            </div>
          </section>

          <section class="profile-section">
            <h3>📖 個人簡介</h3>
            <p>{{ profileMaster.fullBio }}</p>
          </section>

          <section class="profile-section">
            <h3>🎯 占卜風格</h3>
            <p>{{ profileMaster.style }}</p>
          </section>

          <section class="profile-section">
            <h3>💫 客戶評價</h3>
            <div class="reviews-container">
              <div v-for="review in profileMaster.topReviews" :key="review.id" class="review-item">
                <div class="review-header">
                  <span class="reviewer-name">{{ review.name }}</span>
                  <span class="review-date">{{ review.date }}</span>
                </div>
                <div class="review-rating">
                  <span v-for="i in 5" :key="i" class="star small" :class="{ filled: i <= review.rating }">★</span>
                </div>
                <p class="review-text">{{ review.text }}</p>
              </div>
            </div>
          </section>
        </div>

        <div class="profile-footer">
          <button class="action-btn primary" @click="startReading(profileMaster)">
            <span>🔮</span> 開始占卜
          </button>
          <button class="action-btn secondary" @click="closeProfile">
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface TarotMaster {
  id: string
  name: string
  title: string
  avatar: string
  specialties: string[]
  rating: number
  consultations: number
  experience: number
  description: string
  fullBio: string
  style: string
  status: 'online' | 'busy' | 'offline'
  featured: boolean
  reviews: number
  topReviews: Review[]
}

interface Review {
  id: string
  name: string
  date: string
  rating: number
  text: string
}

const router = useRouter()
const selectedMaster = ref<TarotMaster | null>(null)
const showProfile = ref(false)
const profileMaster = ref<TarotMaster | null>(null)

const tarotMasters = ref<TarotMaster[]>([
  {
    id: 'helisa',
    name: 'Helisa',
    title: '專業塔羅師',
    avatar: '/src/assets/maincharactors/Helisa.png',
    specialties: ['塔羅占卜', '靈性指引', '個人成長', '心靈療癒'],
    rating: 4.9,
    consultations: 5000,
    experience: 15,
    description: '經驗豐富的塔羅師，擅長為客戶提供深度的靈性指引和人生建議。',
    fullBio: 'Helisa是一位經驗豐富的專業塔羅師，致力於幫助客戶通過塔羅牌獲得人生指引。她的解讀風格深入而溫和，能夠幫助您理解當前的生活狀況並找到前進的方向。',
    style: '溫和細心，善於傾聽，提供實用的建議和指引。',
    status: 'online',
    featured: true,
    reviews: 1250,
    topReviews: [
      {
        id: '1',
        name: '用戶評價',
        date: '2024-12-20',
        rating: 5,
        text: '老師的解讀很有幫助，給了我很多有用的建議。'
      }
    ]
  },
  {
    id: 'rei',
    name: 'REI',
    title: '專業塔羅師',
    avatar: '/src/assets/maincharactors/REI.jpg',
    specialties: ['事業發展', '人際關係', '決策指導', '未來規劃'],
    rating: 4.8,
    consultations: 3800,
    experience: 12,
    description: '專注於事業和人生規劃的塔羅師，幫助您做出重要的人生決策。',
    fullBio: 'REI是一位專業的塔羅師，特別擅長協助客戶在事業和人生重要抉擇上獲得清晰的指引。她的解讀注重實用性，能夠為您的未來規劃提供有價值的建議。',
    style: '理性分析，邏輯清晰，提供具體可行的建議。',
    status: 'online',
    featured: true,
    reviews: 980,
    topReviews: [
      {
        id: '1',
        name: '用戶評價',
        date: '2024-12-19',
        rating: 5,
        text: '老師的建議很實用，幫助我在事業上做出了正確的選擇。'
      }
    ]
  },
  {
    id: 'annelisa',
    name: 'Annelisa',
    title: '專業塔羅師',
    avatar: '/src/assets/maincharactors/annelisa.jpg',
    specialties: ['感情占卜', '關係諮詢', '情感療癒', '愛情指導'],
    rating: 4.9,
    consultations: 6200,
    experience: 10,
    description: '專精於感情和人際關係的塔羅師，為您的感情生活提供專業指引。',
    fullBio: 'Annelisa是一位專門處理感情和人際關係問題的塔羅師。她能夠幫助客戶理解感情中的複雜情況，並提供改善關係的實用建議。',
    style: '溫暖同理，富有耐心，善於處理感情問題。',
    status: 'busy',
    featured: false,
    reviews: 1560,
    topReviews: [
      {
        id: '1',
        name: '用戶評價',
        date: '2024-12-21',
        rating: 5,
        text: '老師對感情的分析很準確，給了我很多有用的建議。'
      }
    ]
  },
  {
    id: 'iori',
    name: 'IORI',
    title: '專業塔羅師',
    avatar: '/src/assets/maincharactors/iori.jpg',
    specialties: ['命運解讀', '人生指導', '靈性成長', '未來預測'],
    rating: 4.7,
    consultations: 2900,
    experience: 8,
    description: '擅長命運解讀和人生指導的塔羅師，幫助您理解人生的方向。',
    fullBio: 'IORI是一位專注於命運解讀和人生指導的塔羅師。他能夠幫助客戶理解當前的人生階段，並為未來的發展提供指引。',
    style: '深度洞察，神秘直覺，能夠觸及問題核心。',
    status: 'online',
    featured: false,
    reviews: 720,
    topReviews: [
      {
        id: '1',
        name: '用戶評價',
        date: '2024-12-17',
        rating: 5,
        text: '老師的解讀很有深度，讓我對自己有了更深的理解。'
      }
    ]
  },
  {
    id: 'vreal',
    name: 'V-Real',
    title: '專業塔羅師',
    avatar: '/src/assets/maincharactors/vreal.jpg',
    specialties: ['創新占卜', '現代解讀', '科技整合', '新時代指引'],
    rating: 4.6,
    consultations: 1800,
    experience: 5,
    description: '結合現代思維與傳統塔羅的創新型占卜師。',
    fullBio: 'V-Real是一位創新型的塔羅師，擅長將現代思維與傳統塔羅智慧相結合，為現代人提供符合時代需求的占卜服務。',
    style: '創新前衛，思維敏捷，善於用現代語言解釋古老智慧。',
    status: 'offline',
    featured: false,
    reviews: 450,
    topReviews: [
      {
        id: '1',
        name: '用戶評價',
        date: '2024-12-16',
        rating: 5,
        text: '老師的占卜方式很特別，很符合現代人的需求。'
      }
    ]
  },
  {
    id: 'tabio',
    name: 'Tabio',
    title: '專業塔羅師',
    avatar: '/src/assets/maincharactors/tabio.jpg',
    specialties: ['傳統占卜', '歷史研究', '古典解讀', '深度分析'],
    rating: 4.8,
    consultations: 3200,
    experience: 20,
    description: '資深的傳統塔羅師，擁有深厚的占卜學術背景和豐富經驗。',
    fullBio: 'Tabio是一位資深的傳統塔羅師，擁有深厚的學術背景和多年的占卜經驗。他專精於傳統塔羅解讀方法，能夠為客戶提供深入而準確的占卜服務。',
    style: '學者風範，深度分析，注重傳統占卜的精確性。',
    status: 'online',
    featured: true,
    reviews: 820,
    topReviews: [
      {
        id: '1',
        name: '用戶評價',
        date: '2024-12-22',
        rating: 5,
        text: '老師的知識很淵博，占卜結果很準確。'
      }
    ]
  }
])

const getStatusText = (status: string) => {
  const statusMap = {
    online: '在線',
    busy: '忙碌',
    offline: '離線'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const selectMaster = (master: TarotMaster) => {
  selectedMaster.value = master
}

const startReading = (master: TarotMaster) => {
  localStorage.setItem('selectedMaster', JSON.stringify(master))
  router.push({ name: 'reading', query: { master: master.id } })
}

const viewProfile = (master: TarotMaster) => {
  profileMaster.value = master
  showProfile.value = true
}

const closeProfile = () => {
  showProfile.value = false
  profileMaster.value = null
}

onMounted(() => {
  // Initialize any animations or lazy loading
})
</script>

<style scoped>
.tarot-masters-section {
  padding: 60px 20px;
  background: linear-gradient(135deg, #0a0015 0%, #1a0033 100%);
  min-height: 100vh;
}

.masters-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.5rem;
  background: linear-gradient(45deg, #ffd700, #ff6b35);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.title-icon {
  font-size: 1.8rem;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

.section-subtitle {
  font-size: 1.2rem;
  color: #b8b8b8;
  margin-top: 10px;
}

.masters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.master-card {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(255, 215, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  padding: 25px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.master-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(255, 215, 0, 0.3);
  border-color: #ffd700;
}

.master-card.active {
  border-color: #ffd700;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
}

.master-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.master-image-container {
  position: relative;
  margin-bottom: 20px;
}

.master-avatar {
  width: 100%;
  height: 300px;
  object-fit: contain;
  object-position: center;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(255, 215, 0, 0.05));
  border-radius: 15px;
  border: 3px solid rgba(255, 215, 0, 0.3);
  padding: 10px;
}

.master-status {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  padding: 5px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: white;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.master-status.online .status-dot {
  background: #4ade80;
}

.master-status.busy .status-dot {
  background: #fbbf24;
}

.master-status.offline .status-dot {
  background: #ef4444;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.master-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: white;
  font-weight: bold;
}

.master-info {
  position: relative;
  z-index: 1;
}

.master-name {
  font-size: 1.5rem;
  color: #ffd700;
  margin-bottom: 5px;
}

.master-title {
  font-size: 1rem;
  color: #b8b8b8;
  margin-bottom: 15px;
}

.master-specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.specialty-tag {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.5);
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.85rem;
  color: #dbb8ff;
}

.master-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stat-icon {
  font-size: 1rem;
}

.stat-value {
  font-size: 0.9rem;
  color: #ffd700;
  font-weight: bold;
}

.master-description {
  color: #d0d0d0;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.master-actions {
  display: flex;
  gap: 10px;
}

.consult-btn {
  flex: 1;
  padding: 10px 15px;
  border-radius: 10px;
  border: none;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.consult-btn.primary {
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  color: white;
}

.consult-btn.primary:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.5);
}

.consult-btn.secondary {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.5);
  color: #dbb8ff;
}

.consult-btn.secondary:hover {
  background: rgba(139, 92, 246, 0.3);
  transform: scale(1.05);
}

.btn-icon {
  font-size: 1.1rem;
}

/* Profile Modal */
.profile-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.profile-content {
  background: linear-gradient(135deg, #1a0033, #0a0015);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(255, 0, 0, 0.3);
  transform: rotate(90deg);
}

.profile-header {
  display: flex;
  gap: 30px;
  padding: 40px;
  background: rgba(139, 92, 246, 0.1);
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.profile-avatar {
  width: 200px;
  height: 250px;
  border-radius: 15px;
  object-fit: contain;
  object-position: center;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(255, 215, 0, 0.05));
  border: 3px solid #ffd700;
  padding: 10px;
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  font-size: 2rem;
  color: #ffd700;
  margin-bottom: 10px;
}

.profile-title {
  font-size: 1.2rem;
  color: #b8b8b8;
  margin-bottom: 15px;
}

.profile-ratings {
  display: flex;
  align-items: center;
  gap: 10px;
}

.star {
  color: #666;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.star.filled {
  color: #ffd700;
}

.star.small {
  font-size: 1rem;
}

.rating-text {
  color: #d0d0d0;
  margin-left: 10px;
}

.profile-body {
  padding: 30px 40px;
}

.profile-section {
  margin-bottom: 30px;
}

.profile-section h3 {
  color: #ffd700;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.specialty-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.specialty-badge {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(139, 92, 246, 0.2));
  border: 1px solid rgba(255, 215, 0, 0.5);
  padding: 8px 16px;
  border-radius: 20px;
  color: #ffd700;
  font-size: 0.95rem;
}

.profile-section p {
  color: #d0d0d0;
  line-height: 1.8;
  font-size: 1.05rem;
}

.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-item {
  background: rgba(139, 92, 246, 0.1);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.reviewer-name {
  color: #ffd700;
  font-weight: bold;
}

.review-date {
  color: #888;
  font-size: 0.9rem;
}

.review-rating {
  margin-bottom: 10px;
}

.review-text {
  color: #d0d0d0;
  line-height: 1.6;
}

.profile-footer {
  padding: 30px 40px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  gap: 15px;
  justify-content: center;
}

.action-btn {
  padding: 12px 30px;
  border-radius: 10px;
  border: none;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  color: white;
}

.action-btn.primary:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.5);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .masters-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-avatar {
    margin: 0 auto;
  }
  
  .master-actions {
    flex-direction: column;
  }
  
  .profile-footer {
    flex-direction: column;
  }
}
</style>