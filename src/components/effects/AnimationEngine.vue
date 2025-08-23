<template>
  <div class="animation-engine" ref="animationContainer">
    <!-- Card Reveal Animations -->
    <div 
      v-for="(card, index) in animatedCards" 
      :key="`card-${index}`"
      class="card-animation-wrapper"
      :style="getCardAnimationStyle(card, index)"
    >
      <div 
        class="tarot-card animated-card"
        :class="card.animationClass"
        @animationend="onCardAnimationEnd(index)"
      >
        <div class="card-back" :class="{ flipped: card.revealed }">
          <div class="mystical-pattern"></div>
        </div>
        <div class="card-front" :class="{ revealed: card.revealed }">
          <img :src="card.imageUrl" :alt="card.name" />
          <div class="card-glow" :style="{ '--glow-color': card.glowColor }"></div>
        </div>
      </div>
    </div>

    <!-- Particle Systems -->
    <canvas 
      ref="particleCanvas"
      class="particle-canvas"
      :width="canvasWidth"
      :height="canvasHeight"
    ></canvas>

    <!-- Energy Rings -->
    <div class="energy-rings" v-if="showEnergyRings">
      <div 
        v-for="ring in energyRings" 
        :key="ring.id"
        class="energy-ring"
        :style="ring.style"
      ></div>
    </div>

    <!-- Mystical Symbols -->
    <div class="mystical-symbols" v-if="showMysticalSymbols">
      <div 
        v-for="symbol in mysticalSymbols" 
        :key="symbol.id"
        class="floating-symbol"
        :style="symbol.style"
      >
        {{ symbol.icon }}
      </div>
    </div>

    <!-- Reading Progress Animation -->
    <div class="reading-progress" v-if="showProgress">
      <div class="progress-orb">
        <div class="orb-core" :style="{ '--progress': progressPercent }"></div>
        <div class="orb-rings">
          <div class="progress-ring" v-for="n in 3" :key="n"></div>
        </div>
      </div>
      <div class="progress-text">{{ progressText }}</div>
    </div>

    <!-- Cosmic Background -->
    <div class="cosmic-background" v-if="showCosmicBg">
      <div class="star-field">
        <div 
          v-for="star in stars" 
          :key="star.id"
          class="star"
          :style="star.style"
        ></div>
      </div>
      <div class="nebula-effect"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'

interface AnimatedCard {
  id: string
  name: string
  imageUrl: string
  revealed: boolean
  animationClass: string
  glowColor: string
  position: { x: number; y: number }
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  type: 'sparkle' | 'energy' | 'star' | 'magic'
}

interface AnimationConfig {
  enableCardReveal: boolean
  enableParticles: boolean
  enableEnergyRings: boolean
  enableMysticalSymbols: boolean
  enableCosmicBackground: boolean
  particleCount: number
  animationSpeed: number
}

const props = defineProps<{
  cards?: Array<{ name: string; imageUrl: string }>
  config?: Partial<AnimationConfig>
  trigger?: 'reading' | 'card-draw' | 'result' | 'idle'
  progress?: number
  progressText?: string
}>()

const emit = defineEmits<{
  animationComplete: [type: string]
  cardRevealed: [index: number]
  particleEffect: [effect: string]
}>()

// Refs
const animationContainer = ref<HTMLElement>()
const particleCanvas = ref<HTMLCanvasElement>()
const canvasWidth = ref(window.innerWidth)
const canvasHeight = ref(window.innerHeight)

// Reactive data
const animatedCards = ref<AnimatedCard[]>([])
const particles = ref<Particle[]>([])
const energyRings = ref<Array<any>>([])
const mysticalSymbols = ref<Array<any>>([])
const stars = ref<Array<any>>([])

const showEnergyRings = ref(false)
const showMysticalSymbols = ref(false)
const showProgress = ref(false)
const showCosmicBg = ref(false)

// Animation state
let animationFrame: number
let particleContext: CanvasRenderingContext2D | null = null

// Default config
const defaultConfig: AnimationConfig = {
  enableCardReveal: true,
  enableParticles: true,
  enableEnergyRings: true,
  enableMysticalSymbols: true,
  enableCosmicBackground: true,
  particleCount: 100,
  animationSpeed: 1
}

const config = computed(() => ({
  ...defaultConfig,
  ...props.config
}))

const progressPercent = computed(() => props.progress || 0)

