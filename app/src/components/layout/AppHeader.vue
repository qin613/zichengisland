<script setup>
/**
 * AppHeader - 顶部导航栏
 * 玻璃拟态风格，移动端折叠为汉堡菜单
 */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

defineOptions({ name: 'AppHeader' })

const navItems = [
  { to: '/', label: '首页', icon: '🏠' },
  { to: '/cooking', label: '做饭', icon: '🍳' },
  { to: '/music', label: '音乐', icon: '🎵' },
  { to: '/travel', label: '旅游', icon: '✈️' },
  { to: '/sports', label: '运动', icon: '🏋️' },
  { to: '/learning', label: '学习', icon: '📚' },
  { to: '/decompose', label: '拆解', icon: '🧠' },
  { to: '/game', label: '游戏', icon: '🏯' },
  { to: '/productivity', label: '效率', icon: '⏱️' },
  { to: '/health', label: '健康', icon: '💧' }
]

const menuOpen = ref(false)

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <header class="app-header">
    <div class="header-inner container">
      <RouterLink to="/" class="logo" @click="closeMenu">
        <span class="logo-icon">🌿</span>
        <span class="logo-text">自成岛</span>
      </RouterLink>

      <button
        class="menu-toggle"
        :class="{ active: menuOpen }"
        @click="menuOpen = !menuOpen"
        aria-label="切换菜单"
      >
        <span></span><span></span><span></span>
      </button>

      <nav class="nav" :class="{ open: menuOpen }">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          @click="closeMenu"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: none;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 700;
  font-size: var(--text-lg);
}

.logo-icon {
  font-size: 1.5rem;
}

/* 桌面端导航 */
.nav {
  display: flex;
  gap: 0.2rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border-radius: 20px;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.nav-item.router-link-exact-active {
  background: rgba(212, 163, 115, 0.12);
  color: #8b6914;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.1rem;
}

/* 汉堡按钮 - 移动端 */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border-soft);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  width: 18px;
  height: 2px;
  margin: 0 auto;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all var(--transition);
}

.menu-toggle.active span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}
.menu-toggle.active span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* 响应式 */
@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .nav {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    padding: var(--space-md);
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--glass-border);
    transform: translateY(-120%);
    opacity: 0;
    pointer-events: none;
    transition: all var(--transition);
  }

  .nav.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .nav-item {
    padding: 0.8rem 1rem;
    border-radius: var(--radius-md);
  }
}
</style>
