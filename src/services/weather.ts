/**
 * Weather Service with IP-based Geolocation
 * Provides weather data for the user's location
 */

interface OpenWeatherAPIForecastItem {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
    deg: number
  }
}

interface ForecastDayData {
  date: string
  temps: number[]
  weather: { main: string; description: string; icon: string }
}

export interface WeatherData {
  location: {
    city: string
    country: string
    latitude: number
    longitude: number
  }
  current: {
    temperature: number
    feels_like: number
    humidity: number
    pressure: number
    visibility: number
    weather: {
      main: string
      description: string
      icon: string
    }
    wind: {
      speed: number
      direction: number
    }
  }
  forecast: Array<{
    date: string
    temp_max: number
    temp_min: number
    weather: {
      main: string
      description: string
      icon: string
    }
  }>
  timestamp: Date
}

interface LocationData {
  ip: string
  city: string
  region: string
  country: string
  latitude: number
  longitude: number
  timezone: string
}

class WeatherService {
  private apiKey: string | null = null
  private lastWeatherUpdate: Date | null = null
  private cachedWeather: WeatherData | null = null
  private cacheTimeout = 10 * 60 * 1000 // 10 minutes

  async initialize(): Promise<void> {
    // Get API key from environment or backend
    this.apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || 
                  await this.getSecureApiKey('weather')
                  
    // Initialize Monica AI integration for weather interpretations
    this.monicaApiKey = import.meta.env.VITE_MONICA_API_KEY || 
                       await this.getSecureApiKey('monica')
  }
  
  private monicaApiKey: string | null = null

  async getCurrentWeather(): Promise<WeatherData> {
    // Check cache first
    if (this.cachedWeather && this.lastWeatherUpdate) {
      const timeSinceUpdate = Date.now() - this.lastWeatherUpdate.getTime()
      if (timeSinceUpdate < this.cacheTimeout) {
        return this.cachedWeather
      }
    }

    try {
      // Get user location by IP
      const location = await this.getUserLocationByIP()
      
      // Fetch weather data
      const weatherData = await this.fetchWeatherData(location.latitude, location.longitude)
      
      // Cache the result
      this.cachedWeather = weatherData
      this.lastWeatherUpdate = new Date()
      
      return weatherData
    } catch (error) {
      console.error('Weather service error:', error)
      throw new Error('Failed to fetch weather data')
    }
  }

  private async getUserLocationByIP(): Promise<LocationData> {
    try {
      // Try multiple IP geolocation services for reliability
      const services = [
        () => this.fetchFromIPInfo(),
        () => this.fetchFromIPAPI(),
        () => this.fetchFromIPGeolocation()
      ]

      for (const service of services) {
        try {
          const location = await service()
          if (location.latitude && location.longitude) {
            return location
          }
        } catch (serviceError) {
          console.warn('IP service failed, trying next:', serviceError)
          continue
        }
      }

      throw new Error('All IP geolocation services failed')
    } catch (error) {
      // Fallback to default location (Taipei)
      console.warn('Using fallback location:', error)
      return {
        ip: 'unknown',
        city: 'Taipei',
        region: 'Taiwan',
        country: 'TW',
        latitude: 25.0330,
        longitude: 121.5654,
        timezone: 'Asia/Taipei'
      }
    }
  }

  private async fetchFromIPInfo(): Promise<LocationData> {
    const response = await fetch('https://ipinfo.io/json', {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) throw new Error('IPInfo API failed')
    
    const data = await response.json()
    const [lat, lon] = data.loc.split(',')
    
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      timezone: data.timezone
    }
  }

  private async fetchFromIPAPI(): Promise<LocationData> {
    const response = await fetch('http://ip-api.com/json/', {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) throw new Error('IP-API failed')
    
    const data = await response.json()
    
    if (data.status !== 'success') {
      throw new Error('IP-API returned error status')
    }
    
    return {
      ip: data.query,
      city: data.city,
      region: data.regionName,
      country: data.countryCode,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone
    }
  }

  private async fetchFromIPGeolocation(): Promise<LocationData> {
    // This would require an API key for ipgeolocation.io
    const apiKey = import.meta.env.VITE_IPGEOLOCATION_API_KEY
    if (!apiKey) throw new Error('No IP Geolocation API key')

    const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) throw new Error('IP Geolocation API failed')
    
    const data = await response.json()
    
    return {
      ip: data.ip,
      city: data.city,
      region: data.state_prov,
      country: data.country_code2,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      timezone: data.time_zone.name
    }
  }

