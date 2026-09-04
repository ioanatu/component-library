import clsx from 'clsx';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import type { ChipVariant, LibSize } from '../types';
import styles from './Chip.module.css';

type ChipMouseEvent = React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>;
type ChipDeleteEvent = React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent;

/**
 * Compact label for an attribute, a filter or a selection.
 *
 * The chip picks its element from the props it is given: a plain `span` when it
 * is decorative, a `button` when `onClick` is set, an anchor when `href` is set.
 * A deletable chip wraps that element in a `span` so the remove control can be a
 * real sibling button — nesting one button inside another is invalid HTML, and a
 * click target that is not a button cannot be reached by keyboard.
 *
 * @param label - Chip text, and the fallback accessible name of the remove button.
 * @param variant - Chip variant. Default is primary.
 * @param size - Chip size. Default is md.
 * @param icon - Decorative node rendered before the label. Hidden from assistive tech.
 * @param avatar - Node rendered flush against the leading edge, for an image or initials.
 * Takes precedence over `icon`, and is left exposed to assistive tech: pass an
 * `alt=""` image when it is purely decorative.
 * @param href - When set, the chip navigates. A disabled link drops its href so it
 * cannot be followed.
 * @param disabled - Suppresses clicks, navigation and deletion.
 * @param onClick - Makes the chip a button. Not called while disabled.
 * @param onDelete - Adds a remove button after the label. Also called on Backspace or
 * Delete released inside the chip, matching the Material UI chip.
 * @param deleteIcon - Replaces the default cross in the remove button.
 * @param deleteLabel - Accessible name for the remove button. Default is `Remove {label}`.
 * @param ref - Forwarded to the outermost element.
 */

export interface ChipProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  label: string;
  variant?: ChipVariant;
  size?: LibSize;
  icon?: ReactNode;
  avatar?: ReactNode;
  href?: string;
  disabled?: boolean;
  deleteIcon?: ReactNode;
  deleteLabel?: string;
  onClick?: (event: ChipMouseEvent) => void;
  onDelete?: (event: ChipDeleteEvent) => void;
  ref?: Ref<HTMLElement>;
}

const DeleteCross = () => (
  <svg
    className={styles.deleteIcon}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
  </svg>
);

export function Chip({
  label,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  avatar,
  href,
  disabled = false,
  deleteIcon,
  deleteLabel,
  onClick,
  onDelete,
  ref,
  ...rest
}: ChipProps) {
  /**
   * Only the deletable chip wraps its own key handling around the consumer's, so
   * the other shapes hand onKeyDown and onKeyUp straight to the element via rest.
   */
  const { onKeyDown, onKeyUp, ...rootProps } = rest;
  const isInteractive = href !== undefined || onClick !== undefined;
  const classes = clsx(
    styles.chip,
    styles[variant],
    styles[size],
    { [styles.clickable]: isInteractive },
    className,
  );

  const handleAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    /**
     * A native disabled button fires no click at all. An anchor has no such
     * behaviour, so suppress the navigation and stop the event reaching an
     * ancestor handler.
     */
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    /* Removing a chip should not also trigger the row or card it sits in. */
    event.stopPropagation();
    onDelete?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);

    /* Backspace navigates back in some browsers. Claim it before that happens. */
    if (!disabled && (event.key === 'Backspace' || event.key === 'Delete')) {
      event.preventDefault();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyUp?.(event);

    if (disabled) return;

    if (event.key === 'Escape') {
      (event.target as HTMLElement).blur();
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      onDelete?.(event);
    }
  };

  let adornment: ReactNode = null;
  if (avatar) {
    adornment = <span className={styles.avatar}>{avatar}</span>;
  } else if (icon) {
    adornment = (
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    );
  }

  const content = (
    <>
      {adornment}
      <span className={styles.label}>{label}</span>
    </>
  );

  if (onDelete === undefined) {
    if (href !== undefined) {
      return (
        <a
          {...rest}
          ref={ref as Ref<HTMLAnchorElement>}
          className={classes}
          href={disabled ? undefined : href}
          aria-disabled={disabled || undefined}
          onClick={handleAnchorClick}
        >
          {content}
        </a>
      );
    }

    if (onClick !== undefined) {
      return (
        <button
          {...rest}
          ref={ref as Ref<HTMLButtonElement>}
          className={classes}
          type="button"
          disabled={disabled}
          onClick={onClick}
        >
          {content}
        </button>
      );
    }

    return (
      <span
        {...rest}
        ref={ref as Ref<HTMLSpanElement>}
        className={classes}
        aria-disabled={disabled || undefined}
      >
        {content}
      </span>
    );
  }

  /**
   * The action stretches into the chip's leading padding so the whole pill, and
   * not just the text, is clickable.
   */
  let action: ReactNode = content;
  if (href !== undefined) {
    action = (
      /* eslint-disable-next-line jsx-a11y/anchor-is-valid --
         the href is only ever dropped while disabled, mirroring a disabled button. */
      <a
        className={styles.action}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        onClick={handleAnchorClick}
      >
        {content}
      </a>
    );
  } else if (onClick !== undefined) {
    action = (
      <button className={styles.action} type="button" disabled={disabled} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    /* eslint-disable-next-line jsx-a11y/no-static-element-interactions --
       the wrapper is not the control. It listens for keys released by the real
       buttons inside it, which carry the focus and the roles themselves. */
    <span
      {...rootProps}
      ref={ref as Ref<HTMLSpanElement>}
      className={clsx(classes, styles.hasDelete)}
      aria-disabled={disabled || undefined}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {action}
      <button
        className={styles.delete}
        type="button"
        disabled={disabled}
        aria-label={deleteLabel ?? `Remove ${label}`}
        onClick={handleDeleteClick}
      >
        {deleteIcon ?? <DeleteCross />}
      </button>
    </span>
  );
}
