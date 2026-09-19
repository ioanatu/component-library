import type { ElementType } from 'react';
import type { BaseTypographyProps } from '../Typography.types';
import { cx, sharedClasses, sharedStyle } from '../Typography.utils';
import styles from './Eyebrow.module.css';

export type EyebrowLevel = 1 | 2;

export interface EyebrowProps extends Omit<BaseTypographyProps, 'weight'> {
  /** 1 — standard (12). 2 — dense cards and stat blocks (11). */
  level?: EyebrowLevel;
  /** Defaults to p. Use "span" when it sits inline with other content. */
  as?: ElementType;
}

/**
 * Eyebrow — the mono uppercase kicker. Tone defaults to muted because it
 * labels the thing below it; it is never the thing itself.
 */
export function Eyebrow({
  level = 1,
  tone,
  unbounded = false,
  lines,
  as,
  className,
  style,
  children,
  ...rest
}: EyebrowProps) {
  const Tag = (as ?? 'p') as ElementType;

  return (
    <Tag
      className={cx(
        sharedClasses({ tone, unbounded, lines }),
        styles.eyebrow,
        styles[`level${level}`],
        className,
      )}
      style={sharedStyle(style, lines)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Eyebrow;
