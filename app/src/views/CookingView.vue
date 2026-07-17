<script setup>
/**
 * CookingView - 做饭模块
 * 功能：中英双语食谱库切换、按菜名/食材搜索、分类筛选、随机推荐、食谱详情、收藏夹
 * 中文：内置 36 道经典家常菜（零网络依赖）
 * 英文：TheMealDB API（全球食谱）
 */
import { ref, computed, reactive, onMounted, watch } from 'vue'
import GlassCard from '@/components/common/GlassCard.vue'
import GlassButton from '@/components/common/GlassButton.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import {
  searchMealsByName,
  filterByIngredient,
  filterByCategory,
  getAllCategories,
  getMealById,
  getRandomMeal,
  parseMeal
} from '@/api/meals'
import {
  searchCnMeals,
  filterCnByCategory,
  getCnCategories,
  getCnMealById,
  getRandomCnMeal
} from '@/api/cnRecipes'
import { useFavoritesStore } from '@/stores/favorites'
import { translateCategory, translateArea, translateIngredient, annotateInstruction, getCuisineNote, getCategoryNote } from '@/data/mealTranslations'

const favorites = useFavoritesStore()

// 当前食谱库：cn（中文）/ en（英文）
const library = ref('cn')

// 搜索模式
const searchMode = ref('name')
const searchKeyword = ref('')

// 分类
const categories = ref([])
const activeCategory = ref('')

// 食谱列表与状态
const meals = ref([])
const loading = ref(false)
const errorMsg = ref('')
const hasSearched = ref(false)

// 食谱详情弹窗
const detail = ref(null)
const detailLoading = ref(false)

// 收藏视图开关
const showFavorites = ref(false)

// 图片加载失败追踪
const brokenImgs = reactive({})
const detailImgBroken = ref(false)

/** 获取 emoji 回退的渐变色背景 */
function getGradient(meal) {
  const color = meal.color || '#d4a373'
  return `linear-gradient(135deg, ${color}, rgba(0,0,0,0.55))`
}

/** 图片加载失败时标记为损坏，切换到 emoji 显示 */
function onImgError(mealId) {
  brokenImgs[mealId] = true
}

// 切换食谱库或执行搜索时重置图片错误状态
watch(meals, () => { for (const k in brokenImgs) delete brokenImgs[k] })
watch(library, () => { for (const k in brokenImgs) delete brokenImgs[k] })
watch(detail, () => { detailImgBroken.value = false })

// 当前显示的列表（普通列表 or 收藏列表）
const displayMeals = computed(() =>
  showFavorites.value
    ? favorites.items.map((m) => ({
        id: m.id,
        name: m.name,
        thumb: m.thumb,
        emoji: m.emoji,
        color: m.color,
        category: m.category,
        area: m.area
      }))
    : meals.value
)

// 搜索框占位文案
const searchPlaceholder = computed(() => {
  if (library.value === 'cn') {
    return '输入菜名，如 番茄炒蛋、红烧肉、豆腐...'
  }
  return searchMode.value === 'name'
    ? '输入菜名，如 Arrabiata、Chicken...'
    : '输入食材（英文效果更好），如 rice、egg、beef...'
})

/** 切换食谱库 */
async function switchLibrary(lib) {
  if (library.value === lib) return
  library.value = lib
  meals.value = []
  hasSearched.value = false
  activeCategory.value = ''
  searchKeyword.value = ''
  showFavorites.value = false
  if (lib === 'cn') searchMode.value = 'name'
  await loadCategories()
}

/** 加载分类列表 */
async function loadCategories() {
  try {
    if (library.value === 'cn') {
      categories.value = getCnCategories()
    } else {
      categories.value = await getAllCategories()
    }
  } catch {
    categories.value = []
  }
}

