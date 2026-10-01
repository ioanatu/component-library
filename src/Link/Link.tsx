import clsx from 'clsx';
import type { AnchorHTMLAttributes, ReactNode, Ref } from 'react';
import styles from './Link.module.css';

/**
 * Inline link following the OFFSET design system: ink text on an accent
 * underline, which thickens on hover. The underline is always there, so a link
 * is told apart from text by shape as well as colour.
 *
 * @param href - Required: an anchor without one is not a link.
 * @param external - Opens in a new tab, sets `rel="noopener noreferrer"`, and
 * says so to assistive tech, so the context change never comes as a surprise.
 * @param ref - Forwarded to the anchor.
 */

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  children: ReactNode;
  ref?: Ref<HTMLAnchorElement>;
}

export function Link({ href, external = false, children, className, ref, ...rest }: LinkProps) {
  return (
    <a
      {...rest}
      ref={ref}
      href={href}
      className={clsx(styles.link, className)}
      target={external ? '_blank' : rest.target}
      rel={external ? 'noopener noreferrer' : rest.rel}
    >
      {children}
      {external ? <span className={styles.srOnly}>{' (opens in a new tab)'}</span> : null}
    </a>
  );
}

export default Link;
