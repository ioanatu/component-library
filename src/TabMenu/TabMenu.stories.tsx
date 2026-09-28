import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Body } from '../Typography';
import { TabMenu } from './TabMenu';

/**
 * TabMenu — the design system's segmented sibling of Tabs: a pill of tabs with one
 * filled in `--accent`, on the 2px ink border and the accent offset.
 *
 * - **One tab stop** — a `role="tablist"` with a roving tabindex, so Tab enters and
 *   leaves the group while the arrows move within it. Home and End jump to the ends.
 * - **Selection follows focus**, which is standard for tabs, and why disabled tabs
 *   are skipped rather than landed on: arrowing onto one would be a dead end.
 * - **Named** — `label` becomes the tablist's `aria-label`. A tablist without a name
 *   gives a screen reader nothing to announce.
 * - **`panelId`** wires a tab to the panel it controls through `aria-controls`.
 *
 * For a form value rather than a view, reach for `RadioGroup` instead.
 *
 * Import
 * ---
 *
 * `import { TabMenu } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof TabMenu> = {
  title: 'Components/TabMenu',
  component: TabMenu,
  tags: ['autodocs'],
  argTypes: {
    fullWidth: { control: 'boolean' },
    items: { control: false },
  },
  args: {
    label: 'View mode',
    items: [
      { value: 'grid', label: 'Grid' },
      { value: 'list', label: 'List' },
      { value: 'board', label: 'Board' },
    ],
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Fills the parent, sharing the width between tabs. */
export const FullWidth: Story = {
  args: { fullWidth: true },
  render: (args) => (
    <div style={{ maxWidth: 460, border: '2px dashed var(--border-subtle)', padding: 16 }}>
      <TabMenu {...args} />
    </div>
  ),
};

/** A disabled tab is announced but skipped by the arrows, since selection follows focus. */
export const DisabledTab: Story = {
  args: {
    items: [
      { value: 'grid', label: 'Grid' },
      { value: 'list', label: 'List' },
      { value: 'board', label: 'Board', disabled: true },
    ],
  },
};

/** Wired to a panel with `panelId`, so the tab and its region are linked. */
export const WithPanel: Story = {
  render: (args) => {
    const [value, setValue] = useState('grid');
    const items = args.items.map((item) => ({ ...item, panelId: `panel-${item.value}` }));

    return (
      <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
        <TabMenu {...args} items={items} value={value} onChange={setValue} />
        <div
          id={`panel-${value}`}
          role="tabpanel"
          tabIndex={0}
          style={{
            border: '2px solid var(--ink)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '4px 4px 0 var(--accent)',
            background: 'var(--surface)',
            padding: 20,
            minWidth: 280,
          }}
        >
          <Body level={3} tone="muted">
            Showing the {value} view.
          </Body>
        </div>
      </div>
    );
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('list');
    return (
      <div style={{ display: 'grid', gap: 14, justifyItems: 'start' }}>
        <TabMenu {...args} value={value} onChange={setValue} />
        <Body level={3} tone="muted">
          Selected: {value}
        </Body>
      </div>
    );
  },
};
