/**
 * Aurora Glass Design System 类型定义
 */

export type ColorVariant =
  | 'deep'
  | 'primary'
  | 'secondary'
  | 'tertiary';

export type AuroraColor =
  | 'purple'
  | 'blue'
  | 'pink'
  | 'cyan'
  | 'green';

export type GlassVariant =
  | 'default'
  | 'card'
  | 'input'
  | 'button';

export type AnimationType =
  | 'enter'
  | 'pulse-glow'
  | 'shimmer'
  | 'float'
  | 'typing';

export type AnimationDelay = '1' | '2' | '3';

export type GlowStrength = 'soft' | 'medium' | 'strong';

export interface DesignSystemConfig {
  readonly theme?: 'aurora';
  readonly animations?: boolean;
  readonly glassmorphism?: boolean;
  readonly particleEffects?: boolean;
}

export const defaultDesignConfig: DesignSystemConfig = {
  theme: 'aurora',
  animations: true,
  glassmorphism: true,
  particleEffects: true,
};
