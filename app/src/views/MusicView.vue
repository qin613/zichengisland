<script setup>
/**
 * MusicView - 白噪音/环境音播放器
 * 功能：场景预设一键播放、独立音源混音、主音量控制、专注计时器联动
 */
import { ref, reactive, onUnmounted } from 'vue'
import GlassCard from '@/components/common/GlassCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useAudioMixer } from '@/composables/useAudioMixer'
import { SOUNDS, SCENES } from '@/data/sounds'

const mixer = useAudioMixer()

// 每个音源的音量（独立）
const volumes = reactive({})
SOUNDS.forEach((s) => (volumes[s.id] = 0.5))

function toggleSound(sound) {
  mixer.toggle(sound.id, sound, volumes[s.id])
  mixer.refreshPlayingCount()
  // 清除错误状态以便重试
  if (mixer.hasError(sound.id)) {
    // 重新点击会触发新的加载尝试
  }
}

function onVolumeChange(sound) {
  mixer.setVolume(sound.id, volumes[s.id])
}

function onMasterChange() {
  mixer.setMasterVolume(mixer.masterVolume.value)
}

/** 应用场景预设 */
function applyScene(scene) {
  // 先停止全部
  mixer.stopAll()
  // 再按预设启动
  scene.sounds.forEach(({ id, volume }) => {
    const config = SOUNDS.find((s) => s.id === id)
    if (config) {
      volumes[id] = volume
      mixer.toggle(id, config, volume)
    }
  })
  mixer.refreshPlayingCount()
  activeScene.value = scene.id
}

const activeScene = ref('')

function stopAll() {
  mixer.stopAll()
  mixer.refreshPlayingCount()
  activeScene.value = ''
}

/* ===== 专注计时器（与白噪音联动）===== */
const timerMinutes = ref(25)
const timerSecondsLeft = ref(0)
const timerRunning = ref(false)
let timerInterval = null

function startTimer() {
  if (timerRunning.value) return
  timerSecondsLeft.value = timerMinutes.value * 60
  timerRunning.value = true
  timerInterval = setInterval(() => {
    timerSecondsLeft.value--
    if (timerSecondsLeft.value <= 0) {
      stopTimer()
      // 计时结束停止所有声音
      mixer.stopAll()
      mixer.refreshPlayingCount()
      // 提示音（用 oscillator 生成）
      try {
        const ac = new (window.AudioContext || window.webkitAudioContext)()
        const osc = ac.createOscillator()
        const g = ac.createGain()
        osc.connect(g)
        g.connect(ac.destination)
        osc.frequency.value = 880
        g.gain.value = 0.3
        osc.start()
        setTimeout(() => {
          osc.frequency.value = 660
        }, 200)
        setTimeout(() => {
          osc.stop()
          ac.close()
        }, 600)
      } catch {}
    }
  }, 1000)
}

