import clsx from 'clsx';
import type { KeyboardEvent, ReactNode, Ref } from 'react';
import { useRef, useState } from 'react';
import { Body } from '../Typography';
import styles from './TreeView.module.css';

/**
 * Tree view following the OFFSET design system: quiet rows on hairline guides, the
 * selected row on the accent wash with a 3px accent edge.
 *
 * It implements the WAI-ARIA tree pattern. The tree is one tab stop; inside it the
 * arrow keys move, Right and Left open, close and step between parent and child,
 * Home and End jump to the ends, Enter or Space selects, and typing a letter moves
 * to the next item that starts with it. Each item reports its level, position and
 * set size, so a screen reader can say "level 2, 1 of 3".
 *
 * Selection and expansion each work controlled or uncontrolled.
 *
 * @param label - Required: names the tree.
 * @param items - The nodes. `meta` is a muted second label, `icon` is decorative.
 * @param selectedId - Controlled selection. Pair with `onSelectedChange`.
 * @param expandedIds - Controlled expansion. Pair with `onExpandedChange`.
 */

export interface TreeItem {
  id: string;
  label: string;
  meta?: string;
  icon?: ReactNode;
  children?: TreeItem[];
}

export interface TreeViewProps {
  label: string;
  items: TreeItem[];
  selectedId?: string | null;
  defaultSelectedId?: string;
  onSelectedChange?: (id: string) => void;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  className?: string;
  ref?: Ref<HTMLUListElement>;
}

interface Visible {
  item: TreeItem;
  parentId?: string;
}

const flatten = (items: TreeItem[], expanded: string[], parentId?: string): Visible[] =>
  items.flatMap((item) => [
    { item, parentId },
    ...(item.children?.length && expanded.includes(item.id)
      ? flatten(item.children, expanded, item.id)
      : []),
  ]);

export function TreeView({
  label,
  items,
  selectedId: selectedProp,
  defaultSelectedId,
  onSelectedChange,
  expandedIds: expandedProp,
  defaultExpandedIds = [],
  onExpandedChange,
  className,
  ref,
}: TreeViewProps) {
  const [selectedState, setSelectedState] = useState(defaultSelectedId ?? null);
  const [expandedState, setExpandedState] = useState(defaultExpandedIds);
  const selectedId = selectedProp !== undefined ? selectedProp : selectedState;
  const expanded = expandedProp ?? expandedState;

  const visible = flatten(items, expanded);
  const [focusedState, setFocusedId] = useState<string>();
  const focusedId = visible.some(({ item }) => item.id === focusedState)
    ? focusedState
    : (visible.find(({ item }) => item.id === selectedId) ?? visible[0])?.item.id;

  const nodes = useRef(new Map<string, HTMLLIElement>());

  const focus = (id: string) => {
    setFocusedId(id);
    nodes.current.get(id)?.focus();
  };

  const select = (id: string) => {
    if (selectedProp === undefined) setSelectedState(id);
    onSelectedChange?.(id);
  };

  const setExpanded = (ids: string[]) => {
    if (expandedProp === undefined) setExpandedState(ids);
    onExpandedChange?.(ids);
  };

  const toggle = (id: string, open = !expanded.includes(id)) =>
    setExpanded(open ? [...expanded, id] : expanded.filter((other) => other !== id));

  const onKeyDown = (event: KeyboardEvent<HTMLLIElement>, entry: Visible) => {
    const { item, parentId } = entry;
    const index = visible.findIndex((row) => row.item.id === item.id);
    const branch = Boolean(item.children?.length);
    const open = expanded.includes(item.id);
    let handled = true;

    switch (event.key) {
      case 'ArrowDown':
        if (visible[index + 1]) focus(visible[index + 1].item.id);
        break;
      case 'ArrowUp':
        if (visible[index - 1]) focus(visible[index - 1].item.id);
        break;
      case 'ArrowRight':
        if (branch && !open) toggle(item.id, true);
        else if (branch) focus(item.children![0].id);
        break;
      case 'ArrowLeft':
        if (branch && open) toggle(item.id, false);
        else if (parentId) focus(parentId);
        break;
      case 'Home':
        focus(visible[0].item.id);
        break;
      case 'End':
        focus(visible[visible.length - 1].item.id);
        break;
      case 'Enter':
      case ' ':
        select(item.id);
        break;
      default: {
        const char = event.key.length === 1 ? event.key.toLowerCase() : '';
        const rotated = [...visible.slice(index + 1), ...visible.slice(0, index)];
        const match = char && rotated.find((row) => row.item.label.toLowerCase().startsWith(char));
        if (match) focus(match.item.id);
        else handled = false;
      }
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const renderItems = (list: TreeItem[], level: number, parentId?: string): ReactNode =>
    list.map((item, index) => {
      const branch = Boolean(item.children?.length);
      const open = branch && expanded.includes(item.id);
      const selected = item.id === selectedId;

      return (
        <li
          key={item.id}
          ref={(node) => {
            if (node) nodes.current.set(item.id, node);
            else nodes.current.delete(item.id);
          }}
          role="treeitem"
          aria-level={level}
          aria-setsize={list.length}
          aria-posinset={index + 1}
          aria-expanded={branch ? open : undefined}
          aria-selected={selected}
          tabIndex={item.id === focusedId ? 0 : -1}
          className={styles.item}
          onKeyDown={(event) => onKeyDown(event, { item, parentId })}
          onFocus={(event) => {
            if (event.target === event.currentTarget) setFocusedId(item.id);
          }}
        >
          {/* Mouse convenience: the keyboard path is the treeitem's onKeyDown. */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className={clsx(styles.row, { [styles.selected]: selected })}
            style={{ paddingInlineStart: 8 + (level - 1) * 20 }}
            onClick={() => {
              focus(item.id);
              select(item.id);
              if (branch) toggle(item.id);
            }}
          >
            <span className={styles.toggle} aria-hidden="true">
              {branch ? (
                <svg
                  className={clsx(styles.chevron, { [styles.chevronOpen]: open })}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  focusable="false"
                >
                  <path d="M6 3.5L10.5 8 6 12.5" />
                </svg>
              ) : null}
            </span>
            {item.icon ? (
              <span className={styles.icon} aria-hidden="true">
                {item.icon}
              </span>
            ) : null}
            <Body as="span" level={3} weight={selected ? 'semibold' : 'medium'} tone="inherit">
              {item.label}
            </Body>
            {item.meta ? (
              <Body as="span" level={3} mono tone="muted" className={styles.meta}>
                {item.meta}
              </Body>
            ) : null}
          </div>

          {open ? (
            <ul role="group" className={styles.group}>
              {renderItems(item.children!, level + 1, item.id)}
            </ul>
          ) : null}
        </li>
      );
    });

  return (
    <ul ref={ref} role="tree" aria-label={label} className={clsx(styles.tree, className)}>
      {renderItems(items, 1)}
    </ul>
  );
}

export default TreeView;