/** 执行搜索 */
async function doSearch() {
  if (!searchKeyword.value.trim()) return
  showFavorites.value = false
  activeCategory.value = ''
  loading.value = true
  errorMsg.value = ''
  hasSearched.value = true

  try {
    if (library.value === 'cn') {
      // 中文食谱：内置数据，支持菜名和食材统一搜索
      meals.value = await searchCnMeals(searchKeyword.value)
    } else {
      // 英文食谱：TheMealDB
      const raw =
        searchMode.value === 'name'
          ? await searchMealsByName(searchKeyword.value)
          : await filterByIngredient(searchKeyword.value)
      meals.value = raw.map((m) => ({
        id: m.idMeal,
        name: m.strMeal,
        thumb: m.strMealThumb,
        category: m.strCategory,
        area: m.strArea
      }))
    }
  } catch (e) {
    errorMsg.value = '搜索失败，请稍后重试'
    meals.value = []
  } finally {
    loading.value = false
  }
}

/** 按分类筛选 */
async function selectCategory(cat) {
  showFavorites.value = false
  searchKeyword.value = ''
  activeCategory.value = cat
  loading.value = true
  errorMsg.value = ''
  hasSearched.value = true

  try {
    if (library.value === 'cn') {
      meals.value = await filterCnByCategory(cat)
    } else {
      const raw = await filterByCategory(cat)
      meals.value = raw.map((m) => ({
        id: m.idMeal,
        name: m.strMeal,
        thumb: m.strMealThumb,
        category: cat,
        area: m.strArea
      }))
    }
  } catch {
    errorMsg.value = '加载失败'
    meals.value = []
  } finally {
    loading.value = false
  }
}

/** 手气不错 - 随机一份并直接打开详情 */
async function luckyRandom() {
  detailLoading.value = true
  detail.value = null
  try {
    if (library.value === 'cn') {
      detail.value = await getRandomCnMeal()
    } else {
      const raw = await getRandomMeal()
      if (raw) detail.value = parseMeal(raw)
    }
  } catch {
    errorMsg.value = '获取失败'
  } finally {
    detailLoading.value = false
  }
}

/** 查看详情 */
async function viewDetail(id) {
  detailLoading.value = true
  detail.value = null
  try {
    if (library.value === 'cn') {
      detail.value = await getCnMealById(id)
    } else {
      const raw = await getMealById(id)
      detail.value = parseMeal(raw)
    }
  } catch {
    errorMsg.value = '详情加载失败'
  } finally {
    detailLoading.value = false
  }
}

function closeDetail() {
  detail.value = null
}

/** 切换搜索模式时清空结果（仅英文模式有效） */
watch(searchMode, () => {
  meals.value = []
  hasSearched.value = false
})

onMounted(async () => {
  await loadCategories()
})
</script>

