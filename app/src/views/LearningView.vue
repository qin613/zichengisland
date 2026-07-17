<script setup>
/**
 * LearningView - 学习模块
 * 7个科目，基础/进阶/挑战三难度，答题模式，进度追踪，错题本
 */
import { ref, computed } from 'vue'
import GlassCard from '@/components/common/GlassCard.vue'
import GlassButton from '@/components/common/GlassButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import VideoPlayerModal from '@/components/common/VideoPlayerModal.vue'
import { useLearningStore } from '@/stores/learning'
import { SUBJECTS, DIFFICULTIES, getQuizzes, ENGLISH_SUB_CATEGORIES, VIDEO_COURSES } from '@/data/learningData'

const store = useLearningStore()

const tab = ref('overview') // overview / quiz / result / review
const selectedSubject = ref('')
const selectedDifficulty = ref('')
const quizIndex = ref(0)
const quizList = ref([])
const answers = ref([])
const showAnswer = ref(false)
const scoreResult = ref(null)

// 错题复习模式
const reviewMode = ref(false)

// 英语子类别
const selectedSubCategory = ref('')     // 当前选中的英语子类别（用于答题记录）
const subCategoryTarget = ref('')       // 临时记录要选的难度，等选完子类别后使用

// 视频课
const videoSubject = ref('')
const videoSubCategory = ref('')
const expandedCourse = ref(null)
const playerVisible = ref(false)
const playerVideo = ref({ title: '', url: '' })

/** 获取当前选中科目的视频课程列表 */
const videoCourses = computed(() => {
  const sub = videoSubject.value
  if (!sub) return []
  if (sub === 'english') {
    const subCat = videoSubCategory.value
    if (!subCat) return []
    return VIDEO_COURSES.english[subCat] || []
  }
  return VIDEO_COURSES[sub] || []
})

function playVideo(lesson) {
  playerVideo.value = { title: lesson.title, url: lesson.url }
  playerVisible.value = true
}

function closePlayer() {
  playerVisible.value = false
  playerVideo.value = { title: '', url: '' }
}

/* ===== 选科选难度 ===== */
function startQuiz(subject, difficulty, subCategory) {
  reviewMode.value = false
  selectedSubject.value = subject
  selectedDifficulty.value = difficulty
  selectedSubCategory.value = subCategory || ''
  quizList.value = getQuizzes(subject, difficulty, subCategory)
  quizIndex.value = 0
  answers.value = []
  showAnswer.value = false
  scoreResult.value = null
  tab.value = 'quiz'
}

/** 英语科目：先选子类别，再开始答题 */
function pickEnglishSubCategory(difficulty) {
  subCategoryTarget.value = difficulty
}

/* ===== 错题复习启动 ===== */
function startWrongReview(subject) {
  reviewMode.value = true
  selectedSubject.value = subject || ''
  selectedDifficulty.value = ''
  // 英语科目需要匹配所有 english_ 开头的复合 key
  let wrongQs
  if (subject === 'english') {
    wrongQs = store.getWrongQuestions().filter(w => w.subject.startsWith('english_'))
  } else {
    wrongQs = subject ? store.getWrongQuestions(subject) : store.getWrongQuestions()
  }
  if (!wrongQs.length) return
  quizList.value = wrongQs.map(w => ({
    ...JSON.parse(JSON.stringify(w.question)),
    _wrongId: w.id,
    _wrongSubject: w.subject,
    _wrongDifficulty: w.difficulty
  }))
  quizIndex.value = 0
  answers.value = []
  showAnswer.value = false
  scoreResult.value = null
  tab.value = 'quiz'
}

/* ===== 答题逻辑 ===== */
const currentQuiz = computed(() => quizList.value[quizIndex.value])
const quizProgress = computed(() =>
  quizList.value.length ? ((quizIndex.value) / quizList.value.length) * 100 : 0
)

// 选择题
function selectChoice(idx) {
  if (showAnswer.value) return
  answers.value.push({
    type: 'choice',
    selected: idx,
    correct: currentQuiz.value.answer,
    _wrongId: currentQuiz.value._wrongId
  })
  showAnswer.value = true
}

// 填空题
const fillAnswer = ref('')
function submitFill() {
  if (showAnswer.value || !fillAnswer.value.trim()) return
  const userAns = fillAnswer.value.trim().toLowerCase()
  const correctAns = String(currentQuiz.value.answer).toLowerCase()
  const isCorrect = userAns === correctAns
  answers.value.push({
    type: 'fill',
    selected: fillAnswer.value.trim(),
    correct: currentQuiz.value.answer,
    isCorrect,
    _wrongId: currentQuiz.value._wrongId
  })
  showAnswer.value = true
  fillAnswer.value = ''
}

