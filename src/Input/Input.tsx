import clsx from 'clsx';
import type { ChangeEvent, InputHTMLAttributes, ReactNode, Ref } from 'react';
import { useCallback, useId, useRef, useState } from 'react';
import type { InputType, Size } from '../types';
import { Caption, Label } from '../Typography';
import styles from './Input.module.css';

/**
 * Text field following the OFFSET design system: a 2px ink border and the
 * system's offset shadow, which carries the state — accent on
 * focus, danger when invalid.
 *
 * It works controlled or uncontrolled. Pass `value` for controlled and leave it
 * out for uncontrolled.
 *
 * @param label - Required, because an unlabelled field is broken for everyone
 * who cannot see where it sits. Use `hideLabel` when the design shows it by
 * position instead; the label stays in the accessibility tree either way.
 * @param id - The control's id. Generated when omitted.
 * @param size - Field size. Default is md, which clears the 44px touch target.
 * @param type - Text-like input types only. Checkbox, radio and file need their
 * own components rather than this frame.
 * @param helper - Guidance shown under the control, and kept there while an
 * error shows, since a hint that was true before is still true.
 * @param error - Validation message. Sets `aria-invalid`, shows the danger icon,
 * pairs the colour with a glyph so the state survives greyscale, and is
 * announced when it appears.
 * @param loading - Work is running against this field. Sets `aria-busy`, shows
 * a spinner and announces `loadingLabel` politely. Combine with `readOnly` to
 * stop edits while it runs.
 * @param success - Validation passed. Shows the check icon and announces
 * `successLabel`, so the state is not carried by colour and icon alone. Give it
 * a value to sit next to — a tick on an empty field says nothing.
 * @param clearable - Adds a button that empties the field. Hidden when there is
 * nothing to clear, and when the field is disabled or read-only.
 * @param onClear - Called after the field is emptied. Controlled callers also
 * receive the usual `onChange`, so either is enough to track it.
 * @param required - Marks the control required and adds the glyph to the label.
 * @param optional - Renders the word "optional" after the label instead.
 * @param readOnly - Stays focusable and copyable; only the fill recedes.
 * @param disabled - Inert, and dropped from the tab order by the native attribute.
 * @param leading - Decorative node inside the frame, before the input. Hidden
 * from assistive tech, so never put meaning here that is not also in the label.
 * @param trailing - Node inside the frame, after the input — a unit such as kWh
 * or €. Left exposed, so it can also hold a real control.
 * @param fullWidth - Stretches the field to its container.
 * @param ref - Forwarded to the underlying input.
 */

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'prefix'
> {
  label: string;
  hideLabel?: boolean;
  size?: Size;
  type?: InputType;
  helper?: ReactNode;
  error?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  success?: boolean;
  successLabel?: string;
  clearable?: boolean;
  clearLabel?: string;
  onClear?: () => void;
  optional?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  fullWidth?: boolean;
  ref?: Ref<HTMLInputElement>;
}

const SuccessIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3 8.5l3.5 3.5L13 5" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M8 4v5M8 12h.01" />
    <circle cx="8" cy="8" r="6.6" strokeWidth="1.6" />
  </svg>
);

const ClearIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);

