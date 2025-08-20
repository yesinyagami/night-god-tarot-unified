<template>
  <!-- Floating Binaural Audio Player for Night God Tarot -->
  <div class="binaural-player" :class="{ minimized: !isPanelOpen }">
    <!-- Main Control Button -->
    <button 
      class="player-toggle" 
      :class="{ playing: isPlaying }"
      @click="togglePlayer"
    >
      <span class="player-icon">{{ playerIcon }}</span>
      <div class="tooltip">{{ tSync('wealthClearingAudio') }}</div>
    </button>
    
    <!-- Control Panel -->
    <div class="player-panel" :class="{ active: isPanelOpen }">
      <div class="panel-title">
        <span>✨</span>
        <span>{{ tSync('wealthBarrierClearing') }}</span>
      </div>
      
      <!-- Mode Selection -->
      <div class="mode-buttons">
        <button 
          v-for="mode in audioModes" 
          :key="mode.id"
          class="mode-btn" 
          :class="{ active: currentMode === mode.id }"
          @click="changeMode(mode.id)"
        >
          {{ mode.name }}
        </button>
      </div>
      
      <!-- Volume Control -->
      <div class="volume-control">
        <span class="volume-label">{{ tSync('volume') }}</span>
        <input 
          type="range" 
          class="volume-slider" 
          min="0" 
          max="100" 
          v-model="volume"
          @input="changeVolume"
        >
        <span class="volume-value">{{ volume }}%</span>
      </div>
      
      <!-- Play Controls -->
      <div class="play-controls">
        <button class="control-btn" @click="playAudio">
          ▶ {{ tSync('play') }}
        </button>
        <button class="control-btn" @click="pauseAudio">
          ⏸ {{ tSync('pause') }}
        </button>
        <button class="control-btn" @click="closePanel">
          ✕ {{ tSync('close') }}
        </button>
      </div>
      
      <div class="status-text">
        {{ statusText }}
      </div>
    </div>
    
    <!-- Hidden YouTube iframe for audio playback -->
    <div class="hidden-audio">
      <iframe 
        ref="youtubePlayer"
        width="1" 
        height="1" 
        :src="iframeSrc"
        frameborder="0"
        allow="autoplay"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { monicaTranslator } from '../services/monicaTranslator'

// Props
interface Props {
  currentLanguage?: 'zh' | 'en' | 'ja'
}

const props = withDefaults(defineProps<Props>(), {
  currentLanguage: 'zh'
})

// Reactive state
const isPlaying = ref(false)
const isPanelOpen = ref(false)
const currentMode = ref('theta')
const volume = ref(50)
const statusText = ref('')

// Audio modes configuration
const audioModes = ref([
  { id: 'theta', name: 'Theta 8Hz', videoId: '1ZYbU82GVz4' },
  { id: 'alpha', name: 'Alpha 7Hz', videoId: 'RxjmJJqvJ0s' },
  { id: 'mixed', name: '混合頻率', videoId: '6iCJIq7r80s' }
])

// Base translations
const baseTexts = {
  wealthClearingAudio: '神聖音頻播放器',
  wealthBarrierClearing: '神聖療癒頻率',
  volume: '音量',
  play: '播放',
  pause: '暫停',
  close: '關閉',
  headphonesRecommended: '請戴上耳機以獲得最佳效果',
  nowPlaying: '正在播放...',
  paused: '已暫停',
  switchedTo: '切換至'
}

// Translation cache
const translationCache = ref<{ [key: string]: string }>({})

// Synchronous translation function
const tSync = (key: string): string => {
  const sourceText = baseTexts[key as keyof typeof baseTexts]
  if (!sourceText) return key
  
  if (props.currentLanguage === 'zh') {
    return sourceText
  }
  
  const cacheKey = `${key}-${props.currentLanguage}`
  return translationCache.value[cacheKey] || sourceText
}

// Computed properties
const playerIcon = computed(() => {
  return isPlaying.value ? '🎶' : '🎵'
})

const currentVideoId = computed(() => {
  const mode = audioModes.value.find(m => m.id === currentMode.value)
  return mode?.videoId || '1ZYbU82GVz4'
})