// 计算题
const calcAnswer = ref('')
function submitCalc() {
  if (showAnswer.value || calcAnswer.value === '') return
  const userAns = Number(calcAnswer.value)
  const correctAns = Number(currentQuiz.value.answer)
  const isCorrect = userAns === correctAns
  answers.value.push({
    type: 'calc',
    selected: userAns,
    correct: correctAns,
    isCorrect,
    _wrongId: currentQuiz.value._wrongId
  })
  showAnswer.value = true
  calcAnswer.value = ''
}

// 分析题（直接看答案）
function showAnalysisAnswer() {
  if (showAnswer.value) return
  answers.value.push({
    type: 'analysis',
    correct: true,
    _wrongId: currentQuiz.value._wrongId
  })
  showAnswer.value = true
}

function nextQuestion() {
  quizIndex.value++
  showAnswer.value = false
  fillAnswer.value = ''
  calcAnswer.value = ''

  if (quizIndex.value >= quizList.value.length) {
    finishQuiz()
  }
}

function isAnswerCorrect(a, idx) {
  const q = quizList.value[idx]
  if (a.type === 'choice') return a.selected === a.correct
  if (a.type === 'analysis') return true
  return a.isCorrect
}

function finishQuiz() {
  const correct = answers.value.filter((a, idx) => isAnswerCorrect(a, idx)).length

  if (reviewMode.value) {
    // 错题复习模式：答对的移除错题本
    answers.value.forEach((a, idx) => {
      if (isAnswerCorrect(a, idx) && a._wrongId) {
        store.removeWrongQuestion(a._wrongId)
      }
    })
    const remaining = store.wrongQuestionCount
    scoreResult.value = {
      correct,
      total: quizList.value.length,
      score: quizList.value.length > 0 ? Math.round((correct / quizList.value.length) * 100) : 0,
      reviewMode: true,
      eliminated: correct,
      remaining
    }
  } else {
    // 普通模式：记录成绩和错题
    // 英语子类别使用复合 subject key
    const recordSubject = selectedSubCategory.value
      ? `english_${selectedSubCategory.value}`
      : selectedSubject.value

    const wrongItems = []
    answers.value.forEach((a, idx) => {
      if (!isAnswerCorrect(a, idx)) {
        wrongItems.push({
          question: quizList.value[idx],
          subject: recordSubject,
          difficulty: selectedDifficulty.value
        })
      }
    })
    store.recordResult(
      recordSubject,
      selectedDifficulty.value,
      correct,
      quizList.value.length,
      wrongItems
    )
    scoreResult.value = {
      correct,
      total: quizList.value.length,
      score: Math.round((correct / quizList.value.length) * 100),
      reviewMode: false
    }
  }

  tab.value = 'result'
}

function getAnswerStatus(idx) {
  if (!showAnswer.value) return ''
  const a = answers.value[answers.value.length - 1]
  if (a.type === 'choice') {
    return idx === currentQuiz.value.answer ? 'correct' : (idx === a.selected ? 'wrong' : '')
  }
  return ''
}

/* ===== 科目统计 ===== */
const subjectStats = computed(() => {
  return SUBJECTS.map(s => {
    const diffs = ['basic', 'intermediate', 'advanced']
    let attempted = 0
    let correct = 0

    // 英语科目需要从三个子类别汇总
    if (s.key === 'english') {
      const subKeys = ['english_postgraduate', 'english_cet4', 'english_cet6']
      subKeys.forEach(sk => {
        diffs.forEach(d => {
          const p = store.getProgress(sk, d)
          attempted += p.attempted
          correct += p.correct
        })
      })
    } else {
      diffs.forEach(d => {
        const p = store.getProgress(s.key, d)
        attempted += p.attempted
        correct += p.correct
      })
    }

    return {
      key: s.key,
      label: s.label,
      icon: s.icon,
      color: s.color,
      attempted,
      accuracy: attempted ? Math.round((correct / attempted) * 100) : 0
    }
  })
})

/* ===== 错题分组 ===== */
const wrongQuestionsBySubject = computed(() => {
  const all = store.getWrongQuestions()
  const map = {}
  all.forEach(w => {
    // 英语子类别统一归到 english 分组
    const groupKey = w.subject.startsWith('english_') ? 'english' : w.subject
    if (!map[groupKey]) map[groupKey] = []
    map[groupKey].push(w)
  })
  return map
})

/* ===== 难度颜色 ===== */
function getSubjectColor(key) {
  return SUBJECTS.find((s) => s.key === key)?.color || '#fff'
}

function getSubjectLabel(key) {
  return SUBJECTS.find((s) => s.key === key)?.label || key
}

function getSubjectIcon(key) {
  return SUBJECTS.find((s) => s.key === key)?.icon || '📚'
}

