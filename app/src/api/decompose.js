/**
 * 智能任务拆解 — API 服务
 * 调用后端 Express 服务的 /api/decompose 接口
 */

// 开发环境直接连后端端口，绕开Vite代理（代理在Windows上有兼容问题）
const API_BASE = 'http://localhost:3000/api'

/**
 * 调用 DeepSeek API 拆解任务
 * @param {string} task - 任务描述
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function decomposeTask(task) {
  const res = await fetch(`${API_BASE}/decompose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task })
  })
  return res.json()
}

/**
 * 健康检查 — 校验后端与 API Key 状态
 * @returns {Promise<{success: boolean, apiConfigured: boolean, model?: string}>}
 */
export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`)
  return res.json()
}
