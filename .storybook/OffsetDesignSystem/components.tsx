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
import { Code, Eyebrow, Headline, Body, Display } from '../../src/Typography';
import { useTheme } from './OffsetDesignSystem-new';
import { Chip, ButtonNew, Toggle, Tooltip, Card } from '../../src';
import { ACCENTS } from './OffsetDesignSystem-new';

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

export const ThemeToggle = ({ id }: { id?: string }) => {
  const { theme, setTheme } = useTheme();
  const dark = theme === 'dark';
  return (
    <Tooltip content={`Switch to ${dark ? 'light' : 'dark'} theme.`}>
      <Toggle id={id} label="" checked={dark} onChange={() => setTheme(dark ? 'light' : 'dark')} />
    </Tooltip>
  );
};

export const AccentPicker = () => {
  const { accent, setAccent } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Accent color"
      style={{
        display: 'flex',
        gap: 4,
        padding: 3,
        border: 'var(--bw) solid var(--ink)',
        borderRadius: 'var(--r-full)',
        background: 'var(--surface)',
        boxShadow: '2px 2px 0 var(--accent)',
      }}
    >
      {ACCENTS.map((a) => {
        const on = a.value === accent;
        return (
          <button
            key={a.value}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={a.name}
            title={a.name}
            onClick={() => setAccent(a.value)}
            style={{
              width: 24,
              height: 24,
              flex: 'none',
              padding: 0,
              borderRadius: 'var(--r-full)',
              border: `var(--bw) solid ${on ? 'var(--ink)' : 'transparent'}`,
              background: a.value,
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--neutral-0)',
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {on ? '✓' : ''}
          </button>
        );
      })}
    </div>
  );
};

export const Header = () => (
  <header
    style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      padding: '14px 28px',
      background: 'var(--page)',
      borderBottom: 'var(--bw) solid var(--ink)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
      <div
        style={{
          width: 30,
          height: 30,
          flex: 'none',
          border: 'var(--bw) solid var(--ink)',
          borderRadius: 'var(--r-sm)',
          background: 'var(--accent)',
          display: 'grid',
          placeItems: 'center',
          boxShadow: '2px 2px 0 var(--ink)',
        }}
      ></div>

      <Headline level={4} style={{ marginLeft: 4 }}>
        OFFSET
      </Headline>
      <Chip label="v2.0.0" size="lg" fill="transparent"></Chip>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <nav style={{ display: 'flex', gap: 22 }}>
        {[
          ['#foundations', 'Foundations'],
          ['#components', 'Components'],
          ['#guidelines', 'Guidelines'],
          ['#governance', 'Governance'],
        ].map(([href, label]) => (
          <Body
            key={href}
            as="a"
            href={href}
            level={3}
            weight="medium"
            style={{ color: 'var(--ink-muted)' }}
          >
            {label}
          </Body>
        ))}
      </nav>
      <AccentPicker />
      <ThemeToggle />
    </div>
  </header>
);

export const Hero = () => (
  <section id="top" style={{ padding: '64px 0 40px' }}>
    <Eyebrow style={{ marginBottom: 18 }}>React · TypeScript · Design System</Eyebrow>
    <Grid min={280} gap={40} style={{ alignItems: 'start' }}>
      <div>
        <Display level={1}>OFFSET</Display>
        <Body level={1} tone="muted" style={{ marginTop: 20 }}>
          A neo-brutalist component library built on one idea: a bold border and a hard,
          unapologetic offset shadow. Two-tier tokens, one-attribute theming, WCAG 2.1 AA from the
          first commit.
        </Body>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
          {['React 19', 'TypeScript', 'WCAG 2.1 AA', 'Zero-runtime CSS vars', '32 components'].map(
            (t) => (
              <Chip size="lg" label={t} fill="transparent" />
            ),
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 30 }}>
          <ButtonNew variant="primary" size="md" onClick={() => (location.hash = '#install')}>
            Get started
          </ButtonNew>
          <ButtonNew variant="secondary" onClick={() => (location.hash = '#components')}>
            Browse components
          </ButtonNew>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        <Card>
          {/* pad={20}  */}
          <Eyebrow style={{ marginBottom: 10 }}>What changed in v2</Eyebrow>
          <Body as="ul" level={3} tone="muted" style={{ paddingLeft: 18 }}>
            <li>
              <strong style={{ color: 'var(--ink)' }}>Two-tier tokens</strong> — primitives are now
              separate from semantic aliases.
            </li>
            <li>
              <strong style={{ color: 'var(--ink)' }}>Shadow rule</strong> — ink shadow on accent
              fills, accent shadow on neutral surfaces.
            </li>
            <li>
              <strong style={{ color: 'var(--ink)' }}>23 new components</strong> — feedback,
              overlays, navigation, data display.
            </li>
            <li>
              <strong style={{ color: 'var(--ink)' }}>Motion + density tokens</strong>, a warning
              tone, and a governance model.
            </li>
          </Body>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 14 }}>
          {[
            ['32', 'Components'],
            ['148', 'Tokens'],
            ['2', 'Themes'],
          ].map(([n, label]) => (
            <Card key={label} variant="shadow">
              {/* pad={14} shadow={2} */}
              <Headline level={2} weight="bold">
                {n}
              </Headline>
              <Eyebrow level={2} style={{ marginTop: 2 }}>
                {label}
              </Eyebrow>
            </Card>
          ))}
        </div>
      </div>
    </Grid>

    <hr
      style={{ margin: '48px 0 0', border: 'none', borderTop: '2px dashed var(--border-subtle)' }}
    />
  </section>
);