function getScoreEmoji(score) {
  if (score >= 90) return '🎉'
  if (score >= 70) return '👍'
  if (score >= 50) return '💪'
  return '📖'
}

function getDifficultyColor(key) {
  if (key === 'basic') return '#48dbfb'
  if (key === 'intermediate') return '#feca57'
  return '#ff6b6b'
}

function getDifficultyLabel(key) {
  return DIFFICULTIES.find(d => d.key === key)?.label || key
}
</script>

<template>
  <div class="container page">
    <div class="page-header">
      <h1 class="page-title">📚 学习中心</h1>
      <p class="page-subtitle">高等数学 · 线性代数 · 英语 · 数据结构 · 组成原理 · 操作系统 · 计算机网络</p>
    </div>

    <!-- 子标签 -->
    <div class="tabs">
      <button class="tab" :class="{ active: tab === 'overview' }" @click="tab = 'overview'">📖 选择科目</button>
      <button class="tab" :class="{ active: tab === 'quiz' }" :disabled="!quizList.length" @click="tab = 'quiz'">✏️ 答题</button>
      <button class="tab" :class="{ active: tab === 'result' }" :disabled="!scoreResult" @click="tab = 'result'">📊 成绩</button>
      <button class="tab" :class="{ active: tab === 'review' }" @click="tab = 'review'">
        📝 错题本
        <span v-if="store.wrongQuestionCount" class="review-badge">{{ store.wrongQuestionCount }}</span>
      </button>
      <button class="tab" :class="{ active: tab === 'video' }" @click="tab = 'video'">🎬 视频课</button>
    </div>

    <!-- ============ 科目选择 ============ -->
    <div v-show="tab === 'overview'">
    <!-- 科目列表 -->
      <div v-for="subject in SUBJECTS" :key="subject.key" class="subject-section">
        <GlassCard variant="strong" padding="lg">
          <div class="subject-header">
            <div class="subject-icon-wrap" :style="{ background: subject.color + '22', borderColor: subject.color + '44' }">
              <span class="subject-icon">{{ subject.icon }}</span>
            </div>
            <div class="subject-info">
              <h2 class="subject-name" :style="{ color: subject.color }">{{ subject.label }}</h2>
              <p class="subject-desc">
                {{ subject.key === 'advancedMath' ? '极限 · 导数 · 积分 · 级数 · 微分方程' :
                   subject.key === 'linearAlgebra' ? '行列式 · 矩阵 · 向量空间 · 特征值' :
                   subject.key === 'english' ? '考研·四级·六级，三级别英语学习' :
                   subject.key === 'dataStructure' ? '线性表 · 栈队列 · 树 · 图 · 排序' :
                   subject.key === 'computerOrganization' ? 'CPU · 存储器 · 指令系统 · I/O' :
                   subject.key === 'operatingSystem' ? '进程管理 · 内存管理 · 文件系统' :
                   '网络分层 · TCP/IP · 路由 · 网络安全' }}
              </p>
            </div>
            <!-- 科目统计 -->
            <div class="subject-stat-badge" v-if="subjectStats.find(s => s.key === subject.key).attempted > 0">
              <span class="ss-num">{{ subjectStats.find(s => s.key === subject.key).accuracy }}%</span>
              <span class="ss-label">正确率</span>
            </div>
          </div>

          <div class="difficulty-row">
            <button
              v-for="diff in DIFFICULTIES"
              :key="diff.key"
              class="difficulty-card"
              @click="subject.key === 'english' ? pickEnglishSubCategory(diff.key) : startQuiz(subject.key, diff.key)"
            >
              <div class="diff-badge" :style="{ background: getDifficultyColor(diff.key) + '22', color: getDifficultyColor(diff.key) }">
                {{ diff.label }}
              </div>
              <div class="diff-desc">{{ diff.desc }}</div>
              <div class="diff-progress" v-if="store.getProgress(subject.key, diff.key).attempted">
                已答 {{ store.getProgress(subject.key, diff.key).attempted }} 题 ·
                正确率 {{ store.getProgress(subject.key, diff.key).attempted
                  ? Math.round(store.getProgress(subject.key, diff.key).correct / store.getProgress(subject.key, diff.key).attempted * 100)
                  : 0 }}%
              </div>
              <div class="diff-arrow">→</div>
            </button>
          </div>
          <!-- 英语子类别选择器 -->
          <div v-if="subject.key === 'english' && subCategoryTarget" class="sub-category-picker">
            <div class="scp-header">
              <span class="scp-title">选择英语类别</span>
              <button class="scp-close" @click="subCategoryTarget = ''">✕</button>
            </div>
            <div class="scp-list">
              <button
                v-for="cat in ENGLISH_SUB_CATEGORIES"
                :key="cat.key"
                class="scp-card"
                @click="startQuiz(subject.key, subCategoryTarget, cat.key); subCategoryTarget = ''"
              >
                <span class="scp-icon">{{ cat.icon }}</span>
                <div class="scp-info">
                  <span class="scp-label">{{ cat.label }}</span>
                  <span class="scp-desc">{{ cat.desc }}</span>
                </div>
                <span class="scp-arrow">→</span>
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>

    <!-- ============ 错题本 ============ -->
    <div v-show="tab === 'review'">
      <div v-if="store.wrongQuestionCount === 0" class="review-empty">
        <GlassCard padding="lg" class="review-empty-card">
          <div class="review-empty-icon">✅</div>
          <h3>暂无错题</h3>
          <p>继续保持，没有收集到错题</p>
          <GlassButton variant="primary" @click="tab = 'overview'">去刷题</GlassButton>
        </GlassCard>
      </div>

      <div v-else>
        <div class="review-header">
          <div class="review-total">
            共 <strong>{{ store.wrongQuestionCount }}</strong> 道错题需要复习
          </div>
          <GlassButton variant="primary" @click="startWrongReview()">全部复习</GlassButton>
        </div>

        <div v-for="group in Object.keys(wrongQuestionsBySubject)" :key="group" class="review-group">
          <GlassCard padding="lg">
            <div class="review-group-header">
              <div class="review-group-title">
                <span>{{ getSubjectIcon(group) }}</span>
                <span :style="{ color: getSubjectColor(group) }">{{ getSubjectLabel(group) }}</span>
              </div>
              <div class="review-group-meta">
                <span class="review-group-count">{{ wrongQuestionsBySubject[group].length }} 题</span>
                <GlassButton variant="ghost" size="sm" @click="startWrongReview(group)">复习本组</GlassButton>
              </div>
            </div>

            <div v-for="(item, idx) in wrongQuestionsBySubject[group]" :key="item.id" class="review-item">
              <div class="review-item-header">
                <span class="review-item-num">#{{ idx + 1 }}</span>
                <span class="review-item-diff" :style="{ color: getDifficultyColor(item.difficulty) }">
                  {{ getDifficultyLabel(item.difficulty) }}
                </span>
                <span class="review-item-count">错 {{ item.wrongCount }} 次</span>
              </div>
              <div class="review-item-question">{{ item.question.question }}</div>
              <div class="review-item-type">{{ item.question.type === 'choice' ? '选择题' : item.question.type === 'fill' ? '填空题' : item.question.type === 'calc' ? '计算题' : '分析题' }}</div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>

    <!-- ============ 答题 ============ -->
    <div v-show="tab === 'quiz'">
      <div v-if="currentQuiz" class="quiz-screen">
        <!-- 进度条 -->
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" :style="{ width: quizProgress + '%' }"></div>
        </div>
        <div class="quiz-meta">
          <span :style="{ color: reviewMode ? '#feca57' : getSubjectColor(selectedSubject) }">
            {{ reviewMode ? '📝 错题复习' : getSubjectIcon(selectedSubject) + ' ' + getSubjectLabel(selectedSubject) }}
          </span>
          <span class="quiz-count">{{ quizIndex + 1 }} / {{ quizList.length }}</span>
        </div>

        <!-- 题目卡片 -->
        <GlassCard variant="strong" padding="lg" class="quiz-card">
          <!-- 题型标签 -->
          <div class="quiz-type-tag">
            {{ currentQuiz.type === 'choice' ? '选择题' :
               currentQuiz.type === 'fill' ? '填空题' :
               currentQuiz.type === 'calc' ? '计算题' : '分析题' }}
          </div>

          <h3 class="quiz-question">{{ currentQuiz.question }}</h3>

          <!-- 提示 -->
          <p v-if="currentQuiz.hint && !showAnswer" class="quiz-hint">
            💡 提示：{{ currentQuiz.hint }}
          </p>

          <!-- 选择题选项 -->
          <div v-if="currentQuiz.type === 'choice'" class="choice-list">
            <button
              v-for="(opt, i) in currentQuiz.options"
              :key="i"
              class="choice-btn"
              :class="getAnswerStatus(i)"
              @click="selectChoice(i)"
            >
              <span class="choice-letter">{{ String.fromCharCode(65 + i) }}</span>
              <span class="choice-text">{{ opt }}</span>
            </button>
          </div>

          <!-- 填空题输入 -->
          <div v-if="currentQuiz.type === 'fill' && !showAnswer" class="fill-input">
            <input
              v-model="fillAnswer"
              class="input"
              placeholder="输入你的答案..."
              @keyup.enter="submitFill"
            />
            <GlassButton variant="primary" @click="submitFill">提交</GlassButton>
          </div>

          <!-- 计算题输入 -->
          <div v-if="currentQuiz.type === 'calc' && !showAnswer" class="fill-input">
            <input
              v-model="calcAnswer"
              type="number"
              class="input"
              placeholder="输入数字答案..."
              @keyup.enter="submitCalc"
            />
            <GlassButton variant="primary" @click="submitCalc">提交</GlassButton>
          </div>

          <!-- 分析题 -->
          <div v-if="currentQuiz.type === 'analysis' && !showAnswer" class="analysis-btn">
            <GlassButton variant="primary" @click="showAnalysisAnswer">查看参考答案</GlassButton>
          </div>

          <!-- 答案解析 -->
          <div v-if="showAnswer" class="answer-section">
            <div class="answer-result" :class="answers[answers.length - 1]?.type === 'choice'
              ? (answers[answers.length - 1].selected === answers[answers.length - 1].correct ? 'correct' : 'wrong')
              : (answers[answers.length - 1]?.isCorrect !== false ? 'correct' : 'wrong')">
              <span v-if="answers[answers.length - 1]?.type === 'choice'">
                {{ answers[answers.length - 1].selected === answers[answers.length - 1].correct ? '✅ 回答正确！' : '❌ 回答错误' }}
              </span>
              <span v-else>
                {{ answers[answers.length - 1]?.isCorrect !== false ? '✅ 回答正确！' : '❌ 回答错误' }}
              </span>
            </div>

            <div v-if="currentQuiz.type === 'fill'" class="answer-correct">
              正确答案：<strong>{{ currentQuiz.answer }}</strong>
            </div>
            <div v-if="currentQuiz.type === 'analysis'" class="answer-analysis">
              <h4>参考答案：</h4>
              <p>{{ currentQuiz.answer }}</p>
            </div>

            <div class="answer-explanation">
              <h4>解析</h4>
              <p>{{ currentQuiz.explanation }}</p>
            </div>

            <GlassButton variant="primary" class="mt-md" @click="nextQuestion">
              {{ quizIndex < quizList.length - 1 ? '下一题 →' : '查看成绩' }}
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    </div>

    <!-- ============ 视频课 ============ -->
    <div v-show="tab === 'video'">
      <!-- 第一层：科目选择 -->
      <div class="video-subject-select">
        <button
          v-for="s in SUBJECTS"
          :key="s.key"
          class="video-subject-btn"
          :class="{ active: videoSubject === s.key }"
          :style="{ '--sub-color': s.color }"
          @click="videoSubject = s.key; videoSubCategory = ''; expandedCourse = null"
        >
          <span class="vs-icon">{{ s.icon }}</span>
          <span class="vs-label">{{ s.label }}</span>
        </button>
      </div>

      <!-- 英语子类别选择 -->
      <div v-if="videoSubject === 'english'" class="video-sub-category">
        <button
          v-for="cat in ENGLISH_SUB_CATEGORIES"
          :key="cat.key"
          class="vsc-btn"
          :class="{ active: videoSubCategory === cat.key }"
          @click="videoSubCategory = cat.key; expandedCourse = null"
        >
          <span>{{ cat.icon }}</span>
          <span>{{ cat.label }}</span>
        </button>
      </div>

      <!-- 第二层：课程列表 -->
      <div v-if="videoCourses.length" class="video-course-list">
        <div v-for="course in videoCourses" :key="course.id" class="video-course-item">
          <GlassCard padding="md">
            <div
              class="vc-header"
              @click="expandedCourse = expandedCourse === course.id ? null : course.id"
            >
              <div class="vc-header-left">
                <span class="vc-icon">{{ course.icon || '📺' }}</span>
                <div class="vc-info">
                  <span class="vc-title">{{ course.title }}</span>
                  <span class="vc-desc">{{ course.desc }}</span>
                </div>
              </div>
              <div class="vc-header-right">
                <span class="vc-count">{{ course.lessons.length }} 课时</span>
                <span class="vc-arrow" :class="{ open: expandedCourse === course.id }">▼</span>
              </div>
            </div>

            <!-- 第三层：章节列表 -->
            <Transition name="slide">
              <div v-if="expandedCourse === course.id" class="vc-lessons">
                <div
                  v-for="(lesson, idx) in course.lessons"
                  :key="lesson.id"
                  class="vc-lesson"
                >
                  <span class="vl-num">{{ idx + 1 }}</span>
                  <span class="vl-title">{{ lesson.title }}</span>
                  <span class="vl-duration">{{ lesson.duration }}</span>
                  <button class="vl-play" @click.stop="playVideo(lesson)">▶ 播放</button>
                </div>
              </div>
            </Transition>
          </GlassCard>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="videoSubject && (videoSubject !== 'english' || videoSubCategory)" class="video-empty">
        <GlassCard padding="lg" class="video-empty-card">
          <div class="video-empty-icon">🎬</div>
          <h3>暂无视频课程</h3>
          <p>该科目暂未收录视频课程</p>
        </GlassCard>
      </div>
      <div v-else class="video-hint">
        <GlassCard padding="lg" class="video-hint-card">
          <div class="video-empty-icon">👆</div>
          <h3>请选择科目</h3>
          <p>选择一个科目查看视频课程列表</p>
        </GlassCard>
      </div>
    </div>

    <!-- 视频播放弹窗 -->
    <VideoPlayerModal
      :show="playerVisible"
      :video-url="playerVideo.url"
      :title="playerVideo.title"
      @close="closePlayer"
    />

    <!-- ============ 成绩 ============ -->
    <div v-show="tab === 'result'">
      <div v-if="scoreResult" class="result-screen">
        <GlassCard variant="strong" padding="lg" class="result-card">
          <!-- 错题复习结果 -->
          <template v-if="scoreResult.reviewMode">
            <div class="result-emoji">{{ scoreResult.score >= 80 ? '🎉' : scoreResult.score >= 50 ? '💪' : '📖' }}</div>
            <div class="result-score" :style="{ color: scoreResult.score >= 80 ? '#26de81' : scoreResult.score >= 50 ? '#feca57' : '#ff6b6b' }">
              {{ scoreResult.score }}分
            </div>
            <div class="result-detail">📝 错题复习</div>
            <div class="result-stats">
              <div class="result-stat">
                <span class="rs-num">{{ scoreResult.eliminated }}</span>
                <span class="rs-label">已消灭</span>
              </div>
              <div class="result-stat">
                <span class="rs-num">{{ scoreResult.total - scoreResult.eliminated }}</span>
                <span class="rs-label">仍需复习</span>
              </div>
              <div class="result-stat">
                <span class="rs-num">{{ scoreResult.total }}</span>
                <span class="rs-label">总题数</span>
              </div>
            </div>
            <div class="result-remaining" v-if="scoreResult.remaining > 0">
              还有 <strong>{{ scoreResult.remaining }}</strong> 道错题待复习
            </div>
            <div class="result-actions">
              <GlassButton variant="primary" @click="startWrongReview()">继续复习</GlassButton>
              <GlassButton variant="ghost" @click="tab = 'review'">返回错题本</GlassButton>
            </div>
          </template>

          <!-- 普通成绩 -->
          <template v-else>
            <div class="result-emoji">{{ getScoreEmoji(scoreResult.score) }}</div>
            <div class="result-score" :style="{ color: scoreResult.score >= 70 ? '#26de81' : scoreResult.score >= 50 ? '#feca57' : '#ff6b6b' }">
              {{ scoreResult.score }}分
            </div>
            <div class="result-detail">
              {{ getSubjectIcon(selectedSubject) }}
              {{ getSubjectLabel(selectedSubject) }}
              <template v-if="selectedSubCategory">
                · {{ ENGLISH_SUB_CATEGORIES.find(c => c.key === selectedSubCategory)?.label }}
              </template>
              · {{ DIFFICULTIES.find(d => d.key === selectedDifficulty)?.label }}
            </div>
            <div class="result-stats">
              <div class="result-stat">
                <span class="rs-num">{{ scoreResult.correct }}</span>
                <span class="rs-label">正确</span>
              </div>
              <div class="result-stat">
                <span class="rs-num">{{ scoreResult.total - scoreResult.correct }}</span>
                <span class="rs-label">错误</span>
              </div>
              <div class="result-stat">
                <span class="rs-num">{{ scoreResult.total }}</span>
                <span class="rs-label">总题数</span>
              </div>
            </div>
            <div class="result-actions">
              <GlassButton variant="primary" @click="startQuiz(selectedSubject, selectedDifficulty, selectedSubCategory)">
                再练一次
              </GlassButton>
              <GlassButton variant="ghost" @click="tab = 'overview'">
                返回选择
              </GlassButton>
            </div>
          </template>
        </GlassCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 子标签 */
