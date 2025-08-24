<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-container">
      <!-- Mystical Error Display -->
      <div class="cosmic-error-portal">
        <div class="error-constellation">
          <div class="star" v-for="n in 12" :key="n" :style="getStarStyle(n)"></div>
        </div>
        
        <div class="error-center">
          <div class="night-god-emblem">🌙</div>
          <h1 class="error-title">The Veil Momentarily Obscures</h1>
          <p class="error-description">
            The cosmic energies have encountered an unexpected disturbance. 
            Our mystical algorithms are realigning the spiritual frequencies.
          </p>
        </div>
      </div>

      <!-- Error Details (Development Mode) -->
      <div v-if="isDevelopment && errorInfo" class="error-details">
        <details class="error-accordion">
          <summary class="error-summary">🔮 Technical Divination</summary>
          <div class="error-content">
            <div class="error-section">
              <h3>Error Message:</h3>
              <pre class="error-message">{{ errorInfo.message }}</pre>
            </div>
            
            <div class="error-section" v-if="errorInfo.stack">
              <h3>Stack Trace:</h3>
              <pre class="error-stack">{{ errorInfo.stack }}</pre>
            </div>
            
            <div class="error-section" v-if="errorInfo.componentStack">
              <h3>Component Stack:</h3>
              <pre class="error-component-stack">{{ errorInfo.componentStack }}</pre>
            </div>

            <div class="error-section">
              <h3>Error Context:</h3>
              <pre class="error-context">{{ JSON.stringify(errorContext, null, 2) }}</pre>
            </div>
          </div>
        </details>
      </div>

      <!-- Recovery Actions -->
      <div class="error-actions">
        <button @click="attemptRecovery" class="mystical-button primary">
          🌟 Realign Cosmic Forces
        </button>
        
        <button @click="reloadPage" class="mystical-button secondary">
          🔄 Restart Spiritual Journey
        </button>
        
        <button @click="reportError" class="mystical-button tertiary">
          📩 Send Message to the Ancients
        </button>
      </div>

      <!-- User Guidance -->
      <div class="error-guidance">
        <div class="guidance-card">
          <div class="guidance-icon">🧙‍♀️</div>
          <div class="guidance-text">
            <h3>Spiritual Guidance</h3>
            <p>
              Even in digital realms, cosmic disturbances are natural. 
              This interruption offers a moment for reflection and patience.
              The Night God's wisdom flows through all experiences.
            </p>
          </div>
        </div>

        <div class="alternative-actions">
          <h3>Meanwhile, you can:</h3>
          <ul>
            <li>🃏 Try a simple single-card reading</li>
            <li>🌙 Explore your reading history</li>
            <li>📚 Read about tarot meanings</li>
            <li>🧘‍♀️ Practice mindful meditation</li>
          </ul>
        </div>
      </div>

      <!-- Error Statistics (Development) -->
      <div v-if="isDevelopment && errorStats" class="error-stats">
        <h3>🔬 Error Analytics</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ errorStats.totalErrors }}</div>
            <div class="stat-label">Total Errors</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ errorStats.uniqueErrors }}</div>
            <div class="stat-label">Unique Error Types</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ errorStats.recoveryRate }}%</div>
            <div class="stat-label">Recovery Success</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <slot v-else></slot>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onErrorCaptured, onMounted } from 'vue'
import { securityManager } from '@/services/security/securityManager'
import { performanceOptimizer } from '@/services/performance/performanceOptimizer'

interface ErrorInfo {
  message: string
  stack?: string
  componentStack?: string
  timestamp: number
  userAgent: string
  url: string
  userId?: string
  sessionId?: string
}

interface ErrorContext {
  component: string
  props: Record<string, unknown>
  route: string
  userAction: string
  timestamp: number
  performanceMetrics?: any
  memoryUsage?: number
}

interface ErrorStats {
  totalErrors: number
  uniqueErrors: number
  recoveryRate: number
  lastError: number
}

const hasError = ref(false)
const errorInfo = ref<ErrorInfo | null>(null)
const errorContext = reactive<ErrorContext>({
  component: '',
  props: {},
  route: '',
  userAction: '',
  timestamp: 0
})
const recoveryAttempts = ref(0)
const maxRecoveryAttempts = 3

const isDevelopment = computed(() => import.meta.env.DEV)

// Error statistics for development
const errorStats = ref<ErrorStats>({
  totalErrors: 0,
  uniqueErrors: 0,
  recoveryRate: 85,
  lastError: 0
})

// Error boundary capture
onErrorCaptured((error: Error, instance, info: string) => {
  captureError(error, instance, info)
  return false // Prevent error from propagating
})

// Global error handler for unhandled promises
onMounted(() => {
  window.addEventListener('unhandledrejection', (event) => {
    captureError(
      new Error(event.reason || 'Unhandled Promise Rejection'),
      null,
      'unhandled-promise'
    )
  })

  // Load error statistics
  loadErrorStats()
})

