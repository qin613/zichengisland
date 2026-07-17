/**
 * 运动模块数据
 * 运动动作库 + 预设训练计划
 */

/** 运动分类 */
export const EXERCISE_CATEGORIES = [
  { key: 'chest', label: '胸部', icon: '💪' },
  { key: 'back', label: '背部', icon: '🔙' },
  { key: 'legs', label: '腿部', icon: '🦵' },
  { key: 'shoulders', label: '肩部', icon: '🏋️' },
  { key: 'arms', label: '手臂', icon: '💪' },
  { key: 'core', label: '核心', icon: '🎯' },
  { key: 'cardio', label: '有氧', icon: '🏃' },
  { key: 'stretch', label: '拉伸', icon: '🧘' }
]

/**
 * 运动动作库
 * bvid: B站视频ID，用于嵌入教学视频
 * bt: 视频跳转秒数（合集视频中定位到具体动作）
 */
export const EXERCISES = [
  // ===== 胸部 =====
  {
    name: '俯卧撑', category: 'chest', difficulty: 1, met: 8,
    desc: '标准俯卧撑，双手略宽于肩', muscles: '胸大肌、三头肌',
    bvid: 'BV12KTJzvEWa'
  },
  {
    name: '宽距俯卧撑', category: 'chest', difficulty: 1, met: 8,
    desc: '双手距离比肩宽，更多刺激胸肌外侧', muscles: '胸大肌外侧',
    bvid: 'BV12KTJzvEWa'
  },
  {
    name: '钻石俯卧撑', category: 'chest', difficulty: 2, met: 9,
    desc: '双手靠拢成钻石形，强化三头肌', muscles: '胸肌内侧、三头肌',
    bvid: 'BV12KTJzvEWa'
  },
  {
    name: '上斜俯卧撑', category: 'chest', difficulty: 1, met: 7,
    desc: '脚放高处，加强上胸', muscles: '上胸、三角肌前束',
    bvid: 'BV12KTJzvEWa'
  },
  {
    name: '下斜俯卧撑', category: 'chest', difficulty: 2, met: 8,
    desc: '手放高处，加强下胸', muscles: '下胸',
    bvid: 'BV12KTJzvEWa'
  },
  // ===== 背部 =====
  {
    name: '引体向上', category: 'back', difficulty: 3, met: 10,
    desc: '正手宽握，拉至下巴过杆', muscles: '背阔肌、二头肌',
    bvid: 'BV19o4y1S7vN'
  },
  {
    name: '反手引体向上', category: 'back', difficulty: 2, met: 9,
    desc: '反手握，更多二头参与', muscles: '背阔肌、二头肌',
    bvid: 'BV19o4y1S7vN'
  },
  {
    name: '超人式', category: 'back', difficulty: 1, met: 5,
    desc: '俯卧，同时抬起四肢', muscles: '竖脊肌、臀大肌',
    bvid: 'BV1fq421w76K'
  },
  {
    name: '俯身划船', category: 'back', difficulty: 2, met: 7,
    desc: '用哑铃或水瓶做俯身划船', muscles: '背阔肌、菱形肌',
    bvid: 'BV1fq421w76K'
  },
  // ===== 腿部 =====
  {
    name: '深蹲', category: 'legs', difficulty: 1, met: 8,
    desc: '双脚与肩同宽，蹲至大腿平行地面', muscles: '股四头肌、臀大肌',
    bvid: 'BV19o4y1S7vN'
  },
  {
    name: '弓步蹲', category: 'legs', difficulty: 2, met: 8,
    desc: '前后脚交替下蹲', muscles: '股四头肌、臀大肌',
    bvid: 'BV19a4y1T7sn'
  },
  {
    name: '保加利亚分腿蹲', category: 'legs', difficulty: 3, met: 9,
    desc: '后脚放凳上，前脚深蹲', muscles: '股四头肌、臀大肌',
    bvid: 'BV1fq421w76K'
  },
  {
    name: '臀桥', category: 'legs', difficulty: 1, met: 6,
    desc: '仰卧屈膝，抬臀至肩膝一线', muscles: '臀大肌、腘绳肌',
    bvid: 'BV19a4y1T7sn'
  },
  {
    name: '小腿提踵', category: 'legs', difficulty: 1, met: 5,
    desc: '双脚站立，抬起脚跟', muscles: '腓肠肌',
    bvid: 'BV1fq421w76K'
  },
  {
    name: '靠墙静蹲', category: 'legs', difficulty: 1, met: 5,
    desc: '背靠墙，大腿平行地面保持', muscles: '股四头肌',
    bvid: 'BV1fq421w76K'
  },
  // ===== 肩部 =====
  {
    name: '肩部推举', category: 'shoulders', difficulty: 2, met: 7,
    desc: '哑铃或水瓶向上推举', muscles: '三角肌',
    bvid: 'BV1fq421w76K'
  },
  {
    name: '侧平举', category: 'shoulders', difficulty: 2, met: 6,
    desc: '双臂侧平举至肩高', muscles: '三角肌中束',
    bvid: 'BV1fq421w76K'
  },
  {
    name: '前平举', category: 'shoulders', difficulty: 1, met: 6,
    desc: '双臂前平举至肩高', muscles: '三角肌前束',
    bvid: 'BV1fq421w76K'
  },
  {
    name: '俯身飞鸟', category: 'shoulders', difficulty: 2, met: 6,
    desc: '俯身做侧平举', muscles: '三角肌后束',
    bvid: 'BV1fq421w76K'
  },
  // ===== 手臂 =====
  {
    name: '二头弯举', category: 'arms', difficulty: 1, met: 6,
    desc: '哑铃或水瓶弯举', muscles: '肱二头肌',
    bvid: 'BV1fq421w76K'
  },
  {
    name: '三头臂屈伸', category: 'arms', difficulty: 2, met: 7,
    desc: '哑铃过头臂屈伸', muscles: '肱三头肌',
    bvid: 'BV1fq421w76K'
  },
  {
    name: '锤式弯举', category: 'arms', difficulty: 1, met: 6,
    desc: '掌心相对做弯举', muscles: '肱肌、肱桡肌',
    bvid: 'BV1fq421w76K'
  },
  {
    name: '窄距俯卧撑', category: 'arms', difficulty: 2, met: 8,
    desc: '双手靠窄，强化手臂', muscles: '肱三头肌',
    bvid: 'BV12KTJzvEWa'
  },
  // ===== 核心 =====
  {
    name: '平板支撑', category: 'core', difficulty: 1, met: 5,
    desc: '前臂撑地，身体成一线', muscles: '腹横肌、核心',
    bvid: 'BV1paigeEEMx'
  },
  {
    name: '卷腹', category: 'core', difficulty: 1, met: 6,
    desc: '仰卧，抬起上背', muscles: '腹直肌',
    bvid: 'BV1paigeEEV8'
  },
  {
    name: '仰卧举腿', category: 'core', difficulty: 2, met: 7,
    desc: '仰卧，双腿伸直上举', muscles: '下腹、髂腰肌',
    bvid: 'BV1paigeEEV8'
  },
  {
    name: '俄罗斯转体', category: 'core', difficulty: 2, met: 6,
    desc: '坐姿，双脚离地左右转体', muscles: '腹斜肌',
    bvid: 'BV1p2iTeGEkm'
  },
  {
    name: '死虫式', category: 'core', difficulty: 1, met: 5,
    desc: '仰卧，对侧手脚交替伸出', muscles: '核心稳定',
    bvid: 'BV1fq421w76K'
  },
  {
    name: '登山者', category: 'core', difficulty: 2, met: 10,
    desc: '俯卧撑姿势交替提膝', muscles: '核心、心肺',
    bvid: 'BV1fq421w76K'
  },
  // ===== 有氧 =====
  {
    name: '开合跳', category: 'cardio', difficulty: 1, met: 10,
    desc: '跳跃开合，手脚配合', muscles: '全身',
    bvid: 'BV19a4y1T7sn'
  },
  {
    name: '高抬腿', category: 'cardio', difficulty: 1, met: 11,
    desc: '原地跑步，膝盖抬至腰部', muscles: '腿部、心肺',
    bvid: 'BV19a4y1T7sn'
  },
  {
    name: '波比跳', category: 'cardio', difficulty: 3, met: 12,
    desc: '下蹲-撑地-跳跃-跳跃击掌', muscles: '全身',
    bvid: 'BV1fq421w76K'
  },
  {
    name: '跳绳模拟', category: 'cardio', difficulty: 1, met: 11,
    desc: '模拟跳绳动作', muscles: '小腿、心肺',
    bvid: 'BV1fq421w76K'
  },
  {
    name: '原地踏步', category: 'cardio', difficulty: 1, met: 4,
    desc: '原地踏步走', muscles: '腿部',
    bvid: 'BV1fq421w76K'
  },
  // ===== 拉伸 =====
  {
    name: '颈部拉伸', category: 'stretch', difficulty: 1, met: 2,
    desc: '左右前后拉伸颈部', muscles: '颈部肌群',
    bvid: 'BV1paigeEEV8'
  },
  {
    name: '肩部拉伸', category: 'stretch', difficulty: 1, met: 2,
    desc: '交叉拉伸肩部', muscles: '三角肌',
    bvid: 'BV1paigeEEV8'
  },
  {
    name: '腰部拉伸', category: 'stretch', difficulty: 1, met: 3,
    desc: '坐姿体前屈', muscles: '腰部、腘绳肌',
    bvid: 'BV1paigeEEV8'
  },
  {
    name: '腿部拉伸', category: 'stretch', difficulty: 1, met: 3,
    desc: '弓步拉伸髋屈肌', muscles: '髋屈肌、股四头肌',
    bvid: 'BV1paigeEEV8'
  },
  {
    name: '猫牛式', category: 'stretch', difficulty: 1, met: 3,
    desc: '四点跪撑，交替弓背塌腰', muscles: '脊柱、核心',
    bvid: 'BV1fq421w76K'
  },
  {
    name: '婴儿式', category: 'stretch', difficulty: 1, met: 2,
    desc: '跪坐前趴，手臂前伸', muscles: '背部放松',
    bvid: 'BV1fq421w76K'
  }
]

