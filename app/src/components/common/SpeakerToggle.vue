<script setup>
/**
 * SpeakerToggle - 全局背景音乐控制按钮
 * 小喇叭图标，点击切换播放/暂停
 * 固定在页面右下角
 */
import { onMounted, onUnmounted } from 'vue'
import { useBackgroundMusic } from '@/composables/useBackgroundMusic'

const bgm = useBackgroundMusic()

onMounted(() => {
  // 页面加载后初始化背景音乐（自动根据路由播放）
  bgm.init()
})
</script>

<template>
  <button
    class="speaker-toggle"
    :class="{ playing: bgm.isPlaying.value }"
    @click="bgm.toggle()"
    :aria-label="bgm.isPlaying.value ? '暂停背景音乐' : '播放背景音乐'"
    :title="bgm.isPlaying.value ? '点击暂停背景音乐' : '点击播放背景音乐'"
  >
    <!-- 喇叭图标：播放状态用 🔊，暂停用 🔇 -->
    <span class="speaker-icon">
      {{ bgm.isPlaying.value ? '🔊' : '🔇' }}
    </span>
    <!-- 播放时显示声波动画 -->
    <span v-if="bgm.isPlaying.value" class="sound-waves">
      <span class="wave wave-1"></span>
      <span class="wave wave-2"></span>
      <span class="wave wave-3"></span>
    </span>
  </button>
</template>

<style scoped>
.speaker-toggle {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 52px;
  height: 52px;
  background: var(--glass-bg-strong);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all var(--transition);
  padding: 0;
}

.speaker-toggle:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg), var(--glow-primary);
  background: rgba(255, 255, 255, 0.85);
}

.speaker-toggle:active {
  transform: scale(0.95);
}

.speaker-toggle.playing {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md), 0 0 16px rgba(212, 163, 115, 0.25);
}

.speaker-icon {
  font-size: 1.4rem;
  line-height: 1;
  transition: transform var(--transition);
}

.speaker-toggle.playing .speaker-icon {
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.12); }
}

/* 声波动画 */
.sound-waves {
  display: flex;
  align-items: center;
  gap: 2px;
  position: absolute;
  bottom: 6px;
  right: 8px;
}

.wave {
  display: block;
  width: 3px;
  background: var(--color-primary);
  border-radius: 2px;
  animation: waveAnim 1s ease-in-out infinite;
}

.wave-1 {
  height: 8px;
  animation-delay: 0s;
}

.wave-2 {
  height: 12px;
  animation-delay: 0.15s;
}

.wave-3 {
  height: 6px;
  animation-delay: 0.3s;
}

@keyframes waveAnim {
  0%, 100% { opacity: 0.4; transform: scaleY(0.6); }
  50% { opacity: 1; transform: scaleY(1); }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .speaker-toggle {
    bottom: 20px;
    right: 20px;
    width: 46px;
    height: 46px;
  }

  .speaker-icon {
    font-size: 1.2rem;
  }
}
</style>
