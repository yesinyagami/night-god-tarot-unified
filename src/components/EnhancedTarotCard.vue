<template>
  <div 
    class="enhanced-tarot-card"
    :class="{ 
      flipped: isFlipped, 
      animated: isAnimating,
      glowing: hasSpecialEffect,
      'ai-enhanced': useAIFeatures 
    }"
    @click="handleCardClick"
    @mouseenter="onHover"
    @mouseleave="onLeave"
  >
    <!-- Card Back -->
    <div class="card-face card-back" v-if="!isFlipped">
      <div class="mystical-pattern">
        <div class="sacred-geometry">
          <svg viewBox="0 0 100 100" class="geometry-svg">
            <circle cx="50" cy="50" r="30" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.6"/>
            <circle cx="50" cy="50" r="20" fill="none" stroke="#8B5CF6" stroke-width="1.5" opacity="0.5"/>
            <circle cx="50" cy="50" r="10" fill="none" stroke="#06B6D4" stroke-width="1" opacity="0.4"/>
          </svg>
        </div>
        <div class="card-back-text">🔮</div>
        <div class="energy-particles" v-if="showParticles">
          <div 
            v-for="i in 12" 
            :key="i"
            class="particle"
            :style="getParticleStyle(i)"
          ></div>
        </div>
      </div>
    </div>

    <!-- Card Front -->
    <div class="card-face card-front" v-if="isFlipped">
      <!-- AI-Generated Card Image -->
      <div class="card-image-container">
        <img 
          v-if="aiGeneratedImage && useAIFeatures"
          :src="aiGeneratedImage"
          :alt="card.name"
          class="ai-card-image"
          @load="onImageLoad"
          @error="onImageError"
        />
        <img 
          v-else
          :src="card.image"
          :alt="card.name"
          class="traditional-card-image"
          @load="onImageLoad"
          @error="onImageError"
        />
        
        <!-- Image Loading Overlay -->
        <div v-if="isLoadingImage" class="image-loading">
          <div class="loading-spinner"></div>
          <p>{{ $t('generatingAIImage') }}</p>
        </div>

        <!-- Video Animation Overlay -->
        <video 
          v-if="cardAnimation && playAnimation"
          :src="cardAnimation"
          class="card-animation"
          autoplay
          muted
          loop
          @ended="onAnimationEnd"
        ></video>
      </div>

      <!-- Card Information -->
      <div class="card-info">
        <h3 class="card-name">{{ card.name }}</h3>
        <p class="card-number" v-if="card.number !== undefined">
          {{ formatCardNumber(card.number) }}
        </p>
        <div class="card-keywords">
          <span 
            v-for="keyword in getDisplayKeywords()" 
            :key="keyword"
            class="keyword-tag"
          >
            {{ keyword }}
          </span>
        </div>
      </div>

      <!-- AI Interpretation -->
      <div v-if="aiInterpretation && showInterpretation" class="ai-interpretation">
        <div class="interpretation-header">
          <span class="ai-badge">{{ aiModel }} ✨</span>
          <button @click="playVoiceReading" class="voice-btn" v-if="voiceReading">
            🔊
          </button>
        </div>
        <p class="interpretation-text">{{ aiInterpretation }}</p>
        <div class="confidence-bar">
          <div 
            class="confidence-fill"
            :style="{ width: (confidence * 100) + '%' }"
          ></div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="card-actions" v-if="isFlipped">
        <button 
          @click="generateAIImage" 
          class="action-btn ai-image-btn"
          :disabled="isLoadingImage"
          v-if="useAIFeatures"
        >
          🎨 {{ isLoadingImage ? $t('generating') : $t('newAIImage') }}
        </button>
        
        <button 
          @click="getInstantReading" 
          class="action-btn instant-reading-btn"
          :disabled="isLoadingReading"
        >
          🔮 {{ isLoadingReading ? $t('reading') : $t('instantReading') }}
        </button>
        
        <button 
          @click="generateAnimation" 
          class="action-btn animation-btn"
          :disabled="isLoadingAnimation"
          v-if="useAIFeatures"
        >
          🎬 {{ isLoadingAnimation ? $t('creating') : $t('animate') }}
        </button>
        
        <button 
          @click="getWebEnhancedReading" 
          class="action-btn web-reading-btn"
          :disabled="isLoadingWebReading"
          v-if="useAIFeatures"
        >
          🌐 {{ isLoadingWebReading ? $t('researching') : $t('webReading') }}
        </button>
      </div>
    </div>

    <!-- Special Effects Overlay -->
    <div v-if="hasSpecialEffect" class="special-effects">
      <div class="mystical-aura"></div>
      <div class="floating-symbols">
        <span v-for="i in 6" :key="i" class="floating-symbol">✨</span>
      </div>
    </div>

    <!-- Audio Element for Voice Reading -->
    <audio 
      ref="voicePlayer"
      :src="voiceReading"
      @ended="onVoiceEnd"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { advancedMonicaService } from '../services/ai/advancedMonicaService'
