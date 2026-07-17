<script setup>
/**
 * 空状态 / 错误状态展示
 */
defineOptions({ name: 'EmptyState' })

defineProps({
  icon: {
    type: String,
    default: '📭'
  },
  title: {
    type: String,
    default: '暂无数据'
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon">{{ icon }}</div>
    <h3 class="empty-title">{{ title }}</h3>
    <p v-if="description" class="empty-desc">{{ description }}</p>
    <div v-if="$slots.action" class="empty-action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: var(--space-2xl) var(--space-lg);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--space-md);
  opacity: 0.9;
}

.empty-title {
  font-size: var(--text-xl);
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.empty-desc {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  max-width: 320px;
  margin: 0 auto var(--space-lg);
}

.empty-action {
  margin-top: var(--space-lg);
}
</style>
