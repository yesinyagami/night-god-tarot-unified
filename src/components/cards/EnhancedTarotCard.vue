<template>
  <div class="enhanced-card-universe" :class="{ 'reading-active': isReading }">
    <!-- Card Container with 3D Perspective -->
    <div class="card-perspective" @click="handleCardClick">
      <div 
        class="tarot-card-enhanced" 
        :class="{ 
          flipped: isFlipped, 
          selected: isSelected,
          mystical: cardData.rarity === 'epic',
          legendary: cardData.rarity === 'legendary',
          divine: cardData.rarity === 'mythic'
        }"
        :style="cardTransformStyle"
      >
        <!-- Card Front (Hidden State) -->
        <div class="card-face card-front">
          <div class="card-mystical-pattern">
            <div class="pattern-rings">
              <div class="ring primary"></div>
              <div class="ring secondary"></div>
              <div class="ring tertiary"></div>
            </div>
          </div>
          <div class="card-icon">🔮</div>
          <div class="card-energy-flow"></div>
        </div>

        <!-- Card Back (Revealed State) -->
        <div class="card-face card-back">
          <div class="card-content">
            <!-- Card Header -->
            <div class="card-header">
              <div class="card-number" v-if="cardData.number">{{ cardData.number }}</div>
              <div class="card-suit" v-if="cardData.suit">{{ getSuitIcon(cardData.suit) }}</div>
              <div class="card-rarity-badge" :class="cardData.rarity">
                {{ getRarityIcon(cardData.rarity || 'common') }}
              </div>
            </div>

            <!-- Card Image -->
            <div class="card-image-container">
              <img 
                :src="cardImageUrl" 
                :alt="cardData.name"
                class="card-image"
                @load="onImageLoad"
                @error="onImageError"
              />
              <div class="image-overlay" :class="cardData.rarity"></div>
            </div>

            <!-- Card Title -->
            <div class="card-title-section">
              <h3 class="card-name">{{ cardData.name }}</h3>
              <p class="card-name-en" v-if="cardData.name">{{ cardData.name }}</p>
            </div>

            <!-- Card Keywords -->
            <div class="card-keywords">
              <span 
                v-for="keyword in displayKeywords" 
                :key="keyword"
                class="keyword-tag"
              >
                {{ keyword }}
              </span>
            </div>

            <!-- Card Meaning (Brief) -->
            <div class="card-meaning-brief" v-if="showMeaning">
              <p>{{ briefMeaning }}</p>
            </div>
          </div>

          <!-- Card Aura Effect -->
          <div class="card-aura" :class="cardData.rarity"></div>
        </div>
      </div>
    </div>

    <!-- Card Information Tooltip -->
    <div v-if="showTooltip && isFlipped" class="card-tooltip" :style="tooltipPosition">
      <div class="tooltip-content">
        <h4>{{ cardData.name }}</h4>
        <div class="tooltip-stats">
          <div class="stat">
            <span class="label">Element:</span>
            <span class="value">{{ getCardElement(cardData) }}</span>
          </div>
          <div class="stat">
            <span class="label">Energy:</span>
            <span class="value">{{ getCardEnergy(cardData) }}</span>
          </div>
        </div>
        <p class="tooltip-description">{{ cardData.description }}</p>
      </div>
    </div>

    <!-- Particle Effects -->
    <div v-if="isFlipped" class="card-particles">
      <div 
        v-for="i in particleCount" 
        :key="i"
        class="particle"
        :style="getParticleStyle(i)"
      >
        {{ getParticleIcon(i) }}
      </div>
    </div>

    <!-- Selection Ring -->
    <div v-if="isSelected" class="selection-ring">
      <div class="ring-pulse"></div>
    </div>

    <!-- Card Level Display -->
    <div v-if="showLevel && cardLevel > 0" class="card-level">
      <div class="level-stars">
        <span 
          v-for="star in maxLevel" 
          :key="star"
          class="star"
          :class="{ active: star <= cardLevel, pulsing: star === cardLevel }"
        >
          ⭐
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { TarotCard } from '@/types/tarot'

