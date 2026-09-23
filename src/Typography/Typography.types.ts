import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export const typographyTones = [
  'default',
  'muted',
  'subtle',
  'danger',
  'success',
  'warning',
  'accent',
  'onAccent',
  'inherit',
] as const;
export type TypographyTone = (typeof typographyTones)[number];

/** Weight overrides. Each family already has the correct default weight;
 *  reach for this only when the design genuinely departs from the step. */
export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold';

/** Shared by every family. `level` is declared per family, because the
 *  legal range differs (Display 1-2, Headline 1-3, and so on). */
export interface BaseTypographyProps extends HTMLAttributes<HTMLElement> {
  tone?: TypographyTone;
  weight?: TypographyWeight;
  /** Override the rendered tag without changing the visual step. */
  as?: ElementType;
  /** Drop the family's built-in measure cap and inherit the parent width. */
  unbounded?: boolean;
  /** Truncate after N lines. Implies `unbounded`. */
  lines?: number;
  children: ReactNode;
}

/** The eight steps in the scale, largest to smallest. Exposed for docs and
 *  for the rare non-DOM consumer (canvas, PDF) that needs raw numbers. */
export const typeScale = {
  '4xl': { px: 56, lineHeight: 1.02, letterSpacing: '-0.03em', weight: 700 },
  '3xl': { px: 40, lineHeight: 1.1, letterSpacing: '-0.025em', weight: 600 },
  '2xl': { px: 30, lineHeight: 1.2, letterSpacing: '-0.02em', weight: 600 },
  xl: { px: 22, lineHeight: 1.3, letterSpacing: '0em', weight: 600 },
  lg: { px: 18, lineHeight: 1.55, letterSpacing: '0em', weight: 400 },
  md: { px: 16, lineHeight: 1.7, letterSpacing: '0em', weight: 400 },
  sm: { px: 14, lineHeight: 1.6, letterSpacing: '0em', weight: 400 },
  xs: { px: 12, lineHeight: 1.5, letterSpacing: '0.14em', weight: 500 },
} as const;

export type TypeStep = keyof typeof typeScale;
