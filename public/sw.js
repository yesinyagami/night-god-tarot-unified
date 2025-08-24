/**
 * PROGRESSIVE WEB APP SERVICE WORKER 2030
 * Ultimate offline capabilities and intelligent caching
 */

const CACHE_NAME = 'night-god-tarot-v2.0.0'
const RUNTIME_CACHE = 'night-god-runtime-v2.0.0'
const AI_CACHE = 'night-god-ai-responses-v2.0.0'
const IMAGE_CACHE = 'night-god-images-v2.0.0'

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/main.css',
  '/assets/main.js',
  '/fonts/Inter-Regular.woff2',
  '/fonts/PlayfairDisplay-Regular.woff2',
  '/images/logo/night-god-logo.png',
  '/images/icons/icon-192.png',
  '/images/icons/icon-512.png'
]

// Tarot card images for offline access
const TAROT_IMAGES = [
  '/images/tarot/major-arcana/',
  '/images/tarot/minor-arcana/',
  '/images/tarot/backs/',
  '/images/tarot/spreads/'
]

// AI model endpoints to cache responses
const AI_ENDPOINTS = [
  'api.monica.im',
  'openapi.monica.im',
  'api.openai.com',
  'generativelanguage.googleapis.com'
]

// Maximum cache sizes (in bytes)
const MAX_CACHE_SIZES = {
  [RUNTIME_CACHE]: 50 * 1024 * 1024, // 50MB
  [AI_CACHE]: 25 * 1024 * 1024,      // 25MB
  [IMAGE_CACHE]: 100 * 1024 * 1024   // 100MB
}

// Cache duration in milliseconds
const CACHE_DURATION = {
  static: 30 * 24 * 60 * 60 * 1000,  // 30 days
  api: 5 * 60 * 1000,                // 5 minutes
  ai: 60 * 60 * 1000,                // 1 hour
  images: 7 * 24 * 60 * 60 * 1000    // 7 days
}

// === SERVICE WORKER LIFECYCLE ===

self.addEventListener('install', (event) => {
  console.log('🌙 Night God Tarot SW: Installing...')
  
  event.waitUntil(
    (async () => {
      // Open caches
      const cache = await caches.open(CACHE_NAME)
      const imageCache = await caches.open(IMAGE_CACHE)
      
      try {
        // Cache critical resources
        await cache.addAll(CRITICAL_RESOURCES)
        console.log('✅ Critical resources cached')
        
        // Pre-cache tarot card images
        await cacheCardImages(imageCache)
        console.log('✅ Tarot images pre-cached')
        
        // Skip waiting to activate immediately
        self.skipWaiting()
        
      } catch (error) {
        console.error('❌ Cache installation failed:', error)
      }
    })()
  )
})

self.addEventListener('activate', (event) => {
  console.log('🌟 Night God Tarot SW: Activating...')
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(async (cacheName) => {
          if (!cacheName.includes('v2.0.0')) {
            console.log(`🗑️ Deleting old cache: ${cacheName}`)
            await caches.delete(cacheName)
          }
        })
      )
      
      // Take control of all pages immediately
      await self.clients.claim()
      
      console.log('✅ Service Worker activated and controlling all pages')
    })()
  )
})

// === REQUEST HANDLING ===

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Handle different types of requests
  if (request.method !== 'GET') {
    return // Only handle GET requests for caching
  }
  
  // Determine caching strategy based on request type
  if (isStaticResource(url)) {
    event.respondWith(handleStaticResource(request))
  } else if (isAIRequest(url)) {
    event.respondWith(handleAIRequest(request))
  } else if (isImageRequest(url)) {
    event.respondWith(handleImageRequest(request))
  } else if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request))
  } else {
    event.respondWith(handleNavigationRequest(request))
  }
})

// === CACHING STRATEGIES ===

