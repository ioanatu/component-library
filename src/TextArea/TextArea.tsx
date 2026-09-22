import clsx from 'clsx';
import type { ChangeEvent, ReactNode, Ref, TextareaHTMLAttributes } from 'react';
import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import { Caption, Label } from '../atoms/Typography';
import type { Size, TextAreaResize } from '../types';
import styles from './TextArea.module.css';

/**
 * Multi-line field following the OFFSET design system. It draws the same frame
 * as Input — 2px ink border, offset shadow carrying the state — and owns the
 * same wiring: a real `<label for>`, helper and error linked through
 * `aria-describedby`, `aria-invalid` on error, generated ids.
 *
 * It works controlled or uncontrolled. Pass `value` and it follows you; leave it
 * out and it keeps its own, which is what the character count reads.
 *
 * Unlike Input it carries no status icons or clear button: both want a vertical
 * centre a multi-line box does not have, and the corner they would sit in
 * belongs to the resize handle.
 *
 * @param label - Required, because an unlabelled field is broken for everyone
 * who cannot see where it sits. `hideLabel` hides it visually only.
 * @param id - The control's id. Generated when omitted.
 * @param size - Field size, which sets padding and type size. Default is md.
 * @param rows - Starting height in lines. Default is 3.
 * @param autoResize - Grow with the content instead of scrolling, up to
 * `maxRows`. Turns the drag handle off, since a box that sizes itself would
 * undo the drag on the next keystroke.
 * @param maxRows - Ceiling for `autoResize`. Past it the box scrolls.
 * @param resize - Direction the drag handle offers. Default is vertical;
 * horizontal is left out because it breaks the measure the field sits in.
 * @param showCount - Show a character count. Needs `maxLength` to show a limit.
 * @param helper - Guidance shown under the control, and kept there while an
 * error shows, since a hint that was true before is still true.
 * @param error - Validation message. Sets `aria-invalid`, shows the danger icon,
 * pairs its colour with a glyph so the state survives greyscale, and is
 * announced when it appears.
 * @param success - Validation passed. Shows the check icon and announces
 * `successLabel`, so the state is not carried by colour and icon alone. Error
 * outranks it: a field cannot be both.
 * @param required - Marks the control required and adds the glyph to the label.
 * @param optional - Renders the word "optional" after the label instead.
 * @param readOnly - Stays focusable and copyable; only the fill recedes.
 * @param disabled - Inert, and dropped from the tab order by the native attribute.
 * @param fullWidth - Stretches the field to its container.
 * @param ref - Forwarded to the underlying textarea.
 */

export interface TextAreaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size' | 'prefix'
> {
  label: string;
  hideLabel?: boolean;
  size?: Size;
  autoResize?: boolean;
  maxRows?: number;
  resize?: TextAreaResize;
  showCount?: boolean;
  helper?: ReactNode;
  error?: ReactNode;
  success?: boolean;
  successLabel?: string;
  optional?: boolean;
  fullWidth?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
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

export function TextArea({
  label,
  hideLabel = false,
  id: idProp,
  size = 'md',
  rows = 3,
  autoResize = false,
  maxRows,
  resize = 'vertical',
  showCount = false,
  helper,
  error,
  success = false,
  successLabel = 'Valid',
  required = false,
  optional = false,
  readOnly = false,
  disabled = false,
  fullWidth = false,
  maxLength,
  className,
  value: valueProp,
  defaultValue,
  onChange,
  ref,
  ...rest
}: TextAreaProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const limitId = showCount && maxLength !== undefined ? `${id}-limit` : undefined;

  /**
   * Uncontrolled fields keep their value here. The DOM node is always given a
   * `value`, never a `defaultValue`, so there is one source of truth either way
   * and the counter always reads the same string the user sees.
   */
  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    defaultValue === undefined ? '' : String(defaultValue),
  );
  const value = isControlled ? valueProp : uncontrolledValue;
  const length = String(value ?? '').length;

  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const setRefs = useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as { current: HTMLTextAreaElement | null }).current = node;
    },
    [ref],
  );

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setUncontrolledValue(event.target.value);
    onChange?.(event);
  };

  /**
   * Height is measured after the value lands but before paint, so a long initial
   * value never shows at the wrong size for a frame. The height is reset to auto
   * first, otherwise scrollHeight can only ever grow and the box would never
   * shrink back when text is deleted.
   *
   * scrollHeight counts the control's own padding, and the control is border-box,
   * so assigning it straight to height is right. The maxRows ceiling has to add
   * that padding back, or the cap would land short by one padding's worth.
   */
  useLayoutEffect(() => {
    const node = innerRef.current;
    if (!node || !autoResize) return;

    node.style.height = 'auto';

    if (maxRows) {
      const computed = getComputedStyle(node);
      const lineHeight =
        parseFloat(computed.lineHeight) || parseFloat(computed.fontSize) * 1.7 || 0;
      const padding =
        (parseFloat(computed.paddingBlockStart) || 0) + (parseFloat(computed.paddingBlockEnd) || 0);
      const ceiling = lineHeight * maxRows + padding;
      node.style.overflowY = node.scrollHeight > ceiling ? 'auto' : 'hidden';
      node.style.height = `${Math.min(node.scrollHeight, ceiling)}px`;
      return;
    }

    node.style.overflowY = 'hidden';
    node.style.height = `${node.scrollHeight}px`;
  }, [value, autoResize, maxRows]);

  const over = maxLength !== undefined && length > maxLength;

  /* Error outranks success: a field that has failed is not also passing, and
     showing both would leave the user to guess which one counts. */
  const status = error ? 'error' : success ? 'success' : undefined;

  /**
   * Both messages describe the control, as does the limit, and the caller may
   * have pointed at something else too — so these are merged, not overwritten.
   */
  const describedBy =
    [rest['aria-describedby'], helperId, errorId, limitId].filter(Boolean).join(' ') || undefined;

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
          [styles.hasStatus]: Boolean(status),
          [styles.readOnly]: readOnly && !disabled,
          [styles.disabled]: disabled,
        })}
      >
        <textarea
          {...rest}
          ref={setRefs}
          id={id}
          rows={rows}
          className={clsx(styles.control, {
            [styles.resizeNone]: autoResize || resize === 'none',
          })}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          required={required}
          readOnly={readOnly}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />

        {status ? (
          /* pointer-events are off in CSS, so the icon never steals a click that
             was meant for the text underneath it. */
          <span
            className={clsx(styles.status, {
              [styles.statusSuccess]: status === 'success',
              [styles.statusError]: status === 'error',
            })}
          >
            {status === 'success' ? <SuccessIcon /> : <ErrorIcon />}
          </span>
        ) : null}
      </div>

      {helper || error || showCount ? (
        <div className={styles.footer}>
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

          {showCount ? (
            /**
             * Hidden from assistive tech on purpose: announcing a new number on
             * every keystroke drowns out the typing itself. The limit is given
             * once, below, where it is read when the field takes focus.
             */
            <Caption
              level={2}
              aria-hidden="true"
              className={clsx(styles.counter, { [styles.counterOver]: over })}
            >
              {maxLength === undefined ? length : `${length} / ${maxLength}`}
            </Caption>
          ) : null}
        </div>
      ) : null}

      {limitId ? (
        <span id={limitId} className={styles.srOnly}>
          Maximum {maxLength} characters
        </span>
      ) : null}

      {/* The check is decorative, so the passing state is spoken here instead.
          Polite, because it does not interrupt what is being read. */}
      {status === 'success' ? (
        <span className={styles.srOnly} role="status">
          {successLabel}
        </span>
      ) : null}
    </div>
  );
}

export default TextArea;
