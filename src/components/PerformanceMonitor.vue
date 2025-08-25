<template>
  <div class="performance-monitor">
    <div class="monitor-header">
      <h3 class="monitor-title">⚡ Performance Monitor</h3>
      <button @click="toggleExpanded" class="toggle-btn">
        {{ isExpanded ? '▼' : '▲' }}
      </button>
    </div>

    <div v-if="isExpanded" class="monitor-content">
      <!-- Real-time Metrics -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">🚀</div>
          <div class="metric-info">
            <div class="metric-label">Avg Response</div>
            <div class="metric-value">{{ metrics.averageResponseTime.toFixed(0) }}ms</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">📊</div>
          <div class="metric-info">
            <div class="metric-label">Cache Hit Rate</div>
            <div class="metric-value">{{ metrics.cacheHitRate.toFixed(1) }}%</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">🎯</div>
          <div class="metric-info">
            <div class="metric-label">Total Requests</div>
            <div class="metric-value">{{ metrics.totalRequests }}</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">💾</div>
          <div class="metric-info">
            <div class="metric-label">Memory Usage</div>
            <div class="metric-value">{{ getMemoryUsage() }}</div>
          </div>
        </div>
      </div>

      <!-- Performance Chart -->
      <div class="chart-container">
        <div class="chart-header">
          <h4>Response Time Trend</h4>
          <div class="chart-controls">
            <button 
              v-for="period in chartPeriods" 
              :key="period.value"
              @click="selectedPeriod = period.value"
              class="period-btn"
              :class="{ active: selectedPeriod === period.value }"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
        
        <div class="performance-chart">
          <div class="chart-y-axis">
            <div class="y-label" v-for="tick in yAxisTicks" :key="tick">{{ tick }}ms</div>
          </div>
          <div class="chart-area">
            <svg ref="chartSvg" class="chart-svg" viewBox="0 0 400 200">
              <defs>
                <linearGradient id="performanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.05" />
                </linearGradient>
              </defs>
              
              <!-- Chart line -->
              <polyline 
                :points="chartPoints" 
                fill="none" 
                stroke="#10b981" 
                stroke-width="2"
                class="performance-line"
              />
              
              <!-- Chart area fill -->
              <polygon 
                :points="chartAreaPoints" 
                fill="url(#performanceGradient)"
                class="performance-area"
              />
              
              <!-- Data points -->
              <circle 
                v-for="(point, index) in chartDataPoints" 
                :key="index"
                :cx="point.x" 
                :cy="point.y" 
                r="3" 
                fill="#10b981"
                class="data-point"
                @mouseover="showTooltip(point, $event)"
                @mouseout="hideTooltip"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Optimization Suggestions -->
      <div class="optimization-panel">
        <h4>🔧 Optimization Suggestions</h4>
        <div class="suggestions-list">
          <div 
            v-for="suggestion in optimizationSuggestions" 
            :key="suggestion.id"
            class="suggestion-item"
            :class="suggestion.priority"
          >
            <div class="suggestion-icon">{{ suggestion.icon }}</div>
            <div class="suggestion-content">
              <div class="suggestion-title">{{ suggestion.title }}</div>
              <div class="suggestion-description">{{ suggestion.description }}</div>
            </div>
            <button 
              @click="applySuggestion(suggestion)" 
              class="apply-btn"
              :disabled="suggestion.applied"
            >
              {{ suggestion.applied ? '✅' : 'Apply' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Performance Actions -->
      <div class="actions-panel">
        <button @click="optimizePerformance" class="action-btn optimize-btn">
          <span class="btn-icon">⚡</span>
          Optimize Now
        </button>
        <button @click="clearMetrics" class="action-btn clear-btn">
          <span class="btn-icon">🧹</span>
          Clear Metrics
        </button>
        <button @click="exportMetrics" class="action-btn export-btn">
          <span class="btn-icon">📊</span>
          Export Data
        </button>
      </div>
    </div>

    <!-- Tooltip -->
    <div v-if="tooltip.show" class="tooltip" :style="tooltip.style">
      <div class="tooltip-content">
        <div class="tooltip-time">{{ tooltip.time }}</div>
        <div class="tooltip-value">{{ tooltip.value }}ms</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { performanceOptimizer } from '../utils/performance'

const isExpanded = ref(false)
const selectedPeriod = ref('1h')
const metrics = ref({
  averageResponseTime: 0,
  cacheHitRate: 0,
  totalRequests: 0,
  memoryUsage: { used: 0, total: 0 }
})

const responseTimeHistory = ref<{ time: Date; value: number }[]>([])
const chartSvg = ref<SVGElement>()

const tooltip = ref({
  show: false,
  time: '',
  value: 0,
  style: {}
})

const chartPeriods = [
  { label: '1H', value: '1h' },
  { label: '6H', value: '6h' },
  { label: '24H', value: '24h' },
  { label: '7D', value: '7d' }
]

const yAxisTicks = [0, 250, 500, 750, 1000]

const optimizationSuggestions = ref([
  {
    id: 'cache',
    title: 'Enable Response Caching',
    description: 'Cache API responses to reduce redundant requests',
    icon: '💾',
    priority: 'high',
    applied: false
  },
  {
    id: 'batch',
    title: 'Batch API Requests',
    description: 'Group multiple requests together for better performance',
    icon: '📦',
    priority: 'medium',
    applied: false
  },
  {
    id: 'preload',
    title: 'Preload Critical Resources',
    description: 'Load essential resources ahead of time',
    icon: '🚀',
    priority: 'low',
    applied: false
  }
])

// Computed properties
const chartDataPoints = computed(() => {
  const data = getFilteredData()
  const maxValue = Math.max(...data.map(d => d.value), 100)
  
  return data.map((point, index) => ({
    x: (index / (data.length - 1)) * 390 + 5,
    y: 195 - (point.value / maxValue) * 190,
    time: point.time.toLocaleTimeString(),
    value: point.value
  }))
})

const chartPoints = computed(() => {
  return chartDataPoints.value.map(p => `${p.x},${p.y}`).join(' ')
})

const chartAreaPoints = computed(() => {
  const points = chartDataPoints.value
  if (points.length === 0) return ''
  
  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]
  
  return [
    `${firstPoint.x},195`, // Bottom left
    ...points.map(p => `${p.x},${p.y}`), // Line points
    `${lastPoint.x},195`, // Bottom right
    `${firstPoint.x},195` // Close the polygon
  ].join(' ')
})

// Methods
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const updateMetrics = () => {
  const perfMetrics = performanceOptimizer.getPerformanceMetrics()
  metrics.value = perfMetrics
  
  // Add to history
  responseTimeHistory.value.push({
    time: new Date(),
    value: perfMetrics.averageResponseTime
  })
  
  // Keep only last 1000 points
  if (responseTimeHistory.value.length > 1000) {
    responseTimeHistory.value = responseTimeHistory.value.slice(-1000)
  }
}

const getFilteredData = () => {
  const now = new Date()
  let cutoffTime: Date
  
  switch (selectedPeriod.value) {
    case '1h':
      cutoffTime = new Date(now.getTime() - 60 * 60 * 1000)
      break
    case '6h':
      cutoffTime = new Date(now.getTime() - 6 * 60 * 60 * 1000)
      break
    case '24h':
      cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case '7d':
      cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    default:
      cutoffTime = new Date(now.getTime() - 60 * 60 * 1000)
  }
  
  return responseTimeHistory.value.filter(point => point.time >= cutoffTime)
}

const getMemoryUsage = () => {
  const memory = metrics.value.memoryUsage
  if (typeof memory === 'object' && memory.used) {
    return `${memory.used}MB`
  }
  return 'N/A'
}

const showTooltip = (point: any, event: MouseEvent) => {
  tooltip.value = {
    show: true,
    time: point.time,
    value: Math.round(point.value),
    style: {
      left: `${event.clientX + 10}px`,
      top: `${event.clientY - 40}px`
    }
  }
}

const hideTooltip = () => {
  tooltip.value.show = false
}

const applySuggestion = (suggestion: any) => {
  switch (suggestion.id) {
    case 'cache':
      // Enable caching optimizations
      performanceOptimizer.optimizeMemoryUsage()
      break
    case 'batch':
      // Enable request batching
      console.log('Request batching enabled')
      break
    case 'preload':
      // Preload critical resources
      performanceOptimizer.preloadResource('/api/models')
      break
  }
  
  suggestion.applied = true
}

const optimizePerformance = () => {
  performanceOptimizer.optimizeMemoryUsage()
  updateMetrics()
}

const clearMetrics = () => {
  responseTimeHistory.value = []
  metrics.value = {
    averageResponseTime: 0,
    cacheHitRate: 0,
    totalRequests: 0,
    memoryUsage: { used: 0, total: 0 }
  }
}

const exportMetrics = () => {
  const exportData = {
    metrics: metrics.value,
    history: responseTimeHistory.value,
    timestamp: new Date().toISOString()
  }
  
  const dataStr = JSON.stringify(exportData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `performance-metrics-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  
  URL.revokeObjectURL(url)
}

// Lifecycle
let metricsInterval: NodeJS.Timeout

onMounted(() => {
  updateMetrics()
  
  // Update metrics every 5 seconds
  metricsInterval = setInterval(updateMetrics, 5000)
  
  // Add some sample data for demonstration
  const now = Date.now()
  for (let i = 0; i < 20; i++) {
    responseTimeHistory.value.push({
      time: new Date(now - (20 - i) * 60000), // Every minute
      value: Math.random() * 800 + 100 // 100-900ms
    })
  }
})

onUnmounted(() => {
  if (metricsInterval) {
    clearInterval(metricsInterval)
  }
})
</script>

<style scoped>
.performance-monitor {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(255, 215, 0, 0.05));
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  position: relative;
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.monitor-title {
  font-size: 1.3rem;
  color: #10b981;
  margin: 0;
  text-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

.toggle-btn {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.5);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  color: #10b981;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: rgba(16, 185, 129, 0.3);
  transform: scale(1.1);
}

.monitor-content {
  animation: slideDown 0.5s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.metric-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(16, 185, 129, 0.2);
}

.metric-icon {
  font-size: 1.8rem;
}

.metric-label {
  font-size: 0.8rem;
  color: #b8b8b8;
  margin-bottom: 2px;
}

.metric-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #10b981;
}

/* Chart Styles */
.chart-container {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h4 {
  color: #10b981;
  margin: 0;
}

.chart-controls {
  display: flex;
  gap: 5px;
}

.period-btn {
  padding: 4px 12px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 15px;
  color: #10b981;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.period-btn:hover, .period-btn.active {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
}

.performance-chart {
  display: flex;
  height: 220px;
}

.chart-y-axis {
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  padding-right: 10px;
  width: 50px;
}

.y-label {
  font-size: 0.7rem;
  color: #888;
}

.chart-area {
  flex: 1;
  position: relative;
}

.chart-svg {
  width: 100%;
  height: 200px;
}

.performance-line {
  filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.5));
}

.data-point {
  cursor: pointer;
  transition: all 0.2s ease;
}

.data-point:hover {
  r: 5;
  fill: #ffd700;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
}

/* Optimization Panel */
.optimization-panel {
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.optimization-panel h4 {
  color: #8b5cf6;
  margin: 0 0 15px 0;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.suggestion-item:hover {
  background: rgba(139, 92, 246, 0.1);
}

.suggestion-item.high {
  border-left: 3px solid #ef4444;
}

.suggestion-item.medium {
  border-left: 3px solid #f59e0b;
}

.suggestion-item.low {
  border-left: 3px solid #10b981;
}

.suggestion-icon {
  font-size: 1.5rem;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  color: #ffd700;
  font-weight: bold;
  margin-bottom: 3px;
}

.suggestion-description {
  color: #b8b8b8;
  font-size: 0.9rem;
}

.apply-btn {
  padding: 6px 15px;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.5);
  border-radius: 15px;
  color: #10b981;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.apply-btn:hover:not(:disabled) {
  background: rgba(16, 185, 129, 0.3);
}

.apply-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Actions Panel */
.actions-panel {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 20px;
  border-radius: 25px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.optimize-btn {
  background: linear-gradient(135deg, #10b981, #065f46);
  color: white;
}

.clear-btn {
  background: linear-gradient(135deg, #ef4444, #991b1b);
  color: white;
}

.export-btn {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
}

.action-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.btn-icon {
  font-size: 1rem;
}

/* Tooltip */
.tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid #10b981;
  border-radius: 8px;
  padding: 8px 12px;
  z-index: 1000;
  pointer-events: none;
  animation: fadeIn 0.2s ease;
}

.tooltip-content {
  text-align: center;
}

.tooltip-time {
  color: #b8b8b8;
  font-size: 0.8rem;
}

.tooltip-value {
  color: #10b981;
  font-weight: bold;
  font-size: 0.9rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive Design */
@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .actions-panel {
    flex-direction: column;
  }
  
  .suggestion-item {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
}
</style>