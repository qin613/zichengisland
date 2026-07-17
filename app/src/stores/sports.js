import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSportsStore = defineStore('sports', () => {
  const STORAGE_KEY = 'life-hub:sports'

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch { return {} }
  }

  const data = ref(load())

  // 运动记录
  if (!data.value.logs) data.value.logs = []

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.value))
  }

  /** 添加一条运动记录 */
  function addLog(entry) {
    const now = new Date()
    data.value.logs.unshift({
      ts: now.getTime(),
      date: now.toLocaleDateString('zh-CN'),
      ...entry
    })
    // 只保留最近 100 条
    if (data.value.logs.length > 100) data.value.logs.length = 100
    persist()
  }

  /** 删除记录 */
  function removeLog(ts) {
    data.value.logs = data.value.logs.filter((l) => l.ts !== ts)
    persist()
  }

  /** 本周运动次数 */
  const weeklyCount = computed(() => {
    const now = new Date()
    const weekAgo = now.getTime() - 7 * 24 * 3600 * 1000
    return data.value.logs.filter((l) => l.ts > weekAgo).length
  })

  /** 总运动时长（分钟） */
  const totalMinutes = computed(() =>
    data.value.logs.reduce((sum, l) => sum + (l.duration || 0), 0)
  )

  return { data, addLog, removeLog, weeklyCount, totalMinutes }
})
