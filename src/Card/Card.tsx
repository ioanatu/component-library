import clsx from 'clsx';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import type { CardElevation, Size } from '../types';
import styles from './Card.module.css';

type CardTitleLevel = 2 | 3 | 4 | 5 | 6;

const ELEVATION_CLASS: Record<CardElevation, string> = {
  flat: styles.elevationFlat,
  sm: styles.elevationSm,
  md: styles.elevationMd,
  lg: styles.elevationLg,
};

const PADDING_CLASS: Record<Size, string> = {
  sm: styles.padSm,
  md: styles.padMd,
  lg: styles.padLg,
};

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
 * @param elevation - flat drops the offset shadow; sm, md and lg set how far it
 * sits from the face, and so how far the card travels on hover and press. Default
 * is md. Use flat where cards stack densely or nest inside another bordered
 * surface and the shadows would pile up.
 * @param padding - Inner spacing: sm 16, md 20, lg 24. Default is md.
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
  elevation?: CardElevation;
  padding?: Size;
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
  elevation = 'md',
  padding = 'md',
  href,
  className,
  children,
  onClick,
  ref,
  ...rest
}: CardProps) {
  const classes = clsx(
    styles.card,
    ELEVATION_CLASS[elevation],
    PADDING_CLASS[padding],
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