const iframeSrc = computed(() => {
  const videoId = currentVideoId.value
  const autoplay = isPlaying.value ? '1' : '0'
  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${autoplay}&loop=1&playlist=${videoId}`
})

// Methods
const togglePlayer = () => {
  isPanelOpen.value = !isPanelOpen.value
  
  if (isPanelOpen.value && !isPlaying.value) {
    setTimeout(() => playAudio(), 300)
  }
}

const playAudio = () => {
  isPlaying.value = true
  updateStatus(tSync('nowPlaying'))
}

const pauseAudio = () => {
  isPlaying.value = false
  updateStatus(tSync('paused'))
}

const closePanel = () => {
  isPanelOpen.value = false
  if (isPlaying.value) {
    pauseAudio()
  }
}

const changeMode = (mode: string) => {
  currentMode.value = mode
  
  if (isPlaying.value) {
    const modeName = audioModes.value.find(m => m.id === mode)?.name || mode
    updateStatus(`${tSync('switchedTo')} ${modeName}`)
  }
}

const changeVolume = () => {
  // Note: YouTube iframe API requires additional setup for volume control
  // This function updates the display value
}

const updateStatus = (text: string) => {
  statusText.value = text
  setTimeout(() => {
    statusText.value = tSync('headphonesRecommended')
  }, 3000)
}

// Translate all audio player texts
const translateAudioTexts = async () => {
  if (props.currentLanguage === 'zh') return
  
  try {
    const textsToTranslate = Object.values(baseTexts)
    const translations = await monicaTranslator.batchTranslate({
      texts: textsToTranslate,
      fromLanguage: 'zh',
      toLanguage: props.currentLanguage,
      context: 'Audio player for mystical tarot experience - binaural beats and wealth clearing frequencies'
    })
    
    // Map translations back to keys
    Object.keys(baseTexts).forEach((key, index) => {
      const cacheKey = `${key}-${props.currentLanguage}`
      translationCache.value[cacheKey] = translations[index] || baseTexts[key as keyof typeof baseTexts]
    })
    
    // Update mode names based on language
    if (props.currentLanguage === 'en') {
      audioModes.value = [
        { id: 'theta', name: 'Theta 8Hz', videoId: '1ZYbU82GVz4' },
        { id: 'alpha', name: 'Alpha 7Hz', videoId: 'RxjmJJqvJ0s' },
        { id: 'mixed', name: 'Mixed Freq', videoId: '6iCJIq7r80s' }
      ]
    } else if (props.currentLanguage === 'ja') {
      audioModes.value = [
        { id: 'theta', name: 'シータ 8Hz', videoId: '1ZYbU82GVz4' },
        { id: 'alpha', name: 'アルファ 7Hz', videoId: 'RxjmJJqvJ0s' },
        { id: 'mixed', name: '混合周波数', videoId: '6iCJIq7r80s' }
      ]
    }
    
    statusText.value = tSync('headphonesRecommended')
  } catch (error) {
    console.error('Audio player translation failed:', error)
  }
}

// Keyboard event handler
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isPanelOpen.value) {
    closePanel()
  }
}

// Lifecycle
onMounted(async () => {
  document.addEventListener('keydown', handleKeyDown)
  statusText.value = tSync('headphonesRecommended')
  
  // Translate texts if not Chinese
  if (props.currentLanguage !== 'zh') {
    await translateAudioTexts()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// Watch for language changes
import { watch } from 'vue'
watch(() => props.currentLanguage, async (newLang) => {
  if (newLang !== 'zh') {
    await translateAudioTexts()
  } else {
    // Reset to Chinese
    translationCache.value = {}
    audioModes.value = [
      { id: 'theta', name: 'Theta 8Hz', videoId: '1ZYbU82GVz4' },
      { id: 'alpha', name: 'Alpha 7Hz', videoId: 'RxjmJJqvJ0s' },
      { id: 'mixed', name: '混合頻率', videoId: '6iCJIq7r80s' }
    ]
    statusText.value = tSync('headphonesRecommended')
  }
})
</script>

<style scoped>
/* Floating Player Container */
.binaural-player {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Main Button - Circular Icon */
.player-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

.player-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
}

/* Pulsing Effect for Playing State */
.player-toggle.playing::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  animation: pulse 2s infinite;
  z-index: -1;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* Player Icon */
.player-icon {
  font-size: 24px;
  color: #333;
}

/* Mini Control Panel */
.player-panel {
  position: absolute;
  bottom: 70px;
  left: 0;
  background: rgba(20, 20, 35, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 15px;
  width: 280px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 215, 0, 0.2);
  display: none;
  animation: slideUp 0.3s ease;
}

.player-panel.active {
  display: block;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Panel Title */
.panel-title {
  color: #ffd700;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Mode Selection Buttons */
.mode-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.mode-btn {
  flex: 1;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s;
}

.mode-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: #ffd700;
}

.mode-btn.active {
  background: rgba(255, 215, 0, 0.3);
  border-color: #ffd700;
  color: #ffd700;
}

/* Volume Control */
.volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.volume-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  min-width: 35px;
}

.volume-slider {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #ffd700;
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #ffd700;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.volume-value {
  color: #ffd700;
  font-size: 12px;
  min-width: 30px;
  text-align: right;
}

/* Play Controls */
.play-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  flex: 1;
  padding: 8px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 237, 78, 0.1));
  border: 1px solid rgba(255, 215, 0, 0.4);
  border-radius: 8px;
  color: #ffd700;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.control-btn:hover {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 237, 78, 0.2));
  transform: translateY(-1px);
}

/* Status Text */
.status-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 10px;
  text-align: center;
  margin-top: 10px;
}

/* Hidden Audio */
.hidden-audio {
  display: none;
}

/* Tooltip */
.tooltip {
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: #ffd700;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.player-toggle:hover .tooltip {
  opacity: 1;
}

/* Minimized State */
.binaural-player.minimized .player-panel {
  display: none;
}
</style>