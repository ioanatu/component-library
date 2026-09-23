import clsx from 'clsx';
import type { CSSProperties, FocusEvent, ReactElement, ReactNode } from 'react';
import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { Size, TooltipPlacement, TooltipVariant } from '../types';
import { Body, Caption } from '../Typography';
import styles from './Tooltip.module.css';

/**
 * Tooltip following the OFFSET design system: an inverted ink bubble with the
 * offset shadow, anchored to its trigger.
 *
 * A tooltip may only ever label something already visible. It must not hold an
 * action, a control, or the only copy of a piece of information — use Popover
 * for that.
 *
 * The trigger is cloned rather than wrapped, so the tooltip adds no element to
 * the layout and the trigger keeps its own handlers. It must be focusable, or
 * the tooltip is unreachable by keyboard.
 *
 * Meets WCAG 1.4.13: Escape dismisses it, the pointer can move into the bubble
 * without it closing, and it never hides on a timer.
 *
 * @param content - The label. Nothing interactive.
 * @param children - A single focusable trigger element.
 * @param placement - Preferred side. Flips to the opposite side if it would
 * leave the viewport.
 * @param variant - Fill. `dark` inverts against the page, `light` sits on
 * --surface. Named for the light theme: --ink and --page flip with the theme, so
 * `dark` stays inverted in dark mode.
 * @param size - Density. Drives padding, arrow, gap, max width and the type
 * step: 12 / 14 / 16px. Default is md.
 * @param delay - Hover delay in ms. Keyboard focus always shows immediately.
 */

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
  size?: Size;
  delay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  maxWidth?: number;
  id?: string;
  className?: string;
}

type TriggerProps = {
  'aria-describedby'?: string;
};

const OPPOSITE: Record<TooltipPlacement, TooltipPlacement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

/* Click-focus shouldn't pop a tooltip; jsdom lacks :focus-visible. */
const isKeyboardFocus = (event: FocusEvent<HTMLElement>) => {
  try {
    return event.target.matches(':focus-visible');
  } catch {
    return true;
  }
};

export function Tooltip({
  content,
  children,
  placement = 'top',
  variant = 'dark',
  size = 'md',
  delay = 150,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  maxWidth,
  id: idProp,
  className,
}: TooltipProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = (isControlled ? openProp : uncontrolledOpen) && !disabled && Boolean(content);

  const tipRef = useRef<HTMLSpanElement | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const clearTimer = useCallback(() => {
    if (timer.current !== undefined) {
      window.clearTimeout(timer.current);
      timer.current = undefined;
    }
  }, []);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const show = useCallback(
    (withDelay: boolean) => {
      clearTimer();
      if (withDelay && delay > 0) timer.current = window.setTimeout(() => setOpen(true), delay);
      else setOpen(true);
    },
    [clearTimer, delay, setOpen],
  );

  const hide = useCallback(() => {
    clearTimer();
    setOpen(false);
  }, [clearTimer, setOpen]);

  useEffect(() => clearTimer, [clearTimer]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, hide]);

  /* Flip to the opposite side if the preferred one leaves the viewport. Written
     to the DOM rather than held in state: React's className never changes, so it
     doesn't undo this on re-render, and there is no cascading render. */
  useLayoutEffect(() => {
    const el = tipRef.current;
    if (!open || !el) return;

    el.classList.remove(styles[OPPOSITE[placement]]);
    el.classList.add(styles[placement]);

    const rect = el.getBoundingClientRect();
    const pad = 8;

    /* left/right are inline sides, so they mirror under RTL; the rect is physical. */
    const rtl = getComputedStyle(el).direction === 'rtl';
    const offLeft = rect.left < pad;
    const offRight = rect.right > window.innerWidth - pad;

    const overflows =
      (placement === 'top' && rect.top < pad) ||
      (placement === 'bottom' && rect.bottom > window.innerHeight - pad) ||
      (placement === 'left' && (rtl ? offRight : offLeft)) ||
      (placement === 'right' && (rtl ? offLeft : offRight));

    if (overflows) {
      el.classList.remove(styles[placement]);
      el.classList.add(styles[OPPOSITE[placement]]);
    }
  }, [open, placement, content, variant, size]);

  const child = children as ReactElement<TriggerProps>;
  const describedBy =
    [child.props['aria-describedby'], open ? id : undefined].filter(Boolean).join(' ') || undefined;

  /* Handlers sit on the wrapper — React's focus events bubble, so the trigger
     keeps its own handlers and the clone carries only the id. */
  const handleMouseEnter = () => {
    if (!disabled) show(true);
  };

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    if (!disabled && isKeyboardFocus(event)) show(false);
  };

  return (
    <span
      className={clsx(styles.wrap, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={hide}
      onFocus={handleFocus}
      onBlur={hide}
    >
      {cloneElement(child, { 'aria-describedby': describedBy })}
      {open ? (
        <span
          ref={tipRef}
          id={id}
          role="tooltip"
          className={clsx(styles.tip, styles[placement], styles[variant], styles[size])}
          style={maxWidth ? ({ '--tip-max': `${maxWidth}px` } as CSSProperties) : undefined}
        >
          {size === 'sm' ? (
            <Caption as="span" level={2} tone="inherit">
              {content}
            </Caption>
          ) : (
            <Body as="span" level={size === 'lg' ? 2 : 3} tone="inherit">
              {content}
            </Body>
          )}
        </span>
      ) : null}
    </span>
  );
}

export default Tooltip;
