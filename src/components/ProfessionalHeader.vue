<template>
  <header class="professional-header">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="top-bar-container">
        <div class="top-left">
          <span class="welcome-text">{{ t('welcomeText') }}</span>
        </div>
        <div class="top-right">
          <a href="#" class="top-link">
            <span class="icon">📧</span>
            {{ t('supportEmail') }}
          </a>
          <span class="divider">|</span>
          <a href="#" class="top-link">
            <span class="icon">📞</span>
            {{ t('supportText') }}
          </a>
          <span class="divider">|</span>
          <div class="language-selector">
            <button @click="toggleLangMenu" class="lang-btn">
              <span class="icon">🌐</span>
              {{ currentLangDisplay }}
              <span class="arrow">▼</span>
            </button>
            <div v-if="showLangMenu" class="lang-dropdown">
              <a href="#" @click="selectLanguage('zh-TW')" class="lang-option">
                <span class="flag">🇹🇼</span> 繁體中文
              </a>
              <a href="#" @click="selectLanguage('zh-CN')" class="lang-option">
                <span class="flag">🇨🇳</span> 简体中文
              </a>
              <a href="#" @click="selectLanguage('en')" class="lang-option">
                <span class="flag">🇺🇸</span> English
              </a>
              <a href="#" @click="selectLanguage('ja')" class="lang-option">
                <span class="flag">🇯🇵</span> 日本語
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="main-header">
      <div class="header-container">
        <!-- Logo Section -->
        <div class="logo-section">
          <a href="/" class="logo-link">
            <div class="logo-wrapper">
              <img src="/src/assets/logo/mainlogo.jpg" alt="Night God Tarot" class="main-logo" />
              <div class="logo-text">
                <h1 class="site-name">Night God Tarot</h1>
                <p class="tagline">{{ t('subtitle') }}</p>
              </div>
            </div>
          </a>
        </div>

        <!-- Navigation Menu -->
        <nav class="main-nav">
          <ul class="nav-list">
            <li class="nav-item">
              <a href="/" class="nav-link active">
                <span class="nav-icon">🏠</span>
                {{ t('home') }}
              </a>
            </li>
            <li class="nav-item dropdown">
              <a href="#" class="nav-link" @click="toggleDropdown('tarot')">
                <span class="nav-icon">🔮</span>
                {{ t('aiTarot') }}
                <span class="arrow">▼</span>
              </a>
              <div v-if="dropdowns.tarot" class="dropdown-menu">
                <div class="dropdown-grid">
                  <div class="dropdown-column">
                    <h4 class="dropdown-title">熱門占卜</h4>
                    <a href="#ai-reading" class="dropdown-link">
                      <span class="link-icon">✨</span>
                      {{ t('aiReading') }}
                    </a>
                    <a href="#love-tarot" class="dropdown-link">
                      <span class="link-icon">💕</span>
                      {{ t('loveTarot') }}
                    </a>
                    <a href="#career-tarot" class="dropdown-link">
                      <span class="link-icon">💼</span>
                      {{ t('careerTarot') }}
                    </a>
                    <a href="#wealth-tarot" class="dropdown-link">
                      <span class="link-icon">💰</span>
                      {{ t('wealthTarot') }}
                    </a>
                  </div>
                  <div class="dropdown-column">
                    <h4 class="dropdown-title">專業牌陣</h4>
                    <a href="#celtic-cross" class="dropdown-link">
                      <span class="link-icon">🌟</span>
                      {{ t('celticCross') }}
                    </a>
                    <a href="#three-card" class="dropdown-link">
                      <span class="link-icon">3️⃣</span>
                      {{ t('threeCard') }}
                    </a>
                    <a href="#yes-no" class="dropdown-link">
                      <span class="link-icon">❓</span>
                      {{ t('yesNo') }}
                    </a>
                    <a href="#choice-spread" class="dropdown-link">
                      <span class="link-icon">⚖️</span>
                      {{ t('choiceSpread') }}
                    </a>
                  </div>
                  <div class="dropdown-column">
                    <h4 class="dropdown-title">特殊占卜</h4>
                    <a href="#year-fortune" class="dropdown-link">
                      <span class="link-icon">📅</span>
                      {{ t('yearFortune') }}
                    </a>
                    <a href="#daily-tarot" class="dropdown-link">
                      <span class="link-icon">☀️</span>
                      {{ t('dailyTarot') }}
                    </a>
                    <a href="#oracle-cards" class="dropdown-link">
                      <span class="link-icon">🦋</span>
                      {{ t('oracleCards') }}
                    </a>
                    <a href="#past-life" class="dropdown-link">
                      <span class="link-icon">🌀</span>
                      {{ t('pastLife') }}
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li class="nav-item">
              <a href="#masters" class="nav-link">
                <span class="nav-icon">👥</span>
                {{ t('masters') }}
              </a>
            </li>
            <li class="nav-item">
              <a href="#blog" class="nav-link">
                <span class="nav-icon">📖</span>
                {{ t('blog') }}
              </a>
            </li>
            <li class="nav-item">
              <a href="#about" class="nav-link">
                <span class="nav-icon">ℹ️</span>
                {{ t('aboutUs') }}
              </a>
            </li>
          </ul>
        </nav>

        <!-- User Actions -->
        <div class="user-actions">
          <button class="action-btn search-btn" @click="toggleSearch">
            <span class="icon">🔍</span>
          </button>
          <button class="action-btn notification-btn">
            <span class="icon">🔔</span>
            <span class="badge">3</span>
          </button>
          <button class="action-btn user-btn" @click="toggleUserMenu">
            <span class="icon">👤</span>
            <span class="btn-text">{{ t('login') }}</span>
          </button>
          <button class="cta-btn">
            <span class="cta-icon">🔮</span>
            {{ t('startReading') }}
          </button>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span class="hamburger"></span>
          <span class="hamburger"></span>
          <span class="hamburger"></span>
        </button>
      </div>
    </div>

    <!-- Search Bar (Hidden by default) -->
    <div v-if="showSearch" class="search-bar">
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery"
          :placeholder="t('searchPlaceholder')"
          class="search-input"
          @keyup.enter="performSearch"
        >
        <button @click="performSearch" class="search-submit">
          {{ t('search') }}
        </button>
        <button @click="toggleSearch" class="search-close">
          ✕
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="showMobileMenu" class="mobile-menu">
      <nav class="mobile-nav">
        <a href="/" class="mobile-nav-link">{{ t('home') }}</a>
        <div class="mobile-nav-group">
          <button @click="toggleMobileDropdown('tarot')" class="mobile-nav-link dropdown-trigger">
            {{ t('aiTarot') }}
            <span class="arrow">{{ mobileDropdowns.tarot ? '▲' : '▼' }}</span>
          </button>
          <div v-if="mobileDropdowns.tarot" class="mobile-dropdown">
            <a href="#ai-reading" class="mobile-dropdown-link">{{ t('aiReading') }}</a>
            <a href="#love-tarot" class="mobile-dropdown-link">{{ t('loveTarot') }}</a>
            <a href="#career-tarot" class="mobile-dropdown-link">{{ t('careerTarot') }}</a>
            <a href="#wealth-tarot" class="mobile-dropdown-link">{{ t('wealthTarot') }}</a>
            <a href="#year-fortune" class="mobile-dropdown-link">{{ t('yearFortune') }}</a>
            <a href="#daily-tarot" class="mobile-dropdown-link">{{ t('dailyTarot') }}</a>
          </div>
        </div>
        <a href="#masters" class="mobile-nav-link">{{ t('masters') }}</a>
        <a href="#blog" class="mobile-nav-link">{{ t('blog') }}</a>
        <a href="#about" class="mobile-nav-link">{{ t('aboutUs') }}</a>
        <div class="mobile-user-section">
          <button class="mobile-login-btn">{{ t('login') }}</button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { localeNames } from '../i18n'

