<script setup>
/**
 * DecomposeView - 智能任务拆解模块
 * 输入一句话 → AI 自动拆解为结构化子任务
 */
import { ref, computed, onMounted } from 'vue'
import { decomposeTask, checkHealth } from '@/api/decompose'
import GlassCard from '@/components/common/GlassCard.vue'

// ═══ 状态 ═══════════════════════════════
const taskInput = ref('')
const loading = ref(false)
const error = ref('')
const subtasks = ref([])
const originalTask = ref('')
const historyId = ref(null)
const apiReady = ref(false)
const resultsRef = ref(null)

// ═══ 字符计数 ═══════════════════════════
const charCount = computed(() => taskInput.value.length)
const charWarn = computed(() => charCount.value > 1800)

// ═══ 健康检查 ═══════════════════════════
onMounted(async () => {
  try {
    const h = await checkHealth()
    apiReady.value = h.apiConfigured
  } catch {
    apiReady.value = false
  }
  renderHistory()
})

// ═══ 提交拆解 ═══════════════════════════
async function handleSubmit() {
  if (loading.value) return
  const task = taskInput.value.trim()

  if (!task) { toast('请输入任务描述', 'err'); return }
  if (task.length < 2) { toast('任务描述太短，至少输入2个字符', 'err'); return }
  if (task.length > 2000) { toast('任务描述过长，最多2000个字符', 'err'); return }
  if (!apiReady.value) { toast('后端服务未就绪，请检查 API Key 配置', 'err'); return }

  loading.value = true
  error.value = ''

  try {
    const d = await decomposeTask(task)
    if (!d.success) throw new Error(d.error || '拆解失败')

    subtasks.value = d.data.subtasks
    originalTask.value = d.data.originalTask
    historyId.value = Date.now().toString()

    saveToHistory(d.data)
    renderHistory()
    toast(`✅ 成功拆解为 ${d.data.totalCount} 个子任务`, 'ok')
    setTimeout(() => resultsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  } catch (e) {
    error.value = e.message
    toast(e.message, 'err')
  } finally {
    loading.value = false
  }
}

// ═══ 操作 ═══════════════════════════════
function toggleTask(i) { document.getElementById(`row-${i}`)?.classList.toggle('done') }

function toggleEdit(i) {
  const row = document.getElementById(`row-${i}`)
  if (!row) return
  if (row.classList.contains('editing')) {
    const ti = row.querySelector('.edit-title-input')
    const di = row.querySelector('.edit-desc-input')
    const nt = ti.value.trim()
    if (nt) {
      subtasks.value[i].title = nt
      subtasks.value[i].description = di.value.trim() || nt
      row.querySelector('.task-title').textContent = nt
      row.querySelector('.task-desc').textContent = subtasks.value[i].description
      updateHistory()
      toast('任务已更新', 'info')
    }
    row.classList.remove('editing')
  } else {
    row.classList.add('editing')
    row.querySelector('.edit-title-input')?.focus()
  }
}

function deleteTask(i) {
  if (!confirm(`确定删除「${subtasks.value[i].title}」吗？`)) return
  subtasks.value.splice(i, 1)
  if (!subtasks.value.length) { clearResults(); return }
  updateHistory()
  toast('任务已删除', 'info')
}

function clearResults() {
  subtasks.value = []
  originalTask.value = ''
  historyId.value = null
  taskInput.value = ''
}

// ═══ 导出 ═══════════════════════════════
function exportMarkdown() {
  if (!subtasks.value.length) { toast('没有可导出的任务', 'err'); return }
  let md = `# 任务拆解结果\n\n**目标：** ${originalTask.value}\n\n---\n\n`
  subtasks.value.forEach((t, i) => {
    const done = document.getElementById(`row-${i}`)?.classList.contains('done')
    md += `- [${done ? 'x' : ' '}] **${t.title}**（${priLabel(t.priority)}，约 ${t.estimatedHours}h）\n  ${t.description}\n`
    if (t.dependencies?.length) md += `  ⤷ 依赖: ${t.dependencies.join(', ')}\n`
    md += '\n'
  })
  download(`任务拆解_${Date.now()}.md`, md, 'text/markdown')
  toast('Markdown 导出成功', 'ok')
}

function exportJSON() {
  if (!subtasks.value.length) { toast('没有可导出的任务', 'err'); return }
  download(`任务拆解_${Date.now()}.json`, JSON.stringify({
    originalTask: originalTask.value, createdAt: new Date().toISOString(), subtasks: subtasks.value
  }, null, 2), 'application/json')
  toast('JSON 导出成功', 'ok')
}

function download(name, content, mime) {
  const b = new Blob([content], { type: mime })
  const u = URL.createObjectURL(b)
  const a = document.createElement('a')
  a.href = u; a.download = name
  document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(u)
}

// ═══ 历史记录 ═══════════════════════════
const HK = 'td_history'
const MAX = 20
const historyItems = ref([])

function getH() { try { return JSON.parse(localStorage.getItem(HK)) || [] } catch { return [] } }
function setH(v) { localStorage.setItem(HK, JSON.stringify(v)) }

function saveToHistory(data) {
  const h = getH()
  const rec = { id: historyId.value, originalTask: data.originalTask, subtasks: data.subtasks, totalCount: data.totalCount, createdAt: data.createdAt }
  const idx = h.findIndex(x => x.originalTask === data.originalTask)
  if (idx !== -1) h[idx] = rec; else h.unshift(rec)
  if (h.length > MAX) h.length = MAX
  setH(h)
}

function updateHistory() {
  const h = getH()
  const idx = h.findIndex(x => x.id === historyId.value)
  if (idx !== -1) { h[idx].subtasks = subtasks.value; h[idx].totalCount = subtasks.value.length; setH(h) }
}

function renderHistory() { historyItems.value = getH() }

function loadHistory(id) {
  const rec = getH().find(x => x.id === id)
  if (!rec) return
  subtasks.value = rec.subtasks
  originalTask.value = rec.originalTask
  historyId.value = rec.id
  taskInput.value = rec.originalTask
  toast('已加载历史记录', 'info')
}

function clearHistory() {
  if (!confirm('确定清空所有历史记录吗？')) return
  localStorage.removeItem(HK)
  historyItems.value = []
  toast('历史记录已清空', 'info')
}

// ═══ Toast ══════════════════════════════
const toasts = ref([])
let tid = 0
function toast(msg, type = 'info') {
  const id = ++tid
  toasts.value.push({ id, msg, type })
  setTimeout(() => { const i = toasts.value.findIndex(t => t.id === id); if (i !== -1) toasts.value.splice(i, 1) }, 3200)
}

// ═══ 工具 ═══════════════════════════════
function priLabel(p) { return p === 'high' ? '高优先级' : p === 'medium' ? '中优先级' : '低优先级' }
function priClass(p) { return p === 'high' ? 'tag-p1' : p === 'medium' ? 'tag-p2' : 'tag-p3' }
function fmt(iso) {
  if (!iso) return ''
  const d = new Date(iso), n = new Date(), diff = n - d
  if (diff < 6e4) return '刚刚'
  if (diff < 36e5) return `${Math.floor(diff / 6e4)} 分钟前`
  if (diff < 864e5) return `${Math.floor(diff / 36e5)} 小时前`
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<template>
  <div class="container page">
    <div class="page-header">
      <h1 class="page-title">🧠 智能拆解</h1>
      <p class="page-subtitle">用自然语言描述你的目标，AI 自动拆解为可执行的子任务矩阵</p>
    </div>

    <div v-if="!apiReady" class="status-banner glass-soft">
      <span class="status-dot offline"></span><span>DeepSeek API 未配置，请在 <code>backend/.env</code> 中设置 API Key</span>
    </div>
    <div v-else class="status-banner glass-soft">
      <span class="status-dot online"></span><span>DeepSeek API 已就绪</span>
    </div>

    <div class="decompose-layout">
      <div class="decompose-main">
        <GlassCard class="input-card">
          <label class="input-label">▸ 任务描述输入</label>
          <textarea v-model="taskInput" class="textarea" placeholder="用自然语言描述你想要完成的目标…&#10;例如：开发一个包含用户认证、限流和接口文档的 REST API 后端服务" rows="4" maxlength="2000" :disabled="loading"></textarea>
          <div class="input-toolbar">
            <span class="char-hint" :class="{ warn: charWarn }">[ {{ charCount }} / 2000 ]</span>
            <button class="btn btn-primary" :disabled="loading || !apiReady" @click="handleSubmit">
              <span v-if="loading" class="btn-spinner"></span>{{ loading ? '拆解中…' : '◈ 执行拆解' }}
            </button>
          </div>
        </GlassCard>

        <div v-if="loading" class="skeleton-container">
          <div v-for="n in 3" :key="n" class="skeleton-card glass-soft">
            <div class="skeleton-line w-60"></div>
            <div class="skeleton-line w-90 short"></div>
            <div class="skeleton-line w-35 short"></div>
          </div>
        </div>

        <div v-if="error && !loading" class="error-banner glass-soft">
          <span class="error-icon">!</span><span class="error-text">{{ error }}</span>
          <button class="btn btn-ghost btn-sm" @click="handleSubmit">重试</button>
        </div>

        <div v-if="subtasks.length && !loading" ref="resultsRef" class="results-section">
          <GlassCard padding="none" class="results-card">
            <div class="results-header">
              <div class="results-header-left">
                <span class="results-icon">▾</span><span class="results-title">拆解输出</span><span class="results-badge">{{ subtasks.length }}</span>
              </div>
              <span class="results-original">「{{ originalTask }}」</span>
            </div>
            <div class="task-list">
              <div v-for="(task, index) in subtasks" :key="task.id || index" :id="`row-${index}`" class="task-row">
                <div class="task-left"><div class="check-circle" @click="toggleTask(index)"></div></div>
                <div class="task-body">
                  <div class="task-title">{{ task.title }}</div>
                  <div class="task-desc">{{ task.description }}</div>
                  <input class="edit-title-input" :value="task.title" placeholder="任务标题">
                  <textarea class="edit-desc-input" :value="task.description" rows="2" placeholder="任务描述"></textarea>
                  <div class="task-meta">
                    <span class="meta-tag" :class="priClass(task.priority)">{{ priLabel(task.priority) }}</span>
                    <span class="meta-hour">⏱ 约 {{ task.estimatedHours }} 小时</span>
                    <span v-if="task.dependencies?.length" class="meta-deps">⤷ 依赖: {{ task.dependencies.join(', ') }}</span>
                  </div>
                </div>
                <div class="task-actions">
                  <button class="action-btn" @click="toggleEdit(index)" title="编辑">✎</button>
                  <button class="action-btn del" @click="deleteTask(index)" title="删除">✕</button>
                </div>
              </div>
            </div>
            <div class="results-toolbar">
              <button class="btn btn-ghost" @click="exportMarkdown()">⬇ 导出 MD</button>
              <button class="btn btn-ghost" @click="exportJSON()">⬇ 导出 JSON</button>
              <button class="btn btn-ghost btn-danger" @click="clearResults()">清除</button>
            </div>
          </GlassCard>
        </div>

        <div v-if="!subtasks.length && !loading" class="empty-state">
          <div class="empty-icon-wrap"><span class="empty-icon">◈</span></div>
          <h3 class="empty-title">输入任务，启动 AI 拆解</h3>
          <p class="empty-desc">深度语义分析引擎将解析你的任务描述，<br>自动拆解为结构化子任务，包含优先级、耗时与依赖关系</p>
          <div class="prompt-chips">
            <button class="chip" @click="taskInput = '开发一个包含用户认证、限流和接口文档的 REST API 后端服务'">▸ 构建 REST API 后端</button>
            <button class="chip" @click="taskInput = '策划并执行一个面向1000人的 SaaS 产品线上发布会'">▸ 策划产品发布会</button>
            <button class="chip" @click="taskInput = '将现有单体应用零停机迁移到微服务架构'">▸ 单体迁移微服务</button>
          </div>
        </div>
      </div>

      <aside class="decompose-sidebar">
        <GlassCard class="sidebar-card">
          <div class="sidebar-head"><h3>◫ 历史记录</h3>
            <button v-if="historyItems.length" class="btn btn-ghost btn-xs btn-danger" @click="clearHistory">清除</button>
          </div>
          <div class="sidebar-list">
            <div v-if="!historyItems.length" class="sidebar-empty">暂无记录</div>
            <div v-for="item in historyItems" :key="item.id" class="history-entry" :class="{ active: item.id === historyId }" @click="loadHistory(item.id)">
              <div class="history-entry-title">{{ item.originalTask }}</div>
              <div class="history-entry-foot"><span>{{ item.totalCount }} 个子任务</span><span>{{ fmt(item.createdAt) }}</span></div>
            </div>
          </div>
        </GlassCard>
      </aside>
    </div>

    <div class="toast-layer">
      <TransitionGroup name="toast">
        <div v-for="t in toasts" :key="t.id" class="toast" :class="`toast-${t.type}`">{{ t.msg }}</div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.status-banner { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 1.2rem; margin-bottom: var(--space-lg); font-size: var(--text-sm); color: var(--text-secondary); border-radius: var(--radius-md); }
.status-banner code { background: rgba(255,255,255,0.08); padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.85em; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.status-dot.online { background: #48dbfb; box-shadow: 0 0 10px rgba(72,219,251,0.5); }
.status-dot.offline { background: #ff6b6b; box-shadow: 0 0 10px rgba(255,107,107,0.5); }

.decompose-layout { display: grid; grid-template-columns: 1fr 280px; gap: var(--space-lg); align-items: start; }
.decompose-main { min-width: 0; }
.decompose-sidebar { position: sticky; top: 88px; }
.sidebar-card { max-height: calc(100vh - 120px); display: flex; flex-direction: column; }
.sidebar-head { display: flex; align-items: center; justify-content: space-between; padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--glass-border-soft); }
.sidebar-head h3 { font-size: var(--text-sm); font-weight: 600; color: var(--text-secondary); }
.sidebar-list { flex: 1; overflow-y: auto; padding: var(--space-sm); display: flex; flex-direction: column; gap: 2px; }
.sidebar-empty { text-align: center; padding: var(--space-xl); color: var(--text-muted); font-size: var(--text-sm); line-height: 1.7; }
.history-entry { padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); cursor: pointer; transition: all var(--transition); border: 1px solid transparent; }
.history-entry:hover { background: var(--glass-bg); border-color: var(--glass-border-soft); }
.history-entry.active { background: var(--glass-bg-active); border-color: var(--glass-border); }
.history-entry-title { font-size: var(--text-sm); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 2px; }
.history-entry-foot { display: flex; justify-content: space-between; font-size: var(--text-xs); color: var(--text-muted); }

.input-card { margin-bottom: var(--space-lg); }
.input-label { display: block; font-size: var(--text-xs); font-weight: 600; color: var(--color-accent); letter-spacing: 0.08em; margin-bottom: var(--space-sm); padding: 0 2px; text-transform: uppercase; }
.input-toolbar { display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-md); }
.char-hint { font-size: var(--text-xs); color: var(--text-muted); letter-spacing: 0.04em; transition: color 0.2s; }
.char-hint.warn { color: #ff6b6b; }

.skeleton-container { display: flex; flex-direction: column; gap: var(--space-sm); margin-bottom: var(--space-lg); }
.skeleton-card { height: 90px; padding: var(--space-md) var(--space-lg); }
.skeleton-line { height: 10px; border-radius: 4px; background: rgba(140,150,220,0.12); animation: pulse 1.5s ease-in-out infinite; margin-bottom: 8px; }
.skeleton-line:last-child { margin-bottom: 0; }
.skeleton-line.short { height: 8px; }
.skeleton-line.w-60 { width: 60%; }
.skeleton-line.w-90 { width: 90%; }
.skeleton-line.w-35 { width: 35%; }
@keyframes pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }

.error-banner { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md) var(--space-lg); margin-bottom: var(--space-lg); border: 1px solid rgba(255,107,107,0.25); }
.error-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #ff6b6b; border: 1px solid rgba(255,107,107,0.3); flex-shrink: 0; }
.error-text { flex: 1; font-size: var(--text-sm); color: #ff6b6b; }

.results-section { margin-bottom: var(--space-lg); }
.results-card { overflow: hidden; }
.results-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-sm); padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--glass-border-soft); }
.results-header-left { display: flex; align-items: center; gap: 0.5rem; }
.results-icon { color: var(--color-primary-light); font-size: var(--text-sm); }
.results-title { font-size: var(--text-xs); font-weight: 600; color: var(--color-primary-light); text-transform: uppercase; letter-spacing: 0.08em; }
.results-badge { font-size: 11px; font-weight: 600; padding: 1px 8px; border-radius: 10px; border: 1px solid var(--glass-border); color: var(--text-secondary); opacity: 0.8; }
.results-original { font-size: var(--text-xs); color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 300px; }

