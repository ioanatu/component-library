import clsx from 'clsx';
import type { KeyboardEvent, ReactNode, Ref } from 'react';
import { useId, useRef, useState } from 'react';
import { Body } from '../Typography';
import styles from './Tabs.module.css';

/**
 * Tabs following the OFFSET design system: the browser-tab silhouette, where the
 * selected tab merges into the panel below it.
 *
 * A `role="tablist"` with a roving tabindex, so the strip is one tab stop and the
 * arrows move within it. Selection follows focus, which is why disabled tabs are
 * skipped rather than landed on.
 *
 * Every panel stays mounted and the inactive ones are `hidden`, so a half-filled
 * form in one tab survives a trip to another.
 *
 * @param label - Names the tablist. Required: a tablist with no name is unusable.
 * @param items - Each carries its own `content`.
 */

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  label: string;
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  id?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function Tabs({
  label,
  items,
  value: valueProp,
  defaultValue,
  onChange,
  id: idProp,
  className,
  ref,
}: TabsProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const tabId = (value: string) => `${id}-tab-${value}`;
  const panelId = (value: string) => `${id}-panel-${value}`;

  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? items[0]?.value);
  const value = isControlled ? valueProp : uncontrolledValue;

  const listRef = useRef<HTMLDivElement | null>(null);

  const select = (item: TabItem) => {
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
    <div ref={ref} className={clsx(styles.field, className)}>
      <div ref={listRef} role="tablist" aria-label={label} className={styles.list}>
        {items.map((item, index) => {
          const selected = item.value === value;
          return (
            <button
              key={item.value}
              id={tabId(item.value)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(item.value)}
              aria-disabled={item.disabled || undefined}
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

      {items.map((item) => (
        <div
          key={item.value}
          id={panelId(item.value)}
          role="tabpanel"
          aria-labelledby={tabId(item.value)}
          tabIndex={0}
          hidden={item.value !== value}
          className={styles.panel}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

export default Tabs;
