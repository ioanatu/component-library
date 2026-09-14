import type { ElementType } from 'react';
import styles from './Caption.module.css';
import type { BaseTypographyProps } from '../Typography.types';
import { cx, sharedClasses, sharedStyle } from '../Typography.utils';

export type CaptionLevel = 1 | 2;

export interface CaptionProps extends BaseTypographyProps {
  /** 1 — helper text and figure captions (14). 2 — timestamps, fine print (12). */
  level?: CaptionLevel;
  /** Paints it danger and bumps the weight. For field validation messages. */
  error?: boolean;
  /** Defaults to p; "figcaption" inside a figure. */
  as?: ElementType;
}

/**
 * Caption — secondary explanatory text. Defaults to muted tone; `error`
 * overrides it for validation messages.
 */
export function Caption({
  level = 1,
  error = false,
  tone,
  weight,
  unbounded = false,
  lines,
  as,
  className,
  style,
  children,
  ...rest
}: CaptionProps) {
  const Tag = (as ?? 'p') as ElementType;

  return (
    <Tag
      className={cx(
        sharedClasses({ tone: tone ?? (error ? undefined : 'muted'), weight, unbounded, lines }),
        styles.caption,
        styles[`level${level}`],
        error && styles.error,
        className,
      )}
      style={sharedStyle(style, lines)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Caption;
