<script setup>
/**
 * 加载动画组件
 */
defineOptions({ name: 'LoadingSpinner' })

defineProps({
  size: {
    type: String,
    default: 'md' // sm / md / lg
  },
  label: {
    type: String,
    default: '加载中...'
  },
  fullscreen: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="spinner-wrap" :class="{ 'is-fullscreen': fullscreen }">
    <div class="spinner" :class="`s-${size}`"></div>
    <span v-if="label" class="spinner-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.spinner-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-xl);
}

.is-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.spinner {
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

.s-sm {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 2px;
}
.s-md {
  width: 2.5rem;
  height: 2.5rem;
}
.s-lg {
  width: 3.5rem;
  height: 3.5rem;
  border-width: 4px;
}

.spinner-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