<template>
  <div class="container page">
    <!-- 页头 -->
    <div class="page-header">
      <h1 class="page-title">🍳 做饭</h1>
      <p class="page-subtitle">发现美味食谱，今天吃点什么好呢？</p>
    </div>

    <!-- 搜索区 -->
    <GlassCard variant="strong" padding="lg" class="search-section">
      <!-- 食谱库切换 -->
      <div class="library-switch">
        <button
          class="lib-btn"
          :class="{ active: library === 'cn' }"
          @click="switchLibrary('cn')"
        >
          🇨🇳 中文家常菜
        </button>
        <button
          class="lib-btn"
          :class="{ active: library === 'en' }"
          @click="switchLibrary('en')"
        >
          🌍 全球食谱 (English)
        </button>
      </div>

      <!-- 模式切换 -->
      <div class="mode-tabs">
        <button
          class="mode-tab"
          :class="{ active: searchMode === 'name' }"
          @click="searchMode = 'name'"
        >
          🔍 按菜名搜索
        </button>
        <button
          v-if="library === 'en'"
          class="mode-tab"
          :class="{ active: searchMode === 'ingredient' }"
          @click="searchMode = 'ingredient'"
        >
          🥕 按食材查找
        </button>
        <button
          class="mode-tab"
          :class="{ active: showFavorites }"
          @click="showFavorites = true; hasSearched = true"
        >
          ⭐ 我的收藏 ({{ favorites.count }})
        </button>
      </div>

      <!-- 搜索框 -->
      <div class="search-bar" v-if="!showFavorites">
        <input
          v-model="searchKeyword"
          class="input search-input"
          :placeholder="searchPlaceholder"
          @keyup.enter="doSearch"
        />
        <GlassButton variant="primary" @click="doSearch">搜索</GlassButton>
        <GlassButton variant="ghost" @click="luckyRandom">🎲 手气不错</GlassButton>
      </div>

      <!-- 分类快捷筛选 -->
      <div class="category-chips" v-if="!showFavorites && categories.length">
        <span class="chips-label">热门分类：</span>
        <button
          v-for="c in categories.slice(0, 10)"
          :key="c.idCategory"
          class="chip"
          :class="{ active: activeCategory === c.strCategory }"
          @click="selectCategory(c.strCategory)"
        >
          {{ c.strCategory }}
        </button>
      </div>
    </GlassCard>

    <!-- 食谱列表 -->
    <section class="mt-xl">
      <!-- 加载中 -->
      <LoadingSpinner v-if="loading" label="正在搜索美味食谱..." />

      <!-- 错误 -->
      <EmptyState
        v-else-if="errorMsg"
        icon="😖"
        title="出错了"
        :description="errorMsg"
      />

      <!-- 收藏为空 -->
      <EmptyState
        v-else-if="showFavorites && !favorites.items.length"
        icon="🤍"
        title="还没有收藏"
        description="浏览食谱时点击爱心收藏，方便以后查看"
      >
        <template #action>
          <GlassButton variant="ghost" @click="showFavorites = false">
            去发现美食
          </GlassButton>
        </template>
      </EmptyState>

      <!-- 初始状态 -->
      <EmptyState
        v-else-if="!hasSearched"
        icon="👨‍🍳"
        title="开始你的美食之旅"
        description="搜索菜名、按食材查找，或试试随机推荐一道菜！"
      />

      <!-- 搜索无结果 -->
      <EmptyState
        v-else-if="!displayMeals.length"
        icon="🍽️"
        title="没有找到相关食谱"
        description="换个关键词或食材再试试吧"
      />

      <!-- 食谱网格 -->
      <div v-else class="grid grid-3">
        <GlassCard
          v-for="m in displayMeals"
          :key="m.id"
          padding="none"
          hover
          clickable
          class="meal-card"
          @click="viewDetail(m.id)"
        >
          <div class="meal-thumb">
            <template v-if="m.thumb && !brokenImgs[m.id]">
              <img :src="m.thumb" :alt="m.name" loading="lazy" @error="onImgError(m.id)" />
            </template>
            <div v-else class="meal-emoji" :style="{ background: getGradient(m) }">
              {{ m.emoji || '🍽️' }}
            </div>
            <button
              class="fav-btn"
              :class="{ active: favorites.isFavorite(m.id) }"
              @click.stop="favorites.toggle(m)"
              :title="favorites.isFavorite(m.id) ? '取消收藏' : '收藏'"
            >
              {{ favorites.isFavorite(m.id) ? '❤️' : '🤍' }}
            </button>
          </div>
          <div class="meal-info">
            <h3 class="meal-name">{{ m.name }}</h3>
            <div class="meal-meta">
              <span v-if="m.category" class="meta-tag">
                {{ m.category }}
                <span v-if="!m.isChinese" class="zh-annotation">{{ translateCategory(m.category) }}</span>
              </span>
              <span v-if="m.area" class="meta-tag">
                {{ m.area }}
                <span v-if="!m.isChinese" class="zh-annotation">{{ translateArea(m.area) }}</span>
              </span>
              <span v-if="m.difficulty" class="meta-tag">{{ m.difficulty }}</span>
              <span v-if="m.time" class="meta-tag">⏱️ {{ m.time }} 分钟</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>

    <!-- 详情弹窗 -->
    <Transition name="fade">
      <div
        v-if="detail || detailLoading"
        class="modal-overlay"
        @click.self="closeDetail"
      >
        <div class="modal-content">
          <LoadingSpinner v-if="detailLoading" label="加载详情..." />
          <template v-else-if="detail">
            <button class="modal-close" @click="closeDetail">✕</button>
            <div class="detail-hero">
              <template v-if="detail.thumb && !detailImgBroken">
                <img :src="detail.thumb" :alt="detail.name" @error="detailImgBroken = true" />
              </template>
              <div v-else class="detail-emoji-hero" :style="{ background: getGradient(detail) }">
                {{ detail.emoji || '🍽️' }}
              </div>
              <div class="detail-hero-overlay">
                <h2 class="detail-name">{{ detail.name }}</h2>
                <div class="detail-tags">
                  <span v-if="detail.category" class="meta-tag">
                    {{ detail.category }}
                    <span v-if="!detail.isChinese" class="zh-annotation">{{ translateCategory(detail.category) }}</span>
                  </span>
                  <span v-if="detail.area" class="meta-tag">
                    {{ detail.area }}
                    <span v-if="!detail.isChinese" class="zh-annotation">{{ translateArea(detail.area) }}</span>
                  </span>
                  <span v-if="detail.difficulty" class="meta-tag">{{ detail.difficulty }}</span>
                  <span v-if="detail.time" class="meta-tag">⏱️ {{ detail.time }} 分钟</span>
                  <span v-for="t in (detail.tags || [])" :key="t" class="meta-tag">#{{ t }}</span>
                </div>
                <button
                  class="btn btn-primary fav-detail-btn"
                  :class="{ 'btn-ghost': favorites.isFavorite(detail.id) }"
                  @click="favorites.toggle(detail)"
                >
                  {{ favorites.isFavorite(detail.id) ? '❤️ 已收藏' : '🤍 收藏' }}
                </button>
              </div>
            </div>

            <div class="detail-body">
              <!-- 简介（中文食谱） -->
              <div v-if="detail.desc" class="detail-section">
                <p class="detail-desc">{{ detail.desc }}</p>
              </div>

              <!-- 食材 -->
              <div class="detail-section">
                <h3 class="detail-h3">🥗 食材清单 ({{ detail.ingredients.length }})</h3>
                <ul class="ingredient-list">
                  <li v-for="(ing, i) in detail.ingredients" :key="i" class="ingredient-item">
                    <span class="ing-name">
                      {{ ing.ingredient }}
                      <span v-if="!detail.isChinese" class="zh-annotation">{{ translateIngredient(ing.ingredient) }}</span>
                    </span>
                    <span class="ing-measure">{{ ing.measure }}</span>
                  </li>
                </ul>
              </div>

              <!-- 做法 -->
              <div class="detail-section">
                <h3 class="detail-h3">👩‍🍳 烹饪步骤</h3>
                <div class="instructions">
                  <div
                    v-for="(step, i) in detail.instructions.split('\n').filter(s => s.trim())"
                    :key="i"
                    class="step"
                  >
                    <div class="step-text">{{ step.trim() }}</div>
                    <div
                      v-if="!detail.isChinese && annotateInstruction(step.trim())[0]?.zh"
                      class="step-zh"
                    >
                      {{ annotateInstruction(step.trim())[0].zh }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 烹饪小贴士（中文食谱） -->
              <div v-if="detail.tips" class="detail-section tips-section">
                <h3 class="detail-h3">💡 烹饪小贴士</h3>
                <p class="tips-text">{{ detail.tips }}</p>
              </div>

              <!-- 视频链接 -->
              <a
                v-if="detail.video"
                :href="detail.video"
                target="_blank"
                rel="noopener"
                class="btn btn-primary video-link"
              >
                ▶️ 在 B 站看教程
              </a>
              <a
                v-else-if="detail.youtube"
                :href="detail.youtube"
                target="_blank"
                rel="noopener"
                class="btn btn-primary video-link"
              >
                ▶️ 观看视频教程 (YouTube)
              </a>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 搜索区 */
.search-section {
  margin-bottom: var(--space-xl);
}

/* 食谱库切换 */
.library-switch {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--glass-border-soft);
}

