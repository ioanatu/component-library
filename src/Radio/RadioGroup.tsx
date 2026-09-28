import clsx from 'clsx';
import type { ChangeEvent, FieldsetHTMLAttributes, ReactNode, Ref } from 'react';
import { useCallback, useId, useMemo, useState } from 'react';
import type { Orientation, Size } from '../types';
import { Body, Caption } from '../Typography';
import { RadioGroupContext } from './RadioContext';
import styles from './RadioGroup.module.css';

/**
 * Groups radios into the single control they are, in a `<fieldset>` with a
 * `<legend>`, so a screen reader announces the group's name alongside each
 * option. `role="radiogroup"` names it a radio group rather than a plain one, and
 * aria-labelledby points at the legend so the name survives the role change.
 *
 * The group owns the selected value; each Radio only declares its own. It also
 * supplies the shared `name` — generating one when none is given, because arrow
 * keys rove between radios only while they share it.
 *
 * `disabled` uses the native fieldset attribute, so it cascades to every radio
 * inside without each one being told.
 *
 * @param label - The legend. `hideLabel` keeps it announced but off screen.
 * @param value - Selected value. `null` is controlled with nothing selected; omit
 * it entirely for uncontrolled and use `defaultValue`.
 * @param onChange - Receives the new value, then the change event.
 * @param name - Shared form name. Generated when omitted.
 * @param error - Group-level validation message. Marks the options invalid and
 * announces. This is the right place for it: a radio set fails as one.
 * @param orientation - Stacked by default; horizontal wraps.
 * @param ref - Forwarded to the fieldset.
 */

export interface RadioGroupProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'children' | 'onChange'
> {
  label: string;
  hideLabel?: boolean;
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  size?: Size;
  helper?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  orientation?: Orientation;
  children: ReactNode;
  ref?: Ref<HTMLFieldSetElement>;
}

export function RadioGroup({
  label,
  hideLabel = false,
  id: idProp,
  value: valueProp,
  defaultValue,
  onChange,
  name: nameProp,
  size,
  helper,
  error,
  required = false,
  orientation = 'vertical',
  disabled,
  className,
  children,
  ref,
  ...rest
}: RadioGroupProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const legendId = `${id}-legend`;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const name = nameProp ?? `${id}-name`;

  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = (isControlled ? valueProp : uncontrolledValue) ?? undefined;

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setUncontrolledValue(event.target.value);
      onChange?.(event.target.value, event);
    },
    [isControlled, onChange],
  );

  const context = useMemo(
    () => ({ name, value, size, invalid: Boolean(error), required, onChange: handleChange }),
    [name, value, size, error, required, handleChange],
  );

  const describedBy =
    [rest['aria-describedby'], helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      {...rest}
      ref={ref}
      id={id}
      className={clsx(styles.group, className)}
      disabled={disabled}
      role="radiogroup"
      aria-labelledby={legendId}
      aria-describedby={describedBy}
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend id={legendId} className={clsx(styles.legend, { [styles.srOnly]: hideLabel })}>
        <Body as="span" level={2} weight="semibold">
          {label}
          {required ? (
            <span aria-hidden="true" style={{ color: 'var(--danger)' }}>
              {' '}
              *
            </span>
          ) : null}
        </Body>
      </legend>

      <RadioGroupContext.Provider value={context}>
        <div
          className={clsx(styles.options, { [styles.horizontal]: orientation === 'horizontal' })}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>

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
    </fieldset>
  );
}

export default RadioGroup;
