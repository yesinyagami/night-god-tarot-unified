# 🔧 Fix API Access Issues

## Current Status
- ❌ **Monica AI**: Valid key format but getting 404 error (may need new key or account issue)
- ❌ **OpenWeather**: Wrong key format (using Monica key instead of OpenWeather key)
- ❌ **News API**: Wrong key format (using Monica key instead of News API key)

## How to Fix

### 1. Monica AI API
Your current key might be expired or invalid. To get a new one:
1. Go to: https://openapi.monica.im
2. Sign up/Login to your account
3. Add credits to your account (they have free trial options)
4. Generate a new API key
5. Update in `.env`:
   ```
   MONICA_API_KEY=your-new-monica-key
   VITE_MONICA_API_KEY=your-new-monica-key
   ```

### 2. OpenWeather API (FREE)
1. Go to: https://openweathermap.org/api
2. Sign up for free account
3. Go to "API keys" section
4. Generate a new key (looks like: `a1b2c3d4e5f6...` - 32 characters)
5. Update in `.env`:
   ```
   OPENWEATHER_API_KEY=your-openweather-key
   VITE_OPENWEATHER_API_KEY=your-openweather-key
   ```

### 3. News API (FREE)
1. Go to: https://newsapi.org/register
2. Sign up for free account
3. You'll get an API key immediately
4. Update in `.env`:
   ```
   NEWS_API_KEY=your-newsapi-key
   VITE_NEWS_API_KEY=your-newsapi-key
   ```

## Quick Fix for Now

If you want the app to work without these APIs, update `.env`:

```env
# Disable optional features
MONICA_ONLY_MODE=true
DISABLE_WEATHER=true
DISABLE_NEWS=true
```

## Testing Your Keys

After updating `.env`, run:
```bash
node test-all-apis.mjs
```

## Important Notes

1. **The app will still work** even if weather/news APIs are not configured
2. **Monica AI** is the main API for tarot interpretations
3. Weather and News are optional enhancement features
4. Make sure to restart your dev server after updating `.env`

## Free API Limits
- **OpenWeather**: 1,000 calls/day (free tier)
- **NewsAPI**: 100 requests/day (free tier)
- **Monica AI**: Depends on your account credits