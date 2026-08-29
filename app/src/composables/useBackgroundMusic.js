/**
 * useBackgroundMusic - 全局背景音乐控制器
 *
 * 功能：
 * - 根据当前路由自动切换背景音乐
 * - 学习模块 → 播放 学习.mp3
 * - 其他页面  → 播放 其他.mp3
 * - 小喇叭图标控制播放/暂停
 * - 页面切换时平滑过渡
 */
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

/** 音乐文件映射：路由 path → 音频文件名 */
const ROUTE_AUDIO_MAP = {
  learning: 'learning.mp3',
  default: 'other.mp3'
}

/** 全局单例状态 — 确保多个组件引用同一实例 */
let _audioEl = null
let _initialized = false

export function useBackgroundMusic() {
  const route = useRoute()

  // 响应式状态
  const isPlaying = ref(false)
  const isMuted = ref(false)
  const currentTrack = ref('')

  /** 获取或创建 Audio 元素 */
  function getAudio() {
    if (!_audioEl) {
      _audioEl = new Audio()
      _audioEl.loop = true
      _audioEl.preload = 'auto'
      _audioEl.volume = 0.3

      _audioEl.addEventListener('play', () => {
        isPlaying.value = true
      })
      _audioEl.addEventListener('pause', () => {
        isPlaying.value = false
      })
      _audioEl.addEventListener('ended', () => {
        isPlaying.value = false
      })
      _audioEl.addEventListener('error', () => {
        isPlaying.value = false
        console.warn('[bgm] 音频加载失败:', currentTrack.value)
      })
    }
    return _audioEl
  }

  /** 获取当前路由对应的音频文件名 */
  function getTrackForRoute(routeName) {
    return ROUTE_AUDIO_MAP[routeName] || ROUTE_AUDIO_MAP.default
  }

  /** 切换播放/暂停 */
  function toggle() {
    const audio = getAudio()
    if (audio.paused) {
      // 如果还没有 currentTrack，先用默认
      if (!currentTrack.value) {
        const track = getTrackForRoute(route.name)
        switchTrack(track)
      }
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }

  /** 切换曲目 */
  function switchTrack(filename) {
    if (!filename) return
    const audio = getAudio()
    const base = import.meta.env.BASE_URL || '/'
    const src = `${base}sounds/${filename}`

    if (src === audio.src && !audio.paused) return // 已在播放同一曲目

    const wasPlaying = !audio.paused
    audio.pause()
    currentTrack.value = filename
    audio.src = src
    audio.load()

    if (wasPlaying) {
      audio.play().catch(() => {})
    }
  }

  /** 根据路由切换背景音乐 */
  function updateForRoute(to) {
    const track = getTrackForRoute(to.name)
    if (track !== currentTrack.value) {
      switchTrack(track)
    }
  }

  /** 初始化：监听路由变化自动切换（默认不自动播放，需用户手动开启） */
  function init() {
    if (_initialized) return
    _initialized = true

    // 首次进入根据当前路由设置曲目，但不自动播放
    if (route.name) {
      const track = getTrackForRoute(route.name)
      switchTrack(track)
    }

    // 监听路由变化
    watch(
      () => route.name,
      (newName) => {
        const track = getTrackForRoute(newName)
        if (track !== currentTrack.value) {
          switchTrack(track)
        }
      }
    )
  }

  return {
    isPlaying,
    isMuted,
    currentTrack,
    toggle,
    init,
    updateForRoute
  }
}
