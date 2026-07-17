<script setup>
/**
 * HealthView - 健康生活模块
 * 功能：喝水记录（进度环）、体重记录（SVG 折线图）、睡眠日志
 */
import { ref, computed } from 'vue'
import GlassCard from '@/components/common/GlassCard.vue'
import GlassButton from '@/components/common/GlassButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useHealthStore } from '@/stores/health'

const health = useHealthStore()

/* ===== 喝水 ===== */
const waterCircumference = 2 * Math.PI * 80
const waterDashoffset = computed(
  () => waterCircumference * (1 - health.waterProgress / 100)
)

/* ===== 体重 ===== */
const newWeight = ref('')

function addWeight() {
  if (!newWeight.value) return
  health.addWeight(newWeight.value)
  newWeight.value = ''
}

// SVG 折线图计算
const weightChart = computed(() => {
  const list = health.data.weight.slice(-15) // 最近 15 条
  if (list.length < 2) return null

  const values = list.map((w) => w.value)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const pad = range * 0.2 // 上下留白

  const W = 100
  const H = 100
  const points = list.map((w, i) => {
    const x = (i / (list.length - 1)) * W
    const y = H - ((w.value - min + pad) / (range + pad * 2)) * H
    return { x, y, value: w.value, date: w.date }
  })

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ')

  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`

  // 变化趋势
  const change = values[values.length - 1] - values[0]

  return { points, pathD, areaD, change, min, max }
})

/* ===== 睡眠 ===== */
const sleepStart = ref('23:00')
const sleepEnd = ref('07:00')
const sleepPreview = computed(() => {
  if (!sleepStart.value || !sleepEnd.value) return null
  return health.calcSleepHours(sleepStart.value, sleepEnd.value)
})

function addSleep() {
  if (!sleepStart.value || !sleepEnd.value) return
  health.addSleep(sleepStart.value, sleepEnd.value)
}

function sleepQuality(hours) {
  if (hours >= 7 && hours <= 9) return { label: '充足', color: '#26de81' }
  if (hours >= 6) return { label: '尚可', color: '#feca57' }
  if (hours < 6) return { label: '不足', color: '#ff6b6b' }
  return { label: '偏多', color: '#48dbfb' }
}
</script>

<template>
  <div class="container page">
    <div class="page-header">
      <h1 class="page-title">💧 健康生活</h1>
      <p class="page-subtitle">关注每一天，遇见更好的自己</p>
    </div>

    <!-- 喝水 -->
    <GlassCard variant="strong" padding="lg" class="water-section">
      <div class="water-layout">
        <div class="water-ring-wrap">
          <svg class="water-ring" viewBox="0 0 200 200">
            <circle class="ring-bg" cx="100" cy="100" r="80" />
            <circle
              class="ring-fill"
              cx="100"
              cy="100"
              r="80"
              :stroke-dasharray="waterCircumference"
              :stroke-dashoffset="waterDashoffset"
            />
          </svg>
          <div class="water-center">
            <div class="water-cups">
              {{ health.todayCups }}<span class="water-goal">/{{ health.WATER_GOAL }}</span>
            </div>
            <div class="water-ml">{{ health.todayWaterMl }} ml</div>
            <div class="water-emoji">{{ health.waterProgress >= 100 ? '🎉' : '💧' }}</div>
          </div>
        </div>

        <div class="water-controls">
          <h2 class="block-title">🥤 饮水记录</h2>
          <p class="block-desc">每日目标 {{ health.WATER_GOAL * health.WATER_CUP }} ml（{{ health.WATER_GOAL }} 杯）</p>

          <div class="water-quick">
            <button class="cup-btn" @click="health.addWater(1)">
              <span class="cup-icon">🥛</span>
              <span>+1 杯 (250ml)</span>
            </button>
            <button class="cup-btn" @click="health.addWater(1)">
              <span class="cup-icon">🍵</span>
              <span>+1 杯</span>
            </button>
            <button class="cup-btn" @click="health.addWater(1)">
              <span class="cup-icon">☕</span>
              <span>+1 杯</span>
            </button>
          </div>

          <div v-if="health.todayCups > 0" class="water-undo">
            <button class="link-btn" @click="health.setWater(health.todayCups - 1)">
              ↩ 撤销最后一杯
            </button>
          </div>

          <p v-if="health.waterProgress >= 100" class="water-done">
            🎉 太棒了！今日饮水目标已达成！
          </p>
        </div>
      </div>
    </GlassCard>

    <!-- 双栏：体重 + 睡眠 -->
    <div class="two-cols mt-xl">
      <!-- 体重 -->
      <GlassCard variant="strong" padding="lg">
        <div class="col-head">
          <h2 class="col-title">⚖️ 体重记录</h2>
          <span v-if="health.latestWeight" class="col-badge">
            当前 {{ health.latestWeight }} kg
          </span>
        </div>

        <!-- 添加 -->
        <div class="weight-add">
          <input
            v-model="newWeight"
            type="number"
            step="0.1"
            class="input"
            placeholder="输入体重 (kg)"
            @keyup.enter="addWeight"
          />
          <span class="unit">kg</span>
          <GlassButton variant="primary" @click="addWeight">记录</GlassButton>
        </div>

        <!-- 图表 -->
        <div v-if="weightChart" class="chart-wrap mt-md">
          <svg class="weight-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(255,255,255,0.4)" />
                <stop offset="100%" stop-color="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <path :d="weightChart.areaD" fill="url(#weightGrad)" />
            <path
              :d="weightChart.pathD"
              fill="none"
              stroke="#fff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              vector-effect="non-scaling-stroke"
            />
            <circle
              v-for="(p, i) in weightChart.points"
              :key="i"
              :cx="p.x"
              :cy="p.y"
              r="1.5"
              fill="#fff"
              vector-effect="non-scaling-stroke"
            />
          </svg>

          <div class="chart-info">
            <span class="chart-range">
              {{ weightChart.min }} - {{ health.latestWeight }} kg
            </span>
            <span
              class="chart-change"
              :class="weightChart.change <= 0 ? 'down' : 'up'"
            >
              {{ weightChart.change > 0 ? '↑' : '↓' }}
              {{ Math.abs(weightChart.change).toFixed(1) }} kg
            </span>
          </div>
        </div>

        <EmptyState
          v-else
          icon="📊"
          title="至少记录 2 次才能看到趋势"
          description="坚持每天记录，见证自己的变化"
        />

        <!-- 历史 -->
        <div v-if="health.data.weight.length" class="history-list mt-md">
          <div
            v-for="w in [...health.data.weight].reverse().slice(0, 5)"
            :key="w.ts"
            class="history-row"
          >
            <span class="history-date">{{ w.date }}</span>
            <span class="history-value">{{ w.value }} kg</span>
            <button class="todo-del" @click="health.removeWeight(w.ts)">✕</button>
          </div>
        </div>
      </GlassCard>

      <!-- 睡眠 -->
      <GlassCard variant="strong" padding="lg">
        <div class="col-head">
          <h2 class="col-title">😴 睡眠日志</h2>
          <span v-if="health.lastSleep" class="col-badge">
            {{ health.lastSleep.hours }}h
          </span>
        </div>

        <div class="sleep-input">
          <div class="time-field">
            <label>入睡时间</label>
            <input type="time" v-model="sleepStart" class="input" />
          </div>
          <div class="time-arrow">→</div>
          <div class="time-field">
            <label>起床时间</label>
            <input type="time" v-model="sleepEnd" class="input" />
          </div>
        </div>

        <div v-if="sleepPreview !== null" class="sleep-preview">
          预计睡眠 <strong>{{ sleepPreview }}</strong> 小时
          <span class="sleep-tag" :style="{ background: sleepQuality(sleepPreview).color + '33', color: sleepQuality(sleepPreview).color }">
            {{ sleepQuality(sleepPreview).label }}
          </span>
        </div>

        <GlassButton variant="primary" block class="mt-md" @click="addSleep">
          记录昨晚睡眠
        </GlassButton>

        <div v-if="health.data.sleep.length" class="history-list mt-lg">
          <h4 class="history-title">最近记录</h4>
          <div
            v-for="s in [...health.data.sleep].reverse().slice(0, 5)"
            :key="s.ts"
            class="history-row"
          >
            <span class="history-date">{{ s.date }}</span>
            <span class="history-time">{{ s.start }} - {{ s.end }}</span>
            <span
              class="sleep-tag-small"
              :style="{ color: sleepQuality(s.hours).color }"
            >
              {{ s.hours }}h
            </span>
            <button class="todo-del" @click="health.removeSleep(s.ts)">✕</button>
          </div>
        </div>

        <EmptyState
          v-else
          icon="🌙"
          title="还没有睡眠记录"
          description="记录入睡和起床时间，了解你的睡眠质量"
        />
      </GlassCard>
    </div>
  </div>
</template>

<style scoped>
/* 喝水 */
.water-section {
  margin-bottom: var(--space-xl);
}

.water-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-2xl);
  align-items: center;
}

.water-ring-wrap {
  position: relative;
  width: 220px;
  height: 220px;
}

.water-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.water-ring .ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.15);
  stroke-width: 14;
}

.water-ring .ring-fill {
  fill: none;
  stroke: url(#waterGrad);
  stroke: #8fd3f4;
  stroke-width: 14;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.6s ease;
  filter: drop-shadow(0 0 10px rgba(143, 211, 244, 0.6));
}

.water-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.water-cups {
  font-size: 3rem;
  font-weight: 800;
}

.water-goal {
  font-size: 1.2rem;
  font-weight: 400;
  opacity: 0.6;
}

.water-ml {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.water-emoji {
  font-size: 2rem;
  margin-top: var(--space-xs);
}

.block-title {
  font-size: var(--text-xl);
  font-weight: 700;
  margin-bottom: var(--space-xs);
}

.block-desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
}

.water-quick {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.cup-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-sm) var(--space-md);
  font-family: inherit;
  font-size: var(--text-xs);
  color: var(--text-secondary);
  background: var(--glass-bg-soft);
  border: 1px solid var(--glass-border-soft);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition);
}

.cup-btn:hover {
  background: rgba(143, 211, 244, 0.25);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.cup-icon {
  font-size: 1.6rem;
}

.water-undo {
  margin-top: var(--space-sm);
}

.water-done {
  margin-top: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: rgba(132, 250, 176, 0.2);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  text-align: center;
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

/* 体重 */
.weight-add {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.unit {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.chart-wrap {
  background: rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.weight-chart {
  width: 100%;
  height: 140px;
}

.chart-info {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-sm);
  font-size: var(--text-sm);
}

.chart-range {
  color: var(--text-secondary);
}

.chart-change {
  font-weight: 600;
}

.chart-change.down {
  color: #26de81;
}

.chart-change.up {
  color: #ff6b6b;
}

/* 历史 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.history-title {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
}

.history-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
}

.history-date {
  color: var(--text-secondary);
  min-width: 90px;
}

.history-value {
  font-weight: 600;
  margin-left: auto;
}

.history-time {
  color: var(--text-secondary);
  font-size: var(--text-xs);
  margin-left: auto;
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

.history-row:hover .todo-del {
  opacity: 1;
}

.todo-del:hover {
  background: rgba(255, 0, 0, 0.2);
  color: #ff9999;
}

/* 睡眠 */
.sleep-input {
  display: flex;
  align-items: flex-end;
  gap: var(--space-sm);
}

.time-field {
  flex: 1;
}

.time-field label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
}

.time-arrow {
  padding-bottom: 0.7rem;
  color: var(--text-muted);
}

.sleep-preview {
  margin-top: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.sleep-tag {
  padding: 0.1rem 0.6rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
}

.sleep-tag-small {
  font-weight: 700;
  margin-left: auto;
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

/* 响应式 */
@media (max-width: 768px) {
  .two-cols {
    grid-template-columns: 1fr;
  }
  .water-layout {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .water-ring-wrap {
    margin: 0 auto;
  }
  .water-quick {
    justify-content: center;
  }
  .sleep-input {
    flex-direction: column;
    align-items: stretch;
  }
  .time-arrow {
    display: none;
  }
}
</style>
