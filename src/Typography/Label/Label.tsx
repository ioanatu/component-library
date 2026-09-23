import type { BaseTypographyProps } from '../Typography.types';
import { cx, sharedClasses, sharedStyle } from '../Typography.utils';
import styles from './Label.module.css';

export type LabelLevel = 1 | 2;

export interface LabelProps extends Omit<BaseTypographyProps, 'as'> {
  /** 1 — standard (14). 2 — dense inline forms and toolbars (12). */
  level?: LabelLevel;
  /** The control's id. A label without it is decoration, not a label. */
  htmlFor: string;
  /** Visible glyph, not colour alone. Pair with `required` on the input. */
  required?: boolean;
  /** Renders the word "optional" after the text. */
  optional?: boolean;
  disabled?: boolean;
}

/**
 * Label — always a real <label>. `htmlFor` is required by the type, because
 * the accessible pairing is the entire point of the component.
 */
export function Label({
  level = 1,
  htmlFor,
  required = false,
  optional = false,
  disabled = false,
  tone = 'default',
  weight = 'semibold',
  unbounded = false,
  lines,
  className,
  style,
  children,
  ...rest
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cx(
        sharedClasses({ tone, weight, unbounded, lines }),
        styles.label,
        styles[`level${level}`],
        disabled && styles.disabled,
        className,
      )}
      style={sharedStyle(style, lines)}
      {...rest}
    >
      {children}
      {required ? (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      ) : null}
      {optional ? <span className={styles.optional}>optional</span> : null}
    </label>
  );
}

export default Label;