export function Input({
  label,
  hideLabel = false,
  id: idProp,
  size = 'md',
  type = 'text',
  helper,
  error,
  loading = false,
  loadingLabel = 'Checking',
  success = false,
  successLabel = 'Valid',
  clearable = false,
  clearLabel,
  onClear,
  required = false,
  optional = false,
  readOnly = false,
  disabled = false,
  leading,
  trailing,
  fullWidth = false,
  className,
  value: valueProp,
  defaultValue,
  onChange,
  ref,
  ...rest
}: InputProps) {
  /* useId keeps the helper and error ids unique even when the same field is
     rendered twice on one page. */
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  /**
   * Uncontrolled fields keep their value here. The DOM node is always given a
   * `value`, never a `defaultValue`, so there is one source of truth either way
   * and React never sees a field switch modes mid-life.
   */
  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    defaultValue === undefined ? '' : String(defaultValue),
  );
  const value = isControlled ? valueProp : uncontrolledValue;
  const hasValue = String(value ?? '').length > 0;

  /* The clear button needs the node to restore focus, and the caller may want
     it too, so the two refs are merged rather than one winning. */
  const innerRef = useRef<HTMLInputElement | null>(null);
  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as { current: HTMLInputElement | null }).current = node;
    },
    [ref],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setUncontrolledValue(event.target.value);
    onChange?.(event);
  };

  const handleClear = useCallback(() => {
    const node = innerRef.current;
    if (!isControlled) setUncontrolledValue('');

    /**
     * A controlled caller only learns about the clear through onChange, so the
     * value is written with the native setter and a real input event is
     * dispatched. React listens for that event, so onChange fires exactly as it
     * would after a keystroke — no special-casing at the call site.
     */
    if (node) {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      setter?.call(node, '');
      node.dispatchEvent(new Event('input', { bubbles: true }));
    }

    onClear?.();

    /* The button unmounts the moment the field empties, and focus would be
       destroyed with it. It belongs on the input, which is where typing
       resumes. */
    node?.focus();
  }, [isControlled, onClear]);

  /* Loading outranks the rest: while work is running, whether the last value
     passed or failed is not yet the point. */
  const status = loading ? 'loading' : error ? 'error' : success ? 'success' : undefined;
  const showClear = clearable && hasValue && !disabled && !readOnly;

  /**
   * Both messages describe the control, and the caller may have pointed at
   * something else as well — so these are merged rather than overwritten.
   */
  const describedBy =
    [rest['aria-describedby'], helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={clsx(styles.field, { [styles.fullWidth]: fullWidth }, className)}>
      <Label
        htmlFor={id}
        required={required}
        optional={optional}
        disabled={disabled}
        className={clsx({ [styles.srOnly]: hideLabel })}
      >
        {label}
      </Label>

      <div
        className={clsx(styles.shell, styles[size], {
          [styles.invalid]: Boolean(error),
          [styles.valid]: status === 'success',
          [styles.readOnly]: readOnly && !disabled,
          [styles.disabled]: disabled,
        })}
      >
        {leading ? (
          <span className={styles.adornment} aria-hidden="true">
            {leading}
          </span>
        ) : null}

        <input
          {...rest}
          ref={setRefs}
          id={id}
          type={type}
          className={styles.control}
          value={value}
          onChange={handleChange}
          required={required}
          readOnly={readOnly}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-busy={loading || undefined}
          aria-describedby={describedBy}
        />

        {status ? (
          <span
            className={clsx(styles.status, {
              [styles.statusSuccess]: status === 'success',
              [styles.statusError]: status === 'error',
            })}
          >
            {status === 'loading' ? <span className={styles.spinner} aria-hidden="true" /> : null}
            {status === 'success' ? <SuccessIcon /> : null}
            {status === 'error' ? <ErrorIcon /> : null}
          </span>
        ) : null}

        {showClear ? (
          <button
            type="button"
            className={styles.clear}
            onClick={handleClear}
            aria-label={clearLabel ?? `Clear ${label}`}
          >
            <ClearIcon />
          </button>
        ) : null}

        {trailing ? <span className={styles.adornment}>{trailing}</span> : null}
      </div>

      {helper || error ? (
        <div className={styles.messages}>
          {helper ? <Caption id={helperId}>{helper}</Caption> : null}
          {error ? (
            /* role="alert" so a message that appears after a blur or a failed
               submit is read out, rather than sitting there silently. */
            <Caption id={errorId} role="alert" error className={styles.error}>
              <span aria-hidden="true">⚠</span>
              {error}
            </Caption>
          ) : null}
        </div>
      ) : null}

      {/* The icons are decorative, so the busy and valid states are spoken here
          instead. Polite, because neither interrupts what is being read. */}
      {loading ? (
        <span className={styles.srOnly} role="status">
          {loadingLabel}
        </span>
      ) : null}
      {status === 'success' ? (
        <span className={styles.srOnly} role="status">
          {successLabel}
        </span>
      ) : null}
    </div>
  );
}

export default Input;
