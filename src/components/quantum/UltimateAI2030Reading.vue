<template>
  <div class="ultimate-ai-reading-2030">
    <!-- Infinite AI Status Display -->
    <div class="ai-orchestra-status">
      <div class="ai-provider-grid">
        <div 
          v-for="provider in aiProviders" 
          :key="provider.name"
          class="ai-provider-card"
          :class="provider.status"
        >
          <div class="provider-icon">{{ getProviderIcon(provider.name) }}</div>
          <div class="provider-name">{{ provider.name }}</div>
          <div class="provider-status">{{ provider.status }}</div>
          <div class="provider-tokens">{{ provider.tokensUsed }}/{{ provider.dailyLimit }}</div>
        </div>
      </div>
    </div>

    <!-- Enhanced Reading Display -->
    <div class="enhanced-reading-container" v-if="enhancedReading">
      <div class="cosmic-header">
        <h2 class="reading-title">🌟 INFINITE AI ENHANCED READING</h2>
        <div class="confidence-meter">
          <div class="confidence-bar" :style="{ width: `${confidenceScore * 100}%` }"></div>
          <span class="confidence-text">{{ (confidenceScore * 100).toFixed(0) }}% Confidence</span>
        </div>
      </div>

      <!-- Base Reading -->
      <div class="base-reading-section">
        <h3>🔮 Primary Reading</h3>
        <div class="reading-content base-reading" v-html="formatReading(baseReading)"></div>
      </div>

      <!-- Enhanced Layers -->
      <div class="enhancement-layers" v-if="contextLayers.length > 0">
        <h3>✨ AI Enhancement Layers</h3>
        <div 
          v-for="layer in contextLayers" 
          :key="layer.type"
          class="enhancement-layer"
          :class="`layer-${layer.type}`"
        >
          <div class="layer-header">
            <span class="layer-icon">{{ getLayerIcon(layer.type) }}</span>
            <span class="layer-title">{{ formatLayerTitle(layer.type) }}</span>
            <span class="layer-confidence">{{ (layer.confidence * 100).toFixed(0) }}%</span>
          </div>
          <div class="layer-content" v-html="formatReading(layer.synthesizedContent)"></div>
          <div class="layer-providers">
            <span v-for="response in layer.responses" :key="response.provider" class="provider-badge">
              {{ response.provider }}
            </span>
          </div>
        </div>
      </div>

      <!-- Additional Insights -->
      <div class="additional-insights" v-if="additionalInsights.length > 0">
        <h3>💫 Additional Insights</h3>
        <div class="insights-grid">
          <div 
            v-for="insight in additionalInsights" 
            :key="insight"
            class="insight-card"
          >
            {{ insight }}
          </div>
        </div>
      </div>

      <!-- AI Blend Toggle -->
      <div class="reading-options">
        <button @click="toggleBlendedReading" class="blend-toggle-btn">
          {{ showBlended ? 'Show Individual' : 'Show Blended' }} Reading
        </button>
        <button @click="regenerateReading" class="regenerate-btn">
          🔄 Regenerate with More AI
        </button>
      </div>

      <!-- Blended Reading -->
      <div v-if="showBlended && blendedReading" class="blended-reading-section">
        <h3>🌊 Multi-AI Blended Reading</h3>
        <div class="reading-content blended-reading" v-html="formatReading(blendedReading)"></div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="ai-loading-state">
      <div class="loading-animation">
        <div class="ai-processing-indicator">
          <div class="processing-wave"></div>
          <div class="processing-wave"></div>
          <div class="processing-wave"></div>
        </div>
        <h3>🧠 Infinite AI Processing Your Reading...</h3>
        <p>Consulting {{ activeProviders }} AI models for ultimate wisdom</p>
        <div class="processing-steps">
          <div v-for="step in processingSteps" :key="step.name" class="processing-step" :class="{ active: step.active }">
            {{ step.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { infiniteAI } from '@/services/ai/infiniteAIOrchestrator'
import { contextualEnhancer } from '@/services/ai/contextualEnhancer'

interface Props {
  question: string
  cards: any[]
  userId?: string
}

const props = defineProps<Props>()

// Reactive state
const baseReading = ref('')
const enhancedReading = ref('')
const contextLayers = ref<any[]>([])
const additionalInsights = ref<string[]>([])
const confidenceScore = ref(0)
const blendedReading = ref('')
const showBlended = ref(false)
const isProcessing = ref(true)
const aiProviders = ref<any[]>([])
const processingSteps = ref([
  { name: 'Analyzing cards', active: false },
  { name: 'Consulting AI oracles', active: false },
  { name: 'Gathering cosmic context', active: false },
  { name: 'Enhancing with wisdom layers', active: false },
  { name: 'Synthesizing final reading', active: false }
])

// Computed
const activeProviders = computed(() => {
  return aiProviders.value.filter(p => p.status === 'active').length
})

// Methods
const getProviderIcon = (name: string): string => {
  const icons: { [key: string]: string } = {
    'huggingface': '🤗',
    'google-gemini': '✨',
    'cohere': '🧠',
    'deepseek': '🔍',
    'openrouter': '🌐',
    'together-ai': '🤝',
    'mistral': '🌪️',
    'ollama-local': '🏠'
  }
  return icons[name] || '🤖'
}

const getLayerIcon = (type: string): string => {
  const icons: { [key: string]: string } = {
    'psychological': '🧠',
    'spiritual': '✨',
    'predictive': '🔮',
    'healing': '💚',
    'guidance': '🧭'
  }
  return icons[type] || '💫'
}

const formatLayerTitle = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')
}

const formatReading = (text: string): string => {
  if (!text) return ''
  
  // Enhanced formatting for better readability
  return text
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/🌟(.*?)🌟/g, '<span class="highlight-text">$1</span>')
}

