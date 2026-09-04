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
 * @param type - HTML button type. Default is 'button'. Ignored when href is set.
 * @param href - When set, the button renders as an anchor that navigates instead of a
 * button. A disabled or loading link drops its href so it cannot be followed.
 * @param label - Button text.
 * @param loading
 * @param disabled - Controls the disabled property of the HTML button.
 * @param ref - Forwarded to the underlying HTML button, or anchor when href is set.
 * @param onClick - Receives the click event, so an href handler can call
 * preventDefault to take over navigation. Not called while loading or disabled.
 */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  href?: string;
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => void;
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>;
}

export function Button({
  label,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  href,
  onClick,
  ref,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const classes = clsx(styles.button, styles[variant], styles[size], className);

  const handleAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    /**
     * A native disabled button fires no click at all. An anchor has no such
     * behaviour, so suppress the navigation and stop the event reaching an
     * ancestor handler.
     */
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  const content = (
    <>
      {loading ? <span className={styles.loadingSpinner} aria-hidden="true" /> : null}
      <span className={clsx({ [styles.loading]: loading }, styles.centerContent)}>{label}</span>
    </>
  );

  if (href !== undefined) {
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        className={classes}
        href={isDisabled ? undefined : href}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading}
        onClick={handleAnchorClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading}
      type={type}
      onClick={!loading ? onClick : undefined}
    >
      {content}
    </button>
  );
}
