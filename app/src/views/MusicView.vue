<script setup>
/**
 * MusicView - 白噪音/环境音播放器
 * 功能：场景预设一键播放、独立音源混音、主音量控制、专注计时器联动
 */
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import GlassCard from '@/components/common/GlassCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useAudioMixer } from '@/composables/useAudioMixer'
import { SOUNDS, SCENES } from '@/data/sounds'
import { searchSongs, getPersonalized, getTopSongs, getPlaylistDetail, getUserPlaylist, getLikelist, getSongDetail } from '@/api/netease'
import { useNeteasePlayer } from '@/composables/useNeteasePlayer'

const mixer = useAudioMixer()
const player = useNeteasePlayer()

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

/* ===== Tab 切换 ===== */
const activeTab = ref('whitenoise') // 'whitenoise' | 'online'

/* ===== 在线音乐：搜索 ===== */
const searchKeywords = ref('')
const searchResults = ref([])
const searching = ref(false)
const searched = ref(false)

/* ===== 推荐音乐 ===== */
const recommendPlaylists = ref([])
const topSongs = ref([])
const recommendLoading = ref(false)

/** 加载推荐内容 */
async function loadRecommendations() {
  if (recommendPlaylists.value.length > 0 || recommendLoading.value) return
  recommendLoading.value = true
  try {
    const [plRes, topRes] = await Promise.all([
      getPersonalized(6),
      getTopSongs(0)
    ])
    if (plRes.code === 200) recommendPlaylists.value = plRes.result || []
    if (topRes.code === 200) topSongs.value = (topRes.data || []).slice(0, 15)
  } catch (e) {
    console.error('[netease] 加载推荐失败:', e)
  } finally {
    recommendLoading.value = false
  }
}

/** 加载我喜欢的音乐 → 填充到搜索结果区 */
async function loadMyFavorites() {
  searching.value = true
  searched.value = true
  searchKeywords.value = '我喜欢的音乐'
  try {
    // 1. 获取喜欢的歌曲 ID 列表
    const likeRes = await getLikelist(1740887345)
    if (likeRes.code !== 200) throw new Error('获取喜欢列表失败')
    const ids = likeRes.ids || []
    if (ids.length === 0) {
      searchResults.value = []
      return
    }
    // 2. 获取歌曲详情（取前 100 首，避免请求过大）
    const batch = ids.slice(0, 100)
    const detailRes = await getSongDetail(batch.join(','))
    if (detailRes.code === 200) {
      const tracks = (detailRes.songs || []).map(t => ({
        id: t.id,
        name: t.name,
        artists: t.ar || [],
        album: t.al || {},
        duration: t.dt || 0
      }))
      searchResults.value = tracks
      player.setPlaylist(tracks)
    }
  } catch (e) {
    console.error('[netease] 加载喜欢失败:', e)
  } finally {
    searching.value = false
  }
}

/** 播放推荐歌曲（新歌速递） */
async function playTopSong(song, index) {
  // 新歌速递的格式和搜索结果略有不同，需要转换
  const normalized = {
    id: song.id,
    name: song.name,
    artists: song.artists || song.ar || [],
    album: song.album || song.al || {},
    duration: song.duration || song.dt || 0
  }
  await player.play(normalized, index)
}

/** 加载歌单详情 → 填充到搜索结果区 */
async function loadPlaylist(playlist) {
  searching.value = true
  searched.value = true
  searchKeywords.value = playlist.name
  try {
    const res = await getPlaylistDetail(playlist.id)
    if (res.code === 200) {
      const tracks = (res.playlist?.tracks || []).map(t => ({
        id: t.id,
        name: t.name,
        artists: t.ar || t.artists || [],
        album: t.al || t.album || {},
        duration: t.dt || t.duration || 0
      }))
      searchResults.value = tracks
      player.setPlaylist(tracks)
    }
  } catch (e) {
    console.error('[netease] 加载歌单失败:', e)
  } finally {
    searching.value = false
  }
}

/** 返回推荐页面 */
function backToRecommend() {
  searched.value = false
  searchResults.value = []
  searchKeywords.value = ''
}

async function handleSearch() {
  const kw = searchKeywords.value.trim()
  if (!kw) return
  searching.value = true
  searched.value = false
  try {
    const res = await searchSongs(kw, 20)
    if (res.code === 200) {
      searchResults.value = res.result?.songs || []
      player.setPlaylist(searchResults.value)
    } else {
      searchResults.value = []
    }
  } catch (e) {
    searchResults.value = []
    console.error('[netease] 搜索失败:', e)
  } finally {
    searching.value = false
    searched.value = true
  }
}

