/**
 * 国家数据封装
 * 使用内置静态数据，零网络依赖，秒加载
 */
import { COUNTRIES } from '@/data/countries'

/** 大洲中英对照 */
export const REGIONS = [
  { code: 'Asia', label: '亚洲' },
  { code: 'Europe', label: '欧洲' },
  { code: 'Americas', label: '美洲' },
  { code: 'Africa', label: '非洲' },
  { code: 'Oceania', label: '大洋洲' }
]

/**
 * 获取所有国家（直接返回内置数据）
 */
export async function getAllCountries() {
  // 模拟异步，保持接口一致
  return COUNTRIES.map((c) => ({
    ...c,
    official: c.name,
    languages: [],
    currencies: [],
    maps: `https://www.google.com/maps/search/${encodeURIComponent(c.name)}`
  })).sort((a, b) => a.name.localeCompare(b.name, 'zh'))
}

/**
 * 按国家名搜索
 */
export async function searchCountries(name) {
  if (!name?.trim()) return []
  const kw = name.trim().toLowerCase()
  const all = await getAllCountries()
  return all.filter(
    (c) =>
      c.name.toLowerCase().includes(kw) ||
      c.capital.toLowerCase().includes(kw)
  )
}

/**
 * 人口数格式化
 */
export function formatPopulation(num) {
  if (!num) return '—'
  if (num >= 1e8) return (num / 1e8).toFixed(1) + ' 亿'
  if (num >= 1e4) return (num / 1e4).toFixed(1) + ' 万'
  return num.toLocaleString()
}
