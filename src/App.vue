<template>
  <div id="app">
    <!-- Data Consent Modal (Shows on first visit) -->
    <DataConsentModal ref="consentModal" />
    
    <!-- Professional Header -->
    <ProfessionalHeader />
    
    <!-- Complete Night God Tarot Interface -->
    <NightGodTarotComplete />
    
    <!-- Tarot Masters Section -->
    <TarotMasters />
    
    <!-- Professional Footer with Sitemap -->
    <ProfessionalFooter />
    
    <!-- Route-based content overlay (if needed for specific pages) -->
    <router-view v-slot="{ Component }" class="route-overlay">
      <transition name="fade" mode="out-in">
        <component :is="Component" v-if="showRouterView" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NightGodTarotComplete from './components/NightGodTarotComplete.vue'
import DataConsentModal from './components/DataConsentModal.vue'
import TarotMasters from './components/TarotMasters.vue'
import ProfessionalFooter from './components/ProfessionalFooter.vue'
import ProfessionalHeader from './components/ProfessionalHeader.vue'

const route = useRoute()

// Show router view only for specific routes (like payment pages)
const showRouterView = computed(() => {
  const routesWithSeparateView = ['/payment-success', '/payment-cancel']
  return routesWithSeparateView.includes(route.path)
})

onMounted(() => {
  // Remove loading screen with mystical effect
  const loadingElement = document.querySelector('.loading') as HTMLElement
  if (loadingElement) {
    loadingElement.style.opacity = '0'
    loadingElement.style.transform = 'scale(0.8)'
    setTimeout(() => {
      loadingElement.remove()
    }, 800)
  }
  
  // Ultimate Night God Tarot Universe Initialized
})
</script>

<style>
/* Global Styles for Ultimate Experience */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
  font-family: 'Noto Serif TC', 'Inter', sans-serif;
}

#app {
  height: 100vh;
  position: relative;
}

.route-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5000;
  pointer-events: none;
}

.route-overlay > * {
  pointer-events: all;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Enhanced Loading Screen Animation */
.loading {
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #ffed4e, #ff8a50);
}

/* Selection Styling */
::selection {
  background: rgba(255, 215, 0, 0.3);
  color: #ffffff;
}

::-moz-selection {
  background: rgba(255, 215, 0, 0.3);
  color: #ffffff;
}

/* Focus Styles */
*:focus {
  outline: 2px solid rgba(255, 215, 0, 0.5);
  outline-offset: 2px;
}

/* Accessibility Improvements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print Styles */
@media print {
  .cosmic-canvas,
  .audio-controller,
  .notification-cosmos {
    display: none !important;
  }
}
</style>