/** 格式化歌曲时长 mm:ss */
function fmtDuration(ms) {
  if (!ms) return '--:--'
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** 播放搜索结果中的某首歌 */
async function playSong(song, index) {
  await player.play(song, index)
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

// 进入页面时加载推荐
onMounted(() => {
  loadRecommendations()
})

onUnmounted(() => {
  mixer.stopAll()
  stopTimer()
})
</script>

<template>
  <div class="container page">
    <!-- 页头 -->
    <div class="page-header">
      <h1 class="page-title">🎵 音乐中心</h1>
      <p class="page-subtitle">白噪音 · 环境音 · 在线音乐</p>
    </div>

    <!-- Tab 栏 -->
    <div class="music-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'whitenoise' }"
        @click="activeTab = 'whitenoise'"
      >
        🎵 白噪音
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'online' }"
        @click="activeTab = 'online'"
      >
        🎧 在线音乐
      </button>
    </div>

    <!-- ========== 白噪音 Tab ========== -->
    <div v-show="activeTab === 'whitenoise'">
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

    <!-- ========== 在线音乐 Tab ========== -->
    <div v-show="activeTab === 'online'" class="online-music">
      <!-- 搜索栏 -->
      <GlassCard variant="strong" padding="md" class="search-bar">
        <div class="search-input-wrap">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchKeywords"
            type="text"
            class="search-input"
            placeholder="搜索歌曲、歌手..."
            @keyup.enter="handleSearch"
          />
          <button
            class="btn btn-primary search-btn"
            :disabled="searching || !searchKeywords.trim()"
            @click="handleSearch"
          >
            {{ searching ? '搜索中...' : '搜索' }}
          </button>
        </div>
      </GlassCard>

      <!-- 搜索结果 -->
      <div v-if="searching" class="search-status">
        <LoadingSpinner />
        <p>正在搜索...</p>
      </div>

      <div v-else-if="searched && searchResults.length === 0" class="search-status">
        <p class="empty-text">😔 没有找到相关歌曲</p>
      </div>

      <div v-else-if="searchResults.length > 0" class="song-list">
        <div class="song-list-toolbar">
          <button class="back-btn" @click="backToRecommend">← 返回推荐</button>
          <span class="song-list-count">共 {{ searchResults.length }} 首</span>
        </div>
        <div class="song-list-header">
          <span class="col-idx">#</span>
          <span class="col-title">歌曲</span>
          <span class="col-artist">歌手</span>
          <span class="col-album">专辑</span>
          <span class="col-dur">时长</span>
        </div>
        <div
          v-for="(song, index) in searchResults"
          :key="song.id"
          class="song-row"
          :class="{
            active: player.state.currentTrack?.id === song.id,
            playing: player.state.currentTrack?.id === song.id && player.state.isPlaying
          }"
          @dblclick="playSong(song, index)"
        >
          <span class="col-idx">
            <span v-if="player.state.currentTrack?.id === song.id && player.state.isPlaying" class="playing-indicator">
              <span></span><span></span><span></span>
            </span>
            <span v-else>{{ index + 1 }}</span>
          </span>
          <span class="col-title" :title="song.name">
            <span class="song-name">{{ song.name }}</span>
          </span>
          <span class="col-artist" :title="(song.artists || []).map(a => a.name).join(', ')">
            {{ (song.artists || []).map(a => a.name).join(', ') }}
          </span>
          <span class="col-album" :title="(song.album || {}).name">
            {{ (song.album || {}).name || '--' }}
          </span>
          <span class="col-dur">{{ fmtDuration(song.duration) }}</span>
          <button
            class="play-btn"
            :title="player.state.currentTrack?.id === song.id && player.state.isPlaying ? '暂停' : '播放'"
            @click="player.state.currentTrack?.id === song.id ? player.toggle() : playSong(song, index)"
          >
            {{ player.state.currentTrack?.id === song.id && player.state.isPlaying ? '⏸' : '▶' }}
          </button>
        </div>
      </div>

      <!-- 推荐内容（未搜索时显示） -->
      <div v-else class="recommend-section">
        <div v-if="recommendLoading" class="search-status">
          <LoadingSpinner />
          <p>加载推荐中...</p>
        </div>

        <template v-else>
          <!-- 我喜欢的音乐 -->
          <section class="section">
            <GlassCard
              padding="lg"
              hover
              clickable
              class="favorites-card"
              @click="loadMyFavorites"
            >
              <div class="favorites-content">
                <div class="favorites-icon">❤️</div>
                <div class="favorites-info">
                  <h3 class="favorites-title">我喜欢的音乐</h3>
                  <p class="favorites-desc">你收藏的所有歌曲</p>
                </div>
                <span class="favorites-arrow">→</span>
              </div>
            </GlassCard>
          </section>

          <!-- 推荐歌单 -->
          <section v-if="recommendPlaylists.length > 0" class="section">
            <h2 class="section-title">📀 推荐歌单</h2>
            <div class="grid grid-3">
              <GlassCard
                v-for="pl in recommendPlaylists"
                :key="pl.id"
                padding="none"
                hover
                clickable
                class="playlist-card"
                @click="loadPlaylist(pl)"
              >
                <div class="playlist-cover">
                  <img
                    :src="pl.picUrl + '?param=300y300'"
                    :alt="pl.name"
                    class="playlist-cover-img"
                    loading="lazy"
                  />
                  <div class="playlist-play-count">
                    ▶ {{ pl.playCount >= 10000 ? (pl.playCount / 10000).toFixed(0) + '万' : pl.playCount }}
                  </div>
                </div>
                <div class="playlist-info">
                  <p class="playlist-name">{{ pl.name }}</p>
                </div>
              </GlassCard>
            </div>
          </section>

          <!-- 新歌速递 -->
          <section v-if="topSongs.length > 0" class="section">
            <h2 class="section-title">🔥 新歌速递</h2>
            <div class="top-songs-list">
              <div
                v-for="(song, index) in topSongs"
                :key="song.id"
                class="top-song-row"
                :class="{ active: player.state.currentTrack?.id === song.id }"
                @dblclick="playTopSong(song, index)"
              >
                <span class="top-song-idx">
                  <span v-if="player.state.currentTrack?.id === song.id && player.state.isPlaying" class="playing-indicator">
                    <span></span><span></span><span></span>
                  </span>
                  <span v-else>{{ index + 1 }}</span>
                </span>
                <img
                  v-if="song.album?.picUrl || song.al?.picUrl"
                  :src="(song.album?.picUrl || song.al?.picUrl) + '?param=60y60'"
                  class="top-song-cover"
                  loading="lazy"
                />
                <div class="top-song-info">
                  <p class="top-song-name">{{ song.name }}</p>
                  <p class="top-song-artist">{{ (song.artists || song.ar || []).map(a => a.name).join(', ') }}</p>
                </div>
                <span class="top-song-album">{{ (song.album || song.al || {}).name || '' }}</span>
                <button
                  class="play-btn"
                  @click="player.state.currentTrack?.id === song.id ? player.toggle() : playTopSong(song, index)"
                >
                  {{ player.state.currentTrack?.id === song.id && player.state.isPlaying ? '⏸' : '▶' }}
                </button>
              </div>
            </div>
          </section>

          <!-- 兜底提示 -->
          <div v-if="recommendPlaylists.length === 0 && topSongs.length === 0 && !recommendLoading" class="search-status">
            <p class="init-text">🎧 搜索你想听的歌曲</p>
            <p class="init-hint">支持歌名、歌手名、专辑名搜索</p>
          </div>
        </template>
      </div>
    </div>
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

