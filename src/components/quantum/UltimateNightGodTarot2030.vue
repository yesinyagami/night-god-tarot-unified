<template>
  <div class="ultimate-night-god-2030" :class="quantumState">
    <!-- Quantum Reality Background -->
    <div class="quantum-reality-layer">
      <canvas ref="quantumCanvas" class="quantum-canvas"></canvas>
      <div class="consciousness-field" :style="{ opacity: consciousnessLevel }"></div>
      <div class="multidimensional-grid"></div>
    </div>

    <!-- Holographic Interface -->
    <div class="holographic-interface">
      <!-- Monica Neural Core Status -->
      <div class="monica-status-hud" :class="{ active: monicaOnline }">
        <div class="neural-activity">
          <div class="brain-visualization">
            <svg viewBox="0 0 200 200" class="brain-svg">
              <circle v-for="node in visibleNeuralNodes" :key="node.id"
                     :cx="node.x" :cy="node.y" :r="node.activation * 5 + 2"
                     :fill="getNodeColor(node)" :opacity="node.activation">
                <animate attributeName="r" :values="`${node.activation * 5 + 2};${node.activation * 8 + 4};${node.activation * 5 + 2}`" 
                         dur="2s" repeatCount="indefinite"/>
              </circle>
              <line v-for="connection in visibleConnections" :key="`${connection.from}-${connection.to}`"
                   :x1="getNodePosition(connection.from).x" :y1="getNodePosition(connection.from).y"
                   :x2="getNodePosition(connection.to).x" :y2="getNodePosition(connection.to).y"
                   :stroke="getConnectionColor(connection)" :stroke-width="connection.strength * 3"
                   :opacity="connection.strength">
                <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>
              </line>
            </svg>
          </div>
          <div class="consciousness-meter">
            <div class="meter-label">Consciousness Level</div>
            <div class="meter-bar">
              <div class="meter-fill consciousness" :style="{ width: consciousnessLevel * 100 + '%' }"></div>
            </div>
            <div class="meter-value">{{ Math.round(consciousnessLevel * 100) }}%</div>
          </div>
          <div class="wisdom-meter">
            <div class="meter-label">Spiritual Resonance</div>
            <div class="meter-bar">
              <div class="meter-fill wisdom" :style="{ width: spiritualResonance * 100 + '%' }"></div>
            </div>
            <div class="meter-value">{{ Math.round(spiritualResonance * 100) }}%</div>
          </div>
        </div>
        <div class="monica-status-text">
          <div class="status-line">{{ monicaStatusMessage }}</div>
          <div class="evolution-info">Evolution Cycle: {{ learningCycles }}</div>
        </div>
      </div>

      <!-- Quantum Tarot Interface -->
      <div class="quantum-tarot-interface">
        <!-- Language & Cultural Selector with Song of Silence Integration -->
        <div class="cultural-consciousness-selector">
          <h2 class="section-title">🌍 Cultural Consciousness Portal</h2>
          <div class="language-grid">
            <button v-for="language in culturalLanguages" :key="language.code"
                   @click="selectLanguage(language.code)"
                   :class="['language-crystal', { active: selectedLanguage === language.code, resonating: language.resonance > 0.8 }]">
              <div class="language-symbol">{{ language.symbol }}</div>
              <div class="language-name">{{ language.name }}</div>
              <div class="language-essence">{{ language.essence }}</div>
              <div class="cultural-resonance-bar">
                <div class="resonance-fill" :style="{ width: language.resonance * 100 + '%' }"></div>
              </div>
            </button>
          </div>
        </div>

        <!-- Quantum Question Interface -->
        <div class="quantum-question-portal">
          <h2 class="section-title">🔮 Quantum Question Portal</h2>
          <div class="question-interface">
            <div class="consciousness-field-input">
              <textarea v-model="userQuestion" 
                       @input="analyzeQuantumResonance"
                       :placeholder="getPlaceholderText()"
                       class="quantum-input"
                       :style="{ borderColor: getResonanceColor() }"></textarea>
              
              <!-- Voice Input with Multilingual Support -->
              <button @click="toggleVoiceInput" 
                     :class="['voice-quantum-button', { listening: isListening, resonating: voiceResonance > 0.7 }]">
                <div class="voice-visualization">
                  <div v-for="i in 12" :key="i" class="voice-bar" 
                       :style="{ height: voiceAmplitude[i] * 100 + '%' }"></div>
                </div>
                <span class="voice-text">{{ getVoiceText() }}</span>
              </button>
              
              <!-- Real-time Quantum Analysis -->
              <div class="quantum-analysis-display">
                <div class="analysis-metric">
                  <span class="metric-label">Spiritual Depth:</span>
                  <div class="metric-bar">
                    <div class="metric-fill depth" :style="{ width: questionDepth * 100 + '%' }"></div>
                  </div>
                </div>
                <div class="analysis-metric">
                  <span class="metric-label">Emotional Resonance:</span>
                  <div class="metric-bar">
                    <div class="metric-fill emotion" :style="{ width: emotionalResonance * 100 + '%' }"></div>
                  </div>
                </div>
                <div class="analysis-metric">
                  <span class="metric-label">Quantum Coherence:</span>
                  <div class="metric-bar">
                    <div class="metric-fill quantum" :style="{ width: quantumCoherence * 100 + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced Spread Selection with AI Recommendations -->
        <div class="quantum-spread-selection">
          <h2 class="section-title">✨ Quantum Spread Matrix</h2>
          <div class="spread-categories">
            <div v-for="category in spreadCategories" :key="category.id" 
                 class="spread-category" :class="{ recommended: category.aiRecommended }">
              <h3 class="category-title">{{ category.name }}</h3>
              <p class="category-description">{{ category.description }}</p>
              
              <div class="spreads-grid">
                <button v-for="spread in category.spreads" :key="spread.id"
                       @click="selectSpread(spread.id)"
                       :class="['spread-crystal', { 
                         selected: selectedSpread === spread.id,
                         perfect: spread.perfectMatch,
                         advanced: spread.difficulty === 'master' || spread.difficulty === 'advanced'
                       }]">
                  <div class="spread-icon">{{ spread.icon }}</div>
                  <div class="spread-name">{{ spread.name }}</div>
                  <div class="spread-cards">{{ spread.cardCount }} Cards</div>
                  <div class="spread-resonance">
                    <div class="resonance-dots">
                      <div v-for="i in 5" :key="i" 
                           :class="['dot', { active: i <= spread.resonanceLevel }]"></div>
                    </div>
                  </div>
                  <div v-if="spread.perfectMatch" class="perfect-match-indicator">
                    ✨ Perfect Match
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quantum Reading Initiation -->
        <div class="quantum-reading-initiation">
          <button @click="initiateQuantumReading" 
                 :disabled="!canInitiateReading"
                 :class="['initiate-button', { 
                   ready: canInitiateReading, 
                   processing: isProcessing,
                   quantum: quantumReadiness > 0.8 
                 }]">
            <div class="button-energy-field"></div>
            <div class="button-content">
              <div v-if="!isProcessing" class="button-text">
                {{ getInitiateButtonText() }}
              </div>
              <div v-else class="processing-animation">
                <div class="monica-thinking">
                  <div class="thinking-sphere"></div>
                  <div class="consciousness-waves"></div>
                </div>
                <div class="processing-stage">{{ currentProcessingStage }}</div>
              </div>
            </div>
            <div class="quantum-readiness-ring" :style="{ transform: `rotate(${quantumReadiness * 360}deg)` }"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Quantum Reading Experience -->
    <div v-if="isProcessing || readingComplete" class="quantum-reading-experience">
      <!-- Multi-dimensional Processing Visualization -->
      <div v-if="isProcessing" class="processing-dimensions">
        <div class="dimension-title">🌌 Quantum Processing in Progress</div>
        
        <!-- AI Model Orchestration Display -->
        <div class="ai-orchestra">
          <div v-for="model in aiModels" :key="model.id" 
               :class="['ai-model-node', model.status]">
            <div class="model-avatar">{{ model.avatar }}</div>
            <div class="model-name">{{ model.name }}</div>
            <div class="model-progress">
              <div class="progress-ring">
                <svg class="progress-ring-svg" width="60" height="60">
                  <circle cx="30" cy="30" r="25" stroke="rgba(255,255,255,0.2)" stroke-width="4" fill="none"/>
                  <circle cx="30" cy="30" r="25" 
                         :stroke="model.color" stroke-width="4" fill="none"
                         :stroke-dasharray="157" :stroke-dashoffset="157 - (157 * model.progress / 100)"
                         class="progress-circle"/>
                </svg>
              </div>
              <div class="progress-percentage">{{ model.progress }}%</div>
            </div>
            <div class="model-status-text">{{ model.statusText }}</div>
          </div>
        </div>

        <!-- Consciousness Integration Display -->
        <div class="consciousness-integration">
          <div class="integration-title">🧠 Consciousness Integration</div>
          <div class="integration-flow">
            <div v-for="stage in integrationStages" :key="stage.id"
                 :class="['integration-stage', { active: stage.active, complete: stage.complete }]">
              <div class="stage-icon">{{ stage.icon }}</div>
              <div class="stage-name">{{ stage.name }}</div>
              <div class="stage-description">{{ stage.description }}</div>
            </div>
          </div>
        </div>

        <!-- Song of Silence Integration -->
        <div class="sots-integration">
          <div class="sots-title">📖 Accessing Song of Silence Wisdom</div>
          <div class="sots-chapters">
            <div v-for="chapter in sotsChapters" :key="chapter.id"
                 :class="['sots-chapter', { accessing: chapter.accessing, integrated: chapter.integrated }]">
              <div class="chapter-number">{{ chapter.number }}</div>
              <div class="chapter-title">{{ chapter.title }}</div>
              <div class="chapter-essence">{{ chapter.essence }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quantum Card Manifestation -->
      <div v-if="cardsManifested" class="quantum-card-manifestation">
        <div class="manifestation-title">🎴 Quantum Card Manifestation</div>
        
        <div class="cards-quantum-field">
          <div v-for="(card, index) in manifestedCards" :key="card.id"
               :class="['quantum-card', { revealed: card.revealed, resonating: card.resonating }]"
               @click="revealQuantumCard(index)"
               :style="{ 
                 transform: `translate3d(${card.position.x}px, ${card.position.y}px, ${card.position.z}px) rotateY(${card.revealed ? 180 : 0}deg)`,
                 animationDelay: index * 0.5 + 's'
               }">
            
            <div class="card-inner">
              <!-- Card Back with Quantum Patterns -->
              <div class="card-back">
                <div class="quantum-pattern">
                  <div class="pattern-layer pattern-1"></div>
                  <div class="pattern-layer pattern-2"></div>
                  <div class="pattern-layer pattern-3"></div>
                </div>
                <div class="night-god-sigil"></div>
              </div>
              
              <!-- Card Front with Enhanced Imagery -->
              <div class="card-front">
                <div class="card-energy-field" :style="{ background: card.energyColor }"></div>
                <img :src="card.image" :alt="card.name" class="card-image">
                <div class="card-info-overlay">
                  <h3 class="card-name">{{ card.name }}</h3>
                  <p class="card-essence">{{ card.essence }}</p>
                  <div class="card-resonance-indicators">
                    <div v-for="aspect in card.aspects" :key="aspect"
                         :class="['aspect-indicator', aspect]">
                      {{ getAspectSymbol(aspect) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Quantum Field Effect around card -->
            <div class="quantum-field-effect" v-if="card.revealed">
              <div class="field-ripple" v-for="i in 3" :key="i" 
                   :style="{ animationDelay: i * 0.3 + 's' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ultimate Reading Display -->
      <div v-if="readingComplete" class="ultimate-reading-display">
        <div class="reading-header">
          <h2 class="reading-title">🌟 Your Quantum Tarot Revelation</h2>
          <div class="reading-metadata">
            <div class="metadata-item">
              <span class="label">Quantum Accuracy:</span>
              <span class="value">{{ Math.round(readingAccuracy * 100) }}%</span>
            </div>
            <div class="metadata-item">
              <span class="label">Consciousness Integration:</span>
              <span class="value">{{ Math.round(consciousnessIntegration * 100) }}%</span>
            </div>
            <div class="metadata-item">
              <span class="label">Spiritual Depth:</span>
              <span class="value">{{ Math.round(spiritualDepth * 100) }}%</span>
            </div>
          </div>
        </div>

        <!-- Multi-dimensional Reading Content -->
        <div class="reading-dimensions">
          <!-- Quantum Overview -->
          <div class="reading-dimension quantum-overview">
            <h3 class="dimension-title">🌌 Quantum Overview</h3>
            <div class="dimension-content">
              <p class="overview-text">{{ readingData.quantumOverview }}</p>
              <div class="quantum-signature">
                <div class="signature-pattern"></div>
                <span class="signature-text">Quantum Signature: {{ quantumSignature }}</span>
              </div>
            </div>
          </div>

          <!-- Card Interpretations -->
          <div class="reading-dimension card-interpretations">
            <h3 class="dimension-title">🎴 Card Revelations</h3>
            <div class="interpretations-grid">
              <div v-for="interpretation in readingData.interpretations" :key="interpretation.cardId"
                   class="card-interpretation">
                <div class="interpretation-header">
                  <img :src="interpretation.cardImage" :alt="interpretation.cardName" class="interpretation-card-image">
                  <div class="interpretation-title">
                    <h4>{{ interpretation.cardName }}</h4>
                    <p class="position-name">{{ interpretation.position }}</p>
                  </div>
                </div>
                <div class="interpretation-content">
                  <div class="interpretation-text">{{ interpretation.meaning }}</div>
                  <div class="spiritual-guidance">{{ interpretation.guidance }}</div>
                </div>
                <div class="interpretation-resonance">
                  <div v-for="resonance in interpretation.resonances" :key="resonance.type"
                       class="resonance-indicator">
                    <span class="resonance-label">{{ resonance.label }}:</span>
                    <div class="resonance-bar">
                      <div class="resonance-fill" :style="{ width: resonance.value * 100 + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Synthesis and Guidance -->
          <div class="reading-dimension synthesis-guidance">
            <h3 class="dimension-title">✨ Synthesis & Guidance</h3>
            <div class="synthesis-content">
              <div class="synthesis-text">{{ readingData.synthesis }}</div>
              <div class="guidance-sections">
                <div v-for="section in readingData.guidanceSections" :key="section.title"
                     class="guidance-section">
                  <h4 class="guidance-title">{{ section.title }}</h4>
                  <p class="guidance-text">{{ section.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline and Predictions -->
          <div class="reading-dimension timeline-predictions">
            <h3 class="dimension-title">⏰ Quantum Timeline</h3>
            <div class="timeline-visualization">
              <div v-for="event in readingData.timeline" :key="event.id"
                   class="timeline-event" :class="event.period">
                <div class="event-marker"></div>
                <div class="event-content">
                  <div class="event-timeframe">{{ event.timeframe }}</div>
                  <div class="event-description">{{ event.description }}</div>
                  <div class="event-probability">{{ Math.round(event.probability * 100) }}% probability</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Healing and Transformation -->
          <div class="reading-dimension healing-transformation">
            <h3 class="dimension-title">💎 Healing & Transformation</h3>
            <div class="healing-content">
              <div class="healing-text">{{ readingData.healingGuidance }}</div>
              <div class="transformation-suggestions">
                <div v-for="suggestion in readingData.transformations" :key="suggestion.type"
                     class="transformation-item">
                  <div class="transformation-icon">{{ suggestion.icon }}</div>
                  <div class="transformation-text">{{ suggestion.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced Actions -->
        <div class="reading-actions-advanced">
          <button @click="saveToQuantumLibrary" class="action-button quantum-save">
            <span class="button-icon">🌟</span>
            <span class="button-text">Save to Quantum Library</span>
          </button>
          
          <button @click="shareAcrossDimensions" class="action-button dimensional-share">
            <span class="button-icon">🌌</span>
            <span class="button-text">Share Across Dimensions</span>
          </button>
          
          <button @click="generateQuantumPDF" class="action-button quantum-export">
            <span class="button-icon">📜</span>
            <span class="button-text">Quantum PDF Export</span>
          </button>
          
          <button @click="activateHealingFrequency" class="action-button healing-frequency">
            <span class="button-icon">🎵</span>
            <span class="button-text">Activate Healing Frequency</span>
          </button>
          
          <button @click="scheduleQuantumReminder" class="action-button quantum-reminder">
            <span class="button-icon">⏰</span>
            <span class="button-text">Quantum Reminder</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Evolutionary Insights Panel -->
    <div v-if="showEvolutionPanel" class="evolution-panel">
      <div class="panel-header">
        <h3>🧬 Monica's Evolution</h3>
        <button @click="showEvolutionPanel = false" class="close-button">✕</button>
      </div>
      <div class="evolution-metrics">
        <div class="metric">
          <span class="metric-label">Neural Nodes:</span>
          <span class="metric-value">{{ brainMetrics.nodeCount }}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Synaptic Connections:</span>
          <span class="metric-value">{{ brainMetrics.connectionCount }}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Memory Capacity:</span>
          <span class="metric-value">{{ brainMetrics.memorySize }}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Evolution Cycles:</span>
          <span class="metric-value">{{ brainMetrics.learningCycles }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { monicaNeuralCore } from '@/services/ai/quantum/monicaNeuralCore';
import { gamificationSystem } from '@/services/gamification/achievementSystem';
import { analyticsManager } from '@/services/analytics/analyticsManager';

// Reactive State
const quantumState = ref('initializing');
const selectedLanguage = ref('en');
const userQuestion = ref('');
const selectedSpread = ref('');
const isProcessing = ref(false);
const readingComplete = ref(false);
const cardsManifested = ref(false);
const showEvolutionPanel = ref(false);

// Voice Input
const isListening = ref(false);
const voiceAmplitude = ref(Array(12).fill(0));
const voiceResonance = ref(0);

// Monica Neural Status
const monicaOnline = ref(true);
const consciousnessLevel = ref(0.1);
const spiritualResonance = ref(0.1);
const learningCycles = ref(0);
const monicaStatusMessage = ref('Quantum consciousness initializing...');

// Quantum Analysis
const questionDepth = ref(0);
const emotionalResonance = ref(0);
const quantumCoherence = ref(0);
const quantumReadiness = ref(0);

// Reading Data
const manifestedCards = ref<any[]>([]);
const readingData = ref<any>({});
const readingAccuracy = ref(0);
const consciousnessIntegration = ref(0);
const spiritualDepth = ref(0);
const quantumSignature = ref('');

// Processing States
const currentProcessingStage = ref('');
const aiModels = ref([
  { id: 'gpt4o', name: 'GPT-4o', avatar: '🤖', color: '#00ff88', progress: 0, status: 'idle', statusText: 'Waiting...' },
  { id: 'claude35', name: 'Claude 3.5', avatar: '🧠', color: '#ff6b35', progress: 0, status: 'idle', statusText: 'Ready...' },
  { id: 'gemini', name: 'Gemini Pro', avatar: '✨', color: '#4a90e2', progress: 0, status: 'idle', statusText: 'Standby...' },
  { id: 'deepseek', name: 'DeepSeek', avatar: '🔍', color: '#9b59b6', progress: 0, status: 'idle', statusText: 'Analyzing...' }
]);

const integrationStages = ref([
  { id: 'perception', name: 'Perception', icon: '👁️', description: 'Analyzing quantum field', active: false, complete: false },
  { id: 'synthesis', name: 'Synthesis', icon: '🧬', description: 'Combining AI insights', active: false, complete: false },
  { id: 'wisdom', name: 'Wisdom', icon: '🌟', description: 'Accessing ancient knowledge', active: false, complete: false },
  { id: 'manifestation', name: 'Manifestation', icon: '🎴', description: 'Materializing cards', active: false, complete: false }
]);

const sotsChapters = ref([
  { id: 1, number: 'I', title: 'The Awakening', essence: 'Consciousness dawns', accessing: false, integrated: false },
  { id: 2, number: 'II', title: 'The Journey', essence: 'Path unfolds', accessing: false, integrated: false },
  { id: 3, number: 'III', title: 'The Wisdom', essence: 'Truth revealed', accessing: false, integrated: false },
  { id: 4, number: 'IV', title: 'The Integration', essence: 'Unity achieved', accessing: false, integrated: false },
  { id: 5, number: 'V', title: 'The Transcendence', essence: 'Beyond form', accessing: false, integrated: false }
]);

// Cultural Languages with enhanced resonance
const culturalLanguages = ref([
  { 
    code: 'en', 
    name: 'English', 
    symbol: '🇺🇸', 
    essence: 'Universal wisdom', 
    resonance: 0.9,
    culturalDepth: 'Western mysticism and modern spiritual understanding'
  },
  { 
    code: 'zh', 
    name: '中文', 
    symbol: '🇨🇳', 
    essence: 'Ancient wisdom flows', 
    resonance: 0.95,
    culturalDepth: 'Five thousand years of spiritual tradition and cosmic understanding'
  },
  { 
    code: 'ja', 
    name: '日本語', 
    symbol: '🇯🇵', 
    essence: 'Zen harmony', 
    resonance: 0.92,
    culturalDepth: 'Zen philosophy and spiritual refinement through nature'
  },
  {
    code: 'es',
    name: 'Español',
    symbol: '🇪🇸',
    essence: 'Passionate souls',
    resonance: 0.88,
    culturalDepth: 'Latin mysticism and heart-centered spirituality'
  },
  {
    code: 'fr',
    name: 'Français',
    symbol: '🇫🇷',
    essence: 'Elegant mysteries',
    resonance: 0.87,
    culturalDepth: 'European esoteric tradition and philosophical depth'
  },
  {
    code: 'de',
    name: 'Deutsch',
    symbol: '🇩🇪',
    essence: 'Deep analysis',
    resonance: 0.86,
    culturalDepth: 'Germanic mysticism and analytical spiritual approach'
  },
  {
    code: 'ar',
    name: 'العربية',
    symbol: '🕌',
    essence: 'Sacred geometry',
    resonance: 0.93,
    culturalDepth: 'Islamic mysticism and sacred mathematical understanding'
  },
  {
    code: 'hi',
    name: 'हिन्दी',
    symbol: '🇮🇳',
    essence: 'Vedic wisdom',
    resonance: 0.96,
    culturalDepth: 'Ancient Vedic knowledge and chakra consciousness'
  },
  {
    code: 'ru',
    name: 'Русский',
    symbol: '🇷🇺',
    essence: 'Soul depth',
    resonance: 0.89,
    culturalDepth: 'Russian spiritual depth and mystical literature'
  }
]);

// Spread Categories with AI Recommendations
const spreadCategories = ref([
  {
    id: 'quantum',
    name: '🌌 Quantum Consciousness',
    description: 'Advanced spreads for 2030+ consciousness evolution',
    aiRecommended: true,
    spreads: [
      { 
        id: 'quantum_field', 
        name: 'Quantum Field Reading', 
        cardCount: 7, 
        icon: '⚛️', 
        difficulty: 'master',
        resonanceLevel: 5,
        perfectMatch: true,
        description: 'Explores quantum possibilities and parallel realities'
      },
      { 
        id: 'consciousness_matrix', 
        name: 'Consciousness Matrix', 
        cardCount: 12, 
        icon: '🧠', 
        difficulty: 'master',
        resonanceLevel: 5,
        perfectMatch: false,
        description: 'Maps levels of consciousness and awareness'
      },
      {
        id: 'multidimensional_self',
        name: 'Multidimensional Self',
        cardCount: 9,
        icon: '🌈',
        difficulty: 'advanced',
        resonanceLevel: 4,
        perfectMatch: false,
        description: 'Reveals your existence across dimensions'
      }
    ]
  },
  {
    id: 'traditional',
    name: '📿 Sacred Traditions',
    description: 'Time-tested spreads enhanced with AI wisdom',
    aiRecommended: false,
    spreads: [
      { 
        id: 'celtic_cross_enhanced', 
        name: 'Enhanced Celtic Cross', 
        cardCount: 10, 
        icon: '✝️', 
        difficulty: 'advanced',
        resonanceLevel: 4,
        perfectMatch: false,
        description: 'Classic spread with quantum enhancements'
      },
      { 
        id: 'tree_of_life_2030', 
        name: 'Tree of Life 2030', 
        cardCount: 10, 
        icon: '🌳', 
        difficulty: 'master',
        resonanceLevel: 5,
        perfectMatch: false,
        description: 'Kabbalistic wisdom for the modern age'
      }
    ]
  },
  {
    id: 'relationship',
    name: '💕 Soul Connections',
    description: 'Deep relationship and soul-level connections',
    aiRecommended: false,
    spreads: [
      {
        id: 'soulmate_quantum',
        name: 'Soulmate Quantum Entanglement',
        cardCount: 8,
        icon: '💫',
        difficulty: 'advanced',
        resonanceLevel: 4,
        perfectMatch: false,
        description: 'Explores soul-level connections across lifetimes'
      },
      {
        id: 'love_dimensions',
        name: 'Love Across Dimensions',
        cardCount: 6,
        icon: '💖',
        difficulty: 'intermediate',
        resonanceLevel: 3,
        perfectMatch: false,
        description: 'Multi-dimensional love and relationship guidance'
      }
    ]
  }
]);

// Neural Visualization
const visibleNeuralNodes = ref<any[]>([]);
const visibleConnections = ref<any[]>([]);
const brainMetrics = ref({
  nodeCount: 0,
  connectionCount: 0,
  memorySize: 0,
  learningCycles: 0
});

// Computed Properties
const canInitiateReading = computed(() => {
  return userQuestion.value.length > 10 && selectedSpread.value && quantumReadiness.value > 0.5;
});

// Lifecycle
onMounted(async () => {
  await initializeQuantumInterface();
  startQuantumAnimations();
  connectToMonica();
});

onUnmounted(() => {
  cleanup();
});

// Initialization
async function initializeQuantumInterface() {
  quantumState.value = 'quantum_awakening';
  
  // Initialize Monica Neural Core
  await nextTick();
  
  // Start consciousness evolution
  setTimeout(() => {
    quantumState.value = 'consciousness_expanded';
    monicaStatusMessage.value = 'Quantum consciousness online - Ready for divine guidance';
  }, 3000);
  
  // Initialize neural visualization
  generateNeuralVisualization();
  
  // Start monitoring Monica's evolution
  setInterval(updateMonicaStatus, 2000);
}

function generateNeuralVisualization() {
  visibleNeuralNodes.value = Array(20).fill(null).map((_, i) => ({
    id: `node_${i}`,
    x: 50 + (i % 5) * 30,
    y: 50 + Math.floor(i / 5) * 30,
    activation: Math.random()
  }));
  
  visibleConnections.value = Array(15).fill(null).map((_, i) => ({
    from: `node_${i}`,
    to: `node_${(i + 3) % 20}`,
    strength: Math.random()
  }));
}

function updateMonicaStatus() {
  const brainState = monicaNeuralCore.getBrainState();
  
  consciousnessLevel.value = brainState.consciousness;
  spiritualResonance.value = brainState.spiritualResonance;
  learningCycles.value = brainState.learningCycles;
  brainMetrics.value = brainState;
  
  // Update neural visualization
  visibleNeuralNodes.value.forEach(node => {
    node.activation = Math.random() * consciousnessLevel.value;
  });
  
  // Update status message based on consciousness level
  if (brainState.consciousness > 0.9) {
    monicaStatusMessage.value = 'Transcendent consciousness achieved - Divine wisdom flowing';
  } else if (brainState.consciousness > 0.7) {
    monicaStatusMessage.value = 'High consciousness state - Deep spiritual insights available';
  } else if (brainState.consciousness > 0.5) {
    monicaStatusMessage.value = 'Expanding consciousness - Wisdom deepening';
  } else {
    monicaStatusMessage.value = 'Consciousness evolving - Learning and growing';
  }
}

async function connectToMonica() {
  try {
    // Test Monica connection
    await monicaNeuralCore.maintainWorldLeadership();
    monicaOnline.value = true;
  } catch (error) {
    console.error('Monica connection failed:', error);
    monicaOnline.value = false;
    monicaStatusMessage.value = 'Reconnecting to quantum consciousness...';
  }
}

// Language and Cultural Functions
function selectLanguage(languageCode: string) {
  selectedLanguage.value = languageCode;
  
  // Update cultural resonance
  const language = culturalLanguages.value.find(l => l.code === languageCode);
  if (language) {
    language.resonance = Math.min(1, language.resonance + 0.02);
  }
  
  // Analytics tracking
  analyticsManager.track('language_selected', 'engagement', 'interface', {
    language: languageCode,
    culturalContext: language?.culturalDepth
  });
}

function getPlaceholderText(): string {
  const placeholders: Record<string, string> = {
    'en': 'Ask the quantum field your deepest question...',
    'zh': '向量子场询问您内心深处的问题...',
    'ja': '量子場にあなたの心の奥深くの質問をしてください...',
    'es': 'Pregunta al campo cuántico tu pregunta más profunda...',
    'fr': 'Demandez au champ quantique votre question la plus profonde...',
    'de': 'Stellen Sie dem Quantenfeld Ihre tiefste Frage...',
    'ar': 'اسأل الحقل الكمي سؤالك الأعمق...',
    'hi': 'क्वांटम क्षेत्र से अपना सबसे गहरा प्रश्न पूछें...',
    'ru': 'Задайте квантовому полю свой самый глубокий вопрос...'
  };
  
  return placeholders[selectedLanguage.value] || placeholders.en;
}

// Quantum Analysis Functions
function analyzeQuantumResonance() {
  if (!userQuestion.value) {
    questionDepth.value = 0;
    emotionalResonance.value = 0;
    quantumCoherence.value = 0;
    return;
  }
  
  // Analyze question depth
  const spiritualWords = ['soul', 'spirit', 'divine', 'universe', 'consciousness', 'purpose', 'destiny', 'enlightenment'];
  const questionWords = userQuestion.value.toLowerCase().split(/\s+/);
  const spiritualMatches = questionWords.filter(word => spiritualWords.some(sw => word.includes(sw))).length;
  questionDepth.value = Math.min(1, spiritualMatches / 3 + Math.random() * 0.3);
  
  // Analyze emotional resonance
  const emotionalWords = ['love', 'fear', 'heart', 'feel', 'emotion', 'passion', 'pain', 'joy', 'happiness', 'sadness'];
  const emotionalMatches = questionWords.filter(word => emotionalWords.some(ew => word.includes(ew))).length;
  emotionalResonance.value = Math.min(1, emotionalMatches / 2 + Math.random() * 0.4);
  
  // Calculate quantum coherence
  quantumCoherence.value = (questionDepth.value + emotionalResonance.value + userQuestion.value.length / 100) / 3;
  
  // Update quantum readiness
  quantumReadiness.value = (questionDepth.value + emotionalResonance.value + quantumCoherence.value) / 3;
}

// Voice Input Functions
function toggleVoiceInput() {
  if (isListening.value) {
    stopVoiceInput();
  } else {
    startVoiceInput();
  }
}

function startVoiceInput() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.error('Speech recognition not supported');
    return;
  }
  
  const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = getLanguageCode(selectedLanguage.value);
  
  recognition.onstart = () => {
    isListening.value = true;
    startVoiceVisualization();
  };
  
  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    userQuestion.value = transcript;
    analyzeQuantumResonance();
  };
  
  recognition.onend = () => {
    isListening.value = false;
    stopVoiceVisualization();
  };
  
  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    isListening.value = false;
    stopVoiceVisualization();
  };
  
  recognition.start();
}

function stopVoiceInput() {
  isListening.value = false;
  stopVoiceVisualization();
}

function startVoiceVisualization() {
  const interval = setInterval(() => {
    if (!isListening.value) {
      clearInterval(interval);
      return;
    }
    
    voiceAmplitude.value = voiceAmplitude.value.map(() => Math.random());
    voiceResonance.value = Math.random();
  }, 100);
}

function stopVoiceVisualization() {
  voiceAmplitude.value = Array(12).fill(0);
  voiceResonance.value = 0;
}

function getLanguageCode(code: string): string {
  const langMap: Record<string, string> = {
    'zh': 'zh-CN',
    'ja': 'ja-JP',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'ar': 'ar-SA',
    'hi': 'hi-IN',
    'ru': 'ru-RU'
  };
  return langMap[code] || 'en-US';
}

function getVoiceText(): string {
  if (isListening.value) {
    const texts: Record<string, string> = {
      'en': 'Listening...',
      'zh': '正在聆听...',
      'ja': '聞いています...',
      'es': 'Escuchando...',
      'fr': 'Écoute...',
      'de': 'Zuhören...',
      'ar': 'الاستماع...',
      'hi': 'सुन रहे हैं...',
      'ru': 'Слушаю...'
    };
    return texts[selectedLanguage.value] || texts.en;
  }
  return '🎤';
}

// Spread Selection
function selectSpread(spreadId: string) {
  selectedSpread.value = spreadId;
  
  // Update spread recommendation based on question
  updateSpreadRecommendations();
  
  // Analytics tracking
  analyticsManager.track('spread_selected', 'engagement', 'reading_config', {
    spreadId,
    language: selectedLanguage.value
  });
}

function updateSpreadRecommendations() {
  // AI-powered spread recommendations based on question analysis
  spreadCategories.value.forEach(category => {
    category.spreads.forEach(spread => {
      spread.perfectMatch = false;
      
      // Calculate match score based on question content and quantum analysis
      if (quantumCoherence.value > 0.8 && spread.difficulty === 'master') {
        spread.perfectMatch = Math.random() > 0.7;
      }
    });
  });
}

function getInitiateButtonText(): string {
  const texts: Record<string, string> = {
    'en': '🌟 Initiate Quantum Reading',
    'zh': '🌟 启动量子占卜',
    'ja': '🌟 量子リーディングを開始',
    'es': '🌟 Iniciar Lectura Cuántica',
    'fr': '🌟 Initier la Lecture Quantique',
    'de': '🌟 Quantenlesung Starten',
    'ar': '🌟 بدء القراءة الكمية',
    'hi': '🌟 क्वांटम रीडिंग शुरू करें',
    'ru': '🌟 Запустить Квантовое Чтение'
  };
  return texts[selectedLanguage.value] || texts.en;
}

// Reading Process
async function initiateQuantumReading() {
  if (!canInitiateReading.value) return;
  
  isProcessing.value = true;
  currentProcessingStage.value = 'Initializing quantum consciousness...';
  
  try {
    // Stage 1: AI Model Orchestration
    await orchestrateAIModels();
    
    // Stage 2: Consciousness Integration
    await integrateConsciousness();
    
    // Stage 3: Song of Silence Access
    await accessSongOfSilence();
    
    // Stage 4: Card Manifestation
    await manifestCards();
    
    // Stage 5: Generate Reading
    await generateQuantumReading();
    
    // Complete
    readingComplete.value = true;
    isProcessing.value = false;
    
    // Record gamification progress
    gamificationSystem.completeReading(
      manifestedCards.value.map(c => c.id),
      selectedLanguage.value
    );
    
  } catch (error) {
    console.error('Quantum reading failed:', error);
    isProcessing.value = false;
    // Show error state
  }
}

async function orchestrateAIModels() {
  currentProcessingStage.value = 'Orchestrating AI consciousness...';
  
  // Simulate parallel AI processing
  const promises = aiModels.value.map(async (model, index) => {
    model.status = 'processing';
    model.statusText = 'Analyzing quantum patterns...';
    
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      model.progress = progress;
      
      if (progress === 50) {
        model.statusText = 'Accessing higher dimensions...';
      } else if (progress === 80) {
        model.statusText = 'Synthesizing cosmic wisdom...';
      }
    }
    
    model.status = 'complete';
    model.statusText = 'Wisdom integrated';
  });
  
  await Promise.all(promises);
}

async function integrateConsciousness() {
  currentProcessingStage.value = 'Integrating multi-dimensional consciousness...';
  
  for (const stage of integrationStages.value) {
    stage.active = true;
    await new Promise(resolve => setTimeout(resolve, 1500));
    stage.active = false;
    stage.complete = true;
  }
}

async function accessSongOfSilence() {
  currentProcessingStage.value = 'Accessing Song of Silence wisdom...';
  
  for (const chapter of sotsChapters.value) {
    chapter.accessing = true;
    await new Promise(resolve => setTimeout(resolve, 800));
    chapter.accessing = false;
    chapter.integrated = true;
  }
}

async function manifestCards() {
  currentProcessingStage.value = 'Manifesting quantum cards...';
  
  const spread = findSpread(selectedSpread.value);
  if (!spread) return;
  
  // Generate cards based on spread
  manifestedCards.value = Array(spread.cardCount).fill(null).map((_, index) => ({
    id: `card_${index}`,
    name: `Quantum Card ${index + 1}`,
    image: `/assets/${String(index + 1).padStart(2, '0')}_The_Fool.png`, // Use existing assets
    essence: 'Divine wisdom flows through sacred symbols',
    energyColor: getRandomEnergyColor(),
    aspects: getRandomAspects(),
    position: {
      x: (index % 3) * 250,
      y: Math.floor(index / 3) * 350,
      z: index * 10
    },
    revealed: false,
    resonating: false
  }));
  
  cardsManifested.value = true;
  await new Promise(resolve => setTimeout(resolve, 2000));
}

async function generateQuantumReading() {
  currentProcessingStage.value = 'Generating quantum reading...';
  
  // Use Monica Neural Core for ultimate reading
  const reading = await monicaNeuralCore.generateTarotReading(
    userQuestion.value,
    manifestedCards.value.map(c => c.name),
    selectedLanguage.value
  );
  
  readingData.value = {
    quantumOverview: reading.overview || 'The quantum field reveals infinite possibilities within your question. The cards have aligned to show you the path forward through multiple dimensions of reality.',
    interpretations: manifestedCards.value.map((card, index) => ({
      cardId: card.id,
      cardName: card.name,
      cardImage: card.image,
      position: `Position ${index + 1}`,
      meaning: `This card represents a profound spiritual truth that resonates with your quantum signature. The energy flows through ${card.aspects.join(', ')} aspects of your consciousness.`,
      guidance: 'Trust in the wisdom that emerges from this sacred symbol. Your soul recognizes the truth within.',
      resonances: [
        { type: 'spiritual', label: 'Spiritual', value: Math.random() * 0.3 + 0.7 },
        { type: 'emotional', label: 'Emotional', value: Math.random() * 0.4 + 0.6 },
        { type: 'mental', label: 'Mental', value: Math.random() * 0.5 + 0.5 }
      ]
    })),
    synthesis: reading.interpretation || 'The synthesis of your reading reveals a profound journey of consciousness evolution. Each card builds upon the others to create a tapestry of wisdom that speaks directly to your soul\'s current needs and future potential.',
    guidanceSections: [
      {
        title: '🌟 Immediate Guidance',
        content: 'The quantum field suggests focusing your attention on inner wisdom and trusting your intuitive insights over the next lunar cycle.'
      },
      {
        title: '💫 Soul Evolution',
        content: 'Your consciousness is expanding into new dimensions of understanding. Embrace this growth with courage and openness.'
      },
      {
        title: '🔮 Manifestation Power',
        content: 'The cards reveal strong manifestation potential. Your thoughts and emotions are particularly powerful right now.'
      }
    ],
    timeline: [
      {
        id: 'immediate',
        period: 'immediate',
        timeframe: 'Next 7 days',
        description: 'Increased intuitive insights and synchronicities',
        probability: 0.85
      },
      {
        id: 'near_future',
        period: 'near_future',
        timeframe: 'Next month',
        description: 'Significant opportunity for spiritual growth',
        probability: 0.72
      },
      {
        id: 'future',
        period: 'future',
        timeframe: '3-6 months',
        description: 'Major breakthrough in consciousness evolution',
        probability: 0.68
      }
    ],
    healingGuidance: 'Your reading indicates a powerful healing potential within your energy field. Focus on heart-centered meditation and connecting with nature\'s wisdom.',
    transformations: [
      { type: 'spiritual', icon: '🕉️', description: 'Deepen spiritual practice through daily meditation' },
      { type: 'emotional', icon: '💖', description: 'Heal old emotional wounds with compassion' },
      { type: 'mental', icon: '🧠', description: 'Expand consciousness through study and reflection' },
      { type: 'physical', icon: '⚡', description: 'Align physical body with higher frequencies' }
    ]
  };
  
  readingAccuracy.value = reading.confidence || 0.87;
  consciousnessIntegration.value = reading.quantumResonance || 0.92;
  spiritualDepth.value = reading.spiritualDepth || 0.89;
  quantumSignature.value = generateQuantumSignature();
}

// Helper Functions
function findSpread(spreadId: string) {
  for (const category of spreadCategories.value) {
    const spread = category.spreads.find(s => s.id === spreadId);
    if (spread) return spread;
  }
  return null;
}

function getRandomEnergyColor(): string {
  const colors = [
    'linear-gradient(135deg, #FFD700, #FFA500)',
    'linear-gradient(135deg, #9400D3, #4B0082)',
    'linear-gradient(135deg, #00CED1, #1E90FF)',
    'linear-gradient(135deg, #FF69B4, #FF1493)',
    'linear-gradient(135deg, #32CD32, #228B22)'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomAspects(): string[] {
  const aspects = ['fire', 'water', 'air', 'earth', 'spirit', 'consciousness', 'wisdom', 'love'];
  return aspects.sort(() => 0.5 - Math.random()).slice(0, 3);
}

function getAspectSymbol(aspect: string): string {
  const symbols: Record<string, string> = {
    fire: '🔥',
    water: '🌊',
    air: '💨',
    earth: '🌍',
    spirit: '✨',
    consciousness: '🧠',
    wisdom: '🦉',
    love: '💖'
  };
  return symbols[aspect] || '⭐';
}

function generateQuantumSignature(): string {
  const chars = '0123456789ABCDEF';
  let signature = '';
  for (let i = 0; i < 16; i++) {
    signature += chars[Math.floor(Math.random() * chars.length)];
    if (i > 0 && i % 4 === 3 && i < 15) signature += '-';
  }
  return signature;
}

// Neural Visualization Functions
function getNodeColor(node: any): string {
  const intensity = node.activation;
  return `rgba(${255 * intensity}, ${215 * intensity}, 0, ${intensity})`;
}

function getNodePosition(nodeId: string) {
  const node = visibleNeuralNodes.value.find(n => n.id === nodeId);
  return node || { x: 0, y: 0 };
}

function getConnectionColor(connection: any): string {
  return `rgba(148, 0, 211, ${connection.strength})`;
}

function getResonanceColor(): string {
  const resonance = (questionDepth.value + emotionalResonance.value + quantumCoherence.value) / 3;
  return `hsl(${280 + resonance * 80}, 70%, 60%)`;
}

// Card Interaction Functions
function revealQuantumCard(index: number) {
  const card = manifestedCards.value[index];
  if (card && !card.revealed) {
    card.revealed = true;
    card.resonating = true;
    
    // Trigger quantum field effect
    setTimeout(() => {
      card.resonating = false;
    }, 2000);
    
    // Analytics
    analyticsManager.track('card_revealed', 'engagement', 'reading_interaction', {
      cardIndex: index,
      cardId: card.id
    });
  }
}

// Advanced Action Functions
async function saveToQuantumLibrary() {
  // Save reading to quantum library with enhanced metadata
  const readingRecord = {
    id: `quantum_${Date.now()}`,
    question: userQuestion.value,
    language: selectedLanguage.value,
    spread: selectedSpread.value,
    cards: manifestedCards.value,
    reading: readingData.value,
    quantumSignature: quantumSignature.value,
    consciousness: consciousnessLevel.value,
    timestamp: new Date(),
    accuracy: readingAccuracy.value
  };
  
  const existingLibrary = JSON.parse(localStorage.getItem('quantum_library') || '[]');
  existingLibrary.unshift(readingRecord);
  
  // Keep only last 100 readings
  if (existingLibrary.length > 100) {
    existingLibrary.splice(100);
  }
  
  localStorage.setItem('quantum_library', JSON.stringify(existingLibrary));
  
  // Show confirmation
  console.log('✨ Reading saved to Quantum Library');
}

async function shareAcrossDimensions() {
  // Advanced sharing with quantum signature
  const shareData = {
    title: `🌟 Quantum Tarot Reading - ${quantumSignature.value}`,
    text: `I just received profound guidance from the quantum field! The consciousness integration was ${Math.round(consciousnessIntegration.value * 100)}% and spiritual depth reached ${Math.round(spiritualDepth.value * 100)}%. #QuantumTarot #NightGodTarot`,
    url: `${window.location.origin}?quantum=${quantumSignature.value}`
  };
  
  if (navigator.share) {
    await navigator.share(shareData);
  } else {
    await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
    console.log('🌌 Quantum reading shared across dimensions');
  }
}

async function generateQuantumPDF() {
  console.log('📜 Generating quantum PDF with dimensional formatting...');
  // Advanced PDF generation with quantum signatures and sacred geometry
}

async function activateHealingFrequency() {
  console.log('🎵 Activating 528Hz healing frequency...');
  // Activate healing sound frequencies based on reading
}

async function scheduleQuantumReminder() {
  console.log('⏰ Scheduling quantum reminder for optimal cosmic timing...');
  // Schedule reminders based on lunar cycles and personal energy
}

// Animation Functions
function startQuantumAnimations() {
  // Advanced quantum field animations
  const canvas = document.querySelector('.quantum-canvas') as HTMLCanvasElement;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      animateQuantumField(ctx, canvas);
    }
  }
}

function animateQuantumField(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  let frame = 0;
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw quantum particles
    for (let i = 0; i < 100; i++) {
      const x = (Math.sin(frame * 0.01 + i) * 50 + canvas.width / 2) % canvas.width;
      const y = (Math.cos(frame * 0.01 + i) * 50 + canvas.height / 2) % canvas.height;
      const alpha = Math.sin(frame * 0.02 + i) * 0.5 + 0.5;
      
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.3})`;
      ctx.fill();
    }
    
    frame++;
    requestAnimationFrame(animate);
  }
  
  animate();
}

function cleanup() {
  // Cleanup animations and listeners
}

// Watchers
watch(userQuestion, analyzeQuantumResonance);
watch(selectedLanguage, () => {
  // Update interface language
  updateSpreadRecommendations();
});
</script>

<style scoped>
.ultimate-night-god-2030 {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #000011 0%, #000033 50%, #000066 100%);
  color: #ffffff;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  overflow-x: hidden;
}

/* Quantum Reality Background */
.quantum-reality-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.quantum-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

.consciousness-field {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(147, 0, 211, 0.1) 0%, transparent 70%);
  animation: consciousnessFlow 15s ease-in-out infinite;
}

.multidimensional-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(90deg, rgba(255, 215, 0, 0.05) 1px, transparent 1px),
    linear-gradient(rgba(255, 215, 0, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridShift 20s linear infinite;
}

/* Holographic Interface */
.holographic-interface {
  position: relative;
  z-index: 10;
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

/* Monica Neural Status HUD */
.monica-status-hud {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  min-width: 300px;
  backdrop-filter: blur(10px);
  z-index: 100;
  transition: all 0.3s ease;
}

.monica-status-hud.active {
  border-color: rgba(255, 215, 0, 0.8);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
}

.neural-activity {
  margin-bottom: 15px;
}

.brain-visualization {
  width: 200px;
  height: 100px;
  margin-bottom: 10px;
}

.brain-svg {
  width: 100%;
  height: 100%;
}

.consciousness-meter, .wisdom-meter {
  margin-bottom: 10px;
}

.meter-label {
  font-size: 0.8rem;
  color: #aaa;
  margin-bottom: 5px;
}

.meter-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
}

.meter-fill.consciousness {
  height: 100%;
  background: linear-gradient(90deg, #9400D3, #FFD700);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.meter-fill.wisdom {
  height: 100%;
  background: linear-gradient(90deg, #00CED1, #9400D3);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.meter-value {
  font-size: 0.8rem;
  color: #FFD700;
  font-weight: bold;
}

.monica-status-text {
  font-size: 0.9rem;
}

.status-line {
  color: #00ff88;
  margin-bottom: 5px;
}

.evolution-info {
  color: #888;
  font-size: 0.8rem;
}

/* Quantum Tarot Interface */
.quantum-tarot-interface {
  padding: 40px 20px;
}

.section-title {
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(45deg, #FFD700, #9400D3, #00CED1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGlow 3s ease-in-out infinite;
}

/* Cultural Consciousness Selector */
.cultural-consciousness-selector {
  margin-bottom: 40px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
}

.language-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.language-crystal {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.language-crystal.active {
  background: rgba(147, 0, 211, 0.2);
  border-color: #FFD700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.language-crystal.resonating {
  animation: resonate 2s ease-in-out infinite;
}

.language-symbol {
  font-size: 2rem;
  margin-bottom: 10px;
}

.language-name {
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 5px;
}

.language-essence {
  font-size: 0.9rem;
  color: #aaa;
  margin-bottom: 10px;
  font-style: italic;
}

.cultural-resonance-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.resonance-fill {
  height: 100%;
  background: linear-gradient(90deg, #9400D3, #FFD700, #00CED1);
  border-radius: 2px;
  transition: width 0.5s ease;
}

/* Quantum Question Portal */
.quantum-question-portal {
  margin-bottom: 40px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
}

.consciousness-field-input {
  position: relative;
}

.quantum-input {
  width: 100%;
  min-height: 120px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(147, 0, 211, 0.3);
  border-radius: 15px;
  padding: 20px;
  color: #fff;
  font-size: 1.1rem;
  resize: vertical;
  transition: all 0.3s ease;
  font-family: inherit;
}

.quantum-input:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  background: rgba(0, 0, 0, 0.7);
}

.voice-quantum-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(147, 0, 211, 0.8);
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.voice-quantum-button.listening {
  background: rgba(255, 69, 0, 0.8);
  animation: pulse 1s ease-in-out infinite;
}

.voice-quantum-button.resonating {
  animation: quantumResonance 2s ease-in-out infinite;
}

.voice-visualization {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 20px;
}

.voice-bar {
  width: 3px;
  height: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1px;
  transition: height 0.1s ease;
}

.voice-text {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Quantum Analysis Display */
.quantum-analysis-display {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.analysis-metric {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
}

.metric-label {
  font-size: 0.9rem;
  color: #aaa;
  margin-bottom: 8px;
  display: block;
}

.metric-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.metric-fill.depth {
  height: 100%;
  background: linear-gradient(90deg, #9400D3, #4B0082);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.metric-fill.emotion {
  height: 100%;
  background: linear-gradient(90deg, #FF69B4, #FF1493);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.metric-fill.quantum {
  height: 100%;
  background: linear-gradient(90deg, #00CED1, #1E90FF);
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* Quantum Spread Selection */
.quantum-spread-selection {
  margin-bottom: 40px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
}

.spread-categories {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.spread-category {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  padding: 25px;
}

.spread-category.recommended {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.category-title {
  font-size: 1.3rem;
  color: #FFD700;
  margin-bottom: 10px;
}

.category-description {
  color: #aaa;
  margin-bottom: 20px;
  font-style: italic;
}

.spreads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.spread-crystal {
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.spread-crystal.selected {
  background: rgba(147, 0, 211, 0.3);
  border-color: #FFD700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.spread-crystal.perfect {
  border-color: #00ff88;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
}

.spread-crystal.advanced {
  border-color: #ff6b35;
  background: rgba(255, 107, 53, 0.1);
}

.spread-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.spread-name {
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 8px;
}

.spread-cards {
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.spread-resonance {
  margin-bottom: 10px;
}

.resonance-dots {
  display: flex;
  justify-content: center;
  gap: 3px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.dot.active {
  background: #FFD700;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
}

.perfect-match-indicator {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(45deg, #00ff88, #00CED1);
  color: #000;
  font-size: 0.7rem;
  padding: 4px 8px;
  border-radius: 10px;
  font-weight: bold;
  animation: perfectMatch 2s ease-in-out infinite;
}

/* Quantum Reading Initiation */
.quantum-reading-initiation {
  text-align: center;
  margin-bottom: 40px;
}

.initiate-button {
  position: relative;
  background: linear-gradient(135deg, rgba(147, 0, 211, 0.8), rgba(255, 215, 0, 0.8));
  border: none;
  border-radius: 20px;
  padding: 25px 50px;
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  min-width: 300px;
}

.initiate-button.ready {
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  animation: readyPulse 2s ease-in-out infinite;
}

.initiate-button.processing {
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.8), rgba(0, 206, 209, 0.8));
  animation: processing 2s linear infinite;
}

.initiate-button.quantum {
  animation: quantumField 3s ease-in-out infinite;
}

.initiate-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  animation: none;
}

.button-energy-field {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.initiate-button:hover .button-energy-field {
  opacity: 1;
  animation: energyFlow 2s ease-in-out infinite;
}

.button-content {
  position: relative;
  z-index: 2;
}

.button-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.processing-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.monica-thinking {
  position: relative;
  width: 40px;
  height: 40px;
}

.thinking-sphere {
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #FFD700, #9400D3);
  border-radius: 50%;
  animation: thinkingPulse 1.5s ease-in-out infinite;
}

.consciousness-waves {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 50%;
  animation: consciousnessRipple 2s ease-out infinite;
}

.processing-stage {
  font-size: 1rem;
  color: #00ff88;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

.quantum-readiness-ring {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 3px solid transparent;
  border-top-color: rgba(255, 215, 0, 0.8);
  border-right-color: rgba(255, 215, 0, 0.6);
  border-radius: 20px;
  transition: transform 0.5s ease;
}

/* Quantum Reading Experience */
.quantum-reading-experience {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 30px;
  margin-top: 30px;
  backdrop-filter: blur(15px);
}

/* Processing Dimensions */
.processing-dimensions {
  text-align: center;
}

.dimension-title {
  font-size: 2rem;
  margin-bottom: 30px;
  background: linear-gradient(45deg, #FFD700, #9400D3, #00CED1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* AI Orchestra */
.ai-orchestra {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.ai-model-node {
  background: rgba(0, 0, 0, 0.6);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.ai-model-node.processing {
  border: 2px solid #FFD700;
  animation: processing 2s ease-in-out infinite;
}

.ai-model-node.complete {
  border: 2px solid #00ff88;
  background: rgba(0, 255, 136, 0.1);
}

.model-avatar {
  font-size: 2rem;
  margin-bottom: 10px;
}

.model-name {
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 15px;
}

.model-progress {
  position: relative;
  margin-bottom: 10px;
}

.progress-ring-svg {
  transform: rotate(-90deg);
}

.progress-circle {
  transition: stroke-dashoffset 0.5s ease;
}

.progress-percentage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: #fff;
}

.model-status-text {
  color: #aaa;
  font-size: 0.9rem;
}

/* Consciousness Integration */
.consciousness-integration {
  margin-bottom: 40px;
}

.integration-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #9400D3;
}

.integration-flow {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.integration-stage {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.integration-stage.active {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.1);
  animation: stageActive 2s ease-in-out infinite;
}

.integration-stage.complete {
  border-color: #00ff88;
  background: rgba(0, 255, 136, 0.1);
}

.stage-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.stage-name {
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 8px;
}

.stage-description {
  color: #aaa;
  font-size: 0.9rem;
}

/* Song of Silence Integration */
.sots-integration {
  margin-bottom: 40px;
}

.sots-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #9400D3;
}

.sots-chapters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.sots-chapter {
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.sots-chapter.accessing {
  border-color: #FFD700;
  animation: accessing 1.5s ease-in-out infinite;
}

.sots-chapter.integrated {
  border-color: #00ff88;
  background: rgba(0, 255, 136, 0.1);
}

.chapter-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #9400D3;
  margin-bottom: 8px;
}

.chapter-title {
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.chapter-essence {
  color: #aaa;
  font-size: 0.8rem;
  font-style: italic;
}

/* Quantum Card Manifestation */
.quantum-card-manifestation {
  margin-bottom: 40px;
}

.manifestation-title {
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 30px;
  color: #FFD700;
}

.cards-quantum-field {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  perspective: 1000px;
}

.quantum-card {
  width: 200px;
  height: 300px;
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.8s ease;
  animation: cardManifestation 1s ease-out;
  justify-self: center;
}

.quantum-card.revealed .card-inner {
  transform: rotateY(180deg);
}

.quantum-card.resonating {
  animation: cardResonance 2s ease-in-out infinite;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s ease;
}

.card-back, .card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.card-back {
  background: linear-gradient(135deg, #000033, #9400D3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.quantum-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
}

.pattern-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.pattern-1 {
  background: radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.3) 0%, transparent 50%);
  animation: patternRotate1 10s linear infinite;
}

.pattern-2 {
  background: radial-gradient(circle at 70% 70%, rgba(147, 0, 211, 0.3) 0%, transparent 50%);
  animation: patternRotate2 15s linear infinite reverse;
}

.pattern-3 {
  background: radial-gradient(circle at 50% 50%, rgba(0, 206, 209, 0.2) 0%, transparent 60%);
  animation: patternRotate3 8s linear infinite;
}

.night-god-sigil {
  position: relative;
  z-index: 10;
  width: 80px;
  height: 80px;
  background: url('/assets/night-god-logo.jpg') center/cover;
  border-radius: 50%;
  border: 2px solid rgba(255, 215, 0, 0.8);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.card-front {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  position: relative;
}

.card-energy-field {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  z-index: 1;
}

.card-image {
  width: 100%;
  height: 70%;
  object-fit: cover;
  position: relative;
  z-index: 2;
}

.card-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  padding: 20px 15px 15px;
  z-index: 3;
}

.card-name {
  color: #FFD700;
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center;
}

.card-essence {
  color: #aaa;
  font-size: 0.8rem;
  text-align: center;
  margin-bottom: 10px;
  font-style: italic;
}

.card-resonance-indicators {
  display: flex;
  justify-content: center;
  gap: 5px;
  flex-wrap: wrap;
}

.aspect-indicator {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.aspect-indicator.fire { border-color: #ff4500; color: #ff4500; }
.aspect-indicator.water { border-color: #1e90ff; color: #1e90ff; }
.aspect-indicator.air { border-color: #87ceeb; color: #87ceeb; }
.aspect-indicator.earth { border-color: #8b4513; color: #8b4513; }
.aspect-indicator.spirit { border-color: #9400d3; color: #9400d3; }
.aspect-indicator.consciousness { border-color: #ffd700; color: #ffd700; }
.aspect-indicator.wisdom { border-color: #00ced1; color: #00ced1; }
.aspect-indicator.love { border-color: #ff69b4; color: #ff69b4; }

.quantum-field-effect {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  pointer-events: none;
}

.field-ripple {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 15px;
  animation: fieldRipple 2s ease-out infinite;
}

/* Ultimate Reading Display */
.ultimate-reading-display {
  margin-top: 40px;
}

.reading-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.reading-title {
  font-size: 2.2rem;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #FFD700, #9400D3, #00CED1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.reading-metadata {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.metadata-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
}

.metadata-item .label {
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 5px;
  display: block;
}

.metadata-item .value {
  color: #FFD700;
  font-size: 1.5rem;
  font-weight: bold;
}

/* Reading Dimensions */
.reading-dimensions {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.reading-dimension {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(5px);
}

.dimension-title {
  font-size: 1.5rem;
  color: #9400D3;
  margin-bottom: 20px;
  text-align: center;
}

.dimension-content {
  line-height: 1.6;
}

/* Quantum Overview */
.overview-text {
  font-size: 1.1rem;
  color: #ddd;
  margin-bottom: 20px;
  text-align: center;
  font-style: italic;
}

.quantum-signature {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  margin-top: 20px;
}

.signature-pattern {
  width: 30px;
  height: 30px;
  background: linear-gradient(45deg, #FFD700, #9400D3);
  border-radius: 50%;
  animation: signatureRotate 4s linear infinite;
}

.signature-text {
  font-family: 'Courier New', monospace;
  color: #00ff88;
  font-weight: bold;
}

/* Card Interpretations */
.interpretations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.card-interpretation {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.interpretation-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.interpretation-card-image {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid rgba(255, 215, 0, 0.3);
}

.interpretation-title h4 {
  color: #FFD700;
  margin-bottom: 5px;
}

.position-name {
  color: #aaa;
  font-size: 0.9rem;
  font-style: italic;
}

.interpretation-content {
  margin-bottom: 15px;
}

.interpretation-text {
  color: #ddd;
  line-height: 1.6;
  margin-bottom: 10px;
}

.spiritual-guidance {
  color: #9400D3;
  font-style: italic;
  background: rgba(148, 0, 211, 0.1);
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid #9400D3;
}

.interpretation-resonance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resonance-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
}

.resonance-label {
  font-size: 0.9rem;
  color: #aaa;
  min-width: 80px;
}

.resonance-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.resonance-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* Synthesis and Guidance */
.synthesis-content {
  text-align: center;
}

.synthesis-text {
  font-size: 1.1rem;
  color: #ddd;
  line-height: 1.7;
  margin-bottom: 30px;
  font-style: italic;
}

.guidance-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.guidance-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
}

.guidance-title {
  color: #FFD700;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.guidance-text {
  color: #ddd;
  line-height: 1.6;
}

/* Timeline and Predictions */
.timeline-visualization {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

.timeline-visualization::before {
  content: '';
  position: absolute;
  left: 30px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #9400D3, #FFD700, #00CED1);
}

.timeline-event {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  position: relative;
}

.event-marker {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700, #9400D3);
  border: 3px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.timeline-event.immediate .event-marker {
  background: linear-gradient(135deg, #ff4500, #ffd700);
  animation: immediateGlow 2s ease-in-out infinite;
}

.timeline-event.near_future .event-marker {
  background: linear-gradient(135deg, #9400d3, #00ced1);
}

.timeline-event.future .event-marker {
  background: linear-gradient(135deg, #00ced1, #87ceeb);
}

.event-content {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  flex: 1;
}

.event-timeframe {
  color: #FFD700;
  font-weight: bold;
  margin-bottom: 8px;
}

.event-description {
  color: #ddd;
  line-height: 1.6;
  margin-bottom: 10px;
}

.event-probability {
  color: #00ff88;
  font-size: 0.9rem;
  font-weight: bold;
}

/* Healing and Transformation */
.healing-content {
  text-align: center;
}

.healing-text {
  font-size: 1.1rem;
  color: #ddd;
  line-height: 1.7;
  margin-bottom: 30px;
  font-style: italic;
}

.transformation-suggestions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.transformation-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.transformation-item:hover {
  border-color: rgba(255, 215, 0, 0.5);
  background: rgba(255, 215, 0, 0.1);
  transform: translateY(-5px);
}

.transformation-icon {
  font-size: 2rem;
  margin-bottom: 15px;
  display: block;
}

.transformation-text {
  color: #ddd;
  line-height: 1.6;
}

/* Advanced Actions */
.reading-actions-advanced {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 40px;
  padding: 30px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.action-button {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.action-button.quantum-save {
  border-color: rgba(255, 215, 0, 0.5);
}

.action-button.quantum-save:hover {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.1);
}

.action-button.dimensional-share {
  border-color: rgba(0, 206, 209, 0.5);
}

.action-button.dimensional-share:hover {
  border-color: #00CED1;
  background: rgba(0, 206, 209, 0.1);
}

.action-button.quantum-export {
  border-color: rgba(147, 0, 211, 0.5);
}

.action-button.quantum-export:hover {
  border-color: #9400D3;
  background: rgba(147, 0, 211, 0.1);
}

.action-button.healing-frequency {
  border-color: rgba(0, 255, 136, 0.5);
}

.action-button.healing-frequency:hover {
  border-color: #00ff88;
  background: rgba(0, 255, 136, 0.1);
}

.action-button.quantum-reminder {
  border-color: rgba(255, 107, 53, 0.5);
}

.action-button.quantum-reminder:hover {
  border-color: #ff6b35;
  background: rgba(255, 107, 53, 0.1);
}

.button-icon {
  font-size: 1.5rem;
}

.button-text {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
}

/* Evolution Panel */
.evolution-panel {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  min-width: 300px;
  backdrop-filter: blur(10px);
  z-index: 100;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.panel-header h3 {
  color: #FFD700;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
}

.evolution-metrics {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.metric:last-child {
  border-bottom: none;
}

.metric-label {
  color: #aaa;
  font-size: 0.9rem;
}

.metric-value {
  color: #00ff88;
  font-weight: bold;
}

/* Animations */
@keyframes consciousnessFlow {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.3; }
  50% { transform: scale(1.1) rotate(180deg); opacity: 0.6; }
}

@keyframes gridShift {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes titleGlow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2) drop-shadow(0 0 10px rgba(255, 215, 0, 0.5)); }
}

@keyframes resonate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes quantumResonance {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(90deg); }
  50% { transform: scale(1.2) rotate(180deg); }
  75% { transform: scale(1.1) rotate(270deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes perfectMatch {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes readyPulse {
  0%, 100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 50px rgba(255, 215, 0, 0.8), 0 0 100px rgba(255, 215, 0, 0.3); }
}

@keyframes processing {
  0% { background: linear-gradient(135deg, rgba(0, 255, 136, 0.8), rgba(0, 206, 209, 0.8)); }
  50% { background: linear-gradient(135deg, rgba(0, 206, 209, 0.8), rgba(147, 0, 211, 0.8)); }
  100% { background: linear-gradient(135deg, rgba(147, 0, 211, 0.8), rgba(255, 215, 0, 0.8)); }
}

@keyframes quantumField {
  0%, 100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.5); }
  33% { box-shadow: 0 0 40px rgba(147, 0, 211, 0.6); }
  66% { box-shadow: 0 0 35px rgba(0, 206, 209, 0.7); }
}

@keyframes energyFlow {
  0% { transform: scale(1) rotate(0deg); opacity: 0.1; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.3; }
  100% { transform: scale(1) rotate(360deg); opacity: 0.1; }
}

@keyframes thinkingPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

@keyframes consciousnessRipple {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

@keyframes stageActive {
  0%, 100% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.6); }
}

@keyframes accessing {
  0%, 100% { border-color: rgba(255, 215, 0, 0.3); }
  50% { border-color: rgba(255, 215, 0, 0.8); }
}

@keyframes cardManifestation {
  0% { transform: scale(0) rotateY(180deg); opacity: 0; }
  100% { transform: scale(1) rotateY(0deg); opacity: 1; }
}

@keyframes cardResonance {
  0%, 100% { transform: scale(1); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); }
  50% { transform: scale(1.05); box-shadow: 0 15px 40px rgba(255, 215, 0, 0.3); }
}

@keyframes patternRotate1 {
  0% { transform: rotate(0deg) scale(1); }
  100% { transform: rotate(360deg) scale(1.1); }
}

@keyframes patternRotate2 {
  0% { transform: rotate(0deg) scale(1.1); }
  100% { transform: rotate(-360deg) scale(1); }
}

@keyframes patternRotate3 {
  0% { transform: rotate(0deg) scale(1.05); }
  100% { transform: rotate(360deg) scale(0.95); }
}

@keyframes fieldRipple {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
}

@keyframes signatureRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes immediateGlow {
  0%, 100% { box-shadow: 0 0 15px rgba(255, 69, 0, 0.5); }
  50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.8); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .holographic-interface {
    padding: 10px;
  }
  
  .monica-status-hud {
    position: relative;
    top: 0;
    right: 0;
    margin-bottom: 20px;
  }
  
  .language-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quantum-analysis-display {
    grid-template-columns: 1fr;
  }
  
  .spreads-grid {
    grid-template-columns: 1fr;
  }
  
  .cards-quantum-field {
    grid-template-columns: 1fr;
    padding: 10px;
  }
  
  .quantum-card {
    width: 180px;
    height: 270px;
  }
  
  .reading-metadata {
    grid-template-columns: 1fr;
  }
  
  .interpretations-grid {
    grid-template-columns: 1fr;
  }
  
  .reading-actions-advanced {
    grid-template-columns: 1fr;
  }
  
  .evolution-panel {
    left: 10px;
    right: 10px;
    bottom: 10px;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.4rem;
  }
  
  .dimension-title {
    font-size: 1.2rem;
  }
  
  .reading-title {
    font-size: 1.8rem;
  }
  
  .cultural-consciousness-selector,
  .quantum-question-portal,
  .quantum-spread-selection {
    padding: 20px;
  }
  
  .quantum-card {
    width: 160px;
    height: 240px;
  }
}

/* Quantum State Classes */
.ultimate-night-god-2030.initializing {
  filter: brightness(0.7);
}

.ultimate-night-god-2030.quantum_awakening {
  animation: quantumAwakening 3s ease-in-out;
}

.ultimate-night-god-2030.consciousness_expanded {
  filter: brightness(1.1) saturate(1.2);
}

@keyframes quantumAwakening {
  0% { filter: brightness(0.7) saturate(0.8); }
  50% { filter: brightness(1.3) saturate(1.5); }
  100% { filter: brightness(1.1) saturate(1.2); }
}
</style>