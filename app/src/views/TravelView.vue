<script setup>
/**
 * TravelView — 旅游模块（3D 地球 + 标记点亮 + 推荐卡片）
 */
import { ref, computed, reactive, onMounted, watch } from 'vue'
import GlassCard from '@/components/common/GlassCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { getAllCountries, REGIONS, formatPopulation } from '@/api/countries'
import { PACKING_TEMPLATE, BUDGET_CATEGORIES } from '@/data/travelData'
import {
  getAllProvinces, filterByProvinceRegion, searchProvinces,
  getProvinceById, PROVINCE_REGIONS, getRegionLabel
} from '@/api/chinaProvinces'
import { CHINA_PROVINCES } from '@/data/chinaProvinces'
import { useTravelGlobe } from '@/composables/useTravelGlobe'

// ═══ 3D 地球 ═══════════════════════
const globeCanvas = ref(null)
const globeWrap = ref(null)
const visitedCountries = ref(JSON.parse(localStorage.getItem('travel:visited') || '[]'))
const newCountry = ref('')
const showInput = ref(false)
const inputError = ref('')

const { ready: globeReady, updateMarkers, COUNTRY_REGION } = useTravelGlobe(globeCanvas, globeWrap, visitedCountries)

watch(visitedCountries, (v) => {
  localStorage.setItem('travel:visited', JSON.stringify(v))
  updateMarkers()
}, { deep: true })

function addCountry() {
  const name = newCountry.value.trim()
  if (!name) return
  if (visitedCountries.value.includes(name)) {
    inputError.value = '已添加过这个国家'
    return
  }
  visitedCountries.value = [...visitedCountries.value, name]
  newCountry.value = ''
  inputError.value = ''
  showInput.value = false
}

function removeCountry(name) {
  visitedCountries.value = visitedCountries.value.filter(c => c !== name)
}