.tabs {
  display: flex;
  gap: var(--space-xs);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

.tab {
  position: relative;
  padding: 0.6rem 1.2rem;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--glass-bg-soft);
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition);
}

.tab.active {
  background: var(--glass-bg-active);
  color: var(--text-primary);
  border-color: var(--glass-border);
}

.tab:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.review-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: #ff6b6b;
  border-radius: 10px;
  margin-left: 4px;
}

/* 科目区块 */
.subject-section {
  margin-bottom: var(--space-lg);
}

.subject-header {
  display: flex;
  gap: var(--space-md);
  align-items: center;
  margin-bottom: var(--space-lg);
}

.subject-info {
  flex: 1;
}

.subject-stat-badge {
  text-align: center;
  padding: 0.4rem 0.8rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
}

.ss-num {
  display: block;
  font-size: var(--text-lg);
  font-weight: 800;
}

.ss-label {
  font-size: 10px;
  color: var(--text-muted);
}

.subject-icon-wrap {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid;
  flex-shrink: 0;
}

.subject-icon {
  font-size: 1.8rem;
}

.subject-name {
  font-size: var(--text-xl);
  font-weight: 700;
}

.subject-desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: 2px;
}

/* 难度选择 */
.difficulty-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
}

.difficulty-card {
  position: relative;
  padding: var(--space-md);
  font-family: inherit;
  text-align: left;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border-soft);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition);
}

