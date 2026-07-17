import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLearningStore = defineStore('learning', () => {
  const STORAGE_KEY = 'life-hub:learning'

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch { return {} }
  }

  const data = ref(load())

  // 各科目各难度的完成数
  if (!data.value.progress) data.value.progress = {}
  // 历史记录
  if (!data.value.history) data.value.history = []
  // 错题本
  if (!data.value.wrongQuestions) data.value.wrongQuestions = []

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.value))
  }

  /** 记录一次答题 */
  function recordResult(subject, difficulty, correct, total, wrongItems) {
    const key = `${subject}:${difficulty}`
    if (!data.value.progress[key]) {
      data.value.progress[key] = { attempted: 0, correct: 0 }
    }
    data.value.progress[key].attempted += total
    data.value.progress[key].correct += correct

    const now = new Date()
    data.value.history.unshift({
      ts: now.getTime(),
      date: now.toLocaleDateString('zh-CN'),
      subject,
      difficulty,
      correct,
      total,
      score: Math.round((correct / total) * 100)
    })
    if (data.value.history.length > 50) data.value.history.length = 50

    // 记录错题
    if (wrongItems && wrongItems.length > 0) {
      wrongItems.forEach(item => {
        addWrongQuestion(item.question, item.subject, item.difficulty)
      })
    }

    persist()
  }

  /** 获取某科目某难度的进度 */
  function getProgress(subject, difficulty) {
    const key = `${subject}:${difficulty}`
    return data.value.progress[key] || { attempted: 0, correct: 0 }
  }

  /** 总答题数 */
  const totalAttempted = computed(() =>
    Object.values(data.value.progress).reduce((s, p) => s + p.attempted, 0)
  )

  /** 总正确率 */
  const overallAccuracy = computed(() => {
    const all = Object.values(data.value.progress)
    const attempted = all.reduce((s, p) => s + p.attempted, 0)
    const correct = all.reduce((s, p) => s + p.correct, 0)
    return attempted ? Math.round((correct / attempted) * 100) : 0
  })

  /* ===== 错题本功能 ===== */

  /** 错题总数 */
  const wrongQuestionCount = computed(() => data.value.wrongQuestions.length)

  /** 添加或更新错题 */
  function addWrongQuestion(question, subject, difficulty) {
    // 检查是否已存在相同题目
    const existing = data.value.wrongQuestions.find(
      w => w.question.question === question.question && w.subject === subject
    )
    if (existing) {
      existing.wrongCount++
      existing.updatedAt = Date.now()
    } else {
      data.value.wrongQuestions.unshift({
        id: Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        question: JSON.parse(JSON.stringify(question)),
        subject,
        difficulty,
        addedAt: Date.now(),
        wrongCount: 1
      })
    }
    persist()
  }

  /** 移除错题（答对后移除） */
  function removeWrongQuestion(id) {
    const idx = data.value.wrongQuestions.findIndex(w => w.id === id)
    if (idx !== -1) {
      data.value.wrongQuestions.splice(idx, 1)
      persist()
    }
  }

  /** 获取错题列表，可按科目过滤 */
  function getWrongQuestions(subject) {
    if (subject) {
      return data.value.wrongQuestions.filter(w => w.subject === subject)
    }
    return data.value.wrongQuestions
  }

  /** 清空错题，可按科目清空 */
  function clearWrongQuestions(subject) {
    if (subject) {
      data.value.wrongQuestions = data.value.wrongQuestions.filter(w => w.subject !== subject)
    } else {
      data.value.wrongQuestions = []
    }
    persist()
  }

  return {
    data,
    recordResult,
    getProgress,
    totalAttempted,
    overallAccuracy,
    wrongQuestionCount,
    addWrongQuestion,
    removeWrongQuestion,
    getWrongQuestions,
    clearWrongQuestions
  }
})
