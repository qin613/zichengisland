<script setup>
/**
 * VideoPlayerModal - 视频播放弹窗
 * 全屏遮罩 + 居中 iframe 视频播放器
 */
defineOptions({ name: 'VideoPlayerModal' })

defineProps({
  show: { type: Boolean, default: false },
  videoUrl: { type: String, default: '' },
  title: { type: String, default: '' }
})

const emit = defineEmits(['close'])

function onClose() {
  emit('close')
}

function onOverlayClick(e) {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="vp-fade">
      <div v-if="show" class="vp-overlay" @click="onOverlayClick">
        <div class="vp-container">
          <div class="vp-header">
            <span class="vp-title">{{ title }}</span>
            <button class="vp-close" @click="onClose">✕</button>
          </div>
          <div class="vp-player">
            <iframe
              v-if="videoUrl"
              :src="videoUrl"
              class="vp-iframe"
              frameborder="0"
              allowfullscreen
              allow="autoplay; encrypted-media"
            />
            <div v-else class="vp-empty">
              <span>暂无视频链接</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.vp-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
}

.vp-container {
  width: 100%;
  max-width: 900px;
  background: #0a0e27;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 0 60px rgba(212, 163, 115, 0.2);
}

.vp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid var(--glass-border-soft);
}

.vp-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: var(--space-md);
}

.vp-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition);
  flex-shrink: 0;
}

.vp-close:hover {
  background: rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
}

.vp-player {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  background: #000;
}

.vp-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.vp-empty {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

/* 过渡动画 */
.vp-fade-enter-active,
.vp-fade-leave-active {
  transition: opacity 0.3s ease;
}

.vp-fade-enter-from,
.vp-fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .vp-overlay {
    padding: 0;
  }
  .vp-container {
    border-radius: 0;
    max-width: none;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .vp-player {
    flex: 1;
    padding-top: 0;
  }
}
</style>
