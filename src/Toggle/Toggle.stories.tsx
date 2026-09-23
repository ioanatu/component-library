import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { sizes } from '../types';
import { Toggle } from './Toggle';

/**
 * Toggle following the OFFSET design system: a 2px ink track with the offset
 * shadow and an ink thumb that slides.
 *
 * - **A real input, custom paint** — `<input type="checkbox">` with `role="switch"`,
 *   so it announces "on"/"off" rather than "checked", and Space still works.
 * - **Switch, not checkbox** — a toggle applies immediately. Reach for `Checkbox`
 *   when the change should wait for a submit.
 * - **Never colour alone** — the thumb's position carries the state as well as the
 *   track's fill.
 * - **Derived geometry** — each size sets only the track's width and height; the
 *   thumb and its travel follow from those.
 *
 * Import
 * ---
 *
 * `import { Toggle } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    helper: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
  },
  args: {
    label: 'Dark mode',
    size: 'md',
    disabled: false,
    hideLabel: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const column = { display: 'grid', gap: 18, justifyItems: 'start' } as const;

/** Track width and height per size; thumb and travel are derived from them. */
export const Sizes: Story = {
  argTypes: { size: { control: false, table: { disable: true } } },
  render: (args) => (
    <div style={column}>
      {sizes.map((size) => (
        <Toggle {...args} key={size} size={size} label={`Dark mode (${size})`} defaultChecked />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={column}>
      <Toggle {...args} label="Off" />
      <Toggle {...args} label="On" defaultChecked />
      <Toggle {...args} label="Disabled, off" disabled />
      <Toggle {...args} label="Disabled, on" disabled defaultChecked />
      <Toggle {...args} label="Invalid" error="Turn this on to continue." />
    </div>
  ),
};

/** The hint stays while the error shows; both are linked to the input. */
export const HelperAndError: Story = {
  render: (args) => (
    <div style={column}>
      <Toggle {...args} label="Email digest" helper="One message a week, on Mondays." />
      <Toggle
        {...args}
        label="Two-factor authentication"
        helper="Recommended for every account."
        error="Confirm your phone number first."
      />
    </div>
  ),
};

/**
 * A settings list, which is where switches belong: each one applies on the spot,
 * with no submit button to press.
 */
export const SettingsList: Story = {
  render: () => {
    const [settings, setSettings] = useState({ deploys: true, digest: false, sounds: false });
    const set = (key: keyof typeof settings) => (event: { target: { checked: boolean } }) =>
      setSettings((prev) => ({ ...prev, [key]: event.target.checked }));

    return (
      <div style={{ display: 'grid', gap: 18, inlineSize: 360 }}>
        <Toggle
          label="Deploy notifications"
          checked={settings.deploys}
          onChange={set('deploys')}
          helper="Sent the moment a deploy finishes."
        />
        <Toggle label="Weekly digest" checked={settings.digest} onChange={set('digest')} />
        <Toggle label="Sound effects" checked={settings.sounds} onChange={set('sounds')} />
      </div>
    );
  },
};
