<script setup>
/**
 * ProductivityView - 效率工具模块
 * 功能：番茄钟、待办清单（带优先级）、习惯打卡
 */
import { ref, computed, onUnmounted } from 'vue'
import GlassCard from '@/components/common/GlassCard.vue'
import GlassButton from '@/components/common/GlassButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useTodosStore } from '@/stores/todos'
import { useHealthStore } from '@/stores/health'

const todos = useTodosStore()
const health = useHealthStore()

/* ===== 番茄钟 ===== */
const POMODORO_WORK = 25 * 60
const POMODORO_BREAK = 5 * 60
const mode = ref('work') // work / break
const secondsLeft = ref(POMODORO_WORK)
const running = ref(false)
let timerId = null

const progress = computed(() => {
  const total = mode.value === 'work' ? POMODORO_WORK : POMODORO_BREAK
  return ((total - secondsLeft.value) / total) * 100
})

const timeDisplay = computed(() => {
  const m = Math.floor(secondsLeft.value / 60)
  const s = secondsLeft.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const completedPomodoros = ref(0)

function tick() {
  secondsLeft.value--
  if (secondsLeft.value <= 0) {
    // 阶段结束
    playChime()
    if (mode.value === 'work') {
      completedPomodoros.value++
      mode.value = 'break'
      secondsLeft.value = POMODORO_BREAK
    } else {
      mode.value = 'work'
      secondsLeft.value = POMODORO_WORK
    }
    pause()
  }
}

function start() {
  if (running.value) return
  running.value = true
  timerId = setInterval(tick, 1000)
}

function pause() {
  running.value = false
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

function reset() {
  pause()
  secondsLeft.value = mode.value === 'work' ? POMODORO_WORK : POMODORO_BREAK
}

function switchMode(m) {
  pause()
  mode.value = m
  secondsLeft.value = m === 'work' ? POMODORO_WORK : POMODORO_BREAK
}

function playChime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    const ac = new AC()
    ;[880, 1100, 880].forEach((freq, i) => {
      const osc = ac.createOscillator()
      const g = ac.createGain()
      osc.connect(g)
      g.connect(ac.destination)
      osc.frequency.value = freq
      g.gain.setValueAtTime(0.25, ac.currentTime + i * 0.2)
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * 0.2 + 0.18)
      osc.start(ac.currentTime + i * 0.2)
      osc.stop(ac.currentTime + i * 0.2 + 0.2)
    })
  } catch {}
}

onUnmounted(() => pause())

/* ===== 待办清单 ===== */
const newTodo = ref('')
const newTodoPriority = ref('medium')

function addTodo() {
  if (!newTodo.value.trim()) return
  todos.add(newTodo.value, newTodoPriority.value)
  newTodo.value = ''
}

function removeTodo(id) {
  todos.remove(id)
}

const priorityLabels = { high: '高', medium: '中', low: '低' }

/* ===== 习惯打卡 ===== */
const newHabit = ref('')

function addHabit() {
  if (!newHabit.value.trim()) return
  health.addHabit(newHabit.value)
  newHabit.value = ''
}

function removeHabit(id) {
  if (confirm('确定删除这个习惯吗？历史打卡记录也会清除。')) {
    health.removeHabit(id)
  }
}
</script>

