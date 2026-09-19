import clsx from 'clsx';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import type { ButtonNewVariant, Elevation, Size } from '../types';
import styles from './ButtonNew.module.css';

type ButtonType = 'button' | 'reset' | 'submit';

/** The design system's three offset distances: 2px, 4px and 8px. */
const ELEVATION_CLASS: Record<Elevation, string> = {
  sm: styles.elevationSm,
  md: styles.elevationMd,
  lg: styles.elevationLg,
};

/**
 * CTA button following the OFFSET design system: a 2px ink border, a hard offset
 * shadow, and one primary action per view.
 *
 * Intent selects the variant and the variant selects the colour, so there is no
 * `color` prop. Colour and spacing come from the tokens in styles/colors.css and
 * styles/spacing.css; nothing here carries a raw value.
 *
 * Loading never changes the button's width. With an icon, the spinner takes the
 * icon's place. Without one, the spinner hangs in a zero-width slot and the
 * spinner and label re-centre together inside the resting width.
 *
 * @param variant - Names the intent. Default is primary.
 * @param size - Button size. Default is md.
 * @param elevation - How far the offset shadow sits from the face, and so how far
 * the face travels when it is pressed: sm 2px, md 4px, lg 8px. Left unset, the
 * button takes its size's own distance — 2px for sm, 4px for md and lg. Ghost
 * carries no shadow, so it ignores this.
 * @param type - HTML button type. Default is 'button'. Ignored when href is set.
 * @param href - When set, the button renders as an anchor that navigates instead
 * of a button.
 * @param icon - Decorative node before the label, hidden from assistive tech. On
 * its own, with no children, it makes a square icon-only button — which the type
 * then requires an `aria-label` for, since there is no text to name it.
 * @param loading - Reports work in progress. The control keeps its colours and
 * its place in the tab order, takes `aria-busy`, and stops responding to clicks.
 * @param loadingLabel - Text announced while loading, and appended to the
 * accessible name for as long as it lasts. Default is 'Loading'.
 * @param disabled - Refuses input outright. A disabled button is inert via the
 * native attribute; a disabled link keeps its href but cannot be followed.
 * @param fullWidth - Stretches the button to its container.
 * @param children - Button label, and its accessible name.
 * @param onClick - Receives the click event, so an href handler can call
 * preventDefault to take over navigation. Not called while loading or disabled.
 * @param ref - Forwarded to the underlying button, or anchor when href is set.
 */

interface BaseButtonNewProps {
  variant?: ButtonNewVariant;
  size?: Size;
  elevation?: Elevation;
  icon?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => void;
}

/** A label names the control, so an aria-label is optional here. */
interface LabelledContent {
  children: ReactNode;
  icon?: ReactNode;
}

/**
 * Icon-only. There is no text to read, so the type demands the accessible name
 * rather than leaving it to a review to catch.
 */
interface IconOnlyContent {
  children?: never;
  icon: ReactNode;
  'aria-label': string;
}

export interface ButtonNewElementProps
  extends
    BaseButtonNewProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'children'> {
  href?: never;
  type?: ButtonType;
  ref?: Ref<HTMLButtonElement>;
}

export interface AnchorNewElementProps
  extends
    BaseButtonNewProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick' | 'children'> {
  href: string;
  type?: never;
  ref?: Ref<HTMLAnchorElement>;
}

export type ButtonNewProps =
  | (ButtonNewElementProps & LabelledContent)
  | (ButtonNewElementProps & IconOnlyContent)
  | (AnchorNewElementProps & LabelledContent)
  | (AnchorNewElementProps & IconOnlyContent);

export function ButtonNew({
  children,
  className,
  variant = 'primary',
  size = 'md',
  elevation,
  icon,
  loading = false,
  loadingLabel = 'Loading',
  disabled = false,
  fullWidth = false,
  type = 'button',
  href,
  onClick,
  ref,
  ...rest
}: ButtonNewProps) {
  const isIconOnly = children === undefined || children === null;
  const isInert = disabled || loading;

  const classes = clsx(
    styles.button,
    styles[variant],
    styles[size],
    elevation && ELEVATION_CLASS[elevation],
    { [styles.iconOnly]: isIconOnly, [styles.fullWidth]: fullWidth },
    className,
  );

  const spinner = <span className={styles.spinner} aria-hidden="true" />;

  let leading: ReactNode = null;
  if (icon !== undefined) {
    /* The icon slot is a fixed box, so the spinner replacing the icon costs no width. */
    leading = (
      <span className={styles.iconSlot} aria-hidden="true">
        {loading ? spinner : icon}
      </span>
    );
  } else if (loading) {
    leading = <span className={styles.spinnerSlot}>{spinner}</span>;
  }

  const content = (
    <span
      className={clsx(styles.content, {
        [styles.shifted]: loading && icon === undefined && !isIconOnly,
      })}
    >
      {leading}
      {isIconOnly ? null : <span className={styles.label}>{children}</span>}
      {loading ? (
        <span className={styles.srOnly} role="status">
          {loadingLabel}
        </span>
      ) : null}
    </span>
  );

  if (href !== undefined) {
    /**
     * An anchor has no disabled attribute, so it keeps its href and is marked
     * aria-disabled instead. That leaves it focusable, which is what lets a
     * screen reader user find the control and hear why it is not working.
     */
    const handleAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (isInert) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event);
    };

    const handleAnchorKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
      /* Enter follows a link without firing a click first, so it is stopped here. */
      if (isInert && event.key === 'Enter') {
        event.preventDefault();
      }
    };

    return (
      <a
        /* The props are a union of the button and anchor shapes, so rest carries
           both sets of handlers. This branch has already settled which element
           renders, which is what the cast records. */
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        ref={ref as Ref<HTMLAnchorElement>}
        className={classes}
        href={href}
        aria-disabled={isInert || undefined}
        aria-busy={loading || undefined}
        onClick={handleAnchorClick}
        onKeyDown={handleAnchorKeyDown}
      >
        {content}
      </a>
    );
  }

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isInert) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      ref={ref as Ref<HTMLButtonElement>}
      className={classes}
      type={type}
      /**
       * Only a genuinely disabled button is made inert natively. Loading uses
       * aria-disabled so the button keeps focus while the work runs — a native
       * disabled attribute would drop focus to the body mid-task.
       */
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={handleButtonClick}
    >
      {content}
    </button>
  );
}
