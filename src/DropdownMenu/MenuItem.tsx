import clsx from 'clsx';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react';
import { useContext, useId } from 'react';
import { Body, Caption, Eyebrow } from '../Typography';
import styles from './DropdownMenu.module.css';
import { MenuContext } from './MenuContext';

/**
 * One action inside a DropdownMenu.
 *
 * Renders a `<button role="menuitem">`, or an `<a>` when given `href`. Items are
 * taken out of the tab order (`tabIndex={-1}`) because the menu moves focus itself
 * — that is what makes Arrow keys, Home/End and typeahead work as one control.
 *
 * `disabled` uses `aria-disabled` rather than the native attribute, so the item
 * stays focusable and the keyboard can still discover it. It simply does nothing.
 *
 * @param onSelect - Called on activation, before the menu closes.
 * @param closeOnSelect - Default true. False for an item that toggles something and
 * should leave the menu open.
 * @param destructive - Paints the item with --danger. For deletes.
 * @param icon - Leading decorative node, hidden from assistive tech.
 * @param shortcut - Trailing hint such as ⌘K. Decorative, and never the only way to
 * discover the action.
 */

interface BaseMenuItemProps {
  children: ReactNode;
  onSelect?: () => void;
  closeOnSelect?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  shortcut?: ReactNode;
  className?: string;
}

export interface MenuItemProps
  extends
    BaseMenuItemProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseMenuItemProps | 'type'> {
  href?: string;
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>;
}

export function MenuItem({
  children,
  onSelect,
  closeOnSelect = true,
  destructive = false,
  disabled = false,
  icon,
  shortcut,
  href,
  className,
  onClick,
  onKeyDown,
  ref,
  ...rest
}: MenuItemProps) {
  const menu = useContext(MenuContext);

  const handleClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onSelect?.();
    onClick?.(event as MouseEvent<HTMLButtonElement>);
    if (closeOnSelect) menu?.close({ focusTrigger: true });
  };

  /* A link does not activate on Space the way a button does. */
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    onKeyDown?.(event as KeyboardEvent<HTMLButtonElement>);
    if (href && event.key === ' ' && !disabled) {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  const content = (
    <>
      {icon ? (
        <span className={styles.adornment} aria-hidden="true">
          {icon}
        </span>
      ) : null}

      <Body as="span" level={3} tone="inherit" className={styles.label}>
        {children}
      </Body>

      {shortcut ? (
        <Caption as="span" level={2} aria-hidden="true" className={styles.shortcut}>
          {shortcut}
        </Caption>
      ) : null}
    </>
  );

  const classes = clsx(styles.item, { [styles.destructive]: destructive }, className);

  if (href !== undefined) {
    return (
      <a
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        ref={ref as Ref<HTMLAnchorElement>}
        role="menuitem"
        tabIndex={-1}
        className={classes}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      {...rest}
      ref={ref as Ref<HTMLButtonElement>}
      type="button"
      role="menuitem"
      tabIndex={-1}
      className={classes}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {content}
    </button>
  );
}

/** A rule between sets of items. `<hr>` already carries the separator role. */
export function MenuSeparator({ className }: { className?: string }) {
  return <hr className={clsx(styles.separator, className)} />;
}

/**
 * A named set of items. The label is tied to the group with aria-labelledby, so it
 * is announced as the group's name rather than read as a stray line of text.
 */
export function MenuGroup({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();

  return (
    <div role="group" aria-labelledby={id} className={className}>
      <Eyebrow id={id} className={styles.groupLabel}>
        {label}
      </Eyebrow>
      {children}
    </div>
  );
}

export default MenuItem;
