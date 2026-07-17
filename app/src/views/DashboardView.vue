<script setup>
/**
 * DashboardView - 首页仪表盘
 * 整合：问候语 + 天气 + 每日一句 + 每日美图 + 模块入口 + 今日待办预览
 */
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import GlassCard from '@/components/common/GlassCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useGeolocation } from '@/composables/useGeolocation'
import { getCurrentWeather, getWeatherInfo } from '@/api/weather'
import { getDailyQuote } from '@/api/quote'
import { MODULES } from '@/data/modules'
import { useTodosStore } from '@/stores/todos'

const { getPosition } = useGeolocation()
const todos = useTodosStore()

// 问候语
const now = ref(new Date())
const greeting = computed(() => {
  const h = now.value.getHours()
  if (h < 6) return '夜深了'
  if (h < 9) return '早上好'
  if (h < 12) return '上午好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

const dateStr = computed(() => {
  const d = now.value
  const week = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${week}`
})

// 天气
const weather = ref(null)
const weatherError = ref('')
const weatherLoading = ref(false)
const weatherInfo = computed(() =>
  weather.value ? getWeatherInfo(weather.value.weather_code) : null
)

async function loadWeather() {
  weatherLoading.value = true
  weatherError.value = ''
  // 默认坐标：北京
  let lat = 39.9042
  let lon = 116.4074
  let usedDefault = true

  const pos = await getPosition()
  if (pos) {
    lat = pos.latitude
    lon = pos.longitude
    usedDefault = false
  }

  try {
    weather.value = await getCurrentWeather(lat, lon)
  } catch (e) {
    weatherError.value = '天气获取失败'
  } finally {
    weatherLoading.value = false
  }
  return usedDefault
}

const isDefaultCity = ref(false)

// 每日一句
const quote = ref(getDailyQuote())

// 每日美图：基于日期种子从精选自然风光中选取，每天固定一张
const DAILY_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80', title: '山峦湖泊', author: 'Photo by Casey Horner' },
  { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80', title: '雪山星空', author: 'Photo by Benjamin Voros' },
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80', title: '热带海滩', author: 'Photo by Sean Oulashin' },
  { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80', title: '翠绿山谷', author: 'Photo by Lukasz Szmigiel' },
  { url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200&q=80', title: '极光之夜', author: 'Photo by Vincent Guth' },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80', title: '巍峨山峰', author: 'Photo by Kalen Emsley' },
  { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80', title: '暮光原野', author: 'Photo by Luca Bravo' },
  { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80', title: '金色草原', author: 'Photo by Robert Lukeman' },
  { url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=80', title: '碧海蓝天', author: 'Photo by Matt Hardy' },
  { url: 'https://images.unsplash.com/photo-1431887773042-803ed52bed26?w=1200&q=80', title: '林间晨光', author: 'Photo by Michael Krahn' },
  { url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1200&q=80', title: '沙漠黄昏', author: 'Photo by Chris Galbraith' },
  { url: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=1200&q=80', title: '银河拱桥', author: 'Photo by Klemen Vrankar' },
  { url: 'https://images.unsplash.com/photo-1518173946687-a544e6ee64e4?w=1200&q=80', title: '瀑布飞流', author: 'Photo by Ray Hennessy' },
  { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80', title: '层峦叠嶂', author: 'Photo by Dave Hoefler' },
  { url: 'https://images.unsplash.com/photo-1476610182048-b716b8515aaa?w=1200&q=80', title: '星空大海', author: 'Photo by Andrew Ridley' }
]

const currentPhoto = computed(() => {
  const d = now.value
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  return DAILY_PHOTOS[seed % DAILY_PHOTOS.length]
})

const photoLoaded = ref(false)
function onPhotoLoad() {
  photoLoaded.value = true
}

// 今日待办预览（前 4 条）
const todayTodos = computed(() => todos.sortedItems.slice(0, 4))

// 量子宇宙粒子背景 — 由 <ParticleUniverse /> 组件接管

onMounted(async () => {
  isDefaultCity.value = await loadWeather()
  // 每分钟刷新时间
  setInterval(() => {
    now.value = new Date()
  }, 60000)
})
</script>

<template>
  <div class="container page">
    <!-- 欢迎横幅 -->
    <section class="hero">
      <div class="hero-text">
        <p class="hero-date">{{ dateStr }}</p>
        <h1 class="hero-greeting">
          {{ greeting }}，<span class="wave">👋</span>
        </h1>
        <p class="hero-sub">欢迎来到自成岛，让每一天都充满美好</p>
      </div>

      <!-- 天气卡片 -->
      <GlassCard variant="strong" padding="lg" class="weather-card">
        <div v-if="weatherLoading" class="weather-loading">
          <LoadingSpinner size="sm" label="获取天气..." />
        </div>
        <div v-else-if="weatherError" class="weather-error">
          <span class="weather-icon-large">🌡️</span>
          <p>{{ weatherError }}</p>
        </div>
        <div v-else-if="weather" class="weather-content">
          <div class="weather-icon-large">{{ weatherInfo.icon }}</div>
          <div class="weather-temp">
            {{ Math.round(weather.temperature_2m) }}<span class="deg">°C</span>
          </div>
          <div class="weather-desc">
            <p class="weather-label">{{ weatherInfo.label }}</p>
            <p class="weather-detail">
              体感 {{ Math.round(weather.apparent_temperature) }}°C ·
              湿度 {{ weather.relative_humidity_2m }}%
            </p>
            <p class="weather-city">
              <span v-if="isDefaultCity">📍 默认城市（北京）</span>
              <span v-else>📍 你的位置</span>
            </p>
          </div>
        </div>
      </GlassCard>
    </section>

    <!-- 模块入口 -->
    <section class="section">
      <h2 class="section-title">✨ 功能模块</h2>
      <div class="grid grid-3">
        <GlassCard
          v-for="m in MODULES"
          :key="m.key"
          hover
          clickable
          padding="lg"
          @click="$router.push(m.to)"
        >
          <div class="module-card">
            <div class="module-icon" :style="{ background: m.gradient }">
              {{ m.icon }}
            </div>
            <div class="module-info">
              <h3 class="module-title">{{ m.title }}</h3>
              <p class="module-subtitle">{{ m.subtitle }}</p>
              <p class="module-desc">{{ m.desc }}</p>
            </div>
            <div class="module-arrow">→</div>
          </div>
        </GlassCard>
      </div>
    </section>

    <!-- 每日一句 + 今日待办 -->
    <section class="section grid-2-cols">
      <GlassCard variant="strong" padding="lg" class="quote-card">
        <div class="quote-mark">"</div>
        <blockquote class="quote-text">{{ quote.content }}</blockquote>
        <p class="quote-author">—— {{ quote.author }}</p>
      </GlassCard>

      <GlassCard variant="strong" padding="lg" class="todo-preview">
        <div class="card-head">
          <h3 class="card-title">📝 今日待办</h3>
          <RouterLink to="/productivity" class="card-link">查看全部 →</RouterLink>
        </div>
        <div v-if="todayTodos.length" class="todo-list">
          <div
            v-for="t in todayTodos"
            :key="t.id"
            class="todo-item"
            :class="{ done: t.done }"
          >
            <span class="todo-dot" :class="`p-${t.priority}`"></span>
            <span class="todo-text">{{ t.text }}</span>
          </div>
        </div>
        <div v-else class="todo-empty">
          <p>今天还没有待办事项</p>
          <RouterLink to="/productivity" class="btn btn-primary btn-sm">
            添加待办
          </RouterLink>
        </div>
      </GlassCard>
    </section>

    <!-- 每日美图 -->
    <section class="section">
      <GlassCard padding="none" class="photo-card" hover>
        <div class="photo-wrap">
          <img
            :src="currentPhoto.url"
            :alt="currentPhoto.title"
            class="photo-img"
            :class="{ loaded: photoLoaded }"
            @load="onPhotoLoad"
          />
          <div v-if="!photoLoaded" class="photo-loading">
            <LoadingSpinner size="md" label="加载美景..." />
          </div>
          <div class="photo-overlay">
            <div class="photo-badge">📷 今日美图</div>
            <h3 class="photo-title">{{ currentPhoto.title }}</h3>
            <p class="photo-author">{{ currentPhoto.author }} · Unsplash</p>
          </div>
        </div>
      </GlassCard>
    </section>
  </div>
</template>

<style scoped>
/* 欢迎横幅 */
.hero {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-xl);
  align-items: center;
  margin-bottom: var(--space-2xl);
}

.hero-date {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-xs);
}

.hero-greeting {
  font-size: var(--text-4xl);
  font-weight: 800;
  margin-bottom: var(--space-xs);
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
}

.wave {
  display: inline-block;
  animation: wave 2.5s ease-in-out infinite;
  transform-origin: 70% 70%;
}

@keyframes wave {
  0%, 60%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(14deg); }
  20% { transform: rotate(-8deg); }
  30% { transform: rotate(14deg); }
  40% { transform: rotate(-4deg); }
  50% { transform: rotate(10deg); }
}

.hero-sub {
  color: var(--text-secondary);
  font-size: var(--text-lg);
}

/* 天气卡片 */
.weather-card {
  min-width: 280px;
}

.weather-loading,
.weather-error {
  text-align: center;
  padding: var(--space-md);
}

.weather-error p {
  color: var(--text-secondary);
  margin-top: var(--space-sm);
}

.weather-content {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.weather-icon-large {
  font-size: 3.5rem;
  line-height: 1;
}

.weather-temp {
  font-size: 3rem;
  font-weight: 700;
}

.deg {
  font-size: 1.2rem;
  font-weight: 400;
  vertical-align: super;
}

.weather-label {
  font-size: var(--text-lg);
  font-weight: 600;
}

.weather-detail {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin: var(--space-xs) 0;
}

.weather-city {
  color: var(--text-muted);
  font-size: var(--text-xs);
}

/* 区块标题 */
.section {
  margin-bottom: var(--space-2xl);
}

.section-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  margin-bottom: var(--space-lg);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 模块卡片 */
.module-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
}

.module-icon {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.module-title {
  font-size: var(--text-xl);
  font-weight: 700;
  margin-bottom: 2px;
}

.module-subtitle {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
}

.module-desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

.module-arrow {
  position: absolute;
}

.module-card {
  position: relative;
}

.module-arrow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: var(--text-muted);
  transition: transform var(--transition), color var(--transition);
}

.module-card:hover .module-arrow {
  transform: translate(4px, -50%);
  color: var(--text-primary);
}

/* 双栏区块 */
.grid-2-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

/* 每日一句 */
.quote-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.quote-mark {
  position: absolute;
  top: 0.5rem;
  left: 1.5rem;
  font-size: 5rem;
  font-family: Georgia, serif;
  color: rgba(255, 255, 255, 0.2);
  line-height: 1;
}

.quote-text {
  font-size: var(--text-lg);
  font-weight: 500;
  line-height: 1.6;
  margin-bottom: var(--space-md);
  position: relative;
  z-index: 1;
}

.quote-author {
  text-align: right;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

/* 待办预览 */
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: 600;
}

.card-link {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition);
}

.card-link:hover {
  color: var(--text-primary);
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.todo-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.06);
  font-size: var(--text-sm);
}

.todo-item.done .todo-text {
  text-decoration: line-through;
  opacity: 0.5;
}

.todo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.todo-dot.p-high { background: #ff6b6b; }
.todo-dot.p-medium { background: #feca57; }
.todo-dot.p-low { background: #48dbfb; }

.todo-empty {
  text-align: center;
  padding: var(--space-lg);
  color: var(--text-muted);
}

.todo-empty .btn {
  margin-top: var(--space-sm);
}

.btn-sm {
  padding: 0.4rem 1rem;
  font-size: var(--text-xs);
}

/* 每日美图 */
.photo-card {
  overflow: hidden;
}

.photo-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 21 / 9;
  background: rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease, transform 8s ease;
  transform: scale(1.02);
}

.photo-img.loaded {
  opacity: 1;
  transform: scale(1);
}

.photo-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-2xl) var(--space-xl) var(--space-lg);
  background: linear-gradient(to top, rgba(5, 8, 22, 0.85) 0%, rgba(5, 8, 22, 0.4) 50%, transparent 100%);
  pointer-events: none;
}

.photo-badge {
  display: inline-block;
  padding: 0.2rem 0.7rem;
  font-size: var(--text-xs);
  font-weight: 600;
  background: rgba(212, 163, 115, 0.25);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(180, 168, 255, 0.25);
  border-radius: var(--radius-full);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.photo-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
  margin-bottom: var(--space-xs);
}

.photo-author {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* ═══ 导航选中增强 ═══════════════════ */
/* (覆盖 AppHeader 的导航样式 — 通过 :deep 穿透) */
:deep(.nav-item.router-link-exact-active) {
  background: var(--nav-active-gradient) !important;
  box-shadow: var(--nav-active-shadow) !important;
  transform: translateY(-1px);
}
:deep(.nav-item:hover) {
  background: var(--nav-hover-bg) !important;
}

/* ═══ 欢迎横幅增强 ═══════════════════ */
.hero-greeting {
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

/* ═══ 每日一句增强 ═══════════════════ */
.quote-card {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.4s ease;
}
.quote-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.quote-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}
.quote-text {
  position: relative;
  z-index: 1;
}

/* ═══ 待办卡片增强 ═══════════════════ */
.todo-preview {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.todo-preview:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}
.todo-item {
  transition: all var(--transition);
}
.todo-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}
.todo-empty .btn {
  animation: breathe 3s ease-in-out infinite;
}
@keyframes breathe {
  0%, 100% { box-shadow: 0 0 16px rgba(212, 163, 115, 0.15); }
  50% { box-shadow: 0 0 32px rgba(212, 163, 115, 0.35); }
}
.card-link {
  transition: color var(--transition), transform var(--transition);
}
.card-link:hover {
  transform: translateX(3px);
}

/* ═══ 每日美图增强 ═══════════════════ */
.photo-card {
  transition: box-shadow 0.5s ease;
  border-radius: var(--radius-lg) !important;
  overflow: hidden;
}
.photo-card:hover {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}
.photo-wrap {
  aspect-ratio: 21 / 9;
  overflow: hidden;
}
.photo-img {
  transition: opacity 1.2s ease, transform 12s ease;
  transform: scale(1);
}
.photo-img.loaded {
  transform: scale(1.03);
}
.photo-overlay {
  background: var(--photo-overlay-gradient);
}
.photo-badge {
  background: rgba(212, 163, 115, 0.2);
  border: 1px solid rgba(232, 201, 160, 0.2);
  transition: all var(--transition);
}
.photo-card:hover .photo-badge {
  background: rgba(212, 163, 115, 0.3);
  box-shadow: 0 0 16px rgba(212, 163, 115, 0.12);
}

/* ═══ 模块卡片悬浮增强 ═══════════════ */
:deep(.module-card:hover .module-arrow) {
  transform: translate(6px, -50%);
  color: var(--color-primary-light);
}

/* ═══ 待办列表项逐条入场动画 ═══════════ */
.todo-item {
  animation: todoFadeIn 0.35s ease backwards;
}
.todo-item:nth-child(1) { animation-delay: 0.00s; }
.todo-item:nth-child(2) { animation-delay: 0.05s; }
.todo-item:nth-child(3) { animation-delay: 0.10s; }
.todo-item:nth-child(4) { animation-delay: 0.15s; }
@keyframes todoFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ═══ content 在粒子之上 ═══════════════ */
.hero,
.section {
  position: relative;
  z-index: 1;
}

/* ═══ 响应式 ═══════════════════════════ */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .weather-card {
    min-width: 0;
  }
  .grid-2-cols {
    grid-template-columns: 1fr;
  }
}
</style>
