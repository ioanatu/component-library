import clsx from 'clsx';
import type { ReactNode, RefObject } from 'react';
import { useEffect, useId, useRef } from 'react';
import type { Size } from '../types';
import { Body, Eyebrow, Headline } from '../Typography';
import styles from './Modal.module.css';

/**
 * Modal following the OFFSET design system: a bordered surface on the offset
 * shadow, over the ink scrim.
 *
 * Built on the native `<dialog>` with `showModal()`, so the focus trap, Escape, the
 * inert background and returning focus to whatever opened it are the browser's job
 * rather than ours. It also renders in the top layer, so no ancestor's
 * `overflow: hidden` or z-index can clip it.
 *
 * For a task that must be finished or abandoned before anything else. An outcome
 * the user need not acknowledge is a Toast.
 *
 * @param open - Controlled. There is no uncontrolled mode: something outside always
 * owns whether a dialog is up.
 * @param title - Required, and it names the dialog through aria-labelledby.
 * @param dismissible - Default true. False removes the close button and makes
 * Escape and the backdrop inert, for a task that must be answered.
 * @param initialFocus - Focused on open instead of the first focusable element.
 */

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: Size;
  dismissible?: boolean;
  closeLabel?: string;
  initialFocus?: RefObject<HTMLElement | null>;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  description,
  children,
  footer,
  size = 'md',
  dismissible = true,
  closeLabel = 'Close',
  initialFocus,
  className,
}: ModalProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = description ? `${id}-description` : undefined;
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  /**
   * Escape fires `cancel` before the browser closes the dialog. Cancelling it keeps
   * React the only thing that opens and closes this, so the two cannot disagree.
   *
   * The backdrop click is a DOM listener rather than onClick: a dialog is not an
   * interactive element, and its keyboard equivalent is Escape, handled just above.
   */
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    const onCancel = (event: Event) => {
      event.preventDefault();
      if (dismissible) onClose();
    };

    /* Only a backdrop click reaches the dialog; the panel swallows its own. */
    const onClick = (event: Event) => {
      if (dismissible && event.target === el) onClose();
    };

    el.addEventListener('cancel', onCancel);
    el.addEventListener('click', onClick);
    return () => {
      el.removeEventListener('cancel', onCancel);
      el.removeEventListener('click', onClick);
    };
  }, [dismissible, onClose]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
      initialFocus?.current?.focus();
    } else if (el.open) {
      el.close();
    }
  }, [open, initialFocus]);

  /* showModal makes the background inert, but does not stop it scrolling. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={clsx(styles.dialog, styles[size], className)}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.heading}>
            {eyebrow ? <Eyebrow className={styles.eyebrow}>{eyebrow}</Eyebrow> : null}
            <Headline level={3} id={titleId} className={styles.title}>
              {title}
            </Headline>
          </div>

          {dismissible ? (
            <button
              type="button"
              className={styles.close}
              aria-label={closeLabel}
              onClick={onClose}
            >
              <span aria-hidden="true">✕</span>
            </button>
          ) : null}
        </div>

        {description ? (
          <Body level={3} tone="muted" id={descriptionId} className={styles.description}>
            {description}
          </Body>
        ) : null}

        {children}

        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </dialog>
  );
}

export default Modal;
