<script setup>
/**
 * GameView - 嫣落尘渊 · 古风穿越乙女游戏
 * 通过 iframe 嵌入独立的游戏页面
 */
import { ref } from 'vue'

const iframeLoaded = ref(false)
const iframeError = ref(false)

function onIframeLoad() {
  iframeLoaded.value = true
}

function onIframeError() {
  iframeError.value = true
  iframeLoaded.value = true
}

function refreshPage() {
  window.location.reload()
}
</script>

<template>
  <div class="container page game-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">🏯 嫣落尘渊</h1>
      <p class="page-subtitle">古风穿越 · 乙女文字剧情游戏 — 开启一段权谋与情感交织的传奇故事</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="!iframeLoaded" class="loading-state glass-soft">
      <div class="loading-spinner"></div>
      <p class="loading-text">游戏加载中...</p>
    </div>

    <!-- 加载失败 -->
    <div v-if="iframeError" class="error-state glass-soft">
      <p class="error-text">⚠️ 游戏加载失败，请尝试刷新页面</p>
      <button class="btn btn-primary" @click="refreshPage">刷新页面</button>
    </div>

    <!-- 游戏 iframe -->
    <div class="game-frame-wrap" :class="{ loaded: iframeLoaded }">
      <iframe
        src="/yanluochenyuan/index.html"
        class="game-frame"
        :class="{ hidden: iframeError }"
        @load="onIframeLoad"
        @error="onIframeError"
        allowfullscreen
        frameborder="0"
        title="嫣落尘渊"
      ></iframe>
    </div>

    <!-- 游戏说明 -->
    <div class="game-info glass-soft">
      <div class="info-grid">
        <div class="info-item">
          <span class="info-icon">📖</span>
          <span class="info-text">特工穿越成古代庶女，改写命运</span>
        </div>
        <div class="info-item">
          <span class="info-icon">💕</span>
          <span class="info-text">4 位可攻略男主 × 多重结局</span>
        </div>
        <div class="info-item">
          <span class="info-icon">🤖</span>
          <span class="info-text">AI 驱动自由输入对话，剧情无限可能</span>
        </div>
        <div class="info-item">
          <span class="info-icon">💾</span>
          <span class="info-text">6 个存档位，自动保存进度</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-page {
  min-height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: var(--space-lg);
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl);
  margin-bottom: var(--space-lg);
  border-radius: var(--radius-lg);
  min-height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid var(--glass-border);
  border-top-color: var(--color-primary-light);
  animation: spin 0.8s linear infinite;
  margin-bottom: var(--space-md);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-xl);
  margin-bottom: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255,107,107,0.3);
}
.error-text {
  color: #ff6b6b;
  font-size: var(--text-sm);
}

/* 游戏 iframe */
.game-frame-wrap {
  flex: 1;
  min-height: 0;
  margin-bottom: var(--space-lg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.5s ease;
  border: 1px solid var(--glass-border);
}
.game-frame-wrap.loaded {
  opacity: 1;
}

.game-frame {
  width: 100%;
  height: 75vh;
  min-height: 500px;
  display: block;
  background: #141210;
}
.game-frame.hidden {
  display: none;
}

/* 游戏说明 */
.game-info {
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-xl);
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
}
.info-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
.info-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}
.info-text {
  line-height: 1.4;
}

/* 响应式 */
@media (max-width: 768px) {
  .game-frame {
    height: 60vh;
    min-height: 400px;
  }
  .info-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 480px) {
  .game-frame {
    height: 50vh;
    min-height: 300px;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