.difficulty-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.diff-badge {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
  margin-bottom: var(--space-xs);
}

.diff-desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
}

.diff-progress {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.diff-arrow {
  position: absolute;
  right: var(--space-md);
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: var(--text-muted);
  transition: transform var(--transition);
}

.difficulty-card:hover .diff-arrow {
  transform: translate(4px, -50%);
  color: var(--text-primary);
}

/* 错题本 */
.review-empty {
  display: flex;
  justify-content: center;
}

.review-empty-card {
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.review-empty-icon {
  font-size: 3rem;
  margin-bottom: var(--space-md);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.review-total {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.review-group {
  margin-bottom: var(--space-lg);
}

.review-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.review-group-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-lg);
  font-weight: 700;
}

.review-group-meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.review-group-count {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.review-item {
  padding: var(--space-sm) 0;
  border-top: 1px solid var(--glass-border-soft);
}

.review-item-header {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
  margin-bottom: 4px;
}

.review-item-num {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-weight: 600;
}

.review-item-diff {
  font-size: 11px;
  font-weight: 600;
}

.review-item-count {
  font-size: 11px;
  color: #ff6b6b;
}

.review-item-question {
  font-size: var(--text-sm);
  line-height: 1.5;
  margin-bottom: 2px;
}

.review-item-type {
  font-size: 11px;
  color: var(--text-muted);
}

/* 答题 */
.quiz-screen {
  max-width: 700px;
  margin: 0 auto;
}

.quiz-progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-md);
  overflow: hidden;
}

.quiz-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-2));
  border-radius: var(--radius-full);
  transition: width var(--transition);
}

