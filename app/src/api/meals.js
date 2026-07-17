/**
 * TheMealDB 食谱 API 封装
 * 文档: https://www.themealdb.com/api.php
 * 测试 key 为 "1"，支持 CORS，可直接前端调用
 */
const BASE = 'https://www.themealdb.com/api/json/v1/1'

/**
 * 按菜名搜索食谱
 * @param {string} name 菜名关键词
 */
export async function searchMealsByName(name) {
  if (!name?.trim()) return []
  const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(name)}`)
  const data = await res.json()
  return data.meals || []
}

/**
 * 按食材查找食谱（"冰箱有什么"功能）
 * @param {string} ingredient 食材名（英文效果更好，如 chicken, rice）
 */
export async function filterByIngredient(ingredient) {
  if (!ingredient?.trim()) return []
  const res = await fetch(
    `${BASE}/filter.php?i=${encodeURIComponent(ingredient)}`
  )
  const data = await res.json()
  return data.meals || []
}

/**
 * 按分类筛选
 * @param {string} category 如 Seafood, Dessert, Vegetarian
 */
export async function filterByCategory(category) {
  if (!category) return []
  const res = await fetch(
    `${BASE}/filter.php?c=${encodeURIComponent(category)}`
  )
  const data = await res.json()
  return data.meals || []
}

/**
 * 获取所有分类列表
 */
export async function getAllCategories() {
  const res = await fetch(`${BASE}/categories.php`)
  const data = await res.json()
  return data.categories || []
}

/**
 * 按 ID 获取食谱完整详情
 * @param {string} id 食谱 ID
 */
export async function getMealById(id) {
  const res = await fetch(`${BASE}/lookup.php?i=${id}`)
  const data = await res.json()
  return data.meals?.[0] || null
}

/**
 * 随机推荐一份食谱（"手气不错"）
 */
export async function getRandomMeal() {
  const res = await fetch(`${BASE}/random.php`)
  const data = await res.json()
  return data.meals?.[0] || null
}

/**
 * 将 TheMealDB 的食谱对象解析为结构化数据
 * 原始数据把食材和用量拆成了 strIngredient1..20 / strMeasure1..20
 */
export function parseMeal(raw) {
  if (!raw) return null
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ing = raw[`strIngredient${i}`]
    const measure = raw[`strMeasure${i}`]
    if (ing && ing.trim()) {
      ingredients.push({
        ingredient: ing.trim(),
        measure: (measure || '').trim()
      })
    }
  }
  return {
    id: raw.idMeal,
    name: raw.strMeal,
    category: raw.strCategory,
    area: raw.strArea,
    thumb: raw.strMealThumb,
    instructions: raw.strInstructions,
    youtube: raw.strYoutube,
    source: raw.strSource,
    tags: raw.strTags ? raw.strTags.split(',').map((t) => t.trim()) : [],
    ingredients
  }
}
