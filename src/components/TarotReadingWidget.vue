<template>
  <div class="tarot-widget">
    <div class="widget-header">
      <h3 class="widget-title">🔮 AI Tarot Reading</h3>
      <p class="widget-subtitle">Get mystical insights from Song of the Silent masters</p>
    </div>

    <div class="reading-form">
      <div class="input-group">
        <label for="question" class="input-label">Your Question:</label>
        <textarea 
          id="question"
          v-model="question" 
          placeholder="Ask about love, career, life direction, or any burning question..."
          class="question-input"
          rows="3"
        ></textarea>
      </div>

      <div class="master-selection">
        <label class="input-label">Choose Your Tarot Master:</label>
        <div class="masters-grid">
          <div 
            v-for="master in tarotMasters" 
            :key="master.id"
            @click="selectedMaster = master.id"
            class="master-card"
            :class="{ active: selectedMaster === master.id }"
          >
            <div class="master-avatar">{{ master.avatar }}</div>
            <div class="master-name">{{ master.name }}</div>
            <div class="master-specialty">{{ master.specialty }}</div>
          </div>
        </div>
      </div>

      <button 
        @click="generateReading" 
        :disabled="!question.trim() || isGenerating"
        class="generate-btn"
      >
        <span class="btn-icon">{{ isGenerating ? '⏳' : '✨' }}</span>
        {{ isGenerating ? 'Channeling wisdom...' : 'Reveal Your Reading' }}
      </button>
    </div>

    <div v-if="currentReading" class="reading-result">
      <div class="reading-header">
        <div class="reader-info">
          <span class="reader-avatar">{{ getCurrentMaster()?.avatar }}</span>
          <div class="reader-details">
            <div class="reader-name">{{ getCurrentMaster()?.name }}</div>
            <div class="reader-universe">Song of the Silent Universe</div>
          </div>
        </div>
        <div class="reading-timestamp">{{ formatTimestamp(currentReading.timestamp) }}</div>
      </div>

      <div class="reading-content">
        <div class="reading-text">{{ currentReading.reading }}</div>
        
        <div class="reading-metadata">
          <div class="metadata-item">
            <span class="metadata-label">Model:</span>
            <span class="metadata-value">{{ currentReading.model }}</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">Response Time:</span>
            <span class="metadata-value">{{ currentReading.responseTime }}ms</span>
          </div>
        </div>
      </div>

      <div class="reading-actions">
        <button @click="saveReading" class="action-btn save-btn">
          <span class="btn-icon">💾</span>
          Save Reading
        </button>
        <button @click="shareReading" class="action-btn share-btn">
          <span class="btn-icon">📤</span>
          Share
        </button>
        <button @click="newReading" class="action-btn new-btn">
          <span class="btn-icon">🔮</span>
          New Reading
        </button>
      </div>
    </div>

    <div v-if="error" class="error-message">
      <div class="error-icon">⚠️</div>
      <div class="error-text">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { perfectServiceManager } from '../services/perfectApiClient'

interface TarotMaster {
  id: string
  name: string
  avatar: string
  specialty: string
  service: 'monica' | 'claude'
}

interface TarotReading {
  question: string
  reading: string
  master: string
  model: string
  responseTime: number
  timestamp: Date
}

const question = ref('')
const selectedMaster = ref('vrael')
const isGenerating = ref(false)
const currentReading = ref<TarotReading | null>(null)
const error = ref('')

const tarotMasters: TarotMaster[] = [
  {
    id: 'vrael',
    name: 'Vrael',
    avatar: '👑',
    specialty: 'Warrior King Bearer - Redemption & Responsibility',
    service: 'monica'
  },
  {
    id: 'rei',
    name: 'REI',
    avatar: '🤖',
    specialty: 'AI Evolutionist - Logic meets Emotion',
    service: 'claude'
  },
  {
    id: 'annelise',
    name: 'Annelise',
    avatar: '✨',
    specialty: 'Light Bearer - Hope & Love',
    service: 'monica'
  },
  {
    id: 'isoria',
    name: 'Isoria',
    avatar: '🌍',
    specialty: 'Earth Mother - Life & Balance',
    service: 'monica'
  },
  {
    id: 'helisa',
    name: 'Helisa',
    avatar: '🔍',
    specialty: 'Truth Seeker - Root Causes & Healing',
    service: 'claude'
  },
  {
    id: 'tabio',
    name: 'Tabio',
    avatar: '🌌',
    specialty: 'Dimensional Observer - Cosmic Perspective',
    service: 'claude'
  }
]

const getCurrentMaster = () => {
  return tarotMasters.find(m => m.id === selectedMaster.value)
}

