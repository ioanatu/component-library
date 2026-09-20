import type { ElementType } from 'react';
import type { BaseTypographyProps } from '../Typography.types';
import { cx, sharedClasses, sharedStyle } from '../Typography.utils';
import styles from './Headline.module.css';

export type HeadlineLevel = 1 | 2 | 3 | 4 | 5;

export interface HeadlineProps extends BaseTypographyProps {
  /**
   * 1 — page title (40). 2 — section heading (30). 3 — card/dialog title (22).
   * 4 — subsection title (18). 5 — dense card and panel title (16).
   *
   * 4 and 5 share their steps with Body 1 and 2 but keep the heading's semibold
   * weight and tight leading, so they read as titles rather than running text.
   */
  level?: HeadlineLevel;
  /** Hairline rule beneath the heading. */
  ruled?: boolean;
  /**
   * Heading tag. Defaults to h{level}, which is right most of the time —
   * override when document outline and visual hierarchy legitimately differ.
   */
  as?: ElementType;
}

/**
 * Headline — titles. `level` drives both the visual step and the default tag,
 * so the common case needs one prop.
 */
export function Headline({
  level = 2,
  tone = 'default',
  weight,
  ruled = false,
  unbounded = false,
  lines,
  as,
  className,
  style,
  children,
  ...rest
}: HeadlineProps) {
  const Tag = (as ?? `h${level}`) as ElementType;

  return (
    <Tag
      className={cx(
        sharedClasses({ tone, weight, unbounded, lines }),
        styles.headline,
        styles[`level${level}`],
        ruled && styles.ruled,
        className,
      )}
      style={sharedStyle(style, lines)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Headline;
