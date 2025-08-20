<template>
  <div 
    class="tarot-card" 
    :class="{ 'revealed': revealed, 'selectable': selectable }"
    @click="$emit('card-selected')"
  >
    <div class="card-inner">
      <div class="card-front">
        <img 
          :src="cardImageUrl" 
          :alt="card.name" 
          class="card-image"
          @error="handleImageError"
          @load="handleImageLoad"
        />
        <div class="card-overlay">
          <h3 class="card-name">{{ card.name }}</h3>
          <p class="card-arcana">{{ formatArcana(card.arcana) }}</p>
        </div>
      </div>
      <div class="card-back">
        <div class="card-back-design">
          <div class="sacred-symbol">🌙</div>
          <div class="card-title">Night God Tarot</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TarotCard } from '../types/tarot'

interface Props {
  card: TarotCard
  revealed?: boolean
  selectable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  revealed: true,
  selectable: false
})

const imageError = ref(false)
const imageLoaded = ref(false)

const cardImageUrl = computed(() => {
  if (imageError.value) {
    return createPlaceholderImage()
  }
  return props.card.image
})

function handleImageError() {
  imageError.value = true
  // Card image fallback to placeholder
}

function handleImageLoad() {
  imageLoaded.value = true
  imageError.value = false
}

function createPlaceholderImage(): string {
  // Create a data URL for a placeholder image with card info
  const canvas = document.createElement('canvas')
  canvas.width = 400
  canvas.height = 700
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return ''
  
  // Mystical background
  const gradient = ctx.createLinearGradient(0, 0, 0, 700)
  gradient.addColorStop(0, '#1a1a2e')
  gradient.addColorStop(0.5, '#16213e')
  gradient.addColorStop(1, '#0f0f23')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 400, 700)
  
  // Golden border
  ctx.strokeStyle = '#FFD700'
  ctx.lineWidth = 4
  ctx.strokeRect(10, 10, 380, 680)
  
  // Card name
  ctx.fillStyle = '#FFD700'
  ctx.font = 'bold 28px serif'
  ctx.textAlign = 'center'
  
  const name = props.card.name
  const maxWidth = 340
  const words = name.split(' ')
  let line = ''
  let y = 100
  const lineHeight = 35
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width
    
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, 200, y)
      line = words[n] + ' '
      y += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, 200, y)
  
  // Arcana type
  ctx.font = '20px serif'
  ctx.fillStyle = '#B8860B'
  ctx.fillText(formatArcana(props.card.arcana), 200, y + 50)
  
  // Element (if available)
  if (props.card.element) {
    ctx.font = '18px serif'
    ctx.fillStyle = '#DAA520'
    ctx.fillText(`Element: ${props.card.element}`, 200, y + 80)
  }
  
  // Keywords
  const keywords = props.card.keywords.upright.slice(0, 3).join(' • ')
  ctx.font = '16px serif'
  ctx.fillStyle = '#F0E68C'
  ctx.fillText(keywords, 200, y + 120)
  
  // Mystical symbol
  ctx.font = '80px serif'
  ctx.fillStyle = '#FFD700'
  ctx.fillText('🔮', 200, y + 220)
  
  // Card number/suit info
  let cardInfo = ''
  if (props.card.arcana === 'major') {
    cardInfo = `Major Arcana ${props.card.number !== undefined ? props.card.number : ''}`
  } else if (props.card.suit) {
    cardInfo = `${props.card.suit} ${props.card.number || ''}`
  }
  
  ctx.font = '14px serif'
  ctx.fillStyle = '#B8860B'
  ctx.fillText(cardInfo, 200, 650)
  
  return canvas.toDataURL()
}

function formatArcana(arcana: string): string {
  if (arcana === 'major') return 'Major Arcana'
  if (arcana === 'minor') return 'Minor Arcana'
  return arcana.charAt(0).toUpperCase() + arcana.slice(1)
}

defineEmits<{
  'card-selected': []
}>()
</script>

<style scoped>
.tarot-card {
  @apply relative w-32 h-56 cursor-pointer transition-all duration-500 transform-gpu;
  perspective: 1000px;
}

.tarot-card.selectable:hover {
  @apply scale-105;
}

.card-inner {
  @apply relative w-full h-full transition-transform duration-700;
  transform-style: preserve-3d;
}

.tarot-card.revealed .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  @apply absolute inset-0 rounded-lg overflow-hidden;
  backface-visibility: hidden;
}

.card-front {
  transform: rotateY(180deg);
  @apply bg-gradient-to-b from-gray-900 to-black border border-yellow-400;
}

.card-back {
  @apply bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900 border border-yellow-400;
}

.card-image {
  @apply w-full h-full object-cover;
}

.card-overlay {
  @apply absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2;
}

.card-name {
  @apply text-yellow-400 font-bold text-xs mb-1;
  font-family: 'Cinzel', serif;
}

.card-arcana {
  @apply text-yellow-600 text-xs;
}

.card-back-design {
  @apply flex flex-col items-center justify-center h-full text-center p-4;
}

.sacred-symbol {
  @apply text-6xl mb-4;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
}

.card-title {
  @apply text-yellow-400 font-bold text-sm tracking-wider;
  font-family: 'Cinzel', serif;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

/* Animation for card flip */
@keyframes cardFlip {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
}

.tarot-card.revealing .card-inner {
  animation: cardFlip 0.7s ease-in-out forwards;
}

/* Mystical glow effect */
.tarot-card::before {
  content: '';
  @apply absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300;
  background: linear-gradient(45deg, 
    rgba(255, 215, 0, 0.1) 0%,
    rgba(255, 215, 0, 0) 50%,
    rgba(255, 215, 0, 0.1) 100%);
}

.tarot-card:hover::before {
  @apply opacity-100;
}

/* Sacred geometry overlay */
.card-front::after {
  content: '';
  @apply absolute inset-0 opacity-10;
  background-image: radial-gradient(circle at 50% 50%, 
    transparent 30%, 
    rgba(255, 215, 0, 0.1) 40%, 
    transparent 60%);
}
</style>