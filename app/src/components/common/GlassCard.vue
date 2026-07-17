<script setup>
/**
 * GlassCard - 玻璃拟态卡片基础组件
 * 整个站点的视觉基础，所有内容卡片都基于它
 */
defineOptions({ name: 'GlassCard' })

const props = defineProps({
  // 玻璃强度：normal / strong / soft
  variant: {
    type: String,
    default: 'normal'
  },
  // 是否启用悬浮上浮效果
  hover: {
    type: Boolean,
    default: false
  },
  // 内边距：sm/md/lg/none
  padding: {
    type: String,
    default: 'md'
  },
  // 是否渲染为可点击元素
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])
</script>

<template>
  <component
    :is="clickable ? 'button' : 'div'"
    class="glass-card"
    :class="[
      `variant-${variant}`,
      `pad-${padding}`,
      { 'is-hover': hover, 'is-clickable': clickable }
    ]"
    @click="clickable ? emit('click', $event) : null"
  >
    <slot />
  </component>
</template>

<style scoped>
.glass-card {
  width: 100%;
  text-align: left;
  font-family: inherit;
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  transition: transform var(--transition), box-shadow var(--transition),
    background var(--transition);
  overflow: hidden;
}

/* 玻璃强度变体 */
.variant-normal {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.variant-strong {
  background: var(--glass-bg-strong);
  backdrop-filter: blur(var(--glass-blur-strong)) saturate(150%);
  -webkit-backdrop-filter: blur(var(--glass-blur-strong)) saturate(150%);
  box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.variant-soft {
  background: var(--glass-bg-soft);
  backdrop-filter: blur(10px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
  box-shadow: var(--shadow-sm);
}

/* 内边距 */
.pad-none {
  padding: 0;
}
.pad-sm {
  padding: var(--space-sm);
}
.pad-md {
  padding: var(--space-lg);
}
.pad-lg {
  padding: var(--space-xl);
}

/* 悬浮效果 — 借鉴 jzrxh.work 干净上浮 */
.is-hover:hover,
.is-clickable:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.is-clickable {
  cursor: pointer;
}

.is-clickable:active {
  transform: translateY(-2px);
}
</style>