const { locale, t } = useI18n()

const showLangMenu = ref(false)
const showSearch = ref(false)
const showMobileMenu = ref(false)
const searchQuery = ref('')
const currentLangDisplay = ref(localeNames[locale.value as keyof typeof localeNames] || '繁體中文')

const dropdowns = ref({
  tarot: false,
  masters: false
})

const mobileDropdowns = ref({
  tarot: false
})

const toggleLangMenu = () => {
  showLangMenu.value = !showLangMenu.value
}

const selectLanguage = (lang: string) => {
  locale.value = lang
  currentLangDisplay.value = localeNames[lang as keyof typeof localeNames] || '繁體中文'
  showLangMenu.value = false
}

const toggleDropdown = (menu: string) => {
  dropdowns.value[menu as keyof typeof dropdowns.value] = !dropdowns.value[menu as keyof typeof dropdowns.value]
}

const toggleMobileDropdown = (menu: string) => {
  mobileDropdowns.value[menu as keyof typeof mobileDropdowns.value] = !mobileDropdowns.value[menu as keyof typeof mobileDropdowns.value]
}

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    setTimeout(() => {
      const input = document.querySelector('.search-input') as HTMLInputElement
      input?.focus()
    }, 100)
  }
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const toggleUserMenu = () => {
  // Implement user menu logic
}

