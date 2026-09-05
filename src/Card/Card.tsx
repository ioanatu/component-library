import clsx from 'clsx';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import type { CardVariant } from '../types';
import styles from './Card.module.css';

type CardTitleLevel = 2 | 3 | 4 | 5 | 6;

/**
 * Bordered surface for a titled block of content.
 *
 * The card is a plain container unless `href` is set, in which case the whole
 * surface becomes one link. There is no click-handler-only mode: a `div` that
 * responds to clicks is unreachable by keyboard, and wrapping the card in a
 * `button` would swallow anything interactive inside it. A card that needs a
 * control should hold that control in `action` or in its children instead.
 *
 * @param title - Card heading.
 * @param titleLevel - Heading level for the title, 2 to 6. Default is 3. Set it so
 * the card does not skip a level in the page it sits on.
 * @param icon - Decorative node in a bordered square above the title. Hidden from
 * assistive tech.
 * @param action - Node placed at the trailing edge of the title row, for a status
 * chip or a menu.
 * @param variant - shadow keeps the offset shadow, flat drops it. Default is shadow.
 * @param href - When set, the whole card is a link. Only use it on a card with no
 * other interactive content.
 * @param onClick - Receives the click event, so an href handler can call
 * preventDefault to take over navigation.
 * @param children - Card body.
 * @param ref - Forwarded to the outermost element.
 */

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick' | 'title'> {
  title?: string;
  titleLevel?: CardTitleLevel;
  icon?: ReactNode;
  action?: ReactNode;
  variant?: CardVariant;
  href?: string;
  children?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  ref?: Ref<HTMLElement>;
}

export function Card({
  title,
  titleLevel = 3,
  icon,
  action,
  variant = 'shadow',
  href,
  className,
  children,
  onClick,
  ref,
  ...rest
}: CardProps) {
  /* shadow is the base card, so only flat has a class of its own. */
  const classes = clsx(
    styles.card,
    styles[variant],
    { [styles.link]: href !== undefined },
    className,
  );

  const Title = `h${titleLevel}` as const;

  const content = (
    <>
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}

      {title !== undefined || action ? (
        <div className={styles.header}>
          {title !== undefined ? <Title className={styles.title}>{title}</Title> : null}
          {action ? <div className={styles.action}>{action}</div> : null}
        </div>
      ) : null}

      {children !== undefined ? <div className={styles.body}>{children}</div> : null}
    </>
  );

  if (href !== undefined) {
    return (
      <a
        {...rest}
        ref={ref as Ref<HTMLAnchorElement>}
        className={classes}
        href={href}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <div {...rest} ref={ref as Ref<HTMLDivElement>} className={classes}>
      {content}
    </div>
  );
}
