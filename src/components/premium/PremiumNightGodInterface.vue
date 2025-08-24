<template>
  <div class="premium-night-god-interface">
    <!-- Quantum Particle Background -->
    <div class="quantum-background" ref="quantumBg"></div>
    
    <!-- Sacred Geometry Overlay -->
    <div class="sacred-geometry-overlay">
      <svg class="geometry-pattern" viewBox="0 0 1000 1000">
        <defs>
          <radialGradient id="sacredGlow">
            <stop offset="0%" stop-color="#FFD700" stop-opacity="0.6"/>
            <stop offset="50%" stop-color="#9400D3" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#000033" stop-opacity="0.1"/>
          </radialGradient>
        </defs>
        <g class="rotating-geometry">
          <circle cx="500" cy="500" r="400" fill="none" stroke="url(#sacredGlow)" stroke-width="0.5"/>
          <polygon points="500,100 900,400 700,900 300,900 100,400" fill="none" stroke="url(#sacredGlow)" stroke-width="0.5"/>
        </g>
      </svg>
    </div>

    <!-- Achievement Notification System -->
    <TransitionGroup name="achievement" tag="div" class="achievement-notifications">
      <div v-for="notification in notifications" :key="notification.id" 
           :class="['achievement-popup', notification.type]">
        <div class="achievement-icon">{{ notification.icon }}</div>
        <div class="achievement-content">
          <h3>{{ notification.title }}</h3>
          <p>{{ notification.description }}</p>
        </div>
      </div>
    </TransitionGroup>

    <!-- Level Progress Bar -->
    <div class="level-progress-container" v-if="userLevel">
      <div class="level-info">
        <span class="level-badge">Level {{ userLevel.current }}</span>
        <span class="level-title">{{ userLevel.title }}</span>
      </div>
      <div class="experience-bar">
        <div class="experience-fill" 
             :style="{ width: experiencePercentage + '%' }">
          <span class="experience-text">
            {{ userLevel.experience }} / {{ userLevel.nextLevelExp }} XP
          </span>
        </div>
      </div>
    </div>

    <!-- Main Interface -->
    <div class="premium-content">
      <!-- Header with Mystical Branding -->
      <header class="mystical-header">
        <div class="logo-container">
          <img src="@/assets/night-god-logo.jpg" alt="Night God" class="floating-logo">
          <h1 class="glowing-title">Night God Tarot</h1>
          <p class="tagline">{{ currentTagline }}</p>
        </div>
        
        <!-- Daily Challenges Widget -->
        <div class="daily-challenges-widget" v-if="dailyChallenges.length">
          <h3>Daily Quests</h3>
          <div v-for="challenge in dailyChallenges" :key="challenge.id" class="challenge-item">
            <div class="challenge-progress">
              <span>{{ challenge.name }}</span>
              <div class="progress-bar">
                <div class="progress-fill" 
                     :style="{ width: (challenge.progress / challenge.target * 100) + '%' }"></div>
              </div>
              <span class="progress-text">{{ challenge.progress }}/{{ challenge.target }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- AI-Powered Reading Section -->
      <section class="ai-reading-section">
        <div class="reading-container" :class="{ 'processing': isProcessing }">
          <!-- Question Input with Voice -->
          <div class="input-section">
            <div class="voice-input-container">
              <textarea
                v-model="userQuestion"
                @keyup.enter.ctrl="startReading"
                placeholder="Ask the cosmos your question..."
                class="mystical-input"
                :disabled="isProcessing"
              ></textarea>
              <button @click="toggleVoiceInput" class="voice-button" :class="{ 'listening': isListening }">
                <span class="voice-icon">🎤</span>
              </button>
            </div>
            
            <!-- Language Selection -->
            <div class="language-selector">
              <button v-for="lang in languages" :key="lang.code"
                      @click="selectedLanguage = lang.code"
                      :class="['lang-button', { active: selectedLanguage === lang.code }]">
                {{ lang.flag }} {{ lang.name }}
              </button>
            </div>

            <!-- Reading Style Selection -->
            <div class="reading-styles">
              <h3>Choose Your Reading Style</h3>
              <div class="style-grid">
                <button v-for="style in readingStyles" :key="style.id"
                        @click="selectedStyle = style.id"
                        :class="['style-card', { selected: selectedStyle === style.id }]">
                  <div class="style-icon">{{ style.icon }}</div>
                  <div class="style-name">{{ style.name }}</div>
                  <div class="style-description">{{ style.description }}</div>
                </button>
              </div>
            </div>

            <!-- Start Reading Button -->
            <button @click="startReading" 
                    :disabled="!userQuestion || isProcessing"
                    class="premium-action-button">
              <span v-if="!isProcessing">Begin Divine Reading</span>
              <span v-else>{{ processingStage }}</span>
            </button>
          </div>

          <!-- Processing Animation -->
          <div v-if="isProcessing" class="processing-animation">
            <div class="cosmic-spinner">
              <div class="spinner-ring" v-for="i in 5" :key="i" 
                   :style="{ animationDelay: i * 0.2 + 's' }"></div>
            </div>
            <p class="processing-message">{{ processingMessage }}</p>
            <div class="ai-models-status">
              <div v-for="model in activeModels" :key="model.name" 
                   :class="['model-status', model.status]">
                <span class="model-icon">{{ model.icon }}</span>
                <span class="model-name">{{ model.name }}</span>
                <span class="model-progress" v-if="model.status === 'processing'">
                  <span class="progress-dot">•</span>
                  <span class="progress-dot">•</span>
                  <span class="progress-dot">•</span>
                </span>
                <span class="model-check" v-else-if="model.status === 'complete'">✓</span>
              </div>
            </div>
          </div>

          <!-- Card Display Area -->
          <div v-if="drawnCards.length > 0" class="cards-display">
            <TransitionGroup name="card-reveal" tag="div" class="cards-grid">
              <div v-for="(card, index) in drawnCards" :key="card.id"
                   :class="['tarot-card-3d', { 'flipped': card.revealed }]"
                   @click="revealCard(index)"
                   :style="{ animationDelay: index * 0.3 + 's' }">
                <div class="card-inner">
                  <div class="card-back">
                    <div class="card-back-design"></div>
                  </div>
                  <div class="card-front">
                    <img :src="card.image" :alt="card.name" class="card-image">
                    <div class="card-info">
                      <h3>{{ card.name }}</h3>
                      <p class="card-keywords">{{ card.keywords.join(' • ') }}</p>
                    </div>
                    <div class="card-glow" :style="{ background: getCardGlow(card) }"></div>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- AI Reading Results -->
          <div v-if="readingComplete" class="reading-results">
            <div class="results-header">
              <h2>Your Divine Reading</h2>
              <div class="confidence-score">
                <span>AI Confidence: </span>
                <div class="confidence-bar">
                  <div class="confidence-fill" :style="{ width: confidenceScore + '%' }"></div>
                </div>
                <span>{{ confidenceScore }}%</span>
              </div>
            </div>

            <!-- Multi-Section Reading -->
            <div class="reading-sections">
              <section v-for="section in readingSections" :key="section.id" 
                       class="reading-section">
                <h3>{{ section.title }}</h3>
                <div class="section-content" v-html="section.content"></div>
                <div v-if="section.affirmation" class="affirmation-box">
                  <span class="affirmation-icon">✨</span>
                  <p>{{ section.affirmation }}</p>
                </div>
              </section>
            </div>

            <!-- Action Buttons -->
            <div class="reading-actions">
              <button @click="saveReading" class="action-button save">
                <span>💾</span> Save Reading
              </button>
              <button @click="shareReading" class="action-button share">
                <span>📤</span> Share
              </button>
              <button @click="generatePDF" class="action-button pdf">
                <span>📄</span> Export PDF
              </button>
              <button @click="playAudioReading" class="action-button audio">
                <span>🔊</span> Listen
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Special Events Banner -->
      <div v-if="activeEvents.length > 0" class="events-banner">
        <div class="event-item" v-for="event in activeEvents" :key="event.id">
          <span class="event-icon">{{ event.icon }}</span>
          <span class="event-name">{{ event.name }}</span>
          <span class="event-bonus">{{ event.description }}</span>
        </div>
      </div>

      <!-- Leaderboard Widget -->
      <aside class="leaderboard-widget">
        <h3>Top Mystics</h3>
        <div class="leaderboard-tabs">
          <button v-for="period in ['daily', 'weekly', 'allTime']" :key="period"
                  @click="loadLeaderboard(period)"
                  :class="['tab', { active: currentLeaderboardPeriod === period }]">
            {{ period }}
          </button>
        </div>
        <div class="leaderboard-list">
          <div v-for="entry in leaderboard" :key="entry.userId" 
               class="leaderboard-entry">
            <span class="rank">{{ entry.rank }}</span>
            <span class="username">{{ entry.username }}</span>
            <span class="score">{{ entry.score.toLocaleString() }}</span>
          </div>
        </div>
      </aside>
    </div>

    <!-- Floating Action Menu -->
    <div class="floating-menu" :class="{ expanded: menuExpanded }">
      <button @click="menuExpanded = !menuExpanded" class="menu-toggle">
        <span class="menu-icon">☰</span>
      </button>
      <div class="menu-items" v-if="menuExpanded">
        <button @click="openAchievements" class="menu-item">
          <span>🏆</span> Achievements
        </button>
        <button @click="openProfile" class="menu-item">
          <span>👤</span> Profile
        </button>
        <button @click="openSettings" class="menu-item">
          <span>⚙️</span> Settings
        </button>
        <button @click="openHelp" class="menu-item">
          <span>❓</span> Help
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { gamificationSystem } from '@/services/gamification/achievementSystem';
import { performanceEngine } from '@/services/performance/optimizationEngine';
import { monicaOrchestrator } from '@/services/ai/monicaOrchestrator';
import { enhancedReadingEngine } from '@/services/ai/enhancedReadingEngine';

// State Management
const userQuestion = ref('');
const selectedLanguage = ref('en');
const selectedStyle = ref('classic');
const isProcessing = ref(false);
const processingStage = ref('');
const processingMessage = ref('');
const drawnCards = ref<any[]>([]);
const readingComplete = ref(false);
const confidenceScore = ref(0);
const readingSections = ref<any[]>([]);
const isListening = ref(false);
const menuExpanded = ref(false);
const notifications = ref<any[]>([]);

// Gamification State
const userLevel = computed(() => gamificationSystem.getUserLevel());
const dailyChallenges = computed(() => gamificationSystem.getDailyChallenges());
const activeEvents = computed(() => gamificationSystem.getSpecialEvents());
const leaderboard = ref<any[]>([]);
const currentLeaderboardPeriod = ref('daily');

// Experience percentage calculation
const experiencePercentage = computed(() => {
  if (!userLevel.value) return 0;
  return (userLevel.value.experience / userLevel.value.nextLevelExp) * 100;
});

// Configuration
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }
];