<template>
  <div class="container page">
    <div class="page-header">
      <h1 class="page-title">⏱️ 效率工具</h1>
      <p class="page-subtitle">番茄钟 · 待办清单 · 习惯打卡</p>
    </div>

    <!-- 番茄钟 -->
    <GlassCard variant="strong" padding="lg" class="pomodoro-card">
      <div class="pomo-modes">
        <button
          class="pomo-mode"
          :class="{ active: mode === 'work' }"
          @click="switchMode('work')"
        >
          💪 专注 {{ Math.floor(POMODORO_WORK / 60) }} 分钟
        </button>
        <button
          class="pomo-mode"
          :class="{ active: mode === 'break' }"
          @click="switchMode('break')"
        >
          ☕ 休息 {{ Math.floor(POMODORO_BREAK / 60) }} 分钟
        </button>
      </div>

      <div class="pomo-timer">
        <svg class="pomo-ring" viewBox="0 0 200 200">
          <circle class="ring-bg" cx="100" cy="100" r="90" />
          <circle
            class="ring-progress"
            cx="100"
            cy="100"
            r="90"
            :stroke-dasharray="2 * Math.PI * 90"
            :stroke-dashoffset="2 * Math.PI * 90 * (1 - progress / 100)"
          />
        </svg>
        <div class="pomo-display">
          <div class="pomo-time">{{ timeDisplay }}</div>
          <div class="pomo-status">
            {{ mode === 'work' ? '专注中' : '休息中' }} ·
            今日完成 {{ completedPomodoros }} 🍅
          </div>
        </div>
      </div>

      <div class="pomo-actions">
        <GlassButton
          v-if="!running"
          variant="primary"
          size="lg"
          @click="start"
        >
          ▶ 开始
        </GlassButton>
        <GlassButton v-else variant="ghost" size="lg" @click="pause">
          ⏸ 暂停
        </GlassButton>
        <GlassButton variant="ghost" size="lg" @click="reset">
          ↺ 重置
        </GlassButton>
      </div>
    </GlassCard>

    <!-- 双栏：待办 + 习惯 -->
    <div class="two-cols mt-xl">
      <!-- 待办清单 -->
      <GlassCard variant="strong" padding="lg">
        <div class="col-head">
          <h2 class="col-title">📝 待办清单</h2>
          <span class="col-badge">{{ todos.activeCount }} 项待办</span>
        </div>

        <!-- 添加 -->
        <div class="todo-add">
          <input
            v-model="newTodo"
            class="input"
            placeholder="添加一个待办事项..."
            @keyup.enter="addTodo"
          />
          <select v-model="newTodoPriority" class="select todo-priority">
            <option value="high">高优</option>
            <option value="medium">中优</option>
            <option value="low">低优</option>
          </select>
          <GlassButton variant="primary" @click="addTodo">添加</GlassButton>
        </div>

        <!-- 列表 -->
        <div class="todo-list mt-md">
          <EmptyState
            v-if="!todos.items.length"
            icon="🎯"
            title="还没有待办"
            description="添加你的第一个任务吧"
          />
          <div
            v-for="t in todos.sortedItems"
            :key="t.id"
            class="todo-row"
            :class="{ done: t.done }"
          >
            <label class="todo-check">
              <input type="checkbox" :checked="t.done" @change="todos.toggle(t.id)" />
              <span class="check-mark"></span>
            </label>
            <span class="todo-priority-dot" :class="`p-${t.priority}`"></span>
            <span class="todo-content">{{ t.text }}</span>
            <span class="todo-priority-tag" :class="`p-${t.priority}`">
              {{ priorityLabels[t.priority] }}
            </span>
            <button class="todo-del" @click="removeTodo(t.id)">✕</button>
          </div>
        </div>

        <div v-if="todos.doneItems.length" class="todo-footer mt-md">
          <button class="link-btn" @click="todos.clearDone">
            🗑 清除已完成 ({{ todos.doneItems.length }})
          </button>
        </div>
      </GlassCard>

      <!-- 习惯打卡 -->
      <GlassCard variant="strong" padding="lg">
        <div class="col-head">
          <h2 class="col-title">✅ 习惯打卡</h2>
          <span class="col-badge">{{ health.data.habitList.length }} 个习惯</span>
        </div>

        <div class="habit-add">
          <input
            v-model="newHabit"
            class="input"
            placeholder="添加一个习惯，如：每天阅读30分钟"
            @keyup.enter="addHabit"
          />
          <GlassButton variant="primary" @click="addHabit">添加</GlassButton>
        </div>

        <div class="habit-list mt-md">
          <EmptyState
            v-if="!health.data.habitList.length"
            icon="🌱"
            title="还没有习惯"
            description="培养好习惯，从今天开始"
          />
          <div
            v-for="h in health.data.habitList"
            :key="h.id"
            class="habit-row"
            :class="{ done: health.isHabitDoneToday(h.id) }"
          >
            <button
              class="habit-check"
              :class="{ checked: health.isHabitDoneToday(h.id) }"
              @click="health.toggleHabit(h.id)"
            >
              ✓
            </button>
            <div class="habit-info">
              <span class="habit-name">{{ h.name }}</span>
              <span class="habit-streak">
                🔥 已坚持 {{ health.habitStreak(h.id) }} 天
              </span>
            </div>
            <button class="todo-del" @click="removeHabit(h.id)">✕</button>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<style scoped>