function stopTimer() {
  timerRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const timerDisplay = computedTimerDisplay()

function computedTimerDisplay() {
  return () => {
    const total = timerRunning.value
      ? timerSecondsLeft.value
      : timerMinutes.value * 60
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
}

// 预设时长
const timerPresets = [15, 25, 45, 60]

onUnmounted(() => {
  mixer.stopAll()
  stopTimer()
})
</script>

<template>
  <div class="container page">
    <!-- 页头 -->
    <div class="page-header">
      <h1 class="page-title">🎵 白噪音播放器</h1>
      <p class="page-subtitle">营造专注、放松或助眠的氛围</p>
    </div>

    <!-- 顶部控制条 -->
    <GlassCard variant="strong" padding="md" class="control-bar">
      <div class="control-info">
        <div class="control-icon" :class="{ playing: mixer.playingCount.value > 0 }">
          {{ mixer.playingCount.value > 0 ? '🔊' : '🔈' }}
        </div>
        <div>
          <p class="control-text">
            {{ mixer.playingCount.value > 0 ? `正在播放 ${mixer.playingCount.value} 个音源` : '当前静音' }}
          </p>
          <p class="control-hint">点击下方音源卡片开始混音</p>
        </div>
      </div>
      <div class="control-actions">
        <div class="master-volume">
          <span class="vol-icon">🔉</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            v-model.number="mixer.masterVolume.value"
            @input="onMasterChange"
            class="master-slider"
          />
          <span class="vol-icon">🔊</span>
          <span class="vol-num">{{ Math.round(mixer.masterVolume.value * 100) }}%</span>
        </div>
        <button
          v-if="mixer.playingCount.value > 0"
          class="btn btn-ghost"
          @click="stopAll"
        >
          ⏹ 全部停止
        </button>
      </div>
    </GlassCard>

    <!-- 场景预设 -->
    <section class="section">
      <h2 class="section-title">🎬 一键场景</h2>
      <div class="grid grid-4">
        <GlassCard
          v-for="sc in SCENES"
          :key="sc.id"
          padding="lg"
          hover
          clickable
          class="scene-card"
          :class="{ active: activeScene === sc.id }"
          @click="applyScene(sc)"
        >
          <div class="scene-icon">{{ sc.icon }}</div>
          <h3 class="scene-name">{{ sc.name }}</h3>
          <p class="scene-desc">{{ sc.desc }}</p>
        </GlassCard>
      </div>
    </section>

    <!-- 音源混音台 -->
    <section class="section">
      <h2 class="section-title">🎚️ 音源混音台</h2>
      <div class="grid grid-3">
        <GlassCard
          v-for="sound in SOUNDS"
          :key="sound.id"
          padding="lg"
          class="sound-card"
          :class="{ active: mixer.isPlaying(sound.id) }"
        >
          <div
            class="sound-head"
            @click="toggleSound(sound)"
          >
            <div
              class="sound-icon"
              :style="{ background: sound.color + '33', borderColor: sound.color }"
              :class="{ playing: mixer.isPlaying(sound.id) }"
            >
              {{ sound.icon }}
            </div>
            <div class="sound-info">
              <h3 class="sound-name">{{ sound.name }}</h3>
              <p class="sound-desc">{{ sound.desc }}</p>
              <p v-if="mixer.hasError(sound.id)" class="sound-error">
                ⚠️ 音频文件缺失
              </p>
            </div>
          </div>

          <div class="sound-volume">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              v-model.number="volumes[sound.id]"
              @input="onVolumeChange(sound)"
              class="vol-slider"
            />
          </div>

          <button
            class="sound-toggle"
            :class="{ active: mixer.isPlaying(sound.id) }"
            @click="toggleSound(sound)"
          >
            {{ mixer.isPlaying(sound.id) ? '⏸ 播放中' : '▶ 播放' }}
          </button>
        </GlassCard>
      </div>
    </section>

    <!-- 专注计时器 -->
    <section class="section">
      <h2 class="section-title">⏲️ 专注计时器</h2>
      <GlassCard variant="strong" padding="lg" class="timer-card">
        <div class="timer-display">{{ timerDisplay() }}</div>

        <div v-if="!timerRunning" class="timer-presets">
          <button
            v-for="m in timerPresets"
            :key="m"
            class="preset-btn"
            :class="{ active: timerMinutes === m }"
            @click="timerMinutes = m"
          >
            {{ m }} 分钟
          </button>
        </div>

        <div v-else class="timer-progress-hint">
          ⏳ 专注中... 结束后自动停止播放
        </div>

        <div class="timer-actions">
          <button
            v-if="!timerRunning"
            class="btn btn-primary"
            @click="startTimer"
          >
            ▶ 开始专注
          </button>
          <button v-else class="btn btn-ghost" @click="stopTimer">
            ⏹ 结束
          </button>
        </div>
      </GlassCard>
    </section>

    <!-- 说明 -->
    <GlassCard padding="lg" class="tip-card">
      <p class="tip-text">
        💡 <strong>提示：</strong>白噪音/粉噪音/棕噪音由浏览器实时合成，无需任何文件即可播放。
        雨声、海浪等自然音效需在 <code>public/sounds/</code> 目录放入对应的 mp3 文件
        （可从 mixkit.co 等免版权站点下载）。多个音源可同时播放并自由调节各自音量，打造专属氛围。
      </p>
    </GlassCard>
  </div>
</template>

<style scoped>
/* 控制条 */
.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

.control-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.control-icon {
  font-size: 2rem;
  transition: transform var(--transition);
}

.control-icon.playing {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.control-text {
  font-weight: 600;
}

.control-hint {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.control-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.master-volume {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.vol-icon {
  font-size: 1rem;
}

.vol-num {
  font-size: var(--text-sm);
  font-weight: 600;
  min-width: 40px;
}

.master-slider {
  width: 140px;
}

/* 区块标题 */
.section {
  margin-bottom: var(--space-xl);
}

.section-title {
  font-size: var(--text-xl);
  font-weight: 700;
  margin-bottom: var(--space-md);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 场景卡片 */
.scene-card {
  text-align: center;
}

.scene-card.active {
  background: rgba(212, 163, 115, 0.28);
  box-shadow: var(--shadow-lg);
}

.scene-icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-sm);
}

.scene-name {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.scene-desc {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

/* 音源卡片 */
.sound-card {
  transition: all var(--transition);
}

.sound-card.active {
  background: var(--glass-bg-active);
  box-shadow: var(--shadow-lg), 0 0 24px rgba(212, 163, 115, 0.2);
}

.sound-head {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
  cursor: pointer;
}

.sound-icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  transition: all var(--transition);
}

.sound-icon.playing {
  animation: bounce 1.2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.sound-name {
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: 2px;
}

.sound-desc {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  line-height: 1.4;
}

.sound-error {
  font-size: var(--text-xs);
  color: #ffb3b3;
  margin-top: 4px;
}

.sound-volume {
  margin-bottom: var(--space-sm);
}

/* 范围滑块通用样式 */
.vol-slider,
.master-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: rgba(140, 150, 220, 0.2);
  border-radius: var(--radius-full);
  outline: none;
  cursor: pointer;
}

.vol-slider::-webkit-slider-thumb,
.master-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: transform var(--transition-fast);
}

.vol-slider::-webkit-slider-thumb:hover,
.master-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.vol-slider::-moz-range-thumb,
.master-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.sound-toggle {
  width: 100%;
  padding: 0.5rem;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--glass-bg-soft);
  border: 1px solid var(--glass-border-soft);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition);
}

.sound-toggle.active {
  background: linear-gradient(135deg, var(--color-primary), var(--color-warm));
  color: #fff;
  border-color: transparent;
}

/* 计时器 */
.timer-card {
  text-align: center;
}

.timer-display {
  font-size: 4rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-md);
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.timer-presets {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  flex-wrap: wrap;
}

.preset-btn {
  padding: 0.4rem 1rem;
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  background: var(--glass-bg-soft);
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition);
}

.preset-btn.active {
  background: var(--glass-bg-active);
  color: var(--text-primary);
  border-color: var(--glass-border);
}

.timer-progress-hint {
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
  font-size: var(--text-sm);
}

.timer-actions {
  display: flex;
  justify-content: center;
}

/* 提示卡 */
.tip-card {
  margin-top: var(--space-xl);
}

.tip-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.7;
}

.tip-text code {
  padding: 0.1rem 0.4rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  font-size: 0.85em;
}

/* 响应式 */
@media (max-width: 600px) {
  .timer-display {
    font-size: 3rem;
  }
  .control-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .master-slider {
    width: 100px;
  }
}
</style>
