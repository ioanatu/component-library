import { useState, useRef, useId } from 'react'

/* ============================================================
   OFFSET — Storybook welcome / docs page
   Neo-brutalist design system · token-driven · accessible
   Light + dark theming via CSS custom properties.
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

.offset-docs{
  /* ---------- LIGHT THEME TOKENS ---------- */
  --page:#F7F5F5; --surface:#FFFFFF; --ink:#1A1A1A; --accent:#3367F6; --on-accent:#FFFFFF;
  --danger:#F5453B; --success:#1FA971; --muted:#A1A1AA; --muted-surface:#ECECEC; --field-tint:#FBFBFA;
  --code-bg:#16161A; --code-fg:#EDEDEA; --code-blue:#9DB2FF; --code-green:#7FD1A8; --code-dim:#7A7A85;

  --border-w:2px; --radius-sm:8px; --radius-md:12px; --radius-lg:16px; --radius-full:999px;
  --shadow-sm:2px 2px 0 0 var(--accent); --shadow-md:4px 4px 0 0 var(--accent); --shadow-lg:6px 6px 0 0 var(--accent);
  --shadow-ink:4px 4px 0 0 var(--ink);
  --s1:4px; --s2:8px; --s3:12px; --s4:16px; --s5:20px; --s6:24px; --s8:32px; --s12:48px;
  --font:'Hanken Grotesk',ui-sans-serif,system-ui,-apple-system,sans-serif;
  --mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;

  font-family:var(--font); color:var(--ink); background:var(--page);
  min-height:100%; line-height:1.55;
}
.offset-docs[data-theme="dark"]{
  /* ---------- DARK THEME TOKENS ---------- */
  --page:#121214; --surface:#1D1D21; --ink:#F2F2F0; --accent:#5B82FF; --on-accent:#101014;
  --danger:#FF6B61; --success:#3DD68C; --muted:#76767E; --muted-surface:#2A2A2F; --field-tint:#232327;
  --code-bg:#0B0B0D; --code-fg:#EDEDEA; --code-blue:#9DB2FF; --code-green:#7FD1A8; --code-dim:#76767E;
}

.offset-docs *,.offset-docs *::before,.offset-docs *::after{box-sizing:border-box}
.offset-docs :focus-visible{outline:3px solid var(--accent);outline-offset:2px;border-radius:2px}
.offset-docs .on-accent:focus-visible{outline-color:var(--ink)}
.offset-docs[data-theme] a{color:var(--ink)}

/* ---------- LAYOUT ---------- */
.offset-docs .topbar{position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:var(--s4);
  padding:var(--s3) var(--s6);background:var(--page);border-bottom:var(--border-w) solid var(--ink)}
.offset-docs .brand{display:flex;align-items:center;gap:var(--s3);font-weight:800;font-size:18px;letter-spacing:-.01em}
.offset-docs .ver{font:700 11px/1 var(--mono);padding:3px 7px;border:1.5px solid var(--ink);border-radius:6px}
.offset-docs .topnav{margin-left:auto;display:flex;align-items:center;gap:var(--s5)}
.offset-docs .topnav a{font-weight:600;font-size:14px;text-decoration:none;opacity:.7}
.offset-docs .topnav a:hover{opacity:1}
.offset-docs .wrap{max-width:880px;margin:0 auto;padding:var(--s12) var(--s6)}
.offset-docs section{margin-bottom:var(--s12)}
.offset-docs[data-theme] h1{font-size:clamp(34px,6vw,56px);font-weight:800;letter-spacing:-.03em;line-height:1.02;margin:0 0 var(--s4);color:var(--ink)}
.offset-docs[data-theme] h2{font-size:26px;font-weight:800;letter-spacing:-.02em;margin:0 0 var(--s4);display:flex;align-items:center;gap:var(--s3);color:var(--ink)}
.offset-docs[data-theme] h3{font-size:17px;font-weight:700;margin:0 0 var(--s2);color:var(--ink)}
.offset-docs[data-theme] p{margin:0 0 var(--s4);color:var(--ink)}
.offset-docs .lead{font-size:19px;opacity:.8;max-width:60ch}
.offset-docs .eyebrow{font:700 12px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin:0 0 var(--s3)}