/* ===== Tab 栏 ===== */
.music-tabs {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
  background: var(--glass-bg-soft);
  border-radius: var(--radius-full);
  padding: 4px;
  width: fit-content;
}

.tab-btn {
  padding: 0.5rem 1.5rem;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition);
}

.tab-btn.active {
  background: linear-gradient(135deg, var(--color-primary), var(--color-warm));
  color: #fff;
  box-shadow: 0 4px 12px rgba(212, 163, 115, 0.35);
}

.tab-btn:hover:not(.active) {
  color: var(--text-primary);
  background: var(--glass-bg);
}

/* ===== 在线音乐 ===== */
.online-music {
  min-height: 400px;
}

.search-bar {
  margin-bottom: var(--space-lg);
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.search-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  padding: 0.7rem 1rem;
  font-family: inherit;
  font-size: var(--text-base);
  color: var(--text-primary);
  background: var(--glass-bg-soft);
  border: 1px solid var(--glass-border-soft);
  border-radius: var(--radius-full);
  outline: none;
  transition: all var(--transition);
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(212, 163, 115, 0.15);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-btn {
  flex-shrink: 0;
  padding: 0.7rem 1.5rem;
  border-radius: var(--radius-full);
}

.search-status {
  text-align: center;
  padding: var(--space-2xl) var(--space-lg);
  color: var(--text-secondary);
}

.empty-text {
  font-size: var(--text-lg);
  margin-bottom: var(--space-sm);
}

.init-text {
  font-size: var(--text-2xl);
  margin-bottom: var(--space-sm);
  color: var(--text-primary);
}

.init-hint {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

/* ===== 歌曲列表 ===== */
.song-list {
  margin-bottom: var(--space-xl);
}

.song-list-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
}

.back-btn {
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--color-primary);
  background: transparent;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-full);
  padding: 4px 14px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.back-btn:hover {
  background: var(--color-primary);
  color: #fff;
}

