import type { BaseTypographyProps } from '../Typography.types';
import { cx, sharedClasses, sharedStyle } from '../Typography.utils';
import styles from './Code.module.css';

export type CodeLevel = 1 | 2;

export interface CodeProps extends Omit<BaseTypographyProps, 'as' | 'weight'> {
  /** 1 — standard (14). 2 — inside dense tables (13). */
  level?: CodeLevel;
  /** Render a <pre><code> block on the inverted code surface. */
  block?: boolean;
}

/**
 * Code — literal machine text: snippets, token names, keys, IDs. Mono here is
 * a signal of machine origin, not a style choice; using it for emphasis
 * destroys the only information it carries.
 */
export function Code({
  level = 1,
  block = false,
  tone = 'inherit',
  unbounded = true,
  lines,
  className,
  style,
  children,
  ...rest
}: CodeProps) {
  const shared = sharedClasses({ tone, unbounded, lines });

  if (block) {
    return (
      <pre
        className={cx(shared, styles.code, styles[`level${level}`], styles.block, className)}
        style={sharedStyle(style, lines)}
        {...rest}
      >
        <code className={styles.blockCode}>{children}</code>
      </pre>
    );
  }

  return (
    <code
      className={cx(shared, styles.code, styles[`level${level}`], styles.inline, className)}
      style={sharedStyle(style, lines)}
      {...rest}
    >
      {children}
    </code>
  );
}

export default Code;
