import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './assets/main.css'
import { initializeConsentSystem } from './utils/consent'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize consent system
initializeConsentSystem()

app.mount('#app')