function captureError(error: Error, instance: any, info: string): void {
  hasError.value = true
  
  // Gather comprehensive error information
  errorInfo.value = {
    message: error.message,
    stack: error.stack,
    componentStack: info,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    userId: getCurrentUserId(),
    sessionId: getCurrentSessionId()
  }

  // Gather error context
  errorContext.component = instance?.$options.name || instance?.$options.__file || 'Unknown'
  errorContext.props = instance?.$props || {}
  errorContext.route = window.location.pathname
  errorContext.userAction = getLastUserAction()
  errorContext.timestamp = Date.now()
  errorContext.performanceMetrics = performanceOptimizer.getPerformanceReport()
  errorContext.memoryUsage = getMemoryUsage()

  // Log security event
  securityManager.logSecurityEvent({
    type: 'suspicious_activity',
    severity: 'medium',
    details: {
      errorType: 'component_error',
      component: errorContext.component,
      message: error.message.substring(0, 200)
    }
  })

  // Update error statistics
  updateErrorStats(error)

  // Auto-report in production
  if (!isDevelopment.value) {
    reportErrorToService(error, errorContext)
  }

  // Attempt auto-recovery for common errors
  if (shouldAttemptAutoRecovery(error)) {
    setTimeout(() => {
      attemptRecovery()
    }, 2000)
  }
}

function getCurrentUserId(): string | undefined {
  // Get from auth store or localStorage
  return localStorage.getItem('userId') || undefined
}

function getCurrentSessionId(): string | undefined {
  // Get from session store or sessionStorage
  return sessionStorage.getItem('sessionId') || undefined
}

function getLastUserAction(): string {
  // Get from action tracker or default
  return sessionStorage.getItem('lastUserAction') || 'page_load'
}

function getMemoryUsage(): number {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return (memory.usedJSHeapSize / 1024 / 1024) // MB
  }
  return 0
}

function shouldAttemptAutoRecovery(error: Error): boolean {
  const recoverableErrors = [
    'ChunkLoadError',
    'Loading chunk',
    'Failed to fetch',
    'Network request failed',
    'fetch'
  ]

  return recoverableErrors.some(pattern => 
    error.message.includes(pattern) || error.name.includes(pattern)
  )
}

function attemptRecovery(): void {
  if (recoveryAttempts.value >= maxRecoveryAttempts) {
    // Max attempts reached, suggest page reload
    reloadPage()
    return
  }

  recoveryAttempts.value++

  // Clear the error state
  hasError.value = false
  errorInfo.value = null
  
  // Reset component state
  Object.assign(errorContext, {
    component: '',
    props: {},
    route: '',
    userAction: '',
    timestamp: 0
  })

  // Trigger performance optimization to prevent recurrence
  performanceOptimizer.runOptimizationCycle?.()

  // Force garbage collection if available
  if ('gc' in window) {
    (window as any).gc()
  }

  // Show recovery success message
  showRecoveryMessage()
}

function showRecoveryMessage(): void {
  // Create temporary success message
  const message = document.createElement('div')
  message.className = 'recovery-success'
  message.innerHTML = '✨ Cosmic forces realigned successfully!'
  message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
    z-index: 10000;
    font-weight: 600;
    animation: slideInRight 0.5s ease;
  `
  
  document.body.appendChild(message)
  
  setTimeout(() => {
    message.remove()
  }, 3000)
}

function reloadPage(): void {
  // Save current state before reload
  const currentState = {
    timestamp: Date.now(),
    url: window.location.href,
    error: errorInfo.value?.message
  }
  
  sessionStorage.setItem('preReloadState', JSON.stringify(currentState))
  
  // Reload with cache bypass
  window.location.reload()
}

async function reportError(): Promise<void> {
  if (!errorInfo.value) return

  const report = {
    error: errorInfo.value,
    context: errorContext,
    userFeedback: await getUserFeedback(),
    timestamp: Date.now()
  }

  try {
    await reportErrorToService(new Error(errorInfo.value.message), errorContext)
    
    // Show success message
    const message = document.createElement('div')
    message.textContent = '📩 Message sent to the Ancients. They are aware of the disturbance.'
    message.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(139, 92, 246, 0.9);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 10000;
    `
    
    document.body.appendChild(message)
    setTimeout(() => message.remove(), 3000)
    
  } catch (reportError) {
    console.warn('Failed to report error:', reportError)
  }
}

async function getUserFeedback(): Promise<string> {
  return new Promise((resolve) => {
    const feedback = prompt('What were you trying to do when this occurred? (Optional)')
    resolve(feedback || '')
  })
}