.quiz-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
  font-size: var(--text-sm);
}

.quiz-count {
  color: var(--text-muted);
}

.quiz-card {
  position: relative;
}

.quiz-type-tag {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
}

.quiz-question {
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: 1.6;
  margin-bottom: var(--space-lg);
}

.quiz-hint {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
}

/* 选择题 */
.choice-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.choice-btn {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border-soft);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition);
  text-align: left;
}

.choice-btn:hover:not(.correct):not(.wrong) {
  background: rgba(255, 255, 255, 0.12);
  border-color: var(--glass-border);
}

.choice-letter {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--text-xs);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  flex-shrink: 0;
}

.choice-btn.correct {
  background: rgba(38, 222, 129, 0.15);
  border-color: rgba(38, 222, 129, 0.4);
}

.choice-btn.correct .choice-letter {
  background: rgba(38, 222, 129, 0.3);
  color: #26de81;
}

.choice-btn.wrong {
  background: rgba(255, 107, 107, 0.15);
  border-color: rgba(255, 107, 107, 0.4);
}

.choice-btn.wrong .choice-letter {
  background: rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
}

/* 填空题 */
.fill-input {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.fill-input .input {
  flex: 1;
}

.analysis-btn {
  text-align: center;
  margin-top: var(--space-md);
}

/* 答案解析 */
.answer-section {
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--glass-border-soft);
}

