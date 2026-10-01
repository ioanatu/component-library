import clsx from 'clsx';
import type { KeyboardEvent } from 'react';
import { useId, useState } from 'react';
import { Input, type InputProps } from '../Input/Input';
import { Body, Caption } from '../Typography';
import styles from './Combobox.module.css';

/**
 * Combobox following the OFFSET design system: an Input that suggests as you
 * type, for lists too long or too remote to hold in a Select — an address
 * search, a people picker.
 *
 * It follows the ARIA 1.2 combobox pattern: focus stays in the field while the
 * arrow keys move a highlight through the listbox, Enter picks, Escape closes.
 * The number of results is announced politely, so a screen reader user knows
 * the list exists without having to look for it.
 *
 * The caller owns the text and the options, which keeps fetching, debouncing
 * and cancelling where they belong: outside the component.
 *
 * @param inputValue - The text in the field.
 * @param onInputChange - Receives the text on every keystroke.
 * @param options - Suggestions to show. `description` is a second, muted line.
 * @param onSelect - Receives the chosen option.
 * @param minChars - Characters needed before the list opens. Default is 1.
 * @param emptyMessage - Shown and announced when a search finds nothing.
 * @param resultsLabel - Announced when results arrive. Default is "N results".
 */

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface ComboboxProps extends Omit<
  InputProps,
  'value' | 'defaultValue' | 'onChange' | 'onSelect' | 'clearable' | 'onClear'
> {
  inputValue: string;
  onInputChange: (value: string) => void;
  options: ComboboxOption[];
  onSelect: (option: ComboboxOption) => void;
  minChars?: number;
  emptyMessage?: string;
  resultsLabel?: (count: number) => string;
}

export function Combobox({
  inputValue,
  onInputChange,
  options,
  onSelect,
  minChars = 1,
  emptyMessage = 'No results',
  resultsLabel = (count) => `${count} ${count === 1 ? 'result' : 'results'} available`,
  loading = false,
  className,
  onKeyDown,
  onBlur,
  onFocus,
  ...rest
}: ComboboxProps) {
  const id = useId();
  const listboxId = `${id}-listbox`;
  const optionId = (index: number) => `${id}-option-${index}`;

  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [activeValue, setActiveValue] = useState<string>();

  const searchable = inputValue.trim().length >= minChars;
  const open = focused && !dismissed && searchable && (options.length > 0 || !loading);
  const activeIndex = options.findIndex((option) => option.value === activeValue);

  const choose = (option: ComboboxOption) => {
    setDismissed(true);
    setActiveValue(undefined);
    onSelect(option);
  };

  const move = (step: number) => {
    if (options.length === 0) return;
    const next = activeIndex < 0 && step < 0 ? options.length - 1 : activeIndex + step;
    setActiveValue(options[(next + options.length) % options.length].value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setDismissed(false);
      move(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Enter' && open && activeIndex >= 0) {
      event.preventDefault();
      choose(options[activeIndex]);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      setDismissed(true);
    }
  };

  const status =
    !open || loading ? '' : options.length ? resultsLabel(options.length) : emptyMessage;

  return (
    <div className={clsx(styles.combobox, className)}>
      <Input
        {...rest}
        value={inputValue}
        loading={loading}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        onChange={(event) => {
          setDismissed(false);
          setActiveValue(undefined);
          onInputChange(event.target.value);
        }}
        onKeyDown={handleKeyDown}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
      />

      {open ? (
        <div className={styles.panel}>
          {options.length ? (
            <ul id={listboxId} role="listbox" aria-label={rest.label} className={styles.list}>
              {options.map((option, index) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keys are handled on the input, via aria-activedescendant
                <li
                  key={option.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={clsx(styles.option, { [styles.active]: index === activeIndex })}
                  /* Keeps focus in the field, so the blur does not close the list first. */
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(option)}
                >
                  <Body as="span" level={3} weight="medium" unbounded>
                    {option.label}
                  </Body>
                  {option.description ? <Caption>{option.description}</Caption> : null}
                </li>
              ))}
            </ul>
          ) : (
            <Caption className={styles.empty}>{emptyMessage}</Caption>
          )}
        </div>
      ) : null}

      <span className={styles.srOnly} role="status">
        {status}
      </span>
    </div>
  );
}

export default Combobox;