// Cache First - for static resources
async function handleStaticResource(request) {
  try {
    const cache = await caches.open(CACHE_NAME)
    const cached = await cache.match(request)
    
    if (cached && !isExpired(cached, CACHE_DURATION.static)) {
      return cached
    }
    
    // Fetch and update cache
    const response = await fetch(request)
    if (response.ok) {
      await cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.warn('Static resource failed, using cached version:', error)
    const cache = await caches.open(CACHE_NAME)
    return await cache.match(request) || createOfflineResponse()
  }
}

// Network First with Intelligent Fallback - for AI requests
async function handleAIRequest(request) {
  const cache = await caches.open(AI_CACHE)
  
  try {
    // Try network first for fresh AI responses
    const networkResponse = await fetch(request, { 
      timeout: 10000 // 10 second timeout
    })
    
    if (networkResponse.ok) {
      // Cache successful AI responses
      await cache.put(request, networkResponse.clone())
      await manageCacheSize(AI_CACHE)
      return networkResponse
    }
    
    throw new Error('Network response not ok')
  } catch (error) {
    console.warn('AI request failed, checking cache:', error)
    
    // Fallback to cached response
    const cached = await cache.match(request)
    if (cached && !isExpired(cached, CACHE_DURATION.ai)) {
      // Add header to indicate cached response
      const response = cached.clone()
      response.headers.set('X-Cached-Response', 'true')
      return response
    }
    
    // Ultimate fallback: offline AI response
    return createOfflineAIResponse(request)
  }
}

// Cache First with Network Fallback - for images
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE)
    const cached = await cache.match(request)
    
    if (cached) {
      return cached
    }
    
    // Fetch and cache
    const response = await fetch(request)
    if (response.ok) {
      await cache.put(request, response.clone())
      await manageCacheSize(IMAGE_CACHE)
    }
    
    return response
  } catch (error) {
    console.warn('Image request failed:', error)
    return createOfflinePlaceholder()
  }
}

// Stale While Revalidate - for API requests
async function handleAPIRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE)
  const cached = await cache.match(request)
  
  // Return cached version immediately if available
  const cachedResponse = cached && !isExpired(cached, CACHE_DURATION.api) 
    ? Promise.resolve(cached) 
    : null
  
  // Fetch fresh version in background
  const networkResponse = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(error => {
      console.warn('API request failed:', error)
      return cached || createOfflineResponse()
    })
  
  return cachedResponse || networkResponse
}

// App Shell - for navigation requests
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      return response
    }
  } catch (error) {
    console.warn('Navigation request failed, serving app shell:', error)
  }
  
  // Serve cached app shell
  const cache = await caches.open(CACHE_NAME)
  return await cache.match('/') || createOfflineResponse()
}

// === UTILITY FUNCTIONS ===

function isStaticResource(url) {
  return url.pathname.includes('/assets/') ||
         url.pathname.includes('/fonts/') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.woff2')
}

function isAIRequest(url) {
  return AI_ENDPOINTS.some(endpoint => url.hostname.includes(endpoint))
}

function isImageRequest(url) {
  return url.pathname.includes('/images/') ||
         url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
}

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/') ||
         url.hostname !== self.location.hostname
}

function isExpired(response, maxAge) {
  const dateHeader = response.headers.get('date')
  if (!dateHeader) return false
  
  const responseDate = new Date(dateHeader)
  const now = new Date()
  
  return (now.getTime() - responseDate.getTime()) > maxAge
}

async function manageCacheSize(cacheName) {
  const cache = await caches.open(cacheName)
  const maxSize = MAX_CACHE_SIZES[cacheName]
  
  if (!maxSize) return
  
  const keys = await cache.keys()
  let totalSize = 0
  
  // Calculate current cache size (approximate)
  for (const key of keys) {
    const response = await cache.match(key)
    if (response) {
      const contentLength = response.headers.get('content-length')
      totalSize += contentLength ? parseInt(contentLength) : 10000 // Estimate
    }
  }
  
  // Remove oldest entries if over limit
  if (totalSize > maxSize) {
    const entriesToRemove = Math.ceil(keys.length * 0.2) // Remove 20%
    
    for (let i = 0; i < entriesToRemove; i++) {
      await cache.delete(keys[i])
    }
    
    console.log(`🗑️ Cleaned ${entriesToRemove} entries from ${cacheName}`)
  }
}

