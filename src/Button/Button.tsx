import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  loadingLabel?: string;
}

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    loadingLabel = 'Loading',
    type = 'button',
    ...props
  },
  ref,
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      className={cx(styles.button, styles[variant], styles[size], className)}
      disabled={isDisabled}
      aria-busy={isLoading}
      type={type}
      {...props}
    >
      {isLoading ? <span className={styles.loadingSpinner} aria-hidden="true" /> : null}
      <span>{children}</span>
      {isLoading ? <span className={styles.srOnly}>{loadingLabel}</span> : null}
    </button>
  );
});
