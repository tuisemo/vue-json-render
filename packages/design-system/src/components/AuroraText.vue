<template>
  <span
    class="aurora-text"
    :style="textStyle"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAurora, type AuroraColor } from '../composables/useAurora';

interface Props {
  gradient?: AuroraColor[];
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  gradient: () => ['purple', 'blue', 'pink'],
  size: 'md',
  weight: 'semibold',
  animated: true,
});

const { auroraTextGradient } = useAurora();

const textStyle = computed(() => ({
  ...auroraTextGradient.value,
  fontSize: {
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  }[props.size],
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }[props.weight],
  ...(props.animated && {
    animation: 'gradient-shift 3s ease infinite',
  }),
}));
</script>

<style scoped>
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>