const readingStyles = [
  { id: 'classic', name: 'Classic', icon: '🔮', description: 'Traditional tarot wisdom' },
  { id: 'modern', name: 'Modern', icon: '💫', description: 'Contemporary insights' },
  { id: 'spiritual', name: 'Spiritual', icon: '🕉️', description: 'Deep spiritual guidance' },
  { id: 'practical', name: 'Practical', icon: '💼', description: 'Real-world advice' },
  { id: 'romantic', name: 'Love', icon: '💕', description: 'Relationship focus' },
  { id: 'career', name: 'Career', icon: '📈', description: 'Professional guidance' }
];

const activeModels = ref([
  { name: 'GPT-4o', icon: '🤖', status: 'idle' },
  { name: 'Claude 3.5', icon: '🧠', status: 'idle' },
  { name: 'Gemini Pro', icon: '✨', status: 'idle' },
  { name: 'DeepSeek', icon: '🔍', status: 'idle' }
]);

const taglines = [
  'Where AI Meets Ancient Wisdom',
  'Your Digital Oracle Awaits',
  'Cosmic Insights, Quantum Accuracy',
  'The Future Revealed Through Silicon Dreams',
  'Mystical Guidance in the Digital Age'
];

const currentTagline = ref(taglines[0]);

// Lifecycle
onMounted(() => {
  initializeInterface();
  setupEventListeners();
  startBackgroundAnimations();
  rotateTaglines();
});