const generateReading = async () => {
  if (!question.value.trim()) return
  
  isGenerating.value = true
  error.value = ''
  
  try {
    const master = getCurrentMaster()
    if (!master) throw new Error('No tarot master selected')
    
    const result = await perfectServiceManager.generateTarotReading(
      question.value,
      master.service
    )
    
    if (result.success && result.data) {
      currentReading.value = {
        question: question.value,
        reading: result.data.reading,
        master: master.name,
        model: result.data.model || 'Unknown',
        responseTime: result.responseTime,
        timestamp: result.timestamp
      }
    } else {
      throw new Error(result.error || 'Failed to generate reading')
    }
  } catch (err: any) {
    error.value = err.message || 'An unexpected error occurred'
  } finally {
    isGenerating.value = false
  }
}

const saveReading = async () => {
  if (!currentReading.value) return
  
  try {
    // Save to MongoDB via perfect service manager
    const mongoService = perfectServiceManager.getService('mongodb')
    if (mongoService) {
      await mongoService.saveReading(currentReading.value)
    }
  } catch (err: any) {
    console.error('Failed to save reading:', err)
  }
}

const shareReading = () => {
  if (!currentReading.value) return
  
  const shareText = `🔮 Tarot Reading by ${currentReading.value.master}\n\nQuestion: ${currentReading.value.question}\n\nReading: ${currentReading.value.reading.substring(0, 200)}...\n\n✨ Generated by Night God Tarot`
  
  if (navigator.share) {
    navigator.share({
      title: 'Night God Tarot Reading',
      text: shareText
    })
  } else {
    navigator.clipboard.writeText(shareText)
  }
}

const newReading = () => {
  currentReading.value = null
  question.value = ''
  error.value = ''
}

const formatTimestamp = (timestamp: Date) => {
  return timestamp.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.tarot-widget {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(255, 215, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  animation: fadeIn 0.8s ease-in;
}

.widget-header {
  text-align: center;
  margin-bottom: 25px;
}

.widget-title {
  font-size: 1.5rem;
  color: #ffd700;
  margin: 0 0 8px 0;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.widget-subtitle {
  color: #b8b8b8;
  margin: 0;
  font-size: 0.9rem;
}

.reading-form {
  margin-bottom: 25px;
}

.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  color: #d0d0d0;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 0.9rem;
}

.question-input {
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.question-input:focus {
  outline: none;
  border-color: #ffd700;
  background: rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
}

.master-selection {
  margin-bottom: 25px;
}

.masters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.master-card {
  text-align: center;
  padding: 12px 8px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.master-card:hover {
  transform: translateY(-2px);
  background: rgba(139, 92, 246, 0.1);
  box-shadow: 0 5px 15px rgba(139, 92, 246, 0.2);
}

.master-card.active {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.master-avatar {
  font-size: 1.8rem;
  margin-bottom: 5px;
}

.master-name {
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 3px;
  font-size: 0.9rem;
}

.master-specialty {
  color: #b8b8b8;
  font-size: 0.7rem;
  line-height: 1.2;
}

.generate-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #8b5cf6, #ffd700);
  border: none;
  border-radius: 25px;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.generate-btn:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.reading-result {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  animation: slideUp 0.6s ease-out;
}

.reading-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.reader-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reader-avatar {
  font-size: 1.5rem;
}

.reader-name {
  color: #ffd700;
  font-weight: bold;
  font-size: 1rem;
}

.reader-universe {
  color: #b8b8b8;
  font-size: 0.8rem;
}

.reading-timestamp {
  color: #888;
  font-size: 0.8rem;
}

.reading-content {
  margin-bottom: 20px;
}

.reading-text {
  color: #e0e0e0;
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 0.95rem;
  white-space: pre-wrap;
}

.reading-metadata {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.metadata-item {
  display: flex;
  gap: 5px;
}

.metadata-label {
  color: #888;
  font-size: 0.8rem;
}

.metadata-value {
  color: #ffd700;
  font-size: 0.8rem;
  font-weight: 500;
}

.reading-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  min-width: 120px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.5);
  background: rgba(139, 92, 246, 0.2);
  color: #dbb8ff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 0.85rem;
}

.action-btn:hover {
  background: rgba(139, 92, 246, 0.3);
  transform: translateY(-1px);
}

.save-btn {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.save-btn:hover {
  background: rgba(16, 185, 129, 0.3);
}

.share-btn {
  border-color: rgba(245, 158, 11, 0.5);
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.share-btn:hover {
  background: rgba(245, 158, 11, 0.3);
}

.new-btn {
  border-color: rgba(255, 215, 0, 0.5);
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
}

.new-btn:hover {
  background: rgba(255, 215, 0, 0.3);
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ef4444;
  animation: shake 0.6s ease-in-out;
}

.error-icon {
  font-size: 1.2rem;
}

.btn-icon {
  font-size: 1rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .masters-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .reading-actions {
    flex-direction: column;
  }
  
  .action-btn {
    min-width: auto;
  }
  
  .reading-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .reading-metadata {
    flex-direction: column;
    gap: 8px;
  }
}
</style>