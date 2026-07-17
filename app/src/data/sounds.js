/**
 * 白噪音 / 环境音配置
 *
 * 音频来源方案：
 * 1. 优先使用 Web Audio API 程序化生成的噪音（无需任何音频文件，打开即用）
 *    - white / pink / brown 三种噪音颜色
 * 2. 自然音效（雨声、海浪等）需要真实音频文件，放入 public/sounds/ 目录
 *    - 若文件不存在，UI 会优雅降级提示
 *
 * 你可以从以下免版权来源下载音频：
 * - https://mixkit.co/free-sound-effects/ (免费可商用)
 * - https://freesound.org/ (CC 协议)
 * 下载后命名为下方 filename 对应的名字放入 public/sounds/
 */

export const NOISE_TYPES = {
  white: { label: '白噪音', color: '#ffffff', desc: '全频段均匀，类似电视雪花' },
  pink: { label: '粉噪音', color: '#fbc2eb', desc: '柔和舒缓，适合助眠' },
  brown: { label: '棕噪音', color: '#a18cd1', desc: '低沉浑厚，类似远处海浪' }
}

/** 音效配置 */
export const SOUNDS = [
  {
    id: 'rain',
    name: '雨声',
    icon: '🌧️',
    desc: '淅淅沥沥的雨声，助你专注与放松',
    color: '#5b8def',
    type: 'file', // 需要真实音频文件
    filename: 'rain.mp3'
  },
  {
    id: 'ocean',
    name: '海浪',
    icon: '🌊',
    desc: '潮起潮落，仿佛置身海边',
    color: '#48dbfb',
    type: 'file',
    filename: 'ocean.mp3'
  },
  {
    id: 'forest',
    name: '森林',
    icon: '🌳',
    desc: '鸟鸣与风拂树叶的自然之声',
    color: '#26de81',
    type: 'file',
    filename: 'forest.mp3'
  },
  {
    id: 'fire',
    name: '篝火',
    icon: '🔥',
    desc: '木柴噼啪作响的温暖声',
    color: '#fa8231',
    type: 'file',
    filename: 'fire.mp3'
  },
  {
    id: 'cafe',
    name: '咖啡馆',
    icon: '☕',
    desc: '轻度环境白噪音，提升专注力',
    color: '#a0522d',
    type: 'file',
    filename: 'cafe.mp3'
  },
  {
    id: 'wind',
    name: '风声',
    icon: '🍃',
    desc: '微风拂过，空灵悠远',
    color: '#84fab0',
    type: 'file',
    filename: 'wind.mp3'
  },
  {
    id: 'white',
    name: '白噪音',
    icon: '⚪',
    desc: '程序生成，屏蔽杂音利器',
    color: '#ffffff',
    type: 'generated',
    noise: 'white'
  },
  {
    id: 'pink',
    name: '粉噪音',
    icon: '🌸',
    desc: '程序生成，比白噪音更柔和',
    color: '#fbc2eb',
    type: 'generated',
    noise: 'pink'
  },
  {
    id: 'brown',
    name: '棕噪音',
    icon: '🟤',
    desc: '程序生成，低沉如海浪',
    color: '#a18cd1',
    type: 'generated',
    noise: 'brown'
  }
]

/** 场景模式预设（一键开启多个音源组合） */
export const SCENES = [
  {
    id: 'focus',
    name: '专注工作',
    icon: '💼',
    desc: '隔绝干扰，进入心流',
    sounds: [{ id: 'brown', volume: 0.5 }, { id: 'cafe', volume: 0.3 }]
  },
  {
    id: 'sleep',
    name: '深度睡眠',
    icon: '😴',
    desc: '助你安然入梦',
    sounds: [{ id: 'pink', volume: 0.4 }, { id: 'rain', volume: 0.4 }]
  },
  {
    id: 'relax',
    name: '放松冥想',
    icon: '🧘',
    desc: '放空思绪，舒缓身心',
    sounds: [{ id: 'forest', volume: 0.5 }, { id: 'wind', volume: 0.3 }]
  },
  {
    id: 'study',
    name: '沉浸学习',
    icon: '📚',
    desc: '提升记忆与专注',
    sounds: [{ id: 'white', volume: 0.3 }, { id: 'rain', volume: 0.3 }]
  }
]