onUnmounted(() => {
  cleanupEventListeners();
});

// Initialization
function initializeInterface() {
  // Load user preferences
  loadUserPreferences();
  
  // Initialize performance optimizations
  performanceEngine.optimizeComponent('PremiumNightGodInterface');
  
  // Load initial leaderboard
  loadLeaderboard('daily');
  
  // Check for special events
  checkSpecialEvents();
}

function loadUserPreferences() {
  const saved = localStorage.getItem('nightgod_preferences');
  if (saved) {
    const prefs = JSON.parse(saved);
    selectedLanguage.value = prefs.language || 'en';
    selectedStyle.value = prefs.style || 'classic';
  }
}

function setupEventListeners() {
  window.addEventListener('achievement-unlocked', handleAchievementUnlocked);
  window.addEventListener('challenge-completed', handleChallengeCompleted);
  window.addEventListener('level-up', handleLevelUp);
}

function cleanupEventListeners() {
  window.removeEventListener('achievement-unlocked', handleAchievementUnlocked);
  window.removeEventListener('challenge-completed', handleChallengeCompleted);
  window.removeEventListener('level-up', handleLevelUp);
}

// Background Animations
function startBackgroundAnimations() {
  // Quantum particle animation
  createQuantumParticles();
  
  // Sacred geometry rotation
  animateSacredGeometry();
}

