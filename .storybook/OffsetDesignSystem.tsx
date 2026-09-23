import React, {
  createContext,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Body, Caption, Code, Display, Eyebrow, Headline, Label } from '../src/Typography';
import { PRINCIPLES_LIST } from './OffsetDesignSystem.text';

/* ------------------------------------------------------------------ *
 * Tokens
 * ------------------------------------------------------------------ */

export type Theme = 'light' | 'dark';
export type Density = 'comfortable' | 'compact';

const TOKENS_CSS = `
:root {
  /* Tier 1 — primitives. Never referenced by a component. */
  --neutral-0:#FFFFFF; --neutral-50:#F7F5F5; --neutral-100:#EDEBEA;
  --neutral-200:#DCD9D7; --neutral-400:#8A8683; --neutral-500:#605C59;
  --neutral-800:#1A1A1A; --neutral-900:#0C0C0E;
  --blue-50:#EDF2FE;  --blue-500:#3367F6; --blue-700:#1A3FA8;
  --green-50:#E8F8F1; --green-500:#1FA971; --green-700:#158257;
  --amber-50:#FEF5E7; --amber-500:#E8960C; --amber-700:#B87508;
  --red-50:#FEEDEC;   --red-500:#D63F38;   --red-700:#D22C23;

  --size-1:4px;  --size-2:8px;  --size-3:12px; --size-4:16px;
  --size-6:24px; --size-8:32px; --size-12:48px;

  /* Tier 2 — semantic aliases. The public contract. */
  --page:var(--neutral-50); --surface:var(--neutral-0); --sunken:var(--neutral-100);
  --ink:var(--neutral-800); --ink-muted:var(--neutral-500); --ink-subtle:var(--neutral-400);
  --border-subtle:var(--neutral-200);
  --accent:var(--blue-500); --accent-strong:var(--blue-700);
  --accent-wash:var(--blue-50); --on-accent:var(--neutral-0);
  --danger:var(--red-500);    --danger-wash:var(--red-50);
  --success:var(--green-500); --success-wash:var(--green-50);
  --warning:var(--amber-500); --warning-wash:var(--amber-50);
  --code-bg:var(--neutral-900); --code-ink:#F2F2F0;
  --scrim:rgba(12,12,14,.6);

  --space-1:var(--size-1); --space-2:var(--size-2); --space-3:var(--size-3);
  --space-4:var(--size-4); --space-6:var(--size-6); --space-8:var(--size-8);
  --space-12:var(--size-12);

  --bw:2px; --bw-thick:3px;
  --r-sm:8px; --r-md:12px; --r-lg:20px; --r-full:999px;

  --dur-instant:80ms; --dur-fast:140ms; --dur-slow:240ms;
  --ease:cubic-bezier(.2,.8,.2,1);

  --sec-gap:80px;
}

[data-theme="dark"] {
  --page:#121214; --surface:#1D1D21; --sunken:#26262B;
  --ink:#F2F2F0; --ink-muted:#A9A9A4; --ink-subtle:#7A7A76;
  --border-subtle:#3A3A40;
  --accent:#5B82FF; --accent-strong:#7C9BFF; --accent-wash:#1B2340; --on-accent:#101014;
  --danger:#FF6B61;  --danger-wash:#3A1E1C;
  --success:#3FCB92; --success-wash:#12301F;
  --warning:#F2B33D; --warning-wash:#33260D;
  --code-bg:#0C0C0E; --code-ink:#F2F2F0;
}

[data-density="compact"] { --sec-gap:48px; }

.offset-root *, .offset-root *::before, .offset-root *::after { box-sizing:border-box; }
.offset-root { background:var(--page); color:var(--ink); font-family:var(--font-sans); -webkit-font-smoothing:antialiased; }
.offset-root a { color:var(--accent); text-decoration:none; }
.offset-root a:hover { color:var(--accent-strong); text-decoration:underline; }
.offset-root :focus-visible { outline:var(--bw-thick) solid var(--accent); outline-offset:2px; border-radius:2px; }
.offset-root pre { margin:0; }

/* Press: the element travels exactly its offset distance. */
.off-press { transition:transform var(--dur-instant) var(--ease), box-shadow var(--dur-instant) var(--ease); }
.off-press:hover { transform:translate(1px,1px); }
.off-press:active { transform:translate(4px,4px); box-shadow:0 0 0 transparent !important; }
.off-press-sm:hover { transform:translate(1px,1px); }
.off-press-sm:active { transform:translate(2px,2px); box-shadow:0 0 0 transparent !important; }

.off-ghost:hover { background:var(--sunken); border-color:var(--ink); }
.off-input { transition:box-shadow var(--dur-fast) var(--ease); }
.off-input:focus { box-shadow:2px 2px 0 var(--accent); }
.off-navlink:hover { background:var(--sunken); border-color:var(--ink); text-decoration:none; color:var(--ink); }

@keyframes off-spin  { to { transform:rotate(360deg); } }
@keyframes off-pulse { 0%,100% { opacity:.45 } 50% { opacity:.9 } }
@keyframes off-rise  { from { transform:translateY(12px); opacity:0 } to { transform:translateY(0); opacity:1 } }

@media (prefers-reduced-motion: reduce) {
  .offset-root *, .offset-root *::before, .offset-root *::after {
    animation-duration:.01ms !important; transition-duration:.01ms !important;
  }
}
`;

/* ------------------------------------------------------------------ *
 * Primitives
 * ------------------------------------------------------------------ */

