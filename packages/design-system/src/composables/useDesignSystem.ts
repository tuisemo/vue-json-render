import { inject, provide, computed, type InjectionKey } from 'vue';
import type { DesignSystemConfig } from '../types';

const DESIGN_SYSTEM_KEY: InjectionKey<DesignSystemConfig> = Symbol('design-system');

/**
 * Provide design system configuration
 */
export function provideDesignSystem(config: DesignSystemConfig): void {
  provide(DESIGN_SYSTEM_KEY, config);
}

/**
 * Use design system configuration
 */
export function useDesignSystem(): Required<DesignSystemConfig> {
  const config = inject(DESIGN_SYSTEM_KEY);

  return {
    theme: config?.theme ?? 'aurora',
    animations: config?.animations ?? true,
    glassmorphism: config?.glassmorphism ?? true,
    particleEffects: config?.particleEffects ?? true,
  };
}
