import clsx from 'clsx';
import type { ChangeEvent, InputHTMLAttributes, ReactNode, Ref } from 'react';
import { useCallback, useContext, useId, useLayoutEffect, useRef, useState } from 'react';
import { Body, Caption } from '../atoms/Typography';
import type { Size } from '../types';
import styles from './Checkbox.module.css';
import { CheckboxGroupContext } from './CheckboxContext';

/**
 * Checkbox following the OFFSET design system: a 2px ink box that fills with
 * --accent when checked.
 *
 * A real `<input type="checkbox">` does the work and is hidden from sight only,
 * so Space, form submission and the accessibility tree behave natively. The
 * label wraps it, which makes the whole row a hit target.
 *
 * `readOnly` is deliberately absent: browsers ignore it on a checkbox, so a prop
 * for it would only lie. Use `disabled`.
 *
 * @param label - Required. `hideLabel` hides it visually but keeps it announced.
 * @param indeterminate - The third visual state, for a parent whose children are
 * partly checked. Set as a DOM property rather than an attribute, which is the
 * only way it exists, and is what makes it announce as "mixed".
 * @param helper - Guidance under the control, kept while an error shows.
 * @param error - Validation message. Sets `aria-invalid` and announces.
 * @param size - Box size. Default is md.
 * @param ref - Forwarded to the underlying input.
 */

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'readOnly'
> {
  label: ReactNode;
  hideLabel?: boolean;
  size?: Size;
  helper?: ReactNode;
  error?: ReactNode;
  indeterminate?: boolean;
  ref?: Ref<HTMLInputElement>;
}

const CheckIcon = () => (
  <svg
    className={clsx(styles.icon, styles.check)}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3 8.5l3.5 3.5L13 5" />
  </svg>
);

const DashIcon = () => (
  <svg
    className={clsx(styles.icon, styles.dash)}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3.5 8h9" />
  </svg>
);

export function Checkbox({
  label,
  hideLabel = false,
  id: idProp,
  size: sizeProp,
  helper,
  error,
  indeterminate = false,
  disabled,
  required = false,
  name: nameProp,
  className,
  checked: checkedProp,
  defaultChecked,
  onChange,
  ref,
  ...rest
}: CheckboxProps) {
  const group = useContext(CheckboxGroupContext);
  const size: Size = sizeProp ?? group?.size ?? 'md';
  const name = nameProp ?? group?.name;
  const invalid = Boolean(error) || Boolean(group?.invalid);

  const generatedId = useId();
  const id = idProp ?? generatedId;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const isControlled = checkedProp !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(Boolean(defaultChecked));
  const checked = isControlled ? checkedProp : uncontrolledChecked;

  const innerRef = useRef<HTMLInputElement | null>(null);
  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as { current: HTMLInputElement | null }).current = node;
    },
    [ref],
  );

  /* indeterminate exists only as a DOM property, never as an attribute. */
  useLayoutEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate, checked]);

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
          [styles.invalid]: invalid,
          [styles.disabled]: disabled,
        })}
      >
        <input
          {...rest}
          ref={setRefs}
          id={id}
          type="checkbox"
          className={styles.input}
          name={name}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />

        <span className={styles.box} aria-hidden="true">
          <CheckIcon />
          <DashIcon />
        </span>

        <Body
          as="span"
          level={size === 'lg' ? 2 : 3}
          tone={disabled ? 'subtle' : 'default'}
          className={clsx(styles.labelText, { [styles.srOnly]: hideLabel })}
        >
          {label}
          {required ? (
            <span aria-hidden="true" style={{ color: 'var(--danger)' }}>
              {' '}
              *
            </span>
          ) : null}
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

export default Checkbox;
