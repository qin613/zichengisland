/**
 * Open-Meteo 天气 API 封装
 * 文档: https://open-meteo.com/
 * 完全免费、无需 API key、支持 CORS
 *
 * 同时封装了 geocoding（经纬度 → 城市名 反查不提供，这里用坐标直接查天气）
 */

const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast'
const GEO_BASE = 'https://geocoding-api.open-meteo.com/v1/search'

/** 天气代码 → 中文描述 + emoji */
export const WEATHER_CODES = {
  0: { label: '晴朗', icon: '☀️' },
  1: { label: '基本晴', icon: '🌤️' },
  2: { label: '多云', icon: '⛅' },
  3: { label: '阴天', icon: '☁️' },
  45: { label: '有雾', icon: '🌫️' },
  48: { label: '雾凇', icon: '🌫️' },
  51: { label: '小毛毛雨', icon: '🌦️' },
  53: { label: '毛毛雨', icon: '🌦️' },
  55: { label: '大毛毛雨', icon: '🌧️' },
  61: { label: '小雨', icon: '🌦️' },
  63: { label: '中雨', icon: '🌧️' },
  65: { label: '大雨', icon: '🌧️' },
  71: { label: '小雪', icon: '🌨️' },
  73: { label: '中雪', icon: '❄️' },
  75: { label: '大雪', icon: '❄️' },
  77: { label: '冰粒', icon: '🌨️' },
  80: { label: '阵雨', icon: '🌦️' },
  81: { label: '强阵雨', icon: '🌧️' },
  82: { label: '暴雨', icon: '⛈️' },
  85: { label: '阵雪', icon: '🌨️' },
  86: { label: '强阵雪', icon: '❄️' },
  95: { label: '雷暴', icon: '⛈️' },
  96: { label: '雷暴冰雹', icon: '⛈️' },
  99: { label: '强雷暴冰雹', icon: '⛈️' }
}

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { label: '未知', icon: '🌡️' }
}

/**
 * 根据经纬度获取当前天气
 * @param {number} latitude
 * @param {number} longitude
 */
export async function getCurrentWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude,
    longitude: longitude,
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    timezone: 'auto',
    forecast_days: 1
  })
  const res = await fetch(`${FORECAST_BASE}?${params}`)
  if (!res.ok) throw new Error('天气数据获取失败')
  const data = await res.json()
  return data.current
}

/**
 * 根据城市名搜索坐标（用于手动输入城市）
 * @param {string} cityName 城市名（支持中文/英文）
 */
export async function searchCity(cityName) {
  const params = new URLSearchParams({
    name: cityName,
    count: 5,
    language: 'zh',
    format: 'json'
  })
  const res = await fetch(`${GEO_BASE}?${params}`)
  if (!res.ok) throw new Error('城市查询失败')
  const data = await res.json()
  return data.results || []
}
