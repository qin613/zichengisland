import { ref } from 'vue'

/**
 * 统一的请求封装 composable
 * 提供 loading / error / data 的响应式状态
 *
 * @returns {{ data, error, loading, run }}
 */
export function useFetch() {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  /**
   * 执行请求
   * @param {string} url
   * @param {RequestInit} options
   * @param {number} timeout 超时毫秒，默认 10s
   */
  async function run(url, options = {}, timeout = 10000) {
    loading.value = true
    error.value = null

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      if (!res.ok) {
        throw new Error(`请求失败 (${res.status})`)
      }
      const json = await res.json()
      data.value = json
      return json
    } catch (err) {
      error.value =
        err.name === 'AbortError' ? '请求超时，请稍后再试' : err.message
      console.error('[useFetch] 请求出错:', err)
      return null
    } finally {
      clearTimeout(timer)
      loading.value = false
    }
  }

  return { data, error, loading, run }
}
