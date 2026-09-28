import clsx from 'clsx';
import type { ReactNode, Ref } from 'react';
import { useEffect, useState } from 'react';
import type { ToastPlacement, ToastTone } from '../types';
import { Body } from '../Typography';
import styles from './Toast.module.css';

/**
 * Toast following the OFFSET design system: a bordered surface with the offset
 * shadow, floating over the page.
 *
 * For an outcome the user does not have to acknowledge. An error that needs a
 * decision belongs in a dialog, not here — a toast can be missed.
 *
 * Announced without stealing focus: `role="status"` and polite by default,
 * `role="alert"` and assertive for an error, per the design system's spec.
 *
 * @param tone - success, error, warning or info. Also decides the icon and shadow.
 * @param title - The outcome, in a few words.
 * @param children - Optional detail under the title.
 * @param action - A single control, e.g. Undo. Keep it optional: a toast may vanish.
 * @param duration - ms before it dismisses itself. 0 never does, which is the
 * default for an error. Hovering or focusing the toast holds the timer.
 */

const ICONS: Record<ToastTone, ReactNode> = {
  success: <path d="M3 8.5l3.5 3.5L13 5" />,
  error: <path d="M5 5l6 6M11 5l-6 6" />,
  warning: (
    <>
      <path d="M8 2.5L14.5 14h-13z" />
      <path d="M8 6.5v3.2M8 12h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 7.2v4M8 4.8h.01" />
    </>
  ),
};

const PLACEMENT_CLASS: Record<ToastPlacement, string> = {
  'bottom-right': styles.bottomRight,
  'bottom-left': styles.bottomLeft,
  'bottom-center': styles.bottomCenter,
  'top-right': styles.topRight,
  'top-left': styles.topLeft,
  'top-center': styles.topCenter,
};

export interface ToastProps {
  tone?: ToastTone;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  duration?: number;
  onDismiss?: () => void;
  dismissible?: boolean;
  dismissLabel?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function Toast({
  tone = 'info',
  title,
  children,
  action,
  duration,
  onDismiss,
  dismissible = true,
  dismissLabel = 'Dismiss',
  className,
  ref,
}: ToastProps) {
  const assertive = tone === 'error';
  const timeout = duration ?? (assertive ? 0 : 5000);
  const [held, setHeld] = useState(false);

  /* WCAG 2.2.1: pointer or keyboard on the toast holds the countdown. */
  useEffect(() => {
    if (!timeout || held || !onDismiss) return;
    const timer = window.setTimeout(onDismiss, timeout);
    return () => window.clearTimeout(timer);
  }, [timeout, held, onDismiss]);

  return (
    <div
      ref={ref}
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={clsx(styles.toast, styles[tone], className)}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <span className={styles.icon} aria-hidden="true">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
        >
          {ICONS[tone]}
        </svg>
      </span>

      <div className={styles.text}>
        <Body level={3} weight="semibold" unbounded>
          {title}
        </Body>
        {children ? (
          <Body level={3} tone="muted" unbounded>
            {children}
          </Body>
        ) : null}
        {action ? <div className={styles.action}>{action}</div> : null}
      </div>

      {dismissible && onDismiss ? (
        <button
          type="button"
          className={styles.dismiss}
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <span aria-hidden="true">✕</span>
        </button>
      ) : null}
    </div>
  );
}

/**
 * Fixed container for toasts. Render it once, high in the tree, and keep it
 * mounted: a live region that arrives at the same moment as its content is
 * unreliable, so the region should already be there.
 *
 * @param placement - Which edge the stack sits on. Bottom placements stack upwards,
 * so the newest toast is always nearest the edge.
 */
export function ToastRegion({
  placement = 'bottom-right',
  label = 'Notifications',
  children,
  className,
}: {
  placement?: ToastPlacement;
  label?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="region"
      aria-label={label}
      className={clsx(styles.region, PLACEMENT_CLASS[placement], className)}
    >
      {children}
    </div>
  );
}

export default Toast;
