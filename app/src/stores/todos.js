import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 待办清单 store
 * 同时供"效率模块"和"首页仪表盘今日预览"使用
 */
export const useTodosStore = defineStore('todos', () => {
  const STORAGE_KEY = 'life-hub:todos'

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

  /** 按优先级排序的列表 */
  const sortedItems = computed(() => {
    const order = { high: 0, medium: 1, low: 2 }
    return [...items.value].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1
      return (order[a.priority] ?? 1) - (order[b.priority] ?? 1)
    })
  })

  const activeItems = computed(() => items.value.filter((t) => !t.done))
  const doneItems = computed(() => items.value.filter((t) => t.done))
  const activeCount = computed(() => activeItems.value.length)

  function add(text, priority = 'medium') {
    if (!text?.trim()) return
    items.value.unshift({
      id: Date.now(),
      text: text.trim(),
      done: false,
      priority,
      createdAt: new Date().toISOString()
    })
    persist()
  }

  function toggle(id) {
    const t = items.value.find((x) => x.id === id)
    if (t) {
      t.done = !t.done
      persist()
    }
  }

  function update(id, patch) {
    const t = items.value.find((x) => x.id === id)
    if (t) {
      Object.assign(t, patch)
      persist()
    }
  }

  function remove(id) {
    items.value = items.value.filter((t) => t.id !== id)
    persist()
  }

  function clearDone() {
    items.value = items.value.filter((t) => !t.done)
    persist()
  }

  return {
    items,
    sortedItems,
    activeItems,
    doneItems,
    activeCount,
    add,
    toggle,
    update,
    remove,
    clearDone
  }
})
