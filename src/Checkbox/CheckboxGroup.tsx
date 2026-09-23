import clsx from 'clsx';
import type { FieldsetHTMLAttributes, ReactNode, Ref } from 'react';
import { useId, useMemo } from 'react';
import { Body, Caption } from '../atoms/Typography';
import type { CheckboxOrientation, Size } from '../types';
import { CheckboxGroupContext } from './CheckboxContext';
import styles from './CheckboxGroup.module.css';

/**
 * Groups related checkboxes in a `<fieldset>` with a `<legend>`, which is what
 * makes a screen reader announce the group's name alongside each option.
 *
 * Checkboxes are reached with Tab and toggled with Space. There is no arrow-key
 * roving here: that belongs to radio groups, where the options are one control.
 *
 * `disabled` uses the native fieldset attribute, so it cascades to every control
 * inside without each one being told.
 *
 * @param label - The legend. `hideLabel` keeps it announced but off screen.
 * @param name - Shared form name, handed to every checkbox inside.
 * @param error - Group-level validation message. Marks the options invalid and
 * announces.
 * @param orientation - Stacked by default; horizontal wraps.
 * @param ref - Forwarded to the fieldset.
 */

export interface CheckboxGroupProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'children'
> {
  label: string;
  hideLabel?: boolean;
  name?: string;
  size?: Size;
  helper?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  orientation?: CheckboxOrientation;
  children: ReactNode;
  ref?: Ref<HTMLFieldSetElement>;
}

export function CheckboxGroup({
  label,
  hideLabel = false,
  id: idProp,
  name,
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
}: CheckboxGroupProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const context = useMemo(() => ({ name, size, invalid: Boolean(error) }), [name, size, error]);

  const describedBy =
    [rest['aria-describedby'], helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      {...rest}
      ref={ref}
      id={id}
      className={clsx(styles.group, className)}
      disabled={disabled}
      aria-describedby={describedBy}
    >
      <legend className={clsx(styles.legend, { [styles.srOnly]: hideLabel })}>
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

      <CheckboxGroupContext.Provider value={context}>
        <div
          className={clsx(styles.options, { [styles.horizontal]: orientation === 'horizontal' })}
        >
          {children}
        </div>
      </CheckboxGroupContext.Provider>

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

export default CheckboxGroup;
