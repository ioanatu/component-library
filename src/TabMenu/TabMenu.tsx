import clsx from 'clsx';
import type { KeyboardEvent, Ref } from 'react';
import { useRef, useState } from 'react';
import { Body } from '../Typography';
import styles from './TabMenu.module.css';

/**
 * TabMenu — the design system's segmented sibling of Tabs: a pill of tabs with one
 * filled in accent.
 *
 * A `role="tablist"` with a roving tabindex, so the group is one tab stop and the
 * arrows move within it. Selection follows focus, which is why disabled tabs are
 * skipped rather than landed on.
 *
 * Use it for switching a view. If the choice is a form value rather than a view,
 * RadioGroup is the right shape.
 *
 * @param label - Names the tablist. Required: a tablist with no name is unusable.
 * @param items - `panelId` wires a tab to the panel it controls.
 * @param fullWidth - Fills the parent, sharing the width between tabs.
 */

export interface TabMenuItem {
  value: string;
  label: string;
  disabled?: boolean;
  panelId?: string;
}

export interface TabMenuProps {
  label: string;
  items: TabMenuItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  fullWidth?: boolean;
  id?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function TabMenu({
  label,
  items,
  value: valueProp,
  defaultValue,
  onChange,
  fullWidth = false,
  id,
  className,
  ref,
}: TabMenuProps) {
  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? items[0]?.value);
  const value = isControlled ? valueProp : uncontrolledValue;

  const listRef = useRef<HTMLDivElement | null>(null);

  const setRefs = (node: HTMLDivElement | null) => {
    listRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as { current: HTMLDivElement | null }).current = node;
  };

  const select = (item: TabMenuItem) => {
    if (item.disabled) return;
    if (!isControlled) setUncontrolledValue(item.value);
    onChange?.(item.value);
  };

  const activate = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    select(item);
    listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[index]?.focus();
  };

  const nextEnabled = (from: number, delta: number) => {
    let index = from;
    for (let step = 0; step < items.length; step += 1) {
      index = (index + delta + items.length) % items.length;
      if (!items[index].disabled) return index;
    }
    return from;
  };

  const edgeEnabled = (fromEnd: boolean) => {
    const order = fromEnd ? [...items.keys()].reverse() : [...items.keys()];
    return order.find((index) => !items[index].disabled) ?? 0;
  };

  /* On each tab, not the tablist: a tablist is not itself focusable. */
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, current: number) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        activate(nextEnabled(current, 1));
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        activate(nextEnabled(current, -1));
        break;
      case 'Home':
        event.preventDefault();
        activate(edgeEnabled(false));
        break;
      case 'End':
        event.preventDefault();
        activate(edgeEnabled(true));
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={setRefs}
      id={id}
      role="tablist"
      aria-label={label}
      aria-orientation="horizontal"
      className={clsx(styles.list, { [styles.fullWidth]: fullWidth }, className)}
    >
      {items.map((item, index) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-disabled={item.disabled || undefined}
            aria-controls={item.panelId}
            tabIndex={selected ? 0 : -1}
            className={styles.tab}
            onClick={() => select(item)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <Body as="span" level={3} weight="semibold" tone="inherit" unbounded>
              {item.label}
            </Body>
          </button>
        );
      })}
    </div>
  );
}

export default TabMenu;