interface Props {
  cardData: TarotCard
  isFlipped?: boolean
  isSelected?: boolean
  isReading?: boolean
  showMeaning?: boolean
  showLevel?: boolean
  showTooltip?: boolean
  size?: 'small' | 'medium' | 'large' | 'xl'
  interactive?: boolean
  cardLevel?: number
  maxLevel?: number
}

const props = withDefaults(defineProps<Props>(), {
  isFlipped: false,
  isSelected: false,
  isReading: false,
  showMeaning: true,
  showLevel: false,
  showTooltip: false,
  size: 'medium',
  interactive: true,
  cardLevel: 0,
  maxLevel: 5
})

const emit = defineEmits<{
  cardClick: [card: TarotCard]
  cardHover: [card: TarotCard]
  cardFlip: [card: TarotCard, flipped: boolean]
}>()

// State
const isHovering = ref(false)
const tooltipPosition = ref({ top: '0px', left: '0px' })
const particleCount = ref(6)
const mouseX = ref(0)
const mouseY = ref(0)

// Computed Properties
const cardImageUrl = computed(() => {
  return `/src/assets/cards/${props.cardData.id.toString().padStart(2, '0')}_${props.cardData.name.replace(/\s+/g, '_')}.png`
})

const displayKeywords = computed(() => {
  if (props.cardData.keywords && typeof props.cardData.keywords === 'object') {
    return props.cardData.keywords.upright?.slice(0, 3) || []
  }
  return []
})

const briefMeaning = computed(() => {
  if (props.cardData.description.length > 100) {
    return props.cardData.description.substring(0, 100) + '...'
  }
  return props.cardData.description
})