function createQuantumParticles() {
  // Implementation of particle system
  // This would create floating particles in the background
}

function animateSacredGeometry() {
  // Rotate sacred geometry patterns
  const geometry = document.querySelector('.rotating-geometry');
  if (geometry) {
    let rotation = 0;
    setInterval(() => {
      rotation += 0.5;
      (geometry as HTMLElement).style.transform = `rotate(${rotation}deg)`;
    }, 50);
  }
}

function rotateTaglines() {
  let index = 0;
  setInterval(() => {
    index = (index + 1) % taglines.length;
    currentTagline.value = taglines[index];
  }, 5000);
}

// Main Reading Function
async function startReading() {
  if (!userQuestion.value || isProcessing.value) return;
  
  isProcessing.value = true;
  readingComplete.value = false;
  drawnCards.value = [];
  readingSections.value = [];
  
  try {
    // Stage 1: Card Selection
    processingStage.value = 'Consulting the cosmos...';
    processingMessage.value = 'The universe is aligning to answer your question';
    updateModelStatus('DeepSeek', 'processing');
    
    // Simulate card drawing with AI guidance
    await new Promise(resolve => setTimeout(resolve, 2000));
    drawnCards.value = await selectCards();
    updateModelStatus('DeepSeek', 'complete');
    
    // Stage 2: AI Analysis
    processingStage.value = 'Channeling divine wisdom...';
    processingMessage.value = 'Multiple AI oracles are interpreting your cards';
    
    // Parallel AI processing
    const aiPromises = [
      processWithModel('GPT-4o'),
      processWithModel('Claude 3.5'),
      processWithModel('Gemini Pro')
    ];
    
    const results = await performanceEngine.parallelizeAIRequests(aiPromises);
    
    // Stage 3: Synthesis
    processingStage.value = 'Weaving your cosmic narrative...';
    processingMessage.value = 'Combining insights from multiple dimensions';
    
    // Generate final reading
    const reading = await synthesizeReading(results);
    readingSections.value = reading.sections;
    confidenceScore.value = reading.confidence;
    
    // Complete
    readingComplete.value = true;
    isProcessing.value = false;
    
    // Gamification
    gamificationSystem.completeReading(
      drawnCards.value.map(c => c.id),
      selectedLanguage.value
    );
    
  } catch (error) {
    console.error('Reading failed:', error);
    showNotification('error', '❌', 'Reading Failed', 'Please try again');
    isProcessing.value = false;
  }
}

