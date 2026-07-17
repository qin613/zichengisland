import { ref, watch } from 'vue'

/**
 * 响应式的 localStorage 封装
 * 数据变化会自动同步到 localStorage
 *
 * @param {string} key 存储键
 * @param {*} defaultValue 默认值
 * @returns {import('vue').Ref} 响应式 ref
 */
export function useLocalStorage(key, defaultValue) {
  const read = () => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : defaultValue
    } catch {
      return defaultValue
    }
  }

  const state = ref(read())

  watch(
    state,
    (val) => {
      try {
        localStorage.setItem(key, JSON.stringify(val))
      } catch (e) {
        console.error('[useLocalStorage] 写入失败:', e)
      }
    },
    { deep: true }
  )

  return state
}
