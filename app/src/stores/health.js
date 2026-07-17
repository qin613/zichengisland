import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 健康生活数据 store
 * 管理喝水、体重、睡眠、习惯打卡
 * 所有记录按日期(YYYY-MM-DD)索引，存 localStorage
 */
export const useHealthStore = defineStore('health', () => {
  const STORAGE_KEY = 'life-hub:health'

  function todayKey() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch {
      return {}
    }
  }

  /** 完整数据：{ water: {date: cups}, weight: [{date, value}], sleep: [{date, start, end, hours}], habits: {...} } */
  const data = ref(load())

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.value))
  }

  // 默认结构
  if (!data.value.water) data.value.water = {}
  if (!data.value.weight) data.value.weight = []
  if (!data.value.sleep) data.value.sleep = []
  if (!data.value.habits) data.value.habits = {}
  if (!data.value.habitList) data.value.habitList = []
  persist()

  /* ===== 喝水 ===== */
  const WATER_CUP = 250 // 每杯 250ml
  const WATER_GOAL = 8 // 每日目标 8 杯

  const todayCups = computed(() => data.value.water[todayKey()] || 0)
  const todayWaterMl = computed(() => todayCups.value * WATER_CUP)
  const waterProgress = computed(() =>
    Math.min(100, (todayCups.value / WATER_GOAL) * 100)
  )

  function addWater(cups = 1) {
    const key = todayKey()
    data.value.water[key] = (data.value.water[key] || 0) + cups
    persist()
  }

  function setWater(cups) {
    data.value.water[todayKey()] = Math.max(0, cups)
    persist()
  }

  /* ===== 体重 ===== */
  function addWeight(value) {
    if (!value || isNaN(value)) return
    data.value.weight.push({
      date: todayKey(),
      value: Number(value),
      ts: Date.now()
    })
    // 只保留最近 60 条
    if (data.value.weight.length > 60) {
      data.value.weight = data.value.weight.slice(-60)
    }
    persist()
  }

  function removeWeight(ts) {
    data.value.weight = data.value.weight.filter((w) => w.ts !== ts)
    persist()
  }

  const latestWeight = computed(() => {
    const list = data.value.weight
    return list.length ? list[list.length - 1].value : null
  })

  /* ===== 睡眠 ===== */
  function addSleep(startTime, endTime) {
    const hours = calcSleepHours(startTime, endTime)
    data.value.sleep.push({
      date: todayKey(),
      start: startTime,
      end: endTime,
      hours,
      ts: Date.now()
    })
    persist()
    return hours
  }

  function calcSleepHours(start, end) {
    const [sh, sm] = start.split(':').map(Number)
    const [eh, em] = end.split(':').map(Number)
    let mins = eh * 60 + em - (sh * 60 + sm)
    if (mins < 0) mins += 24 * 60 // 跨天
    return Math.round((mins / 60) * 10) / 10
  }

  function removeSleep(ts) {
    data.value.sleep = data.value.sleep.filter((s) => s.ts !== ts)
    persist()
  }

  const lastSleep = computed(() => {
    const list = data.value.sleep
    return list.length ? list[list.length - 1] : null
  })

  /* ===== 习惯打卡 ===== */
  function addHabit(name) {
    if (!name?.trim()) return
    const id = Date.now()
    data.value.habitList.push({ id, name: name.trim(), createdAt: id })
    data.value.habits[id] = []
    persist()
  }

  function removeHabit(id) {
    data.value.habitList = data.value.habitList.filter((h) => h.id !== id)
    delete data.value.habits[id]
    persist()
  }

  /** 切换今日打卡状态 */
  function toggleHabit(id) {
    const key = todayKey()
    const list = data.value.habits[id] || []
    const idx = list.indexOf(key)
    if (idx >= 0) {
      list.splice(idx, 1)
    } else {
      list.push(key)
    }
    data.value.habits[id] = list
    persist()
  }

  function isHabitDoneToday(id) {
    return (data.value.habits[id] || []).includes(todayKey())
  }

  /** 计算习惯连续打卡天数 */
  function habitStreak(id) {
    const list = [...(data.value.habits[id] || [])].sort()
    if (!list.length) return 0
    // 从今天往前数连续天数
    let streak = 0
    const d = new Date()
    while (true) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      if (list.includes(key)) {
        streak++
        d.setDate(d.getDate() - 1)
      } else if (streak === 0) {
        // 今天没打，从昨天开始算
        d.setDate(d.getDate() - 1)
        const key2 = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        if (list.includes(key2)) {
          streak++
          d.setDate(d.getDate() - 1)
        } else {
          break
        }
      } else {
        break
      }
    }
    return streak
  }

  return {
    data,
    // 喝水
    WATER_CUP,
    WATER_GOAL,
    todayCups,
    todayWaterMl,
    waterProgress,
    addWater,
    setWater,
    // 体重
    addWeight,
    removeWeight,
    latestWeight,
    // 睡眠
    addSleep,
    removeSleep,
    lastSleep,
    calcSleepHours,
    // 习惯
    addHabit,
    removeHabit,
    toggleHabit,
    isHabitDoneToday,
    habitStreak,
    todayKey
  }
})