const performSearch = () => {
  console.log('Searching for:', searchQuery.value)
  // Implement search logic
}
</script>

<style scoped>
.professional-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: linear-gradient(180deg, #0a0015 0%, #1a0033 100%);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

/* Top Bar */
.top-bar {
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  padding: 8px 0;
  font-size: 0.9rem;
}

.top-bar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-left {
  color: #a0a0a0;
}

.welcome-text {
  font-size: 0.85rem;
}

.top-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.top-link {
  color: #a0a0a0;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.3s ease;
}

.top-link:hover {
  color: #ffd700;
}

.icon {
  font-size: 1rem;
}

.divider {
  color: #555;
}

.language-selector {
  position: relative;
}

.lang-btn {
  background: transparent;
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  padding: 5px 12px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.lang-btn:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: #ffd700;
}

.arrow {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

.lang-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 5px;
  background: #1a0033;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  min-width: 150px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  color: #d0d0d0;
  text-decoration: none;
  transition: all 0.3s ease;
}

.lang-option:hover {
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
}

.flag {
  font-size: 1.2rem;
}

/* Main Header */
.main-header {
  padding: 20px 0;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.logo-section {
  flex-shrink: 0;
}

.logo-link {
  text-decoration: none;
  display: inline-block;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
}

.main-logo {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  animation: float 3s ease-in-out infinite;
  border: 2px solid rgba(255, 215, 0, 0.5);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.site-name {
  font-size: 1.8rem;
  margin: 0;
  background: linear-gradient(45deg, #ffd700, #ff6b35);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

.tagline {
  font-size: 0.85rem;
  color: #a0a0a0;
  margin: 2px 0 0 0;
}

/* Navigation */
.main-nav {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 5px;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  color: #d0d0d0;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  border-radius: 8px;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ffd700, transparent);
}

.nav-icon {
  font-size: 1.1rem;
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 10px;
  background: linear-gradient(135deg, #1a0033, #0a0015);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  min-width: 600px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
  animation: dropdownFade 0.3s ease;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.dropdown-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dropdown-title {
  color: #ffd700;
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.dropdown-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  color: #d0d0d0;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 6px;
  font-size: 0.95rem;
}

.dropdown-link:hover {
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  transform: translateX(5px);
}

.link-icon {
  font-size: 1.1rem;
}

/* User Actions */
.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.action-btn {
  background: transparent;
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #d0d0d0;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-btn:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: #ffd700;
  color: #ffd700;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4444;
  color: white;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 10px;
  font-weight: bold;
}

.btn-text {
  font-size: 0.95rem;
}

.cta-btn {
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  border: none;
  color: white;
  padding: 10px 25px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}

.cta-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.5);
}

.cta-icon {
  font-size: 1.2rem;
}

/* Search Bar */
.search-bar {
  background: rgba(139, 92, 246, 0.1);
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  padding: 15px 0;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 10px;
  position: relative;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 25px;
  color: white;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #ffd700;
  background: rgba(255, 255, 255, 0.1);
}

.search-input::placeholder {
  color: #888;
}

.search-submit {
  padding: 12px 30px;
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  border: none;
  border-radius: 25px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-submit:hover {
  transform: scale(1.05);
}

.search-close {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.search-close:hover {
  color: #ffd700;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.hamburger {
  width: 25px;
  height: 3px;
  background: #ffd700;
  transition: all 0.3s ease;
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  position: fixed;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #1a0033 0%, #0a0015 100%);
  border-top: 1px solid rgba(255, 215, 0, 0.3);
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.mobile-nav {
  padding: 20px;
}

.mobile-nav-link {
  display: block;
  padding: 15px;
  color: #d0d0d0;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  transition: all 0.3s ease;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 1rem;
}

.mobile-nav-link:hover {
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  padding-left: 25px;
}

.dropdown-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-dropdown {
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 0;
}

.mobile-dropdown-link {
  display: block;
  padding: 10px 30px;
  color: #a0a0a0;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.mobile-dropdown-link:hover {
  background: rgba(255, 215, 0, 0.05);
  color: #ffd700;
  padding-left: 40px;
}

.mobile-user-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
}

.mobile-login-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.mobile-login-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.5);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-nav {
    display: none;
  }
  
  .user-actions {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .dropdown-menu {
    min-width: 400px;
  }
  
  .dropdown-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .top-bar {
    display: none;
  }
  
  .header-container {
    padding: 15px;
  }
  
  .logo-text {
    display: none;
  }
  
  .main-logo {
    width: 50px;
    height: 50px;
  }
}
</style>