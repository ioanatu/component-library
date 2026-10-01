import clsx from 'clsx';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import type { AlertTone } from '../types';
import { Body } from '../Typography';
import styles from './Alert.module.css';

/**
 * Alert following the OFFSET design system: a tinted panel on the tone's border
 * and offset shadow, led by a glyph so the tone never rests on colour alone.
 *
 * Silent by default. `announce` makes it a live region — `polite` for a status,
 * `assertive` for a problem the user must act on now. An alert that receives
 * focus, such as an error summary, needs neither: focus already reads it.
 *
 * @param tone - Names the intent. Default is info.
 * @param title - Leads the alert. Rendered as a heading when `headingLevel` is set.
 * @param headingLevel - Heading tag for the title, to fit the page outline.
 * @param announce - Makes the alert a live region.
 * @param ref - Forwarded to the outermost element.
 */

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone;
  title?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  announce?: 'polite' | 'assertive';
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

const ICON_PATHS: Record<AlertTone, ReactNode> = {
  info: (
    <>
      <circle cx="8" cy="8" r="6.6" strokeWidth="1.6" />
      <path d="M8 7.5v4M8 4.5h.01" />
    </>
  ),
  success: (
    <>
      <circle cx="8" cy="8" r="6.6" strokeWidth="1.6" />
      <path d="M5 8.2l2.1 2.1L11 6.2" />
    </>
  ),
  warning: <path d="M8 1.8L14.6 13.6H1.4zM8 6.5v3M8 11.6h.01" strokeLinejoin="round" />,
  danger: (
    <>
      <circle cx="8" cy="8" r="6.6" strokeWidth="1.6" />
      <path d="M8 4.5v4.5M8 11.5h.01" />
    </>
  ),
};

export function Alert({
  tone = 'info',
  title,
  headingLevel,
  announce,
  children,
  className,
  ref,
  ...rest
}: AlertProps) {
  const role = announce === 'assertive' ? 'alert' : announce === 'polite' ? 'status' : undefined;

  return (
    <div {...rest} ref={ref} role={role} className={clsx(styles.alert, styles[tone], className)}>
      <svg
        className={styles.icon}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        aria-hidden="true"
        focusable="false"
      >
        {ICON_PATHS[tone]}
      </svg>

      <div className={styles.content}>
        {title ? (
          <Body as={headingLevel ? `h${headingLevel}` : 'p'} level={2} weight="semibold" unbounded>
            {title}
          </Body>
        ) : null}
        {children ? <div className={styles.body}>{children}</div> : null}
      </div>
    </div>
  );
}

export default Alert;