/* ---------- HERO ---------- */
.offset-docs .hero{display:grid;grid-template-columns:1fr auto;gap:var(--s8);align-items:center;
  border-bottom:var(--border-w) dashed var(--muted);padding-bottom:var(--s12)}
.offset-docs .badges{display:flex;flex-wrap:wrap;gap:var(--s2);margin-top:var(--s5)}
.offset-docs .badge{font:700 12px/1 var(--mono);padding:6px 10px;border:var(--border-w) solid var(--ink);border-radius:var(--radius-full);background:var(--surface)}
.offset-docs .hero-mark{filter:drop-shadow(0 0 0 transparent)}
@media(max-width:640px){.offset-docs .hero{grid-template-columns:1fr}.offset-docs .hero-mark{display:none}}

/* ---------- BUTTONS ---------- */
.offset-docs .btn{display:inline-flex;align-items:center;gap:var(--s2);font:700 15px/1 var(--font);
  color:var(--ink);background:var(--surface);border:var(--border-w) solid var(--ink);border-radius:var(--radius-md);
  padding:var(--s3) var(--s5);cursor:pointer;box-shadow:var(--shadow-md);transition:transform .08s,box-shadow .08s;text-decoration:none}
.offset-docs .btn:hover{transform:translate(-1px,-1px);box-shadow:var(--shadow-lg)}
.offset-docs .btn:active{transform:translate(4px,4px);box-shadow:0 0 0 0 var(--accent)}
.offset-docs .btn--accent{background:var(--accent);color:var(--on-accent);box-shadow:var(--shadow-ink)}
.offset-docs .btn--accent:hover{box-shadow:6px 6px 0 0 var(--ink)}
.offset-docs .btn--accent:active{box-shadow:0 0 0 0 var(--ink)}
.offset-docs .cta{display:flex;gap:var(--s4);flex-wrap:wrap;margin-top:var(--s6)}