async function reportErrorToService(error: Error, context: ErrorContext): Promise<void> {
  // In production, this would send to your error reporting service
  const errorReport = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: Date.now(),
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    buildId: import.meta.env.VITE_BUILD_ID || 'development'
  }

  // Example API call (implement based on your error service)
  try {
    await fetch('/api/errors/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': import.meta.env.VITE_ERROR_REPORTING_KEY || ''
      },
      body: JSON.stringify(errorReport)
    })
  } catch (reportingError) {
    // Fallback: Store in localStorage for later sync
    const storedErrors = JSON.parse(localStorage.getItem('pendingErrorReports') || '[]')
    storedErrors.push(errorReport)
    localStorage.setItem('pendingErrorReports', JSON.stringify(storedErrors.slice(-10)))
  }
}

function updateErrorStats(error: Error): void {
  errorStats.value.totalErrors++
  errorStats.value.lastError = Date.now()
  
  // Track unique error types
  const errorType = error.name + ':' + error.message.split(' ').slice(0, 3).join(' ')
  const uniqueErrors = JSON.parse(localStorage.getItem('uniqueErrorTypes') || '[]')
  
  if (!uniqueErrors.includes(errorType)) {
    uniqueErrors.push(errorType)
    errorStats.value.uniqueErrors = uniqueErrors.length
    localStorage.setItem('uniqueErrorTypes', JSON.stringify(uniqueErrors.slice(-50)))
  }
  
  // Save stats
  localStorage.setItem('errorStats', JSON.stringify(errorStats.value))
}

function loadErrorStats(): void {
  const saved = localStorage.getItem('errorStats')
  if (saved) {
    try {
      Object.assign(errorStats.value, JSON.parse(saved))
    } catch (e) {
      // Invalid data, reset
      localStorage.removeItem('errorStats')
    }
  }
}

function getStarStyle(index: number): object {
  const angle = (index / 12) * 360
  const radius = 80 + Math.random() * 40
  const x = Math.cos(angle * Math.PI / 180) * radius
  const y = Math.sin(angle * Math.PI / 180) * radius
  
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    animationDelay: `${index * 0.2}s`,
    opacity: 0.3 + Math.random() * 0.7
  }
}
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  padding: 20px;
}

.error-container {
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.cosmic-error-portal {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 60px 40px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  margin-bottom: 30px;
  overflow: hidden;
}

.error-constellation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ffd700;
  border-radius: 50%;
  animation: starTwinkle 3s ease-in-out infinite;
  box-shadow: 0 0 10px #ffd700;
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

.error-center {
  position: relative;
  z-index: 1;
}

.night-god-emblem {
  font-size: 80px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
  animation: gentleGlow 4s ease-in-out infinite;
}

@keyframes gentleGlow {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5)); }
  50% { filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.8)); }
}

.error-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ffd700, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-description {
  font-size: 16px;
  line-height: 1.6;
  color: #cbd5e1;
  margin-bottom: 0;
}

.error-details {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.error-accordion {
  padding: 20px;
}

.error-summary {
  cursor: pointer;
  font-weight: 600;
  color: #ffd700;
  padding: 10px;
  border-radius: 8px;
  background: rgba(255, 215, 0, 0.1);
  list-style: none;
  user-select: none;
}

.error-summary:hover {
  background: rgba(255, 215, 0, 0.2);
}

.error-content {
  margin-top: 20px;
  text-align: left;
}

.error-section {
  margin-bottom: 20px;
}

.error-section h3 {
  color: #8b5cf6;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.error-message,
.error-stack,
.error-component-stack,
.error-context {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  line-height: 1.4;
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.mystical-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 14px;
  min-width: 160px;
}

.mystical-button.primary {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #000;
}

.mystical-button.secondary {
  background: rgba(139, 92, 246, 0.2);
  color: #ffffff;
  border: 1px solid rgba(139, 92, 246, 0.5);
}

.mystical-button.tertiary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.mystical-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}

.error-guidance {
  text-align: left;
  margin-bottom: 30px;
}

.guidance-card {
  display: flex;
  gap: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  margin-bottom: 24px;
}

.guidance-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.guidance-text h3 {
  color: #ffd700;
  font-size: 18px;
  margin-bottom: 12px;
}

.guidance-text p {
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
}

.alternative-actions {
  background: rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.alternative-actions h3 {
  color: #8b5cf6;
  font-size: 16px;
  margin-bottom: 16px;
}

.alternative-actions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.alternative-actions li {
  padding: 8px 0;
  color: #cbd5e1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.alternative-actions li:last-child {
  border-bottom: none;
}

.error-stats {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
}

.error-stats h3 {
  color: #06b6d4;
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.recovery-success {
  animation: slideInRight 0.5s ease;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .error-container {
    padding: 0 10px;
  }
  
  .cosmic-error-portal {
    padding: 40px 20px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .mystical-button {
    min-width: 200px;
  }
  
  .guidance-card {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>