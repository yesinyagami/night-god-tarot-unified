<template>
  <div class="realtime-reading-progress" v-if="isActive">
    <div class="cosmic-overlay"></div>
    <div class="reading-portal">
      <div class="portal-header">
        <h3 class="reading-title">{{ getStageTitle() }}</h3>
        <p class="reading-subtitle">{{ reading.stageContent }}</p>
      </div>
      
      <!-- Progress Visualization -->
      <div class="progress-mandala">
        <svg width="200" height="200" viewBox="0 0 200 200" class="mandala-svg">
          <!-- Background circle -->
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="rgba(255, 215, 0, 0.2)"
            stroke-width="4"
          />
          
          <!-- Progress circle -->
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="url(#progressGradient)"
            stroke-width="4"
            stroke-linecap="round"
            :stroke-dasharray="progressCircumference"
            :stroke-dashoffset="progressOffset"
            transform="rotate(-90 100 100)"
            class="progress-circle"
          />
          
          <!-- Center content -->
          <text
            x="100"
            y="95"
            text-anchor="middle"
            class="progress-text"
            :font-size="reading.progress < 100 ? '24' : '20'"
            fill="#FFD700"
          >
            {{ reading.progress < 100 ? reading.progress + '%' : '✨' }}
          </text>
          
          <text
            x="100"
            y="115"
            text-anchor="middle"
            class="stage-text"
            font-size="12"
            fill="#CBD5E1"
          >
            {{ getStageEmoji() }}
          </text>
          
          <!-- Gradient definition -->
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#8B5CF6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:1" />
            </linearGradient>
          </defs>
        </svg>
        
        <!-- Floating particles around the progress -->
        <div class="progress-particles">
          <div 
            v-for="i in 12" 
            :key="i"
            class="particle"
            :style="getParticleStyle(i)"
          ></div>
        </div>
      </div>
      
      <!-- Stage Details -->
      <div class="stage-details">
        <div class="stage-steps">
          <div 
            v-for="(stage, index) in stages" 
            :key="stage.id"
            class="stage-step"
            :class="{ 
              active: stage.id === reading.currentStage,
              completed: isStageCompleted(stage.id)
            }"
          >
            <div class="step-icon">{{ stage.icon }}</div>
            <div class="step-name">{{ stage.name }}</div>
          </div>
        </div>
      </div>
      
      <!-- Cancel button -->
      <button v-if="reading.progress < 100" @click="cancelReading" class="cancel-btn">
        {{ $t('cancelReading') }}
      </button>
      
      <!-- Error display -->
      <div v-if="reading.error" class="error-display">
        <div class="error-icon">⚠️</div>
        <div class="error-message">{{ reading.error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import type { StreamingReading } from '../services/ai/realTimeReading'

interface Props {
  reading: StreamingReading
  isActive: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  cancel: []
  complete: [reading: string]
}>()

const stages = [
  { id: 'preparing', name: 'Preparing', icon: '🌟' },
  { id: 'research', name: 'Research', icon: '🌊' },
  { id: 'analysis', name: 'Analysis', icon: '🧠' },
  { id: 'creation', name: 'Creation', icon: '🎭' },
  { id: 'complete', name: 'Complete', icon: '✨' }
]

const progressCircumference = computed(() => 2 * Math.PI * 80)
const progressOffset = computed(() => {
  const progress = props.reading.progress / 100
  return progressCircumference.value * (1 - progress)
})

const getStageTitle = () => {
  switch (props.reading.currentStage) {
    case 'preparing': return '🌟 Preparing Cosmic Connection'
    case 'research': return '🌊 Deep Mystical Research'
    case 'analysis': return '🧠 Analyzing Sacred Patterns'
    case 'creation': return '🎭 Creating Your Reading'
    case 'complete': return '✨ Reading Complete'
    default: return '🔮 Divine Process Active'
  }
}

const getStageEmoji = () => {
  const stage = stages.find(s => s.id === props.reading.currentStage)
  return stage?.icon || '🔮'
}

const isStageCompleted = (stageId: string) => {
  const stageOrder = ['preparing', 'research', 'analysis', 'creation', 'complete']
  const currentIndex = stageOrder.indexOf(props.reading.currentStage)
  const checkIndex = stageOrder.indexOf(stageId)
  return checkIndex < currentIndex || props.reading.progress === 100
}

const getParticleStyle = (index: number) => {
  const angle = (index * 30) * Math.PI / 180
  const radius = 100 + Math.sin(Date.now() / 1000 + index) * 20
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  
  return {
    transform: `translate(${x}px, ${y}px)`,
    animationDelay: `${index * 0.1}s`
  }
}

const cancelReading = () => {
  emit('cancel')
}

// Auto-complete when reading is done
let checkCompleteInterval: number

onMounted(() => {
  checkCompleteInterval = setInterval(() => {
    if (props.reading.currentStage === 'complete' && props.reading.finalReading) {
      emit('complete', props.reading.finalReading)
      clearInterval(checkCompleteInterval)
    }
  }, 1000)
})

onUnmounted(() => {
  if (checkCompleteInterval) {
    clearInterval(checkCompleteInterval)
  }
})
</script>

<style scoped>
.realtime-reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cosmic-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(15, 15, 30, 0.95) 0%, 
    rgba(26, 26, 46, 0.95) 50%, 
    rgba(22, 33, 62, 0.95) 100%);
  backdrop-filter: blur(10px);
}

.reading-portal {
  position: relative;
  background: linear-gradient(135deg, #1e1b4b, #312e81);
  border: 3px solid #FFD700;
  border-radius: 25px;
  padding: 3rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 25px 50px rgba(255, 215, 0, 0.3);
  animation: portalGlow 2s ease-in-out infinite alternate;
}

@keyframes portalGlow {
  0% { box-shadow: 0 25px 50px rgba(255, 215, 0, 0.3); }
  100% { box-shadow: 0 25px 50px rgba(255, 215, 0, 0.6); }
}

.portal-header {
  margin-bottom: 2rem;
}

.reading-title {
  color: #FFD700;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.reading-subtitle {
  color: #CBD5E1;
  font-size: 1.1rem;
  margin: 0;
}

.progress-mandala {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
}

.mandala-svg {
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
}

.progress-circle {
  transition: stroke-dashoffset 0.5s ease;
}

.progress-text {
  font-weight: bold;
  font-family: 'Arial', sans-serif;
}

.progress-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #FFD700;
  border-radius: 50%;
  animation: particleFloat 3s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

.stage-details {
  margin: 2rem 0;
}

.stage-steps {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.stage-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.stage-step.active {
  opacity: 1;
  transform: scale(1.1);
}

.stage-step.completed {
  opacity: 0.8;
  color: #10B981;
}

.step-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.step-name {
  font-size: 0.8rem;
  color: #CBD5E1;
}

.cancel-btn {
  background: linear-gradient(135deg, #EF4444, #DC2626);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.cancel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(239, 68, 68, 0.4);
}

.error-display {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid #EF4444;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-icon {
  font-size: 1.2rem;
}

.error-message {
  color: #FCA5A5;
  font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .reading-portal {
    padding: 2rem 1.5rem;
  }
  
  .stage-steps {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .step-name {
    font-size: 0.7rem;
  }
}
</style>