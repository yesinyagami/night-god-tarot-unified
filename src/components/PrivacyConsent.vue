<template>
  <div v-if="showConsent" class="privacy-overlay">
    <div class="privacy-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="logo-section">
          <div class="mystical-symbol">🌙</div>
          <h1 class="brand-title">{{ $t('privacy.title') }}</h1>
          <p class="brand-subtitle">{{ $t('privacy.subtitle') }}</p>
        </div>
      </div>

      <!-- Privacy Policy Content -->
      <div class="modal-content">
        <div class="consent-section">
          <h2 class="section-title">{{ $t('privacy.consentTitle') }}</h2>
          <p class="consent-text">{{ $t('privacy.consentText') }}</p>
        </div>

        <!-- IP Data Collection -->
        <div class="privacy-section">
          <h3 class="section-subtitle">{{ $t('privacy.ipTitle') }}</h3>
          <p class="privacy-text">{{ $t('privacy.ipDescription') }}</p>
          <ul class="privacy-list">
            <li>{{ $t('privacy.ipPurpose1') }}</li>
            <li>{{ $t('privacy.ipPurpose2') }}</li>
            <li>{{ $t('privacy.ipPurpose3') }}</li>
          </ul>
          <p class="privacy-note">{{ $t('privacy.ipProtection') }}</p>
        </div>

        <!-- Email Data Collection -->
        <div class="privacy-section">
          <h3 class="section-subtitle">{{ $t('privacy.emailTitle') }}</h3>
          <p class="privacy-text">{{ $t('privacy.emailDescription') }}</p>
          <ul class="privacy-list">
            <li>{{ $t('privacy.emailPurpose1') }}</li>
            <li>{{ $t('privacy.emailPurpose2') }}</li>
            <li>{{ $t('privacy.emailPurpose3') }}</li>
          </ul>
        </div>

        <!-- User Rights -->
        <div class="privacy-section">
          <h3 class="section-subtitle">{{ $t('privacy.rightsTitle') }}</h3>
          <ul class="privacy-list">
            <li>{{ $t('privacy.right1') }}</li>
            <li>{{ $t('privacy.right2') }}</li>
          </ul>
        </div>

        <!-- Data Protection -->
        <div class="privacy-section">
          <h3 class="section-subtitle">{{ $t('privacy.protectionTitle') }}</h3>
          <p class="privacy-text">{{ $t('privacy.protectionText') }}</p>
        </div>

        <!-- Contact Information -->
        <div class="privacy-section">
          <h3 class="section-subtitle">{{ $t('privacy.contactTitle') }}</h3>
          <p class="privacy-text">{{ $t('privacy.contactText') }}</p>
          <div class="contact-info">
            <p><strong>{{ $t('privacy.creator') }}:</strong> Yesin Yagami</p>
            <p><strong>{{ $t('privacy.website') }}:</strong> <a href="https://yesinyagami.carrd.co/" target="_blank">https://yesinyagami.carrd.co/</a></p>
            <p><strong>{{ $t('privacy.email') }}:</strong> contact@nightgodtarot.com</p>
          </div>
        </div>

        <!-- Khrael Language Section -->
        <div class="khrael-section">
          <p class="khrael-text">{{ $t('privacy.khraelWisdom') }}</p>
          <p class="khrael-symbol">𐌰𐌲𐍂𐌴𐌴 𐍉𐍂 𐌳𐌹𐍃𐌰𐌲𐍂𐌴𐌴</p>
          <p class="khrael-translation">{{ $t('privacy.khraelTranslation') }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="modal-actions">
        <button 
          @click="disagree" 
          class="btn-disagree"
          :class="{ 'loading': isProcessing }"
        >
          <span v-if="!isProcessing">{{ $t('privacy.disagree') }}</span>
          <span v-else class="loading-spinner">⟳</span>
        </button>
        
        <button 
          @click="agree" 
          class="btn-agree"
          :class="{ 'loading': isProcessing }"
        >
          <span v-if="!isProcessing">{{ $t('privacy.agree') }}</span>
          <span v-else class="loading-spinner">⟳</span>
        </button>
      </div>

      <!-- Fine Print -->
      <div class="fine-print">
        <p>{{ $t('privacy.lastUpdated') }}: {{ new Date().toLocaleDateString() }}</p>
        <p>{{ $t('privacy.version') }}: Night God Tarot v2025.1.0</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const showConsent = ref(false)
const isProcessing = ref(false)

onMounted(() => {
  checkConsentStatus()
})

function checkConsentStatus() {
  const consentGiven = localStorage.getItem('nightgod_privacy_consent')
  const consentDate = localStorage.getItem('nightgod_consent_date')
  
  // Show consent if not given or if older than 1 year
  if (!consentGiven || !consentDate || isConsentExpired(consentDate)) {
    showConsent.value = true
  }
}

function isConsentExpired(consentDate: string): boolean {
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  return new Date(consentDate) < oneYearAgo
}

async function agree() {
  isProcessing.value = true
  
  try {
    // Record consent
    localStorage.setItem('nightgod_privacy_consent', 'agreed')
    localStorage.setItem('nightgod_consent_date', new Date().toISOString())
    localStorage.setItem('nightgod_user_id', generateUserId())
    
    // Initialize analytics
    await initializeAnalytics()
    
    // Initialize user session
    await initializeUserSession()
    
    // Log consent event
    await logConsentEvent('agreed')
    
    // Animation delay for UX
    setTimeout(() => {
      showConsent.value = false
      isProcessing.value = false
      
      // Welcome message
      showWelcomeMessage()
    }, 1500)
    
  } catch (error) {
    console.error('Error processing consent:', error)
    isProcessing.value = false
  }
}

async function disagree() {
  isProcessing.value = true
  
  try {
    // Record disagreement
    localStorage.setItem('nightgod_privacy_consent', 'disagreed')
    localStorage.setItem('nightgod_consent_date', new Date().toISOString())
    
    // Log disagreement event
    await logConsentEvent('disagreed')
    
    // Animation delay
    setTimeout(() => {
      // Redirect to Yesin's main site
      window.location.href = 'https://yesinyagami.carrd.co/'
    }, 1500)
    
  } catch (error) {
    console.error('Error processing disagreement:', error)
    isProcessing.value = false
  }
}

function generateUserId(): string {
  return 'nightgod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

async function initializeAnalytics() {
  // Initialize privacy-compliant analytics
  if (typeof gtag !== 'undefined') {
    gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': 'denied',
      'personalization_storage': 'granted'
    })
  }
  
  // Initialize custom analytics
  const analytics = {
    userId: localStorage.getItem('nightgod_user_id'),
    consentDate: new Date().toISOString(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer
  }
  
  localStorage.setItem('nightgod_analytics', JSON.stringify(analytics))
}

async function initializeUserSession() {
  const sessionData = {
    sessionId: generateSessionId(),
    startTime: new Date().toISOString(),
    consentGiven: true,
    features: {
      aiOrchestration: true,
      novelUnlocks: true,
      khraelLanguage: true,
      paymentSystem: true
    }
  }
  
  sessionStorage.setItem('nightgod_session', JSON.stringify(sessionData))
}

function generateSessionId(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

async function logConsentEvent(action: 'agreed' | 'disagreed') {
  const event = {
    type: 'privacy_consent',
    action: action,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    url: window.location.href
  }
  
  // Store locally for now (in production, would send to analytics server)
  const events = JSON.parse(localStorage.getItem('nightgod_events') || '[]')
  events.push(event)
  localStorage.setItem('nightgod_events', JSON.stringify(events.slice(-100))) // Keep last 100 events
}

function showWelcomeMessage() {
  // Create welcome notification
  const notification = document.createElement('div')
  notification.className = 'welcome-notification'
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">🌙</span>
      <span class="notification-text">${t('privacy.welcomeMessage')}</span>
      <span class="khrael-welcome">𐌷𐌴𐍂𐌴𐌰𐌽 𐌰𐍅𐌰𐌺𐌴𐌽𐍃</span>
    </div>
  `
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.opacity = '0'
    setTimeout(() => notification.remove(), 500)
  }, 4000)
}
</script>

<style scoped>
.privacy-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a0033 0%, #000814 50%, #1a0033 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}

.privacy-modal {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 215, 0, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  text-align: center;
  margin-bottom: 40px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  padding-bottom: 30px;
}

.mystical-symbol {
  font-size: 60px;
  margin-bottom: 20px;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700; }
  to { text-shadow: 0 0 20px #ffd700, 0 0 30px #ffd700, 0 0 40px #ffd700; }
}

.brand-title {
  font-size: 36px;
  font-weight: 700;
  color: #ffd700;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  font-size: 18px;
  color: #cbd5e1;
  margin: 0;
  font-style: italic;
}

.modal-content {
  color: #ffffff;
  line-height: 1.6;
}

.consent-section {
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  border-left: 4px solid #ffd700;
}

.section-title {
  font-size: 24px;
  color: #ffd700;
  margin: 0 0 15px 0;
  font-weight: 600;
}

.section-subtitle {
  font-size: 20px;
  color: #ffd700;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.consent-text,
.privacy-text {
  font-size: 16px;
  color: #e2e8f0;
  margin: 0 0 15px 0;
}

.privacy-section {
  margin-bottom: 25px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.privacy-list {
  margin: 15px 0;
  padding-left: 20px;
}

.privacy-list li {
  font-size: 15px;
  color: #cbd5e1;
  margin-bottom: 8px;
  list-style-type: none;
  position: relative;
}

.privacy-list li::before {
  content: "🔮";
  position: absolute;
  left: -20px;
  top: 0;
}

.privacy-note {
  font-size: 14px;
  color: #94a3b8;
  font-style: italic;
  margin-top: 15px;
}

.contact-info {
  background: rgba(139, 92, 246, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
}

.contact-info p {
  margin: 5px 0;
  font-size: 14px;
}

.contact-info a {
  color: #8b5cf6;
  text-decoration: none;
}

.contact-info a:hover {
  text-decoration: underline;
}

.khrael-section {
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  border-radius: 12px;
  padding: 20px;
  margin: 30px 0;
  text-align: center;
}

.khrael-text {
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 10px;
  font-weight: 500;
}

.khrael-symbol {
  font-size: 24px;
  color: #ffd700;
  margin: 15px 0;
  font-family: 'Times New Roman', serif;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.khrael-translation {
  font-size: 14px;
  color: #e2e8f0;
  font-style: italic;
  margin-top: 10px;
}

.modal-actions {
  display: flex;
  gap: 20px;
  margin-top: 40px;
  justify-content: center;
}

.btn-disagree,
.btn-agree {
  padding: 15px 40px;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  position: relative;
}

.btn-disagree {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: #ffffff;
}

.btn-disagree:hover:not(.loading) {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(220, 38, 38, 0.3);
}

.btn-agree {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
}

.btn-agree:hover:not(.loading) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
}

.btn-disagree.loading,
.btn-agree.loading {
  pointer-events: none;
  opacity: 0.8;
}

.loading-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fine-print {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  color: #94a3b8;
}

.fine-print p {
  margin: 5px 0;
}

/* Welcome Notification */
:global(.welcome-notification) {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 20px 40px;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 11000;
  opacity: 1;
  transition: opacity 0.5s ease;
}

:global(.notification-content) {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-direction: column;
  text-align: center;
}

:global(.notification-icon) {
  font-size: 30px;
}

:global(.notification-text) {
  font-size: 18px;
  font-weight: 600;
}

:global(.khrael-welcome) {
  font-size: 16px;
  color: #ffd700;
  font-family: 'Times New Roman', serif;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .privacy-modal {
    padding: 20px;
    margin: 10px;
    max-height: 95vh;
  }
  
  .brand-title {
    font-size: 28px;
  }
  
  .modal-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn-disagree,
  .btn-agree {
    width: 100%;
    padding: 12px 20px;
    font-size: 16px;
  }
}

/* Scrollbar Styling */
.privacy-modal::-webkit-scrollbar {
  width: 8px;
}

.privacy-modal::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.privacy-modal::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  border-radius: 4px;
}

.privacy-modal::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #ff8c00, #ffd700);
}
</style>