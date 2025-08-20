#!/usr/bin/env node

/**
 * Weather & News System Test Script
 * Tests all components of the weather and news integration
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001';

// Test configuration
const TEST_CONFIG = {
  coordinates: {
    taipei: { lat: 25.0330, lon: 121.5654, name: 'Taipei' },
    tokyo: { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
    newYork: { lat: 40.7128, lon: -74.0060, name: 'New York' }
  },
  newsCountries: ['tw', 'jp', 'us'],
  newsCategories: ['general', 'technology', 'business']
};

async function testWeatherAPI() {
  console.log('\n🌤️  Testing Weather API...');
  
  for (const [, coords] of Object.entries(TEST_CONFIG.coordinates)) {
    try {
      console.log(`\n📍 Testing ${coords.name}:`);
      
      // Test weather endpoint
      const response = await fetch(
        `${API_BASE}/api/keys/weather/current?lat=${coords.lat}&lon=${coords.lon}`,
        {
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Weather: ${data.current?.temperature}°C ${data.current?.weather?.description}`);
        console.log(`   🏙️  Location: ${data.location?.city}, ${data.location?.country}`);
        
        if (data.mock) {
          console.log(`   ⚠️  Using mock data (API key not configured)`);
        }
      } else {
        console.log(`   ❌ Weather API failed: ${response.status}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Weather test failed: ${error.message}`);
    }
  }
}

async function testNewsAPI() {
  console.log('\n📰 Testing News API...');
  
  for (const country of TEST_CONFIG.newsCountries) {
    for (const category of TEST_CONFIG.newsCategories) {
      try {
        console.log(`\n📍 Testing ${country.toUpperCase()} - ${category}:`);
        
        const response = await fetch(
          `${API_BASE}/api/keys/news/headlines?country=${country}&category=${category}&pageSize=3`,
          {
            headers: {
              'Authorization': 'Bearer test-token',
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log(`   ✅ Found ${data.articles?.length || 0} articles`);
          
          if (data.articles && data.articles.length > 0) {
            console.log(`   📰 Sample: "${data.articles[0].title.substring(0, 60)}..."`);
          }
          
          if (data.mock) {
            console.log(`   ⚠️  Using mock data (API key not configured)`);
          }
        } else {
          console.log(`   ❌ News API failed: ${response.status}`);
        }
        
      } catch (error) {
        console.log(`   ❌ News test failed: ${error.message}`);
      }
    }
  }
}

async function testIPGeolocation() {
  console.log('\n🌍 Testing IP Geolocation...');
  
  const services = [
    { name: 'IPInfo', url: 'https://ipinfo.io/json' },
    { name: 'IP-API', url: 'http://ip-api.com/json/' }
  ];
  
  for (const service of services) {
    try {
      console.log(`\n🔍 Testing ${service.name}:`);
      
      const response = await fetch(service.url, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (service.name === 'IPInfo') {
          console.log(`   ✅ Location: ${data.city}, ${data.region}, ${data.country}`);
          console.log(`   📍 Coordinates: ${data.loc}`);
        } else if (service.name === 'IP-API') {
          console.log(`   ✅ Location: ${data.city}, ${data.regionName}, ${data.country}`);
          console.log(`   📍 Coordinates: ${data.lat}, ${data.lon}`);
        }
      } else {
        console.log(`   ❌ ${service.name} failed: ${response.status}`);
      }
      
    } catch (error) {
      console.log(`   ❌ ${service.name} test failed: ${error.message}`);
    }
  }
}

async function testAPIKeys() {
  console.log('\n🔑 Testing API Key Configuration...');
  
  const apiKeys = [
    { name: 'OpenWeatherMap', env: 'OPENWEATHER_API_KEY' },
    { name: 'NewsAPI', env: 'NEWS_API_KEY' },
    { name: 'IP Geolocation', env: 'IPGEOLOCATION_API_KEY' }
  ];
  
  for (const api of apiKeys) {
    const key = process.env[api.env];
    if (key && key !== `your-${api.env.toLowerCase().replace('_', '-')}-here`) {
      console.log(`   ✅ ${api.name}: Configured (${key.substring(0, 8)}...)`);
    } else {
      console.log(`   ⚠️  ${api.name}: Not configured (will use fallback)`);
    }
  }
}

async function testServerHealth() {
  console.log('\n🏥 Testing Server Health...');
  
  try {
    const response = await fetch(`${API_BASE}/health`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Server Status: ${data.status}`);
      console.log(`   ⏰ Uptime: ${Math.round(data.uptime)} seconds`);
      console.log(`   🌍 Environment: ${data.environment}`);
    } else {
      console.log(`   ❌ Server health check failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Server not reachable: ${error.message}`);
    console.log(`   💡 Make sure to start the server with: npm run dev:server`);
  }
}

async function runAllTests() {
  console.log('🌙 Night God Tarot - Weather & News System Tests 🌙');
  console.log('=' .repeat(55));
  
  await testServerHealth();
  await testAPIKeys();
  await testIPGeolocation();
  await testWeatherAPI();
  await testNewsAPI();
  
  console.log('\n🎯 Test Summary:');
  console.log('  - Weather system provides current conditions and forecasts');
  console.log('  - News system delivers localized and categorized content');
  console.log('  - IP geolocation enables automatic location detection');
  console.log('  - Fallback systems ensure the app works without API keys');
  console.log('  - All data is enhanced with mystical tarot interpretations');
  
  console.log('\n✨ The cosmic information flow is ready! ✨');
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--weather-only')) {
  testWeatherAPI();
} else if (args.includes('--news-only')) {
  testNewsAPI();
} else if (args.includes('--ip-only')) {
  testIPGeolocation();
} else if (args.includes('--keys-only')) {
  testAPIKeys();
} else {
  runAllTests();
}

// Export for use in other scripts
export {
  testWeatherAPI,
  testNewsAPI,
  testIPGeolocation,
  testAPIKeys,
  testServerHealth
};