async function selectCards(): Promise<any[]> {
  // AI-guided card selection based on question
  // This would integrate with the tarot data
  return [
    { id: 'fool', name: 'The Fool', keywords: ['beginnings', 'innocence'], image: '/assets/01_The_Fool.png', revealed: false },
    { id: 'magician', name: 'The Magician', keywords: ['manifestation', 'willpower'], image: '/assets/02_The_Magician.png', revealed: false },
    { id: 'priestess', name: 'The High Priestess', keywords: ['intuition', 'mystery'], image: '/assets/03_The_High_Priestess.png', revealed: false }
  ];
}

async function processWithModel(modelName: string): Promise<any> {
  updateModelStatus(modelName, 'processing');
  
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
  
  updateModelStatus(modelName, 'complete');
  
  return {
    model: modelName,
    interpretation: `${modelName} interpretation of the cards...`,
    confidence: 85 + Math.random() * 15
  };
}

function updateModelStatus(modelName: string, status: string) {
  const model = activeModels.value.find(m => m.name === modelName);
  if (model) {
    model.status = status;
  }
}

async function synthesizeReading(results: any[]): Promise<any> {
  // Combine all AI interpretations into cohesive reading
  return {
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        content: 'Your reading reveals profound insights...',
        affirmation: 'You are exactly where you need to be'
      },
      {
        id: 'present',
        title: 'Present Situation',
        content: 'The cards show your current energy...',
        affirmation: 'Trust in the present moment'
      },
      {
        id: 'guidance',
        title: 'Divine Guidance',
        content: 'The universe advises you to...',
        affirmation: 'Your path is illuminated'
      },
      {
        id: 'outcome',
        title: 'Potential Outcome',
        content: 'If you follow this guidance...',
        affirmation: 'Success awaits your courage'
      }
    ],
    confidence: Math.round(results.reduce((acc, r) => acc + r.confidence, 0) / results.length)
  };
}

// Card Interactions
function revealCard(index: number) {
  drawnCards.value[index].revealed = true;
}

function getCardGlow(card: any): string {
  // Generate unique glow color based on card
  const colors = ['#FFD700', '#9400D3', '#00CED1', '#FF69B4'];
  return `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]} 0%, transparent 70%)`;
}

// Voice Input
async function toggleVoiceInput() {
  if (!isListening.value) {
    startVoiceRecognition();
  } else {
    stopVoiceRecognition();
  }
}

function startVoiceRecognition() {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage.value === 'zh' ? 'zh-CN' : 
                       selectedLanguage.value === 'ja' ? 'ja-JP' : 'en-US';
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      userQuestion.value = transcript;
    };
    
    recognition.onend = () => {
      isListening.value = false;
    };
    
    recognition.start();
    isListening.value = true;
  }
}

function stopVoiceRecognition() {
  isListening.value = false;
}

// Reading Actions
async function saveReading() {
  const reading = {
    date: new Date().toISOString(),
    question: userQuestion.value,
    cards: drawnCards.value,
    sections: readingSections.value,
    language: selectedLanguage.value,
    style: selectedStyle.value
  };
  
  // Save to localStorage
  const readings = JSON.parse(localStorage.getItem('nightgod_readings') || '[]');
  readings.push(reading);
  localStorage.setItem('nightgod_readings', JSON.stringify(readings));
  
  showNotification('success', '💾', 'Reading Saved', 'Your reading has been saved successfully');
}

async function shareReading() {
  const shareText = `Night God Tarot Reading\n\nQuestion: ${userQuestion.value}\n\nCards: ${drawnCards.value.map(c => c.name).join(', ')}\n\nGet your reading at: https://nightgod.tarot`;
  
  if (navigator.share) {
    await navigator.share({
      title: 'My Tarot Reading',
      text: shareText
    });
  } else {
    // Fallback to clipboard
    await navigator.clipboard.writeText(shareText);
    showNotification('success', '📋', 'Copied to Clipboard', 'Share link copied!');
  }
}

