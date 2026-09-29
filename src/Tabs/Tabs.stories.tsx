import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Input } from '../Input/Input';
import { Body } from '../Typography';
import { Tabs } from './Tabs';

/**
 * Tabs following the OFFSET design system: the browser-tab silhouette, where the
 * selected tab drops its bottom edge and takes the panel's fill so the two read as
 * one surface, lifted on the 4px accent offset.
 *
 * - **One tab stop** — `role="tablist"` with a roving tabindex. Tab enters and leaves
 *   the strip, the arrows move within it, Home and End jump to the ends.
 * - **Selection follows focus**, standard for tabs, and why disabled tabs are skipped:
 *   arrowing onto one would be a dead end.
 * - **Panels stay mounted** and inactive ones are `hidden`, so a half-filled form in
 *   one tab survives a trip to another. `hidden` content leaves the accessibility
 *   tree, so nothing is announced twice.
 * - **Wired both ways** — each tab points at its panel with `aria-controls`, each panel
 *   back at its tab with `aria-labelledby`, and panels are focusable so a panel with
 *   no controls inside is still reachable.
 *
 * For a segmented switch with no panel, use `TabMenu`.
 *
 * Import
 * ---
 *
 * `import { Tabs } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: { items: { control: false } },
  args: {
    label: 'Project detail',
    items: [
      {
        value: 'overview',
        label: 'Overview',
        content: (
          <Body level={2} tone="muted">
            Each tab links to its panel through aria-controls, and only the selected tab sits in the
            tab order — arrow keys move between the rest.
          </Body>
        ),
      },
      {
        value: 'keyboard',
        label: 'Keyboard',
        content: (
          <Body level={2} tone="muted">
            Left and Right move selection, Home and End jump to the first and last tab, and focus
            follows selection. Nothing here requires a mouse.
          </Body>
        ),
      },
      {
        value: 'tokens',
        label: 'Tokens',
        content: (
          <Body level={2} tone="muted">
            The selected edge uses the 3px emphasis border so it reads as connected to its panel.
          </Body>
        ),
      },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 620 }}>
      <Tabs {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A disabled tab is announced but skipped by the arrows. */
export const DisabledTab: Story = {
  args: {
    items: [
      { value: 'a', label: 'Overview', content: <Body level={2}>The first panel.</Body> },
      { value: 'b', label: 'Activity', content: <Body level={2}>The second panel.</Body> },
      {
        value: 'c',
        label: 'Billing',
        disabled: true,
        content: <Body level={2}>Needs a paid plan.</Body>,
      },
    ],
  },
};

/**
 * Panels keep their state because they stay mounted. Type into the first tab's field,
 * switch away and come back — the text is still there.
 */
export const KeepsPanelState: Story = {
  args: {
    label: 'Settings',
    items: [
      {
        value: 'name',
        label: 'Name',
        content: <Input label="Project name" placeholder="Atlas migration" />,
      },
      {
        value: 'notes',
        label: 'Notes',
        content: (
          <Body level={3} tone="muted">
            Switch back to Name — whatever you typed is still there.
          </Body>
        ),
      },
    ],
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('keyboard');
    return (
      <div style={{ display: 'grid', gap: 14, maxWidth: 620 }}>
        <Tabs {...args} value={value} onChange={setValue} />
        <Body level={3} tone="muted">
          Selected: {value}
        </Body>
      </div>
    );
  },
};
