import type { CSSProperties } from 'react';
import base from './Typography.module.css';
import type { TypographyTone, TypographyWeight } from './Typography.types';

/** Join class names, dropping anything falsy. */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

interface SharedArgs {
  tone?: TypographyTone;
  weight?: TypographyWeight;
  unbounded?: boolean;
  lines?: number;
}

/** The class list every family shares: base, tone, weight, width behaviour. */
export function sharedClasses({ tone, weight, unbounded, lines }: SharedArgs): string {
  return cx(
    base.typography,
    tone && base[tone],
    weight && base[weight],
    unbounded && base.unbounded,
    lines ? base.clamp : undefined,
  );
}

/** Merges the caller's style with the line-clamp custom property. */
export function sharedStyle(style: CSSProperties | undefined, lines?: number): CSSProperties | undefined {
  if (!lines) return style;
  return { ...style, ['--typography-lines' as string]: lines } as CSSProperties;
}
