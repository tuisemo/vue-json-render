import { computed } from 'vue';
import type { GlassVariant } from '../types';

/**
 * Glassmorphism utilities
 */
export function useGlass() {
  const glassBase = computed(() => ({
    background: 'rgba(18, 24, 53, 0.6)',
    'backdrop-filter': 'blur(20px) saturate(180%)',
    '-webkit-backdrop-filter': 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  }));

  const glassCard = computed(() => ({
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    'backdrop-filter': 'blur(12px) saturate(180%)',
    '-webkit-backdrop-filter': 'blur(12px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    'box-shadow': '0 4px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  }));

  const glassInput = computed(() => ({
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    'backdrop-filter': 'blur(8px)',
    '-webkit-backdrop-filter': 'blur(8px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }));

  const glassButton = computed(() => ({
    background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #ec4899 100%)',
    border: 'none',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  }));

  const getGlassStyle = (variant: GlassVariant) => {
    const styles: Record<GlassVariant, ReturnType<typeof computed>> = {
      default: glassBase,
      card: glassCard,
      input: glassInput,
      button: glassButton,
    };
    return styles[variant].value;
  };

  return {
    glassBase,
    glassCard,
    glassInput,
    glassButton,
    getGlassStyle,
  };
}
