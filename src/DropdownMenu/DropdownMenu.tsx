import clsx from 'clsx';
import type { CSSProperties, KeyboardEvent, MouseEvent, ReactElement, ReactNode } from 'react';
import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { MenuPlacement } from '../types';
import styles from './DropdownMenu.module.css';
import { MenuContext } from './MenuContext';

/**
 * Dropdown menu following the OFFSET design system: a bordered surface with the
 * offset shadow, hung off its trigger.
 *
 * A menu of actions (the APG menu-button pattern), not a value picker — Select is
 * that. Not portaled, so an ancestor with `overflow: hidden` clips it.
 *
 * @param trigger - A focusable element. Cloned to add the ARIA wiring and the
 * chevron; its own handlers and children are kept.
 * @param chevron - Default true; off for an icon-only trigger.
 * @param placement - Corner to hang from. Flips on collision, in both axes.
 * @param maxHeight - Cap in px, further capped by the space actually available.
 * @param minWidth - Default 200. `maxWidth` caps it; long labels wrap.
 */

export interface DropdownMenuProps {
  trigger: ReactElement;
  children: ReactNode;
  placement?: MenuPlacement;
  chevron?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  maxHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  menuLabel?: string;
  id?: string;
  className?: string;
}

type TriggerProps = {
  id?: string;
  'aria-haspopup'?: 'menu';
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
};

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    className={clsx(styles.chevron, { [styles.chevronOpen]: open })}
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3 5.5h10L8 11z" />
  </svg>
);

const PLACEMENT_CLASS: Record<MenuPlacement, string> = {
  'bottom-start': styles.bottomStart,
  'bottom-end': styles.bottomEnd,
  'top-start': styles.topStart,
  'top-end': styles.topEnd,
};

const flipBlock = (placement: MenuPlacement): MenuPlacement =>
  placement.startsWith('bottom')
    ? (placement.replace('bottom', 'top') as MenuPlacement)
    : (placement.replace('top', 'bottom') as MenuPlacement);

const flipInline = (placement: MenuPlacement): MenuPlacement =>
  placement.endsWith('start')
    ? (placement.replace('start', 'end') as MenuPlacement)
    : (placement.replace('end', 'start') as MenuPlacement);

