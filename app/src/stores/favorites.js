import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 食谱收藏 store
 * 收藏的数据持久化在 localStorage
 */
export const useFavoritesStore = defineStore('favorites', () => {
  // 直接读写 localStorage，避免 SSR 问题
  const STORAGE_KEY = 'life-hub:favorites'

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  }

  const items = ref(load())

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  const count = computed(() => items.value.length)

  /** 判断某个食谱是否已收藏 */
  function isFavorite(id) {
    return items.value.some((m) => m.id === id)
  }

  /** 切换收藏状态 */
  function toggle(meal) {
    const idx = items.value.findIndex((m) => m.id === meal.id)
    if (idx >= 0) {
      items.value.splice(idx, 1)
    } else {
      // 只存必要字段
      items.value.unshift({
        id: meal.id,
        name: meal.name,
        thumb: meal.thumb,
        emoji: meal.emoji || null,
        color: meal.color || null,
        category: meal.category,
        area: meal.area
      })
    }
    persist()
  }

  /** 清空收藏 */
  function clear() {
    items.value = []
    persist()
  }

  return { items, count, isFavorite, toggle, clear }
})
