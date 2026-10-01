import clsx from 'clsx';
import type { HTMLAttributes, Ref } from 'react';
import { createContext, useContext, useState } from 'react';
import type { AvatarTone, Size } from '../types';
import styles from './Avatar.module.css';

/**
 * Avatar following the OFFSET design system: a round badge on the ink border,
 * showing a photo or, failing that, initials.
 *
 * The badge is one `role="img"` named after the person, whatever is drawn inside,
 * so a screen reader hears the name rather than two stray letters. Set
 * `decorative` when the name is already written beside it, and it is hidden.
 *
 * @param name - Required: the accessible name, and the source of the initials.
 * @param src - Photo URL. Falls back to initials if it fails to load.
 * @param initials - Overrides the letters taken from `name`.
 * @param tone - Fill behind the initials. Default is sunken.
 * @param size - Default is md, or the size of the enclosing AvatarGroup.
 * @param decorative - Hides the avatar from assistive tech.
 */

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  name: string;
  src?: string;
  initials?: string;
  tone?: AvatarTone;
  size?: Size;
  decorative?: boolean;
  ref?: Ref<HTMLSpanElement>;
}

export const AvatarSizeContext = createContext<Size | undefined>(undefined);

/** First letter of the first and last word; handles like `m.reyes` count as two words. */
export const initialsOf = (name: string) => {
  const words = name
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
};

export function Avatar({
  name,
  src,
  initials,
  tone = 'sunken',
  size,
  decorative = false,
  className,
  ref,
  ...rest
}: AvatarProps) {
  const groupSize = useContext(AvatarSizeContext);
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = src && src !== failedSrc;

  return (
    <span
      {...rest}
      ref={ref}
      className={clsx(styles.avatar, styles[size ?? groupSize ?? 'md'], styles[tone], className)}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative ? true : undefined}
    >
      {showImage ? (
        <img className={styles.image} src={src} alt="" onError={() => setFailedSrc(src)} />
      ) : (
        <span aria-hidden="true">{initials ?? initialsOf(name)}</span>
      )}
    </span>
  );
}

export default Avatar;
