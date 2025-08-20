/**
 * API Keys Routes
 * Secure management of external API keys for weather and news services
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Secure API key storage (in production, use encrypted database or key vault)
const API_KEYS = {
  weather: {
    openweathermap: process.env.OPENWEATHER_API_KEY || 'demo-weather-key',
    backup: process.env.BACKUP_WEATHER_API_KEY || null
  },
  news: {
    newsapi: process.env.NEWS_API_KEY || 'demo-news-key',
    currents: process.env.CURRENTS_API_KEY || null,
    backup: process.env.BACKUP_NEWS_API_KEY || null
  },
  geolocation: {
    ipgeolocation: process.env.IPGEOLOCATION_API_KEY || null,
    ipstack: process.env.IPSTACK_API_KEY || null
  }
};

// Rate limiting for API key requests
const apiKeyRequestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 10;

// Get weather API key
router.get('/weather', authenticateToken, asyncHandler(async (req, res) => {
  // Rate limiting check
  if (!checkRateLimit(req.user.id)) {
    return res.status(429).json({ 
      error: 'Too many API key requests',
      retryAfter: 60
    });
  }

  // Only provide API keys to authenticated users
  if (req.user.id === 'anonymous') {
    return res.status(401).json({ error: 'Authentication required for weather API access' });
  }

  const weatherKey = API_KEYS.weather.openweathermap;
  
  if (!weatherKey || weatherKey === 'demo-weather-key') {
    return res.status(503).json({ 
      error: 'Weather service temporarily unavailable',
      fallback: true
    });
  }

  res.json({
    apiKey: weatherKey,
    service: 'openweathermap',
    expiresIn: 3600, // 1 hour
    limits: {
      requestsPerMinute: 60,
      requestsPerDay: 1000
    }
  });
}));

// Get news API key
router.get('/news', authenticateToken, asyncHandler(async (req, res) => {
  // Rate limiting check
  if (!checkRateLimit(req.user.id)) {
    return res.status(429).json({ 
      error: 'Too many API key requests',
      retryAfter: 60
    });
  }

  // Only provide API keys to authenticated users
  if (req.user.id === 'anonymous') {
    return res.status(401).json({ error: 'Authentication required for news API access' });
  }

  const newsKey = API_KEYS.news.newsapi;
  
  if (!newsKey || newsKey === 'demo-news-key') {
    return res.status(503).json({ 
      error: 'News service temporarily unavailable',
      fallback: true
    });
  }

  res.json({
    apiKey: newsKey,
    service: 'newsapi',
    expiresIn: 3600, // 1 hour
    limits: {
      requestsPerDay: req.user.tier === 'free' ? 500 : 5000,
      articlesPerRequest: req.user.tier === 'free' ? 10 : 100
    }
  });
}));

// Get geolocation API key
router.get('/geolocation', authenticateToken, asyncHandler(async (req, res) => {
  // Rate limiting check
  if (!checkRateLimit(req.user.id)) {
    return res.status(429).json({ 
      error: 'Too many API key requests',
      retryAfter: 60
    });
  }

  const geoKey = API_KEYS.geolocation.ipgeolocation;
  
  if (!geoKey) {
    return res.status(503).json({ 
      error: 'Geolocation service unavailable',
      fallback: true
    });
  }

  res.json({
    apiKey: geoKey,
    service: 'ipgeolocation',
    expiresIn: 3600
  });
}));

// Proxy endpoint for weather data (to hide API keys)
router.get('/weather/current', authenticateToken, asyncHandler(async (req, res) => {
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude required' });
  }

  const weatherKey = API_KEYS.weather.openweathermap;
  
  if (!weatherKey || weatherKey === 'demo-weather-key') {
    return res.json(generateMockWeatherData(lat, lon));
  }

  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`
    );
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status}`);
    }
    
    const weatherData = await weatherResponse.json();
    
    // Transform to our format
    const transformedData = {
      location: {
        city: weatherData.name,
        country: weatherData.sys.country,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
      },
      current: {
        temperature: Math.round(weatherData.main.temp),
        feels_like: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        visibility: Math.round((weatherData.visibility || 10000) / 1000),
        weather: {
          main: weatherData.weather[0].main,
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon
        },
        wind: {
          speed: weatherData.wind?.speed || 0,
          direction: weatherData.wind?.deg || 0
        }
      },
      timestamp: new Date()
    };
    
    res.json(transformedData);
    
  } catch (error) {
    console.error('Weather proxy error:', error);
    res.json(generateMockWeatherData(lat, lon));
  }
}));

// Proxy endpoint for news data
router.get('/news/headlines', authenticateToken, asyncHandler(async (req, res) => {
  const { country = 'tw', category = 'general', pageSize = 10 } = req.query;
  
  const newsKey = API_KEYS.news.newsapi;
  
  if (!newsKey || newsKey === 'demo-news-key') {
    return res.json(generateMockNewsData(country, category));
  }

  try {
    const newsResponse = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&apiKey=${newsKey}`
    );
    
    if (!newsResponse.ok) {
      throw new Error(`News API error: ${newsResponse.status}`);
    }
    
    const newsData = await newsResponse.json();
    
    // Transform to our format
    const transformedData = {
      articles: newsData.articles.map(article => ({
        id: generateArticleId(article),
        title: article.title,
        description: article.description || '',
        content: article.content || '',
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: new Date(article.publishedAt),
        source: {
          id: article.source.id || 'unknown',
          name: article.source.name || 'Unknown Source'
        },
        category,
        country: country.toUpperCase(),
        language: getLanguageFromCountry(country)
      })),
      totalResults: newsData.totalResults,
      lastUpdated: new Date(),
      location: getLocationFromCountry(country),
      category
    };
    
    res.json(transformedData);
    
  } catch (error) {
    console.error('News proxy error:', error);
    res.json(generateMockNewsData(country, category));
  }
}));

// Rate limiting helper
function checkRateLimit(userId) {
  const now = Date.now();
  const userRequests = apiKeyRequestCounts.get(userId) || [];
  
  // Remove old requests outside the window
  const recentRequests = userRequests.filter(timestamp => 
    now - timestamp < RATE_LIMIT_WINDOW
  );
  
  if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  // Add current request
  recentRequests.push(now);
  apiKeyRequestCounts.set(userId, recentRequests);
  
  return true;
}

// Mock data generators for fallback
function generateMockWeatherData(lat, lon) {
  const cities = {
    '25.0330': { name: 'Taipei', country: 'TW' },
    '39.9042': { name: 'Beijing', country: 'CN' },
    '35.6762': { name: 'Tokyo', country: 'JP' },
    '40.7128': { name: 'New York', country: 'US' }
  };
  
  const cityKey = Math.round(parseFloat(lat)).toString();
  const city = cities[cityKey] || { name: 'Unknown City', country: 'XX' };
  
  const weatherTypes = ['Clear', 'Clouds', 'Rain', 'Drizzle'];
  const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  
  return {
    location: {
      city: city.name,
      country: city.country,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon)
    },
    current: {
      temperature: Math.round(15 + Math.random() * 20),
      feels_like: Math.round(15 + Math.random() * 20),
      humidity: Math.round(40 + Math.random() * 40),
      pressure: Math.round(1000 + Math.random() * 50),
      visibility: Math.round(8 + Math.random() * 2),
      weather: {
        main: randomWeather,
        description: randomWeather.toLowerCase(),
        icon: '01d'
      },
      wind: {
        speed: Math.round(Math.random() * 10),
        direction: Math.round(Math.random() * 360)
      }
    },
    forecast: generateMockForecast(),
    timestamp: new Date(),
    mock: true
  };
}

function generateMockForecast() {
  const forecast = [];
  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    forecast.push({
      date: date.toDateString(),
      temp_max: Math.round(20 + Math.random() * 15),
      temp_min: Math.round(10 + Math.random() * 10),
      weather: {
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }
    });
  }
  return forecast;
}

function generateMockNewsData(country, category) {
  const mockArticles = [
    {
      id: 'mock-1',
      title: '科技創新推動永續發展',
      description: '最新的綠色科技正在改變我們對環保的看法，為未來帶來新希望。',
      content: '詳細內容...',
      url: '#',
      urlToImage: null,
      publishedAt: new Date(),
      source: { id: 'mock-tech', name: 'Tech News' },
      category,
      country: country.toUpperCase(),
      language: getLanguageFromCountry(country)
    },
    {
      id: 'mock-2',
      title: '經濟復甦展現積極信號',
      description: '各項經濟指標顯示復甦趨勢明確，投資者信心逐漸恢復。',
      content: '詳細內容...',
      url: '#',
      urlToImage: null,
      publishedAt: new Date(),
      source: { id: 'mock-econ', name: 'Economic Times' },
      category,
      country: country.toUpperCase(),
      language: getLanguageFromCountry(country)
    }
  ];

  return {
    articles: mockArticles,
    totalResults: mockArticles.length,
    lastUpdated: new Date(),
    location: getLocationFromCountry(country),
    category,
    mock: true
  };
}

function generateArticleId(article) {
  return `${article.source?.id || 'unknown'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getLanguageFromCountry(country) {
  const countryLanguageMap = {
    'TW': 'zh-TW',
    'CN': 'zh-CN',
    'HK': 'zh-HK',
    'JP': 'ja',
    'KR': 'ko',
    'US': 'en',
    'GB': 'en'
  };
  return countryLanguageMap[country.toUpperCase()] || 'en';
}

function getLocationFromCountry(country) {
  const countryLocationMap = {
    'TW': 'Taiwan',
    'CN': 'China',
    'JP': 'Japan',
    'KR': 'South Korea',
    'US': 'United States',
    'GB': 'United Kingdom'
  };
  return countryLocationMap[country.toUpperCase()] || 'Unknown';
}

export default router;