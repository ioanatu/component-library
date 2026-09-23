import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { sizes } from '../types';
import { Checkbox } from './Checkbox';
import { CheckboxGroup } from './CheckboxGroup';

/**
 * Checkbox following the OFFSET design system: a 2px ink box that fills with
 * `--accent` when checked.
 *
 * - **Native input, custom paint** — a real `<input type="checkbox">` is hidden from
 *   sight only, so Space, form submission and the accessibility tree work natively.
 *   The label wraps it, making the whole row a hit target.
 * - **Indeterminate** is set as a DOM property, the only way it exists, which is
 *   what makes it announce as "mixed".
 * - **Described, not guessed** — `helper` and `error` are linked through
 *   `aria-describedby`; an error sets `aria-invalid` and announces.
 * - **No `readOnly`** — browsers ignore it on a checkbox, so the prop is omitted
 *   rather than shipped as a lie. Use `disabled`.
 *
 * Import
 * ---
 *
 * `import { Checkbox, CheckboxGroup } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    helper: { control: 'text' },
    error: { control: 'text' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
  },
  args: {
    label: 'Notify the team',
    size: 'md',
    indeterminate: false,
    disabled: false,
    required: false,
    hideLabel: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const column = { display: 'grid', gap: 14, justifyItems: 'start' } as const;

export const States: Story = {
  render: (args) => (
    <div style={column}>
      <Checkbox {...args} label="Unchecked" />
      <Checkbox {...args} label="Checked" defaultChecked />
      <Checkbox {...args} label="Indeterminate" indeterminate />
      <Checkbox {...args} label="Disabled" disabled />
      <Checkbox {...args} label="Disabled, checked" disabled defaultChecked />
      <Checkbox {...args} label="Disabled, indeterminate" disabled indeterminate />
      <Checkbox {...args} label="Invalid" error="Accept the terms to continue." />
      <Checkbox {...args} label="Required" required />
    </div>
  ),
};

export const Sizes: Story = {
  argTypes: { size: { control: false, table: { disable: true } } },
  render: (args) => (
    <div style={column}>
      {sizes.map((size) => (
        <Checkbox
          {...args}
          key={size}
          size={size}
          label={`Notify the team (${size})`}
          defaultChecked
        />
      ))}
    </div>
  ),
};

export const HelperAndError: Story = {
  render: (args) => (
    <div style={column}>
      <Checkbox {...args} label="Email me" helper="No more than one message a week." />
      <Checkbox
        {...args}
        label="Accept the terms"
        required
        helper="You can withdraw consent later."
        error="Accept the terms to continue."
      />
    </div>
  ),
};

/**
 * A `<fieldset>` with a `<legend>`, which is what makes a screen reader announce
 * the group's name alongside each option. Options are reached with Tab and toggled
 * with Space — arrow-key roving belongs to radio groups, not here.
 */
export const Group: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      <CheckboxGroup label="Notify me about" name="notify" helper="Pick as many as you like.">
        <Checkbox label="Deploys" defaultChecked />
        <Checkbox label="Failed jobs" defaultChecked />
        <Checkbox label="Weekly digest" />
      </CheckboxGroup>

      <CheckboxGroup label="Include in export" name="export" orientation="horizontal">
        {['Accounts', 'Invoices', 'Attachments'].map((item) => (
          <Checkbox key={item} label={item} />
        ))}
      </CheckboxGroup>
    </div>
  ),
};

/**
 * `disabled` on the group uses the native `<fieldset disabled>`, which cascades to
 * every control inside — no prop threading. A group-level `error` marks each box
 * invalid and announces once for the group rather than once per option.
 */
export const GroupStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      <CheckboxGroup label="Disabled group" name="off" disabled>
        <Checkbox label="Deploys" defaultChecked />
        <Checkbox label="Failed jobs" />
      </CheckboxGroup>

      <CheckboxGroup
        label="Pick at least one"
        name="required-group"
        required
        error="Select at least one notification."
      >
        <Checkbox label="Deploys" />
        <Checkbox label="Failed jobs" />
      </CheckboxGroup>
    </div>
  ),
};

/**
 * What indeterminate is for: a parent that is neither fully checked nor fully
 * clear. Toggle one child and the parent shows the dash; toggle both and it fills.
 * The parent announces as "mixed" in that middle state.
 */
export const SelectAll: Story = {
  render: () => {
    const [items, setItems] = useState({ deploys: true, jobs: false, digest: false });
    const values = Object.values(items);
    const allChecked = values.every(Boolean);
    const someChecked = values.some(Boolean);

    return (
      <CheckboxGroup label="Notifications" name="select-all">
        <Checkbox
          label="All notifications"
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onChange={(event) => {
            const next = event.target.checked;
            setItems({ deploys: next, jobs: next, digest: next });
          }}
        />
        <div style={{ display: 'grid', gap: 14, marginInlineStart: 34 }}>
          <Checkbox
            label="Deploys"
            checked={items.deploys}
            onChange={(event) => setItems((prev) => ({ ...prev, deploys: event.target.checked }))}
          />
          <Checkbox
            label="Failed jobs"
            checked={items.jobs}
            onChange={(event) => setItems((prev) => ({ ...prev, jobs: event.target.checked }))}
          />
          <Checkbox
            label="Weekly digest"
            checked={items.digest}
            onChange={(event) => setItems((prev) => ({ ...prev, digest: event.target.checked }))}
          />
        </div>
      </CheckboxGroup>
    );
  },
};