/* 番茄钟 */
.pomodoro-card {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.pomo-modes {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.pomo-mode {
  padding: 0.5rem 1.2rem;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--glass-bg-soft);
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition);
}

.pomo-mode.active {
  background: var(--glass-bg-active);
  color: var(--text-primary);
  border-color: var(--glass-border);
}

.pomo-timer {
  position: relative;
  width: 240px;
  height: 240px;
  margin: 0 auto var(--space-lg);
}

.pomo-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.15);
  stroke-width: 10;
}

.ring-progress {
  fill: none;
  stroke: #fff;
  stroke-width: 10;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
  filter: drop-shadow(0 0 10px rgba(212, 163, 115, 0.6));
}

.pomo-display {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pomo-time {
  font-size: 3rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.pomo-status {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-top: var(--space-xs);
}

.pomo-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
}

/* 双栏 */
.two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

.col-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.col-title {
  font-size: var(--text-xl);
  font-weight: 700;
}

.col-badge {
  font-size: var(--text-xs);
  padding: 0.2rem 0.7rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
}

/* 待办 */
.todo-add,
.habit-add {
  display: flex;
  gap: var(--space-sm);
}

.todo-priority {
  width: auto;
}

.todo-list,
.habit-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.todo-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.todo-row:hover {
  background: rgba(255, 255, 255, 0.1);
}

.todo-row.done .todo-content {
  text-decoration: line-through;
  opacity: 0.5;
}

.todo-check {
  position: relative;
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
}

.todo-check input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  margin: 0;
}

.check-mark {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 6px;
  transition: all var(--transition);
}

.todo-check input:checked + .check-mark {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.todo-check input:checked + .check-mark::after {
  content: '✓';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a3a2a;
  font-weight: bold;
  font-size: 0.8rem;
}

.todo-priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.todo-priority-dot.p-high { background: #ff6b6b; }
.todo-priority-dot.p-medium { background: #feca57; }
.todo-priority-dot.p-low { background: #48dbfb; }

.todo-content {
  flex: 1;
  font-size: var(--text-sm);
}

.todo-priority-tag {
  font-size: var(--text-xs);
  padding: 0.1rem 0.5rem;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.todo-priority-tag.p-high {
  background: rgba(255, 107, 107, 0.25);
  color: #ffb3b3;
}
.todo-priority-tag.p-medium {
  background: rgba(254, 202, 87, 0.25);
  color: #ffe9a8;
}
.todo-priority-tag.p-low {
  background: rgba(72, 219, 251, 0.25);
  color: #b3ecff;
}

.todo-del {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: var(--text-muted);
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  transition: all var(--transition);
}

.todo-row:hover .todo-del {
  opacity: 1;
}

.todo-del:hover {
  background: rgba(255, 0, 0, 0.2);
  color: #ff9999;
}

.todo-footer {
  text-align: center;
}

.link-btn {
  font-family: inherit;
  font-size: var(--text-xs);
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color var(--transition);
}

.link-btn:hover {
  color: var(--text-primary);
}

/* 习惯 */
.habit-row {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.habit-row:hover {
  background: rgba(255, 255, 255, 0.1);
}

.habit-check {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  color: transparent;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition);
}

.habit-check.checked {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #1a3a2a;
}

.habit-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.habit-name {
  font-size: var(--text-sm);
  font-weight: 500;
}

.habit-row.done .habit-name {
  opacity: 0.7;
}

.habit-streak {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-top: 2px;
}

/* 响应式 */
@media (max-width: 768px) {
  .two-cols {
    grid-template-columns: 1fr;
  }
  .todo-add,
  .habit-add {
    flex-direction: column;
  }
  .todo-priority {
    width: 100%;
  }
}
</style>
