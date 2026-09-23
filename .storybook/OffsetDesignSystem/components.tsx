/* ------------------------------------------------------------------ *
 * Feedback
 * ------------------------------------------------------------------ */

export type Tone = 'info' | 'success' | 'warning' | 'danger';

export const TONE_COLOR: Record<Tone, string> = {
  info: 'var(--accent)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
};
export const TONE_WASH: Record<Tone, string> = {
  info: 'var(--surface)',
  success: 'var(--success-wash)',
  warning: 'var(--warning-wash)',
  danger: 'var(--danger-wash)',
};
export const TONE_ICON: Record<Tone, string> = {
  info: 'ⓘ',
  success: '✓',
  warning: '⚠',
  danger: '⚠',
};

/* ------------------------------------------------------------------ *
 * Primitives
 * ------------------------------------------------------------------ */

import type { ReactNode, CSSProperties } from 'react';
import { Code, Eyebrow, Headline, Body } from '../../src/atoms/Typography';

/** Bordered surface with the offset shadow. Neutral fill → accent shadow. */
export const Card = ({
  children,
  style,
  shadow = 4,
  pad = 22,
}: {
  children: ReactNode;
  style?: CSSProperties;
  shadow?: number;
  pad?: number | string;
}) => (
  <div
    style={{
      border: 'var(--bw) solid var(--ink)',
      borderRadius: 'var(--r-md)',
      background: 'var(--surface)',
      boxShadow: `${shadow}px ${shadow}px 0 var(--accent)`,
      padding: pad,
      minWidth: 0,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Code samples. The dark form is the library's block treatment; the light form
 * strips the inverted surface back to plain muted text for inline token lists.
 */
export const Pre = ({ children, dark = true }: { children: ReactNode; dark?: boolean }) => (
  <Code
    block
    level={2}
    style={
      dark
        ? { borderRadius: 'var(--r-md)' }
        : {
            padding: 0,
            border: 'none',
            background: 'transparent',
            color: 'var(--ink-muted)',
          }
    }
  >
    {children}
  </Code>
);

export const Tag = ({
  children,
  tone = 'accent',
}: {
  children: ReactNode;
  tone?: 'accent' | 'success' | 'danger' | 'muted';
}) => {
  const color = tone === 'muted' ? 'var(--ink-subtle)' : `var(--${tone})`;
  return (
    <Eyebrow
      as="span"
      level={2}
      style={{
        padding: '3px 9px',
        border: `var(--bw) solid ${color}`,
        borderRadius: 'var(--r-full)',
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Eyebrow>
  );
};

export const Section = ({
  id,
  eyebrow,
  title,
  lead,
  children,
  last = false,
}: {
  id: string;
  eyebrow?: string;
  title?: string;
  lead?: ReactNode;
  children?: ReactNode;
  last?: boolean;
}) => (
  <section id={id} style={{ paddingBottom: last ? 44 : 'var(--sec-gap)' }}>
    {eyebrow ? <Eyebrow style={{ marginBottom: 6 }}>{eyebrow}</Eyebrow> : null}
    {title ? (
      <Headline level={2} ruled style={{ marginBottom: 24 }}>
        {title}
      </Headline>
    ) : null}
    {lead ? (
      <Body level={2} tone="muted" style={{ marginBottom: 22 }}>
        {lead}
      </Body>
    ) : null}
    {children}
  </section>
);

export const SubSection = ({
  id,
  title,
  badge,
  lead,
  children,
}: {
  id: string;
  title: string;
  badge?: string;
  lead?: ReactNode;
  children: ReactNode;
}) => (
  <section id={id} style={{ paddingBottom: 'var(--sec-gap)' }}>
    <Headline level={3} style={{ marginBottom: 4 }}>
      {title}
      {badge ? (
        <span style={{ marginLeft: 8, verticalAlign: 'middle' }}>
          <Tag>{badge}</Tag>
        </span>
      ) : null}
    </Headline>
    {lead ? (
      <Body level={2} tone="muted" style={{ marginBottom: 22 }}>
        {lead}
      </Body>
    ) : null}
    {children}
  </section>
);

export const Grid = ({
  min = 280,
  gap = 16,
  children,
  style,
}: {
  min?: number;
  gap?: number;
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`,
      gap,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Spinner = ({ size = 22, color = 'var(--ink)' }: { size?: number; color?: string }) => (
  <span
    aria-hidden="true"
    style={{
      width: size,
      height: size,
      flex: 'none',
      display: 'block',
      border: `${size > 16 ? 3 : 2}px solid ${color}`,
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'off-spin .7s linear infinite',
    }}
  />
);

export const inputStyle = (state?: 'error' | 'disabled'): CSSProperties => ({
  width: '100%',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--fs-md)',
  padding: '11px 14px',
  border: `var(--bw) solid ${state === 'error' ? 'var(--danger)' : state === 'disabled' ? 'var(--ink-subtle)' : 'var(--ink)'}`,
  borderRadius: 'var(--r-sm)',
  background: state === 'disabled' ? 'var(--sunken)' : 'var(--surface)',
  color: state === 'disabled' ? 'var(--ink-subtle)' : 'var(--ink)',
  boxShadow: `2px 2px 0 ${state === 'error' ? 'var(--danger)' : 'var(--border-subtle)'}`,
  cursor: state === 'disabled' ? 'not-allowed' : undefined,
});

/** Color is always paired with an icon and a word, so meaning survives grayscale. */
export const Alert = ({
  tone,
  title,
  children,
  action,
}: {
  tone: Tone;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) => (
  <div
    role={tone === 'danger' ? 'alert' : undefined}
    style={{
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      border: 'var(--bw) solid var(--ink)',
      borderLeft: `6px solid ${TONE_COLOR[tone]}`,
      borderRadius: 'var(--r-md)',
      background: TONE_WASH[tone],
      boxShadow: tone === 'info' ? '4px 4px 0 var(--accent)' : '4px 4px 0 var(--ink)',
      padding: '16px 20px',
    }}
  >
    <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1.5, color: TONE_COLOR[tone] }}>
      {TONE_ICON[tone]}
    </span>
    <div style={{ minWidth: 0 }}>
      <Body level={3} weight="semibold" style={{ marginBottom: 3 }}>
        {title}
      </Body>
      {children ? (
        <Body level={3} tone="muted">
          {children}
        </Body>
      ) : null}
    </div>
    {action ? <div style={{ marginLeft: 'auto', flex: 'none' }}>{action}</div> : null}
  </div>
);

export const Badge = ({
  children,
  tone = 'neutral',
  solid = false,
}: {
  children: ReactNode;
  tone?: Tone | 'neutral';
  solid?: boolean;
}) => {
  const neutral = tone === 'neutral';
  return (
    <Body
      as="span"
      level={3}
      mono
      weight="medium"
      style={{
        padding: '4px 12px',
        border: `var(--bw) solid ${neutral ? 'var(--ink-subtle)' : 'var(--ink)'}`,
        borderRadius: 'var(--r-full)',
        background: solid ? 'var(--accent)' : neutral ? 'var(--sunken)' : TONE_WASH[tone as Tone],
        color: solid ? 'var(--on-accent)' : neutral ? 'var(--ink-muted)' : 'var(--ink)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Body>
  );
};

export const Skeleton = ({ h = 14, w = '100%' }: { h?: number; w?: number | string }) => (
  <span
    aria-hidden="true"
    style={{
      display: 'block',
      height: h,
      width: w,
      borderRadius: h > 30 ? 'var(--r-sm)' : 'var(--r-full)',
      background: 'var(--sunken)',
      border: '1px solid var(--border-subtle)',
      animation: 'off-pulse 1.5s ease-in-out infinite',
    }}
  />
);
/* ------------------------------------------------------------------ *
 * Table helpers
 * ------------------------------------------------------------------ */

/** Heavy outside, quiet inside — the container is bordered, rows divide subtly. */
export const DataTable = <T,>({
  columns,
  rows,
  cell,
  minWidth = 620,
  header,
}: {
  columns: { key: string; label: string; span: string }[];
  rows: T[];
  cell: (row: T, key: string) => ReactNode;
  minWidth?: number;
  header?: ReactNode;
}) => {
  const template = columns.map((c) => c.span).join(' ');
  return (
    <div
      style={{
        border: 'var(--bw) solid var(--ink)',
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
        boxShadow: '4px 4px 0 var(--accent)',
      }}
    >
      {header}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: template,
              background: 'var(--ink)',
              color: 'var(--surface)',
            }}
          >
            {columns.map((c) => (
              <Body
                key={c.key}
                level={3}
                weight="semibold"
                tone="inherit"
                style={{ padding: '11px 18px' }}
              >
                {c.label}
              </Body>
            ))}
          </div>
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: template,
                borderTop:
                  i === 0 ? 'var(--bw) solid var(--ink)' : '1px solid var(--border-subtle)',
                background: i % 2 ? 'var(--sunken)' : 'var(--surface)',
              }}
            >
              {columns.map((c) => (
                <div key={c.key} style={{ padding: '12px 18px', minWidth: 0 }}>
                  {cell(row, c.key)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SpecTable = ({ title, rows }: { title: string; rows: [string, ReactNode][] }) => (
  <div
    style={{
      border: 'var(--bw) solid var(--ink)',
      borderRadius: 'var(--r-md)',
      overflow: 'hidden',
      boxShadow: '4px 4px 0 var(--accent)',
    }}
  >
    <Body
      level={3}
      weight="semibold"
      tone="inherit"
      style={{ padding: '12px 16px', background: 'var(--ink)', color: 'var(--surface)' }}
    >
      {title}
    </Body>
    <div style={{ background: 'var(--surface)' }}>
      {rows.map(([k, v], i) => (
        <div
          key={k}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            borderTop: i === 0 ? 'var(--bw) solid var(--ink)' : '1px solid var(--border-subtle)',
          }}
        >
          <Body level={3} mono style={{ padding: '9px 16px' }}>
            {k}
          </Body>
          <Body level={3} tone="muted" style={{ padding: '9px 16px' }}>
            {v}
          </Body>
        </div>
      ))}
    </div>
  </div>
);