async function cacheCardImages(imageCache) {
  // Pre-cache essential tarot card images
  const essentialCards = [
    '/images/tarot/major-arcana/the-fool.jpg',
    '/images/tarot/major-arcana/the-magician.jpg',
    '/images/tarot/major-arcana/the-high-priestess.jpg',
    '/images/tarot/major-arcana/death.jpg',
    '/images/tarot/major-arcana/the-tower.jpg',
    '/images/tarot/major-arcana/the-sun.jpg',
    '/images/tarot/major-arcana/the-moon.jpg',
    '/images/tarot/major-arcana/the-world.jpg',
    '/images/tarot/backs/night-god-back.jpg'
  ]
  
  for (const cardUrl of essentialCards) {
    try {
      const response = await fetch(cardUrl)
      if (response.ok) {
        await imageCache.put(cardUrl, response)
      }
    } catch (error) {
      console.warn(`Failed to cache ${cardUrl}:`, error)
    }
  }
}

function createOfflineResponse() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Night God Tarot - Offline</title>
      <style>
        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%);
          color: #ffffff;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .offline-container {
          max-width: 500px;
          padding: 40px 20px;
        }
        .offline-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }
        .offline-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #ffd700, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .offline-description {
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .retry-button {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">🌙</div>
        <h1 class="offline-title">Cosmic Connection Lost</h1>
        <p class="offline-description">
          The celestial networks are temporarily unreachable. Your spiritual journey continues with 
          cached wisdom and offline guidance from the Night God.
        </p>
        <button class="retry-button" onclick="window.location.reload()">
          Reconnect to the Cosmos
        </button>
      </div>
    </body>
    </html>
  `
  
  return new Response(offlineHTML, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache'
    }
  })
}

function createOfflineAIResponse(request) {
  // Generate meaningful offline AI responses based on request
  const url = new URL(request.url)
  const isReadingRequest = url.pathname.includes('reading') || url.pathname.includes('tarot')
  
  let offlineResponse
  
  if (isReadingRequest) {
    offlineResponse = {
      success: true,
      data: {
        reading: "The cosmic winds whisper ancient wisdom even in disconnection. " +
               "This moment of digital solitude reflects the hermit's journey - " +
               "sometimes the greatest insights come when we turn inward. " +
               "The cards you've drawn carry messages that transcend the need for " +
               "immediate external validation. Trust your intuition, for the Night God's " +
               "guidance flows through you even when the digital realm sleeps.",
        cards: [],
        confidence: 0.8,
        isOffline: true,
        timestamp: Date.now()
      }
    }
  } else {
    offlineResponse = {
      success: false,
      error: {
        code: 'OFFLINE_MODE',
        message: 'Currently in offline mode. Cached wisdom available.',
        isOffline: true
      }
    }
  }
  
  return new Response(JSON.stringify(offlineResponse), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Offline-Response': 'true',
      'Cache-Control': 'no-cache'
    }
  })
}

function createOfflinePlaceholder() {
  // Create SVG placeholder for missing images
  const placeholder = `
    <svg width="300" height="500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="300" height="500" fill="url(#grad)" rx="12"/>
      <text x="150" y="240" text-anchor="middle" fill="#ffd700" font-family="serif" font-size="40">🌙</text>
      <text x="150" y="280" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="14">
        Card Loading...
      </text>
      <text x="150" y="300" text-anchor="middle" fill="#8b5cf6" font-family="sans-serif" font-size="12">
        Night God Tarot
      </text>
    </svg>
  `
  
  return new Response(placeholder, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache'
    }
  })
}

// === BACKGROUND SYNC ===

self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag)
  
  if (event.tag === 'sync-pending-data') {
    event.waitUntil(syncPendingData())
  } else if (event.tag === 'sync-ai-cache') {
    event.waitUntil(refreshAICache())
  }
})

async function syncPendingData() {
  try {
    // Sync any pending readings or user data
    const pendingData = await getStoredData('pendingSync')
    
    if (pendingData && pendingData.length > 0) {
      for (const item of pendingData) {
        try {
          await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          })
          
          // Remove synced item
          await removeStoredData('pendingSync', item.id)
        } catch (error) {
          console.warn('Failed to sync item:', error)
        }
      }
    }
    
    console.log('✅ Background sync completed')
  } catch (error) {
    console.error('❌ Background sync failed:', error)
  }
}

async function refreshAICache() {
  try {
    const cache = await caches.open(AI_CACHE)
    const keys = await cache.keys()
    
    // Refresh oldest cached AI responses
    const expiredKeys = []
    for (const key of keys) {
      const response = await cache.match(key)
      if (response && isExpired(response, CACHE_DURATION.ai)) {
        expiredKeys.push(key)
      }
    }
    
    // Refresh up to 5 expired entries
    const toRefresh = expiredKeys.slice(0, 5)
    for (const key of toRefresh) {
      try {
        const fresh = await fetch(key)
        if (fresh.ok) {
          await cache.put(key, fresh)
        }
      } catch (error) {
        console.warn('Failed to refresh cached AI response:', error)
      }
    }
    
    console.log(`✅ Refreshed ${toRefresh.length} AI cache entries`)
  } catch (error) {
    console.error('❌ AI cache refresh failed:', error)
  }
}

// === PUSH NOTIFICATIONS ===

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  
  const options = {
    title: data.title || 'Night God Tarot',
    body: data.body || 'Your spiritual journey awaits...',
    icon: '/images/icons/icon-192.png',
    badge: '/images/icons/badge-72.png',
    image: data.image,
    data: data.url ? { url: data.url } : undefined,
    actions: [
      {
        action: 'open',
        title: 'Open Reading',
        icon: '/images/icons/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/images/icons/action-dismiss.png'
      }
    ],
    requireInteraction: true,
    silent: false
  }
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data?.url || '/'
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clients => {
          // Focus existing tab if available
          for (const client of clients) {
            if (client.url === url && 'focus' in client) {
              return client.focus()
            }
          }
          
          // Open new tab
          if (clients.openWindow) {
            return clients.openWindow(url)
          }
        })
    )
  }
})

// === STORAGE UTILITIES ===

async function getStoredData(key) {
  try {
    const data = await self.indexedDB.open('NightGodTarotDB', 1)
    // Implementation would use IndexedDB for persistent storage
    return []
  } catch (error) {
    console.warn('Failed to get stored data:', error)
    return []
  }
}

async function removeStoredData(key, id) {
  try {
    // Implementation would remove specific item from IndexedDB
    console.log(`Removed ${id} from ${key}`)
  } catch (error) {
    console.warn('Failed to remove stored data:', error)
  }
}

// === PERIODIC BACKGROUND SYNC ===

self.addEventListener('periodicsync', (event) => {
  console.log('⏰ Periodic background sync:', event.tag)
  
  if (event.tag === 'daily-cache-cleanup') {
    event.waitUntil(performDailyMaintenance())
  }
})

async function performDailyMaintenance() {
  try {
    // Clean expired caches
    const cacheNames = await caches.keys()
    for (const cacheName of cacheNames) {
      await manageCacheSize(cacheName)
    }
    
    // Update critical resources
    const cache = await caches.open(CACHE_NAME)
    for (const resource of CRITICAL_RESOURCES.slice(0, 5)) { // Update first 5
      try {
        const response = await fetch(resource)
        if (response.ok) {
          await cache.put(resource, response)
        }
      } catch (error) {
        console.warn(`Failed to update ${resource}:`, error)
      }
    }
    
    console.log('✅ Daily maintenance completed')
  } catch (error) {
    console.error('❌ Daily maintenance failed:', error)
  }
}

console.log('🌙 Night God Tarot Service Worker 2030 Loaded')
console.log('✨ Features: Offline Support, AI Caching, Background Sync, Push Notifications')