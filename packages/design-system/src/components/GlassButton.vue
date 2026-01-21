<template>
  <button
    class="glass-button"
    :class="[{
      'glass-button--primary': variant === 'primary',
      'glass-button--secondary': variant === 'secondary',
      'glass-button--danger': variant === 'danger',
      'glass-button--ghost': variant === 'ghost',
    }, sizeClass, { 'glass-button--loading': loading }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span class="glass-button__overlay" />
    <span class="glass-button__content">
      <slot v-if="!loading" />
      <span v-else class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </span>
    <span v-if="loading" class="glass-button__spinner" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGlass, type AuroraColor } from '../composables/useGlass';

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  animated: true,
});

defineEmits<{
  click: [event: MouseEvent];
}>();

const { glassButton, auroraColor } = useGlass();

const sizeClass = computed(() => `glass-button--${props.size}`);

const buttonStyle = computed(() => ({
  ...glassButton.value,
  opacity: props.disabled ? 0.5 : 1,
  cursor: props.disabled ? 'not-allowed' : 'pointer',
}));
</script>

<style scoped>
.glass-button {
  position: relative;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 500;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
}

.glass-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.glass-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(168, 85, 247, 0.4), 0 0 0 1px rgba(168, 85, 247, 0.1);
}

.glass-button:hover::before {
  opacity: 1;
}

.glass-button:active:not(:disabled) {
  transform: translateY(0);
}

.glass-button--primary {
  background: linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #ec4899 100%);
  color: white;
  border: none;
}

.glass-button--secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(12px);
}

.glass-button--secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.1);
}

.glass-button--danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
}

.glass-button--danger:hover {
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.1);
}

.glass-button--ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.glass-button--ghost:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

.glass-button--sm {
  padding: 8px 16px;
  font-size: 0.875rem;
  border-radius: 8px;
}

.glass-button--md {
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 10px;
}

.glass-button--lg {
  padding: 16px 32px;
  font-size: 1.125rem;
  border-radius: 12px;
}

.glass-button--loading {
  pointer-events: none;
}

.glass-button__content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-dots {
  display: inline-flex;
  gap: 4px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: loading-dot 1.4s ease-in-out infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loading-dot {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
