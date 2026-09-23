import clsx from 'clsx';
import type { ChangeEvent, InputHTMLAttributes, ReactNode, Ref } from 'react';
import { useId, useState } from 'react';
import type { Size } from '../types';
import { Body, Caption } from '../Typography';
import styles from './Toggle.module.css';

/**
 * Toggle following the OFFSET design system: a 2px ink track with the offset
 * shadow and an ink thumb that slides.
 *
 * A real `<input type="checkbox">` carries `role="switch"`, so it announces on
 * and off rather than checked and unchecked, and Space still operates it. The
 * label wraps it, making the whole row a hit target.
 *
 * A switch applies immediately — it is not a checkbox awaiting submit. Use
 * Checkbox when the change only takes effect with the form.
 *
 * `readOnly` is absent: browsers ignore it on a checkbox, so a prop for it would
 * only lie. Use `disabled`.
 *
 * @param label - Required. `hideLabel` hides it visually but keeps it announced.
 * @param size - Track size. Default is md.
 * @param helper - Guidance under the control, kept while an error shows.
 * @param error - Validation message. Sets `aria-invalid` and announces.
 * @param ref - Forwarded to the underlying input.
 */

export interface ToggleProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'readOnly'
> {
  label: ReactNode;
  hideLabel?: boolean;
  size?: Size;
  helper?: ReactNode;
  error?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export function Toggle({
  label,
  hideLabel = false,
  id: idProp,
  size = 'md',
  helper,
  error,
  disabled,
  className,
  checked: checkedProp,
  defaultChecked,
  onChange,
  ref,
  ...rest
}: ToggleProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const isControlled = checkedProp !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(Boolean(defaultChecked));
  const checked = isControlled ? checkedProp : uncontrolledChecked;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setUncontrolledChecked(event.target.checked);
    onChange?.(event);
  };

  const describedBy =
    [rest['aria-describedby'], helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={clsx(styles.field, styles[size], className)}>
      <label
        htmlFor={id}
        className={clsx(styles.row, {
          [styles.invalid]: Boolean(error),
          [styles.disabled]: disabled,
        })}
      >
        <input
          {...rest}
          ref={ref}
          id={id}
          type="checkbox"
          role="switch"
          className={styles.input}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />

        <span className={styles.track} aria-hidden="true">
          <span className={styles.thumb} />
        </span>

        <Body
          as="span"
          level={size === 'lg' ? 2 : 3}
          tone={disabled ? 'subtle' : 'default'}
          className={clsx(styles.labelText, { [styles.srOnly]: hideLabel })}
        >
          {label}
        </Body>
      </label>

      {helper || error ? (
        <div className={styles.messages}>
          {helper ? <Caption id={helperId}>{helper}</Caption> : null}
          {error ? (
            <Caption id={errorId} role="alert" error className={styles.error}>
              <span aria-hidden="true">⚠</span>
              {error}
            </Caption>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default Toggle;
