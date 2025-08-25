<template>
  <div id="app-api-management">
    <!-- Professional Header -->
    <ProfessionalHeader />
    
    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-content">
            <div class="hero-logo-title">
              <img src="/src/assets/logo/mainlogo.jpg" alt="Night God Tarot" class="hero-logo" />
              <h1 class="hero-title">
                Night God Tarot API Hub
                <span class="title-icon">🐳</span>
              </h1>
            </div>
            <p class="hero-subtitle">
              Professional Docker-based AI Tarot Platform
            </p>
            <p class="hero-description">
              Real-time API management and monitoring for your containerized tarot services
            </p>
            
            <!-- Quick Actions -->
            <div class="hero-actions">
              <button class="hero-btn primary" @click="scrollToSection('api-manager')">
                <span class="btn-icon">⚙️</span>
                Manage APIs
              </button>
              <button class="hero-btn secondary" @click="scrollToSection('docker-status')">
                <span class="btn-icon">🐳</span>
                Docker Status
              </button>
              <button class="hero-btn secondary" @click="openDocumentation">
                <span class="btn-icon">📚</span>
                API Docs
              </button>
            </div>
          </div>
          
          <!-- Docker Status Visualization -->
          <div class="hero-visual">
            <div class="docker-visualization">
              <div class="container-stack">
                <div v-for="(container, index) in containerPreview" :key="index" 
                     class="container-preview" 
                     :class="container.status"
                     :style="{ animationDelay: `${index * 0.2}s` }">
                  <div class="container-icon">{{ container.icon }}</div>
                  <div class="container-name">{{ container.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- API Manager Component -->
      <section id="api-manager" class="api-section">
        <ApiManager />
      </section>

      <!-- Tarot Reading Widget -->
      <section class="tarot-section">
        <div class="container">
          <TarotReadingWidget />
        </div>
      </section>

      <!-- Tarot Masters -->
      <section class="masters-section">
        <TarotMastersFixed />
      </section>

      <!-- Performance Monitor -->
      <section class="performance-section">
        <div class="container">
          <PerformanceMonitor />
        </div>
      </section>

      <!-- Docker Compose Integration -->
      <section id="docker-status" class="docker-compose-section">
        <div class="container">
          <h2 class="section-title">
            <span class="title-decoration">🐳</span>
            Docker Compose Status
            <span class="title-decoration">🐳</span>
          </h2>
          
          <div class="compose-controls">
            <button @click="runDockerCommand('up -d')" class="compose-btn start-all">
              <span class="btn-icon">🚀</span>
              Start All Services
            </button>
            <button @click="runDockerCommand('stop')" class="compose-btn stop-all">
              <span class="btn-icon">⏹️</span>
              Stop All Services
            </button>
            <button @click="runDockerCommand('ps')" class="compose-btn status-check">
              <span class="btn-icon">📊</span>
              Check Status
            </button>
            <button @click="runDockerCommand('logs --tail=50')" class="compose-btn logs">
              <span class="btn-icon">📋</span>
              View Logs
            </button>
          </div>

          <div class="compose-output">
            <h3>Docker Compose Output:</h3>
            <div class="output-display" ref="outputDisplay">
              <div v-for="(output, index) in dockerOutput" :key="index" class="output-line">
                {{ output }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- API Documentation -->
      <section class="documentation-section">
        <div class="container">
          <h2 class="section-title">
            <span class="title-decoration">📚</span>
            API Documentation & Endpoints
            <span class="title-decoration">📚</span>
          </h2>
          
          <div class="api-docs-grid">
            <div class="doc-card" v-for="endpoint in apiEndpoints" :key="endpoint.name">
              <div class="doc-header">
                <h3 class="doc-title">{{ endpoint.name }}</h3>
                <span class="http-method" :class="endpoint.method.toLowerCase()">{{ endpoint.method }}</span>
              </div>
              <div class="doc-content">
                <p class="doc-description">{{ endpoint.description }}</p>
                <div class="endpoint-info">
                  <div class="info-item">
                    <strong>Endpoint:</strong>
                    <code>{{ endpoint.path }}</code>
                  </div>
                  <div class="info-item">
                    <strong>Authentication:</strong>
                    <span class="auth-type">{{ endpoint.auth }}</span>
                  </div>
                </div>
                <div class="doc-example">
                  <strong>Example Request:</strong>
                  <pre class="code-block">{{ endpoint.example }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Professional Footer -->
    <ProfessionalFooter />

    <!-- Floating API Status Widget -->
    <div class="floating-widgets">
      <div class="widget api-status" @click="toggleApiStatus">
        <div class="widget-icon">🔌</div>
        <span class="widget-label">{{ onlineServicesCount }}/{{ totalServicesCount }}</span>
      </div>
      
      <div class="widget docker-logs" @click="toggleDockerLogs">
        <div class="widget-icon">📋</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProfessionalHeader from './components/ProfessionalHeader.vue'
import ProfessionalFooter from './components/ProfessionalFooter.vue'
import ApiManager from './components/ApiManager.vue'
import TarotReadingWidget from './components/TarotReadingWidget.vue'
import PerformanceMonitor from './components/PerformanceMonitor.vue'
import TarotMastersFixed from './components/TarotMastersFixed.vue'

// Container preview data for visualization
const containerPreview = ref([
  { name: 'Monica AI', icon: '🤖', status: 'running' },
  { name: 'Tarot DB', icon: '🔮', status: 'running' },
  { name: 'Auth Service', icon: '🔐', status: 'running' },
  { name: 'WebSocket', icon: '⚡', status: 'stopped' },
  { name: 'Image Gen', icon: '🎨', status: 'stopped' }
])

const dockerOutput = ref<string[]>([
  'Docker Compose initialized...',
  'Ready to execute commands'
])

const outputDisplay = ref<HTMLElement>()

// API Documentation
const apiEndpoints = ref([
  {
    name: 'Monica AI Gateway',
    method: 'POST',
    path: '/api/v1/chat/completions',
    description: 'Send requests to various AI models (GPT-4, Claude, Gemini, etc.)',
    auth: 'Bearer Token',
    example: `curl -X POST http://localhost:8080/api/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Interpret this tarot card"}],
    "temperature": 0.7
  }'`
  },
  {
    name: 'Tarot Card Database',
    method: 'GET',
    path: '/api/cards/{cardId}',
    description: 'Retrieve detailed information about specific tarot cards',
    auth: 'API Key',
    example: `curl -X GET http://localhost:3001/api/cards/the-fool \\
  -H "X-API-Key: YOUR_API_KEY"`
  },
  {
    name: 'User Authentication',
    method: 'POST',
    path: '/auth/login',
    description: 'Authenticate users and return JWT tokens',
    auth: 'None (Login endpoint)',
    example: `curl -X POST http://localhost:3002/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com", "password": "password"}'`
  },
  {
    name: 'Reading History',
    method: 'GET',
    path: '/readings/user/{userId}',
    description: 'Retrieve user\'s tarot reading history',
    auth: 'JWT Token',
    example: `curl -X GET http://localhost:3003/readings/user/123 \\
  -H "Authorization: Bearer JWT_TOKEN"`
  },
  {
    name: 'WebSocket Connection',
    method: 'WS',
    path: '/ws/live-reading',
    description: 'Real-time WebSocket connection for live tarot readings',
    auth: 'WebSocket Token',
    example: `const ws = new WebSocket('ws://localhost:3004/ws/live-reading?token=YOUR_TOKEN');
ws.onmessage = (event) => console.log(JSON.parse(event.data));`
  },
  {
    name: 'Image Generation',
    method: 'POST',
    path: '/generate/tarot-card',
    description: 'Generate AI-powered tarot card images',
    auth: 'API Key',
    example: `curl -X POST http://localhost:3005/generate/tarot-card \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"card": "The Fool", "style": "mystical", "size": "512x768"}'`
  }
])

// Computed properties
const onlineServicesCount = computed(() => {
  return containerPreview.value.filter(c => c.status === 'running').length
})

const totalServicesCount = computed(() => {
  return containerPreview.value.length
})

// Methods
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const openDocumentation = () => {
  scrollToSection('documentation-section')
}

const runDockerCommand = async (command: string) => {
  const timestamp = new Date().toLocaleTimeString()
  dockerOutput.value.push(`[${timestamp}] Running: docker-compose ${command}`)
  
  try {
    // In a real implementation, you would make an API call to your backend
    // that executes the Docker command securely
    
    // Simulate command execution
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (command === 'up -d') {
      dockerOutput.value.push(`[${timestamp}] Starting containers...`)
      dockerOutput.value.push(`[${timestamp}] Container monica-ai-gateway started`)
      dockerOutput.value.push(`[${timestamp}] Container tarot-db-service started`)
      dockerOutput.value.push(`[${timestamp}] Container auth-service started`)
      dockerOutput.value.push(`[${timestamp}] All services started successfully`)
      
      // Update container status
      containerPreview.value.forEach(container => {
        container.status = 'running'
      })
      
    } else if (command === 'stop') {
      dockerOutput.value.push(`[${timestamp}] Stopping all containers...`)
      dockerOutput.value.push(`[${timestamp}] All containers stopped`)
      
      containerPreview.value.forEach(container => {
        container.status = 'stopped'
      })
      
    } else if (command === 'ps') {
      dockerOutput.value.push(`[${timestamp}] Container Status:`)
      containerPreview.value.forEach(container => {
        dockerOutput.value.push(`  ${container.name}: ${container.status}`)
      })
    } else if (command.startsWith('logs')) {
      dockerOutput.value.push(`[${timestamp}] Recent container logs:`)
      dockerOutput.value.push(`  [monica-ai] Server started on port 8080`)
      dockerOutput.value.push(`  [tarot-db] Database connection established`)
      dockerOutput.value.push(`  [auth-service] JWT service ready`)
    }
    
  } catch (error: any) {
    dockerOutput.value.push(`[${timestamp}] Error: ${error.message}`)
  }
  
  // Auto-scroll to bottom
  setTimeout(() => {
    if (outputDisplay.value) {
      outputDisplay.value.scrollTop = outputDisplay.value.scrollHeight
    }
  }, 100)
}

const toggleApiStatus = () => {
  scrollToSection('api-manager')
}

const toggleDockerLogs = () => {
  scrollToSection('docker-status')
}

// Lifecycle
onMounted(() => {
  console.log('🐳 Docker API Management Platform initialized')
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app-api-management {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0015 0%, #1a0033 50%, #0a0015 100%);
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero-section {
  padding: 80px 20px;
  background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
  position: relative;
  overflow: hidden;
}

.hero-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-content {
  animation: fadeInLeft 1s ease;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.hero-logo-title {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 20px;
}

.hero-logo {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(255, 215, 0, 0.4);
  border: 3px solid rgba(255, 215, 0, 0.6);
  animation: glow 3s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { 
    box-shadow: 0 8px 24px rgba(255, 215, 0, 0.4);
  }
  50% { 
    box-shadow: 0 8px 40px rgba(255, 215, 0, 0.8);
  }
}

.hero-title {
  font-size: 3.5rem;
  background: linear-gradient(45deg, #ffd700, #ff6b35);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 20px;
}

.title-icon {
  font-size: 3rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #ffd700;
  margin-bottom: 15px;
}

.hero-description {
  font-size: 1.1rem;
  color: #d0d0d0;
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.hero-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.hero-btn.primary {
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  color: white;
}

.hero-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
}

.hero-btn.secondary {
  background: rgba(139, 92, 246, 0.2);
  border: 2px solid rgba(139, 92, 246, 0.5);
  color: #dbb8ff;
}

.hero-btn.secondary:hover {
  background: rgba(139, 92, 246, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
}

/* Docker Visualization */
.hero-visual {
  position: relative;
  animation: fadeInRight 1s ease;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.docker-visualization {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.container-stack {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.container-preview {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 25px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(255, 215, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  min-width: 200px;
  animation: slideInRight 0.5s ease;
  transition: all 0.3s ease;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.container-preview:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
}

.container-preview.running {
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(255, 215, 0, 0.05));
}

.container-preview.stopped {
  border-color: #ef4444;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(255, 215, 0, 0.05));
}

.container-icon {
  font-size: 2rem;
}

.container-name {
  font-weight: bold;
  color: #ffd700;
}

/* Section Styling */
.api-section {
  padding: 40px 0;
}

.tarot-section {
  padding: 60px 20px;
  background: rgba(139, 92, 246, 0.05);
}

.masters-section {
  padding: 0;
  background: rgba(139, 92, 246, 0.02);
}

.performance-section {
  padding: 60px 20px;
  background: rgba(16, 185, 129, 0.03);
}

.docker-compose-section {
  padding: 80px 20px;
  background: rgba(0, 0, 0, 0.2);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: #ffd700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.title-decoration {
  font-size: 1.5rem;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

/* Docker Compose Controls */
.compose-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.compose-btn {
  padding: 12px 25px;
  border-radius: 25px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.start-all {
  background: linear-gradient(135deg, #10b981, #065f46);
  color: white;
}

.stop-all {
  background: linear-gradient(135deg, #ef4444, #991b1b);
  color: white;
}

.status-check {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
}

.logs {
  background: linear-gradient(135deg, #8b5cf6, #5b21b6);
  color: white;
}

.compose-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(255, 255, 255, 0.2);
}

/* Output Display */
.compose-output {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
}

.compose-output h3 {
  color: #ffd700;
  margin-bottom: 15px;
}

.output-display {
  max-height: 300px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.6);
  padding: 15px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.output-line {
  color: #d0d0d0;
  margin-bottom: 2px;
  word-break: break-all;
}

/* API Documentation */
.documentation-section {
  padding: 80px 20px;
}

.api-docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
}

.doc-card {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(255, 215, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
}

.doc-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.doc-title {
  color: #ffd700;
  margin: 0;
  font-size: 1.3rem;
}

.http-method {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.http-method.get {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.5);
}

.http-method.post {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.5);
}

.http-method.ws {
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.5);
}

.doc-description {
  color: #d0d0d0;
  margin-bottom: 15px;
  line-height: 1.5;
}

.endpoint-info {
  margin-bottom: 15px;
}

.info-item {
  margin-bottom: 8px;
}

.info-item strong {
  color: #ffd700;
  margin-right: 8px;
}

.info-item code {
  background: rgba(0, 0, 0, 0.4);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #60a5fa;
}

.auth-type {
  color: #10b981;
  font-weight: bold;
}

.doc-example strong {
  color: #ffd700;
  display: block;
  margin-bottom: 8px;
}

.code-block {
  background: rgba(0, 0, 0, 0.6);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #d0d0d0;
  overflow-x: auto;
  white-space: pre;
}

/* Floating Widgets */
.floating-widgets {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 999;
}

.widget {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  position: relative;
}

.widget:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 30px rgba(255, 215, 0, 0.6);
}

.widget-icon {
  font-size: 1.5rem;
}

.widget-label {
  position: absolute;
  bottom: -8px;
  background: #8b5cf6;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .api-docs-grid {
    grid-template-columns: 1fr;
  }
  
  .compose-controls {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 10px;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .hero-btn {
    padding: 12px 20px;
    font-size: 1rem;
  }
  
  .floating-widgets {
    bottom: 20px;
    right: 20px;
  }
  
  .widget {
    width: 50px;
    height: 50px;
  }
  
  .widget-icon {
    font-size: 1.3rem;
  }
}

.btn-icon {
  font-size: 1.2rem;
}
</style>