.answer-result {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-weight: 600;
  margin-bottom: var(--space-md);
}

.answer-result.correct {
  background: rgba(38, 222, 129, 0.15);
  color: #26de81;
}

.answer-result.wrong {
  background: rgba(255, 107, 107, 0.15);
  color: #ff6b6b;
}

.answer-correct {
  font-size: var(--text-sm);
  margin-bottom: var(--space-md);
  color: var(--text-secondary);
}

.answer-analysis {
  margin-bottom: var(--space-md);
}

.answer-analysis h4 {
  font-size: var(--text-sm);
  margin-bottom: var(--space-xs);
}

.answer-analysis p {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.7;
}

.answer-explanation {
  padding: var(--space-md);
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
}

.answer-explanation h4 {
  font-size: var(--text-sm);
  margin-bottom: var(--space-xs);
  color: var(--color-accent);
}

.answer-explanation p {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.7;
}

/* 成绩 */
.result-screen {
  display: flex;
  justify-content: center;
}

.result-card {
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.result-emoji {
  font-size: 4rem;
  margin-bottom: var(--space-md);
}

.result-score {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: var(--space-xs);
}

.result-detail {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
}

.result-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.result-stat {
  padding: var(--space-md);
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
}

.rs-num {
  display: block;
  font-size: var(--text-2xl);
  font-weight: 700;
}

.rs-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-top: 4px;
  display: block;
}