.song-list-count {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.song-list-header {
  display: flex;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--glass-border-soft);
}

.song-row {
  display: flex;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.song-row:hover {
  background: var(--glass-bg);
}

.song-row.active {
  background: rgba(212, 163, 115, 0.12);
}

.song-row.playing .song-name {
  color: var(--color-primary);
  font-weight: 600;
}

.col-idx {
  width: 40px;
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-muted);
  flex-shrink: 0;
}

.col-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: var(--space-sm);
}

.song-name {
  font-weight: 500;
  color: var(--text-primary);
}

.col-artist {
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  flex-shrink: 0;
  padding-right: var(--space-sm);
}

.col-album {
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  flex-shrink: 0;
  padding-right: var(--space-sm);
}

.col-dur {
  width: 50px;
  text-align: right;
  font-size: var(--text-sm);
  color: var(--text-muted);
  flex-shrink: 0;
}

.play-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  background: var(--glass-bg-soft);
  border: 1px solid var(--glass-border-soft);
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
  margin-left: var(--space-sm);
  opacity: 0;
}

.song-row:hover .play-btn {
  opacity: 1;
}

.song-row.active .play-btn {
  opacity: 1;
  background: rgba(212, 163, 115, 0.2);
  border-color: var(--color-primary);
}

.play-btn:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: transparent;
  transform: scale(1.1);
}

/* 播放中动画指示器 */
.playing-indicator {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;
}

.playing-indicator span {
  width: 3px;
  background: var(--color-primary);
  border-radius: 1px;
  animation: audio-bar 0.8s ease-in-out infinite;
}

.playing-indicator span:nth-child(1) { height: 60%; animation-delay: 0s; }
.playing-indicator span:nth-child(2) { height: 100%; animation-delay: 0.2s; }
.playing-indicator span:nth-child(3) { height: 40%; animation-delay: 0.4s; }

@keyframes audio-bar {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.4); }
}

/* ===== 我喜欢的音乐 ===== */
.favorites-card {
  background: linear-gradient(135deg, rgba(212, 163, 115, 0.15), rgba(201, 125, 94, 0.1));
  border: 1px solid rgba(212, 163, 115, 0.25);
}

.favorites-content {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.favorites-icon {
  font-size: 2.2rem;
  flex-shrink: 0;
}

.favorites-info {
  flex: 1;
}

.favorites-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.favorites-desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.favorites-arrow {
  font-size: 1.4rem;
  color: var(--color-primary);
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}

.favorites-card:hover .favorites-arrow {
  transform: translateX(4px);
}

/* ===== 推荐歌单 ===== */
.playlist-card {
  overflow: hidden;
}

.playlist-cover {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.playlist-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition);
}

.playlist-card:hover .playlist-cover-img {
  transform: scale(1.05);
}

.playlist-play-count {
  position: absolute;
  top: 6px;
  right: 8px;
  font-size: 0.7rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(4px);
}

.playlist-info {
  padding: var(--space-sm) var(--space-md);
}

.playlist-name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== 新歌速递列表 ===== */
.top-songs-list {
  margin-bottom: var(--space-xl);
}

.top-song-row {
  display: flex;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  gap: var(--space-sm);
}

.top-song-row:hover {
  background: var(--glass-bg);
}

.top-song-row.active {
  background: rgba(212, 163, 115, 0.12);
}

.top-song-idx {
  width: 28px;
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-muted);
  flex-shrink: 0;
}

.top-song-cover {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
}

.top-song-info {
  flex: 1;
  min-width: 0;
}

.top-song-name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-song-artist {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-song-album {
  width: 150px;
  font-size: var(--text-xs);
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
}

/* 迷你播放栏入场/退场动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .col-album {
    display: none;
  }
  .col-artist {
    width: 100px;
  }
}

@media (max-width: 600px) {
  .search-input-wrap {
    flex-wrap: wrap;
  }
  .search-input {
    width: 100%;
  }
  .search-btn {
    width: 100%;
  }
  .col-artist {
    display: none;
  }
}
</style>
