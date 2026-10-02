import clsx from 'clsx';
import type { KeyboardEvent, ReactNode, RefObject } from 'react';
import { useEffect, useId, useRef } from 'react';
import type { DrawerAnchor, DrawerVariant, Size } from '../types';
import { Body, Eyebrow, Headline } from '../Typography';
import styles from './Drawer.module.css';

/**
 * Drawer following the OFFSET design system: a bordered panel on the offset shadow,
 * sliding in from one edge of the screen.
 *
 * `temporary` is modal, built on the native `<dialog>` like Modal: the focus trap,
 * Escape, the inert background and returning focus to the trigger are the browser's.
 * It closes on Escape, on the close button and on a backdrop click.
 *
 * `persistent` sits in the page beside the content and is a landmark, not a dialog.
 * Closed, it is `inert`, so its controls leave the tab order; if focus was inside
 * when it closes, focus goes back to where it was before it opened. The trigger
 * should carry `aria-expanded` and `aria-controls` pointing at `id`.
 *
 * `permanent` is always open: a landmark such as the main navigation.
 *
 * @param open - Controlled. Ignored by `permanent`.
 * @param onClose - Called by Escape, the close button and the backdrop. Without it,
 * a persistent drawer shows no close button.
 * @param title - Required: names the dialog or landmark.
 * @param anchor - Edge it comes from. Logical, so start is the right edge in RTL.
 * @param landmark - Element for persistent and permanent: aside, or nav for navigation.
 * @param dismissible - Temporary only. False removes the close button and makes
 * Escape and the backdrop inert, for a task that must be answered.
 * @param initialFocus - Focused on open instead of the first focusable element.
 */

export interface DrawerProps {
  open?: boolean;
  onClose?: () => void;
  title: string;
  eyebrow?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  variant?: DrawerVariant;
  anchor?: DrawerAnchor;
  size?: Size;
  landmark?: 'aside' | 'nav';
  dismissible?: boolean;
  closeLabel?: string;
  initialFocus?: RefObject<HTMLElement | null>;
  id?: string;
  className?: string;
}

export function Drawer({
  open = false,
  onClose,
  title,
  eyebrow,
  description,
  children,
  footer,
  variant = 'temporary',
  anchor = 'start',
  size = 'md',
  landmark = 'aside',
  dismissible = true,
  closeLabel = 'Close',
  initialFocus,
  id,
  className,
}: DrawerProps) {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const descriptionId = description ? `${generatedId}-description` : undefined;
  const modal = variant === 'temporary';
  const shown = variant === 'permanent' || open;
  const closable = variant !== 'permanent' && Boolean(onClose) && (!modal || dismissible);

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  /* Same contract as Modal: Escape and the backdrop route through onClose. */
  useEffect(() => {
    const el = dialogRef.current;
    if (!modal || !el) return;

    const onCancel = (event: Event) => {
      event.preventDefault();
      if (dismissible) onClose?.();
    };
    const onClick = (event: Event) => {
      if (dismissible && event.target === el) onClose?.();
    };

    el.addEventListener('cancel', onCancel);
    el.addEventListener('click', onClick);
    return () => {
      el.removeEventListener('cancel', onCancel);
      el.removeEventListener('click', onClick);
    };
  }, [modal, dismissible, onClose]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!modal || !el) return;
    if (open) {
      if (!el.open) el.showModal();
      initialFocus?.current?.focus();
    } else if (el.open) {
      el.close();
    }
  }, [modal, open, initialFocus]);

  useEffect(() => {
    if (!modal || !open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [modal, open]);

  /* A persistent drawer is not a dialog, so it hands focus back itself. */
  useEffect(() => {
    if (variant !== 'persistent') return;
    const panel = panelRef.current;
    if (open) {
      returnTo.current = document.activeElement as HTMLElement | null;
      initialFocus?.current?.focus();
    } else if (panel?.contains(document.activeElement)) {
      returnTo.current?.focus();
    }
  }, [variant, open, initialFocus]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (variant === 'persistent' && event.key === 'Escape' && onClose) {
      event.stopPropagation();
      onClose();
    }
  };

  const panel = (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.heading}>
          {eyebrow ? <Eyebrow className={styles.eyebrow}>{eyebrow}</Eyebrow> : null}
          <Headline level={3} id={titleId}>
            {title}
          </Headline>
        </div>
        {closable ? (
          <button type="button" className={styles.close} aria-label={closeLabel} onClick={onClose}>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        ) : null}
      </div>

      {description ? (
        <Body level={3} tone="muted" id={descriptionId} className={styles.description}>
          {description}
        </Body>
      ) : null}

      <div className={styles.body}>{children}</div>

      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  );

  if (modal)
    return (
      <dialog
        ref={dialogRef}
        id={id}
        className={clsx(styles.dialog, styles[anchor], styles[size], className)}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        {panel}
      </dialog>
    );

  const Landmark = landmark;

  return (
    <div
      className={clsx(styles.inPage, styles[anchor], styles[size], {
        [styles.collapsed]: !shown,
      })}
    >
      <Landmark
        ref={(node: HTMLElement | null) => {
          panelRef.current = node;
        }}
        id={id}
        className={clsx(styles.region, className)}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        inert={!shown}
        onKeyDown={onKeyDown}
      >
        {panel}
      </Landmark>
    </div>
  );
}

export default Drawer;
