import { createApp } from 'vue'


// Create the simplest possible Vue app
const app = createApp({
  mounted() {
    
    // Remove loading screen
    const loadingElement = document.querySelector('.loading') as HTMLElement
    if (loadingElement) {
      loadingElement.style.opacity = '0'
      setTimeout(() => {
        loadingElement.remove()
      }, 500)
    } else {
      console.info('Loading element not found - already removed or never existed')
    }
  },
  template: `
    <div style="color: white; padding: 20px; font-family: Arial;">
      <h1 style="color: #ffd700;">🎉 SUCCESS! Vue App is Working!</h1>
      <p>If you see this, Vue is mounting correctly.</p>
      <p>Time: {{ new Date().toLocaleTimeString() }}</p>
    </div>
  `
})

app.mount('#app')
