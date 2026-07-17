<script setup>
/**
 * SportsView - 运动健身模块
 * 功能：动作库浏览、预设计划、计时器训练、运动记录
 */
import { ref, computed, onUnmounted } from 'vue'
import GlassCard from '@/components/common/GlassCard.vue'
import GlassButton from '@/components/common/GlassButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import VideoPlayerModal from '@/components/common/VideoPlayerModal.vue'
import { useSportsStore } from '@/stores/sports'
import { EXERCISES, EXERCISE_CATEGORIES, WORKOUT_PLANS, DIFFICULTY_LABELS } from '@/data/sportsData'

const store = useSportsStore()

const tab = ref('plans') // plans / exercises / timer / log

/* ===== B站教学视频 ===== */
const videoModal = ref({ show: false, url: '', title: '' })

/** 根据 bvid 生成 B站 embed 播放器 URL */
function getBilibiliUrl(bvid) {
  return `https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=0&danmaku=1`
}

/** 打开教学视频弹窗 */
function openVideo(ex) {
  if (!ex.bvid) return
  videoModal.value = {
    show: true,
    url: getBilibiliUrl(ex.bvid),
    title: `${ex.name} · B站教学视频`
  }
}

function closeVideo() {
  videoModal.value = { show: false, url: '', title: '' }
}

/* ===== 动作库 ===== */
const activeCategory = ref('')
const filteredExercises = computed(() => {
  if (!activeCategory.value) return EXERCISES
  return EXERCISES.filter((e) => e.category === activeCategory.value)
})

/* ===== 计时器 ===== */
const timerState = ref('idle') // idle / running / paused / rest
const timerPlan = ref(null)
const timerRound = ref(0)
const timerExerciseIndex = ref(0)
const timerSeconds = ref(0)
const timerTotal = ref(0)
let timerInterval = null

const currentExercise = computed(() => {
  if (!timerPlan.value) return null
  return timerPlan.value.exercises[timerExerciseIndex.value]
})

const timerProgress = computed(() => {
  if (!timerTotal.value) return 0
  return ((timerTotal.value - timerSeconds.value) / timerTotal.value) * 100
})

const timerDisplay = computed(() => {
  const m = Math.floor(timerSeconds.value / 60)
  const s = timerSeconds.value % 60
  return `${m}:${String(s).padStart(2, '0')}`
})

function startPlan(plan) {
  timerPlan.value = plan
  timerRound.value = 0
  timerExerciseIndex.value = 0
  startExercise()
  tab.value = 'timer'
}

function startExercise() {
  const ex = timerPlan.value.exercises[timerExerciseIndex.value]
  timerSeconds.value = ex.work
  timerTotal.value = ex.work
  timerState.value = 'running'
  clearInterval(timerInterval)
  timerInterval = setInterval(tick, 1000)
}

function tick() {
  if (timerSeconds.value > 0) {
    timerSeconds.value--
  } else {
    // 当前阶段结束
    const plan = timerPlan.value
    const ex = plan.exercises[timerExerciseIndex.value]

    if (timerState.value === 'running' && ex.rest > 0) {
      // 进入休息
      timerState.value = 'rest'
      timerSeconds.value = ex.rest
      timerTotal.value = ex.rest
    } else {
      // 下一个动作或下一轮
      timerExerciseIndex.value++
      if (timerExerciseIndex.value >= plan.exercises.length) {
        timerRound.value++
        if (timerRound.value >= plan.rounds) {
          // 训练完成
          finishWorkout()
          return
        }
        timerExerciseIndex.value = 0
      }
      startExercise()
    }
  }
}

function pauseTimer() {
  if (timerState.value === 'running' || timerState.value === 'rest') {
    timerState.value = 'paused'
    clearInterval(timerInterval)
  }
}

function resumeTimer() {
  timerState.value = 'running'
  timerInterval = setInterval(tick, 1000)
}

function stopTimer() {
  clearInterval(timerInterval)
  timerState.value = 'idle'
  timerPlan.value = null
}

function finishWorkout() {
  clearInterval(timerInterval)
  const plan = timerPlan.value
  store.addLog({
    name: plan.name,
    icon: plan.icon,
    duration: plan.duration,
    exercises: plan.exercises.length * plan.rounds,
    rounds: plan.rounds
  })
  timerState.value = 'idle'
  timerPlan.value = null
  tab.value = 'log'
}

onUnmounted(() => {
  clearInterval(timerInterval)
})

/* ===== 手动记录 ===== */
const manualName = ref('')
const manualDuration = ref(30)

