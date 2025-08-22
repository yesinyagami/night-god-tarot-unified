import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

import './assets/main.css'
import { initializeConsentSystem } from './utils/consent'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

// Initialize consent system
initializeConsentSystem()

app.mount('#app')