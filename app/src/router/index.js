import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: '首页 · 自成岛' }
  },
  {
    path: '/cooking',
    name: 'cooking',
    component: () => import('@/views/CookingView.vue'),
    meta: { title: '做饭 · 自成岛' }
  },
  {
    path: '/music',
    name: 'music',
    component: () => import('@/views/MusicView.vue'),
    meta: { title: '音乐 · 自成岛' }
  },
  {
    path: '/travel',
    name: 'travel',
    component: () => import('@/views/TravelView.vue'),
    meta: { title: '旅游 · 自成岛' }
  },
  {
    path: '/productivity',
    name: 'productivity',
    component: () => import('@/views/ProductivityView.vue'),
    meta: { title: '效率 · 自成岛' }
  },
  {
    path: '/health',
    name: 'health',
    component: () => import('@/views/HealthView.vue'),
    meta: { title: '健康 · 自成岛' }
  },
  {
    path: '/sports',
    name: 'sports',
    component: () => import('@/views/SportsView.vue'),
    meta: { title: '运动 · 自成岛' }
  },
  {
    path: '/learning',
    name: 'learning',
    component: () => import('@/views/LearningView.vue'),
    meta: { title: '学习 · 自成岛' }
  },
  {
    path: '/decompose',
    name: 'decompose',
    component: () => import('@/views/DecomposeView.vue'),
    meta: { title: '智能拆解 · 自成岛' }
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('@/views/GameView.vue'),
    meta: { title: '嫣落尘渊 · 自成岛' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }
})

export default router
