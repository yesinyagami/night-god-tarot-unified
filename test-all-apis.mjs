import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

console.log('🔍 Testing All API Connections\n');
console.log('=' .repeat(50));

// Test Monica AI
async function testMonicaAPI() {
    console.log('\n📱 Monica AI API:');
    const key = process.env.MONICA_API_KEY;
    
    if (!key) {
        console.log('   ❌ No API key found');
        return false;
    }
    
    console.log('   Key format: ' + (key.startsWith('sk-') ? '✅ Valid format' : '❌ Invalid format'));
    
    try {
        const response = await fetch('https://openapi.monica.im/v1/models', {
            headers: { 'Authorization': `Bearer ${key}` }
        });
        
        if (response.status === 401) {
            console.log('   ❌ Invalid API key');
            return false;
        } else if (response.status === 412) {
            console.log('   ⚠️  Valid key but insufficient balance');
            return true;
        } else if (response.ok) {
            console.log('   ✅ API is working');
            return true;
        } else {
            console.log('   ❌ Error: ' + response.status);
            return false;
        }
    } catch (error) {
        console.log('   ❌ Connection error: ' + error.message);
        return false;
    }
}

// Test OpenWeather API
async function testWeatherAPI() {
    console.log('\n🌤️  OpenWeather API:');
    const key = process.env.OPENWEATHER_API_KEY;
    
    if (!key) {
        console.log('   ❌ No API key found');
        return false;
    }
    
    // OpenWeather keys should be 32 character hex strings, not sk- format
    if (key.startsWith('sk-')) {
        console.log('   ❌ Wrong key format (using Monica key format)');
        console.log('   📝 Need real OpenWeather API key from: https://openweathermap.org/api');
        return false;
    }
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${key}`);
        
        if (response.status === 401) {
            console.log('   ❌ Invalid API key');
            return false;
        } else if (response.ok) {
            console.log('   ✅ API is working');
            return true;
        } else {
            console.log('   ❌ Error: ' + response.status);
            return false;
        }
    } catch (error) {
        console.log('   ❌ Connection error: ' + error.message);
        return false;
    }
}

// Test News API
async function testNewsAPI() {
    console.log('\n📰 News API:');
    const key = process.env.NEWS_API_KEY;
    
    if (!key) {
        console.log('   ❌ No API key found');
        return false;
    }
    
    // News API keys should be 32 character hex strings, not sk- format
    if (key.startsWith('sk-')) {
        console.log('   ❌ Wrong key format (using Monica key format)');
        console.log('   📝 Need real News API key from: https://newsapi.org/register');
        return false;
    }
    
    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${key}`);
        
        if (response.status === 401) {
            console.log('   ❌ Invalid API key');
            return false;
        } else if (response.ok) {
            console.log('   ✅ API is working');
            return true;
        } else {
            console.log('   ❌ Error: ' + response.status);
            return false;
        }
    } catch (error) {
        console.log('   ❌ Connection error: ' + error.message);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    const results = {
        monica: await testMonicaAPI(),
        weather: await testWeatherAPI(),
        news: await testNewsAPI()
    };
    
    console.log('\n' + '=' .repeat(50));
    console.log('\n📊 SUMMARY:');
    
    const working = Object.values(results).filter(r => r).length;
    const total = Object.keys(results).length;
    
    console.log(`   ${working}/${total} APIs configured`);
    
    if (!results.monica) {
        console.log('\n⚠️  Monica AI needs credits or valid key');
    }
    
    if (!results.weather || !results.news) {
        console.log('\n📝 TO FIX WEATHER & NEWS APIs:');
        console.log('   1. Get free OpenWeather key: https://openweathermap.org/api');
        console.log('   2. Get free News API key: https://newsapi.org/register');
        console.log('   3. Update .env file with real keys (not sk- format)');
    }
    
    console.log('\n💡 The app will still work with just Monica API');
    console.log('   Weather and News features are optional enhancements');
}

runAllTests();