// ═══ 推荐目的地 ═══════════════════
const RECOMMENDED = [
  { name: '日本', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80', desc: '樱花、寿司、温泉、古都——四季皆宜的旅行天堂' },
  { name: '冰岛', image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=600&q=80', desc: '极光、冰川、火山、温泉——地球最梦幻的边界' },
  { name: '希腊', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80', desc: '爱琴海的蓝白梦境，千年古迹与浪漫岛屿' },
  { name: '新西兰', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&q=80', desc: '中土世界的壮丽山川，极限运动与自然天堂' },
  { name: '摩洛哥', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&q=80', desc: '舍夫沙万的蓝色迷城，撒哈拉的星空帐篷' },
  { name: '挪威', image: 'https://images.unsplash.com/photo-1506599366042-79ed53d5a2f0?w=600&q=80', desc: '峡湾、极光、森林、雪山——北欧童话世界' },
  { name: '泰国', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80', desc: '热辣美食、金色寺庙、热带海岛、微笑之国' },
  { name: '瑞士', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=80', desc: '阿尔卑斯山下的童话国度，极致纯净的自然风光' },
]

function biliUrl(name) {
  return `https://search.bilibili.com/all?keyword=${encodeURIComponent(name + ' 旅游攻略')}`
}

// ═══ 原标签页功能 ═════════════════
const tab = ref('destinations')
const countries = ref([])
const filtered = ref([])
const loading = ref(true)
const errorMsg = ref('')
const searchKeyword = ref('')
const activeRegion = ref('')
const selected = ref(null)
const viewingProvinces = ref(false)
const provinces = ref([])
const provinceRegion = ref('')
const provinceKeyword = ref('')
const selectedProvince = ref(null)
const flagErrors = reactive({})

const packingInit = {}
PACKING_TEMPLATE.forEach((cat) => {
  packingInit[cat.category] = cat.items.map((item) => ({ name: item, checked: false }))
})
import { useLocalStorage } from '@/composables/useLocalStorage'
const packing = useLocalStorage('life-hub:packing', packingInit)
const packingStats = computed(() => {
  let total = 0, done = 0
  for (const cat in packing.value) { packing.value[cat].forEach((item) => { total++; if (item.checked) done++ }) }
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 }
})
function resetPacking() { if (confirm('确定重置行李清单吗？')) for (const cat in packing.value) packing.value[cat].forEach((i) => (i.checked = false)) }

const days = ref(5); const people = ref(2)
const budget = ref({ transport: 5000, accommodation: 4000, food: 2000, activities: 2000, shopping: 1000, other: 500 })
const totalBudget = computed(() => { let t = 0; for (const k in budget.value) t += budget.value[k]; return t })
const perPerson = computed(() => Math.round(totalBudget.value / people.value))
function resetBudget() { for (const k in budget.value) budget.value[k] = BUDGET_CATEGORIES.find(c => c.key === k)?.default || 0 }

function onFlagError(code) { flagErrors[code] = true }
function getFlagUrl(code) { return `https://flagcdn.com/w320/${code.toLowerCase()}.png` }

async function loadCountries() {
  loading.value = true; errorMsg.value = ''
  try { countries.value = await getAllCountries(); filtered.value = countries.value }
  catch (e) { errorMsg.value = '国家数据加载失败，请检查网络后刷新' }
  finally { loading.value = false }
}
onMounted(() => { loadCountries() })

function applyFilter() {
  let list = countries.value
  if (activeRegion.value) list = list.filter(c => c.region === activeRegion.value)
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
    list = list.filter(c => c.name.toLowerCase().includes(kw) || c.capital.toLowerCase().includes(kw))
  }
  filtered.value = list
}
function selectRegion(code) { activeRegion.value = activeRegion.value === code ? '' : code; applyFilter() }
function clearFilter() { activeRegion.value = ''; searchKeyword.value = ''; filtered.value = countries.value }

function selectCountry(c) {
  if (c.code === 'CN') { provinces.value = CHINA_PROVINCES; provinceRegion.value = ''; provinceKeyword.value = ''; viewingProvinces.value = true; selected.value = null }
  else { selected.value = c }
}
function backToCountries() { viewingProvinces.value = false; selectedProvince.value = null }
function filterProvinces() {
  let list = CHINA_PROVINCES
  if (provinceRegion.value) list = list.filter(p => p.region === provinceRegion.value)
  if (provinceKeyword.value.trim()) {
    const kw = provinceKeyword.value.trim().toLowerCase()
    list = list.filter(p => p.name.includes(kw) || p.capital.includes(kw) || p.attractions.some(a => a.includes(kw)) || p.cuisine.some(c => c.includes(kw)))
  }
  provinces.value = list
}
function selectProvinceRegion(region) { provinceRegion.value = provinceRegion.value === region ? '' : region; filterProvinces() }
function openProvinceDetail(id) { selectedProvince.value = getProvinceById(id) }
</script>

<template>
  <div class="travel-page">
    <!-- ═══ 3D 地球区 ═══ -->
    <section ref="globeWrap" class="globe-section">
      <canvas ref="globeCanvas" class="globe-canvas"></canvas>
      <div class="globe-gradient-bottom"></div>

      <!-- 标题 -->
      <div class="globe-title">
        <h1>🌍 环游世界</h1>
        <p>点亮你去过的每一个角落</p>
      </div>

      <!-- 去过地点面板 -->
      <div class="visited-panel glass">
        <div class="vp-head">
          <span class="vp-label">📍 我去过的</span>
          <span class="vp-count">{{ visitedCountries.length }}</span>
          <button class="vp-add-btn" @click="showInput = !showInput">+</button>
        </div>

        <div v-if="showInput" class="vp-input-row">
          <input v-model="newCountry" class="vp-input" placeholder="输入国家名..." @keyup.enter="addCountry" />
          <button class="vp-submit" @click="addCountry">添加</button>
        </div>
        <p v-if="inputError" class="vp-error">{{ inputError }}</p>

        <div class="vp-list">
          <div v-for="c in visitedCountries" :key="c" class="vp-item">
            <div class="vp-item-left">
              <span class="vp-item-name">{{ c }}</span>
              <span class="vp-item-region">{{ COUNTRY_REGION[c] || '其他' }}</span>
            </div>
            <button class="vp-item-del" @click="removeCountry(c)">✕</button>
          </div>
          <div v-if="!visitedCountries.length" class="vp-empty">还没有去过的地方，开始点亮世界吧 ✨</div>
        </div>
      </div>

      <!-- 滚动提示 -->
      <div class="scroll-hint">↓ 向下探索更多</div>
    </section>

    <!-- ═══ 推荐目的地 ═══ -->
    <section class="recommend-section">
      <div class="section-header">
        <h2>🏝️ 推荐目的地</h2>
        <p>点击卡片跳转 B站 查看攻略视频</p>
      </div>
      <div class="card-grid">
        <a v-for="place in RECOMMENDED" :key="place.name" :href="biliUrl(place.name)" target="_blank" class="rec-card" rel="noopener">
          <div class="rec-card-img">
            <img :src="place.image" :alt="place.name" loading="lazy" />
            <div class="rec-card-overlay">
              <span class="rec-card-badge">▶ B站攻略</span>
            </div>
          </div>
          <div class="rec-card-body">
            <h3>{{ place.name }}</h3>
            <p>{{ place.desc }}</p>
            <span class="rec-card-link">查看攻略 →</span>
          </div>
        </a>
      </div>
    </section>

    <!-- ═══ 原有标签页（目的地/行李/预算） ═══ -->
    <section class="tabs-section">
      <div class="tabs-nav">
        <button :class="{ active: tab === 'destinations' }" @click="tab = 'destinations'">🌏 目的地</button>
        <button :class="{ active: tab === 'packing' }" @click="tab = 'packing'">🧳 行李清单</button>
        <button :class="{ active: tab === 'budget' }" @click="tab = 'budget'">💰 预算计算</button>
      </div>

      <!-- 目的地标签 -->
      <div v-if="tab === 'destinations'" class="tab-content">
        <div v-if="loading" class="loading-state"><LoadingSpinner label="加载国家数据..." /></div>
        <div v-else-if="errorMsg" class="error-state">{{ errorMsg }}</div>
        <template v-else>
          <div v-if="!viewingProvinces && !selected">
            <div class="filter-bar">
              <input v-model="searchKeyword" class="filter-input" placeholder="搜索国家或首都..." @input="applyFilter" />
              <div class="region-chips">
                <button v-for="r in REGIONS" :key="r.code" class="chip" :class="{ active: activeRegion === r.code }" @click="selectRegion(r.code)">{{ r.label }}</button>
                <button v-if="activeRegion || searchKeyword" class="chip chip-clear" @click="clearFilter">✕ 清除</button>
              </div>
            </div>
            <div class="country-grid">
              <div v-for="c in filtered" :key="c.code" class="country-card" @click="selectCountry(c)">
                <div class="flag-wrap">
                  <img v-if="!flagErrors[c.code]" :src="getFlagUrl(c.code)" :alt="c.name" class="flag-img" @error="onFlagError(c.code)" />
                  <div v-else class="flag-placeholder">{{ c.code }}</div>
                </div>
                <div class="country-info">
                  <div class="country-name">{{ c.name }}</div>
                  <div class="country-capital">{{ c.capital }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 省份下钻 -->
          <div v-if="viewingProvinces && !selectedProvince">
            <button class="back-btn" @click="backToCountries">← 返回国家列表</button>
            <div class="filter-bar">
              <input v-model="provinceKeyword" class="filter-input" placeholder="搜索省份..." @input="filterProvinces" />
              <div class="region-chips">
                <button v-for="r in PROVINCE_REGIONS" :key="r.code" class="chip" :class="{ active: provinceRegion === r.code }" @click="selectProvinceRegion(r.code)">{{ getRegionLabel(r.code) }}</button>
              </div>
            </div>
            <div class="country-grid">
              <div v-for="p in provinces" :key="p.id" class="country-card" @click="openProvinceDetail(p.id)">
                <div class="flag-wrap"><div class="flag-placeholder">{{ p.name[0] }}</div></div>
                <div class="country-info"><div class="country-name">{{ p.name }}</div><div class="country-capital">{{ p.capital }}</div></div>
              </div>
            </div>
          </div>

          <!-- 详情弹窗 -->
          <div v-if="selected" class="modal-overlay" @click.self="selected = null">
            <GlassCard class="modal-content">
              <div class="modal-hero">
                <img :src="getFlagUrl(selected.code)" :alt="selected.name" class="modal-flag" />
                <h2>{{ selected.name }}</h2>
              </div>
              <div class="modal-body">
                <div class="modal-info"><span>首都</span><span>{{ selected.capital }}</span></div>
                <div class="modal-info"><span>人口</span><span>{{ formatPopulation(selected.population) }}</span></div>
                <div class="modal-info"><span>区域</span><span>{{ selected.region }}</span></div>
              </div>
              <button class="modal-close" @click="selected = null">关闭</button>
            </GlassCard>
          </div>

          <!-- 省份详情弹窗 -->
          <div v-if="selectedProvince" class="modal-overlay" @click.self="selectedProvince = null">
            <GlassCard class="modal-content">
              <button class="modal-close top-right" @click="selectedProvince = null">✕</button>
              <div class="modal-hero"><h2>{{ selectedProvince.name }}</h2></div>
              <div class="modal-body">
                <div class="modal-info"><span>省会</span><span>{{ selectedProvince.capital }}</span></div>
                <div class="modal-info"><span>地区</span><span>{{ getRegionLabel(selectedProvince.region) }}</span></div>
                <div v-if="selectedProvince.attractions?.length" class="modal-section"><h4>景点</h4><p>{{ selectedProvince.attractions.join('、') }}</p></div>
                <div v-if="selectedProvince.cuisine?.length" class="modal-section"><h4>美食</h4><p>{{ selectedProvince.cuisine.join('、') }}</p></div>
                <div v-if="selectedProvince.tips" class="modal-section"><h4>旅行贴士</h4><p>{{ selectedProvince.tips }}</p></div>
              </div>
            </GlassCard>
          </div>
        </template>
      </div>

      <!-- 行李清单标签 -->
      <div v-if="tab === 'packing'" class="tab-content">
        <div class="packing-header">
          <div class="packing-progress">
            <div class="progress-bar"><div class="progress-fill" :style="{ width: packingStats.percent + '%' }"></div></div>
            <span class="progress-text">{{ packingStats.done }}/{{ packingStats.total }}</span>
          </div>
          <button class="btn btn-ghost" @click="resetPacking">重置</button>
        </div>
        <div v-for="(items, cat) in packing" :key="cat" class="packing-cat">
          <h4 class="packing-cat-title">{{ cat }}</h4>
          <div class="packing-items">
            <label v-for="item in items" :key="item.name" class="packing-item" :class="{ done: item.checked }">
              <input type="checkbox" v-model="item.checked" />
              <span>{{ item.name }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 预算计算标签 -->
      <div v-if="tab === 'budget'" class="tab-content">
        <div class="budget-settings">
          <label>天数 <input v-model.number="days" type="number" min="1" max="90" class="budget-input" /></label>
          <label>人数 <input v-model.number="people" type="number" min="1" max="20" class="budget-input" /></label>
        </div>
        <div class="budget-items">
          <div v-for="cat in BUDGET_CATEGORIES" :key="cat.key" class="budget-row">
            <span class="budget-label">{{ cat.label }}</span>
            <div class="budget-input-wrap">
              <span class="budget-currency">¥</span>
              <input v-model.number="budget[cat.key]" type="number" min="0" class="budget-input" />
            </div>
            <div class="budget-bar-wrap"><div class="budget-bar" :style="{ width: (budget[cat.key] / totalBudget * 100) + '%' }"></div></div>
          </div>
        </div>
        <div class="budget-total">
          <div><span>总预算</span><strong>¥{{ totalBudget.toLocaleString() }}</strong></div>
          <div><span>人均</span><strong>¥{{ perPerson.toLocaleString() }}</strong></div>
          <div><span>日均</span><strong>¥{{ days ? Math.round(totalBudget / days).toLocaleString() : 0 }}</strong></div>
        </div>
        <button class="btn btn-ghost" @click="resetBudget" style="margin-top:1rem">重置</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.travel-page { max-width: 100%; overflow-x: hidden; }

/* ═══ 3D 地球区 ═══ */
.globe-section {
  position: relative;
  width: 100%;
  height: 100vh;
  max-height: 700px;
  overflow: hidden;
  background: var(--space-deepest);
}
.globe-canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;
}
.globe-canvas:active { cursor: grabbing; }
.globe-gradient-bottom {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 100px;
  background: linear-gradient(to bottom, transparent, var(--space-deepest));
  pointer-events: none;
}
.globe-section { position: relative; width: 100%; height: 100vh; max-height: 700px; overflow: hidden; background: var(--space-deepest); }
.globe-section :deep(.css2d-renderer) { position: absolute !important; top: 0 !important; left: 0 !important; pointer-events: none !important; }
.globe-title {
  position: absolute;
  top: 24px; left: 50%; transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
  z-index: 2;
}
.globe-title h1 {
  font-size: 2rem; font-weight: 700;
  color: #5a4a3a;
  text-shadow: 0 2px 12px rgba(255,255,255,0.5);
  margin-bottom: 4px;
}
.globe-title p {
  font-size: 0.9rem; color: rgba(80,70,60,0.7);
  text-shadow: 0 1px 8px rgba(255,255,255,0.4);
}

/* 已去地点面板 */
.visited-panel {
  position: absolute;
  right: 20px; top: 80px;
  width: 220px;
  max-height: 60%;
  display: flex;
  flex-direction: column;
  z-index: 3;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(212,163,115,0.15);
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}
.vp-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.vp-label { font-size: 0.8rem; font-weight: 600; color: var(--text-primary); flex: 1; }
.vp-count { font-size: 0.75rem; color: #c97d5e; font-weight: 600; }
.vp-add-btn { width: 24px; height: 24px; border: none; border-radius: 50%; background: #d4a373; color: #fff; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; }
.vp-add-btn:hover { background: #c97d5e; }
.vp-input-row { display: flex; gap: 6px; margin-bottom: 6px; }
.vp-input { flex: 1; padding: 6px 10px; border: 1px solid rgba(212,163,115,0.3); border-radius: 8px; font-size: 0.8rem; background: rgba(255,255,255,0.6); outline: none; font-family: inherit; }
.vp-input:focus { border-color: #d4a373; }
.vp-submit { padding: 6px 12px; border: none; border-radius: 8px; background: #d4a373; color: #fff; font-size: 0.75rem; cursor: pointer; font-family: inherit; }
.vp-submit:hover { background: #c97d5e; }
.vp-error { font-size: 0.75rem; color: #d45d5d; margin-bottom: 4px; }
.vp-list { overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 4px; }
.vp-item { display: flex; align-items: center; padding: 6px 8px; border-radius: 8px; background: rgba(255,255,255,0.4); transition: background 0.2s; }
.vp-item:hover { background: rgba(255,255,255,0.7); }
.vp-item-left { flex: 1; min-width: 0; }
.vp-item-name { font-size: 0.8rem; color: var(--text-primary); }
.vp-item-region { font-size: 0.6rem; color: var(--text-muted); display: block; margin-top: 1px; }
.vp-item-del { width: 20px; height: 20px; border: none; border-radius: 50%; background: transparent; color: #c97d5e; cursor: pointer; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
.vp-item:hover .vp-item-del { opacity: 1; }
.vp-item-del:hover { background: rgba(212,93,93,0.1); color: #d45d5d; }
.vp-empty { font-size: 0.75rem; color: var(--text-muted); text-align: center; padding: 16px 0; line-height: 1.5; }

.scroll-hint {
  position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
  font-size: 0.75rem; color: var(--text-muted);
  animation: bounce 2s ease-in-out infinite;
  z-index: 2;
}
@keyframes bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(6px); } }

/* ═══ 推荐目的地 ═══ */
.recommend-section {
  max-width: 1200px; margin: 0 auto; padding: 48px 24px;
}
.section-header { text-align: center; margin-bottom: 32px; }
.section-header h2 { font-size: 1.8rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
.section-header p { font-size: 0.9rem; color: var(--text-secondary); }

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
.rec-card {
  display: flex; flex-direction: column;
  border-radius: 16px; overflow: hidden;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  text-decoration: none; color: inherit;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.rec-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
.rec-card-img {
  position: relative; width: 100%; aspect-ratio: 16/10; overflow: hidden;
  background: var(--glass-bg-soft);
}
.rec-card-img img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.6s ease;
}
.rec-card:hover .rec-card-img img { transform: scale(1.05); }
.rec-card-overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 10px 14px;
  background: linear-gradient(to top, rgba(245,240,235,0.85), transparent);
}
.rec-card-badge {
  font-size: 0.7rem; font-weight: 600;
  padding: 3px 10px; border-radius: 20px;
  background: rgba(212,163,115,0.3);
  color: #8b6914; border: 1px solid rgba(212,163,115,0.2);
}
.rec-card-body { padding: 14px 16px; flex: 1; display: flex; flex-direction: column; }
.rec-card-body h3 { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; }
.rec-card-body p { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; flex: 1; }
.rec-card-link { font-size: 0.8rem; font-weight: 600; color: #c97d5e; margin-top: 10px; transition: transform 0.2s; display: inline-block; }
.rec-card:hover .rec-card-link { transform: translateX(4px); }

/* ═══ 标签页 ═══ */
.tabs-section {
  max-width: 1200px; margin: 0 auto; padding: 0 24px 48px;
}
.tabs-nav {
  display: flex; gap: 4px; margin-bottom: 24px;
  background: var(--glass-bg); border-radius: 14px; padding: 4px;
  backdrop-filter: blur(12px); border: 1px solid var(--glass-border);
}
.tabs-nav button {
  flex: 1; padding: 10px 16px; border: none; border-radius: 10px;
  background: transparent; color: var(--text-secondary); font-size: 0.85rem;
  font-weight: 500; cursor: pointer; transition: all 0.3s; font-family: inherit;
}
.tabs-nav button.active { background: rgba(212,163,115,0.15); color: #8b6914; font-weight: 600; }
.tabs-nav button:hover:not(.active) { background: rgba(0,0,0,0.03); }
.tab-content { min-height: 300px; }

/* 目的地子标签 */
.loading-state { text-align: center; padding: 60px 0; }
.error-state { text-align: center; padding: 40px; color: #d45d5d; }
.filter-bar { margin-bottom: 16px; display: flex; flex-direction: column; gap: 10px; }
.filter-input { width: 100%; padding: 10px 14px; border: 1px solid var(--glass-border); border-radius: 12px; font-size: 0.85rem; background: var(--glass-bg-soft); color: var(--text-primary); outline: none; font-family: inherit; transition: border-color 0.3s; }
.filter-input:focus { border-color: #d4a373; }
.region-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { padding: 5px 12px; border-radius: 20px; border: 1px solid var(--glass-border); background: transparent; font-size: 0.75rem; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; font-family: inherit; }
.chip:hover { border-color: #d4a373; color: var(--text-primary); }
.chip.active { background: rgba(212,163,115,0.15); border-color: #d4a373; color: #8b6914; }
.chip-clear { color: #d45d5d; }
.country-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.country-card { padding: 12px; border-radius: 14px; background: var(--glass-bg); backdrop-filter: blur(8px); border: 1px solid var(--glass-border); cursor: pointer; transition: all 0.25s; text-align: center; }
.country-card:hover { transform: translateY(-4px); box-shadow: 0 6px 20px rgba(0,0,0,0.06); }
.flag-wrap { width: 100%; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; background: var(--glass-bg-soft); margin-bottom: 8px; display: flex; align-items: center; justify-content: center; }
.flag-img { width: 100%; height: 100%; object-fit: cover; }
.flag-placeholder { font-size: 1.5rem; font-weight: 700; color: var(--text-muted); }
.country-name { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; }
.country-capital { font-size: 0.7rem; color: var(--text-muted); }
.back-btn { padding: 6px 14px; border: 1px solid var(--glass-border); border-radius: 10px; background: transparent; color: var(--text-secondary); cursor: pointer; font-size: 0.8rem; margin-bottom: 12px; font-family: inherit; transition: all 0.2s; }
.back-btn:hover { border-color: #d4a373; color: var(--text-primary); }

/* 弹窗 */
.modal-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.2); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-hero { text-align: center; padding: 20px; border-bottom: 1px solid var(--glass-border); }
.modal-flag { width: 80px; height: 60px; object-fit: cover; border-radius: 8px; margin-bottom: 10px; }
.modal-hero h2 { font-size: 1.4rem; }
.modal-body { padding: 20px; }
.modal-info { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--glass-border-soft); font-size: 0.85rem; }
.modal-info span:first-child { color: var(--text-muted); }
.modal-info span:last-child { font-weight: 500; color: var(--text-primary); }
.modal-section { margin-top: 16px; }
.modal-section h4 { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px; }
.modal-section p { font-size: 0.85rem; line-height: 1.6; }
.modal-close { display: block; margin: 0 auto 20px; padding: 8px 24px; border: 1px solid var(--glass-border); border-radius: 10px; background: transparent; color: var(--text-secondary); cursor: pointer; font-family: inherit; }
.modal-close:hover { border-color: #d4a373; }
.top-right { position: absolute; top: 12px; right: 12px; margin: 0; }

/* 行李清单 */
.packing-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.packing-progress { flex: 1; display: flex; align-items: center; gap: 12px; }
.progress-bar { flex: 1; height: 8px; border-radius: 4px; background: var(--glass-border); overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #e8c9a0, #d4a373); border-radius: 4px; transition: width 0.3s; }
.progress-text { font-size: 0.8rem; color: var(--text-muted); white-space: nowrap; }
.packing-cat { margin-bottom: 20px; }
.packing-cat-title { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid var(--glass-border-soft); }
.packing-items { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; }
.packing-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 8px; background: var(--glass-bg-soft); font-size: 0.82rem; cursor: pointer; transition: background 0.2s; }
.packing-item:hover { background: var(--glass-bg); }
.packing-item.done span { text-decoration: line-through; opacity: 0.5; }

/* 预算 */
.budget-settings { display: flex; gap: 20px; margin-bottom: 20px; }
.budget-settings label { font-size: 0.85rem; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; }
.budget-input { width: 70px; padding: 6px 10px; border: 1px solid var(--glass-border); border-radius: 8px; background: var(--glass-bg-soft); color: var(--text-primary); font-size: 0.85rem; text-align: center; outline: none; font-family: inherit; }
.budget-input:focus { border-color: #d4a373; }
.budget-items { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.budget-row { display: flex; align-items: center; gap: 12px; }
.budget-label { width: 80px; font-size: 0.85rem; color: var(--text-secondary); flex-shrink: 0; }
.budget-input-wrap { position: relative; width: 110px; }
.budget-currency { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 0.8rem; color: var(--text-muted); }
.budget-input-wrap .budget-input { width: 100%; padding-left: 24px; text-align: right; }
.budget-bar-wrap { flex: 1; height: 8px; border-radius: 4px; background: var(--glass-border); overflow: hidden; }
.budget-bar { height: 100%; background: linear-gradient(90deg, #e8c9a0, #d4a373); border-radius: 4px; transition: width 0.3s; }
.budget-total { display: flex; gap: 24px; padding: 16px; border-radius: 12px; background: var(--glass-bg-soft); }
.budget-total div { text-align: center; flex: 1; }
.budget-total span { display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px; }
.budget-total strong { font-size: 1.1rem; color: var(--text-primary); }

/* 响应式 */
@media (max-width: 768px) {
  .globe-section { height: 70vh; max-height: 500px; }
  .globe-title h1 { font-size: 1.4rem; }
  .visited-panel { right: 12px; top: 70px; width: 180px; }
  .card-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
  .country-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); }
  .budget-settings { flex-direction: column; gap: 10px; }
  .budget-total { flex-direction: column; gap: 10px; }
}
</style>
