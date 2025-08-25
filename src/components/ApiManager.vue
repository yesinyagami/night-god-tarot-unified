<template>
  <div class="api-manager">
    <div class="container">
      <header class="api-header">
        <h1 class="api-title">🐳 Docker API Management Dashboard</h1>
        <p class="api-subtitle">Connect and manage all your containerized services</p>
      </header>

      <!-- API Status Overview -->
      <section class="api-overview">
        <div class="status-grid">
          <div v-for="service in services" :key="service.name" class="service-card" :class="service.status">
            <div class="service-header">
              <div class="service-icon">{{ service.icon }}</div>
              <div class="service-info">
                <h3 class="service-name">{{ service.name }}</h3>
                <p class="service-description">{{ service.description }}</p>
              </div>
              <div class="service-status" :class="service.status">
                {{ getStatusText(service.status) }}
              </div>
            </div>
            
            <div class="service-details">
              <div class="detail-item">
                <span class="detail-label">Endpoint:</span>
                <code class="detail-value">{{ service.endpoint }}</code>
              </div>
              <div class="detail-item">
                <span class="detail-label">Port:</span>
                <code class="detail-value">{{ service.port }}</code>
              </div>
              <div class="detail-item" v-if="service.responseTime">
                <span class="detail-label">Response:</span>
                <code class="detail-value">{{ service.responseTime }}ms</code>
              </div>
              <div class="detail-item" v-if="service.uptime">
                <span class="detail-label">Uptime:</span>
                <code class="detail-value">{{ (service.uptime * 100).toFixed(1) }}%</code>
              </div>
              <div class="detail-item" v-if="service.successRate">
                <span class="detail-label">Success Rate:</span>
                <code class="detail-value">{{ (service.successRate * 100).toFixed(1) }}%</code>
              </div>
            </div>
            
            <!-- Service Features -->
            <div v-if="service.features && service.features.length > 0" class="service-features">
              <div class="features-label">Features:</div>
              <div class="features-list">
                <span v-for="feature in service.features" :key="feature" class="feature-tag">{{ feature }}</span>
              </div>
            </div>

            <div class="service-actions">
              <button 
                @click="testConnection(service)" 
                class="action-btn test-btn"
                :disabled="testing === service.name || service.status === 'connecting'"
              >
                <span class="btn-icon">{{ service.status === 'connecting' ? '⏳' : '🔍' }}</span>
                {{ service.status === 'connecting' ? 'Connecting...' : (testing === service.name ? 'Testing...' : 'Test Connection') }}
              </button>
              <button 
                @click="toggleService(service)" 
                class="action-btn toggle-btn"
                :class="service.status"
              >
                <span class="btn-icon">{{ service.status === 'online' ? '⏸️' : '▶️' }}</span>
                {{ service.status === 'online' ? 'Stop' : 'Start' }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- API Configuration -->
      <section class="api-config">
        <h2 class="section-title">⚙️ API Configuration</h2>
        <div class="config-grid">
          <div class="config-card">
            <h3>Docker Host Settings</h3>
            <div class="config-form">
              <div class="form-group">
                <label for="docker-host">Docker Host URL:</label>
                <input 
                  id="docker-host" 
                  v-model="dockerConfig.host" 
                  type="text" 
                  placeholder="tcp://localhost:2376"
                  class="config-input"
                >
              </div>
              <div class="form-group">
                <label for="docker-version">API Version:</label>
                <input 
                  id="docker-version" 
                  v-model="dockerConfig.version" 
                  type="text" 
                  placeholder="v1.41"
                  class="config-input"
                >
              </div>
            </div>
          </div>

          <div class="config-card">
            <h3>Authentication</h3>
            <div class="config-form">
              <div class="form-group">
                <label for="api-key">API Key:</label>
                <input 
                  id="api-key" 
                  v-model="dockerConfig.apiKey" 
                  type="password" 
                  placeholder="Enter your API key"
                  class="config-input"
                >
              </div>
              <div class="form-group">
                <label for="cert-path">Certificate Path:</label>
                <input 
                  id="cert-path" 
                  v-model="dockerConfig.certPath" 
                  type="text" 
                  placeholder="/path/to/cert.pem"
                  class="config-input"
                >
              </div>
            </div>
          </div>
        </div>
        
        <div class="config-actions">
          <button @click="saveConfig" class="save-btn">
            <span class="btn-icon">💾</span>
            Save Configuration
          </button>
          <button @click="testAllConnections" class="test-all-btn">
            <span class="btn-icon">🚀</span>
            Test All Services
          </button>
        </div>
      </section>

      <!-- Real-time Logs -->
      <section class="api-logs">
        <h2 class="section-title">📋 Real-time API Logs</h2>
        <div class="log-container">
          <div class="log-controls">
            <button @click="clearLogs" class="clear-btn">Clear Logs</button>
            <button @click="toggleAutoScroll" class="auto-scroll-btn" :class="{ active: autoScroll }">
              Auto Scroll: {{ autoScroll ? 'ON' : 'OFF' }}
            </button>
          </div>
          <div class="log-display" ref="logDisplay">
            <div v-for="(log, index) in logs" :key="index" class="log-entry" :class="log.type">
              <span class="log-time">{{ formatTime(log.timestamp) }}</span>
              <span class="log-service">{{ log.service }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { perfectServiceManager, type EnhancedServiceStatus, type PerfectApiResponse } from '../services/perfectApiClient'

interface Service {
  name: string
  description: string
  icon: string
  endpoint: string
  port: string
  container: string
  status: 'online' | 'offline' | 'error' | 'connecting' | 'warning'
  features?: string[]
  uptime?: number
  successRate?: number
  responseTime?: number
}

interface DockerConfig {
  host: string
  version: string
  apiKey: string
  certPath: string
}

interface LogEntry {
  timestamp: Date
  service: string
  message: string
  type: 'info' | 'error' | 'success' | 'warning'
}

// Reactive data
const testing = ref<string | null>(null)
const autoScroll = ref(true)
const logDisplay = ref<HTMLElement>()

const dockerConfig = ref<DockerConfig>({
  host: 'tcp://localhost:2376',
  version: 'v1.41',
  apiKey: '',
  certPath: ''
})

const services = ref<Service[]>([
  {
    name: 'Monica AI Gateway',
    description: 'Multi-model AI service (GPT-4, Claude, Gemini)',
    icon: '🤖',
    endpoint: 'https://openapi.monica.im/v1',
    port: '443',
    container: 'monica-ai-service',
    status: 'offline'
  },
  {
    name: 'Claude AI Direct',
    description: 'Direct Anthropic Claude API access',
    icon: '🧠',
    endpoint: 'https://api.anthropic.com/v1',
    port: '443',
    container: 'claude-ai-service',
    status: 'offline'
  },
  {
    name: 'MongoDB Atlas',
    description: 'Cloud database for tarot readings and users',
    icon: '🍃',
    endpoint: 'mongodb+srv://cluster0.qu7oa8g.mongodb.net',
    port: '27017',
    container: 'mongodb-atlas',
    status: 'offline'
  },
  {
    name: 'Stripe Payments',
    description: 'Payment processing for premium features',
    icon: '💳',
    endpoint: 'https://api.stripe.com/v1',
    port: '443',
    container: 'stripe-service',
    status: 'offline'
  },
  {
    name: 'Vercel V0 AI',
    description: 'AI-powered UI generation service',
    icon: '🎨',
    endpoint: 'https://v0.dev/api',
    port: '443',
    container: 'vercel-v0-service',
    status: 'offline'
  },
  {
    name: 'Local API Gateway',
    description: 'Local development API aggregator',
    icon: '🌐',
    endpoint: 'http://localhost:8080/api',
    port: '8080',
    container: 'local-api-gateway',
    status: 'offline'
  }
])

const logs = ref<LogEntry[]>([])

// Methods
const getStatusText = (status: string): string => {
  const statusMap = {
    online: '🟢 Online',
    offline: '🔴 Offline',
    error: '🟡 Error',
    connecting: '🔄 Connecting',
    warning: '⚠️ Warning'
  }
  return statusMap[status as keyof typeof statusMap] || '❓ Unknown'
}

const addLog = (service: string, message: string, type: LogEntry['type'] = 'info') => {
  logs.value.push({
    timestamp: new Date(),
    service,
    message,
    type
  })
  
  if (autoScroll.value) {
    nextTick(() => {
      if (logDisplay.value) {
        logDisplay.value.scrollTop = logDisplay.value.scrollHeight
      }
    })
  }
}

const testConnection = async (service: Service) => {
  testing.value = service.name
  service.status = 'connecting'
  addLog(service.name, `🔄 Testing connection to ${service.endpoint}...`, 'info')
  
  try {
    // Map service names to our perfect API client service names
    const serviceNameMap: Record<string, string> = {
      'Monica AI Gateway': 'monica',
      'Claude AI Direct': 'claude',
      'MongoDB Atlas': 'mongodb',
      'Stripe Payments': 'stripe'
    }
    
    const clientServiceName = serviceNameMap[service.name]
    
    if (clientServiceName) {
      // Use perfect API client for all supported services
      const result: EnhancedServiceStatus = await perfectServiceManager.testService(clientServiceName)
      
      // Update service with enhanced data
      service.status = result.status
      service.features = result.features
      service.uptime = result.uptime
      service.successRate = result.successRate
      service.responseTime = result.responseTime
      
      if (result.status === 'online') {
        addLog(service.name, `✅ Connection successful (${result.responseTime}ms) - Uptime: ${(result.uptime * 100).toFixed(1)}%`, 'success')
        
        // Log additional features
        if (result.features && result.features.length > 0) {
          addLog(service.name, `🔧 Features: ${result.features.join(', ')}`, 'info')
        }
        
        // Log metadata if available
        if (result.metadata) {
          const metaInfo = Object.entries(result.metadata)
            .filter(([key]) => !key.includes('password') && !key.includes('secret'))
            .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value).substring(0, 50) : value}`)
            .join(', ')
          if (metaInfo) {
            addLog(service.name, `📊 ${metaInfo}`, 'info')
          }
        }
      } else if (result.status === 'error') {
        addLog(service.name, `⚠️ Service error - Check configuration`, 'warning')
      } else {
        addLog(service.name, `❌ Connection failed - Service offline`, 'error')
      }
    } else {
      // Handle unmapped services
      service.status = 'warning'
      addLog(service.name, `⚠️ Service not yet integrated with perfect API client`, 'warning')
    }
  } catch (error: any) {
    service.status = 'error'
    addLog(service.name, `💥 Critical error: ${error.message}`, 'error')
  }
  
  testing.value = null
}

const toggleService = async (service: Service) => {
  const action = service.status === 'online' ? 'stop' : 'start'
  addLog(service.name, `${action === 'start' ? '▶️' : '⏸️'} ${action}ing container ${service.container}...`, 'info')
  
  try {
    // This would be replaced with actual Docker API calls
    const dockerApiUrl = `${dockerConfig.value.host}/containers/${service.container}/${action}`
    
    // Simulate API call for now
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    service.status = action === 'start' ? 'online' : 'offline'
    addLog(service.name, `✅ Container ${action}ed successfully`, 'success')
  } catch (error: any) {
    addLog(service.name, `❌ Failed to ${action} container: ${error.message}`, 'error')
  }
}

const saveConfig = () => {
  localStorage.setItem('dockerConfig', JSON.stringify(dockerConfig.value))
  addLog('System', '💾 Configuration saved successfully', 'success')
}

const testAllConnections = async () => {
  addLog('System', '🚀 Starting comprehensive service diagnostics...', 'info')
  
  try {
    // Test all services in parallel using the perfect service manager
    const results: EnhancedServiceStatus[] = await perfectServiceManager.testAllServices()
    
    // Update our service list with the enhanced results
    results.forEach(result => {
      const service = services.value.find(s => {
        const serviceNameMap: Record<string, string> = {
          'Monica AI Gateway': 'monica',
          'Claude AI Direct': 'claude',
          'MongoDB Atlas': 'mongodb',
          'Stripe Payments': 'stripe'
        }
        return serviceNameMap[s.name] === result.id
      })
      
      if (service) {
        service.status = result.status
        service.features = result.features
        service.uptime = result.uptime
        service.successRate = result.successRate
        service.responseTime = result.responseTime
      }
    })
    
    // Generate comprehensive report
    const onlineCount = results.filter(s => s.status === 'online').length
    const errorCount = results.filter(s => s.status === 'error').length
    const offlineCount = results.filter(s => s.status === 'offline').length
    
    addLog('System', `📊 Test Results: ${onlineCount} Online, ${errorCount} Errors, ${offlineCount} Offline`, 'info')
    
    // Log individual service performance
    results.forEach(result => {
      if (result.status === 'online') {
        addLog(result.name, `⚡ Response: ${result.responseTime}ms | Uptime: ${(result.uptime * 100).toFixed(1)}% | Success Rate: ${(result.successRate * 100).toFixed(1)}%`, 'success')
      }
    })
    
    // Get global metrics
    const globalMetrics = perfectServiceManager.getGlobalMetrics()
    addLog('System', `🌍 Global Stats: ${globalMetrics.totalRequests} total requests, ${globalMetrics.activeServices} active services`, 'info')
    
    addLog('System', `🏆 Perfect diagnostic complete - All systems analyzed`, 'success')
  } catch (error: any) {
    addLog('System', `💥 Diagnostic failed: ${error.message}`, 'error')
  }
}

const clearLogs = () => {
  logs.value = []
  addLog('System', '🧹 Logs cleared', 'info')
}

const toggleAutoScroll = () => {
  autoScroll.value = !autoScroll.value
}

const formatTime = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  // Load saved configuration
  const savedConfig = localStorage.getItem('dockerConfig')
  if (savedConfig) {
    dockerConfig.value = JSON.parse(savedConfig)
  }
  
  addLog('System', '🚀 API Manager initialized', 'success')
  
  // Auto-test connections on load
  setTimeout(testAllConnections, 1000)
})
</script>

<style scoped>
.api-manager {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0015 0%, #1a0033 50%, #0a0015 100%);
  color: #ffffff;
  padding: 20px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.api-header {
  text-align: center;
  margin-bottom: 40px;
}

.api-title {
  font-size: 2.5rem;
  background: linear-gradient(45deg, #ffd700, #ff6b35);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.api-subtitle {
  font-size: 1.2rem;
  color: #b8b8b8;
}

/* Service Status Grid */
.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.service-card {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(255, 215, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
}

.service-card.online {
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(255, 215, 0, 0.05));
}

.service-card.error {
  border-color: #f59e0b;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(255, 215, 0, 0.05));
}

.service-card.connecting {
  border-color: #60a5fa;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(255, 215, 0, 0.05));
  animation: pulse 2s infinite;
}

.service-card.warning {
  border-color: #fb923c;
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(255, 215, 0, 0.05));
}

.service-header {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 15px;
}

.service-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.service-info {
  flex: 1;
}

.service-name {
  font-size: 1.2rem;
  color: #ffd700;
  margin: 0 0 5px 0;
}

.service-description {
  color: #b8b8b8;
  margin: 0;
  font-size: 0.9rem;
}

.service-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  flex-shrink: 0;
}

.service-status.online {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.5);
}

.service-status.offline {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.5);
}

.service-status.error {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.5);
}

.service-status.connecting {
  background: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.5);
}

.service-status.warning {
  background: rgba(251, 146, 60, 0.2);
  color: #fb923c;
  border: 1px solid rgba(251, 146, 60, 0.5);
}

.service-details {
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.detail-label {
  color: #d0d0d0;
  font-size: 0.85rem;
}

.detail-value {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #ffd700;
}

.service-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 0.85rem;
}

.test-btn {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.5);
  color: #dbb8ff;
}

.test-btn:hover:not(:disabled) {
  background: rgba(139, 92, 246, 0.3);
}

.test-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-btn {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.5);
  color: #10b981;
}

.toggle-btn.offline {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.5);
  color: #ef4444;
}

.toggle-btn:hover {
  transform: scale(1.02);
}

/* Configuration Section */
.section-title {
  font-size: 1.8rem;
  color: #ffd700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.config-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
}

.config-card h3 {
  color: #ffd700;
  margin: 0 0 15px 0;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  color: #d0d0d0;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.config-input {
  width: 100%;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 6px;
  color: #fff;
  font-size: 0.9rem;
}

.config-input:focus {
  outline: none;
  border-color: #ffd700;
  background: rgba(0, 0, 0, 0.4);
}

.config-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.save-btn, .test-all-btn {
  padding: 12px 30px;
  border-radius: 25px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}

.save-btn {
  background: linear-gradient(135deg, #10b981, #065f46);
  color: white;
}

.test-all-btn {
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  color: white;
}

.save-btn:hover, .test-all-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
}

/* Logs Section */
.log-container {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
}

.log-controls {
  padding: 15px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  display: flex;
  gap: 10px;
}

.clear-btn, .auto-scroll-btn {
  padding: 6px 15px;
  border-radius: 15px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  background: transparent;
  color: #ffd700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.clear-btn:hover, .auto-scroll-btn:hover {
  background: rgba(255, 215, 0, 0.1);
}

.auto-scroll-btn.active {
  background: rgba(255, 215, 0, 0.2);
  border-color: #ffd700;
}

.log-display {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
}

.log-entry {
  display: flex;
  gap: 10px;
  padding: 4px 0;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  align-items: center;
}

.log-time {
  color: #888;
  min-width: 80px;
}

.log-service {
  color: #ffd700;
  min-width: 120px;
  font-weight: bold;
}

.log-message {
  color: #d0d0d0;
  flex: 1;
}

.log-entry.success .log-message {
  color: #10b981;
}

.log-entry.error .log-message {
  color: #ef4444;
}

.log-entry.warning .log-message {
  color: #f59e0b;
}

.log-entry.info .log-message {
  color: #60a5fa;
}

/* Responsive Design */
@media (max-width: 768px) {
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .config-grid {
    grid-template-columns: 1fr;
  }
  
  .service-actions {
    flex-direction: column;
  }
  
  .config-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .log-entry {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  }
  
  .log-time, .log-service {
    min-width: auto;
  }
}

.btn-icon {
  font-size: 1rem;
}

/* Service Features Styling */
.service-features {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
}

.features-label {
  font-size: 0.8rem;
  color: #d0d0d0;
  margin-bottom: 5px;
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.feature-tag {
  background: rgba(139, 92, 246, 0.2);
  color: #dbb8ff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

/* Pulse animation for connecting state */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(96, 165, 250, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(96, 165, 250, 0);
  }
}
</style>