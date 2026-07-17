<script setup>
/**
 * GlassButton - 玻璃拟态按钮
 */
defineOptions({ name: 'GlassButton' })

const props = defineProps({
  variant: {
    type: String,
    default: 'default' // default / primary / ghost
  },
  size: {
    type: String,
    default: 'md' // sm / md / lg
  },
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<template>
  <button
    class="g-btn"
    :class="[`v-${variant}`, `s-${size}`, { 'is-block': block }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot name="icon-left" />
    <span class="g-btn__text"><slot /></span>
    <slot name="icon-right" />
  </button>
</template>

<style scoped>
.g-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
  font-weight: 600;
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
  user-select: none;
}

/* 尺寸 */
.s-sm {
  padding: 0.4rem 0.9rem;
  font-size: var(--text-xs);
}
.s-md {
  padding: 0.6rem 1.4rem;
  font-size: var(--text-sm);
}
.s-lg {
  padding: 0.8rem 1.8rem;
  font-size: var(--text-base);
}

/* 变体 */
.v-default {
  background: var(--glass-bg-strong);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.v-primary {
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-warm)
  );
  border: none;
  box-shadow: 0 0 20px rgba(212, 163, 115, 0.35);
}

.v-ghost {
  background: transparent;
  border: 1px solid var(--glass-border);
}

/* 悬浮 */
.g-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.v-primary:not(:disabled):hover {
  box-shadow: 0 0 32px rgba(212, 163, 115, 0.5);
}

.v-ghost:not(:disabled):hover {
  background: var(--glass-bg);
}

.g-btn:active {
  transform: translateY(0);
}

.g-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.is-block {
  width: 100%;
}
</style>
