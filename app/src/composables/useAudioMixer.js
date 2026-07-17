import { ref, reactive } from 'vue'

/**
 * 音频混音引擎 composable
 *
 * 功能：
 * - 用 Web Audio API 程序化生成白/粉/棕噪音（无需音频文件）
 * - 播放真实音频文件（雨声、海浪等）
 * - 多音源同时播放并独立控制音量
 * - 统一主音量控制
 *
 * 每个音源是一个独立的 AudioBufferSourceNode（噪音）或 <audio> 元素（文件），
 * 通过 GainNode 控制音量，最终汇入 ctx.destination
 */
export function useAudioMixer() {
  let ctx = null
  // 音源状态表：{ [id]: { type, volume, playing, source, gain, audioEl, error } }
  const sources = reactive({})
  const masterVolume = ref(0.7)
  let masterGain = null

  /** 确保音频上下文已初始化（需在用户交互后调用） */
  function ensureContext() {
    if (ctx) return ctx
    const AC = window.AudioContext || window.webkitAudioContext
    ctx = new AC()
    masterGain = ctx.createGain()
    masterGain.gain.value = masterVolume.value
    masterGain.connect(ctx.destination)
    return ctx
  }

  /** 生成指定类型的噪音 AudioBuffer */
  function createNoiseBuffer(type) {
    const sampleRate = ctx.sampleRate
    const length = sampleRate * 2 // 2 秒循环
    const buffer = ctx.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    if (type === 'white') {
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1
      }
    } else if (type === 'pink') {
      // Paul Kellet 粉噪音算法
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.969 * b2 + white * 0.153852
        b3 = 0.8665 * b3 + white * 0.3104856
        b4 = 0.55 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.016898
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
        b6 = white * 0.115926
      }
    } else if (type === 'brown') {
      // 棕噪音（积分白噪音）
      let last = 0
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1
        last = (last + 0.02 * white) / 1.02
        data[i] = last * 3.5
      }
    }
    return buffer
  }

  /** 播放生成的噪音 */
  function playGenerated(id, noiseType, volume) {
    const buffer = createNoiseBuffer(noiseType)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const gain = ctx.createGain()
    gain.gain.value = volume * masterVolume.value

    source.connect(gain)
    gain.connect(masterGain)
    source.start()

    sources[id] = {
      type: 'generated',
      volume,
      playing: true,
      source,
      gain,
      error: false
    }
  }

  /** 播放音频文件 */
  function playFile(id, url, volume) {
    const audioEl = new Audio(url)
    audioEl.loop = true
    audioEl.crossOrigin = 'anonymous'

    const onError = () => {
      // 文件加载失败（可能文件不存在）
      if (sources[id]) {
        sources[id].error = true
        sources[id].playing = false
      }
    }

    audioEl.addEventListener('error', onError)

    // 尝试通过 Web Audio API 接入以支持统一音量控制
    try {
      const sourceNode = ctx.createMediaElementSource(audioEl)
      const gain = ctx.createGain()
      gain.gain.value = volume * masterVolume.value
      sourceNode.connect(gain)
      gain.connect(masterGain)

      sources[id] = {
        type: 'file',
        volume,
        playing: true,
        sourceNode,
        gain,
        audioEl,
        error: false
      }
    } catch {
      // createMediaElementSource 失败则直接用 audio 元素自身播放
      audioEl.volume = volume * masterVolume.value
      sources[id] = {
        type: 'file',
        volume,
        playing: true,
        audioEl,
        gain: null,
        error: false
      }
    }

    audioEl.play().catch(onError)
  }

  /**
   * 切换某个音源的播放状态
   * @param {string} id 音源 ID
   * @param {object} config 音源配置（来自 SOUNDS）
   * @param {number} volume 0-1
   */
  function toggle(id, config, volume = 0.5) {
    ensureContext()
    if (ctx.state === 'suspended') ctx.resume()

    // 已在播放则停止
    if (sources[id] && sources[id].playing) {
      stop(id)
      return false
    }

    // 启动播放
    if (config.type === 'generated') {
      playGenerated(id, config.noise, volume)
    } else if (config.type === 'file') {
      const url = `${import.meta.env.BASE_URL}sounds/${config.filename}`
      playFile(id, url, volume)
    }
    return true
  }

  /** 停止某个音源 */
  function stop(id) {
    const s = sources[id]
    if (!s) return
    try {
      if (s.source) s.source.stop()
      if (s.audioEl) {
        s.audioEl.pause()
        s.audioEl.src = ''
      }
    } catch {}
    s.playing = false
    delete sources[id]
  }

  /** 设置某音源音量 */
  function setVolume(id, volume) {
    const s = sources[id]
    if (!s) return
    s.volume = volume
    if (s.gain) {
      s.gain.gain.value = volume * masterVolume.value
    } else if (s.audioEl) {
      s.audioEl.volume = volume * masterVolume.value
    }
  }

  /** 设置主音量 */
  function setMasterVolume(v) {
    masterVolume.value = v
    if (masterGain) {
      masterGain.gain.value = v
    }
    // 同步更新未接入 masterGain 的 audio 元素
    for (const id in sources) {
      const s = sources[id]
      if (!s.gain && s.audioEl) {
        s.audioEl.volume = s.volume * v
      }
    }
  }

  /** 停止所有 */
  function stopAll() {
    for (const id in sources) {
      stop(id)
    }
  }

  /** 某音源是否在播放 */
  function isPlaying(id) {
    return !!(sources[id] && sources[id].playing)
  }

  /** 某音源是否加载出错 */
  function hasError(id) {
    return !!(sources[id] && sources[id].error)
  }

  /** 当前播放中的音源数量 */
  const playingCount = ref(0)
  function refreshPlayingCount() {
    playingCount.value = Object.values(sources).filter((s) => s.playing).length
  }

  return {
    sources,
    masterVolume,
    playingCount,
    toggle,
    stop,
    stopAll,
    setVolume,
    setMasterVolume,
    isPlaying,
    hasError,
    refreshPlayingCount
  }
}