// Initialize animations
onMounted(async () => {
  await nextTick()
  initializeCanvas()
  initializeStarField()
  
  if (props.trigger === 'reading') {
    startReadingAnimation()
  } else if (props.trigger === 'card-draw') {
    startCardDrawAnimation()
  } else if (props.trigger === 'result') {
    startResultAnimation()
  } else {
    startIdleAnimation()
  }
  
  startAnimationLoop()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  window.removeEventListener('resize', onResize)
})

// Canvas initialization
const initializeCanvas = () => {
  const canvas = particleCanvas.value
  if (!canvas) return
  
  particleContext = canvas.getContext('2d')
  updateCanvasSize()
}

const updateCanvasSize = () => {
  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight
}

const onResize = () => {
  updateCanvasSize()
}

// Star field initialization
const initializeStarField = () => {
  const starCount = 200
  stars.value = Array.from({ length: starCount }, (_, i) => ({
    id: `star-${i}`,
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 4}s`,
      '--star-size': `${1 + Math.random() * 3}px`
    }
  }))
}

// Animation triggers
const startReadingAnimation = async () => {
  showProgress.value = true
  showCosmicBg.value = true
  
  // Generate energy particles
  if (config.value.enableParticles) {
    generateParticles('reading-start', 50)
  }
  
  // Show energy rings
  if (config.value.enableEnergyRings) {
    showEnergyRings.value = true
    generateEnergyRings()
  }
  
  emit('animationComplete', 'reading-start')
}

const startCardDrawAnimation = async () => {
  if (!props.cards?.length) return
  
  showCosmicBg.value = true
  
  // Initialize cards
  animatedCards.value = props.cards.map((card, index) => ({
    id: `animated-card-${index}`,
    name: card.name,
    imageUrl: card.imageUrl,
    revealed: false,
    animationClass: 'card-entering',
    glowColor: getCardGlowColor(card.name),
    position: getCardPosition(index, props.cards!.length)
  }))
  
  // Animate cards with stagger
  for (let i = 0; i < animatedCards.value.length; i++) {
    setTimeout(() => {
      revealCard(i)
    }, i * 300)
  }
  
  // Particle burst
  setTimeout(() => {
    generateParticles('card-reveal', 30)
  }, 500)
}

const startResultAnimation = () => {
  showMysticalSymbols.value = true
  generateMysticalSymbols()
  generateParticles('result', 75)
  
  setTimeout(() => {
    emit('animationComplete', 'result')
  }, 2000)
}

const startIdleAnimation = () => {
  showCosmicBg.value = true
  
  // Gentle particle flow
  setInterval(() => {
    generateParticles('idle', 5)
  }, 2000)
}

// Card animations
const revealCard = (index: number) => {
  if (index >= animatedCards.value.length) return
  
  const card = animatedCards.value[index]
  card.animationClass = 'card-revealing'
  card.revealed = true
  
  // Generate sparkle particles around card
  generateCardSparkles(card.position.x, card.position.y)
  
  setTimeout(() => {
    card.animationClass = 'card-revealed'
    emit('cardRevealed', index)
  }, 600)
}

const onCardAnimationEnd = (index: number) => {
  if (index >= animatedCards.value.length) return
  animatedCards.value[index].animationClass = 'card-idle'
}

const getCardPosition = (index: number, total: number) => {
  const angle = (index / total) * Math.PI * 2
  const radius = 200
  const centerX = canvasWidth.value / 2
  const centerY = canvasHeight.value / 2
  
  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius
  }
}

const getCardAnimationStyle = (card: AnimatedCard, index: number) => ({
  '--card-x': `${card.position.x}px`,
  '--card-y': `${card.position.y}px`,
  '--reveal-delay': `${index * 0.1}s`,
  '--glow-color': card.glowColor
})

const getCardGlowColor = (cardName: string) => {
  const glowColors = {
    'Major Arcana': '#9333ea',
    'Cups': '#3b82f6',
    'Wands': '#ef4444',
    'Swords': '#10b981',
    'Pentacles': '#f59e0b',
    'default': '#8b5cf6'
  }
  
  // Determine color based on card name/type
  if (cardName.includes('Cup')) return glowColors.Cups
  if (cardName.includes('Wand')) return glowColors.Wands
  if (cardName.includes('Sword')) return glowColors.Swords
  if (cardName.includes('Pentacle')) return glowColors.Pentacles
  
  return glowColors.default
}

// Particle system
const generateParticles = (type: string, count: number) => {
  const newParticles: Particle[] = []
  
  for (let i = 0; i < count; i++) {
    const particle: Particle = {
      x: Math.random() * canvasWidth.value,
      y: Math.random() * canvasHeight.value,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1,
      maxLife: 60 + Math.random() * 120,
      size: 1 + Math.random() * 4,
      color: getParticleColor(type),
      type: type as Particle['type']
    }
    
    newParticles.push(particle)
  }
  
  particles.value.push(...newParticles)
  emit('particleEffect', type)
}

const generateCardSparkles = (x: number, y: number) => {
  const sparkleCount = 20
  
  for (let i = 0; i < sparkleCount; i++) {
    const angle = (i / sparkleCount) * Math.PI * 2
    const speed = 2 + Math.random() * 3
    
    particles.value.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 30,
      size: 2 + Math.random() * 3,
      color: '#fbbf24',
      type: 'sparkle'
    })
  }
}

const getParticleColor = (type: string) => {
  const colors = {
    'reading-start': '#8b5cf6',
    'card-reveal': '#fbbf24',
    'result': '#10b981',
    'idle': '#6366f1'
  }
  return colors[type as keyof typeof colors] || '#8b5cf6'
}

// Energy rings
const generateEnergyRings = () => {
  energyRings.value = Array.from({ length: 3 }, (_, i) => ({
    id: `ring-${i}`,
    style: {
      '--ring-delay': `${i * 0.5}s`,
      '--ring-size': `${200 + i * 100}px`,
      '--ring-opacity': (3 - i) * 0.3
    }
  }))
}

// Mystical symbols
const generateMysticalSymbols = () => {
  const symbols = ['✦', '✧', '⟡', '◈', '◊', '⬟', '⬢', '⬡']
  mysticalSymbols.value = Array.from({ length: 12 }, (_, i) => ({
    id: `symbol-${i}`,
    icon: symbols[i % symbols.length],
    style: {
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      '--float-delay': `${Math.random() * 3}s`,
      '--float-duration': `${3 + Math.random() * 4}s`,
      '--symbol-size': `${1.5 + Math.random() * 2}rem`
    }
  }))
}

// Animation loop
const startAnimationLoop = () => {
  const animate = () => {
    updateParticles()
    renderParticles()
    animationFrame = requestAnimationFrame(animate)
  }
  animate()
}

const updateParticles = () => {
  particles.value = particles.value.filter(particle => {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.life = Math.max(0, particle.life - 1/particle.maxLife)
    
    // Apply gravity for sparkles
    if (particle.type === 'sparkle') {
      particle.vy += 0.1
    }
    
    // Fade out
    return particle.life > 0
  })
}

const renderParticles = () => {
  if (!particleContext) return
  
  particleContext.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  
  particles.value.forEach(particle => {
    particleContext!.save()
    
    particleContext!.globalAlpha = particle.life
    particleContext!.fillStyle = particle.color
    
    particleContext!.beginPath()
    particleContext!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    particleContext!.fill()
    
    // Add glow effect
    particleContext!.shadowBlur = 10
    particleContext!.shadowColor = particle.color
    
    particleContext!.restore()
  })
}
</script>

<style scoped>
.animation-engine {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

/* Card Animations */
.card-animation-wrapper {
  position: absolute;
  top: var(--card-y);
  left: var(--card-x);
  transform: translate(-50%, -50%);
  perspective: 1000px;
}

.animated-card {
  width: 120px;
  height: 200px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.card-back, .card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  backface-visibility: hidden;
  overflow: hidden;
}

.card-back {
  background: linear-gradient(135deg, #1e1b4b, #3730a3);
  border: 2px solid var(--glow-color, #8b5cf6);
  transform: rotateY(0deg);
}

.card-back.flipped {
  transform: rotateY(180deg);
}

.card-front {
  transform: rotateY(180deg);
  background: white;
  border: 2px solid var(--glow-color, #8b5cf6);
}

.card-front.revealed {
  transform: rotateY(0deg);
}

.card-front img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.mystical-pattern {
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
    conic-gradient(from 0deg, #8b5cf6, #fbbf24, #8b5cf6);
  opacity: 0.6;
}

.card-glow {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 16px;
  background: linear-gradient(45deg, var(--glow-color), transparent, var(--glow-color));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

/* Animation classes */
.card-entering {
  animation: cardEntering 0.8s ease-out forwards;
  animation-delay: var(--reveal-delay);
}

.card-revealing {
  animation: cardRevealing 0.6s ease-out forwards;
}

.card-revealed .card-glow {
  opacity: 0.6;
  animation: glowPulse 2s ease-in-out infinite;
}

.card-idle {
  animation: cardIdle 4s ease-in-out infinite;
}

@keyframes cardEntering {
  0% {
    transform: translateY(-100vh) rotateZ(45deg);
    opacity: 0;
  }
  70% {
    transform: translateY(10px) rotateZ(-5deg);
    opacity: 1;
  }
  100% {
    transform: translateY(0) rotateZ(0deg);
    opacity: 1;
  }
}

@keyframes cardRevealing {
  0% {
    transform: rotateY(0deg) scale(1);
  }
  50% {
    transform: rotateY(90deg) scale(1.1);
  }
  100% {
    transform: rotateY(180deg) scale(1);
  }
}

@keyframes cardIdle {
  0%, 100% {
    transform: translateY(0) rotateZ(0deg);
  }
  25% {
    transform: translateY(-5px) rotateZ(1deg);
  }
  75% {
    transform: translateY(5px) rotateZ(-1deg);
  }
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.6;
    filter: brightness(1);
  }
  50% {
    opacity: 0.9;
    filter: brightness(1.2);
  }
}

/* Energy Rings */
.energy-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.energy-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: var(--ring-size);
  height: var(--ring-size);
  border: 2px solid rgba(139, 92, 246, var(--ring-opacity));
  border-radius: 50%;
  animation: energyRingExpand 2s ease-out infinite;
  animation-delay: var(--ring-delay);
}

@keyframes energyRingExpand {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

/* Mystical Symbols */
.mystical-symbols {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.floating-symbol {
  position: absolute;
  font-size: var(--symbol-size);
  color: rgba(251, 191, 36, 0.7);
  text-shadow: 0 0 10px currentColor;
  animation: floatUpDown var(--float-duration) ease-in-out infinite;
  animation-delay: var(--float-delay);
}

@keyframes floatUpDown {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.7;
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
    opacity: 1;
  }
  75% {
    transform: translateY(20px) rotate(-90deg);
    opacity: 0.5;
  }
}

/* Reading Progress */
.reading-progress {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-orb {
  width: 120px;
  height: 120px;
  position: relative;
  margin: 0 auto 20px;
}

.orb-core {
  width: 80px;
  height: 80px;
  background: conic-gradient(
    from 0deg,
    #8b5cf6 0deg,
    #8b5cf6 calc(var(--progress) * 3.6deg),
    rgba(139, 92, 246, 0.2) calc(var(--progress) * 3.6deg),
    rgba(139, 92, 246, 0.2) 360deg
  );
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: orbRotate 3s linear infinite;
}

.progress-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 50%;
  animation: ringPulse 2s ease-in-out infinite;
}

.progress-ring:nth-child(1) {
  width: 100px;
  height: 100px;
  animation-delay: 0s;
}

.progress-ring:nth-child(2) {
  width: 110px;
  height: 110px;
  animation-delay: 0.5s;
}

.progress-ring:nth-child(3) {
  width: 120px;
  height: 120px;
  animation-delay: 1s;
}

.progress-text {
  color: white;
  font-size: 1.1rem;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.8);
  font-weight: 500;
}

@keyframes orbRotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes ringPulse {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

/* Cosmic Background */
.cosmic-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at top, rgba(30, 27, 75, 0.8) 0%, transparent 70%),
    radial-gradient(ellipse at bottom, rgba(55, 48, 163, 0.6) 0%, transparent 70%),
    radial-gradient(ellipse at center, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
}

.star-field {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  width: var(--star-size);
  height: var(--star-size);
  background: white;
  border-radius: 50%;
  animation: starTwinkle var(--star-duration) ease-in-out infinite;
  animation-delay: var(--star-delay);
}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.nebula-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse 800px 600px at 25% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse 600px 800px at 75% 75%, rgba(251, 191, 36, 0.1) 0%, transparent 50%);
  animation: nebulaFlow 20s ease-in-out infinite;
}

@keyframes nebulaFlow {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .animated-card {
    width: 80px;
    height: 133px;
  }
  
  .progress-orb {
    width: 100px;
    height: 100px;
  }
  
  .orb-core {
    width: 60px;
    height: 60px;
  }
  
  .floating-symbol {
    font-size: calc(var(--symbol-size) * 0.8);
  }
}
</style>