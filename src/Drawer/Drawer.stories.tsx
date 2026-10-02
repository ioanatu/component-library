import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ButtonNew } from '../ButtonNew/ButtonNew';
import { Checkbox } from '../Checkbox/Checkbox';
import { CheckboxGroup } from '../Checkbox/CheckboxGroup';
import { Link } from '../Link/Link';
import { drawerAnchors, sizes } from '../types';
import { Body } from '../Typography';
import { Drawer, type DrawerProps } from './Drawer';

/**
 * Drawer following the OFFSET design system: a bordered panel on the offset shadow,
 * sliding in from one edge.
 *
 * - **`temporary`** is modal, on the native `<dialog>` like Modal: focus is trapped, the
 *   page behind is inert, Escape and the backdrop close it, and focus returns to the
 *   trigger. It floats 12px in from its edge, so the down-right offset stays visible.
 * - **`persistent`** sits beside the content as a landmark. Closed, it is `inert`, so its
 *   controls leave the tab order. Give the trigger `aria-expanded` and `aria-controls`.
 * - **`permanent`** never closes, for primary navigation on wide screens.
 * - **Logical edges** — `start` is the right edge in a right-to-left layout.
 * - **Only the middle scrolls**, so the title, close button and actions stay in reach.
 * - **Motion stops** under `prefers-reduced-motion`.
 *
 * Import
 * ---
 *
 * `import { Drawer } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    anchor: { control: 'inline-radio', options: drawerAnchors },
    size: { control: 'inline-radio', options: sizes },
    dismissible: { control: 'boolean' },
    open: { control: false },
    onClose: { control: false },
    variant: { control: false },
  },
  args: {
    title: 'Notifications',
    description: 'The latest activity on your projects.',
    anchor: 'end',
    size: 'md',
    dismissible: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function TemporaryDrawer(args: Omit<DrawerProps, 'open' | 'onClose'>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ButtonNew onClick={() => setOpen(true)}>Open drawer</ButtonNew>
      <Drawer {...args} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export const Temporary: Story = {
  render: (args) => (
    <TemporaryDrawer {...args} footer={<ButtonNew variant="secondary">Mark all as read</ButtonNew>}>
      <div style={{ display: 'grid', gap: 16 }}>
        {[
          'Export finished',
          'New comment on Invoices',
          'Audit log failed',
          'Sessions deployed',
        ].map((text) => (
          <Body key={text} level={3}>
            {text}
          </Body>
        ))}
      </div>
    </TemporaryDrawer>
  ),
};

/** Navigation in a modal drawer: the links sit in their own labelled `<nav>`. */
export const Navigation: Story = {
  args: { title: 'Menu', description: undefined, anchor: 'start', size: 'sm' },
  render: (args) => (
    <TemporaryDrawer {...args}>
      <nav aria-label="Main">
        <Body
          as="ul"
          level={2}
          style={{ display: 'grid', gap: 14, margin: 0, padding: 0, listStyle: 'none' }}
        >
          {['Overview', 'Batches', 'Owners', 'Settings'].map((page) => (
            <li key={page}>
              <Link href="#" aria-current={page === 'Batches' ? 'page' : undefined}>
                {page}
              </Link>
            </li>
          ))}
        </Body>
      </nav>
    </TemporaryDrawer>
  ),
};

/** A bottom sheet for filters, with the actions pinned below the scrolling list. */
export const BottomSheet: Story = {
  args: { title: 'Filter batches', description: undefined, anchor: 'bottom', size: 'md' },
  render: (args) => (
    <TemporaryDrawer
      {...args}
      footer={
        <>
          <ButtonNew variant="ghost">Clear</ButtonNew>
          <ButtonNew>Show results</ButtonNew>
        </>
      }
    >
      <CheckboxGroup label="Status" orientation="horizontal">
        {['Deployed', 'In review', 'Degraded', 'Failed'].map((status) => (
          <Checkbox key={status} value={status} label={status} />
        ))}
      </CheckboxGroup>
    </TemporaryDrawer>
  ),
};

/** Beside the content, which narrows to make room. The trigger reports its state. */
export const Persistent: Story = {
  parameters: { layout: 'fullscreen' },
  args: { title: 'Details', description: undefined, anchor: 'start', size: 'sm' },
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ display: 'flex', minHeight: '100vh', padding: 16, gap: 16 }}>
        <Drawer
          {...args}
          variant="persistent"
          id="details-drawer"
          open={open}
          onClose={() => setOpen(false)}
        >
          <Body level={3} tone="muted">
            Source pg-14-prod, started 2026-09-02.
          </Body>
        </Drawer>
        <main style={{ flex: 1, display: 'grid', alignContent: 'start', gap: 16 }}>
          <div>
            <ButtonNew
              variant="secondary"
              aria-expanded={open}
              aria-controls="details-drawer"
              onClick={() => setOpen((current) => !current)}
            >
              {open ? 'Hide details' : 'Show details'}
            </ButtonNew>
          </div>
          <Body level={2}>The page content reflows as the drawer opens and closes.</Body>
        </main>
      </div>
    );
  },
};

/** Always open: primary navigation on a wide screen. */
export const Permanent: Story = {
  parameters: { layout: 'fullscreen' },
  args: { title: 'Workspace', description: undefined, anchor: 'start', size: 'sm' },
  render: (args) => (
    <div style={{ display: 'flex', minHeight: '100vh', padding: 16, gap: 16 }}>
      <Drawer {...args} variant="permanent" landmark="nav">
        <Body
          as="ul"
          level={2}
          style={{ display: 'grid', gap: 14, margin: 0, padding: 0, listStyle: 'none' }}
        >
          {['Overview', 'Batches', 'Owners'].map((page) => (
            <li key={page}>
              <Link href="#">{page}</Link>
            </li>
          ))}
        </Body>
      </Drawer>
      <main style={{ flex: 1 }}>
        <Body level={2}>Content sits beside the drawer.</Body>
      </main>
    </div>
  ),
};
