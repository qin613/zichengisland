/**
 * useNeteasePlayer - 网易云音乐播放器状态管理
 *
 * 全局单例模式，切 Tab / 路由不中断播放
 * 管理：当前曲目、播放状态、进度、音量
 */
import { ref, reactive, computed } from 'vue'
import { getSongUrl, getSongDetail, getLyric } from '@/api/netease'

// ===== 全局单例状态（所有组件共享）=====
let _audio = null
let _initialized = false

const state = reactive({
  /** 当前曲目信息 */
  currentTrack: null, // { id, name, artist, album, cover, duration }
  /** 是否正在播放 */
  isPlaying: false,
  /** 当前播放时间（秒） */
  currentTime: 0,
  /** 总时长（秒） */
  duration: 0,
  /** 音量 0~1 */
  volume: 0.7,
  /** 加载中 */
  loading: false,
  /** 错误信息 */
  error: null,
  /** 播放列表（搜索结果） */
  playlist: [],
  /** 当前播放索引 */
  currentIndex: -1,
  /** 全屏播放器是否展开 */
  showPlayer: false,
  /** 解析后的歌词 [{time: 秒, text: '歌词'}] */
  lyrics: [],
  /** 当前高亮歌词行索引 */
  currentLyricIndex: -1
})

/** 格式化时间为 mm:ss */
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** 进度百分比 0~100 */
const progress = computed(() => {
  if (!state.duration) return 0
  return (state.currentTime / state.duration) * 100
})