/** Bordered surface with the offset shadow. Neutral fill → accent shadow. */
const Card = ({
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

const Pre = ({ children, dark = true }: { children: ReactNode; dark?: boolean }) => (
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

const Tag = ({
  children,
  tone = 'accent',
}: {
  children: ReactNode;
  tone?: 'accent' | 'success' | 'muted';
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

const Section = ({
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

const SubSection = ({
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

const Grid = ({
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

/** A card heading one step below Headline 3, for dense cards. */
const CardTitle = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <Body as="h4" level={2} weight="semibold" style={style}>
    {children}
  </Body>
);

/* ------------------------------------------------------------------ *
 * Button
 * ------------------------------------------------------------------ */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  iconStart?: ReactNode;
}

/** Intent selects the variant; the variant selects the color. There is no `color` prop. */
export const Button = ({
  variant = 'secondary',
  size = 'md',
  loading = false,
  fullWidth = false,
  iconStart,
  disabled,
  children,
  style,
  ...rest
}: ButtonProps) => {
  const sizes: Record<ButtonSize, CSSProperties> = {
    sm: { fontSize: 13, padding: '7px 14px', borderRadius: 'var(--r-sm)' },
    md: { fontSize: 15, padding: '11px 22px', borderRadius: 'var(--r-md)' },
    lg: { fontSize: 17, padding: '15px 30px', borderRadius: 'var(--r-md)' },
  };
  const offset = size === 'sm' ? 2 : 4;

  const fills: Record<ButtonVariant, CSSProperties> = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--on-accent)',
      boxShadow: `${offset}px ${offset}px 0 var(--ink)`,
    },
    secondary: {
      background: 'var(--surface)',
      color: 'var(--ink)',
      boxShadow: `${offset}px ${offset}px 0 var(--accent)`,
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ink)',
      border: 'var(--bw) solid transparent',
      boxShadow: 'none',
    },
    destructive: {
      background: 'var(--danger)',
      color: '#FFFFFF',
      boxShadow: `${offset}px ${offset}px 0 var(--ink)`,
    },
  };

  const isOff = disabled || loading;

  return (
    <button
      type="button"
      disabled={disabled}
      aria-busy={loading || undefined}
      className={
        variant === 'ghost'
          ? 'off-ghost'
          : isOff
            ? undefined
            : size === 'sm'
              ? 'off-press off-press-sm'
              : 'off-press'
      }
      style={{
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'],
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        width: fullWidth ? '100%' : undefined,
        border: 'var(--bw) solid var(--ink)',
        cursor: disabled ? 'not-allowed' : loading ? 'progress' : 'pointer',
        ...sizes[size],
        ...fills[variant],
        ...(disabled
          ? {
              background: 'var(--sunken)',
              color: 'var(--ink-subtle)',
              borderColor: 'var(--ink-subtle)',
              boxShadow: 'none',
            }
          : null),
        ...style,
      }}
      {...rest}
    >
      {loading ? <Spinner size={14} color="currentColor" /> : iconStart}
      {children}
    </button>
  );
};

const Spinner = ({ size = 22, color = 'var(--ink)' }: { size?: number; color?: string }) => (
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

/* ------------------------------------------------------------------ *
 * Field / inputs
 * ------------------------------------------------------------------ */

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  helper?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  children: ReactNode;
}

/** Owns label association, helper text, required marking, and error announcement. */
export const Field = ({
  label,
  htmlFor,
  required,
  helper,
  error,
  disabled,
  children,
}: FieldProps) => (
  <div>
    <Label htmlFor={htmlFor} required={required} disabled={disabled}>
      {label}
    </Label>
    {children}
    {error ? (
      <Caption id={`${htmlFor}-msg`} error style={{ marginTop: 7, display: 'flex', gap: 6 }}>
        <span aria-hidden="true">⚠</span>
        {error}
      </Caption>
    ) : helper ? (
      <Caption style={{ marginTop: 7 }}>{helper}</Caption>
    ) : null}
  </div>
);

const inputStyle = (state?: 'error' | 'disabled'): CSSProperties => ({
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

/* ------------------------------------------------------------------ *
 * Feedback
 * ------------------------------------------------------------------ */

export type Tone = 'info' | 'success' | 'warning' | 'danger';

const TONE_COLOR: Record<Tone, string> = {
  info: 'var(--accent)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
};
const TONE_WASH: Record<Tone, string> = {
  info: 'var(--surface)',
  success: 'var(--success-wash)',
  warning: 'var(--warning-wash)',
  danger: 'var(--danger-wash)',
};
const TONE_ICON: Record<Tone, string> = { info: 'ⓘ', success: '✓', warning: '⚠', danger: '⚠' };

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

const Skeleton = ({ h = 14, w = '100%' }: { h?: number; w?: number | string }) => (
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

/** Header cell text on the inverted ink bar. Inherits the bar's surface color. */
const HeaderCell = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <Body level={3} weight="semibold" tone="inherit" style={style}>
    {children}
  </Body>
);

/** Heavy outside, quiet inside — the container is bordered, rows divide subtly. */
const DataTable = <T,>({
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
              <HeaderCell key={c.key} style={{ padding: '11px 18px' }}>
                {c.label}
              </HeaderCell>
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

const SpecTable = ({ title, rows }: { title: string; rows: [string, ReactNode][] }) => (
  <div
    style={{
      border: 'var(--bw) solid var(--ink)',
      borderRadius: 'var(--r-md)',
      overflow: 'hidden',
      boxShadow: '4px 4px 0 var(--accent)',
    }}
  >
    <HeaderCell style={{ padding: '12px 16px', background: 'var(--ink)', color: 'var(--surface)' }}>
      {title}
    </HeaderCell>
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

/* ------------------------------------------------------------------ *
 * Theme context
 * ------------------------------------------------------------------ */

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
}
const ThemeContext = createContext<ThemeCtx>({ theme: 'light', setTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

/** Scope, don't fork: a theme is a set of semantic token values under one attribute. */
export const ThemeProvider = ({
  theme,
  density = 'comfortable',
  accent,
  children,
}: {
  theme: Theme;
  density?: Density;
  accent?: string;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.getElementById('offset-tokens')) return;
    const style = document.createElement('style');
    style.id = 'offset-tokens';
    style.textContent = TOKENS_CSS;
    document.head.appendChild(style);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!accent) {
      el.style.removeProperty('--accent');
      el.style.removeProperty('--accent-strong');
      el.style.removeProperty('--accent-wash');
      return;
    }
    el.style.setProperty('--accent', accent);
    el.style.setProperty('--accent-strong', `color-mix(in oklab, ${accent}, black 18%)`);
    el.style.setProperty('--accent-wash', `color-mix(in oklab, ${accent}, white 88%)`);
  }, [accent]);

  return (
    <div
      ref={ref}
      className="offset-root"
      data-theme={theme}
      data-density={density}
      style={{ minHeight: '100vh' }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * Page sections
 * ------------------------------------------------------------------ */

const ThemeToggle = ({ id }: { id?: string }) => {
  const { theme, setTheme } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      style={{
        width: 60,
        height: 32,
        flex: 'none',
        padding: 3,
        border: 'var(--bw) solid var(--ink)',
        borderRadius: 'var(--r-full)',
        background: 'var(--surface)',
        boxShadow: '2px 2px 0 var(--accent)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: dark ? 'flex-end' : 'flex-start',
        transition: 'all var(--dur-fast) var(--ease)',
      }}
    >
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: 'var(--r-full)',
          background: 'var(--ink)',
          display: 'block',
        }}
      />
    </button>
  );
};

const Header = () => (
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
      >
        <div
          style={{ width: 12, height: 10, border: '2px solid var(--on-accent)', borderRadius: 2 }}
        />
      </div>
      <Body as="span" level={1} weight="bold">
        OFFSET
      </Body>
      <Body
        as="span"
        level={3}
        mono
        tone="muted"
        style={{
          padding: '2px 8px',
          border: 'var(--bw) solid var(--ink)',
          borderRadius: 'var(--r-full)',
        }}
      >
        v2.0.0
      </Body>
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
      <ThemeToggle />
    </div>
  </header>
);

const Hero = () => (
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
              <Body
                key={t}
                as="span"
                level={3}
                mono
                style={{
                  padding: '6px 14px',
                  border: 'var(--bw) solid var(--ink)',
                  borderRadius: 'var(--r-full)',
                }}
              >
                {t}
              </Body>
            ),
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 30 }}>
          <Button variant="primary" size="md" onClick={() => (location.hash = '#install')}>
            Get started
          </Button>
          <Button onClick={() => (location.hash = '#components')}>Browse components</Button>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 14 }}>
        <Card pad={20}>
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
            <Card key={label} pad={14} shadow={2}>
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

const PRINCIPLES: [string, string, string][] = PRINCIPLES_LIST;

const TYPE_SCALE: { sample: ReactNode; token: string; spec: string; use: string }[] = [
  {
    sample: (
      <Display level={2} as="p">
        Display
      </Display>
    ),
    token: '--fs-4xl',
    spec: '56 / 57 · 700 · -3%',
    use: 'Hero only, once per page',
  },
  {
    sample: (
      <Headline level={1} as="p">
        Page title
      </Headline>
    ),
    token: '--fs-3xl',
    spec: '40 / 44 · 600 · -2.5%',
    use: 'h1 inside the app shell',
  },
  {
    sample: (
      <Headline level={2} as="p">
        Section heading
      </Headline>
    ),
    token: '--fs-2xl',
    spec: '30 / 36 · 600 · -2%',
    use: 'h2',
  },
  {
    sample: (
      <Headline level={3} as="p">
        Card &amp; dialog title
      </Headline>
    ),
    token: '--fs-xl',
    spec: '22 / 29 · 600 · 0',
    use: 'h3',
  },
  {
    sample: (
      <Body level={1} tone="muted">
        Lead paragraph — the one sentence that explains the screen before anyone reads the rest of
        it.
      </Body>
    ),
    token: '--fs-lg',
    spec: '18 / 28 · 400',
    use: 'Max 44ch measure',
  },
  {
    sample: (
      <Body level={2}>
        Body. The default for all running text; 1.7 line height and a 72–76 character measure keep
        long passages readable at this weight.
      </Body>
    ),
    token: '--fs-md',
    spec: '16 / 27 · 400',
    use: 'Body default',
  },
  {
    sample: (
      <Body level={3} tone="muted">
        Small — helper text, table cells, card body, captions. The floor for any sentence a user
        must read.
      </Body>
    ),
    token: '--fs-sm',
    spec: '14 / 22 · 400',
    use: 'Minimum for prose',
  },
  {
    sample: <Eyebrow tone="default">Eyebrow &amp; code label</Eyebrow>,
    token: '--fs-xs',
    spec: '12 / 16 · 500 · +14%',
    use: 'Mono, uppercase, never a sentence',
  },
];

const SEMANTIC_ROWS: [string, string, ReactNode][] = [
  ['--page', 'var(--page)', 'App canvas. Never a card fill.'],
  ['--surface', 'var(--surface)', 'Cards, menus, modals, inputs.'],
  ['--sunken', 'var(--sunken)', 'Inactive tabs, table stripes, wells.'],
  [
    '--ink',
    'var(--ink)',
    <>
      Body text <em>and</em> every structural border.
    </>,
  ],
  ['--ink-muted', 'var(--ink-muted)', 'Secondary prose. Meets AA at 14px+.'],
  ['--ink-subtle', 'var(--ink-subtle)', 'Labels and metadata only — never body copy.'],
  ['--accent', 'var(--accent)', 'One primary action per view. Focus ring. Offset shadow.'],
  ['--on-accent', 'var(--on-accent)', 'Text on an accent fill. Flips near-black in dark mode.'],
  ['--border-subtle', 'var(--border-subtle)', 'Internal dividers inside an already-bordered box.'],
];

const A11Y_ROWS: [string, string, string, string][] = [
  [
    'Select',
    'listbox + button',
    '↑ ↓ · Enter · Esc · Home/End · typeahead',
    'Label, value, expanded, position in set',
  ],
  [
    'Tabs / TabMenu',
    'tablist, roving tabindex',
    '← → · Home/End',
    'Selected state, controlled panel',
  ],
  [
    'Modal / Drawer',
    'dialog, focus trap',
    'Tab cycles · Esc closes',
    'Title on open; focus returns to trigger',
  ],
  [
    'Toast',
    'status / alert region',
    'Not focus-stealing; reachable via F6',
    'Polite for success, assertive for error',
  ],
  [
    'Tooltip',
    'tooltip + describedby',
    'Shows on focus, not hover alone · Esc hides',
    "Read as the trigger's description",
  ],
  [
    'Checkbox / Radio',
    'native input, custom paint',
    'Space · arrows within a group',
    'Checked, indeterminate, group label',
  ],
  [
    'Field / Input',
    'label + describedby + invalid',
    'Standard',
    'Helper text, then the error, on blur',
  ],
  [
    'Table',
    'table, scope, aria-sort',
    'Enter on a sortable header',
    'Caption, sort direction, row count',
  ],
];

const COVERAGE: [string, string, 'STABLE' | 'NEW' | 'EXTENDED' | 'PLANNED'][] = [
  ['Actions', 'Button, IconButton, ButtonGroup, Link', 'STABLE'],
  [
    'Forms',
    'Field, Input, Textarea, Select, Checkbox, Radio, Toggle, Slider, SearchInput',
    'STABLE',
  ],
  ['Feedback', 'Badge, Alert, Toast, Progress, Spinner, Skeleton, EmptyState', 'NEW'],
  ['Overlays', 'Modal, Drawer, Popover, Tooltip, ConfirmDialog', 'NEW'],
  ['Navigation', 'Tabs, TabMenu, Breadcrumb, Pagination, SideNav', 'EXTENDED'],
  ['Data', 'Table, Avatar, AvatarGroup, Stat, DescriptionList, Chip', 'NEW'],
  ['Layout', 'Card, Stack, Divider, Toolbar', 'STABLE'],
  ['Not yet', 'DatePicker, Combobox, FileUpload, DataGrid, Charts', 'PLANNED'],
];

const TABS: { id: string; label: string; body: string }[] = [
  {
    id: 'overview',
    label: 'Overview',
    body: 'Each tab links to its panel through aria-controls, and only the selected tab sits in the tab order — arrow keys move between the rest. The selected edge uses the 3px emphasis border so it reads as connected to its panel.',
  },
  {
    id: 'keyboard',
    label: 'Keyboard',
    body: 'Left and Right move selection, Home and End jump to the first and last tab, and focus follows selection. Nothing here requires a mouse, and nothing depends on hover to be discoverable.',
  },
  {
    id: 'panels',
    label: 'Panels',
    body: 'A panel is a labelled region, not a container: it inherits the surface token, drops its own shadow to avoid stacking two offsets, and never scrolls independently of the page.',
  },
];

interface BatchRow {
  name: string;
  owner: string;
  count: string;
  status: string;
  tone: Tone | 'neutral';
}
const BATCHES: BatchRow[] = [
  { name: 'Accounts', owner: 'ioana.t', count: '48,210', status: 'Deployed', tone: 'success' },
  { name: 'Invoices', owner: 'm.reyes', count: '12,884', status: 'In review', tone: 'info' },
  { name: 'Attachments', owner: 'k.bauer', count: '204,117', status: 'Degraded', tone: 'warning' },
  { name: 'Audit log', owner: 'ioana.t', count: '1,902,340', status: 'Failed', tone: 'danger' },
  { name: 'Sessions', owner: 'm.reyes', count: '76,455', status: 'Deployed', tone: 'success' },
];

/* ------------------------------------------------------------------ *
 * Root
 * ------------------------------------------------------------------ */

export interface OffsetDesignSystemProps {
  /** Initial theme. The header switch takes over after first interaction. */
  theme?: Theme;
  /** Overrides --accent and derives its strong/wash stops. */
  accent?: string;
  /** Tightens section rhythm without touching a component. */
  density?: Density;
}

export default function OffsetDesignSystem({
  theme: initialTheme = 'light',
  accent,
  density = 'comfortable',
}: OffsetDesignSystemProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [tab, setTab] = useState('overview');
  const [view, setView] = useState('Grid');
  const [sel, setSel] = useState('Medium');
  const [selOpen, setSelOpen] = useState(false);
  const [slider, setSlider] = useState(82);
  const [page, setPage] = useState(3);
  const [tip, setTip] = useState(false);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState(false);

  const toastTimer = useRef<number | undefined>(undefined);
  const modalTrigger = useRef<HTMLElement | null>(null);
  const dialogInput = useRef<HTMLInputElement>(null);

  const fireToast = useCallback(() => {
    window.clearTimeout(toastTimer.current);
    setToast(true);
    toastTimer.current = window.setTimeout(() => setToast(false), 4200);
  }, []);

  const openModal = useCallback((e: React.MouseEvent) => {
    modalTrigger.current = e.currentTarget as HTMLElement;
    setModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setModal(false);
    modalTrigger.current?.focus();
  }, []);

  useEffect(() => {
    if (modal) dialogInput.current?.focus();
  }, [modal]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (modal) closeModal();
      setSelOpen(false);
      setTip(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modal, closeModal]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const themeCtx = useMemo(() => ({ theme, setTheme }), [theme]);
  const activeTab = TABS.find((t) => t.id === tab) ?? TABS[0];

  return (
    <ThemeContext.Provider value={themeCtx}>
      <ThemeProvider theme={theme} density={density} accent={accent}>
        <Header />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px' }}>
          <Hero />

          {/* Principles ------------------------------------------------ */}
          <Section id="principles" eyebrow="Principles" title="Four rules the whole library obeys">
            <Grid min={230}>
              {PRINCIPLES.map(([n, title, body]) => (
                <Card key={n}>
                  <Eyebrow level={2} style={{ marginBottom: 8, color: 'var(--accent)' }}>
                    {n}
                  </Eyebrow>
                  <Body as="h3" level={1} weight="semibold" style={{ marginBottom: 8 }}>
                    {title}
                  </Body>
                  <Body level={3} tone="muted">
                    {body}
                  </Body>
                </Card>
              ))}
            </Grid>
          </Section>

          {/* Install --------------------------------------------------- */}
          <Section id="install" eyebrow="Getting started" title="Install & use">
            <Grid min={300} gap={20} style={{ alignItems: 'start' }}>
              <div>
                <Body level={2} tone="muted" style={{ marginBottom: 14 }}>
                  Add the package, then import components directly — styles inject on import, so
                  there is no separate CSS entry to wire up.
                </Body>
                <Pre>npm install @ioanatu/offset</Pre>
                <div style={{ marginTop: 14 }}>
                  <Pre>{`import { Button, ThemeProvider } from '@ioanatu/offset';

export function Toolbar() {
  return (
    <Button variant="primary" onClick={createProject}>
      Add new project
    </Button>
  );
}`}</Pre>
                </div>
              </div>
              <Card>
                <CardTitle style={{ marginBottom: 14 }}>Adoption checklist</CardTitle>
                <div style={{ display: 'grid', gap: 11 }}>
                  {[
                    <>
                      Wrap the app in <Code>ThemeProvider</Code> to own the root{' '}
                      <Code>data-theme</Code>.
                    </>,
                    <>Load the two font families once, in the document head.</>,
                    <>Replace local buttons and inputs first — highest density, lowest risk.</>,
                    <>Delete app-level hex values; point them at semantic tokens instead.</>,
                    <>
                      Add the ESLint rule <Code>offset/no-raw-color</Code> to keep it that way.
                    </>,
                  ].map((line, i) => (
                    <Body key={i} level={3} tone="muted">
                      <Body as="span" level={3} weight="bold" tone="success">
                        {i + 1}.
                      </Body>{' '}
                      {line}
                    </Body>
                  ))}
                </div>
              </Card>
            </Grid>
          </Section>

          {/* Foundations ----------------------------------------------- */}
          <Section
            id="foundations"
            eyebrow="Foundations"
            title="Two tiers, one source of truth"
            lead={
              <>
                v1 exposed raw values directly to components, which meant a theme change had to
                touch every file that used them. v2 splits the token layer in two:{' '}
                <strong style={{ color: 'var(--ink)' }}>primitives</strong> are the palette and
                scales, named after what they are;{' '}
                <strong style={{ color: 'var(--ink)' }}>semantic aliases</strong> are named after
                what they do, and are the only tier a component may reference.
              </>
            }
            last
          >
            <Grid min={260}>
              <Card pad={20}>
                <Eyebrow style={{ marginBottom: 6 }}>Tier 1</Eyebrow>
                <CardTitle style={{ marginBottom: 8 }}>Primitives</CardTitle>
                <Body level={3} tone="muted" style={{ marginBottom: 10 }}>
                  Descriptive, theme-independent, never used in a component.
                </Body>
                <Pre dark={false}>{`--blue-500: #3367F6
--neutral-800: #1A1A1A
--size-4: 16px`}</Pre>
              </Card>
              <Card pad={20}>
                <Eyebrow style={{ marginBottom: 6 }}>Tier 2</Eyebrow>
                <CardTitle style={{ marginBottom: 8 }}>Semantic aliases</CardTitle>
                <Body level={3} tone="muted" style={{ marginBottom: 10 }}>
                  Functional, theme-dependent, the public contract.
                </Body>
                <Pre dark={false}>{`--accent: var(--blue-500)
--ink: var(--neutral-800)
--space-4: var(--size-4)`}</Pre>
              </Card>
              <Card pad={20}>
                <Eyebrow style={{ marginBottom: 6 }}>Rule</Eyebrow>
                <CardTitle style={{ marginBottom: 8 }}>One direction only</CardTitle>
                <Body level={3} tone="muted">
                  Components → semantic → primitive. A component that reads <Code>--blue-500</Code>{' '}
                  is a bug, because it will not follow a theme, a brand override, or a density
                  change.
                </Body>
              </Card>
            </Grid>
          </Section>

          {/* Color ----------------------------------------------------- */}
          <SubSection
            id="color"
            title="Color"
            lead="Each hue is a full ramp so states have somewhere to go. v1 had a single stop per hue, which forced hover and wash treatments to be invented per component."
          >
            <Eyebrow style={{ marginBottom: 10 }}>Neutral ramp</Eyebrow>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(104px,1fr))',
                gap: 10,
                marginBottom: 26,
              }}
            >
              {[
                ['0', '#FFFFFF'],
                ['50', '#F7F5F5'],
                ['100', '#EDEBEA'],
                ['200', '#DCD9D7'],
                ['400', '#8A8683'],
                ['500', '#605C59'],
                ['800', '#1A1A1A'],
                ['900', '#0C0C0E'],
              ].map(([stop, hex]) => (
                <div
                  key={stop}
                  style={{
                    border: 'var(--bw) solid var(--ink)',
                    borderRadius: 'var(--r-sm)',
                    overflow: 'hidden',
                    background: 'var(--surface)',
                  }}
                >
                  <div style={{ height: 46, background: hex }} />
                  <div style={{ padding: '7px 9px', borderTop: 'var(--bw) solid var(--ink)' }}>
                    <Body level={3} mono>
                      {stop}
                    </Body>
                    <Caption level={2} tone="subtle">
                      {hex}
                    </Caption>
                  </div>
                </div>
              ))}
            </div>

            <Eyebrow style={{ marginBottom: 10 }}>Hues — wash / base / strong</Eyebrow>
            <Grid min={230} gap={14} style={{ marginBottom: 26 }}>
              {[
                [
                  'Accent · blue',
                  ['#EDF2FE', '#3367F6', '#1A3FA8'],
                  'Primary action, selection, focus',
                  false,
                ],
                [
                  'Success · green',
                  ['#E8F8F1', '#1FA971', '#158257'],
                  'Confirmation, passing state',
                  false,
                ],
                [
                  'Warning · amber',
                  ['#FEF5E7', '#E8960C', '#B87508'],
                  'Caution, degraded, needs review',
                  true,
                ],
                [
                  'Danger · red',
                  ['#FEEDEC', '#D63F38', '#D22C23'],
                  'Destructive, error, invalid',
                  false,
                ],
              ].map(([name, stops, use, isNew]) => (
                <div
                  key={name as string}
                  style={{
                    border: 'var(--bw) solid var(--ink)',
                    borderRadius: 'var(--r-md)',
                    overflow: 'hidden',
                    boxShadow: '4px 4px 0 var(--accent)',
                  }}
                >
                  <div
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', height: 64 }}
                  >
                    {(stops as string[]).map((s) => (
                      <div key={s} style={{ background: s }} />
                    ))}
                  </div>
                  <div
                    style={{
                      padding: '12px 14px',
                      borderTop: 'var(--bw) solid var(--ink)',
                      background: 'var(--surface)',
                    }}
                  >
                    <Body level={3} weight="semibold">
                      {name as string}
                      {isNew ? (
                        <span style={{ marginLeft: 6, verticalAlign: 'middle' }}>
                          <Tag>NEW</Tag>
                        </span>
                      ) : null}
                    </Body>
                    <Caption level={2} tone="subtle" style={{ marginTop: 3 }}>
                      {use as string}
                    </Caption>
                  </div>
                </div>
              ))}
            </Grid>

            <Eyebrow style={{ marginBottom: 10 }}>
              Semantic aliases — live, they re-theme with the header switch
            </Eyebrow>
            <div
              style={{
                border: 'var(--bw) solid var(--ink)',
                borderRadius: 'var(--r-md)',
                overflow: 'hidden',
                boxShadow: '4px 4px 0 var(--accent)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(160px,1.1fr) minmax(90px,.6fr) minmax(200px,1.6fr)',
                  background: 'var(--ink)',
                  color: 'var(--surface)',
                }}
              >
                {['Token', 'Swatch', 'Use it for'].map((h) => (
                  <HeaderCell key={h} style={{ padding: '12px 16px' }}>
                    {h}
                  </HeaderCell>
                ))}
              </div>
              {SEMANTIC_ROWS.map(([token, swatch, use], i) => (
                <div
                  key={token}
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'minmax(160px,1.1fr) minmax(90px,.6fr) minmax(200px,1.6fr)',
                    borderTop:
                      i === 0 ? 'var(--bw) solid var(--ink)' : '1px solid var(--border-subtle)',
                    background: 'var(--surface)',
                  }}
                >
                  <Body level={3} mono style={{ padding: '11px 16px' }}>
                    {token}
                  </Body>
                  <div style={{ padding: '11px 16px' }}>
                    <span
                      style={{
                        display: 'block',
                        width: '100%',
                        height: 20,
                        border: 'var(--bw) solid var(--ink)',
                        borderRadius: 4,
                        background: swatch,
                      }}
                    />
                  </div>
                  <Body level={3} tone="muted" style={{ padding: '11px 16px' }}>
                    {use}
                  </Body>
                </div>
              ))}
            </div>
            <Body level={3} tone="muted" style={{ marginTop: 14 }}>
              Because <Code>--ink</Code> draws both text and borders, the brutalist outline is
              guaranteed to keep contrast in any theme — a border can never fade below the
              legibility of the text beside it.
            </Body>
          </SubSection>

          {/* Typography ------------------------------------------------ */}
          <SubSection
            id="type"
            title="Typography"
            lead={
              <>
                Two families with strictly separated jobs.{' '}
                <strong style={{ color: 'var(--ink)' }}>Hanken Grotesk</strong> carries all human
                language. <strong style={{ color: 'var(--ink)' }}>JetBrains Mono</strong> carries
                anything a machine produced or a machine will read: code, tokens, keys, IDs, eyebrow
                labels.
              </>
            }
          >
            <div
              style={{
                border: 'var(--bw) solid var(--ink)',
                borderRadius: 'var(--r-md)',
                background: 'var(--surface)',
                boxShadow: '4px 4px 0 var(--accent)',
                overflow: 'hidden',
              }}
            >
              {TYPE_SCALE.map((row, i) => (
                <div
                  key={row.token}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0,1fr) minmax(190px,240px)',
                    borderBottom:
                      i === TYPE_SCALE.length - 1 ? undefined : '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ padding: '16px 22px', minWidth: 0 }}>{row.sample}</div>
                  <div
                    style={{
                      padding: '16px 22px',
                      borderLeft: '1px solid var(--border-subtle)',
                    }}
                  >
                    <Body level={3} mono>
                      {row.token}
                    </Body>
                    <Body level={3} mono tone="muted">
                      {row.spec}
                    </Body>
                    <Body level={3} mono tone="muted">
                      {row.use}
                    </Body>
                  </div>
                </div>
              ))}
            </div>
          </SubSection>

          {/* Space / shape / elevation --------------------------------- */}
          <SubSection
            id="shape"
            title="Space, shape & elevation"
            lead="A 4px base grid, four radii, and three offset distances. The refinement in v2 is the shadow rule: in v1 a card cast an accent shadow while a primary button cast an ink shadow, with nothing written down."
          >
            <Grid min={280}>
              <Card>
                <CardTitle style={{ marginBottom: 14 }}>Spacing — 4px base</CardTitle>
                <div style={{ display: 'grid', gap: 8 }}>
                  {[
                    ['--space-1', 4, 'icon gap'],
                    ['--space-2', 8, 'label to field'],
                    ['--space-3', 12, 'inline group'],
                    ['--space-4', 16, 'card padding'],
                    ['--space-6', 24, 'block gap'],
                    ['--space-8', 32, 'card to card'],
                    ['--space-12', 48, 'section'],
                  ].map(([token, px, use]) => (
                    <div
                      key={token as string}
                      style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                    >
                      <Body
                        as="span"
                        level={3}
                        mono
                        tone="muted"
                        style={{ width: 92, flex: 'none' }}
                      >
                        {token}
                      </Body>
                      <span
                        style={{
                          height: 12,
                          width: px as number,
                          background: 'var(--accent)',
                          border: '1px solid var(--ink)',
                        }}
                      />
                      <Caption as="span" level={2} tone="subtle">
                        {px} · {use}
                      </Caption>
                    </div>
                  ))}
                </div>
                <Body level={3} tone="muted" style={{ marginTop: 14 }}>
                  Steps 5, 7, 9, 10, 11 exist but are reserved — if a layout needs one, it usually
                  needs a different component.
                </Body>
              </Card>

              <Card>
                <CardTitle style={{ marginBottom: 14 }}>Radius &amp; border</CardTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
                  {[
                    ['sm · 8', 8],
                    ['md · 12', 12],
                    ['lg · 20', 20],
                    ['full', 999],
                  ].map(([label, r]) => (
                    <div key={label as string} style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          width: 60,
                          height: 44,
                          border: 'var(--bw) solid var(--ink)',
                          borderRadius: r as number,
                          background: 'var(--sunken)',
                        }}
                      />
                      <Caption level={2} style={{ marginTop: 6 }}>
                        {label}
                      </Caption>
                    </div>
                  ))}
                </div>
                <Body level={3} tone="muted" style={{ marginBottom: 8 }}>
                  <strong style={{ color: 'var(--ink)' }}>2px</strong> is the only structural border
                  weight. <strong style={{ color: 'var(--ink)' }}>3px</strong> is reserved for focus
                  rings and the selected edge of a tab, so emphasis never competes with structure.
                </Body>
                <Body level={3} tone="muted">
                  Nested corners subtract: a 12px card containing a field uses 8px, never 12px
                  again.
                </Body>
              </Card>

              <Card>
                <CardTitle style={{ marginBottom: 6 }}>Elevation — the offset rule</CardTitle>
                <Body level={3} tone="muted" style={{ marginBottom: 16 }}>
                  Offset always travels down-right at 45°, never blurs, never uses alpha.
                </Body>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
                  {[
                    ['sm · 2px', 2],
                    ['md · 4px', 4],
                    ['lg · 8px', 8],
                  ].map(([label, d]) => (
                    <div key={label as string} style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          width: 62,
                          height: 40,
                          border: 'var(--bw) solid var(--ink)',
                          borderRadius: 'var(--r-sm)',
                          background: 'var(--surface)',
                          boxShadow: `${d}px ${d}px 0 var(--accent)`,
                        }}
                      />
                      <Caption level={2} style={{ marginTop: 8 }}>
                        {label}
                      </Caption>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: 14,
                    display: 'grid',
                    gap: 7,
                  }}
                >
                  <Body level={3} tone="muted">
                    <strong style={{ color: 'var(--ink)' }}>Neutral surface</strong> → accent
                    shadow.
                  </Body>
                  <Body level={3} tone="muted">
                    <strong style={{ color: 'var(--ink)' }}>Accent or tonal fill</strong> → ink
                    shadow.
                  </Body>
                  <Body level={3} tone="muted">
                    <strong style={{ color: 'var(--ink)' }}>Overlay</strong> → lg, plus a page
                    scrim.
                  </Body>
                  <Body level={3} tone="muted">
                    <strong style={{ color: 'var(--ink)' }}>Pressed</strong> → shadow collapses to 0
                    and the element translates by the same distance.
                  </Body>
                </div>
              </Card>
            </Grid>
          </SubSection>

          {/* Motion ---------------------------------------------------- */}
          <SubSection
            id="motion"
            title="Motion"
            badge="NEW"
            lead="v1 had a press interaction but no motion tokens, so every component timed its own transition. Three durations and one easing curve now cover the entire library."
          >
            <Grid min={260}>
              <Card>
                <CardTitle style={{ marginBottom: 12 }}>Tokens</CardTitle>
                <Pre dark={false}>{`--dur-instant: 80ms   /* press   */
--dur-fast:   140ms   /* hover   */
--dur-slow:   240ms   /* overlay */
--ease: cubic-bezier(.2,.8,.2,1)`}</Pre>
                <Body level={3} tone="muted" style={{ marginTop: 12 }}>
                  Nothing in the library animates longer than 240ms, and nothing animates on load.
                </Body>
              </Card>
              <Card>
                <CardTitle style={{ marginBottom: 6 }}>The press, specified</CardTitle>
                <Body level={3} tone="muted" style={{ marginBottom: 16 }}>
                  Try it — the button moves exactly the offset distance, so it lands flush on the
                  surface.
                </Body>
                <Button variant="primary">Press me</Button>
                <div style={{ marginTop: 16 }}>
                  <Pre dark={false}>{`:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 var(--ink);
}`}</Pre>
                </div>
              </Card>
              <Card>
                <CardTitle style={{ marginBottom: 12 }}>Rules</CardTitle>
                <div style={{ display: 'grid', gap: 9 }}>
                  <Body level={3} tone="muted">
                    Animate{' '}
                    <strong style={{ color: 'var(--ink)' }}>transform, opacity, box-shadow</strong>{' '}
                    only.
                  </Body>
                  <Body level={3} tone="muted">
                    Overlays enter by translating up 12px; they never scale or fade in from zero.
                  </Body>
                  <Body level={3} tone="muted">
                    Loading uses a single continuous spinner, not a staged sequence.
                  </Body>
                  <Body level={3} tone="muted">
                    <Code>prefers-reduced-motion</Code> reduces every duration to zero — states
                    still change, they just arrive instantly.
                  </Body>
                </div>
              </Card>
            </Grid>
          </SubSection>

          {/* Theming --------------------------------------------------- */}
          <SubSection
            id="theming"
            title="Theming"
            lead="Because components only reference semantic tokens, a theme is a set of variable values under a scope. Brand overrides work the same way — scope, don't fork."
          >
            <Grid min={300} gap={20}>
              <Pre>{`[data-theme="dark"] {
  --page:      #121214;
  --surface:   #1D1D21;
  --ink:       #F2F2F0;  /* text + borders */
  --accent:    #5B82FF;  /* brightened     */
  --on-accent: #101014;  /* keeps AA       */
}

/* A brand override is the same move */
[data-brand="atlas"] {
  --accent: #7A3BF6;
}`}</Pre>
              <Card>
                <CardTitle style={{ marginBottom: 12 }}>What v2 fixes</CardTitle>
                <div style={{ display: 'grid', gap: 11 }}>
                  <Body level={3} tone="muted">
                    <strong style={{ color: 'var(--ink)' }}>
                      Accent is no longer assumed dark.
                    </strong>{' '}
                    <Code>--on-accent</Code> is a real token in both themes, so a lighter brand
                    accent stays legible instead of silently failing contrast.
                  </Body>
                  <Body level={3} tone="muted">
                    <strong style={{ color: 'var(--ink)' }}>Washes are tokenised.</strong> Tonal
                    backgrounds for alerts and badges were hand-mixed per component in v1; each hue
                    now ships a wash stop that is dark-mode aware.
                  </Body>
                  <Body level={3} tone="muted">
                    <strong style={{ color: 'var(--ink)' }}>The scrim is a token.</strong>{' '}
                    <Code>--scrim</Code> is 60% ink, defined once, used by modal, drawer, and
                    popover alike.
                  </Body>
                  <Body level={3} tone="muted">
                    <strong style={{ color: 'var(--ink)' }}>Density is themeable.</strong>{' '}
                    <Code>[data-density="compact"]</Code> tightens control heights and section
                    rhythm without touching a component.
                  </Body>
                </div>
              </Card>
            </Grid>
          </SubSection>

          {/* Components ------------------------------------------------ */}
          <Section
            id="components"
            eyebrow="Components"
            title="Coverage"
            lead="v1 shipped nine components — a strong core with no way to build a real screen: no way to confirm an action, report an error, page through data, or say that something is loading. The matrix below is deliberately public about status, because a design system that hides its gaps gets worked around instead of extended."
            last
          >
            <div
              style={{
                border: 'var(--bw) solid var(--ink)',
                borderRadius: 'var(--r-md)',
                overflow: 'hidden',
                boxShadow: '4px 4px 0 var(--accent)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(120px,.9fr) minmax(0,2.6fr) minmax(96px,.6fr)',
                  background: 'var(--ink)',
                  color: 'var(--surface)',
                }}
              >
                {['Group', 'Components', 'Status'].map((h) => (
                  <HeaderCell key={h} style={{ padding: '12px 16px' }}>
                    {h}
                  </HeaderCell>
                ))}
              </div>
              {COVERAGE.map(([group, list, status], i) => (
                <div
                  key={group}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(120px,.9fr) minmax(0,2.6fr) minmax(96px,.6fr)',
                    borderTop:
                      i === 0 ? 'var(--bw) solid var(--ink)' : '1px solid var(--border-subtle)',
                    background: 'var(--surface)',
                  }}
                >
                  <Body level={3} weight="semibold" style={{ padding: '12px 16px' }}>
                    {group}
                  </Body>
                  <Body level={3} tone="muted" style={{ padding: '12px 16px' }}>
                    {list}
                  </Body>
                  <div style={{ padding: '12px 16px' }}>
                    <Tag
                      tone={
                        status === 'STABLE' ? 'success' : status === 'PLANNED' ? 'muted' : 'accent'
                      }
                    >
                      {status}
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Button ---------------------------------------------------- */}
          <SubSection
            id="button"
            title="Button"
            lead="The component the system was extrapolated from, now specified rather than merely shown: an anatomy, a complete state matrix, and a documented API."
          >
            <Card pad={26} style={{ marginBottom: 18 }}>
              <Eyebrow style={{ marginBottom: 18 }}>Variants — one primary per view</Eyebrow>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 14,
                  alignItems: 'center',
                  marginBottom: 24,
                }}
              >
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button disabled>Disabled</Button>
                <Button variant="primary" loading>
                  Saving
                </Button>
              </div>
              <Eyebrow style={{ marginBottom: 14 }}>
                Sizes — every size clears a 44px touch target with its 8px gap
              </Eyebrow>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <button
                  type="button"
                  aria-label="Add"
                  className="off-press"
                  style={{
                    width: 44,
                    height: 44,
                    flex: 'none',
                    border: 'var(--bw) solid var(--ink)',
                    borderRadius: 'var(--r-md)',
                    background: 'var(--surface)',
                    boxShadow: '4px 4px 0 var(--accent)',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 20,
                    fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'],
                    cursor: 'pointer',
                    color: 'var(--ink)',
                  }}
                >
                  +
                </button>
              </div>
            </Card>

            <Grid min={300}>
              <SpecTable
                title="State matrix"
                rows={[
                  ['rest', 'offset md, full border'],
                  ['hover', 'translate 1px, offset 3px'],
                  ['active', 'translate 4px, offset 0'],
                  ['focus', '3px accent ring, 2px offset'],
                  ['disabled', 'no shadow, subtle border, no pointer'],
                  [
                    'loading',
                    <>
                      spinner replaces icon, width held, <Code>aria-busy</Code>
                    </>,
                  ],
                ]}
              />
              <SpecTable
                title="Props"
                rows={[
                  [
                    'variant',
                    <Body as="span" level={3} mono tone="inherit">
                      'primary' | 'secondary' | 'ghost' | 'destructive'
                    </Body>,
                  ],
                  [
                    'size',
                    <Body as="span" level={3} mono tone="inherit">
                      'sm' | 'md' | 'lg'
                    </Body>,
                  ],
                  [
                    'loading',
                    <Body as="span" level={3} mono tone="inherit">
                      boolean
                    </Body>,
                  ],
                  [
                    'iconStart',
                    <Body as="span" level={3} mono tone="inherit">
                      ReactNode
                    </Body>,
                  ],
                  [
                    'fullWidth',
                    <Body as="span" level={3} mono tone="inherit">
                      boolean
                    </Body>,
                  ],
                  [
                    '...rest',
                    <Body as="span" level={3} mono tone="inherit">
                      ButtonHTMLAttributes
                    </Body>,
                  ],
                ]}
              />
            </Grid>
            <Body level={3} tone="muted" style={{ marginTop: 14 }}>
              There is no <Code>color</Code> prop, and there never will be. Intent selects the
              variant; the variant selects the color. That is the difference between a system and a
              set of styles.
            </Body>
          </SubSection>

          {/* Forms ----------------------------------------------------- */}
          <SubSection
            id="forms"
            title="Forms"
            lead={
              <>
                v1 shipped the controls; v2 adds the <Code>Field</Code> wrapper that owns label
                association, helper text, required marking, and error announcement — so no product
                has to reassemble that correctly again.
              </>
            }
          >
            <Grid min={290}>
              <Card pad={24} style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
                <Field
                  label="Project name"
                  htmlFor="demo-name"
                  required
                  helper="Shown to everyone in the workspace."
                >
                  <input
                    id="demo-name"
                    className="off-input"
                    type="text"
                    placeholder="Atlas migration"
                    style={inputStyle()}
                  />
                </Field>
                <Field
                  label="Workspace URL"
                  htmlFor="demo-err"
                  error={
                    <>
                      Spaces aren't allowed — try <strong>atlas-migration</strong>.
                    </>
                  }
                >
                  <input
                    id="demo-err"
                    type="text"
                    defaultValue="atlas migration"
                    aria-invalid
                    aria-describedby="demo-err-msg"
                    style={inputStyle('error')}
                  />
                </Field>
                <Field label="Notes" htmlFor="demo-note">
                  <textarea
                    id="demo-note"
                    className="off-input"
                    rows={3}
                    placeholder="Anything the team should know"
                    style={{ ...inputStyle(), resize: 'vertical' }}
                  />
                </Field>
                <Field
                  label="Billing owner"
                  htmlFor="demo-dis"
                  disabled
                  helper="Managed by your admin."
                >
                  <input
                    id="demo-dis"
                    type="text"
                    defaultValue="finance@atlas.co"
                    disabled
                    style={inputStyle('disabled')}
                  />
                </Field>
              </Card>

              <Card pad={24} style={{ display: 'grid', gap: 22, alignContent: 'start' }}>
                <div>
                  <Body level={3} weight="semibold" style={{ marginBottom: 8 }}>
                    Select — listbox pattern
                  </Body>
                  <div style={{ position: 'relative' }}>
                    <button
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={selOpen}
                      onClick={() => setSelOpen((o) => !o)}
                      style={{
                        ...inputStyle(),
                        boxShadow: '2px 2px 0 var(--accent)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <span>{sel}</span>
                      <span aria-hidden="true" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                        ▼
                      </span>
                    </button>
                    {selOpen ? (
                      <ul
                        role="listbox"
                        style={{
                          position: 'absolute',
                          zIndex: 20,
                          top: 'calc(100% + 8px)',
                          left: 0,
                          right: 0,
                          margin: 0,
                          padding: 5,
                          listStyle: 'none',
                          border: 'var(--bw) solid var(--ink)',
                          borderRadius: 'var(--r-sm)',
                          background: 'var(--surface)',
                          boxShadow: '8px 8px 0 var(--accent)',
                        }}
                      >
                        {['Small', 'Medium', 'Large'].map((o) => (
                          <Body
                            key={o}
                            as="li"
                            level={3}
                            role="option"
                            aria-selected={o === sel}
                            onClick={() => {
                              setSel(o);
                              setSelOpen(false);
                            }}
                            style={{
                              padding: '9px 12px',
                              borderRadius: 6,
                              cursor: 'pointer',
                              background: o === sel ? 'var(--accent-wash)' : 'transparent',
                            }}
                          >
                            {o}
                          </Body>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>

                <div>
                  <Body level={3} weight="semibold" style={{ marginBottom: 10 }}>
                    Checkbox &amp; radio
                  </Body>
                  <div style={{ display: 'grid', gap: 11 }}>
                    <Body
                      as="label"
                      level={3}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 11,
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          flex: 'none',
                          border: 'var(--bw) solid var(--ink)',
                          borderRadius: 6,
                          background: 'var(--accent)',
                          display: 'grid',
                          placeItems: 'center',
                          color: 'var(--on-accent)',
                          fontSize: 13,
                          fontWeight: 'var(--fw-bold)' as CSSProperties['fontWeight'],
                        }}
                      >
                        ✓
                      </span>
                      Notify the team
                    </Body>
                    <Body
                      as="label"
                      level={3}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 11,
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          flex: 'none',
                          border: 'var(--bw) solid var(--ink)',
                          borderRadius: 6,
                          background: 'var(--surface)',
                        }}
                      />
                      Archive when finished
                    </Body>
                    <Body
                      as="label"
                      level={3}
                      tone="subtle"
                      style={{ display: 'flex', alignItems: 'center', gap: 11 }}
                    >
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          flex: 'none',
                          border: 'var(--bw) solid var(--ink-subtle)',
                          borderRadius: 6,
                          background: 'var(--sunken)',
                        }}
                      />
                      Require approval{' '}
                      <Body as="span" level={3} mono tone="inherit">
                        (pro)
                      </Body>
                    </Body>
                    <div style={{ display: 'flex', gap: 20, marginTop: 2 }}>
                      <Body
                        as="label"
                        level={3}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 9,
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            flex: 'none',
                            border: 'var(--bw) solid var(--ink)',
                            borderRadius: '50%',
                            background: 'var(--surface)',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              background: 'var(--accent)',
                            }}
                          />
                        </span>
                        Private
                      </Body>
                      <Body
                        as="label"
                        level={3}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 9,
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            flex: 'none',
                            border: 'var(--bw) solid var(--ink)',
                            borderRadius: '50%',
                            background: 'var(--surface)',
                          }}
                        />
                        Public
                      </Body>
                    </div>
                  </div>
                </div>

                <div>
                  <Body level={3} weight="semibold" style={{ marginBottom: 10 }}>
                    Slider{' '}
                    <span style={{ marginLeft: 4, verticalAlign: 'middle' }}>
                      <Tag>NEW</Tag>
                    </span>
                  </Body>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={slider}
                      onChange={(e) => setSlider(Number(e.target.value))}
                      aria-label="Storage limit"
                      style={{ flex: 1, minWidth: 0, accentColor: 'var(--accent)', height: 22 }}
                    />
                    <Body
                      as="span"
                      level={3}
                      mono
                      style={{
                        padding: '4px 10px',
                        border: 'var(--bw) solid var(--ink)',
                        borderRadius: 'var(--r-full)',
                        minWidth: 56,
                        textAlign: 'center',
                      }}
                    >
                      {slider}%
                    </Body>
                  </div>
                </div>

                <div>
                  <Body level={3} weight="semibold" style={{ marginBottom: 10 }}>
                    Toggle — <Code>role=switch</Code>
                  </Body>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <ThemeToggle />
                    <Body as="span" level={3} tone="muted">
                      Dark mode — {theme === 'dark' ? 'on' : 'off'}
                    </Body>
                  </div>
                </div>
              </Card>
            </Grid>
          </SubSection>

          {/* Feedback -------------------------------------------------- */}
          <SubSection
            id="feedback"
            title="Feedback"
            badge="NEW GROUP"
            lead="The largest gap in v1: nothing to report status, progress, error, or emptiness. Every tone below pairs its color with an icon and a word, so meaning survives grayscale and color blindness."
          >
            <div style={{ display: 'grid', gap: 16 }}>
              <Card pad={24}>
                <Eyebrow style={{ marginBottom: 16 }}>Badge — status, not decoration</Eyebrow>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 11 }}>
                  <Badge tone="info">● In review</Badge>
                  <Badge tone="success">✓ Deployed</Badge>
                  <Badge tone="warning">⚠ Degraded</Badge>
                  <Badge tone="danger">✕ Failed</Badge>
                  <Badge>○ Draft</Badge>
                  <Badge solid>12 new</Badge>
                </div>
              </Card>

              <div style={{ display: 'grid', gap: 12 }}>
                <Alert tone="info" title="Scheduled maintenance on Sunday">
                  Deploys will be paused between 02:00 and 04:00 UTC.
                </Alert>
                <Alert
                  tone="danger"
                  title="Error — we couldn't publish this project"
                  action={<Button size="sm">Review</Button>}
                >
                  Two required fields are empty. Fix them and publish again.
                </Alert>
                <Alert tone="warning" title="Warning — you're near your storage limit">
                  82% used. Uploads stop working at 100%.
                </Alert>
                <Alert tone="success" title="Success — project published">
                  Live at atlas.co/migration since 14:02.
                </Alert>
              </div>

              <Grid min={260}>
                <Card>
                  <Eyebrow style={{ marginBottom: 14 }}>Progress</Eyebrow>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <Body as="span" level={3} tone="muted">
                      Migrating records
                    </Body>
                    <Body as="span" level={3} mono>
                      {slider}%
                    </Body>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={slider}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    style={{
                      height: 20,
                      border: 'var(--bw) solid var(--ink)',
                      borderRadius: 'var(--r-full)',
                      background: 'var(--sunken)',
                      overflow: 'hidden',
                      padding: 2,
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        height: '100%',
                        width: `${slider}%`,
                        borderRadius: 'var(--r-full)',
                        background: 'var(--accent)',
                        transition: 'width var(--dur-fast) var(--ease)',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                    <Spinner />
                    <Body as="span" level={3} tone="muted">
                      Spinner — indeterminate only
                    </Body>
                  </div>
                </Card>

                <Card>
                  <Eyebrow style={{ marginBottom: 14 }}>Skeleton</Eyebrow>
                  <div style={{ display: 'grid', gap: 10 }}>
                    <Skeleton w="70%" />
                    <Skeleton />
                    <Skeleton w="88%" />
                    <Skeleton h={70} />
                  </div>
                  <Body level={3} tone="muted" style={{ marginTop: 14 }}>
                    Mirrors the real layout's shape. Screen readers get a polite{' '}
                    <Code>Loading…</Code> instead.
                  </Body>
                </Card>

                <Card
                  style={{ textAlign: 'center', display: 'grid', placeContent: 'center', gap: 10 }}
                >
                  <Eyebrow>Empty state</Eyebrow>
                  <span
                    style={{
                      width: 52,
                      height: 52,
                      margin: '6px auto 0',
                      border: 'var(--bw) dashed var(--ink)',
                      borderRadius: 'var(--r-md)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 22,
                      color: 'var(--ink-subtle)',
                    }}
                  >
                    +
                  </span>
                  <Body level={2} weight="semibold" style={{ marginTop: 6 }}>
                    No projects yet
                  </Body>
                  <Body level={3} tone="muted">
                    Create one to start tracking a migration.
                  </Body>
                  <div style={{ justifySelf: 'center', marginTop: 6 }}>
                    <Button variant="primary" size="sm" onClick={openModal}>
                      New project
                    </Button>
                  </div>
                </Card>
              </Grid>
            </div>
          </SubSection>

          {/* Overlays -------------------------------------------------- */}
          <SubSection
            id="overlays"
            title="Overlays"
            badge="NEW GROUP"
            lead={
              <>
                All four overlays share one focus contract: focus moves in on open, is trapped while
                open, returns to the trigger on close, and <Code>Escape</Code> always closes.
                Destructive confirmations are the one exception to the offset rule: they cast an ink
                shadow so they read as heavier than the page.
              </>
            }
          >
            <Grid min={280}>
              <Card style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
                <Eyebrow>Modal &amp; toast — live</Eyebrow>
                <Body level={3} tone="muted">
                  Open the dialog to see the scrim, the returned focus, and the lg offset. The toast
                  is polite and auto-dismisses.
                </Body>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <Button variant="primary" size="sm" onClick={openModal}>
                    Open dialog
                  </Button>
                  <Button size="sm" onClick={fireToast}>
                    Fire toast
                  </Button>
                </div>
              </Card>

              <Card style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
                <Eyebrow>Tooltip — live</Eyebrow>
                <Body level={3} tone="muted">
                  Hover or focus the trigger. A tooltip may only ever label — never hold an action
                  or the only copy of information.
                </Body>
                <div style={{ position: 'relative', justifySelf: 'start' }}>
                  <button
                    type="button"
                    aria-describedby="off-tip"
                    onMouseEnter={() => setTip(true)}
                    onMouseLeave={() => setTip(false)}
                    onFocus={() => setTip(true)}
                    onBlur={() => setTip(false)}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--fs-sm)',
                      fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'],
                      padding: '10px 20px',
                      border: 'var(--bw) solid var(--ink)',
                      borderRadius: 'var(--r-md)',
                      background: 'var(--surface)',
                      color: 'var(--ink)',
                      boxShadow: '2px 2px 0 var(--accent)',
                      cursor: 'help',
                    }}
                  >
                    What is drift?
                  </button>
                  {tip ? (
                    <Body
                      as="span"
                      id="off-tip"
                      role="tooltip"
                      level={3}
                      tone="inherit"
                      style={{
                        position: 'absolute',
                        bottom: 'calc(100% + 12px)',
                        left: 0,
                        zIndex: 20,
                        width: 230,
                        padding: '11px 14px',
                        border: 'var(--bw) solid var(--ink)',
                        borderRadius: 'var(--r-sm)',
                        background: 'var(--ink)',
                        color: 'var(--page)',
                        boxShadow: '4px 4px 0 var(--accent)',
                        animation: 'off-rise var(--dur-fast) var(--ease)',
                      }}
                    >
                      Drift is the gap between the schema on record and the schema actually
                      deployed.
                    </Body>
                  ) : null}
                </div>
              </Card>

              <Card>
                <Eyebrow style={{ marginBottom: 14 }}>Choosing one</Eyebrow>
                <div style={{ display: 'grid', gap: 10 }}>
                  {[
                    ['Tooltip', 'a label for something already visible.'],
                    ['Popover', 'secondary content or a small form, anchored to its trigger.'],
                    ['Modal', 'a task that must finish or be abandoned before anything else.'],
                    ['Drawer', 'a long side task where page context still matters.'],
                    [
                      'Toast',
                      'an outcome the user does not need to acknowledge. Never for errors that need a decision.',
                    ],
                  ].map(([name, body]) => (
                    <Body key={name} level={3} tone="muted">
                      <strong style={{ color: 'var(--ink)' }}>{name}</strong> — {body}
                    </Body>
                  ))}
                </div>
              </Card>
            </Grid>
          </SubSection>

          {/* Navigation ------------------------------------------------ */}
          <SubSection
            id="navigation"
            title="Navigation"
            lead="Tabs and TabMenu carry over from v1 with the roving-tabindex behaviour intact. Breadcrumb and Pagination close the gap that made it impossible to build a list-and-detail screen from the library alone."
          >
            <Card pad={24} style={{ marginBottom: 16 }}>
              <nav aria-label="Breadcrumb" style={{ marginBottom: 26 }}>
                <Body
                  as="ol"
                  level={3}
                  style={{
                    padding: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <li>
                    <a href="#navigation" style={{ color: 'var(--ink-muted)' }}>
                      Workspace
                    </a>
                  </li>
                  <li aria-hidden="true" style={{ color: 'var(--ink-subtle)' }}>
                    /
                  </li>
                  <li>
                    <a href="#navigation" style={{ color: 'var(--ink-muted)' }}>
                      Projects
                    </a>
                  </li>
                  <li aria-hidden="true" style={{ color: 'var(--ink-subtle)' }}>
                    /
                  </li>
                  <Body as="li" level={3} weight="semibold" aria-current="page">
                    Atlas migration
                  </Body>
                </Body>
              </nav>

              <Eyebrow style={{ marginBottom: 12 }}>Tabs — browser-tab silhouette</Eyebrow>
              <div
                role="tablist"
                aria-label="Project detail"
                style={{
                  display: 'flex',
                  gap: 6,
                  marginBottom: -2,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {TABS.map((t) => {
                  const on = t.id === tab;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      tabIndex={on ? 0 : -1}
                      onClick={() => setTab(t.id)}
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--fs-sm)',
                        fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'],
                        padding: '11px 22px',
                        border: 'var(--bw) solid var(--ink)',
                        borderBottom: 'none',
                        borderTop: on ? '3px solid var(--accent)' : '2px solid var(--ink)',
                        borderRadius: 'var(--r-md) var(--r-md) 0 0',
                        background: on ? 'var(--surface)' : 'var(--sunken)',
                        color: on ? 'var(--ink)' : 'var(--ink-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
              <div
                role="tabpanel"
                style={{
                  border: 'var(--bw) solid var(--ink)',
                  borderRadius: '0 var(--r-md) var(--r-md) var(--r-md)',
                  background: 'var(--surface)',
                  boxShadow: '4px 4px 0 var(--accent)',
                  padding: 22,
                }}
              >
                <Body level={2} tone="muted">
                  {activeTab.body}
                </Body>
              </div>

              <Eyebrow style={{ margin: '28px 0 12px' }}>TabMenu — segmented sibling</Eyebrow>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18 }}>
                <div
                  role="tablist"
                  aria-label="View mode"
                  style={{
                    display: 'inline-flex',
                    padding: 4,
                    gap: 4,
                    border: 'var(--bw) solid var(--ink)',
                    borderRadius: 'var(--r-full)',
                    background: 'var(--surface)',
                    boxShadow: '4px 4px 0 var(--accent)',
                  }}
                >
                  {['Grid', 'List', 'Board'].map((v) => {
                    const on = v === view;
                    return (
                      <button
                        key={v}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        onClick={() => setView(v)}
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 'var(--fs-sm)',
                          fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'],
                          padding: '8px 22px',
                          border: 'none',
                          borderRadius: 'var(--r-full)',
                          background: on ? 'var(--accent)' : 'transparent',
                          color: on ? 'var(--on-accent)' : 'var(--ink-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
                <Body as="span" level={3} tone="muted">
                  → showing <Code>{view}</Code>
                </Body>
              </div>
            </Card>

            <Grid min={280}>
              <Card>
                <Eyebrow style={{ marginBottom: 14 }}>
                  Pagination <span style={{ color: 'var(--accent)' }}>· new</span>
                </Eyebrow>
                <nav
                  aria-label="Pagination"
                  style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}
                >
                  <button
                    type="button"
                    aria-label="Previous page"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      width: 38,
                      height: 38,
                      border: 'var(--bw) solid var(--ink)',
                      borderRadius: 'var(--r-sm)',
                      background: 'var(--surface)',
                      color: 'var(--ink)',
                      cursor: 'pointer',
                    }}
                  >
                    ←
                  </button>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-current={n === page ? 'page' : undefined}
                      onClick={() => setPage(n)}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        width: 38,
                        height: 38,
                        border: 'var(--bw) solid var(--ink)',
                        borderRadius: 'var(--r-sm)',
                        background: n === page ? 'var(--accent)' : 'var(--surface)',
                        color: n === page ? 'var(--on-accent)' : 'var(--ink)',
                        cursor: 'pointer',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    aria-label="Next page"
                    onClick={() => setPage((p) => Math.min(5, p + 1))}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      width: 38,
                      height: 38,
                      border: 'var(--bw) solid var(--ink)',
                      borderRadius: 'var(--r-sm)',
                      background: 'var(--surface)',
                      color: 'var(--ink)',
                      cursor: 'pointer',
                    }}
                  >
                    →
                  </button>
                </nav>
                <Body level={3} tone="muted" style={{ marginTop: 14 }}>
                  Page {page} of 5 · 128 records
                </Body>
              </Card>

              <Card>
                <Eyebrow style={{ marginBottom: 14 }}>
                  SideNav <span style={{ color: 'var(--accent)' }}>· new</span>
                </Eyebrow>
                <nav style={{ display: 'grid', gap: 5 }}>
                  {['Overview', 'Records', 'Schema drift', 'Settings'].map((item, i) => (
                    <Body
                      key={item}
                      as="a"
                      href="#navigation"
                      level={3}
                      weight={i === 0 ? 'semibold' : 'regular'}
                      aria-current={i === 0 ? 'page' : undefined}
                      className={i === 0 ? undefined : 'off-navlink'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 14px',
                        border: `var(--bw) solid ${i === 0 ? 'var(--ink)' : 'transparent'}`,
                        borderRadius: 'var(--r-sm)',
                        background: i === 0 ? 'var(--accent)' : undefined,
                        color: i === 0 ? 'var(--on-accent)' : 'var(--ink)',
                      }}
                    >
                      {item}
                    </Body>
                  ))}
                </nav>
                <Body level={3} tone="muted" style={{ marginTop: 14 }}>
                  Current page is marked by fill <em>and</em> <Code>aria-current</Code> — never by
                  color alone.
                </Body>
              </Card>
            </Grid>
          </SubSection>

          {/* Data ------------------------------------------------------ */}
          <SubSection
            id="data"
            title="Data display"
            badge="NEW GROUP"
            lead="A brutalist table is a real risk: 2px borders on every cell becomes a cage. The resolution is that the container is bordered and the rows are divided subtly — heavy outside, quiet inside."
          >
            <div style={{ marginBottom: 16 }}>
              <DataTable<BatchRow>
                columns={[
                  { key: 'name', label: 'Batch', span: '1.4fr' },
                  { key: 'owner', label: 'Owner', span: '1fr' },
                  { key: 'count', label: 'Records', span: '.9fr' },
                  { key: 'status', label: 'Status', span: '1fr' },
                ]}
                rows={BATCHES}
                header={
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 12,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      background: 'var(--surface)',
                      borderBottom: 'var(--bw) solid var(--ink)',
                    }}
                  >
                    <Body level={2} weight="semibold">
                      Migration batches
                    </Body>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Badge>128 rows</Badge>
                      <Button size="sm">Export</Button>
                    </div>
                  </div>
                }
                cell={(row, key) => {
                  if (key === 'status') return <Badge tone={row.tone}>{row.status}</Badge>;
                  if (key === 'count')
                    return (
                      <Body as="span" level={3} mono tone="muted">
                        {row.count}
                      </Body>
                    );
                  if (key === 'owner')
                    return (
                      <Body as="span" level={3} tone="muted">
                        {row.owner}
                      </Body>
                    );
                  return (
                    <Body as="span" level={3} weight="medium">
                      {row.name}
                    </Body>
                  );
                }}
              />
            </div>

            <Grid min={250}>
              <Card>
                <Eyebrow style={{ marginBottom: 16 }}>Avatar &amp; group</Eyebrow>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  {[
                    ['IT', 44, 15, true],
                    ['MR', 36, 13, false],
                    ['KB', 28, 11, false],
                  ].map(([initials, size, fs, accent]) => (
                    <span
                      key={initials as string}
                      style={{
                        width: size as number,
                        height: size as number,
                        flex: 'none',
                        border: 'var(--bw) solid var(--ink)',
                        borderRadius: 'var(--r-full)',
                        background: accent ? 'var(--accent)' : 'var(--sunken)',
                        color: accent ? 'var(--on-accent)' : 'var(--ink)',
                        display: 'grid',
                        placeItems: 'center',
                        fontFamily: 'var(--font-sans)',
                        fontSize: fs as number,
                        fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'],
                      }}
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                {/* AvatarGroup: the -10px overlap is intentional. */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {['IT', 'MR', 'KB', '+9'].map((initials, i) => (
                    <span
                      key={initials}
                      style={{
                        width: 36,
                        height: 36,
                        marginLeft: i === 0 ? 0 : -10,
                        border: 'var(--bw) solid var(--ink)',
                        borderRadius: 'var(--r-full)',
                        background: initials === '+9' ? 'var(--ink)' : 'var(--surface)',
                        color: initials === '+9' ? 'var(--page)' : 'var(--ink)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: initials === '+9' ? 11 : 13,
                        fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'],
                        fontFamily: initials === '+9' ? 'var(--font-mono)' : 'var(--font-sans)',
                      }}
                    >
                      {initials}
                    </span>
                  ))}
                </div>
              </Card>

              <Card>
                <Eyebrow style={{ marginBottom: 16 }}>Stat</Eyebrow>
                <Headline as="p" level={1} weight="bold">
                  94.2%
                </Headline>
                <Body level={3} tone="muted" style={{ marginTop: 6 }}>
                  Records reconciled
                </Body>
                <Body level={3} weight="semibold" tone="success" style={{ marginTop: 10 }}>
                  ▲ 2.4 pts this week
                </Body>
              </Card>

              <Card>
                <Eyebrow style={{ marginBottom: 16 }}>DescriptionList</Eyebrow>
                <div style={{ display: 'grid', gap: 11 }}>
                  {[
                    ['Source', 'pg-14-prod'],
                    ['Started', '2026-09-02'],
                    ['Owner', 'ioana.t'],
                  ].map(([k, v], i, arr) => (
                    <div
                      key={k}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 14,
                        paddingBottom: i === arr.length - 1 ? 0 : 9,
                        borderBottom:
                          i === arr.length - 1 ? undefined : '1px solid var(--border-subtle)',
                      }}
                    >
                      <Body as="span" level={3} tone="muted">
                        {k}
                      </Body>
                      <Body as="span" level={3} mono>
                        {v}
                      </Body>
                    </div>
                  ))}
                </div>
              </Card>
            </Grid>
          </SubSection>

          {/* Guidelines ------------------------------------------------ */}
          <Section
            id="guidelines"
            eyebrow="Guidelines"
            title="Judgement, written down"
            lead="A component library shows what is possible. A design system says what is correct. These pairs are the decisions that came up most often in review — each one is a rule a reviewer can point at instead of relitigating."
            last
          >
            <Grid min={300}>
              <div
                style={{
                  border: 'var(--bw) solid var(--success)',
                  borderRadius: 'var(--r-md)',
                  background: 'var(--surface)',
                  boxShadow: '4px 4px 0 var(--success)',
                  padding: 22,
                }}
              >
                <Body level={3} weight="bold" tone="success" style={{ marginBottom: 16 }}>
                  ✓ DO
                </Body>
                <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                  <Button variant="primary" size="sm">
                    Publish
                  </Button>
                  <Button variant="ghost" size="sm">
                    Cancel
                  </Button>
                </div>
                <Body level={3} tone="muted">
                  One accent action per view, with the alternative as a ghost. The hierarchy is
                  doing the explaining, so the labels don't have to.
                </Body>
              </div>

              <div
                style={{
                  border: 'var(--bw) solid var(--danger)',
                  borderRadius: 'var(--r-md)',
                  background: 'var(--surface)',
                  boxShadow: '4px 4px 0 var(--danger)',
                  padding: 22,
                }}
              >
                <Body level={3} weight="bold" tone="danger" style={{ marginBottom: 16 }}>
                  ✕ DON'T
                </Body>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
                  <Button variant="primary" size="sm">
                    Publish
                  </Button>
                  <Button variant="primary" size="sm">
                    Save draft
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
                <Body level={3} tone="muted">
                  Three competing emphases and a destructive action in the same row. Nothing is
                  primary, and the riskiest option is the easiest to hit.
                </Body>
              </div>

              <div
                style={{
                  border: 'var(--bw) solid var(--success)',
                  borderRadius: 'var(--r-md)',
                  background: 'var(--surface)',
                  boxShadow: '4px 4px 0 var(--success)',
                  padding: 22,
                }}
              >
                <Body level={3} weight="bold" tone="success" style={{ marginBottom: 16 }}>
                  ✓ DO
                </Body>
                <Card pad={16} style={{ marginBottom: 18 }}>
                  <Body level={3} weight="semibold" style={{ marginBottom: 8 }}>
                    Nested surfaces
                  </Body>
                  <Body
                    as="div"
                    level={3}
                    tone="muted"
                    style={{
                      border: 'var(--bw) solid var(--ink)',
                      borderRadius: 'var(--r-sm)',
                      background: 'var(--sunken)',
                      padding: 12,
                    }}
                  >
                    Inner blocks lose the shadow and shrink the radius.
                  </Body>
                </Card>
                <Body level={3} tone="muted">
                  Only one offset shadow per stacking context. Depth is a claim about layering, not
                  a texture to repeat.
                </Body>
              </div>

              <div
                style={{
                  border: 'var(--bw) solid var(--danger)',
                  borderRadius: 'var(--r-md)',
                  background: 'var(--surface)',
                  boxShadow: '4px 4px 0 var(--danger)',
                  padding: 22,
                }}
              >
                <Body level={3} weight="bold" tone="danger" style={{ marginBottom: 16 }}>
                  ✕ DON'T
                </Body>
                <Card pad={16} style={{ marginBottom: 18 }}>
                  <Body level={3} weight="semibold" style={{ marginBottom: 8 }}>
                    Nested surfaces
                  </Body>
                  <Card pad={12}>
                    <Body level={3} tone="muted">
                      Every level shouting the same shadow at the same distance.
                    </Body>
                  </Card>
                </Card>
                <Body level={3} tone="muted">
                  Repeated identical offsets flatten the hierarchy they were meant to express, and
                  the page starts to vibrate.
                </Body>
              </div>
            </Grid>

            <Card pad={24} style={{ marginTop: 16 }}>
              <CardTitle style={{ marginBottom: 14 }}>Voice — how components speak</CardTitle>
              <Grid min={230} gap={18}>
                <Body level={3} tone="muted">
                  <strong style={{ color: 'var(--ink)' }}>Buttons are verbs.</strong> “Publish”, not
                  “OK”. The label states what happens when you press it.
                </Body>
                <Body level={3} tone="muted">
                  <strong style={{ color: 'var(--ink)' }}>Errors say what to do.</strong> Name the
                  field, name the fix. Never “invalid input”.
                </Body>
                <Body level={3} tone="muted">
                  <strong style={{ color: 'var(--ink)' }}>
                    Empty states offer the next action.
                  </strong>{' '}
                  An empty screen without a button is a dead end.
                </Body>
                <Body level={3} tone="muted">
                  <strong style={{ color: 'var(--ink)' }}>Sentence case everywhere</strong> except
                  mono eyebrows, which are uppercase by role.
                </Body>
              </Grid>
            </Card>
          </Section>

          {/* Accessibility --------------------------------------------- */}
          <SubSection
            id="a11y"
            title="Accessibility"
            lead={
              <>
                v1's table covered patterns and keys; v2 adds what each pattern must{' '}
                <em>announce</em>, because that is where implementations quietly diverge. Every row
                is verified in both themes before release.
              </>
            }
          >
            <div
              style={{
                border: 'var(--bw) solid var(--ink)',
                borderRadius: 'var(--r-md)',
                overflow: 'hidden',
                boxShadow: '4px 4px 0 var(--accent)',
                marginBottom: 16,
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: 660 }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1.2fr 1.3fr 1.3fr',
                      background: 'var(--ink)',
                      color: 'var(--surface)',
                    }}
                  >
                    {['Component', 'Pattern', 'Keyboard', 'Announces'].map((h) => (
                      <HeaderCell key={h} style={{ padding: '12px 16px' }}>
                        {h}
                      </HeaderCell>
                    ))}
                  </div>
                  {A11Y_ROWS.map(([c, pattern, keys, announces], i) => (
                    <div
                      key={c}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.2fr 1.3fr 1.3fr',
                        borderTop:
                          i === 0 ? 'var(--bw) solid var(--ink)' : '1px solid var(--border-subtle)',
                        background: i % 2 ? 'var(--sunken)' : 'var(--surface)',
                      }}
                    >
                      <Body level={3} weight="semibold" style={{ padding: '11px 16px' }}>
                        {c}
                      </Body>
                      {[pattern, keys, announces].map((v) => (
                        <Body key={v} level={3} tone="muted" style={{ padding: '11px 16px' }}>
                          {v}
                        </Body>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Grid min={240}>
              {[
                [
                  'Visible focus',
                  <>
                    A 3px accent ring at 2px offset on every focusable element, never removed — only
                    restyled so it stays visible on light, sunken, and accent surfaces alike.
                  </>,
                ],
                [
                  'Never color alone',
                  <>
                    Every tone pairs its color with an icon and a word. Print the page in grayscale
                    and no meaning is lost.
                  </>,
                ],
                [
                  'Contrast, both themes',
                  <>
                    Text and essential UI meet AA in light and dark. <Code>--on-accent</Code> is
                    tuned per theme so button labels never fall below 4.5:1.
                  </>,
                ],
                [
                  'Target size & motion',
                  <>
                    Interactive targets clear 44×44px including their gap, and every transition
                    collapses to zero under <Code>prefers-reduced-motion</Code>.
                  </>,
                ],
              ].map(([title, body]) => (
                <Card key={title as string}>
                  <Body level={2} weight="semibold" tone="success" style={{ marginBottom: 8 }}>
                    ✓ {title}
                  </Body>
                  <Body level={3} tone="muted">
                    {body}
                  </Body>
                </Card>
              ))}
            </Grid>
          </SubSection>

          {/* Governance ------------------------------------------------ */}
          <Section
            id="governance"
            eyebrow="Governance"
            title="How the system stays alive"
            lead="This is the section that separates a component library from a design system, and it was the whole of what v1 was missing. A team adopting OFFSET needs to know how a component gets in, what a version number promises, and what is coming."
          >
            <Grid min={280} style={{ marginBottom: 16 }}>
              <Card>
                <CardTitle style={{ marginBottom: 14 }}>Contribution path</CardTitle>
                <div style={{ display: 'grid', gap: 12 }}>
                  {[
                    [
                      '1 · Propose.',
                      'Open an issue with two real product screens that need it. One screen is a local component, not a system one.',
                    ],
                    [
                      '2 · Spec.',
                      'Anatomy, states, tokens consumed, keyboard map, ARIA. Reviewed before any code.',
                    ],
                    [
                      '3 · Build.',
                      'Tokens only, no new hex values. Stories for every state including error and loading.',
                    ],
                    [
                      '4 · Verify.',
                      'Axe clean, keyboard walkthrough, both themes, visual snapshot approved.',
                    ],
                    [
                      '5 · Release.',
                      'Documented, changelogged, announced with a migration note if anything shifted.',
                    ],
                  ].map(([step, body]) => (
                    <Body key={step} level={3} tone="muted">
                      <strong style={{ color: 'var(--ink)' }}>{step}</strong> {body}
                    </Body>
                  ))}
                </div>
              </Card>

              <Card>
                <CardTitle style={{ marginBottom: 14 }}>Versioning promise</CardTitle>
                <div style={{ display: 'grid', gap: 12 }}>
                  <Body level={3} tone="muted">
                    <Tag tone="accent">MAJOR</Tag> A prop or token is renamed or removed. Ships with
                    a codemod and a deprecation that lived one full minor first.
                  </Body>
                  <Body level={3} tone="muted">
                    <Tag tone="accent">MINOR</Tag> New component, new variant, new token. Always
                    additive.
                  </Body>
                  <Body level={3} tone="muted">
                    <Tag tone="success">PATCH</Tag> Bug and accessibility fixes. May change pixels
                    if the old pixels were wrong.
                  </Body>
                  <Body
                    level={3}
                    tone="muted"
                    style={{ paddingTop: 4, borderTop: '1px solid var(--border-subtle)' }}
                  >
                    Token names are the public API. They are treated with the same care as props — a
                    renamed token is a breaking change.
                  </Body>
                </div>
              </Card>

              <Card>
                <CardTitle style={{ marginBottom: 14 }}>Next</CardTitle>
                <div style={{ display: 'grid', gap: 11 }}>
                  {[
                    [
                      '2.1',
                      'Combobox and DatePicker; the two most-requested locally-built components.',
                    ],
                    ['2.2', 'DataGrid: sticky header, column resize, row selection.'],
                    ['2.3', 'Chart primitives that inherit the border-and-offset language.'],
                    [
                      'Ongoing',
                      'Figma variables published from the same token source, so design and code cannot drift.',
                    ],
                  ].map(([v, body]) => (
                    <Body key={v} level={3} tone="muted">
                      <strong style={{ color: 'var(--ink)' }}>{v}</strong> — {body}
                    </Body>
                  ))}
                </div>
              </Card>
            </Grid>

            <div
              style={{
                border: 'var(--bw) solid var(--ink)',
                borderRadius: 'var(--r-md)',
                overflow: 'hidden',
                boxShadow: '4px 4px 0 var(--accent)',
              }}
            >
              <HeaderCell
                style={{ padding: '12px 18px', background: 'var(--ink)', color: 'var(--surface)' }}
              >
                Changelog
              </HeaderCell>
              <div style={{ background: 'var(--surface)' }}>
                {[
                  [
                    '2.0.0',
                    <>
                      Two-tier token architecture. Warning tone added. Shadow-direction rule
                      specified. Feedback, overlay, and data-display groups introduced — 23
                      components. Motion and density tokens. Governance model published.{' '}
                      <strong style={{ color: 'var(--ink)' }}>Breaking:</strong> components must
                      read semantic tokens; primitive names are now private.
                    </>,
                  ],
                  [
                    '1.1.0',
                    <>
                      TabMenu promoted out of the Tabs story. Dropdown gained typeahead. Focus ring
                      raised to 3px after a contrast audit.
                    </>,
                  ],
                  [
                    '1.0.0',
                    <>
                      First release. Nine components extrapolated from a single button: Button,
                      Card, Chip, Input, Textarea, Dropdown, Checkbox, Radio, Toggle, Tabs.
                    </>,
                  ],
                ].map(([v, body], i) => (
                  <div
                    key={v as string}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(120px,.7fr) minmax(0,3fr)',
                      borderTop:
                        i === 0 ? 'var(--bw) solid var(--ink)' : '1px solid var(--border-subtle)',
                    }}
                  >
                    <Body level={3} mono weight="bold" style={{ padding: '14px 18px' }}>
                      {v}
                    </Body>
                    <Body level={3} tone="muted" style={{ padding: '14px 18px' }}>
                      {body}
                    </Body>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <footer
            style={{
              padding: '34px 0 60px',
              borderTop: 'var(--bw) solid var(--ink)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Body level={3} tone="muted">
              OFFSET Design System · v2.0.0 · React + TypeScript
            </Body>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {['Storybook', 'GitHub', 'Figma library', 'Changelog'].map((label) => (
                <Body
                  key={label}
                  as="a"
                  href={label === 'Changelog' ? '#governance' : '#top'}
                  level={3}
                  weight="semibold"
                  className="off-press off-press-sm"
                  style={{
                    padding: '9px 18px',
                    border: 'var(--bw) solid var(--ink)',
                    borderRadius: 'var(--r-md)',
                    background: 'var(--surface)',
                    color: 'var(--ink)',
                    boxShadow: '3px 3px 0 var(--accent)',
                    textDecoration: 'none',
                  }}
                >
                  {label}
                </Body>
              ))}
            </div>
          </footer>
        </div>

        {/* Modal --------------------------------------------------------- */}
        {modal ? (
          <div
            onClick={closeModal}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 80,
              background: 'var(--scrim)',
              display: 'grid',
              placeItems: 'center',
              padding: 24,
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="off-dialog-title"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 460,
                border: 'var(--bw) solid var(--ink)',
                borderRadius: 'var(--r-lg)',
                background: 'var(--surface)',
                boxShadow: '8px 8px 0 var(--accent)',
                padding: 28,
                animation: 'off-rise var(--dur-slow) var(--ease)',
              }}
            >
              <Eyebrow style={{ marginBottom: 6 }}>New project</Eyebrow>
              <Headline level={3} id="off-dialog-title" style={{ marginBottom: 10 }}>
                Name this migration
              </Headline>
              <Body level={3} tone="muted" style={{ marginBottom: 20 }}>
                Focus moves here on open, is trapped while open, and returns to the button you
                pressed when this closes.
              </Body>
              <Field label="Project name" htmlFor="off-dialog-input">
                <input
                  ref={dialogInput}
                  id="off-dialog-input"
                  type="text"
                  placeholder="Atlas migration"
                  style={{ ...inputStyle(), boxShadow: '2px 2px 0 var(--accent)' }}
                />
              </Field>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    closeModal();
                    fireToast();
                  }}
                >
                  Create project
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Toast --------------------------------------------------------- */}
        {toast ? (
          <div
            role="status"
            aria-live="polite"
            style={{
              position: 'fixed',
              zIndex: 90,
              right: 24,
              bottom: 24,
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              maxWidth: 340,
              border: 'var(--bw) solid var(--ink)',
              borderRadius: 'var(--r-md)',
              background: 'var(--surface)',
              boxShadow: '8px 8px 0 var(--accent)',
              padding: '16px 18px',
              animation: 'off-rise var(--dur-slow) var(--ease)',
            }}
          >
            <span aria-hidden="true" style={{ color: 'var(--success)', fontSize: 15 }}>
              ✓
            </span>
            <div style={{ minWidth: 0 }}>
              <Body level={3} weight="semibold" style={{ marginBottom: 2 }}>
                Project created
              </Body>
              <Body level={3} tone="muted">
                Polite live region — it announces without stealing focus.
              </Body>
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setToast(false)}
              style={{
                marginLeft: 'auto',
                flex: 'none',
                border: 'none',
                background: 'transparent',
                color: 'var(--ink-muted)',
                fontSize: 16,
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        ) : null}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
