import clsx from 'clsx';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react';
import { useContext, useId, useState } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
import { Body, Caption, Eyebrow } from '../Typography';
import styles from './DropdownMenu.module.css';
import { MenuContext } from './MenuContext';

/**
 * One action inside a DropdownMenu: a `<button role="menuitem">`, or an `<a>` with
 * `href`. `tabIndex={-1}` because the menu moves focus itself, and `disabled` is
 * `aria-disabled` so the item stays keyboard-discoverable while doing nothing.
 *
 * @param closeOnSelect - Default true. False to leave the menu open.
 * @param destructive - Paints the item with --danger.
 * @param shortcut - Decorative hint; never the only way to find the action.
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

interface BaseCheckboxItemProps {
  children: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  closeOnSelect?: boolean;
  disabled?: boolean;
  shortcut?: ReactNode;
  className?: string;
}

export interface MenuCheckboxItemProps
  extends BaseCheckboxItemProps, Omit<HTMLAttributes<HTMLDivElement>, keyof BaseCheckboxItemProps> {
  ref?: Ref<HTMLDivElement>;
}

/**
 * A menu item that toggles, drawn with the library's Checkbox. A `<div>`, not a
 * `<button>`: a button may not contain an input. Enter and Space are handled here
 * because a div does not activate on its own.
 *
 * @param checked - Controlled state. Use `defaultChecked` for uncontrolled.
 * @param onCheckedChange - Receives the state it is moving to.
 * @param closeOnSelect - Default false, so several can be toggled in a row.
 */
export function MenuCheckboxItem({
  children,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  closeOnSelect = false,
  disabled = false,
  shortcut,
  className,
  onClick,
  onKeyDown,
  ref,
  ...rest
}: MenuCheckboxItemProps) {
  const menu = useContext(MenuContext);

  const isControlled = checkedProp !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(Boolean(defaultChecked));
  const checked = isControlled ? checkedProp : uncontrolledChecked;

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setUncontrolledChecked(next);
    onCheckedChange?.(next);
    if (closeOnSelect) menu?.close({ focusTrigger: true });
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    toggle();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  };

  return (
    <div
      {...rest}
      ref={ref}
      role="menuitemcheckbox"
      tabIndex={-1}
      className={clsx(styles.item, className)}
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Checkbox
        className={styles.checkboxSlot}
        label={children}
        size="sm"
        checked={checked}
        disabled={disabled}
        onChange={() => {}}
        aria-hidden="true"
        tabIndex={-1}
      />

      {shortcut ? (
        <Caption as="span" level={2} aria-hidden="true" className={styles.shortcut}>
          {shortcut}
        </Caption>
      ) : null}
    </div>
  );
}

/** A rule between sets of items. `<hr>` already carries the separator role. */
export function MenuSeparator({ className }: { className?: string }) {
  return <hr className={clsx(styles.separator, className)} />;
}

/* aria-labelledby, so the label names the group instead of reading as stray text. */
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
