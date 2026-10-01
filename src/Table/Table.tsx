import clsx from 'clsx';
import type { ReactNode, Ref } from 'react';
import { useId } from 'react';
import { Body, Caption } from '../Typography';
import styles from './Table.module.css';

/**
 * Table following the OFFSET design system: heavy outside, quiet inside — a bordered
 * container on the offset shadow, with rows divided by hairlines.
 *
 * A real `<table>` with `<caption>`, `<th scope>` and a `<tbody>`, so a screen
 * reader can announce the dimensions, tie each cell to its column, and navigate by
 * row. A grid of divs looks the same and carries none of that.
 *
 * @param caption - Required: it names the table. `hideCaption` keeps it announced
 * but off screen, for when a visible heading already sits above.
 * @param columns - `width` takes any CSS value valid on a `<col>`; giving any width
 * switches the table to a fixed layout.
 * @param rowHeader - Column key whose cell is the row's `<th scope="row">`, which is
 * what lets a screen reader say which row it is reading.
 * @param cell - Fallback renderer, used for any column without its own.
 * @param header - Slot above the table, inside the border. Laid out as a row.
 * @param hideColumnHeaders - Keeps the column headers announced but off screen, for
 * key–value tables where the first column already says what each row is.
 */

export interface TableColumn<T> {
  key: string;
  label: ReactNode;
  width?: string;
  align?: 'start' | 'end' | 'center';
  cell?: (row: T) => ReactNode;
}

export interface TableProps<T> {
  caption: string;
  hideCaption?: boolean;
  hideColumnHeaders?: boolean;
  columns: TableColumn<T>[];
  rows: T[];
  cell?: (row: T, key: string) => ReactNode;
  rowKey?: (row: T, index: number) => string;
  rowHeader?: string;
  minWidth?: number;
  zebra?: boolean;
  header?: ReactNode;
  emptyMessage?: string;
  className?: string;
  ref?: Ref<HTMLTableElement>;
}

export function Table<T>({
  caption,
  hideCaption = false,
  hideColumnHeaders = false,
  columns,
  rows,
  cell,
  rowKey,
  rowHeader,
  minWidth = 620,
  zebra = true,
  header,
  emptyMessage = 'Nothing to show',
  className,
  ref,
}: TableProps<T>) {
  const id = useId();
  const captionId = `${id}-caption`;
  const fixed = columns.some((column) => column.width);

  const alignClass = (align: TableColumn<T>['align']) =>
    align === 'end' ? styles.alignEnd : align === 'center' ? styles.alignCenter : undefined;

  const render = (row: T, column: TableColumn<T>) =>
    column.cell ? column.cell(row) : cell?.(row, column.key);

  return (
    <div className={clsx(styles.container, className)}>
      {header ? <div className={styles.header}>{header}</div> : null}

      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a region that scrolls must be keyboard-reachable */}
      <div className={styles.scroll} role="region" aria-labelledby={captionId} tabIndex={0}>
        <table
          ref={ref}
          className={clsx(styles.table, { [styles.fixed]: fixed })}
          style={{ minInlineSize: minWidth }}
        >
          <caption
            id={captionId}
            className={
              hideCaption
                ? styles.srOnly
                : clsx(styles.caption, { [styles.captionInk]: hideColumnHeaders })
            }
          >
            <Body
              as="span"
              level={2}
              weight="semibold"
              tone={hideColumnHeaders ? 'inherit' : undefined}
            >
              {caption}
            </Body>
          </caption>

          {fixed ? (
            <colgroup>
              {columns.map((column) => (
                <col key={column.key} style={{ inlineSize: column.width }} />
              ))}
            </colgroup>
          ) : null}

          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={
                    hideColumnHeaders
                      ? styles.srOnly
                      : clsx(styles.headCell, alignClass(column.align))
                  }
                >
                  <Body as="span" level={3} weight="semibold" tone="inherit" unbounded>
                    {column.label}
                  </Body>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={clsx(styles.body, { [styles.zebra]: zebra })}>
            {rows.length === 0 ? (
              <tr>
                <td className={styles.empty} colSpan={columns.length}>
                  <Caption>{emptyMessage}</Caption>
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={rowKey ? rowKey(row, index) : index}>
                  {columns.map((column) =>
                    column.key === rowHeader ? (
                      <th
                        key={column.key}
                        scope="row"
                        className={clsx(styles.cell, alignClass(column.align))}
                      >
                        {render(row, column)}
                      </th>
                    ) : (
                      <td key={column.key} className={clsx(styles.cell, alignClass(column.align))}>
                        {render(row, column)}
                      </td>
                    ),
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
