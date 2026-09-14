import type { ElementType } from 'react';
import base from '../Typography.module.css';
import styles from './Display.module.css';
import type { BaseTypographyProps } from '../Typography.types';
import { cx, sharedClasses, sharedStyle } from '../Typography.utils';

export type DisplayLevel = 1 | 2;

export interface DisplayProps extends Omit<BaseTypographyProps, 'weight'> {
  /** 1 — fluid, scales with the viewport (56px → 76px). 2 — fixed 56px. */
  level?: DisplayLevel;
  /** Rendered tag. Defaults to h1; pass `as` when this is not the page title. */
  as?: ElementType;
}

/**
 * Display — the largest type in the system. Never use it inside a component,
 * where it would fight its container.
 */
export function Display({
  level = 1,
  tone = 'default',
  unbounded = false,
  lines,
  as,
  className,
  style,
  children,
  ...rest
}: DisplayProps) {
  const Tag = (as ?? 'h1') as ElementType;

  return (
    <Tag
      className={cx(sharedClasses({ tone, unbounded, lines }), styles.display, styles[`level${level}`], className)}
      style={sharedStyle(style, lines)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Display;
