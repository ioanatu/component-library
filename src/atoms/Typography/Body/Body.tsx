import type { ElementType } from 'react';
import styles from './Body.module.css';
import type { BaseTypographyProps } from '../Typography.types';
import { cx, sharedClasses, sharedStyle } from '../Typography.utils';

export type BodyLevel = 1 | 2 | 3;

export interface BodyProps extends BaseTypographyProps {
  /** 1 — lead (18, one per screen). 2 — body (16, the default). 3 — small (14). */
  level?: BodyLevel;
  /** Render in JetBrains Mono. Machine output only; never a sentence. */
  mono?: boolean;
  /** Defaults to p. Use "span" inside a sentence or a table cell. */
  as?: ElementType;
}

/**
 * Body — running text. Each level carries its own line height and measure,
 * so long passages stay readable without per-instance tuning.
 */
export function Body({
  level = 2,
  tone = 'default',
  weight,
  mono = false,
  unbounded = false,
  lines,
  as,
  className,
  style,
  children,
  ...rest
}: BodyProps) {
  const Tag = (as ?? 'p') as ElementType;

  return (
    <Tag
      className={cx(
        sharedClasses({ tone, weight, unbounded, lines }),
        styles.body,
        styles[`level${level}`],
        mono && styles.mono,
        className,
      )}
      style={sharedStyle(style, lines)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Body;
