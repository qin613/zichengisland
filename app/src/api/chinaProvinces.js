/**
 * 中国省份数据 API 封装
 * 基于内置静态数据
 */
import { CHINA_PROVINCES, PROVINCE_REGIONS, getRegionLabel } from '@/data/chinaProvinces'

/**
 * 获取所有省份
 */
export async function getAllProvinces() {
  return CHINA_PROVINCES
}

/**
 * 按 ID 获取省份详情
 */
export function getProvinceById(id) {
  return CHINA_PROVINCES.find((p) => p.id === id) || null
}

/**
 * 按区域筛选省份
 */
export function filterByProvinceRegion(region) {
  if (!region) return CHINA_PROVINCES
  return CHINA_PROVINCES.filter((p) => p.region === region)
}

/**
 * 搜索省份（名称、省会、景点、美食）
 */
export function searchProvinces(keyword) {
  if (!keyword?.trim()) return CHINA_PROVINCES
  const kw = keyword.trim().toLowerCase()
  return CHINA_PROVINCES.filter(
    (p) =>
      p.name.includes(kw) ||
      p.capital.includes(kw) ||
      p.short.includes(kw) ||
      p.attractions.some((a) => a.includes(kw)) ||
      p.cuisine.some((c) => c.includes(kw))
  )
}

export { PROVINCE_REGIONS, getRegionLabel }
