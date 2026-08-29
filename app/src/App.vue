<script setup>
/**
 * App - 根组件
 * 动态星空背景 + 初始界面 + 导航栏 + 路由出口 + 页脚
 */
import { ref, computed, watch } from 'vue'
import OceanBackground from '@/components/common/OceanBackground.vue'
import SplashScreen from '@/components/common/SplashScreen.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SpeakerToggle from '@/components/common/SpeakerToggle.vue'
import { useNeteasePlayer } from '@/composables/useNeteasePlayer'

const showSplash = ref(true)
const player = useNeteasePlayer()

/** 进度条点击跳转 */
function onProgressClick(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const ratio = (e.clientX - rect.left) / rect.width
  player.seek(ratio * player.state.duration)
}

/** 进度条点击跳转（全屏播放器） */
function onFullProgressClick(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const ratio = (e.clientX - rect.left) / rect.width
  player.seek(ratio * player.state.duration)
}

/** 歌词区域自动滚动到当前行 */
const lyricListRef = ref(null)
watch(() => player.state.currentLyricIndex, (idx) => {
  if (idx >= 0 && lyricListRef.value) {
    const el = lyricListRef.value.children[idx]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
})

/** 全屏播放器打开时更新歌词索引 + 开启定时器 */
let lyricTimer = null
watch(() => player.state.showPlayer, (show) => {
  if (show) {
    player.updateLyricIndex()
    lyricTimer = setInterval(() => player.updateLyricIndex(), 300)
    document.body.style.overflow = 'hidden'
  } else {
    clearInterval(lyricTimer)
    lyricTimer = null
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <!-- 程序化 WebGPU 海洋背景（全时渲染） -->
  <OceanBackground />

  <SplashScreen v-if="showSplash" @enter="showSplash = false" />

  <template v-if="!showSplash">
    <div class="app-content" :class="{ 'has-mini-player': player.state.currentTrack && !player.state.showPlayer }">
      <AppHeader />
      <main class="app-main">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
      <AppFooter />
    </div>
    <!-- 全局背景音乐控制 -->
    <SpeakerToggle />

    <!-- ========== 全局迷你播放栏 ========== -->
    <Transition name="slide-up">
      <div
        v-if="player.state.currentTrack && !player.state.showPlayer"
        class="mini-player"
        @click="player.togglePlayer()"
      >
        <div class="mini-player-inner" @click.stop>
          <!-- 封面 -->
          <div class="mini-cover" @click="player.togglePlayer()">
            <img
              v-if="player.state.currentTrack.cover"
              :src="player.state.currentTrack.cover + '?param=80y80'"
              :alt="player.state.currentTrack.name"
              class="mini-cover-img"
            />
            <div v-else class="mini-cover-placeholder">🎵</div>
          </div>

          <!-- 歌曲信息 -->
          <div class="mini-info" @click="player.togglePlayer()">
            <p class="mini-title">{{ player.state.currentTrack.name }}</p>
            <p class="mini-artist">{{ player.state.currentTrack.artist }}</p>
          </div>

          <!-- 控制区 -->
          <div class="mini-controls">
            <button class="mini-ctrl-btn" title="上一首" @click="player.playPrev()">⏮</button>
            <button
              class="mini-play-btn"
              :class="{ loading: player.state.loading }"
              :disabled="player.state.loading"
              @click="player.toggle()"
            >
              {{ player.state.loading ? '⏳' : (player.state.isPlaying ? '⏸' : '▶') }}
            </button>
            <button class="mini-ctrl-btn" title="下一首" @click="player.playNext()">⏭</button>
          </div>

          <!-- 进度条 -->
          <div class="mini-progress-wrap">
            <span class="mini-time">{{ player.formatTime(player.state.currentTime) }}</span>
            <div class="mini-progress-bar" @click="onProgressClick">
              <div class="mini-progress-fill" :style="{ width: player.progress.value + '%' }"></div>
              <div class="mini-progress-thumb" :style="{ left: player.progress.value + '%' }"></div>
            </div>
            <span class="mini-time">{{ player.formatTime(player.state.duration) }}</span>
          </div>

          <!-- 音量 -->
          <div class="mini-volume">
            <span class="mini-vol-icon">{{ player.state.volume > 0 ? '🔊' : '🔇' }}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              :value="player.state.volume"
              @input="player.setVolume(parseFloat($event.target.value))"
              @click.stop
              class="mini-vol-slider"
            />
          </div>

          <!-- 错误提示 -->
          <div v-if="player.state.error" class="mini-error">
            ⚠️ {{ player.state.error }}
          </div>
        </div>
      </div>
    </Transition>

    <!-- ========== 全屏播放器（歌词） ========== -->
    <Transition name="fade">
      <div v-if="player.state.showPlayer" class="full-player">
        <!-- 背景模糊封面 -->
        <div
          v-if="player.state.currentTrack?.cover"
          class="full-player-bg"
          :style="{ backgroundImage: `url(${player.state.currentTrack.cover}?param=400y400)` }"
        ></div>
        <div v-else class="full-player-bg full-player-bg-default"></div>

        <div class="full-player-overlay">
          <!-- 关闭按钮 -->
          <button class="full-player-close" @click="player.closePlayer()">✕</button>

          <div class="full-player-content">
            <!-- 左侧：封面 + 歌曲信息 -->
            <div class="full-player-left">
              <div class="full-cover">
                <img
                  v-if="player.state.currentTrack?.cover"
                  :src="player.state.currentTrack.cover + '?param=400y400'"
                  class="full-cover-img"
                  :class="{ spinning: player.state.isPlaying }"
                />
                <div v-else class="full-cover-placeholder">🎵</div>
              </div>
              <div class="full-song-info">
                <h2 class="full-song-name">{{ player.state.currentTrack?.name }}</h2>
                <p class="full-song-artist">{{ player.state.currentTrack?.artist }}</p>
                <p class="full-song-album">{{ player.state.currentTrack?.album }}</p>
              </div>
            </div>

            <!-- 右侧：歌词 -->
            <div class="full-player-right">
              <div v-if="player.state.lyrics.length > 0" ref="lyricListRef" class="lyric-list">
                <p
                  v-for="(line, idx) in player.state.lyrics"
                  :key="idx"
                  class="lyric-line"
                  :class="{
                    active: idx === player.state.currentLyricIndex,
                    past: idx < player.state.currentLyricIndex
                  }"
                >
                  {{ line.text }}
                </p>
              </div>
              <div v-else class="lyric-empty">
                <p>暂无歌词</p>
              </div>
            </div>
          </div>

          <!-- 底部控制栏 -->
          <div class="full-player-controls">
            <!-- 进度条 -->
            <div class="full-progress-wrap">
              <span class="full-time">{{ player.formatTime(player.state.currentTime) }}</span>
              <div class="full-progress-bar" @click="onFullProgressClick">
                <div class="full-progress-fill" :style="{ width: player.progress.value + '%' }"></div>
                <div class="full-progress-thumb" :style="{ left: player.progress.value + '%' }"></div>
              </div>
              <span class="full-time">{{ player.formatTime(player.state.duration) }}</span>
            </div>

            <!-- 控制按钮 -->
            <div class="full-controls">
              <button class="full-ctrl-btn" @click="player.playPrev()">⏮</button>
              <button
                class="full-play-btn"
                :disabled="player.state.loading"
                @click="player.toggle()"
              >
                {{ player.state.loading ? '⏳' : (player.state.isPlaying ? '⏸' : '▶') }}
              </button>
              <button class="full-ctrl-btn" @click="player.playNext()">⏭</button>
            </div>

            <!-- 音量 -->
            <div class="full-volume">
              <span>{{ player.state.volume > 0 ? '🔊' : '🔇' }}</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                :value="player.state.volume"
                @input="player.setVolume(parseFloat($event.target.value))"
                class="full-vol-slider"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </template>
</template>

<style scoped>
.app-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-content.has-mini-player {
  padding-bottom: 72px;
}

.app-main {
  flex: 1;
}

/* ===== 全局迷你播放栏 ===== */
.mini-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid var(--glass-border);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.08);
  padding: 8px 24px;
  cursor: default;
}

.mini-player-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 14px;
}

