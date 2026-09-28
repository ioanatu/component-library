import clsx from 'clsx';
import type { CSSProperties, KeyboardEvent, ReactNode, Ref } from 'react';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Input } from '../Input/Input';
import { Body, Caption } from '../Typography';
import styles from './Select.module.css';

/**
 * Select following the design page's listbox pattern: a field-shaped trigger
 * carrying the accent offset, opening a panel the same width as itself.
 *
 * The trigger is a `<button aria-haspopup="listbox">` and the panel is a
 * `role="listbox"` of `role="option"`s. With `searchable`, the panel gets a search
 * field that is itself the `role="combobox"`: focus stays in the field and
 * `aria-activedescendant` moves the active option, which is what lets you type and
 * arrow at the same time.
 *
 * This picks a value, unlike DropdownMenu which runs an action. The two are
 * different patterns and are deliberately separate components.
 *
 * Keyboard: Enter, Space or Down opens on the selected option, Up opens on the
 * last. Inside, Up and Down move with wrapping, Home and End jump to the ends,
 * Enter picks the active option, Escape closes and returns focus to the trigger,
 * Tab closes. Without `searchable`, typing jumps to an option by name.
 *
 * Positioned relative to the trigger rather than portaled, so an ancestor with
 * `overflow: hidden` will clip the panel.
 *
 * @param value - Selected value. `null` is controlled with nothing selected; omit
 * it entirely for uncontrolled and use `defaultValue`.
 * @param searchable - Adds the search field and filters as you type.
 * @param fullWidth - Fills the parent instead of the default 240px.
 * @param maxHeight - Cap on the option list in px; it scrolls past that.
 * @param name - Renders a hidden input so the value submits with a form.
 */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label: string;
  hideLabel?: boolean;
  options: SelectOption[];
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  searchLabel?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  helper?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  maxHeight?: number;
  name?: string;
  id?: string;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

const TickIcon = () => (
  <svg
    className={styles.tick}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3 8.5l3.5 3.5L13 5" />
  </svg>
);

const SearchIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
);

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    className={clsx(styles.chevron, { [styles.chevronOpen]: open })}
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3 5.5h10L8 11z" fill="currentColor" />
  </svg>
);