.result-remaining {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
}

.result-actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
}

/* 英语子类别选择器 */
.sub-category-picker {
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--glass-border-soft);
}

.scp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.scp-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-secondary);
}

.scp-close {
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}

.scp-close:hover {
  background: rgba(255,255,255,0.1);
}

.scp-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
}

.scp-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-md);
  font-family: inherit;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border-soft);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition);
  text-align: center;
  position: relative;
}

.scp-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  border-color: #feca57;
}

.scp-icon {
  font-size: 2rem;
}

.scp-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.scp-label {
  font-size: var(--text-sm);
  font-weight: 700;
}

.scp-desc {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.4;
}

.scp-arrow {
  font-size: 1.1rem;
  color: var(--text-muted);
  transition: transform var(--transition);
}

.scp-card:hover .scp-arrow {
  transform: translateX(4px);
  color: var(--text-primary);
}

/* 视频课 - 科目选择 */
.video-subject-select {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.video-subject-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-sm) var(--space-md);
  font-family: inherit;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border-soft);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition);
  min-width: 72px;
}

.video-subject-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.video-subject-btn.active {
  background: rgba(255, 255, 255, 0.12);
  border-color: var(--sub-color, var(--color-primary));
  color: var(--text-primary);
  box-shadow: 0 0 16px color-mix(in srgb, var(--sub-color, var(--color-primary)) 30%, transparent);
}

.vs-icon {
  font-size: 1.5rem;
}

.vs-label {
  white-space: nowrap;
}

/* 英语子类别 */
.video-sub-category {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.vsc-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0.5rem 1rem;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border-soft);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition);
}

.vsc-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.vsc-btn.active {
  background: rgba(254, 202, 87, 0.15);
  border-color: #feca57;
  color: #feca57;
}

/* 课程列表 */
.video-course-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.vc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  padding: var(--space-xs) 0;
}

.vc-header-left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex: 1;
  min-width: 0;
}

.vc-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.vc-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.vc-title {
  font-size: var(--text-base);
  font-weight: 700;
}

.vc-desc {
  font-size: var(--text-xs);
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vc-header-right {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-shrink: 0;
}

.vc-count {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.vc-arrow {
  font-size: 0.7rem;
  color: var(--text-muted);
  transition: transform var(--transition);
}

.vc-arrow.open {
  transform: rotate(180deg);
}

/* 章节列表 */
.vc-lessons {
  margin-top: var(--space-md);
  border-top: 1px solid var(--glass-border-soft);
  padding-top: var(--space-sm);
}

.vc-lesson {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--glass-border-soft);
}

.vc-lesson:last-child {
  border-bottom: none;
}

.vl-num {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  flex-shrink: 0;
}

.vl-title {
  flex: 1;
  font-size: var(--text-sm);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vl-duration {
  font-size: var(--text-xs);
  color: var(--text-muted);
  flex-shrink: 0;
}

.vl-play {
  padding: 0.25rem 0.7rem;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  background: rgba(212, 163, 115, 0.2);
  border: 1px solid rgba(212, 163, 115, 0.3);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition);
  flex-shrink: 0;
}

.vl-play:hover {
  background: rgba(212, 163, 115, 0.35);
  transform: translateY(-1px);
}

/* 视频空状态 */
.video-empty,
.video-hint {
  display: flex;
  justify-content: center;
}

.video-empty-card,
.video-hint-card {
  max-width: 360px;
  width: 100%;
  text-align: center;
}

.video-empty-icon {
  font-size: 3rem;
  margin-bottom: var(--space-md);
}

/* slide 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  margin-top: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .difficulty-row {
    grid-template-columns: 1fr;
  }
  .scp-list {
    grid-template-columns: 1fr;
  }
  .fill-input {
    flex-direction: column;
  }
  .video-subject-select {
    gap: 6px;
  }
  .video-subject-btn {
    min-width: 56px;
    padding: 0.35rem 0.5rem;
  }
  .vs-icon {
    font-size: 1.2rem;
  }
  .vs-label {
    font-size: 10px;
  }
  .video-sub-category {
    flex-wrap: wrap;
  }
  .vc-lesson {
    flex-wrap: wrap;
    gap: var(--space-xs);
  }
  .vl-title {
    width: 100%;
    order: -1;
  }
  .vl-duration {
    font-size: 10px;
  }
}
</style>
