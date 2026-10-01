import clsx from 'clsx';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { Children } from 'react';
import type { Size } from '../types';
import { AvatarSizeContext } from './Avatar';
import styles from './Avatar.module.css';

/**
 * A row of overlapping avatars, capped at `max`, with the rest counted in a
 * closing `+N` badge.
 *
 * The row is a `role="group"` named by `label`, and the count is announced as
 * "N more", so a screen reader gets the people and the remainder, not "+9".
 *
 * @param label - Required: names the group, e.g. "Reviewers".
 * @param max - Avatars shown before the rest collapse into the count.
 * @param total - Everyone in the group, when more exist than are passed as children.
 * @param size - Applied to every avatar in the group. Default is md.
 */

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  max?: number;
  total?: number;
  size?: Size;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function AvatarGroup({
  label,
  max = 3,
  total,
  size = 'md',
  children,
  className,
  ref,
  ...rest
}: AvatarGroupProps) {
  const avatars = Children.toArray(children);
  const shown = avatars.slice(0, max);
  const hidden = Math.max(0, (total ?? avatars.length) - shown.length);

  return (
    <div
      {...rest}
      ref={ref}
      className={clsx(styles.group, className)}
      role="group"
      aria-label={label}
    >
      <AvatarSizeContext.Provider value={size}>{shown}</AvatarSizeContext.Provider>
      {hidden > 0 ? (
        <span
          className={clsx(styles.avatar, styles[size], styles.overflow)}
          role="img"
          aria-label={`${hidden} more`}
        >
          <span aria-hidden="true">+{hidden}</span>
        </span>
      ) : null}
    </div>
  );
}

export default AvatarGroup;
