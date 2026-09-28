import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ButtonNew } from '../ButtonNew/ButtonNew';
import { orientations, sizes } from '../types';
import { Body } from '../Typography';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

/**
 * Groups radios into the single control they actually are.
 *
 * - **A fieldset with a legend** — which is what makes a screen reader announce the
 *   group's name alongside each option. `role="radiogroup"` names it a radio group
 *   rather than a plain one, and `aria-labelledby` points at the legend so the name
 *   survives the role change.
 * - **The group owns the value** — each `Radio` only declares its own. Controlled
 *   with `value`, uncontrolled with `defaultValue`.
 * - **It supplies the shared name**, generating one when none is given: arrow keys
 *   rove between radios only while they share a name.
 * - **Keyboard** — Tab reaches the group once, then arrows move *and* select. Only
 *   the selected radio is in the tab order, which is native behaviour, not ours.
 * - **Errors belong here**, not on one option: a radio set fails as one.
 * - **`disabled` cascades** through the native fieldset attribute.
 *
 * Import
 * ---
 *
 * `import { RadioGroup, Radio } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'inline-radio', options: orientations },
    size: { control: 'inline-radio', options: sizes },
    helper: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
  },
  args: {
    label: 'Delivery schedule',
    orientation: 'vertical',
    size: 'md',
    disabled: false,
    required: false,
    hideLabel: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const OPTIONS = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly digest' },
];

const options = (
  <>
    {OPTIONS.map((option) => (
      <Radio key={option.value} value={option.value} label={option.label} />
    ))}
  </>
);

export const Playground: Story = {
  args: { defaultValue: 'daily' },
  render: (args) => <RadioGroup {...args}>{options}</RadioGroup>,
};

export const Orientation: Story = {
  argTypes: { orientation: { control: false, table: { disable: true } } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 32 }}>
      {orientations.map((orientation) => (
        <RadioGroup
          {...args}
          key={orientation}
          orientation={orientation}
          label={orientation}
          defaultValue="daily"
        >
          {options}
        </RadioGroup>
      ))}
    </div>
  ),
};

/** Set once on the group and inherited by every radio inside. */
export const Sizes: Story = {
  argTypes: { size: { control: false, table: { disable: true } } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 32 }}>
      {sizes.map((size) => (
        <RadioGroup {...args} key={size} size={size} label={size} defaultValue="daily">
          {options}
        </RadioGroup>
      ))}
    </div>
  ),
};

/** The hint stays while the error shows; both are linked to the group. */
export const HelperAndError: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 32 }}>
      <RadioGroup {...args} helper="Change this at any time in settings." defaultValue="daily">
        {options}
      </RadioGroup>
      <RadioGroup
        {...args}
        required
        helper="Change this at any time in settings."
        error="Choose how often you want to hear from us."
      >
        {options}
      </RadioGroup>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'daily' },
  render: (args) => <RadioGroup {...args}>{options}</RadioGroup>,
};

/** One disabled option among live ones. Arrow keys skip it. */
export const OneOptionDisabled: Story = {
  args: { defaultValue: 'daily' },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="realtime" label="Real-time" />
      <Radio value="daily" label="Daily digest" />
      <Radio value="weekly" label="Weekly digest" disabled helper="Not on the free plan." />
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('daily');
    return (
      <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
        <RadioGroup {...args} value={value} onChange={setValue}>
          {options}
        </RadioGroup>
        <Body level={3} tone="muted">
          Selected: {value}
        </Body>
        <ButtonNew variant="ghost" size="sm" onClick={() => setValue('realtime')}>
          Reset to real-time
        </ButtonNew>
      </div>
    );
  },
};

/**
 * Validation on submit, which is the honest moment for a radio set: nothing is
 * wrong until the user tries to move on without choosing.
 */
export const ValidationOnSubmit: Story = {
  render: (args) => {
    /* null, not undefined: controlled from the start with nothing selected. */
    const [value, setValue] = useState<string | null>(null);
    const [error, setError] = useState<string>();

    return (
      <form
        noValidate
        style={{ display: 'grid', gap: 20, justifyItems: 'start' }}
        onSubmit={(event) => {
          event.preventDefault();
          setError(value ? undefined : 'Choose how often you want to hear from us.');
        }}
      >
        <RadioGroup
          {...args}
          required
          value={value}
          error={error}
          onChange={(next) => {
            setValue(next);
            setError(undefined);
          }}
        >
          {options}
        </RadioGroup>
        <ButtonNew type="submit">Save preferences</ButtonNew>
      </form>
    );
  },
};