/** 预设训练计划 */
export const WORKOUT_PLANS = [
  {
    name: 'HIIT 燃脂',
    icon: '🔥',
    desc: '20分钟高强度间歇训练',
    duration: 20,
    exercises: [
      { name: '开合跳', work: 40, rest: 20 },
      { name: '波比跳', work: 30, rest: 30 },
      { name: '高抬腿', work: 40, rest: 20 },
      { name: '登山者', work: 30, rest: 30 },
      { name: '深蹲', work: 40, rest: 20 },
      { name: '俯卧撑', work: 30, rest: 30 }
    ],
    rounds: 3
  },
  {
    name: '上肢力量',
    icon: '💪',
    desc: '15分钟上肢塑形训练',
    duration: 15,
    exercises: [
      { name: '俯卧撑', work: 45, rest: 15 },
      { name: '宽距俯卧撑', work: 45, rest: 15 },
      { name: '二头弯举', work: 45, rest: 15 },
      { name: '三头臂屈伸', work: 45, rest: 15 },
      { name: '肩部推举', work: 45, rest: 15 }
    ],
    rounds: 3
  },
  {
    name: '下肢训练',
    icon: '🦵',
    desc: '15分钟腿部与臀部训练',
    duration: 15,
    exercises: [
      { name: '深蹲', work: 45, rest: 15 },
      { name: '弓步蹲', work: 40, rest: 20 },
      { name: '臀桥', work: 45, rest: 15 },
      { name: '靠墙静蹲', work: 30, rest: 15 },
      { name: '小腿提踵', work: 45, rest: 15 }
    ],
    rounds: 3
  },
  {
    name: '核心强化',
    icon: '🎯',
    desc: '10分钟核心专项训练',
    duration: 10,
    exercises: [
      { name: '平板支撑', work: 45, rest: 15 },
      { name: '卷腹', work: 40, rest: 20 },
      { name: '俄罗斯转体', work: 40, rest: 20 },
      { name: '仰卧举腿', work: 30, rest: 15 },
      { name: '死虫式', work: 40, rest: 20 }
    ],
    rounds: 2
  },
  {
    name: '晨间唤醒',
    icon: '🌅',
    desc: '8分钟轻度晨练',
    duration: 8,
    exercises: [
      { name: '原地踏步', work: 60, rest: 10 },
      { name: '猫牛式', work: 40, rest: 10 },
      { name: '深蹲', work: 30, rest: 15 },
      { name: '肩部拉伸', work: 40, rest: 10 },
      { name: '腰部拉伸', work: 40, rest: 10 },
      { name: '婴儿式', work: 60, rest: 0 }
    ],
    rounds: 1
  }
]

/** 难度标签 */
export const DIFFICULTY_LABELS = ['', '入门', '中等', '进阶']
