import clsx from 'clsx';
import type { ButtonHTMLAttributes, Ref } from 'react';
import type { ButtonSize, ButtonVariant } from '../types';
import styles from './Button.module.css';

type ButtonType = 'button' | 'reset' | 'submit';

/**
 * CTA button.
 *
 * @param variant - Button variant. Default is primary.
 * @param size - Button size. Default is medium.
 * @param type - HTML button type. Default is 'button'.
 * @param label - Button text.
 * @param loading
 * @param disabled - Controls the disabled property of the HTML button.
 * @param ref - Forwarded to the underlying HTML button.
 * @param onClick - Function with an optional event parameter.
 * Function is not assigned to HTML onClick if loading is true.
 */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  label,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  ref,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={clsx(styles.button, styles[variant], styles[size], className)}
      disabled={isDisabled}
      aria-busy={loading}
      type={type}
      onClick={!loading ? onClick : undefined}
    >
      {loading ? <span className={styles.loadingSpinner} aria-hidden="true" /> : null}
      <span className={clsx({ [styles.loading]: loading }, styles.centerContent)}>{label}</span>
    </button>
  );
}