  private async fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new Error('Weather API key not configured')
    }

    // Current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
    )
    
    if (!currentResponse.ok) {
      throw new Error(`OpenWeatherMap API error: ${currentResponse.status}`)
    }
    
    const currentData = await currentResponse.json()

    // 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
    )
    
    if (!forecastResponse.ok) {
      throw new Error(`OpenWeatherMap Forecast API error: ${forecastResponse.status}`)
    }
    
    const forecastData = await forecastResponse.json()

    // Process forecast data (get daily data)
    const dailyForecast = this.processForecastData(forecastData.list)

    return {
      location: {
        city: currentData.name,
        country: currentData.sys.country,
        latitude: lat,
        longitude: lon
      },
      current: {
        temperature: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        visibility: Math.round((currentData.visibility || 10000) / 1000),
        weather: {
          main: currentData.weather[0].main,
          description: currentData.weather[0].description,
          icon: currentData.weather[0].icon
        },
        wind: {
          speed: currentData.wind?.speed || 0,
          direction: currentData.wind?.deg || 0
        }
      },
      forecast: dailyForecast,
      timestamp: new Date()
    }
  }

  private processForecastData(forecastList: OpenWeatherAPIForecastItem[]): WeatherData['forecast'] {
    const dailyData = new Map<string, ForecastDayData>()
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString()
      
      if (!dailyData.has(date)) {
        dailyData.set(date, {
          date,
          temps: [item.main.temp],
          weather: item.weather[0]
        })
      } else {
        dailyData.get(date)!.temps.push(item.main.temp)
      }
    })

    return Array.from(dailyData.values())
      .slice(1, 6) // Next 5 days
      .map(day => ({
        date: day.date,
        temp_max: Math.round(Math.max(...day.temps)),
        temp_min: Math.round(Math.min(...day.temps)),
        weather: {
          main: day.weather.main,
          description: day.weather.description,
          icon: day.weather.icon
        }
      }))
  }

  private async getSecureApiKey(service: 'weather' | 'news' | 'monica'): Promise<string> {
    try {
      const response = await fetch(`/api/keys/${service}`, {
        credentials: 'include'
      })
      
      if (!response.ok) throw new Error('Failed to get API key')
      
      const data = await response.json()
      return data.apiKey
    } catch (error) {
      console.warn(`Could not get secure ${service} API key:`, error)
      return ''
    }
  }

  // Utility method to get weather emoji
  getWeatherEmoji(weatherMain: string): string {
    const emojiMap: Record<string, string> = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '😶‍🌫️'
    }
    return emojiMap[weatherMain] || '🌤️'
  }

  // Get AI-enhanced mystical weather interpretation
  async getMysticalInterpretation(weatherData: WeatherData): Promise<string> {
    if (this.monicaApiKey) {
      try {
        return await this.getMonicaWeatherInterpretation(weatherData)
      } catch (error) {
        console.warn('Monica weather interpretation failed, using fallback:', error)
      }
    }
    
    // Fallback to basic interpretation
    const { weather, temperature } = weatherData.current
    const interpretations: Record<string, string> = {
      'Clear': '陽光普照，宇宙能量充沛，適合進行積極的占卜和顯化',
      'Clouds': '雲霧繚繞，適合內省和靈性思考，隱藏的智慧將被揭示',
      'Rain': '雨水淨化大地，情感能量流動，適合處理感情和療癒議題',
      'Thunderstorm': '雷電交加，強大的轉化能量，重大變革即將來臨',
      'Snow': '雪花紛飛，寧靜與純淨，適合冥想和深度靈性連接',
      'Mist': '薄霧籠罩，神秘能量濃厚，直覺力將得到增強'
    }

    const tempInterpretation = temperature > 25 ? '炎熱的能量激發行動力' :
                             temperature > 15 ? '溫和的能量平衡身心' :
                             '清涼的能量讓思緒更加清明'

    return `${interpretations[weather.main] || '天氣變化暗示著能量的流動'}。${tempInterpretation}。`
  }

  // Monica AI weather interpretation
  private async getMonicaWeatherInterpretation(weatherData: WeatherData): Promise<string> {
    const prompt = `你是一位結合氣象學與塔羅占卜的神秘學大師。請根據以下天氣數據提供深度的靈性解讀：

🌤️ 天氣狀況：${weatherData.current.weather.description}
🌡️ 溫度：${weatherData.current.temperature}°C (體感 ${weatherData.current.feels_like}°C)
💧 濕度：${weatherData.current.humidity}%
🌪️ 風速：${weatherData.current.wind.speed} m/s
👁️ 能見度：${weatherData.current.visibility} km
📍 地點：${weatherData.location.city}, ${weatherData.location.country}

請提供一個80-120字的神秘學解讀，內容包括：
1. 當前天象的靈性意義
2. 對塔羅占卜活動的影響
3. 個人能量狀態的建議
4. 今日宇宙能量的流動方向

請用充滿詩意但實用的中文回答，融合古老智慧與現代理解。`

    const response = await fetch('https://openapi.monica.im/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.monicaApiKey}`
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        messages: [
          {
            role: 'system',
            content: '你是夜神塔羅的首席氣象靈性導師，擅長將天氣現象與塔羅能量相結合，提供深邃而實用的靈性指引。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 300
      })
    })

    if (!response.ok) {
      throw new Error(`Monica API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  }
}

export const weatherService = new WeatherService()