import type { TarotCard } from '../types/tarot'

interface Props {
  card: TarotCard
  useAIFeatures?: boolean
  autoFlip?: boolean
  showParticles?: boolean
  specialEffect?: 'none' | 'glow' | 'mystical' | 'cosmic'
}

const props = withDefaults(defineProps<Props>(), {
  useAIFeatures: true,
  autoFlip: false,
  showParticles: true,
  specialEffect: 'none'
})

const emit = defineEmits<{
  flip: [card: TarotCard]
  interpret: [interpretation: string]
  voicePlay: [isPlaying: boolean]
}>()

// Reactive state
const isFlipped = ref(false)
const isAnimating = ref(false)
const showInterpretation = ref(false)
const playAnimation = ref(false)

// AI-generated content
const aiGeneratedImage = ref<string | null>(null)
const aiInterpretation = ref<string>('')
const voiceReading = ref<string>('')
const cardAnimation = ref<string>('')
const aiModel = ref<string>('Monica AI')
const confidence = ref<number>(0.8)

// Loading states
const isLoadingImage = ref(false)
const isLoadingReading = ref(false)
const isLoadingAnimation = ref(false)
const isLoadingWebReading = ref(false)

// Special effects
const hasSpecialEffect = computed(() => props.specialEffect !== 'none')

// Voice player reference
const voicePlayer = ref<HTMLAudioElement>()

// Card display logic
const getDisplayKeywords = () => {
  return props.card.keywords.upright.slice(0, 3)
}

const formatCardNumber = (num: number) => {
  if (props.card.arcana === 'major') {
    return `Major Arcana ${num}`
  }
  return `${props.card.suit} ${num}`
}

// Particle animation
const getParticleStyle = (index: number) => {
  const angle = (index * 30) * Math.PI / 180
  const radius = 40 + Math.sin(Date.now() / 1000 + index) * 10
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  
  return {
    transform: `translate(${x}px, ${y}px)`,
    animationDelay: `${index * 0.1}s`
  }
}

// Event handlers
const handleCardClick = async () => {
  if (!isFlipped.value) {
    await flipCard()
  }
}

const onHover = () => {
  if (!isFlipped.value && props.showParticles) {
    // Add hover particle effects
  }
}

const onLeave = () => {
  // Remove hover effects
}

// Main card flip logic
const flipCard = async () => {
  isAnimating.value = true
  isFlipped.value = true
  
  emit('flip', props.card)
  
  // Auto-generate AI content if enabled
  if (props.useAIFeatures) {
    await Promise.allSettled([
      generateAIImage(),
      getInstantReading()
    ])
  }
  
  setTimeout(() => {
    isAnimating.value = false
    showInterpretation.value = true
  }, 800)
}