.mini-cover {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--glass-bg-soft);
  cursor: pointer;
}

.mini-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mini-cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.mini-info {
  min-width: 100px;
  max-width: 160px;
  flex-shrink: 0;
  cursor: pointer;
}

.mini-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mini-artist {
  font-size: 0.72rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mini-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.mini-ctrl-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--text-secondary);
}

.mini-ctrl-btn:hover {
  background: var(--glass-bg-soft);
  color: var(--text-primary);
}

.mini-play-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-warm));
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s;
  color: #fff;
  box-shadow: 0 4px 12px rgba(212, 163, 115, 0.4);
}

.mini-play-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 16px rgba(212, 163, 115, 0.5);
}

.mini-play-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.mini-play-btn.loading {
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

.mini-progress-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.mini-time {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  width: 36px;
  text-align: center;
}

.mini-progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(140, 150, 220, 0.15);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  transition: height 0.15s;
}

.mini-progress-bar:hover {
  height: 6px;
}

.mini-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-warm));
  border-radius: 2px;
  transition: width 0.1s linear;
}

.mini-progress-thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.15s;
}

.mini-progress-bar:hover .mini-progress-thumb {
  opacity: 1;
}

.mini-volume {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.mini-vol-icon {
  font-size: 0.9rem;
}

.mini-vol-slider {
  width: 80px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(140, 150, 220, 0.15);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.mini-vol-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.mini-error {
  font-size: 0.72rem;
  color: #c0392b;
  padding: 2px 8px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 6px;
  flex-shrink: 0;
}

/* 迷你播放栏动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* ===== 全屏播放器 ===== */
.full-player {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.full-player-bg {
  position: absolute;
  inset: -40px;
  background-size: cover;
  background-position: center;
  filter: blur(40px) brightness(0.5);
  transform: scale(1.2);
}

.full-player-bg-default {
  background: linear-gradient(135deg, #2d2a26, #3a3228);
}

.full-player-overlay {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  padding: 32px 48px;
}

.full-player-close {
  position: absolute;
  top: 20px;
  right: 28px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.full-player-close:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
}

.full-player-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 64px;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
}

/* 左侧封面 */
.full-player-left {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.full-cover {
  width: 320px;
  height: 320px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.full-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.full-cover-img.spinning {
  animation: spin 20s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.full-cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  background: rgba(255, 255, 255, 0.08);
}

.full-song-info {
  text-align: center;
  max-width: 320px;
}

.full-song-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}

.full-song-artist {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
}

.full-song-album {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.5);
}

/* 右侧歌词 */
.full-player-right {
  flex: 1;
  min-width: 0;
  height: 420px;
  overflow: hidden;
  mask-image: linear-gradient(transparent 0%, black 15%, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(transparent 0%, black 15%, black 85%, transparent 100%);
}

.lyric-list {
  height: 100%;
  overflow-y: auto;
  padding: 160px 0;
  scrollbar-width: none;
}

.lyric-list::-webkit-scrollbar {
  display: none;
}

.lyric-line {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 2.2;
  transition: all 0.4s ease;
  padding: 0 8px;
}

.lyric-line.active {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 0 20px rgba(212, 163, 115, 0.5);
}

.lyric-line.past {
  color: rgba(255, 255, 255, 0.3);
}

.lyric-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1rem;
}

/* 底部控制栏 */
.full-player-controls {
  flex-shrink: 0;
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
  padding-bottom: 16px;
}

.full-progress-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.full-time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  font-variant-numeric: tabular-nums;
  width: 40px;
  text-align: center;
}

.full-progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  transition: height 0.15s;
}

.full-progress-bar:hover {
  height: 6px;
}

.full-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-warm));
  border-radius: 2px;
}

.full-progress-thumb {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.15s;
}

.full-progress-bar:hover .full-progress-thumb {
  opacity: 1;
}

.full-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.full-ctrl-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  color: rgba(255, 255, 255, 0.7);
}

.full-ctrl-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.full-play-btn {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-warm));
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  color: #fff;
  box-shadow: 0 8px 24px rgba(212, 163, 115, 0.5);
}

.full-play-btn:hover {
  transform: scale(1.06);
  box-shadow: 0 12px 32px rgba(212, 163, 115, 0.6);
}

.full-play-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.full-volume {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.full-vol-slider {
  width: 120px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.full-vol-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* 全屏播放器动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .mini-player {
    padding: 6px 12px;
  }
  .mini-volume {
    display: none;
  }
  .mini-progress-wrap {
    min-width: 80px;
  }
  .full-player-content {
    flex-direction: column;
    gap: 24px;
  }
  .full-cover {
    width: 200px;
    height: 200px;
  }
  .full-player-right {
    height: 200px;
  }
  .full-player-overlay {
    padding: 20px 24px;
  }
}
</style>