export function useNeteasePlayer() {
  /** 获取或创建 Audio 元素 */
  function getAudio() {
    if (!_audio) {
      _audio = new Audio()
      _audio.preload = 'auto'
      _audio.volume = state.volume

      _audio.addEventListener('timeupdate', () => {
        state.currentTime = _audio.currentTime
      })
      _audio.addEventListener('loadedmetadata', () => {
        state.duration = _audio.duration
      })
      _audio.addEventListener('ended', () => {
        state.isPlaying = false
        // 自动播放下一首
        playNext()
      })
      _audio.addEventListener('error', () => {
        state.error = '音频加载失败'
        state.isPlaying = false
        state.loading = false
      })
      _audio.addEventListener('waiting', () => {
        state.loading = true
      })
      _audio.addEventListener('canplay', () => {
        state.loading = false
      })
    }
    return _audio
  }

  /**
   * 播放一首歌曲
   * @param {Object} song - 搜索结果中的歌曲对象 { id, name, artists, album, duration }
   * @param {number} index - 在播放列表中的索引
   */
  async function play(song, index = -1) {
    const audio = getAudio()
    state.error = null
    state.loading = true

    try {
      // 1. 获取播放 URL
      const urlRes = await getSongUrl(song.id)
      const urlData = (urlRes.data || [])[0]
      if (!urlData || !urlData.url) {
        state.error = '该歌曲暂无可用播放源'
        state.loading = false
        return
      }

      // 2. 获取歌曲详情（封面等）
      let cover = ''
      let artist = ''
      let album = ''
      try {
        const detailRes = await getSongDetail(song.id)
        const detail = (detailRes.songs || [])[0]
        if (detail) {
          cover = (detail.al || {}).picUrl || ''
          artist = (detail.ar || []).map(a => a.name).join(', ')
          album = (detail.al || {}).name || ''
        }
      } catch {
        // 详情失败不阻塞播放
        artist = (song.artists || []).map(a => a.name || a).join(', ')
        album = (song.album || {}).name || ''
      }

      // 3. 更新状态
      state.currentTrack = {
        id: song.id,
        name: song.name,
        artist: artist || (song.artists || []).map(a => a.name || a).join(', '),
        album: album,
        cover: cover,
        duration: urlData.duration ? urlData.duration / 1000 : 0
      }
      state.currentIndex = index >= 0 ? index : state.playlist.findIndex(s => s.id === song.id)

      // 4. 播放
      audio.src = urlData.url
      audio.load()
      await audio.play()
      state.isPlaying = true

      // 5. 获取歌词（异步，不阻塞播放）
      fetchLyrics()
    } catch (err) {
      state.error = '播放失败: ' + err.message
    } finally {
      state.loading = false
    }
  }

  /** 暂停 */
  function pause() {
    const audio = getAudio()
    audio.pause()
    state.isPlaying = false
  }

  /** 播放/暂停切换 */
  function toggle() {
    if (state.isPlaying) {
      pause()
    } else if (state.currentTrack) {
      const audio = getAudio()
      audio.play().catch(() => {})
      state.isPlaying = true
    }
  }

  /**
   * 跳转到指定时间
   * @param {number} time - 秒
   */
  function seek(time) {
    const audio = getAudio()
    audio.currentTime = time
    state.currentTime = time
  }

  /**
   * 设置音量
   * @param {number} v - 0~1
   */
  function setVolume(v) {
    state.volume = Math.max(0, Math.min(1, v))
    const audio = getAudio()
    audio.volume = state.volume
  }

  /** 播放下一首 */
  function playNext() {
    if (state.playlist.length === 0) return
    const nextIndex = (state.currentIndex + 1) % state.playlist.length
    play(state.playlist[nextIndex], nextIndex)
  }

  /** 播放上一首 */
  function playPrev() {
    if (state.playlist.length === 0) return
    const prevIndex = state.currentIndex <= 0 ? state.playlist.length - 1 : state.currentIndex - 1
    play(state.playlist[prevIndex], prevIndex)
  }

  /**
   * 设置播放列表（搜索结果）
   * @param {Array} songs
   */
  function setPlaylist(songs) {
    state.playlist = songs || []
  }

  /** 停止播放并清理 */
  function stop() {
    const audio = getAudio()
    audio.pause()
    audio.src = ''
    state.isPlaying = false
    state.currentTrack = null
    state.currentTime = 0
    state.duration = 0
    state.currentIndex = -1
    state.error = null
    state.lyrics = []
    state.currentLyricIndex = -1
  }

  /** 展开/收起全屏播放器 */
  function togglePlayer() {
    state.showPlayer = !state.showPlayer
  }

  /** 关闭全屏播放器 */
  function closePlayer() {
    state.showPlayer = false
  }

  /**
   * 解析 LRC 歌词文本
   * @param {string} lrcText - LRC 格式歌词
   * @returns {Array<{time: number, text: string}>}
   */
  function parseLrc(lrcText) {
    if (!lrcText) return []
    const lines = lrcText.split('\n')
    const result = []
    const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g
    for (const line of lines) {
      const text = line.replace(timeReg, '').trim()
      if (!text) continue
      let match
      while ((match = timeReg.exec(line)) !== null) {
        const m = parseInt(match[1])
        const s = parseInt(match[2])
        const ms = parseInt(match[3])
        const time = m * 60 + s + ms / (match[3].length === 3 ? 1000 : 100)
        result.push({ time, text })
      }
      timeReg.lastIndex = 0
    }
    result.sort((a, b) => a.time - b.time)
    return result
  }

  /** 获取当前曲目歌词 */
  async function fetchLyrics() {
    if (!state.currentTrack) return
    state.lyrics = []
    state.currentLyricIndex = -1
    try {
      const res = await getLyric(state.currentTrack.id)
      if (res.code === 200) {
        const lrcText = (res.lrc || {}).lyric || ''
        state.lyrics = parseLrc(lrcText)
      }
    } catch {
      // 歌词获取失败不阻塞播放
    }
  }

  /** 根据当前播放时间更新高亮歌词行 */
  function updateLyricIndex() {
    const t = state.currentTime
    const lyrics = state.lyrics
    if (!lyrics.length) return
    let idx = -1
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (t >= lyrics[i].time) {
        idx = i
        break
      }
    }
    state.currentLyricIndex = idx
  }

  return {
    state,
    progress,
    formatTime,
    play,
    pause,
    toggle,
    seek,
    setVolume,
    playNext,
    playPrev,
    setPlaylist,
    stop,
    togglePlayer,
    closePlayer,
    fetchLyrics,
    updateLyricIndex
  }
}
