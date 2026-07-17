<script setup>
/**
 * App - 根组件
 * 动态星空背景 + 初始界面 + 导航栏 + 路由出口 + 页脚
 */
import { ref } from 'vue'
import ParticleUniverse from '@/components/common/ParticleUniverse.vue'
import SplashScreen from '@/components/common/SplashScreen.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SpeakerToggle from '@/components/common/SpeakerToggle.vue'

const showSplash = ref(true)
</script>

<template>
  <!-- 粒子背景全时渲染 -->
  <ParticleUniverse />

  <SplashScreen v-if="showSplash" @enter="showSplash = false" />

  <template v-if="!showSplash">
    <div class="app-content">
      <AppHeader />
      <main class="app-main">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
      <AppFooter />
    </div>
    <!-- 全局背景音乐控制 -->
    <SpeakerToggle />
  </template>
</template>

<style scoped>
.app-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
}
</style>
