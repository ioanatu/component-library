import clsx from 'clsx';
import type { KeyboardEvent, ReactNode, Ref } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { Body } from '../Typography';
import styles from './Accordion.module.css';

/**
 * Accordion following the OFFSET design system: heavy outside, quiet inside — one
 * bordered container on the offset shadow, sections divided by hairlines.
 *
 * It follows the WAI-ARIA accordion pattern. Each header is a real `<button>` inside a
 * heading, so it is reachable by Tab, operated by Enter and Space, and listed in a
 * screen reader's heading navigation. The button reports `aria-expanded` and points
 * at its panel, which is a region named by the header. Up, Down, Home and End move
 * between headers.
 *
 * Closed panels use `hidden="until-found"`, so the browser's find-in-page still
 * searches them and opens the one with the match.
 *
 * @param items - The sections. `title` labels the button; `content` is the panel.
 * @param headingLevel - Heading tag for each header, to fit the page outline.
 * @param multiple - Lets several sections stay open. Default is one at a time.
 * @param expanded - Controlled open ids. Pair with `onExpandedChange`.
 */

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  multiple?: boolean;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

function Panel({
  id,
  labelledBy,
  open,
  onFound,
  children,
}: {
  id: string;
  labelledBy: string;
  open: boolean;
  onFound: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  /* React only writes `hidden` as a boolean, so the value is upgraded on the node. */
  useEffect(() => {
    if (!open) ref.current?.setAttribute('hidden', 'until-found');
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    el?.addEventListener('beforematch', onFound);
    return () => el?.removeEventListener('beforematch', onFound);
  }, [onFound]);

  return (
    <div
      ref={ref}
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      hidden={!open}
      className={styles.panel}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export function Accordion({
  items,
  headingLevel = 3,
  multiple = false,
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  className,
  ref,
}: AccordionProps) {
  const id = useId();
  const [expandedState, setExpandedState] = useState(defaultExpanded);
  const expanded = expandedProp ?? expandedState;
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const Heading = `h${headingLevel}` as const;

  const setExpanded = (ids: string[]) => {
    if (expandedProp === undefined) setExpandedState(ids);
    onExpandedChange?.(ids);
  };

  const toggle = (itemId: string, open = !expanded.includes(itemId)) => {
    if (!open) setExpanded(expanded.filter((other) => other !== itemId));
    else if (!expanded.includes(itemId)) setExpanded(multiple ? [...expanded, itemId] : [itemId]);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const enabled = items.filter((item) => !item.disabled);
    const position = enabled.findIndex((item) => item.id === items[index].id);
    const target = {
      ArrowDown: enabled[(position + 1) % enabled.length],
      ArrowUp: enabled[(position - 1 + enabled.length) % enabled.length],
      Home: enabled[0],
      End: enabled[enabled.length - 1],
    }[event.key];
    if (!target) return;
    event.preventDefault();
    buttons.current.get(target.id)?.focus();
  };

  return (
    <div ref={ref} className={clsx(styles.accordion, className)}>
      {items.map((item, index) => {
        const open = expanded.includes(item.id);
        const buttonId = `${id}-button-${item.id}`;
        const panelId = `${id}-panel-${item.id}`;

        return (
          <div key={item.id} className={clsx(styles.item, { [styles.open]: open })}>
            <Heading className={styles.heading}>
              <button
                ref={(node) => {
                  if (node) buttons.current.set(item.id, node);
                  else buttons.current.delete(item.id);
                }}
                id={buttonId}
                type="button"
                className={styles.trigger}
                aria-expanded={open}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                <Body as="span" level={2} weight="semibold" tone="inherit" unbounded>
                  {item.title}
                </Body>
                <svg
                  className={styles.chevron}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M3.5 6L8 10.5 12.5 6" />
                </svg>
              </button>
            </Heading>

            <Panel
              id={panelId}
              labelledBy={buttonId}
              open={open}
              onFound={() => toggle(item.id, true)}
            >
              {item.content}
            </Panel>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
