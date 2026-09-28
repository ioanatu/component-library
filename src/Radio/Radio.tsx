import clsx from 'clsx';
import type { ChangeEvent, InputHTMLAttributes, ReactNode, Ref } from 'react';
import { useContext, useId } from 'react';
import type { Size } from '../types';
import { Body, Caption } from '../Typography';
import styles from './Radio.module.css';
import { RadioGroupContext } from './RadioContext';

/**
 * Radio following the OFFSET design system: a 2px ink circle that fills with
 * --accent and shows a dot when selected.
 *
 * A real `<input type="radio">` does the work and is hidden from sight only, so
 * form submission and the accessibility tree behave natively. Radios sharing a
 * name are one control to the browser: arrow keys move and select, and only the
 * selected one is in the tab order. That comes free, and only if the name is
 * shared — which is why RadioGroup always supplies one.
 *
 * Belongs inside a RadioGroup, which owns the selected value. Standalone, it
 * falls back to its own `checked`/`defaultChecked`; a lone radio cannot be
 * deselected, so reach for Checkbox or Toggle for a single on/off choice.
 *
 * `readOnly` is deliberately absent: browsers ignore it on a radio, so a prop for
 * it would only lie. Use `disabled`.
 *
 * Invalidity is announced on the group, not here: the radio role does not support
 * aria-invalid. The message itself is linked with aria-describedby either way.
 *
 * @param value - Submitted when selected, and what the group matches on.
 * @param label - Required. `hideLabel` hides it visually but keeps it announced.
 * @param size - Circle size. Falls back to the group's, then md.
 * @param helper - Guidance under the option. Prefer the group's for the whole set.
 * @param error - Validation message. Prefer the group's: a radio set fails as one.
 * @param ref - Forwarded to the underlying input.
 */

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'readOnly' | 'value'
> {
  value: string;
  label: ReactNode;
  hideLabel?: boolean;
  size?: Size;
  helper?: ReactNode;
  error?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export function Radio({
  value,
  label,
  hideLabel = false,
  id: idProp,
  size: sizeProp,
  helper,
  error,
  disabled,
  required: requiredProp,
  name: nameProp,
  className,
  checked: checkedProp,
  defaultChecked,
  onChange,
  ref,
  ...rest
}: RadioProps) {
  const group = useContext(RadioGroupContext);
  const size: Size = sizeProp ?? group?.size ?? 'md';
  const name = nameProp ?? group?.name;
  const required = requiredProp ?? group?.required;
  const invalid = Boolean(error) || Boolean(group?.invalid);

  const generatedId = useId();
  const id = idProp ?? generatedId;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  /* In a group the value is the group's; alone, the radio keeps its own. */
  const checked = group ? group.value === value : checkedProp;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    group?.onChange(event);
    onChange?.(event);
  };

  const describedBy =
    [rest['aria-describedby'], helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={clsx(styles.field, styles[size], className)}>
      <label
        htmlFor={id}
        className={clsx(styles.row, {
          [styles.invalid]: invalid,
          [styles.disabled]: disabled,
        })}
      >
        <input
          {...rest}
          ref={ref}
          id={id}
          type="radio"
          className={styles.input}
          name={name}
          value={value}
          checked={checked}
          defaultChecked={group ? undefined : defaultChecked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          aria-describedby={describedBy}
        />

        <span className={styles.circle} aria-hidden="true">
          <span className={styles.dot} />
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

export default Radio;
