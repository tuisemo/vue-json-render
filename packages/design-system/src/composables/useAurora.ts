import { computed } from 'vue';
import { useDesignSystem } from './useDesignSystem';
import type { AuroraColor, GlowStrength } from '../types';

/**
 * Aurora color utilities
 */
export function useAurora() {
  const config = useDesignSystem();

  const auroraColor = (color: AuroraColor) => computed(() => {
    const colors: Record<AuroraColor, string> = {
      purple: '#a855f7',
      blue: '#3b82f6',
      pink: '#ec4899',
      cyan: '#06b6d4',
      green: '#22c55e',
    };
    return colors[color];
  });

  const auroraGradient = (colors: AuroraColor[] = ['purple', 'blue', 'pink']) =>
    computed(() => {
      const colorValues = colors.map((c) => auroraColor(c).value).join(', ');
      return `linear-gradient(135deg, ${colorValues})`;
    });

  const auroraGlow = (
    color: AuroraColor,
    strength: GlowStrength = 'medium',
  ) => {
    const colorValue = auroraColor(color).value;
    const strengths: Record<GlowStrength, string> = {
      soft: `0 0 20px ${colorValue}33`,
      medium: `0 0 30px ${colorValue}4d`,
      strong: `0 0 40px ${colorValue}66`,
    };
    return strengths[strength];
  };

  const auroraTextGradient = computed(() => {
    const gradient = auroraGradient(['purple', 'blue', 'pink']).value;
    return {
      background: gradient,
      '-webkit-background-clip': 'text',
      'background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      'background-size': '200% 200%',
    };
  });

  return {
    config,
    auroraColor,
    auroraGradient,
    auroraGlow,
    auroraTextGradient,
  };
}