// AI Feature implementations
const generateAIImage = async () => {
  if (!props.useAIFeatures) return
  
  isLoadingImage.value = true
  
  try {
    const imageUrl = await advancedMonicaService.generateTarotCardImage({
      cardName: props.card.name,
      style: 'mystical',
      prompt: `${props.card.description}, ${props.card.keywords.upright.join(', ')}, divine energy, sacred symbolism`,
      dimensions: '1024x1024'
    })
    
    if (imageUrl) {
      aiGeneratedImage.value = imageUrl
    }
  } catch (error) {
    console.error('AI image generation failed:', error)
  } finally {
    isLoadingImage.value = false
  }
}

const getInstantReading = async () => {
  isLoadingReading.value = true
  
  try {
    // Use multi-model reading for best results
    const result = await advancedMonicaService.performMultiModelReading({
      question: 'What guidance does this card offer?',
      cards: [{ name: props.card.name, description: props.card.description }],
      models: ['gpt-4o', 'claude-3-5-sonnet-20241022'],
      compareResponses: true
    })
    
    aiInterpretation.value = result.bestReading
    aiModel.value = result.readings.find(r => r.response === result.bestReading)?.model || 'Monica AI'
    confidence.value = result.readings.find(r => r.response === result.bestReading)?.confidence || 0.8
    
    emit('interpret', aiInterpretation.value)
    
    // Generate voice reading
    if (aiInterpretation.value) {
      await generateVoiceReading()
    }
  } catch (error) {
    console.error('Instant reading failed:', error)
    aiInterpretation.value = `✨ ${props.card.name} brings the energy of ${props.card.keywords.upright[0]}. Trust in the divine guidance this card offers as you navigate your path forward.`
  } finally {
    isLoadingReading.value = false
  }
}

const generateVoiceReading = async () => {
  if (!aiInterpretation.value) return
  
  try {
    const voiceUrl = await advancedMonicaService.generateVoiceReading({
      text: aiInterpretation.value,
      voice: 'mystical',
      language: 'en',
      speed: 0.9,
      emotion: 'calm'
    })
    
    if (voiceUrl) {
      voiceReading.value = voiceUrl
    }
  } catch (error) {
    console.error('Voice generation failed:', error)
  }
}

const generateAnimation = async () => {
  if (!props.useAIFeatures) return
  
  isLoadingAnimation.value = true
  
  try {
    const animationUrl = await advancedMonicaService.generateCardAnimation(
      props.card.name,
      'mystical'
    )
    
    if (animationUrl) {
      cardAnimation.value = animationUrl
      playAnimation.value = true
    }
  } catch (error) {
    console.error('Animation generation failed:', error)
  } finally {
    isLoadingAnimation.value = false
  }
}

const getWebEnhancedReading = async () => {
  isLoadingWebReading.value = true
  
  try {
    const result = await advancedMonicaService.performWebEnhancedReading(
      [props.card.name],
      'What is the current spiritual significance of this card?'
    )
    
    aiInterpretation.value = result.reading
    confidence.value = 0.9
    aiModel.value = 'Web-Enhanced AI'
    
    emit('interpret', aiInterpretation.value)
  } catch (error) {
    console.error('Web-enhanced reading failed:', error)
  } finally {
    isLoadingWebReading.value = false
  }
}

// Audio controls
const playVoiceReading = () => {
  if (voicePlayer.value && voiceReading.value) {
    voicePlayer.value.play()
    emit('voicePlay', true)
  }
}

const onVoiceEnd = () => {
  emit('voicePlay', false)
}

const onAnimationEnd = () => {
  playAnimation.value = false
}

const onImageLoad = () => {
  // Image loaded successfully
}

const onImageError = () => {
  // Fallback to traditional image
  aiGeneratedImage.value = null
}

// Auto-flip if specified
onMounted(() => {
  if (props.autoFlip) {
    setTimeout(() => {
      flipCard()
    }, 500)
  }
})
</script>