export function Select({
  label,
  hideLabel = false,
  options,
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  searchable = false,
  searchLabel = 'Search options',
  searchPlaceholder = 'Search…',
  emptyMessage = 'No matches',
  helper,
  error,
  disabled = false,
  required = false,
  fullWidth = false,
  maxHeight,
  name,
  id: idProp,
  className,
  ref,
}: SelectProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const listboxId = `${id}-listbox`;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const optionId = (index: number) => `${id}-option-${index}`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = (isControlled ? valueProp : uncontrolledValue) ?? undefined;

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const typeahead = useRef({ query: '', timer: 0 });

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!searchable || !trimmed) return options;
    return options.filter((option) => option.label.toLowerCase().includes(trimmed));
  }, [options, query, searchable]);

  const selected = options.find((option) => option.value === value);

  const setTriggerRef = (node: HTMLButtonElement | null) => {
    triggerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as { current: HTMLButtonElement | null }).current = node;
  };

  const openPanel = (index?: number) => {
    if (disabled) return;
    const selectedIndex = options.findIndex((option) => option.value === value);
    setActiveIndex(index ?? Math.max(selectedIndex, 0));
    setOpen(true);
  };

  const closePanel = (options_?: { focusTrigger?: boolean }) => {
    setOpen(false);
    setQuery('');
    if (options_?.focusTrigger) triggerRef.current?.focus();
  };

  const pick = (option?: SelectOption) => {
    if (!option || option.disabled) return;
    if (!isControlled) setUncontrolledValue(option.value);
    onChange?.(option.value);
    closePanel({ focusTrigger: true });
  };

  useEffect(() => () => window.clearTimeout(typeahead.current.timer), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!anchorRef.current?.contains(event.target as Node)) closePanel();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    if (searchable) searchRef.current?.focus();
    else listRef.current?.focus();
  }, [open, searchable]);

  /**
   * Keep the active option in view. Looked up by id rather than a selector, since
   * useId values contain characters that are not valid in one. The call is optional
   * because jsdom does not implement it.
   */
  useLayoutEffect(() => {
    if (!open) return;
    document.getElementById(optionId(activeIndex))?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeIndex, id]);

  /**
   * Flip above the trigger when there is not room below. Written to the DOM rather
   * than held in state, so there is no cascading render.
   */
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!open || !panel || !rect) return;

    panel.classList.remove(styles.panelAbove);
    const needed = panel.getBoundingClientRect().height;
    const below = window.innerHeight - rect.bottom - 16;
    const above = rect.top - 16;
    if (needed > below && above > below) panel.classList.add(styles.panelAbove);
  }, [open, filtered.length]);

  const move = (delta: number) => {
    if (!filtered.length) return;
    setActiveIndex((current) => (current + delta + filtered.length) % filtered.length);
  };

  const runTypeahead = (key: string) => {
    const state = typeahead.current;
    window.clearTimeout(state.timer);
    state.query += key.toLowerCase();
    state.timer = window.setTimeout(() => {
      state.query = '';
    }, 500);

    const index = filtered.findIndex((option) =>
      option.label.toLowerCase().startsWith(state.query),
    );
    if (index >= 0) setActiveIndex(index);
  };

  const onNavigationKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(Math.max(filtered.length - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        pick(filtered[activeIndex]);
        break;
      case 'Escape':
        event.preventDefault();
        closePanel({ focusTrigger: true });
        break;
      case 'Tab':
        closePanel();
        break;
      case ' ':
        /* Typing a space belongs to the search field; otherwise it picks. */
        if (!searchable) {
          event.preventDefault();
          pick(filtered[activeIndex]);
        }
        break;
      default:
        if (
          !searchable &&
          event.key.length === 1 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.altKey
        ) {
          event.preventDefault();
          runTypeahead(event.key);
        }
    }
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPanel();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openPanel(Math.max(filtered.length - 1, 0));
    } else if (event.key === 'Escape' && open) {
      closePanel();
    }
  };

  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;
  const activeOptionId = filtered.length ? optionId(activeIndex) : undefined;

  return (
    <div
      className={clsx(
        styles.field,
        { [styles.fullWidth]: fullWidth, [styles.invalid]: Boolean(error) },
        className,
      )}
      style={maxHeight ? ({ '--select-max-h': `${maxHeight}px` } as CSSProperties) : undefined}
    >
      {/* A real label element, since Body cannot carry htmlFor when polymorphic. */}
      <label
        id={labelId}
        htmlFor={`${id}-trigger`}
        className={clsx(styles.label, { [styles.srOnly]: hideLabel })}
      >
        <Body as="span" level={3} weight="semibold">
          {label}
          {required ? (
            <span aria-hidden="true" style={{ color: 'var(--danger)' }}>
              {' '}
              *
            </span>
          ) : null}
        </Body>
      </label>

      <div ref={anchorRef} className={styles.anchor}>
        <button
          ref={setTriggerRef}
          id={`${id}-trigger`}
          type="button"
          className={styles.trigger}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-labelledby={`${labelId} ${valueId}`}
          aria-describedby={describedBy}
          onClick={() => (open ? closePanel() : openPanel())}
          onKeyDown={onTriggerKeyDown}
        >
          {/* tone rather than a class of our own: a color declaration here would
              collide with Typography's tone classes at equal specificity. */}
          <Body
            as="span"
            id={valueId}
            level={3}
            unbounded
            tone={selected ? 'inherit' : 'muted'}
            className={styles.value}
          >
            {selected?.label ?? placeholder}
          </Body>
          <Chevron open={open} />
        </button>

        {open ? (
          <div ref={panelRef} className={styles.panel}>
            {searchable ? (
              <div className={styles.search}>
                <Input
                  ref={searchRef}
                  label={searchLabel}
                  hideLabel
                  size="sm"
                  fullWidth
                  type="search"
                  placeholder={searchPlaceholder}
                  value={query}
                  leading={<SearchIcon />}
                  clearable
                  onClear={() => setQuery('')}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={onNavigationKeyDown}
                  role="combobox"
                  aria-expanded
                  aria-controls={listboxId}
                  aria-activedescendant={activeOptionId}
                  aria-autocomplete="list"
                />
              </div>
            ) : null}

            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              tabIndex={-1}
              className={styles.list}
              aria-labelledby={labelId}
              aria-activedescendant={searchable ? undefined : activeOptionId}
              onKeyDown={searchable ? undefined : onNavigationKeyDown}
            >
              {filtered.map((option, index) => (
                <Body
                  key={option.value}
                  as="li"
                  id={optionId(index)}
                  level={3}
                  tone="inherit"
                  unbounded
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled || undefined}
                  className={clsx(styles.option, { [styles.active]: index === activeIndex })}
                  onClick={() => pick(option)}
                >
                  <span className={styles.optionLabel}>{option.label}</span>
                  {option.value === value ? <TickIcon /> : null}
                </Body>
              ))}

              {filtered.length === 0 ? (
                <li role="presentation" className={styles.empty}>
                  <Caption>{emptyMessage}</Caption>
                </li>
              ) : null}
            </ul>

            {searchable ? (
              <span role="status" className={styles.srOnly}>
                {filtered.length} of {options.length} options
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {name ? <input type="hidden" name={name} value={value ?? ''} /> : null}

      {helper || error ? (
        <div className={styles.messages}>
          {helper ? <Caption id={helperId}>{helper}</Caption> : null}
          {error ? (
            <Caption id={errorId} role="alert" error className={styles.error}>
              <span aria-hidden="true">⚠</span>
              {error}
            </Caption>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default Select;