.task-list { display: flex; flex-direction: column; }
.task-row { display: flex; align-items: flex-start; gap: var(--space-md); padding: var(--space-md) var(--space-lg); transition: all var(--transition); }
.task-row + .task-row { border-top: 1px solid var(--glass-border-soft); }
.task-row:hover { background: var(--glass-bg-soft); }
.task-row.done { opacity: 0.4; }
.task-row.done:hover { opacity: 0.6; }
.task-left { flex-shrink: 0; padding-top: 2px; }
.check-circle { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--glass-border); cursor: pointer; transition: all var(--transition); display: flex; align-items: center; justify-content: center; }
.check-circle:hover { border-color: var(--color-accent); box-shadow: 0 0 12px rgba(94,212,230,0.3); }
.task-row.done .check-circle { background: var(--color-accent); border-color: var(--color-accent); box-shadow: 0 0 10px rgba(94,212,230,0.3); }
.task-row.done .check-circle::after { content: ''; width: 5px; height: 9px; border: solid #fff; border-width: 0 2px 2px 0; transform: rotate(45deg) translateY(-1px); }
.task-body { flex: 1; min-width: 0; }
.task-title { font-size: var(--text-base); font-weight: 600; margin-bottom: 2px; }
.task-desc { font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.55; }
.task-meta { display: flex; align-items: center; gap: var(--space-sm); margin-top: var(--space-xs); flex-wrap: wrap; }
.edit-title-input, .edit-desc-input { display: none; width: 100%; padding: 0.4rem 0.6rem; border: 1px solid var(--glass-border); border-radius: var(--radius-sm); font-size: var(--text-sm); font-family: inherit; outline: none; background: rgba(0,0,0,0.2); color: var(--text-primary); margin-bottom: 4px; }
.edit-desc-input { font-size: var(--text-xs); resize: vertical; }
.task-row.editing .task-title, .task-row.editing .task-desc { display: none; }
.task-row.editing .edit-title-input, .task-row.editing .edit-desc-input { display: block; }
.meta-tag { font-size: var(--text-xs); font-weight: 500; padding: 0.15rem 0.6rem; border-radius: 4px; letter-spacing: 0.04em; }
.tag-p1 { color: #ff6b6b; background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.2); }
.tag-p2 { color: #feca57; background: rgba(254,202,87,0.1); border: 1px solid rgba(254,202,87,0.2); }
.tag-p3 { color: #48dbfb; background: rgba(72,219,251,0.08); border: 1px solid rgba(72,219,251,0.15); }
.meta-hour, .meta-deps { font-size: var(--text-xs); color: var(--text-muted); }
.meta-deps { font-style: italic; }
.task-actions { display: flex; gap: 2px; flex-shrink: 0; opacity: 0; transition: opacity var(--transition); padding-top: 2px; }
.task-row:hover .task-actions { opacity: 1; }
.action-btn { width: 28px; height: 28px; border: none; border-radius: 4px; background: transparent; cursor: pointer; font-size: 13px; color: var(--text-muted); transition: all var(--transition); display: flex; align-items: center; justify-content: center; }
.action-btn:hover { background: var(--glass-bg); color: var(--text-primary); }
.action-btn.del:hover { color: #ff6b6b; background: rgba(255,107,107,0.1); }

.results-toolbar { display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-md) var(--space-lg); border-top: 1px solid var(--glass-border-soft); }
.btn-danger { margin-left: auto; }
.btn-danger:hover { color: #ff6b6b; border-color: rgba(255,107,107,0.3); }
.btn-sm { padding: 0.35rem 0.9rem; font-size: var(--text-xs); }
.btn-xs { padding: 0.25rem 0.65rem; font-size: var(--text-xs); }
.btn-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid var(--glass-border); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state { display: flex; flex-direction: column; align-items: center; text-align: center; padding: var(--space-2xl) var(--space-lg); }
.empty-icon-wrap { width: 60px; height: 60px; border-radius: 50%; border: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-lg); background: var(--glass-bg-soft); }
.empty-icon { font-size: 1.5rem; color: var(--color-primary-light); }
.empty-title { font-size: var(--text-xl); font-weight: 700; margin-bottom: var(--space-sm); }
.empty-desc { font-size: var(--text-sm); color: var(--text-secondary); max-width: 400px; line-height: 1.7; margin-bottom: var(--space-xl); }
.prompt-chips { display: flex; flex-wrap: wrap; gap: var(--space-sm); justify-content: center; }
.chip { padding: 0.5rem 1rem; font-size: var(--text-sm); font-family: inherit; color: var(--text-secondary); background: var(--glass-bg-soft); border: 1px solid var(--glass-border-soft); border-radius: var(--radius-full); cursor: pointer; transition: all var(--transition); }
.chip:hover { color: var(--text-primary); border-color: var(--glass-border); background: var(--glass-bg); }

.toast-layer { position: fixed; bottom: 24px; right: 24px; z-index: 200; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
.toast { padding: 0.6rem 1.2rem; border-radius: var(--radius-sm); font-size: var(--text-sm); font-weight: 500; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: var(--shadow-lg); pointer-events: auto; color: #fff; }
.toast-ok { background: rgba(22,163,74,0.85); border: 1px solid rgba(22,163,74,0.4); }
.toast-err { background: rgba(220,38,38,0.85); border: 1px solid rgba(220,38,38,0.4); }
.toast-info { background: rgba(124,108,255,0.85); border: 1px solid rgba(124,108,255,0.3); }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { transform: translateY(12px); opacity: 0; }
.toast-leave-to { transform: translateY(-8px); opacity: 0; }

@media (max-width: 900px) {
  .decompose-layout { grid-template-columns: 1fr; }
  .decompose-sidebar { position: static; order: -1; }
  .sidebar-card { max-height: 260px; }
  .results-original { max-width: 180px; }
}
@media (max-width: 640px) {
  .input-toolbar { flex-direction: column; gap: var(--space-sm); align-items: stretch; }
  .btn-primary { justify-content: center; }
  .task-row { flex-wrap: wrap; }
  .task-actions { opacity: 1; margin-top: 4px; }
  .results-toolbar { flex-wrap: wrap; }
  .prompt-chips { flex-direction: column; align-items: stretch; }
}
</style>