.lib-btn {
  flex: 1;
  padding: 0.7rem 1rem;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--glass-bg-soft);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition);
}

.lib-btn.active {
  background: rgba(212, 163, 115, 0.15);
  color: var(--text-primary);
  border-color: var(--color-primary);
  box-shadow: 0 0 16px rgba(212, 163, 115, 0.25);
}

.lib-btn:hover:not(.active) {
  background: var(--glass-bg);
  color: var(--text-primary);
}

.mode-tabs {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  flex-wrap: wrap;
}

.mode-tab {
  padding: 0.5rem 1rem;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--glass-border-soft);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition);
}

.mode-tab.active {
  background: var(--glass-bg-active);
  color: var(--text-primary);
  border-color: var(--glass-border);
}

.mode-tab:hover {
  color: var(--text-primary);
}

.search-bar {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.search-input {
  flex: 1;
}

.category-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.chips-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-right: var(--space-xs);
}

.chip {
  padding: 0.3rem 0.8rem;
  font-family: inherit;
  font-size: var(--text-xs);
  color: var(--text-secondary);
  background: var(--glass-bg-soft);
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition);
}

.chip:hover {
  background: var(--glass-bg);
  color: var(--text-primary);
}

.chip.active {
  background: linear-gradient(135deg, var(--color-warm), var(--color-primary));
  color: #fff;
}

