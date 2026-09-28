import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ButtonNew } from '../ButtonNew/ButtonNew';
import { Body } from '../Typography';
import { Select } from './Select';

/**
 * Select following the design page's listbox pattern: a field-shaped trigger with
 * the accent offset, opening a panel the same width as itself.
 *
 * - **Picks a value** — unlike `DropdownMenu`, which runs an action. A
 *   `<button aria-haspopup="listbox">` opens a `role="listbox"` of `role="option"`s.
 * - **Searchable** — the search field is itself the `role="combobox"`: focus stays in
 *   it while `aria-activedescendant` moves the active option, which is what lets you
 *   type and arrow at the same time. It reuses the library `Input`, so it gets the
 *   wash hover, the focus ring and the clear button for nothing.
 * - **Selected and active are different things** — selected keeps the wash and a tick,
 *   the keyboard's position gets a ring. Never one signal doing two jobs.
 * - **Keyboard** — Enter, Space or Down opens on the selected option, Up opens on the
 *   last. Inside: Up/Down wrap, Home/End jump to the ends, Enter picks, Escape closes
 *   and returns focus to the trigger, Tab closes. Without `searchable`, typing jumps
 *   to an option by name.
 * - **`fullWidth`** fills the parent; the default is 240px, and the panel always spans
 *   the trigger exactly.
 *
 * Positioned relative to the trigger rather than portaled, so an ancestor with
 * `overflow: hidden` will clip the panel.
 *
 * Import
 * ---
 *
 * `import { Select } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    searchable: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    helper: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    maxHeight: { control: { type: 'number', min: 120, step: 20 } },
    options: { control: false },
  },
  args: {
    label: 'Size',
    options: [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' },
    ],
    searchable: false,
    fullWidth: false,
    disabled: false,
    required: false,
    hideLabel: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PEOPLE = [
  'Ada Lovelace',
  'Alan Turing',
  'Barbara Liskov',
  'Donald Knuth',
  'Edsger Dijkstra',
  'Grace Hopper',
  'Ken Thompson',
  'Margaret Hamilton',
  'Radia Perlman',
  'Tim Berners-Lee',
].map((name) => ({ value: name.toLowerCase().replace(/\s+/g, '-'), label: name }));

const pad = { padding: '20px 20px 320px' } as const;

export const Default: Story = {
  args: { defaultValue: 'medium' },
  render: (args) => (
    <div style={pad}>
      <Select {...args} />
    </div>
  ),
};

/**
 * `searchable` filters as you type. Focus stays in the search field, so the arrows
 * keep working while you refine the query, and the result count is announced.
 */
export const Searchable: Story = {
  args: { searchable: true, label: 'Assign to', options: PEOPLE, placeholder: 'Choose a person' },
  render: (args) => (
    <div style={pad}>
      <Select {...args} />
    </div>
  ),
};

/** `fullWidth` fills the parent, and the panel follows the trigger's width. */
export const FullWidth: Story = {
  args: { fullWidth: true, searchable: true, label: 'Assign to', options: PEOPLE },
  render: (args) => (
    <div style={{ ...pad, maxWidth: 560, border: '2px dashed var(--border-subtle)' }}>
      <Select {...args} />
    </div>
  ),
};

/** Side by side: the default 240px, and one filling its column. */
export const Widths: Story = {
  argTypes: { fullWidth: { control: false, table: { disable: true } } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 28, maxWidth: 520, padding: '20px 20px 340px' }}>
      <Select {...args} label="Default width" defaultValue="medium" />
      <Select {...args} fullWidth label="Full width" defaultValue="medium" />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24, padding: '20px 20px 300px' }}>
      <Select {...args} label="Empty" />
      <Select {...args} label="With a value" defaultValue="medium" />
      <Select {...args} label="With a hint" helper="Applies to new projects only." />
      <Select {...args} label="Invalid" required error="Choose a size to continue." />
      <Select {...args} label="Disabled" defaultValue="medium" disabled />
    </div>
  ),
};

/** A disabled option stays visible and navigable, but cannot be picked. */
export const DisabledOption: Story = {
  args: {
    label: 'Plan',
    options: [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Pro' },
      { value: 'enterprise', label: 'Enterprise — contact sales', disabled: true },
    ],
  },
  render: (args) => (
    <div style={pad}>
      <Select {...args} />
    </div>
  ),
};

/** `maxHeight` caps the list; the search field stays put while the options scroll. */
export const LongList: Story = {
  args: { searchable: true, label: 'Assign to', options: PEOPLE, maxHeight: 180 },
  render: (args) => (
    <div style={pad}>
      <Select {...args} />
    </div>
  ),
};

/** Nothing selected to begin with, validated on submit. */
export const ValidationOnSubmit: Story = {
  args: { label: 'Size', placeholder: 'Choose a size' },
  render: (args) => {
    /* null, not undefined: controlled from the start with nothing selected. */
    const [value, setValue] = useState<string | null>(null);
    const [error, setError] = useState<string>();

    return (
      <form
        noValidate
        style={{ display: 'grid', gap: 20, justifyItems: 'start', padding: '20px 20px 300px' }}
        onSubmit={(event) => {
          event.preventDefault();
          setError(value ? undefined : 'Choose a size to continue.');
        }}
      >
        <Select
          {...args}
          required
          value={value}
          error={error}
          onChange={(next) => {
            setValue(next);
            setError(undefined);
          }}
        />
        <ButtonNew type="submit">Save</ButtonNew>
      </form>
    );
  },
};

/** Controlled, with the value shown outside. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('medium');
    return (
      <div style={{ display: 'grid', gap: 16, justifyItems: 'start', padding: '20px 20px 300px' }}>
        <Select {...args} value={value} onChange={setValue} />
        <Body level={3} tone="muted">
          Selected: {value}
        </Body>
      </div>
    );
  },
};
