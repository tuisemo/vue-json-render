<template>
  <div
    class="glass-card"
    :class="[{
      'animate-enter': animated,
      'interactive-scale': interactive,
    }, sizeClass]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGlass } from '../composables/useGlass';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animated?: boolean;
  interactive?: boolean;
  glow?: boolean;
  noise?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  animated: true,
  interactive: false,
  glow: true,
  noise: true,
});

const { glassCard } = useGlass();

const sizeClass = computed(() => `glass-card--${props.size}`);

const cardStyle = computed(() => ({
  ...glassCard.value,
  ...(props.glow && {
    'box-shadow': '0 4px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 40px rgba(168, 85, 247, 0.15)',
  }),
}));
</script>

<style scoped>
.glass-card {
  border-radius: 16px;
  padding: 24px;
}

.glass-card--sm {
  max-width: 24rem;
  padding: 16px;
  border-radius: 12px;
}

.glass-card--md {
  max-width: 32rem;
  padding: 20px;
}

.glass-card--lg {
  max-width: 48rem;
  padding: 24px;
}

.glass-card--xl {
  max-width: 64rem;
  padding: 32px;
}

.glass-card--full {
  width: 100%;
  max-width: none;
  padding: 24px;
}

@keyframes enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-enter {
  animation: enter 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.interactive-scale {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.interactive-scale:hover {
  transform: scale(1.02);
}

.interactive-scale:active {
  transform: scale(0.98);
}
</style>