<style scoped>
.enhanced-tarot-card {
  position: relative;
  width: 280px;
  height: 420px;
  perspective: 1000px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.enhanced-tarot-card:hover {
  transform: translateY(-10px);
}

.enhanced-tarot-card.ai-enhanced {
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
}

.enhanced-tarot-card.glowing {
  animation: cardGlow 2s ease-in-out infinite alternate;
}

@keyframes cardGlow {
  0% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5)); }
  100% { filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.8)); }
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.card-back {
  background: linear-gradient(135deg, #1e1b4b, #312e81, #1e40af);
  border: 3px solid #FFD700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-front {
  background: linear-gradient(135deg, #0f172a, #1e293b, #334155);
  border: 3px solid #8B5CF6;
  transform: rotateY(180deg);
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.enhanced-tarot-card.flipped .card-back {
  transform: rotateY(-180deg);
}

.enhanced-tarot-card.flipped .card-front {
  transform: rotateY(0deg);
}

.mystical-pattern {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.sacred-geometry {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.card-back-text {
  font-size: 4rem;
  z-index: 2;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
}

.energy-particles {
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
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; transform: scale(1.5); }
}

.card-image-container {
  position: relative;
  flex: 1;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.ai-card-image,
.traditional-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
}

.ai-card-image {
  border: 2px solid #FFD700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.card-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
  z-index: 3;
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 15px;
  z-index: 4;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 215, 0, 0.3);
  border-top: 4px solid #FFD700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.card-info {
  margin-bottom: 1rem;
}

.card-name {
  color: #FFD700;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.card-number {
  color: #8B5CF6;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.card-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.keyword-tag {
  background: rgba(139, 92, 246, 0.3);
  color: #C4B5FD;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
}

.ai-interpretation {
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 15px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.interpretation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.ai-badge {
  background: linear-gradient(135deg, #06B6D4, #0891B2);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: bold;
}

.voice-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #FFD700;
  transition: transform 0.2s ease;
}

.voice-btn:hover {
  transform: scale(1.2);
}

.interpretation-text {
  color: #E2E8F0;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.confidence-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #10B981, #FFD700);
  transition: width 0.5s ease;
}

.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.action-btn {
  background: linear-gradient(135deg, #8B5CF6, #06B6D4);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.5rem;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(139, 92, 246, 0.4);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-image-btn {
  background: linear-gradient(135deg, #FFD700, #F59E0B);
}

.web-reading-btn {
  background: linear-gradient(135deg, #10B981, #059669);
}

.animation-btn {
  background: linear-gradient(135deg, #EF4444, #DC2626);
}

.special-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.mystical-aura {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border-radius: 30px;
  background: radial-gradient(ellipse at center, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
  animation: auraGlow 3s ease-in-out infinite alternate;
}

@keyframes auraGlow {
  0% { opacity: 0.3; transform: scale(0.95); }
  100% { opacity: 0.7; transform: scale(1.05); }
}

.floating-symbols {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.floating-symbol {
  position: absolute;
  color: #FFD700;
  font-size: 1.5rem;
  animation: floatUp 4s ease-in-out infinite;
}

.floating-symbol:nth-child(1) { left: 10%; animation-delay: 0s; }
.floating-symbol:nth-child(2) { left: 20%; animation-delay: 0.5s; }
.floating-symbol:nth-child(3) { left: 30%; animation-delay: 1s; }
.floating-symbol:nth-child(4) { left: 70%; animation-delay: 1.5s; }
.floating-symbol:nth-child(5) { left: 80%; animation-delay: 2s; }
.floating-symbol:nth-child(6) { left: 90%; animation-delay: 2.5s; }

@keyframes floatUp {
  0% { 
    opacity: 0; 
    transform: translateY(100px) scale(0.5);
  }
  50% { 
    opacity: 1; 
    transform: translateY(-50px) scale(1);
  }
  100% { 
    opacity: 0; 
    transform: translateY(-200px) scale(0.5);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .enhanced-tarot-card {
    width: 240px;
    height: 360px;
  }
  
  .card-actions {
    grid-template-columns: 1fr;
  }
  
  .action-btn {
    font-size: 0.7rem;
    padding: 0.4rem;
  }
}
</style>