async function generatePDF() {
  // Generate PDF of reading
  showNotification('info', '📄', 'Generating PDF', 'Your PDF is being created...');
  
  // This would integrate with a PDF generation library
  setTimeout(() => {
    showNotification('success', '✅', 'PDF Ready', 'Your reading PDF has been downloaded');
  }, 2000);
}

async function playAudioReading() {
  // Use TTS to read the reading aloud
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = readingSections.value.map(s => `${s.title}. ${s.content}`).join(' ');
    utterance.lang = selectedLanguage.value === 'zh' ? 'zh-CN' : 
                     selectedLanguage.value === 'ja' ? 'ja-JP' : 'en-US';
    speechSynthesis.speak(utterance);
    
    showNotification('info', '🔊', 'Playing Audio', 'Your reading is being narrated');
  }
}

// Leaderboard
async function loadLeaderboard(period: any) {
  currentLeaderboardPeriod.value = period;
  const data = await gamificationSystem.getLeaderboard(period);
  leaderboard.value = data.entries;
}

// Special Events
function checkSpecialEvents() {
  // Check moon phase and other events
  const events = gamificationSystem.getSpecialEvents();
  if (events.length > 0) {
    showNotification('event', '🌙', 'Special Event Active', events[0].description);
  }
}

// Notification System
function showNotification(type: string, icon: string, title: string, description: string) {
  const notification = {
    id: Date.now(),
    type,
    icon,
    title,
    description
  };
  
  notifications.value.push(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    const index = notifications.value.findIndex(n => n.id === notification.id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  }, 5000);
}

// Event Handlers
function handleAchievementUnlocked(event: any) {
  const achievement = event.detail;
  showNotification('achievement', achievement.icon, 'Achievement Unlocked!', achievement.name);
}

function handleChallengeCompleted(event: any) {
  const challenge = event.detail;
  showNotification('challenge', '✅', 'Challenge Complete!', challenge.name);
}

function handleLevelUp(event: any) {
  const level = event.detail;
  showNotification('levelup', '🎉', `Level ${level.current}!`, `You are now a ${level.title}`);
}

// Menu Actions
function openAchievements() {
  // Open achievements modal
  console.log('Opening achievements');
}

function openProfile() {
  // Open user profile
  console.log('Opening profile');
}

function openSettings() {
  // Open settings
  console.log('Opening settings');
}

function openHelp() {
  // Open help
  console.log('Opening help');
}
</script>

<style scoped>
.premium-night-god-interface {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #000033 0%, #000066 50%, #000033 100%);
  color: #ffffff;
  font-family: 'Segoe UI', system-ui, sans-serif;
  overflow-x: hidden;
}

/* Quantum Background */
.quantum-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence baseFrequency="0.02"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.05"/></svg>');
}

/* Sacred Geometry */
.sacred-geometry-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  opacity: 0.3;
}

.geometry-pattern {
  width: 100%;
  height: 100%;
}

.rotating-geometry {
  transform-origin: center;
  animation: rotate 120s linear infinite;
}

/* Achievement Notifications */
.achievement-notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.achievement-popup {
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #FFD700;
  border-radius: 10px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  animation: slideIn 0.5s ease-out;
}

.achievement-icon {
  font-size: 2rem;
}

.achievement-content h3 {
  margin: 0;
  color: #FFD700;
  font-size: 1.1rem;
}

.achievement-content p {
  margin: 5px 0 0;
  color: #ffffff;
  font-size: 0.9rem;
}

/* Level Progress */
.level-progress-container {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  border-radius: 0 0 20px 20px;
  padding: 10px 30px;
  z-index: 100;
  min-width: 300px;
}

.level-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.level-badge {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: bold;
}

.level-title {
  color: #9400D3;
  font-weight: bold;
}