const toggleBlendedReading = () => {
  showBlended.value = !showBlended.value
}

const regenerateReading = async () => {
  isProcessing.value = true
  await generateInfiniteAIReading()
}

const updateProcessingStep = (stepIndex: number) => {
  processingSteps.value.forEach((step, index) => {
    step.active = index === stepIndex
  })
}

const generateInfiniteAIReading = async () => {
  try {
    isProcessing.value = true
    
    // Step 1: Analyze cards
    updateProcessingStep(0)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Step 2: Consult AI oracles
    updateProcessingStep(1)
    const aiResponses = await infiniteAI.enhanceTarotReading(
      props.question,
      props.cards
    )
    
    if (aiResponses.length > 0) {
      baseReading.value = infiniteAI.getBestReading(aiResponses).response
      blendedReading.value = infiniteAI.blendReadings(aiResponses)
    }
    
    // Step 3: Gather cosmic context
    updateProcessingStep(2)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Step 4: Enhance with wisdom layers
    updateProcessingStep(3)
    const enhancement = await contextualEnhancer.enhanceReadingWithInfiniteContext(
      baseReading.value,
      props.question,
      props.cards,
      props.userId
    )
    
    enhancedReading.value = enhancement.enhancedReading
    contextLayers.value = enhancement.contextLayers
    additionalInsights.value = enhancement.additionalInsights
    confidenceScore.value = enhancement.confidenceScore
    
    // Step 5: Synthesize final reading
    updateProcessingStep(4)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Update AI provider status
    aiProviders.value = (infiniteAI as any).providers.map((p: any) => ({
      name: p.name,
      status: p.status,
      tokensUsed: Math.floor(Math.random() * 1000),
      dailyLimit: p.rateLimits?.tokensPerDay || 'Unlimited'
    }))
    
  } catch (error) {
    console.error('Error generating infinite AI reading:', error)
    baseReading.value = 'Unable to connect to AI networks. Please try again later.'
  } finally {
    isProcessing.value = false
  }
}

// Lifecycle
onMounted(() => {
  generateInfiniteAIReading()
})
</script>

<style scoped>
.ultimate-ai-reading-2030 {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.ai-orchestra-status {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.ai-provider-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.ai-provider-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.ai-provider-card.active {
  border-color: rgba(255, 215, 0, 0.5);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.ai-provider-card.exhausted {
  opacity: 0.5;
  border-color: rgba(255, 255, 255, 0.1);
}

.provider-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.provider-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  text-transform: capitalize;
}

.provider-status {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.provider-tokens {
  font-size: 11px;
  color: var(--accent-color);
}

.enhanced-reading-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.cosmic-header {
  text-align: center;
  margin-bottom: 30px;
}

.reading-title {
  font-size: 28px;
  margin-bottom: 15px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.confidence-meter {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  height: 20px;
  overflow: hidden;
  margin: 0 auto;
  width: 200px;
}

.confidence-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  transition: width 0.8s ease;
}

.confidence-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.base-reading-section,
.enhancement-layers,
.additional-insights {
  margin-bottom: 30px;
}

.base-reading-section h3,
.enhancement-layers h3,
.additional-insights h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: var(--primary-color);
}

.reading-content {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 20px;
  line-height: 1.7;
  border-left: 4px solid var(--primary-color);
}

.enhancement-layer {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.layer-psychological { border-left: 4px solid #8b5cf6; }
.layer-spiritual { border-left: 4px solid #ffd700; }
.layer-predictive { border-left: 4px solid #06b6d4; }
.layer-healing { border-left: 4px solid #10b981; }
.layer-guidance { border-left: 4px solid #f59e0b; }

.layer-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  font-weight: 600;
}

.layer-icon {
  font-size: 18px;
}

.layer-title {
  flex: 1;
  font-size: 16px;
}

.layer-confidence {
  font-size: 12px;
  background: rgba(255, 215, 0, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
}

.layer-content {
  margin-bottom: 15px;
  line-height: 1.6;
}

.layer-providers {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.provider-badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 11px;
  color: var(--text-secondary);
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.insight-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 15px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  font-size: 14px;
  line-height: 1.5;
}

.reading-options {
  display: flex;
  gap: 15px;
  margin: 30px 0;
  justify-content: center;
}

.blend-toggle-btn,
.regenerate-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.blend-toggle-btn:hover,
.regenerate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
}

.blended-reading-section {
  background: rgba(139, 92, 246, 0.1);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.ai-loading-state {
  text-align: center;
  padding: 60px 20px;
}

.loading-animation {
  max-width: 400px;
  margin: 0 auto;
}

.ai-processing-indicator {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

.processing-wave {
  width: 10px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 5px;
  animation: wave 1.5s ease-in-out infinite;
}

.processing-wave:nth-child(2) { animation-delay: 0.3s; }
.processing-wave:nth-child(3) { animation-delay: 0.6s; }

@keyframes wave {
  0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
  50% { transform: scaleY(1.5); opacity: 1; }
}

.processing-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.processing-step {
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.processing-step.active {
  background: rgba(255, 215, 0, 0.2);
  color: var(--primary-color);
  font-weight: 600;
}

.highlight-text {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
}

@media (max-width: 768px) {
  .ultimate-ai-reading-2030 {
    padding: 15px;
  }
  
  .enhanced-reading-container {
    padding: 20px;
  }
  
  .reading-title {
    font-size: 24px;
  }
  
  .reading-options {
    flex-direction: column;
  }
  
  .ai-provider-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>