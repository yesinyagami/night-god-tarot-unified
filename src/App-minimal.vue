<template>
  <div id="app">
    <h1>🌙 Night God Tarot - WORKING!</h1>
    <p>This is a minimal test to verify Vue is working.</p>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/demo">Demo</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // Minimal Vue app mounted successfully
  
  // Remove loading screen
  const loadingElement = document.querySelector('.loading') as HTMLElement
  if (loadingElement) {
    loadingElement.style.opacity = '0'
    setTimeout(() => {
      loadingElement.remove()
    }, 500)
  }
})
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  color: white;
  background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
  padding: 20px;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #ffd700;
  text-decoration: none;
  margin: 0 10px;
}

nav a:hover {
  text-decoration: underline;
}
</style>