.experience-bar {
  width: 100%;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.experience-fill {
  height: 100%;
  background: linear-gradient(90deg, #9400D3, #FFD700);
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.experience-text {
  font-size: 0.8rem;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* Main Content */
.premium-content {
  position: relative;
  z-index: 10;
  padding: 60px 20px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.mystical-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-container {
  margin-bottom: 30px;
}

.floating-logo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #FFD700;
  animation: float 6s ease-in-out infinite;
}

.glowing-title {
  font-size: 3rem;
  margin: 20px 0 10px;
  background: linear-gradient(45deg, #FFD700, #9400D3, #00CED1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: glow 3s ease-in-out infinite;
}

.tagline {
  color: #888;
  font-style: italic;
  font-size: 1.1rem;
}

/* Daily Challenges */
.daily-challenges-widget {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.daily-challenges-widget h3 {
  color: #FFD700;
  margin-bottom: 15px;
}

.challenge-item {
  margin-bottom: 15px;
}

.challenge-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00CED1, #9400D3);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #888;
}

/* Reading Section */
.ai-reading-section {
  margin-bottom: 40px;
}

.reading-container {
  background: rgba(0, 0, 20, 0.7);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
}

.reading-container.processing {
  border: 2px solid #FFD700;
  animation: pulse 2s ease-in-out infinite;
}

/* Input Section */
.input-section {
  margin-bottom: 30px;
}

.voice-input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.mystical-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(147, 0, 211, 0.3);
  border-radius: 10px;
  padding: 15px;
  color: #fff;
  font-size: 1.1rem;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;
}

.mystical-input:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.voice-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9400D3, #FFD700);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.voice-button.listening {
  animation: pulse 1s ease-in-out infinite;
  background: linear-gradient(135deg, #FF0000, #FFD700);
}

.voice-icon {
  font-size: 1.5rem;
}

/* Language Selector */
.language-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.lang-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 10px 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lang-button.active {
  background: linear-gradient(135deg, #9400D3, #FFD700);
  border-color: #FFD700;
}

/* Reading Styles */
.reading-styles {
  margin-bottom: 30px;
}

.reading-styles h3 {
  text-align: center;
  color: #FFD700;
  margin-bottom: 20px;
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.style-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.style-card.selected {
  background: rgba(147, 0, 211, 0.3);
  border-color: #FFD700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.style-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.style-name {
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 5px;
}

.style-description {
  font-size: 0.9rem;
  color: #888;
}

/* Action Button */
.premium-action-button {
  width: 100%;
  background: linear-gradient(135deg, #FFD700, #9400D3);
  border: none;
  border-radius: 15px;
  padding: 20px;
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.premium-action-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
}

.premium-action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Processing Animation */
.processing-animation {
  text-align: center;
  padding: 40px;
}

.cosmic-spinner {
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  position: relative;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: #FFD700;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  border-top-color: #9400D3;
}

.spinner-ring:nth-child(3) {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  border-top-color: #00CED1;
}

.processing-message {
  color: #FFD700;
  font-size: 1.2rem;
  margin-bottom: 20px;
}

/* AI Models Status */
.ai-models-status {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.model-status {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.model-status.processing {
  border-color: #FFD700;
  animation: pulse 1s ease-in-out infinite;
}

.model-status.complete {
  border-color: #00FF00;
}

.model-icon {
  font-size: 1.5rem;
}

.model-name {
  font-weight: bold;
}

.progress-dot {
  animation: blink 1.5s ease-in-out infinite;
}

.progress-dot:nth-child(2) {
  animation-delay: 0.3s;
}

.progress-dot:nth-child(3) {
  animation-delay: 0.6s;
}

.model-check {
  color: #00FF00;
  font-size: 1.2rem;
}

/* Cards Display */
.cards-display {
  margin: 40px 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  justify-items: center;
}

.tarot-card-3d {
  width: 200px;
  height: 300px;
  perspective: 1000px;
  cursor: pointer;
  animation: cardAppear 0.6s ease-out;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s;
}

.tarot-card-3d.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-back,
.card-front {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  border-radius: 15px;
  overflow: hidden;
}

.card-back {
  background: linear-gradient(135deg, #000033, #9400D3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-back-design {
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, #FFD700 0%, transparent 70%);
  opacity: 0.5;
}

.card-front {
  transform: rotateY(180deg);
  background: #000;
  position: relative;
}

.card-image {
  width: 100%;
  height: 70%;
  object-fit: cover;
}

.card-info {
  padding: 10px;
  text-align: center;
}

.card-info h3 {
  margin: 0 0 5px;
  color: #FFD700;
  font-size: 1rem;
}

.card-keywords {
  color: #888;
  font-size: 0.8rem;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.3;
}

/* Reading Results */
.reading-results {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 30px;
  margin-top: 40px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.results-header h2 {
  color: #FFD700;
  font-size: 2rem;
}

.confidence-score {
  display: flex;
  align-items: center;
  gap: 10px;
}

.confidence-bar {
  width: 100px;
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF0000, #FFD700, #00FF00);
  transition: width 0.5s ease;
}

/* Reading Sections */
.reading-sections {
  display: grid;
  gap: 20px;
}

.reading-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.reading-section h3 {
  color: #9400D3;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.section-content {
  color: #ddd;
  line-height: 1.6;
  margin-bottom: 15px;
}

.affirmation-box {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(147, 0, 211, 0.1));
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.affirmation-icon {
  font-size: 1.5rem;
}

.affirmation-box p {
  margin: 0;
  font-style: italic;
  color: #FFD700;
}

/* Reading Actions */
.reading-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.action-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 12px 24px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.action-button.save {
  border-color: #00FF00;
}

.action-button.share {
  border-color: #00CED1;
}

.action-button.pdf {
  border-color: #FFD700;
}

.action-button.audio {
  border-color: #9400D3;
}

/* Events Banner */
.events-banner {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.1), rgba(147, 0, 211, 0.1));
  border-radius: 15px;
  padding: 15px;
  margin: 30px 0;
  display: flex;
  gap: 20px;
  overflow-x: auto;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

.event-icon {
  font-size: 1.5rem;
}

.event-name {
  font-weight: bold;
  color: #FFD700;
}

.event-bonus {
  color: #888;
  font-size: 0.9rem;
}

/* Leaderboard */
.leaderboard-widget {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  padding: 20px;
  margin-top: 30px;
}

.leaderboard-widget h3 {
  color: #FFD700;
  text-align: center;
  margin-bottom: 15px;
}

.leaderboard-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.tab {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab.active {
  background: linear-gradient(135deg, #9400D3, #FFD700);
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.leaderboard-entry {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px 15px;
}

.rank {
  font-weight: bold;
  color: #FFD700;
  min-width: 30px;
}

.username {
  flex: 1;
}

.score {
  color: #9400D3;
  font-weight: bold;
}

/* Floating Menu */
.floating-menu {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 999;
}

.menu-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700, #9400D3);
  border: none;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.menu-toggle:hover {
  transform: scale(1.1);
}

.menu-icon {
  font-size: 1.5rem;
  color: #fff;
}

.menu-items {
  position: absolute;
  bottom: 70px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid #FFD700;
  border-radius: 10px;
  padding: 10px 15px;
  color: #fff;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-item:hover {
  background: rgba(147, 0, 211, 0.5);
  transform: translateX(-5px);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes glow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes blink {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* Transitions */
.achievement-enter-active,
.achievement-leave-active {
  transition: all 0.5s ease;
}

.achievement-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.achievement-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.card-reveal-enter-active {
  transition: all 0.6s ease;
}

.card-reveal-enter-from {
  opacity: 0;
  transform: scale(0.5) rotateZ(180deg);
}

/* Responsive Design */
@media (max-width: 768px) {
  .premium-content {
    padding: 40px 10px 10px;
  }
  
  .glowing-title {
    font-size: 2rem;
  }
  
  .style-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .results-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .reading-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
  
  .achievement-notifications {
    left: 10px;
    right: 10px;
    top: 60px;
  }
  
  .floating-menu {
    bottom: 20px;
    right: 20px;
  }
  
  .menu-items {
    right: -10px;
  }
}

@media (max-width: 480px) {
  .level-progress-container {
    width: 100%;
    border-radius: 0;
  }
  
  .voice-input-container {
    flex-direction: column;
  }
  
  .voice-button {
    align-self: center;
  }
  
  .language-selector {
    flex-wrap: wrap;
  }
  
  .events-banner {
    flex-direction: column;
  }
}
</style>