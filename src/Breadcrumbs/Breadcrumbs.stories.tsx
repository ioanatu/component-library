import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';

/**
 * Breadcrumbs following the OFFSET design system: a muted trail ending in the
 * current page.
 *
 * - **A named `<nav>` around an `<ol>`** — the order carries the meaning, so it is an
 *   ordered list, and the nav has a name for pages with more than one.
 * - **The last item is not a link.** It gets `aria-current="page"` and stays plain
 *   text, because a link to where you already are is a dead end.
 * - **Separators are not list items.** They sit inside the item as `aria-hidden` text,
 *   so the list announces three levels rather than five things.
 * - **Colour is on the anchor**, never on the Typography inside it, which carries
 *   `tone="inherit"` — a `color` in the module would collide with the tone classes.
 *
 * Import
 * ---
 *
 * `import { Breadcrumbs } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  argTypes: {
    separator: { control: 'text' },
    items: { control: false },
  },
  args: {
    items: [
      { label: 'Workspace', href: '#workspace' },
      { label: 'Projects', href: '#projects' },
      { label: 'Atlas migration' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Any node works as the separator; it is decorative either way. */
export const CustomSeparator: Story = {
  args: { separator: '→' },
};

export const TwoLevels: Story = {
  args: {
    items: [{ label: 'Workspace', href: '#workspace' }, { label: 'Projects' }],
  },
};

/** A long trail wraps rather than overflowing, and the current page truncates. */
export const Deep: Story = {
  args: {
    items: [
      { label: 'Workspace', href: '#a' },
      { label: 'Projects', href: '#b' },
      { label: 'Atlas migration', href: '#c' },
      { label: 'Schemas', href: '#d' },
      { label: 'public.accounts', href: '#e' },
      { label: 'A migration step with a rather long name' },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Breadcrumbs {...args} />
    </div>
  ),
};

/** A single item is just the current page. */
export const OneLevel: Story = {
  args: { items: [{ label: 'Workspace' }] },
};
