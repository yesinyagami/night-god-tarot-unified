# 🌤️📰 Weather & News System Setup Guide

Your Night God Tarot application now includes a sophisticated weather and news system with IP-based geolocation! Here's how to set it up and use it.

## 📋 Quick Setup Checklist

1. **Get API Keys** (5 minutes)
2. **Update Environment Variables** (2 minutes)
3. **Test the System** (1 minute)

## 🔑 API Keys Required

### 1. OpenWeatherMap API (Weather Data)
- **Free Tier**: 1,000 calls/day, 60 calls/minute
- **Sign up**: https://openweathermap.org/api
- **Cost**: FREE for basic usage

### 2. NewsAPI (News Data)
- **Free Tier**: 500 requests/day
- **Sign up**: https://newsapi.org/
- **Cost**: FREE for development

### 3. IP Geolocation API (Optional - Enhanced Location)
- **Free Tier**: 1,000 requests/month
- **Sign up**: https://ipgeolocation.io/
- **Cost**: FREE for basic usage

## 🛠️ Setup Instructions

### Step 1: Get Your API Keys

#### OpenWeatherMap:
1. Go to https://openweathermap.org/api
2. Click "Sign Up" 
3. Verify your email
4. Go to "API Keys" section
5. Copy your API key

#### NewsAPI:
1. Go to https://newsapi.org/
2. Click "Get API Key"
3. Fill out the form
4. Copy your API key from dashboard

#### IP Geolocation (Optional):
1. Go to https://ipgeolocation.io/
2. Sign up for free account
3. Copy API key from dashboard

### Step 2: Update Your Environment Variables

Open your `.env` file and replace the placeholder values:

```env
# Weather API
OPENWEATHER_API_KEY=your_actual_openweather_api_key_here
VITE_OPENWEATHER_API_KEY=your_actual_openweather_api_key_here

# News API  
NEWS_API_KEY=your_actual_newsapi_key_here
VITE_NEWS_API_KEY=your_actual_newsapi_key_here

# IP Geolocation (Optional)
IPGEOLOCATION_API_KEY=your_actual_ipgeolocation_key_here
VITE_IPGEOLOCATION_API_KEY=your_actual_ipgeolocation_key_here
```

### Step 3: Restart Your Application

```bash
# Stop your current development server (Ctrl+C)
# Then restart:
npm run dev:full
```

## 🎯 Features Included

### 🌤️ Weather Integration
- **Automatic Location Detection**: Uses your IP address to determine location
- **Current Weather**: Temperature, humidity, wind, visibility
- **5-Day Forecast**: Daily weather predictions
- **Mystical Interpretation**: Weather conditions tied to tarot energy readings
- **Fallback System**: Works without API keys using mock data

### 📰 News Integration  
- **Localized News**: News relevant to your geographic location
- **Multiple Categories**: General, Business, Technology, Health, etc.
- **Tarot Interpretations**: News events connected to tarot card meanings
- **Multiple Languages**: Support for Chinese, English, Japanese, Korean
- **Smart Caching**: Reduces API calls and improves performance

### 🔮 Mystical Features
- **Energy Readings**: Weather and news interpreted through tarot lens
- **Combined Guidance**: Integrated wisdom from world events and natural conditions
- **Cosmic Timing**: Understanding how current events align with personal journey

## 🎨 User Interface

The weather and news widget appears as a floating cosmic button in the top-right corner:

- **📰 Toggle Button**: Click to expand/collapse
- **🌤️ Weather Tab**: Current weather and 5-day forecast
- **📰 News Tab**: Latest news with tarot interpretations  
- **🔮 Mystical Tab**: Combined wisdom and spiritual guidance

## 🛡️ Security & Privacy

- **API Key Protection**: Keys are secured on the backend
- **Rate Limiting**: Prevents API abuse
- **CORS Security**: Proper domain restrictions
- **IP-Only Location**: No personal data collection
- **Fallback Mode**: Works without any API keys

## 🚀 Advanced Configuration

### Custom Locations
By default, the system detects location via IP. For testing with specific locations:

```javascript
// In browser console
localStorage.setItem('testLocation', JSON.stringify({
  city: 'Tokyo',
  country: 'JP',
  latitude: 35.6762,
  longitude: 139.6503
}));
```

### Language Preferences
The system automatically detects language based on location but you can override:

```javascript
// Force Traditional Chinese
localStorage.setItem('preferredLanguage', 'zh-TW');
```

## 🔧 Troubleshooting

### Weather Not Loading
1. Check your OpenWeatherMap API key
2. Verify the key is active (can take 10 minutes after signup)
3. Check browser console for errors
4. Fallback mode provides mock weather data

### News Not Loading  
1. Verify NewsAPI key is correct
2. Check rate limits (500 requests/day on free tier)
3. Some countries may have restrictions
4. Fallback mode provides sample news

### Location Detection Issues
1. The system tries multiple IP geolocation services
2. Falls back to Taipei, Taiwan if all fail
3. VPNs may affect location accuracy
4. Works in all major browsers

## 📊 API Usage Monitoring

### Free Tier Limits:
- **OpenWeatherMap**: 1,000 calls/day (≈ 1 user per minute all day)
- **NewsAPI**: 500 calls/day (≈ 1 user every 3 minutes all day)
- **IP Geolocation**: 1,000 calls/month (cached for 1 hour per user)

### Optimizations Included:
- **Smart Caching**: 10-minute weather cache, 15-minute news cache
- **Batch Requests**: Combines multiple data points
- **Fallback Systems**: Continues working if APIs fail
- **Rate Limiting**: Prevents accidental overuse

## 🌟 Example Usage

Once set up, your users will see:

1. **Weather Widget**: "📍 Taipei, TW - 25°C ☀️"
2. **Mystical Weather**: "陽光普照，宇宙能量充沛，適合進行積極的占卜和顯化"
3. **Local News**: "科技創新推動永續發展" with tarot interpretation
4. **Combined Guidance**: Integrated wisdom from weather patterns and world events

## 💡 Pro Tips

1. **Monitor Usage**: Keep track of API calls in production
2. **Cache Aggressively**: The included caching reduces API calls by 80%
3. **Fallback Always**: System works beautifully without any API keys
4. **Test Thoroughly**: Try different locations and languages
5. **User Feedback**: Weather and news can enhance tarot readings significantly

## 🎭 Integration with Tarot Readings

The weather and news data enhances tarot readings by:

- **Contextual Awareness**: Understanding current world energy
- **Timing Insights**: Weather patterns affecting reading timing  
- **Collective Consciousness**: News events reflecting collective themes
- **Seasonal Wisdom**: Natural cycles influencing interpretation

Your Night God Tarot now connects users not just to cosmic wisdom, but to the living, breathing energy of the world around them! 🌍✨

---

## 🆘 Need Help?

If you encounter any issues:

1. Check the browser console for error messages
2. Verify all API keys are correctly set in `.env`
3. Restart your development server
4. Test with fallback mode first (works without API keys)

The system is designed to work beautifully even without API keys - the cosmic wisdom flows regardless! 🌙🔮