/* ---------- CARDS / GRID ---------- */
.offset-docs .grid{display:grid;gap:var(--s4)}
.offset-docs .grid-3{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.offset-docs .grid-2{grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
.offset-docs .card{background:var(--surface);border:var(--border-w) solid var(--ink);border-radius:var(--radius-lg);
  padding:var(--s5);box-shadow:var(--shadow-md)}
.offset-docs .card .ic{width:34px;height:34px;border:var(--border-w) solid var(--ink);border-radius:var(--radius-sm);
  display:grid;place-items:center;margin-bottom:var(--s3);background:var(--accent);color:var(--on-accent)}
.offset-docs .card p{font-size:14px;opacity:.75;margin:0}
.offset-docs .comp-card h3{display:flex;align-items:center;justify-content:space-between;gap:var(--s2)}
.offset-docs .pill{font:700 10px/1 var(--mono);padding:4px 7px;border:1.5px solid var(--success);color:var(--success);border-radius:var(--radius-full);white-space:nowrap}

/* ---------- CODE ---------- */
.offset-docs[data-theme] pre{background:var(--code-bg);color:var(--code-fg);border-radius:var(--radius-md);
  padding:var(--s4) var(--s5);overflow:auto;font:500 13.5px/1.65 var(--mono);margin:0;border:var(--border-w) solid var(--ink)}
.offset-docs[data-theme] code{font-family:var(--mono);color:var(--ink);background:transparent}
.offset-docs[data-theme] pre code{color:var(--code-fg);background:transparent}
.offset-docs[data-theme] .kbd{font:700 11px/1 var(--mono);padding:3px 6px;border:1.5px solid var(--ink);border-radius:5px;background:var(--surface);color:var(--ink)}

/* ---------- SWATCHES ---------- */
.offset-docs .sw{border:var(--border-w) solid var(--ink);border-radius:var(--radius-sm);overflow:hidden}
.offset-docs .sw .chip{height:46px}
.offset-docs[data-theme] .sw .m{padding:var(--s2) var(--s3);font:700 12px/1.3 var(--mono);color:var(--ink)}
.offset-docs[data-theme] .sw .m small{display:block;font-weight:500;opacity:.6;margin-top:2px;color:var(--ink)}

/* ---------- TABS COMPONENT (browser-tab style) ---------- */
.offset-docs .tabs{margin:0}
.offset-docs .tablist{display:flex;gap:6px;align-items:flex-end;border-bottom:var(--border-w) solid var(--ink);padding-left:var(--s2)}
.offset-docs .tab{font:700 14px/1 var(--font);color:var(--ink);background:var(--surface);
  border:var(--border-w) solid var(--ink);border-bottom:none;border-radius:10px 10px 0 0;
  padding:10px 18px;cursor:pointer;transform:translateY(2px);opacity:.55;transition:transform .1s,opacity .1s;
  position:relative;margin-bottom:calc(-1 * var(--border-w))}
.offset-docs .tab:hover{opacity:.85}
.offset-docs .tab[aria-selected="true"]{opacity:1;transform:translateY(0)}
.offset-docs .tab[aria-selected="true"]::after{content:"";position:absolute;left:0;right:0;top:-2px;height:4px;background:var(--accent);border-radius:4px 4px 0 0}
.offset-docs .tabpanel{border:var(--border-w) solid var(--ink);border-top:none;border-radius:0 0 var(--radius-md) var(--radius-md);
  background:var(--surface);padding:var(--s5);box-shadow:var(--shadow-md)}
.offset-docs .tabpanel:focus-visible{outline-offset:-4px}

/* ---------- TAB MENU (segmented) ---------- */
.offset-docs .tabmenu{display:inline-flex;gap:4px;padding:4px;border:var(--border-w) solid var(--ink);
  border-radius:var(--radius-full);background:var(--surface);box-shadow:var(--shadow-sm)}
.offset-docs .tabmenu-btn{border:none;background:transparent;padding:9px 18px;border-radius:var(--radius-full);
  font:700 14px/1 var(--font);color:var(--ink);cursor:pointer;opacity:.7;transition:.1s}
.offset-docs .tabmenu-btn:hover{opacity:1}
.offset-docs .tabmenu-btn[aria-selected="true"]{background:var(--accent);color:var(--on-accent);opacity:1}

/* ---------- A11Y TABLE ---------- */
.offset-docs[data-theme] .a11y{width:100%;border-collapse:separate;border-spacing:0;border:var(--border-w) solid var(--ink);
  border-radius:var(--radius-md);overflow:hidden;font-size:14px}
.offset-docs[data-theme] .a11y th,.offset-docs[data-theme] .a11y td{text-align:left;padding:var(--s3) var(--s4);border-bottom:1.5px solid var(--muted-surface);color:var(--ink)}
.offset-docs[data-theme] .a11y th{background:var(--ink);color:var(--page);font-weight:700}
.offset-docs[data-theme] .a11y tr:last-child td{border-bottom:none}
.offset-docs[data-theme] .a11y td:first-child{font-weight:700}
.offset-docs[data-theme] .check{color:var(--success);font-weight:800}

/* ---------- THEME TOGGLE ---------- */
.offset-docs .toggle{display:inline-flex;align-items:center;gap:var(--s2);cursor:pointer}
.offset-docs .switch{width:54px;height:28px;background:var(--surface);border:var(--border-w) solid var(--ink);
  border-radius:var(--radius-full);padding:2px;box-shadow:var(--shadow-sm);position:relative;transition:background .12s}
.offset-docs .switch .knob{width:20px;height:20px;background:var(--ink);border-radius:999px;position:absolute;top:2px;left:2px;
  transition:transform .14s cubic-bezier(.3,1.4,.5,1)}
.offset-docs .toggle input{position:absolute;opacity:0;width:1px;height:1px}
.offset-docs .toggle input:checked + .switch{background:var(--accent)}
.offset-docs .toggle input:checked + .switch .knob{transform:translateX(26px);background:var(--on-accent)}
.offset-docs .toggle input:focus-visible + .switch{outline:3px solid var(--accent);outline-offset:2px}

.offset-docs .footer{border-top:var(--border-w) solid var(--ink);padding:var(--s8) var(--s6);text-align:center;font-size:14px;opacity:.7}
.offset-docs .note{font-size:13px;opacity:.65;margin-top:var(--s3)}
`

const Mark = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true" className="hero-mark">
    <rect x="133" y="133" width="296" height="296" rx="60" fill="#3367F6" />
    <rect x="93" y="93" width="296" height="296" rx="60" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="20" />
    <g transform="translate(168,176)" fill="#1A1A1A">
      <path d="M8 26Q8 8 26 8L70 8Q80 8 86 18L96 34L150 34Q176 34 176 60L176 132Q176 150 158 150L26 150Q8 150 8 132Z" />
    </g>
  </svg>
)

type Tab = { id: string; label: string; content: React.ReactNode }

function Tabs({ tabs, label }: { tabs: Tab[]; label: string }) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const base = useId()
  const onKey = (e: React.KeyboardEvent) => {
    const last = tabs.length - 1
    let n: number | null = null
    if (e.key === 'ArrowRight') n = active === last ? 0 : active + 1
    else if (e.key === 'ArrowLeft') n = active === 0 ? last : active - 1
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = last
    if (n !== null) { e.preventDefault(); setActive(n); refs.current[n]?.focus() }
  }
  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} className="tablist" onKeyDown={onKey}>
        {tabs.map((t, i) => (
          <button key={t.id} role="tab" id={`${base}-t-${i}`} className="tab"
            aria-selected={active === i} aria-controls={`${base}-p-${i}`}
            tabIndex={active === i ? 0 : -1} ref={(el) => { refs.current[i] = el }}
            onClick={() => setActive(i)}>{t.label}</button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.id} role="tabpanel" id={`${base}-p-${i}`} aria-labelledby={`${base}-t-${i}`}
          hidden={active !== i} tabIndex={0} className="tabpanel">{t.content}</div>
      ))}
    </div>
  )
}

function TabMenu({ items, label, onChange }: { items: string[]; label: string; onChange?: (item: string) => void }) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const base = useId()
  const select = (i: number) => { setActive(i); onChange?.(items[i]) }
  const onKey = (e: React.KeyboardEvent) => {
    const last = items.length - 1
    let n: number | null = null
    if (e.key === 'ArrowRight') n = active === last ? 0 : active + 1
    else if (e.key === 'ArrowLeft') n = active === 0 ? last : active - 1
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = last
    if (n !== null) { e.preventDefault(); select(n); refs.current[n]?.focus() }
  }
  return (
    <div role="tablist" aria-label={label} className="tabmenu" onKeyDown={onKey}>
      {items.map((it, i) => (
        <button key={it} role="tab" id={`${base}-${i}`} className="tabmenu-btn"
          aria-selected={active === i} tabIndex={active === i ? 0 : -1}
          ref={(el) => { refs.current[i] = el }} onClick={() => select(i)}>{it}</button>
      ))}
    </div>
  )
}

const Swatch = ({ name, light, dark, isDark }: { name: string; light: string; dark: string; isDark: boolean }) => (
  <div className="sw">
    <div className="chip" style={{ background: isDark ? dark : light }} />
    <div className="m">{name}<small>{isDark ? dark : light}</small></div>
  </div>
)

const INSTALL = {
  npm: `npm install @ioanatu/component-library`,
  pnpm: `pnpm add @ioanatu/component-library`,
  yarn: `yarn add @ioanatu/component-library`,
}
const USAGE_BASIC =
`import { Button } from '@ioanatu/component-library';

export function Toolbar() {
  return (
    <Button variant="primary" onClick={createProject}>
      add new project
    </Button>
  );
}`
const USAGE_DARK_CSS =
`/* Theming is pure CSS variables — override them under a scope. */
[data-theme="dark"] {
  --page:    #121214;
  --surface: #1D1D21;
  --ink:     #F2F2F0;   /* borders + text flip light */
  --accent:  #5B82FF;   /* brightened for dark fills  */
  --on-accent:#101014;
}`
const USAGE_DARK_REACT =
`function App() {
  const [theme, setTheme] = useState('light');

  // Apply the theme at the root; every token cascades down.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return <Toggle checked={theme === 'dark'}
                 onChange={e => setTheme(e.target.checked ? 'dark' : 'light')} />;
}`
const USAGE_TABS =
`import { Tabs } from '@ioanatu/component-library';

<Tabs
  label="Account settings"
  tabs={[
    { id: 'profile', label: 'Profile', content: <Profile /> },
    { id: 'billing', label: 'Billing', content: <Billing /> },
    { id: 'team',    label: 'Team',    content: <Team /> },
  ]}
/>`
const USAGE_TABMENU =
`import { TabMenu } from '@ioanatu/component-library';

<TabMenu
  label="View mode"
  items={['Grid', 'List', 'Board']}
  onChange={(view) => setView(view)}
/>`

const scrollTo = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Welcome() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const isDark = theme === 'dark'
  const [menuView, setMenuView] = useState('Grid')

  const components: [string, string][] = [
    ['Button', 'Primary, accent, and ghost variants with the signature press interaction.'],
    ['Input & Textarea', 'Labelled fields with focus-driven shadow, error and disabled states.'],
    ['Dropdown', 'Single-select built on the listbox pattern with full keyboard control.'],
    ['Checkbox & Radio', 'Custom-styled controls backed by native inputs for free semantics.'],
    ['Toggle', 'A role=switch control for binary settings.'],
    ['Tabs', 'Browser-tab styled tablist with arrow-key navigation and panels.'],
    ['TabMenu', 'A segmented, pill-style tab menu for switching views.'],
  ]

  return (
    <div className="offset-docs" data-theme={theme}>
      <style>{CSS}</style>

      {/* TOP BAR */}
      <header className="topbar">
        <div className="brand"><Mark size={30} /> OFFSET <span className="ver">v1.0.0</span></div>
        <nav className="topnav">
          <a href="#start" onClick={scrollTo('start')}>Getting started</a>
          <a href="#components" onClick={scrollTo('components')}>Components</a>
          <a href="#a11y" onClick={scrollTo('a11y')}>Accessibility</a>
          <label className="toggle" title="Toggle theme">
            <input type="checkbox" checked={isDark}
              onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')} aria-label="Dark mode" />
            <span className="switch"><span className="knob" /></span>
          </label>
        </nav>
      </header>

      <main className="wrap">
        {/* HERO */}
        <section className="hero">
          <div>
            <p className="eyebrow">React · TypeScript · Design System</p>
            <h1>OFFSET</h1>
            <p className="lead">A neo-brutalist component library where every surface is defined by one idea: a bold border and a hard, unapologetic offset shadow. Token-driven, themeable, and accessible from the first commit.</p>
            <div className="badges">
              <span className="badge">React 19</span>
              <span className="badge">TypeScript</span>
              <span className="badge">WCAG 2.1 AA</span>
              <span className="badge">Zero-runtime CSS vars</span>
            </div>
            <div className="cta">
              <a className="btn btn--accent on-accent" href="#start" onClick={scrollTo('start')}>Get started</a>
              <a className="btn" href="#components" onClick={scrollTo('components')}>Browse components</a>
            </div>
          </div>
          <Mark size={180} />
        </section>

        {/* OVERVIEW */}
        <section>
          <p className="eyebrow">Overview</p>
          <h2>One button, extrapolated into a system</h2>
          <p className="lead" style={{ maxWidth: '65ch' }}>OFFSET began as a single button and grew outward by rule, not by guesswork. Its color, radius, border weight, and shadow were lifted directly from that component, then extended into a complete token scale so every new piece inherits the same point of view. The result is a library that feels designed rather than assembled.</p>
          <div className="grid grid-3" style={{ marginTop: 'var(--s6)' }}>
            <div className="card"><div className="ic">◆</div><h3>Token-driven</h3><p>Every value — color, spacing, radius, elevation, type — is a CSS custom property. Restyle the whole system by editing the token layer, not the components.</p></div>
            <div className="card"><div className="ic">⌨</div><h3>Accessible by default</h3><p>Correct ARIA roles, full keyboard operation, managed focus, and visible focus rings ship with every component — not as an afterthought.</p></div>
            <div className="card"><div className="ic">◑</div><h3>Light & dark</h3><p>Theming is a scoped variable override. No duplicated components, no theme props threaded everywhere — just one attribute on the root.</p></div>
          </div>
        </section>

        {/* GETTING STARTED */}
        <section id="start">
          <p className="eyebrow">Getting started</p>
          <h2>Install & use</h2>
          <p>Add the package, then import components directly — styles inject automatically.</p>
          <div style={{ marginBottom: 'var(--s5)' }}>
            <Tabs label="Install with your package manager" tabs={[
              { id: 'npm', label: 'npm', content: <pre><code>{INSTALL.npm}</code></pre> },
              { id: 'pnpm', label: 'pnpm', content: <pre><code>{INSTALL.pnpm}</code></pre> },
              { id: 'yarn', label: 'yarn', content: <pre><code>{INSTALL.yarn}</code></pre> },
            ]} />
          </div>
          <pre><code>{USAGE_BASIC}</code></pre>
          <p className="note">Styles are injected automatically on import — no separate CSS import needed in your app.</p>
        </section>

        {/* TOKENS */}
        <section id="tokens">
          <p className="eyebrow">Design tokens</p>
          <h2>The values everything reads from</h2>
          <p>Colors flip with the theme; structural tokens stay constant. Toggle the switch in the header to watch these swatches re-theme live.</p>
          <div className="grid grid-3" style={{ marginBottom: 'var(--s5)' }}>
            <Swatch name="--page" light="#F7F5F5" dark="#121214" isDark={isDark} />
            <Swatch name="--surface" light="#FFFFFF" dark="#1D1D21" isDark={isDark} />
            <Swatch name="--ink" light="#1A1A1A" dark="#F2F2F0" isDark={isDark} />
            <Swatch name="--accent" light="#3367F6" dark="#5B82FF" isDark={isDark} />
            <Swatch name="--danger" light="#F5453B" dark="#FF6B61" isDark={isDark} />
            <Swatch name="--success" light="#1FA971" dark="#3DD68C" isDark={isDark} />
          </div>
          <div className="grid grid-2">
            <div className="card"><h3>Structure</h3><p style={{ fontFamily: 'var(--mono)', fontSize: 13, lineHeight: 2 }}>--border-w: 2px<br />--radius-md: 12px<br />--shadow-md: 4px 4px 0 accent</p></div>
            <div className="card"><h3>Scale</h3><p style={{ fontFamily: 'var(--mono)', fontSize: 13, lineHeight: 2 }}>--s1…--s12: 4 → 48px<br />--fs-xs…2xl: 12 → 30px<br />--radius-sm/lg/full</p></div>
          </div>
        </section>

        {/* THEMING / DARK MODE */}
        <section id="theming">
          <p className="eyebrow">Theming & dark mode</p>
          <h2>Dark mode is one attribute</h2>
          <p>Because components only ever reference tokens, a dark theme is just a second set of variable values scoped under <code className="kbd">[data-theme="dark"]</code>. Define them once:</p>
          <pre style={{ marginBottom: 'var(--s5)' }}><code>{USAGE_DARK_CSS}</code></pre>
          <p>Then drive it from React — set the attribute on the root and every descendant re-themes through the cascade:</p>
          <pre><code>{USAGE_DARK_REACT}</code></pre>
          <p className="note">The accent brightens in dark mode and <code>--on-accent</code> flips to a near-black so text on accent fills keeps an AA contrast ratio.</p>
        </section>

        {/* COMPONENTS */}
        <section id="components">
          <p className="eyebrow">Components</p>
          <h2>What's in the box</h2>
          <div className="grid grid-2" style={{ marginBottom: 'var(--s8)' }}>
            {components.map(([name, desc]) => (
              <div className="card comp-card" key={name}>
                <h3>{name} <span className="pill">A11y ✓</span></h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 20, marginBottom: 'var(--s4)' }}>Tabs — live</h3>
          <p>The browser-tab strip you liked, promoted into a real <code>Tabs</code> component: a proper <code className="kbd">tablist</code> with roving <code>tabindex</code>, arrow-key navigation, and <code>Home</code>/<code>End</code> jumps.</p>
          <div style={{ marginBottom: 'var(--s5)' }}>
            <Tabs label="Demo tabs" tabs={[
              { id: 'a', label: 'Overview', content: <p style={{ margin: 0 }}>Each tab links to its panel via <code>aria-controls</code>, and the selected tab is the only one in the tab order — arrow keys move between the rest.</p> },
              { id: 'b', label: 'Keyboard', content: <p style={{ margin: 0 }}>Try it: focus a tab and press <span className="kbd">←</span> <span className="kbd">→</span> to move, <span className="kbd">Home</span> / <span className="kbd">End</span> to jump to the ends.</p> },
              { id: 'c', label: 'Panels', content: <p style={{ margin: 0 }}>Panels are focusable (<code>tabIndex=0</code>) and labelled by their tab, so screen-reader users land in the right context.</p> },
            ]} />
          </div>
          <pre style={{ marginBottom: 'var(--s8)' }}><code>{USAGE_TABS}</code></pre>

          <h3 style={{ fontSize: 20, marginBottom: 'var(--s4)' }}>TabMenu — live</h3>
          <p>A segmented, pill-style sibling for switching views or modes. Same accessible tab semantics, different silhouette.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s4)', flexWrap: 'wrap', marginBottom: 'var(--s5)' }}>
            <TabMenu label="View mode" items={['Grid', 'List', 'Board']} onChange={setMenuView} />
            <span style={{ fontWeight: 700, opacity: .7 }}>→ showing <code className="kbd">{menuView}</code></span>
          </div>
          <pre><code>{USAGE_TABMENU}</code></pre>
        </section>

        {/* ACCESSIBILITY */}
        <section id="a11y">
          <p className="eyebrow">Accessibility</p>
          <h2>Built to WCAG 2.1 AA</h2>
          <p className="lead" style={{ maxWidth: '65ch' }}>Accessibility is a baseline requirement here, not a feature. Every interactive component is fully operable by keyboard, exposes the correct ARIA roles and states, manages focus deliberately, and never communicates meaning through color alone.</p>
          <table className="a11y" style={{ marginTop: 'var(--s5)' }}>
            <thead><tr><th>Component</th><th>Pattern</th><th>Keyboard</th></tr></thead>
            <tbody>
              <tr><td>Dropdown</td><td>listbox + button</td><td>↑ ↓ · Enter · Esc · Home/End · typeahead-ready</td></tr>
              <tr><td>Tabs / TabMenu</td><td>tablist (roving tabindex)</td><td>← → · Home/End</td></tr>
              <tr><td>Checkbox / Radio</td><td>native input + custom UI</td><td>Space · arrow keys (radio group)</td></tr>
              <tr><td>Toggle</td><td>role=switch</td><td>Space</td></tr>
              <tr><td>Inputs</td><td>label + aria-describedby</td><td>standard · errors announced</td></tr>
            </tbody>
          </table>
          <div className="grid grid-3" style={{ marginTop: 'var(--s6)' }}>
            <div className="card"><h3><span className="check">✓</span> Visible focus</h3><p>A 3px focus ring on every focusable element, never removed — only restyled to stay visible on light and accent surfaces alike.</p></div>
            <div className="card"><h3><span className="check">✓</span> Color independence</h3><p>Error states pair the danger color with text and an invalid state, so meaning survives for color-blind and grayscale users.</p></div>
            <div className="card"><h3><span className="check">✓</span> Contrast</h3><p>Text and essential UI meet AA contrast in both themes; <code>--on-accent</code> is tuned per theme to keep button labels legible.</p></div>
          </div>
        </section>

        {/* RESOURCES */}
        <section>
          <p className="eyebrow">Resources</p>
          <h2>Keep going</h2>
          <div className="cta">
            <a className="btn" href="#">Storybook</a>
            <a className="btn" href="https://github.com/ioanatu/component-library">GitHub</a>
            <a className="btn" href="#">Figma library</a>
            <a className="btn" href="#">Changelog</a>
          </div>
        </section>
      </main>

      <footer className="footer">OFFSET Design System · v1.0.0 · Built with React + TypeScript · Toggle the theme in the header ◑</footer>
    </div>
  )
}
