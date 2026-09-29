import clsx from 'clsx';
import type { ChangeEvent, CSSProperties, InputHTMLAttributes, ReactNode, Ref } from 'react';
import { useId, useState } from 'react';
import { Body, Caption } from '../Typography';
import styles from './Slider.module.css';

/**
 * Slider following the OFFSET design system: a 2px ink track that fills with
 * --accent, and a thumb carrying the offset shadow.
 *
 * A real `<input type="range">`, painted rather than rebuilt, so arrows, Home/End,
 * Page Up/Down and the announced value all come from the browser.
 *
 * @param formatValue - Formats the shown value and sets aria-valuetext, so "60%" is
 * announced rather than "60".
 * @param showValue - The pill beside the track. On by default.
 * @param marks - Ticks under each step. Ignored past 40 steps, where they would be
 * too dense to read.
 */

const MAX_MARKS = 40;

export interface SliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'size'
> {
  label: string;
  hideLabel?: boolean;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number, event: ChangeEvent<HTMLInputElement>) => void;
  showValue?: boolean;
  marks?: boolean;
  formatValue?: (value: number) => string;
  helper?: ReactNode;
  error?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export function Slider({
  label,
  hideLabel = false,
  id: idProp,
  min = 0,
  max = 100,
  step = 1,
  value: valueProp,
  defaultValue,
  onChange,
  showValue = true,
  marks = false,
  formatValue,
  helper,
  error,
  disabled = false,
  className,
  ref,
  ...rest
}: SliderProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? min);
  const value = isControlled ? valueProp : uncontrolledValue;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    if (!isControlled) setUncontrolledValue(next);
    onChange?.(next, event);
  };

  const shown = formatValue ? formatValue(value) : String(value);
  const fill = max === min ? 0 : ((value - min) / (max - min)) * 100;

  const steps = step > 0 ? Math.round((max - min) / step) : 0;
  const showMarks = marks && steps > 0 && steps <= MAX_MARKS;

  const describedBy =
    [rest['aria-describedby'], helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={clsx(styles.field, { [styles.invalid]: Boolean(error) }, className)}>
      <label htmlFor={id} className={clsx(styles.label, { [styles.srOnly]: hideLabel })}>
        <Body as="span" level={3} weight="semibold">
          {label}
        </Body>
      </label>

      <div className={styles.row}>
        <div className={clsx(styles.control, { [styles.hasMarks]: showMarks })}>
          <input
            {...rest}
            ref={ref}
            id={id}
            type="range"
            className={styles.input}
            style={{ '--sl-fill': `${fill}%` } as CSSProperties}
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={handleChange}
            aria-valuetext={formatValue ? shown : undefined}
            aria-describedby={describedBy}
          />

          {showMarks ? (
            <span className={styles.marks} aria-hidden="true">
              {Array.from({ length: steps + 1 }, (_, index) => (
                <span
                  key={index}
                  className={styles.mark}
                  style={{ insetInlineStart: `${(index / steps) * 100}%` }}
                />
              ))}
            </span>
          ) : null}
        </div>

        {/* aria-hidden: the input already announces its value. */}
        {showValue ? (
          <Body as="span" level={3} mono unbounded aria-hidden="true" className={styles.value}>
            {shown}
          </Body>
        ) : null}
      </div>

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

export default Slider;