function addManualLog() {
  if (!manualName.value.trim()) return
  store.addLog({
    name: manualName.value.trim(),
    icon: '🏃',
    duration: manualDuration.value,
    exercises: 0,
    rounds: 0
  })
  manualName.value = ''
  manualDuration.value = 30
}

/* ===== 格式化 ===== */
function formatMinutes(min) {
  if (min < 60) return `${min} 分钟`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} 小时 ${m} 分钟` : `${h} 小时`
}
</script>

<template>
  <div class="container page">
    <div class="page-header">
      <h1 class="page-title">🏋️ 运动健身</h1>
      <p class="page-subtitle">坚持锻炼，遇见更强的自己</p>
    </div>

    <!-- 子标签 -->
    <div class="tabs">
      <button class="tab" :class="{ active: tab === 'plans' }" @click="tab = 'plans'">📋 训练计划</button>
      <button class="tab" :class="{ active: tab === 'exercises' }" @click="tab = 'exercises'">💪 动作库</button>
      <button class="tab" :class="{ active: tab === 'timer' }" @click="tab = 'timer'">⏱️ 计时器</button>
      <button class="tab" :class="{ active: tab === 'log' }" @click="tab = 'log'">
        📊 运动记录
        <span v-if="store.data.logs.length" class="tab-badge">{{ store.data.logs.length }}</span>
      </button>
    </div>

    <!-- ============ 训练计划 ============ -->
    <div v-show="tab === 'plans'">
      <!-- 统计概览 -->
      <div class="stats-row">
        <GlassCard padding="md" class="stat-card">
          <div class="stat-num">{{ store.weeklyCount }}</div>
          <div class="stat-label">本周运动</div>
        </GlassCard>
        <GlassCard padding="md" class="stat-card">
          <div class="stat-num">{{ store.data.logs.length }}</div>
          <div class="stat-label">总运动次数</div>
        </GlassCard>
        <GlassCard padding="md" class="stat-card">
          <div class="stat-num">{{ formatMinutes(store.totalMinutes) }}</div>
          <div class="stat-label">累计运动</div>
        </GlassCard>
      </div>

      <h2 class="section-title mt-lg">🔥 预设训练计划</h2>
      <div class="grid grid-2">
        <GlassCard v-for="plan in WORKOUT_PLANS" :key="plan.name" padding="lg" hover clickable @click="startPlan(plan)">
          <div class="plan-card">
            <div class="plan-icon">{{ plan.icon }}</div>
            <div class="plan-info">
              <h3 class="plan-name">{{ plan.name }}</h3>
              <p class="plan-desc">{{ plan.desc }}</p>
              <div class="plan-meta">
                <span>⏱️ {{ plan.duration }}分钟</span>
                <span>🔄 {{ plan.rounds }}轮</span>
                <span>💪 {{ plan.exercises.length }}个动作</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>

    <!-- ============ 动作库 ============ -->
    <div v-show="tab === 'exercises'">
      <div class="filter-chips">
        <button
          class="chip"
          :class="{ active: activeCategory === '' }"
          @click="activeCategory = ''"
        >全部</button>
        <button
          v-for="cat in EXERCISE_CATEGORIES"
          :key="cat.key"
          class="chip"
          :class="{ active: activeCategory === cat.key }"
          @click="activeCategory = cat.key"
        >{{ cat.icon }} {{ cat.label }}</button>
      </div>

      <div class="grid grid-3 mt-lg">
        <GlassCard v-for="ex in filteredExercises" :key="ex.name" padding="md" class="ex-card-wrap">
          <div class="ex-card">
            <div class="ex-head">
              <h4 class="ex-name">{{ ex.name }}</h4>
              <span class="ex-diff" :class="`d-${ex.difficulty}`">
                {{ DIFFICULTY_LABELS[ex.difficulty] }}
              </span>
            </div>
            <p class="ex-desc">{{ ex.desc }}</p>
            <div class="ex-meta">
              <span>🎯 {{ ex.muscles }}</span>
              <span>🔥 {{ ex.met }}</span>
            </div>
            <button
              v-if="ex.bvid"
              class="video-btn"
              @click.stop="openVideo(ex)"
              title="看B站教学视频"
            >
              <span class="video-btn-icon">▶</span>
              <span class="video-btn-text">教学视频</span>
            </button>
          </div>
        </GlassCard>
      </div>
    </div>

    <!-- ============ 计时器 ============ -->
    <div v-show="tab === 'timer'">
      <!-- 空闲状态 -->
      <div v-if="timerState === 'idle'">
        <EmptyState icon="⏱️" title="选择一个训练计划开始" description="在「训练计划」标签中选择一个计划，计时器将自动启动" />
      </div>

      <!-- 运行中 -->
      <div v-else class="timer-screen">
        <GlassCard variant="strong" padding="lg" class="timer-card">
          <div class="timer-plan-name">{{ timerPlan.icon }} {{ timerPlan.name }}</div>
          <div class="timer-round">第 {{ timerRound + 1 }} / {{ timerPlan.rounds }} 轮</div>

          <!-- 环形进度 -->
          <div class="timer-ring-wrap">
            <svg class="timer-ring" viewBox="0 0 200 200">
              <circle class="ring-bg" cx="100" cy="100" r="85" />
              <circle
                class="ring-fill"
                :class="{ rest: timerState === 'rest' }"
                cx="100"
                cy="100"
                r="85"
                :stroke-dasharray="2 * Math.PI * 85"
                :stroke-dashoffset="2 * Math.PI * 85 * (1 - timerProgress / 100)"
              />
            </svg>
            <div class="timer-center">
              <div class="timer-display">{{ timerDisplay }}</div>
              <div class="timer-state-label">
                {{ timerState === 'rest' ? '休息' : timerState === 'paused' ? '暂停' : '运动中' }}
              </div>
            </div>
          </div>

          <!-- 当前动作 -->
          <div v-if="currentExercise" class="timer-exercise">
            <div class="timer-ex-name">{{ currentExercise.name }}</div>
            <div class="timer-ex-meta">
              <span v-if="timerState === 'running'">💪 {{ currentExercise.work }}秒</span>
              <span v-if="timerState === 'rest'">😴 {{ currentExercise.rest }}秒</span>
            </div>
          </div>

          <!-- 下一个动作 -->
          <div v-if="timerExerciseIndex < timerPlan.exercises.length - 1" class="timer-next">
            下一个：{{ timerPlan.exercises[timerExerciseIndex + 1].name }}
          </div>

          <!-- 控制按钮 -->
          <div class="timer-controls">
            <GlassButton v-if="timerState === 'running' || timerState === 'rest'" variant="default" @click="pauseTimer">
              ⏸ 暂停
            </GlassButton>
            <GlassButton v-if="timerState === 'paused'" variant="primary" @click="resumeTimer">
              ▶ 继续
            </GlassButton>
            <GlassButton variant="ghost" @click="stopTimer">
              ⏹ 结束
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    </div>

    <!-- ============ 运动记录 ============ -->
    <div v-show="tab === 'log'">
      <!-- 手动记录 -->
      <GlassCard padding="lg" class="mb-lg">
        <h3 class="section-title">✏️ 手动记录运动</h3>
        <div class="manual-form">
          <input v-model="manualName" class="input" placeholder="运动名称（如：跑步、游泳）" />
          <div class="manual-duration">
            <label>时长</label>
            <input v-model.number="manualDuration" type="number" min="1" class="input input-sm" />
            <span>分钟</span>
          </div>
          <GlassButton variant="primary" @click="addManualLog">记录</GlassButton>
        </div>
      </GlassCard>

      <!-- 历史记录 -->
      <div v-if="store.data.logs.length">
        <h3 class="section-title">📊 运动历史</h3>
        <div class="log-list">
          <GlassCard v-for="log in store.data.logs.slice(0, 20)" :key="log.ts" padding="md">
            <div class="log-row">
              <span class="log-icon">{{ log.icon }}</span>
              <div class="log-info">
                <span class="log-name">{{ log.name }}</span>
                <span class="log-date">{{ log.date }}</span>
              </div>
              <span class="log-duration">{{ log.duration }} 分钟</span>
              <button class="del-btn" @click="store.removeLog(log.ts)">✕</button>
            </div>
          </GlassCard>
        </div>
      </div>
      <EmptyState v-else icon="📊" title="暂无运动记录" description="完成一次训练或手动记录，你的运动数据会出现在这里" />
    </div>
    <!-- B站教学视频弹窗 -->
    <VideoPlayerModal
      :show="videoModal.show"
      :video-url="videoModal.url"
      :title="videoModal.title"
      @close="closeVideo"
    />
  </div>
</template>

<style scoped>
/* 子标签 */
.tabs {
  display: flex;
  gap: var(--space-xs);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

.tab {
  position: relative;
  padding: 0.6rem 1.2rem;
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

.tab.active {
  background: var(--glass-bg-active);
  color: var(--text-primary);
  border-color: var(--glass-border);
}

.tab-badge {
  display: inline-block;
  margin-left: 0.3rem;
  padding: 0 0.4rem;
  font-size: var(--text-xs);
  background: var(--color-accent);
  color: #1a3a2a;
  border-radius: var(--radius-full);
  font-weight: 700;
}

/* 统计 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.stat-card {
  text-align: center;
}

.stat-num {
  font-size: var(--text-2xl);
  font-weight: 800;
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-top: var(--space-xs);
}

/* 训练计划 */
.plan-card {
  display: flex;
  gap: var(--space-md);
  align-items: flex-start;
}

.plan-icon {
  font-size: 2.5rem;
  line-height: 1;
  flex-shrink: 0;
}

.plan-name {
  font-size: var(--text-lg);
  font-weight: 700;
  margin-bottom: 4px;
}

.plan-desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
}

.plan-meta {
  display: flex;
  gap: var(--space-md);
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* 动作库 */
.filter-chips {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
  margin-bottom: var(--space-md);
}

.chip {
  padding: 0.3rem 0.9rem;
  font-family: inherit;
  font-size: var(--text-xs);
  color: var(--text-secondary);
  background: var(--glass-bg-soft);
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition);
}

.chip:hover { color: var(--text-primary); }

.chip.active {
  background: linear-gradient(135deg, var(--color-accent-2), var(--color-primary));
  color: #fff;
}

.ex-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.ex-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ex-name {
  font-size: var(--text-base);
  font-weight: 600;
}

.ex-diff {
  font-size: var(--text-xs);
  padding: 0.1rem 0.5rem;
  border-radius: var(--radius-full);
  font-weight: 600;
}

.d-1 { background: rgba(72, 219, 251, 0.2); color: #48dbfb; }
.d-2 { background: rgba(254, 202, 87, 0.2); color: #feca57; }
.d-3 { background: rgba(255, 107, 107, 0.2); color: #ff6b6b; }

.ex-desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.ex-meta {
  display: flex;
  gap: var(--space-md);
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* 计时器 */
.timer-screen {
  display: flex;
  justify-content: center;
}

.timer-card {
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.timer-plan-name {
  font-size: var(--text-lg);
  font-weight: 700;
  margin-bottom: var(--space-xs);
}

.timer-round {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
}

.timer-ring-wrap {
  position: relative;
  width: 240px;
  height: 240px;
  margin: 0 auto var(--space-lg);
}

.timer-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.timer-ring .ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 10;
}

.timer-ring .ring-fill {
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 10;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s linear;
  filter: drop-shadow(0 0 10px rgba(212, 163, 115, 0.5));
}

.timer-ring .ring-fill.rest {
  stroke: #48dbfb;
  filter: drop-shadow(0 0 10px rgba(72, 219, 251, 0.5));
}

.timer-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.timer-display {
  font-size: 3.5rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.timer-state-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: var(--space-xs);
}

.timer-exercise {
  margin-bottom: var(--space-md);
}

.timer-ex-name {
  font-size: var(--text-xl);
  font-weight: 700;
}

.timer-ex-meta {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: 4px;
}

.timer-next {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-lg);
}

.timer-controls {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
}

/* 手动记录 */
.manual-form {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.manual-duration {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.manual-duration label {
  flex-shrink: 0;
}

.input-sm {
  width: 80px;
}

/* 运动记录 */
.log-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.log-row {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.log-icon {
  font-size: 1.5rem;
}

.log-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.log-name {
  font-weight: 600;
  font-size: var(--text-sm);
}

.log-date {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.log-duration {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-secondary);
}

.del-btn {
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

.log-row:hover .del-btn { opacity: 1; }
.del-btn:hover { background: rgba(255, 0, 0, 0.2); color: #ff9999; }

/* 教学视频按钮 */
.video-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: var(--space-sm);
  padding: 0.35rem 0.9rem;
  font-family: inherit;
  font-size: var(--text-xs);
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #fb7299, #cc5dde);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition);
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.3);
}

.video-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(251, 114, 153, 0.45);
}

.video-btn:active {
  transform: translateY(0);
}

.video-btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  font-size: 0.6rem;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
}

.video-btn-text {
  white-space: nowrap;
}

.section-title {
  font-size: var(--text-xl);
  font-weight: 700;
  margin-bottom: var(--space-md);
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
  .timer-ring-wrap {
    width: 200px;
    height: 200px;
  }
  .timer-display {
    font-size: 2.5rem;
  }
  .manual-form {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