/* 食谱卡片 */
.meal-card {
  overflow: hidden;
}

.meal-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.meal-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.meal-card:hover .meal-thumb img {
  transform: scale(1.08);
}

/* 中文食谱 emoji 显示 */
.meal-emoji {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  line-height: 1;
}

/* 详情弹窗 emoji hero */
.detail-emoji-hero {
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7rem;
  line-height: 1;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.detail-desc {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
  padding: var(--space-md) 0;
}

.tips-section {
  background: rgba(212, 163, 115, 0.08);
  border-radius: var(--radius-md);
  padding: var(--space-md) !important;
  border-left: 3px solid var(--color-primary);
}

.tips-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.7;
}

/* 中文注释样式 */
.zh-annotation {
  font-size: 0.8em;
  opacity: 0.65;
  margin-left: 3px;
}

.step-zh {
  margin-top: 4px;
  font-size: var(--text-xs);
  color: var(--color-accent);
  opacity: 0.8;
  line-height: 1.5;
}

.fav-btn {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition);
}

.fav-btn:hover {
  transform: scale(1.15);
  background: rgba(0, 0, 0, 0.5);
}

.meal-info {
  padding: var(--space-md);
}

.meal-name {
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: var(--space-xs);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meal-meta {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.meta-tag {
  font-size: var(--text-xs);
  padding: 0.15rem 0.6rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
}

/* 详情弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(30px) saturate(160%);
  -webkit-backdrop-filter: blur(30px) saturate(160%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition);
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.6);
  transform: rotate(90deg);
}

.detail-hero {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.detail-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--space-lg);
  background: linear-gradient(to top, rgba(245,240,235,0.9), transparent 60%);
}

.detail-name {
  font-size: var(--text-2xl);
  font-weight: 700;
  margin-bottom: var(--space-xs);
}

.detail-tags {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
  margin-bottom: var(--space-sm);
}

.detail-tags .meta-tag {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.fav-detail-btn {
  align-self: flex-start;
}

.detail-body {
  padding: var(--space-lg);
}

.detail-section {
  margin-bottom: var(--space-lg);
}

.detail-h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-xs);
  border-bottom: 1px solid var(--glass-border-soft);
}

.ingredient-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-xs);
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem var(--space-md);
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
}

.ing-name {
  font-weight: 500;
}

.ing-measure {
  color: var(--text-secondary);
}

.instructions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.step {
  padding: var(--space-sm) var(--space-md);
  background: rgba(255, 255, 255, 0.06);
  border-left: 3px solid var(--color-primary);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-size: var(--text-sm);
  line-height: 1.7;
}

.step-text {
  display: inline;
}

.step-zh {
  margin-top: 4px;
  font-size: var(--text-xs);
  color: var(--color-accent-2);
  opacity: 0.9;
  padding: 2px 8px;
  background: rgba(212, 163, 115, 0.1);
  border-radius: var(--radius-sm);
  display: inline-block;
}

/* 美食介绍 */
.cuisine-note {
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.note-text {
  font-size: var(--text-sm);
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
}

.note-text:last-child {
  margin-bottom: 0;
}

.note-text strong {
  color: var(--text-primary);
}

.video-link {
  display: inline-flex;
  text-decoration: none;
  margin-top: var(--space-sm);
}

/* 响应式 */
@media (max-width: 600px) {
  .search-bar {
    flex-direction: column;
  }
  .ingredient-list {
    grid-template-columns: 1fr;
  }
}
</style>
