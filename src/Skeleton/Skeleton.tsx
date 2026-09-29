import clsx from 'clsx';
import type { CSSProperties, HTMLAttributes, Ref } from 'react';
import styles from './Skeleton.module.css';

/**
 * Skeleton following the OFFSET design system: a sunken bar on a hairline border,
 * pulsing while the real content loads.
 *
 * The shapes are `aria-hidden`, because a placeholder is not information. Pass
 * `label` and the wrapper becomes a polite `role="status"` with `aria-busy`, so the
 * wait is announced once instead of as a pile of empty boxes.
 *
 * @param lines - Stacks that many bars, the last one short, for a block of text.
 * @param label - Announced while loading. Set it on one skeleton per region.
 * @param radius - Any CSS length. Defaults to round, or --radius-md over 30px tall.
 */

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  width?: number | string;
  height?: number | string;
  circle?: boolean;
  lines?: number;
  gap?: number;
  radius?: string;
  label?: string;
  ref?: Ref<HTMLDivElement>;
}

const size = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

export function Skeleton({
  width = '100%',
  height = 14,
  circle = false,
  lines = 1,
  gap = 10,
  radius,
  label,
  className,
  style,
  ref,
  ...rest
}: SkeletonProps) {
  const tall = typeof height === 'number' && height > 30;
  const cornerRadius =
    radius ?? (circle ? 'var(--radius-round)' : tall ? 'var(--radius-md)' : 'var(--radius-round)');

  const barStyle: CSSProperties = {
    blockSize: size(height),
    borderRadius: cornerRadius,
  };

  const count = Math.max(1, lines);
  /* The last line of a paragraph rarely reaches the edge. */
  const widthFor = (index: number) => (count > 1 && index === count - 1 ? '70%' : size(width));

  return (
    <div
      {...rest}
      ref={ref}
      className={clsx(styles.group, className)}
      style={{ gap: size(gap), ...style }}
      role={label ? 'status' : undefined}
      aria-busy={label ? true : undefined}
      aria-hidden={label ? undefined : true}
    >
      {label ? <span className={styles.srOnly}>{label}</span> : null}

      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={styles.bar}
          aria-hidden="true"
          style={{
            ...barStyle,
            inlineSize: circle ? size(height) : widthFor(index),
          }}
        />
      ))}
    </div>
  );
}

export default Skeleton;