export function DropdownMenu({
  trigger,
  children,
  placement = 'bottom-start',
  chevron = true,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  maxHeight,
  minWidth = 200,
  maxWidth,
  menuLabel,
  id: idProp,
  className,
}: DropdownMenuProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const menuId = `${id}-menu`;

  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;

  /* State, not a ref: cloneElement gets these handlers, and a ref read there is
     flagged as a render-time read. */
  const [openWith, setOpenWith] = useState<'first' | 'last'>('first');

  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const typeahead = useRef({ query: '', timer: 0 });

  const getTrigger = () =>
    wrapRef.current?.querySelector<HTMLElement>('[aria-haspopup="menu"]') ?? null;

  /* Every checkable role counts, or the arrows would skip those items. */
  const getItems = () =>
    Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]',
      ) ?? [],
    );

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const close = useCallback(
    (options?: { focusTrigger?: boolean }) => {
      setOpen(false);
      if (options?.focusTrigger) getTrigger()?.focus();
    },
    [setOpen],
  );

  const context = useMemo(() => ({ close }), [close]);

  useEffect(() => () => window.clearTimeout(typeahead.current.timer), []);

  /* Pointer down outside closes without stealing focus back. */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, setOpen]);

  const focusAt = (index: number) => {
    const items = getItems();
    if (!items.length) return;
    const item = items[(index + items.length) % items.length];
    item.focus();
    /* Optional call: jsdom and other non-visual environments do not implement it. */
    item.scrollIntoView?.({ block: 'nearest' });
  };

  useLayoutEffect(() => {
    if (!open) return;
    const items = getItems();
    if (!items.length) {
      menuRef.current?.focus();
      return;
    }
    items[openWith === 'last' ? items.length - 1 : 0].focus();
  }, [open, openWith]);

  /* Flip and clamp against the viewport. Written to the DOM to avoid a re-render. */
  useLayoutEffect(() => {
    const el = menuRef.current;
    const triggerRect = getTrigger()?.getBoundingClientRect();
    if (!open || !el || !triggerRect) return;

    const classes = Object.values(PLACEMENT_CLASS);
    const apply = (next: MenuPlacement) => {
      el.classList.remove(...classes);
      el.classList.add(PLACEMENT_CLASS[next]);
    };

    const pad = 8;
    const gap = 8;
    const spaceBelow = window.innerHeight - triggerRect.bottom - gap - pad;
    const spaceAbove = triggerRect.top - gap - pad;

    apply(placement);
    el.style.setProperty('--menu-max-h', maxHeight ? `${maxHeight}px` : 'none');

    let resolved = placement;
    const wantsBottom = placement.startsWith('bottom');
    const needed = el.getBoundingClientRect().height;
    const room = wantsBottom ? spaceBelow : spaceAbove;
    const other = wantsBottom ? spaceAbove : spaceBelow;

    if (needed > room && other > room) {
      resolved = flipBlock(placement);
      apply(resolved);
    }

    const available = resolved.startsWith('bottom') ? spaceBelow : spaceAbove;
    const cap = maxHeight ? Math.min(maxHeight, available) : available;
    if (el.getBoundingClientRect().height > cap) {
      el.style.setProperty('--menu-max-h', `${Math.max(cap, 96)}px`);
    }

    const rect = el.getBoundingClientRect();
    if (rect.right > window.innerWidth - pad || rect.left < pad) {
      apply(flipInline(resolved));
    }
  }, [open, placement, maxHeight, children]);

  const runTypeahead = (key: string, from: number) => {
    const items = getItems();
    const state = typeahead.current;
    window.clearTimeout(state.timer);
    state.query += key.toLowerCase();
    state.timer = window.setTimeout(() => {
      state.query = '';
    }, 500);

    const labels = items.map((item) => (item.textContent ?? '').trim().toLowerCase());
    const offset = state.query.length > 1 ? 0 : 1;
    for (let step = offset; step < items.length + offset; step += 1) {
      const index = (from + step + items.length) % items.length;
      if (labels[index].startsWith(state.query)) {
        focusAt(index);
        return;
      }
    }
  };

  const onTriggerClick = () => {
    setOpenWith('first');
    setOpen(!open);
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpenWith('first');
      setOpen(true);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpenWith('last');
      setOpen(true);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = getItems();
    const current = items.findIndex((item) => item === document.activeElement);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusAt(current + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusAt(current - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusAt(0);
        break;
      case 'End':
        event.preventDefault();
        focusAt(items.length - 1);
        break;
      case 'Escape':
        event.preventDefault();
        close({ focusTrigger: true });
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        /* Space activates the focused item; it is never typeahead. */
        if (
          event.key.length === 1 &&
          event.key !== ' ' &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.altKey
        ) {
          event.preventDefault();
          runTypeahead(event.key, current);
        }
    }
  };

  const child = trigger as ReactElement<TriggerProps>;
  const triggerId = child.props.id ?? `${id}-trigger`;

  const surfaceStyle = {
    '--menu-min-w': `${minWidth}px`,
    '--menu-max-w': maxWidth ? `${maxWidth}px` : 'none',
    '--menu-max-h': maxHeight ? `${maxHeight}px` : 'none',
  } as CSSProperties;

  return (
    <span ref={wrapRef} className={clsx(styles.wrap, className)}>
      {cloneElement(
        child,
        {
          id: triggerId,
          'aria-haspopup': 'menu',
          'aria-expanded': open,
          'aria-controls': open ? menuId : undefined,
          onClick: (event: MouseEvent<HTMLElement>) => {
            child.props.onClick?.(event);
            onTriggerClick();
          },
          onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
            child.props.onKeyDown?.(event);
            onTriggerKeyDown(event);
          },
        },
        child.props.children,
        chevron ? <Chevron key="chevron" open={open} /> : null,
      )}

      {open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          tabIndex={-1}
          aria-label={menuLabel}
          aria-labelledby={menuLabel ? undefined : triggerId}
          className={clsx(styles.menu, PLACEMENT_CLASS[placement])}
          style={surfaceStyle}
          onKeyDown={onMenuKeyDown}
        >
          <MenuContext.Provider value={context}>{children}</MenuContext.Provider>
        </div>
      ) : null}
    </span>
  );
}

export default DropdownMenu;
