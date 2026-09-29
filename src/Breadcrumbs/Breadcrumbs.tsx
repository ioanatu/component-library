import type { HTMLAttributes, MouseEvent, ReactNode, Ref } from 'react';
import { Body } from '../Typography';
import styles from './Breadcrumbs.module.css';

/**
 * Breadcrumbs following the OFFSET design system: a muted trail ending in the
 * current page.
 *
 * A `<nav>` with its own name around an ordered list, since the order is the
 * meaning. The last item is the current page: it carries `aria-current="page"` and
 * is plain text, because a link to where you already are is a dead end.
 *
 * Separators live inside the list item as `aria-hidden` text rather than as items of
 * their own, so the list is announced with the number of levels it actually has.
 *
 * @param items - Ordered from the root. The last one is treated as the current page.
 * @param label - Names the nav, for when a page has more than one.
 * @param separator - Decorative. Default is a slash.
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: BreadcrumbItem[];
  label?: string;
  separator?: ReactNode;
  ref?: Ref<HTMLElement>;
}

export function Breadcrumbs({
  items,
  label = 'Breadcrumb',
  separator = '/',
  className,
  ref,
  ...rest
}: BreadcrumbsProps) {
  return (
    <nav {...rest} ref={ref} aria-label={label} className={className}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const last = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {index > 0 ? (
                <Body as="span" level={3} aria-hidden="true" className={styles.separator}>
                  {separator}
                </Body>
              ) : null}

              {last || !item.href ? (
                <Body
                  as="span"
                  level={3}
                  weight={last ? 'semibold' : 'regular'}
                  tone={last ? 'default' : 'muted'}
                  unbounded
                  aria-current={last ? 'page' : undefined}
                  className={styles.current}
                >
                  {item.label}
                </Body>
              ) : (
                <a href={item.href} onClick={item.onClick} className={styles.link}>
                  <Body as="span" level={3} tone="inherit" unbounded>
                    {item.label}
                  </Body>
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