const cardTransformStyle = computed(() => {
  if (!props.interactive || !isHovering.value) return {}
  
  const rotateX = (mouseY.value - 0.5) * 20
  const rotateY = (mouseX.value - 0.5) * -20
  
  return {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(50px)`
  }
})

// Methods
const handleCardClick = () => {
  if (!props.interactive) return
  
  emit('cardClick', props.cardData)
  emit('cardFlip', props.cardData, !props.isFlipped)
  
  // Trigger card flip animation
  triggerFlipAnimation()
}

const handleMouseMove = (event: MouseEvent) => {
  if (event.currentTarget) {
    const rect = (event.currentTarget as Element).getBoundingClientRect()
    mouseX.value = (event.clientX - rect.left) / rect.width
    mouseY.value = (event.clientY - rect.top) / rect.height
  }
}

const handleMouseEnter = () => {
  isHovering.value = true
  emit('cardHover', props.cardData)
}

const handleMouseLeave = () => {
  isHovering.value = false
  mouseX.value = 0.5
  mouseY.value = 0.5
}

const triggerFlipAnimation = () => {
  // Add special flip effects based on card rarity
  const rarityEffects = {
    common: () => createSparkles(3),
    rare: () => createSparkles(5),
    mystical: () => createMysticalEffect(),
    legendary: () => createLegendaryEffect(),
    divine: () => createDivineEffect()
  }
  
  const rarity = props.cardData.rarity || 'common'
  const effect = rarityEffects[rarity as keyof typeof rarityEffects] || rarityEffects.common
  effect()
}

const createSparkles = (count: number) => {
  // Create sparkle particles
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const sparkle = document.createElement('div')
      sparkle.className = 'card-sparkle'
      sparkle.style.left = Math.random() * 100 + '%'
      sparkle.style.top = Math.random() * 100 + '%'
      sparkle.textContent = '✨'
      
      document.querySelector('.enhanced-card-universe')?.appendChild(sparkle)
      
      setTimeout(() => sparkle.remove(), 1000)
    }, i * 100)
  }
}

const createMysticalEffect = () => {
  createSparkles(8)
  // Add mystical circle effect
  const circle = document.createElement('div')
  circle.className = 'mystical-circle'
  document.querySelector('.enhanced-card-universe')?.appendChild(circle)
  setTimeout(() => circle.remove(), 2000)
}

const createLegendaryEffect = () => {
  createSparkles(12)
  // Add golden aura
  const aura = document.createElement('div')
  aura.className = 'legendary-aura'
  document.querySelector('.enhanced-card-universe')?.appendChild(aura)
  setTimeout(() => aura.remove(), 3000)
}

const createDivineEffect = () => {
  createSparkles(20)
  // Add divine light beam
  const beam = document.createElement('div')
  beam.className = 'divine-beam'
  document.querySelector('.enhanced-card-universe')?.appendChild(beam)
  setTimeout(() => beam.remove(), 4000)
}

const getSuitIcon = (suit: string): string => {
  const icons: Record<string, string> = {
    wands: '🪄',
    cups: '🍷',
    swords: '⚔️',
    pentacles: '🪙',
    major: '🌟'
  }
  return icons[suit] || '🎴'
}

const getRarityIcon = (rarity: string): string => {
  const icons: Record<string, string> = {
    common: '⚪',
    rare: '🔵',
    epic: '🟣',
    legendary: '🟡',
    mythic: '⭐'
  }
  return icons[rarity] || '⚪'
}

const getCardElement = (card: TarotCard): string => {
  // Determine elemental association
  if (card.suit) {
    const elements = {
      wands: 'Fire 🔥',
      cups: 'Water 🌊',
      swords: 'Air 💨',
      pentacles: 'Earth 🌍'
    }
    return elements[card.suit] || 'Spirit ✨'
  }
  return 'Spirit ✨'
}

const getCardEnergy = (card: TarotCard): string => {
  // Calculate energy based on card properties
  const energy = ['High ⚡', 'Medium ⭐', 'Calm 🌙']
  return energy[Math.floor(Math.random() * energy.length)]
}

const getParticleStyle = (index: number) => {
  const angle = (index / particleCount.value) * 360
  const radius = 80 + Math.random() * 40
  const x = Math.cos(angle * Math.PI / 180) * radius
  const y = Math.sin(angle * Math.PI / 180) * radius
  
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    animationDelay: `${index * 0.2}s`,
    animationDuration: `${2 + Math.random()}s`
  }
}

const getParticleIcon = (index: number): string => {
  const icons = ['✨', '🌟', '⭐', '💫', '🌠', '✦']
  return icons[index % icons.length]
}

const onImageLoad = () => {
  console.log('Card image loaded successfully')
}

const onImageError = () => {
  console.warn('Failed to load card image:', cardImageUrl.value)
}

// Lifecycle
onMounted(() => {
  const cardElement = document.querySelector('.enhanced-card-universe')
  if (cardElement && props.interactive) {
    cardElement.addEventListener('mousemove', handleMouseMove as EventListener)
    cardElement.addEventListener('mouseenter', handleMouseEnter)
    cardElement.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  const cardElement = document.querySelector('.enhanced-card-universe')
  if (cardElement && props.interactive) {
    cardElement.removeEventListener('mousemove', handleMouseMove as EventListener)
    cardElement.removeEventListener('mouseenter', handleMouseEnter)
    cardElement.removeEventListener('mouseleave', handleMouseLeave)
  }
})
</script>

<style scoped>
/* Enhanced Tarot Card Styles */
.enhanced-card-universe {
  position: relative;
  display: inline-block;
  margin: 1rem;
}

/* 3D Perspective Container */
.card-perspective {
  perspective: 1000px;
  width: 240px;
  height: 360px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.card-perspective:hover {
  transform: scale(1.05);
}

/* Enhanced Tarot Card */
.tarot-card-enhanced {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(255, 215, 0, 0.2);
}

.tarot-card-enhanced.flipped {
  transform: rotateY(180deg);
}

.tarot-card-enhanced.selected {
  animation: cardPulse 2s infinite;
}

.tarot-card-enhanced.mystical {
  box-shadow: 
    0 10px 30px rgba(139, 92, 246, 0.4),
    0 0 30px rgba(139, 92, 246, 0.3);
}

.tarot-card-enhanced.legendary {
  box-shadow: 
    0 10px 30px rgba(255, 215, 0, 0.5),
    0 0 40px rgba(255, 215, 0, 0.4);
}

.tarot-card-enhanced.divine {
  box-shadow: 
    0 15px 40px rgba(255, 255, 255, 0.3),
    0 0 50px rgba(255, 215, 0, 0.5),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
}

/* Card Faces */
.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Card Front (Hidden State) */
.card-front {
  background: 
    radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%),
    linear-gradient(135deg, #1a0033 0%, #4a0e4e  100%);
  border: 2px solid rgba(255, 215, 0, 0.3);
  position: relative;
}

.card-mystical-pattern {
  position: absolute;
  width: 180px;
  height: 180px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.pattern-rings {
  position: relative;
  width: 100%;
  height: 100%;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: rotateRing 20s linear infinite;
}

.ring.primary {
  width: 80%;
  height: 80%;
  border-width: 2px;
}

.ring.secondary {
  width: 60%;
  height: 60%;
  border-color: rgba(255, 215, 0, 0.2);
  animation-duration: 15s;
  animation-direction: reverse;
}

.ring.tertiary {
  width: 40%;
  height: 40%;
  border-color: rgba(255, 215, 0, 0.1);
  animation-duration: 10s;
}

.card-icon {
  font-size: 3rem;
  z-index: 10;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
  animation: iconGlow 3s ease-in-out infinite;
}

.card-energy-flow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(255, 215, 0, 0.05) 70%, transparent 100%);
  animation: energyFlow 4s ease-in-out infinite;
}

/* Card Back (Revealed State) */
.card-back {
  background: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%),
    linear-gradient(225deg, #1a0033 0%, #4a0e4e 50%, #81689d 100%);
  border: 2px solid rgba(255, 215, 0, 0.5);
  transform: rotateY(180deg);
  padding: 1rem;
  backdrop-filter: blur(10px);
}

/* Card Content */
.card-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.card-number {
  background: rgba(255, 215, 0, 0.9);
  color: #1a0033;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
}

.card-suit {
  font-size: 1.25rem;
}

.card-rarity-badge {
  padding: 0.25rem;
  border-radius: 50%;
  font-size: 0.875rem;
}

.card-rarity-badge.common { background: rgba(255, 255, 255, 0.2); }
.card-rarity-badge.rare { background: rgba(59, 130, 246, 0.3); }
.card-rarity-badge.mystical { background: rgba(139, 92, 246, 0.3); }
.card-rarity-badge.legendary { background: rgba(255, 215, 0, 0.3); }
.card-rarity-badge.divine { background: rgba(255, 255, 255, 0.3); }

/* Card Image */
.card-image-container {
  flex: 1;
  position: relative;
  width: 100%;
  margin: 0.5rem 0;
  border-radius: 8px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.1;
  transition: opacity 0.3s ease;
}

.image-overlay.mystical {
  background: linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.3), transparent);
}

.image-overlay.legendary {
  background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.4), transparent);
}

.image-overlay.divine {
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

/* Card Title */
.card-title-section {
  text-align: center;
  margin: 0.5rem 0;
}

.card-name {
  font-size: 1rem;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 0.25rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.card-name-en {
  font-size: 0.75rem;
  opacity: 0.7;
  font-style: italic;
}

/* Keywords */
.card-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: center;
  margin: 0.5rem 0;
}

.keyword-tag {
  background: rgba(255, 215, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.4);
  padding: 0.125rem 0.375rem;
  border-radius: 12px;
  font-size: 0.625rem;
  color: #ffd700;
}

/* Card Meaning */
.card-meaning-brief {
  font-size: 0.75rem;
  opacity: 0.8;
  text-align: center;
  line-height: 1.3;
  margin-top: auto;
}

/* Card Aura */
.card-aura {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 20px;
  opacity: 0.3;
  z-index: -1;
}

.card-aura.mystical {
  background: linear-gradient(45deg, #8b5cf6, transparent, #8b5cf6);
  animation: auraFlow 3s ease-in-out infinite;
}

.card-aura.legendary {
  background: linear-gradient(45deg, #ffd700, transparent, #ffd700);
  animation: auraFlow 2s ease-in-out infinite;
}

.card-aura.divine {
  background: linear-gradient(45deg, #ffffff, #ffd700, #ffffff);
  animation: auraFlow 4s ease-in-out infinite;
}

/* Tooltip */
.card-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  max-width: 250px;
  z-index: 1000;
  font-size: 0.875rem;
}

.tooltip-content h4 {
  color: #ffd700;
  margin-bottom: 0.5rem;
}

.tooltip-stats {
  margin: 0.5rem 0;
}

.stat {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.stat .label {
  opacity: 0.7;
}

.stat .value {
  color: #ffd700;
}

/* Particles */
.card-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
}

.particle {
  position: absolute;
  font-size: 1rem;
  opacity: 0.7;
  animation: floatParticle 3s ease-in-out infinite;
}

/* Selection Ring */
.selection-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 3px solid #ffd700;
  border-radius: 24px;
  z-index: 5;
}

.ring-pulse {
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border: 1px solid rgba(255, 215, 0, 0.5);
  border-radius: 30px;
  animation: ringPulse 2s ease-in-out infinite;
}

/* Card Level */
.card-level {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
}

.level-stars {
  display: flex;
  gap: 0.125rem;
}

.star {
  font-size: 0.75rem;
  opacity: 0.3;
  transition: all 0.3s ease;
}

.star.active {
  opacity: 1;
  filter: drop-shadow(0 0 4px #ffd700);
}

.star.pulsing {
  animation: starPulse 1s ease-in-out infinite;
}

/* Animations */
@keyframes rotateRing {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes iconGlow {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5)); }
  50% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); }
}

@keyframes energyFlow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

@keyframes cardPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes auraFlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

@keyframes floatParticle {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
  50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

@keyframes starPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* Effect Animations */
.card-sparkle {
  position: absolute;
  font-size: 1rem;
  pointer-events: none;
  z-index: 30;
  animation: sparkleEffect 1s ease-out forwards;
}

.mystical-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  border: 2px solid rgba(139, 92, 246, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 25;
  animation: mysticalExpand 2s ease-out forwards;
}

.legendary-aura {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  animation: legendaryGlow 3s ease-out forwards;
}

.divine-beam {
  position: absolute;
  top: -50px;
  left: 50%;
  width: 4px;
  height: 500px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), transparent);
  transform: translateX(-50%);
  z-index: 25;
  animation: divineDescend 4s ease-out forwards;
}

@keyframes sparkleEffect {
  0% { transform: scale(0) rotate(0deg); opacity: 1; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
  100% { transform: scale(0) rotate(360deg); opacity: 0; }
}

@keyframes mysticalExpand {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}

@keyframes legendaryGlow {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}

@keyframes divineDescend {
  0% { transform: translateX(-50%) translateY(-100px) scale(0); opacity: 1; }
  50% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.8; }
  100% { transform: translateX(-50%) translateY(50px) scale(1); opacity: 0; }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .card-perspective {
    width: 200px;
    height: 300px;
  }
  
  .card-name {
    font-size: 0.875rem;
  }
  
  .card-meaning-brief {
    font-size: 0.625rem;
  }
}
</style>