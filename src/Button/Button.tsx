import clsx from 'clsx';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import type { ButtonVariant, Size } from '../types';
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
 * @param children - Button content.
 * @param loading
 * @param disabled - Controls the disabled property of the HTML button.
 * @param ref - Forwarded to the underlying HTML button, or anchor when href is set.
 * @param onClick - Receives the click event, so an href handler can call
 * preventDefault to take over navigation. Not called while loading or disabled.
 */

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: Size;
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => void;
}

export interface ButtonElementProps
  extends
    BaseButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'children'> {
  href?: never;
  type?: ButtonType;
  ref?: Ref<HTMLButtonElement>;
}

export interface AnchorElementProps
  extends
    BaseButtonProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick' | 'children'> {
  href: string;
  type?: never;
  ref?: Ref<HTMLAnchorElement>;
}

export type ButtonProps = ButtonElementProps | AnchorElementProps;

export function Button({
  children,
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
      <span className={clsx({ [styles.loading]: loading }, styles.centerContent)}>{children}</span>
    </>
  );

  if (href !== undefined) {
    return (
      <a
        ref={ref}
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
      ref={ref}
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

// TODO: make accessible name not disappear when button is loading
