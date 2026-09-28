import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ButtonNew } from '../ButtonNew/ButtonNew';
import { sizes } from '../types';
import { Body } from '../Typography';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

/**
 * Radio following the OFFSET design system: a 2px ink circle that fills with
 * `--accent` and shows a dot when selected.
 *
 * - **Native input, custom paint** — a real `<input type="radio">` is hidden from
 *   sight only, so form submission and the accessibility tree work natively. The
 *   label wraps it, making the whole row a hit target.
 * - **Arrow keys come free** — radios sharing a `name` are one control to the
 *   browser: Tab reaches the group once, then arrows move *and* select. That works
 *   only while the name is shared, which is why `RadioGroup` always supplies one,
 *   generating it when you don't.
 * - **The group owns the value** — each `Radio` only declares its own. `null` means
 *   controlled with nothing selected; omit `value` entirely for uncontrolled.
 * - **Never colour alone** — the dot appears as well as the fill changing.
 * - **Described, not guessed** — `helper` and `error` are linked through
 *   `aria-describedby`. Invalidity is announced on the group, since the radio role
 *   does not support `aria-invalid`.
 * - **No `readOnly`** — browsers ignore it on a radio, so the prop is omitted rather
 *   than shipped as a lie. Use `disabled`.
 *
 * A lone radio cannot be deselected: reach for `Checkbox` or `Toggle` for a single
 * on/off choice. The standalone radios below each carry their own `name` so they can
 * demonstrate a state independently; real use goes through `RadioGroup`.
 *
 * Import
 * ---
 *
 * `import { Radio, RadioGroup } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    helper: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
  },
  args: {
    label: 'Weekly digest',
    value: 'weekly',
    size: 'md',
    disabled: false,
    hideLabel: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const column = { display: 'grid', gap: 14, justifyItems: 'start' } as const;
const stack = { display: 'grid', gap: 32 } as const;

const OPTIONS = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly digest' },
];

const options = OPTIONS.map((option) => (
  <Radio key={option.value} value={option.value} label={option.label} />
));

export const States: Story = {
  render: (args) => (
    <div style={column}>
      <Radio {...args} name="s1" label="Unselected" />
      <Radio {...args} name="s2" label="Selected" defaultChecked />
      <Radio {...args} name="s3" label="Disabled" disabled />
      <Radio {...args} name="s4" label="Disabled, selected" disabled defaultChecked />
      <Radio {...args} name="s5" label="Invalid" error="Pick a delivery schedule." />
    </div>
  ),
};

export const Sizes: Story = {
  argTypes: { size: { control: false, table: { disable: true } } },
  render: (args) => (
    <div style={column}>
      {sizes.map((size) => (
        <Radio
          {...args}
          key={size}
          size={size}
          name={`size-${size}`}
          label={`Weekly digest (${size})`}
          defaultChecked
        />
      ))}
    </div>
  ),
};

/** Per-option messages exist, but a radio set fails as one — prefer the group's. */
export const HelperAndError: Story = {
  render: (args) => (
    <div style={column}>
      <Radio {...args} name="h1" label="Weekly digest" helper="Sent on Mondays, before 9am." />
      <Radio
        {...args}
        name="h2"
        label="Real-time alerts"
        helper="One message per event."
        error="Not available on the free plan."
      />
    </div>
  ),
};

/**
 * A `<fieldset>` with a `<legend>`, plus `role="radiogroup"` and `aria-labelledby`
 * so the more precise role keeps the legend as its name. Tab reaches the group
 * once, then arrows move and select — native behaviour, not ours.
 *
 * The first group lets `RadioGroup` generate the shared `name`; the second passes
 * its own. Either way every option inside gets it, which is what makes the arrows
 * work.
 */
export const Group: Story = {
  render: () => (
    <div style={stack}>
      <RadioGroup label="Delivery schedule" defaultValue="daily" helper="Change it any time.">
        {options}
      </RadioGroup>

      <RadioGroup label="Environment" name="env" orientation="horizontal" defaultValue="staging">
        {['Development', 'Staging', 'Production'].map((item) => (
          <Radio key={item} value={item.toLowerCase()} label={item} />
        ))}
      </RadioGroup>
    </div>
  ),
};

/**
 * `disabled` on the group uses the native `<fieldset disabled>`, which cascades to
 * every radio inside — no prop threading. A group-level `error` marks each circle
 * invalid and announces once for the group rather than once per option, and sets
 * `aria-invalid` on the group, where the radiogroup role supports it.
 *
 * One disabled option among live ones is skipped by the arrow keys.
 */
export const GroupStates: Story = {
  render: () => (
    <div style={stack}>
      <RadioGroup label="Disabled group" defaultValue="daily" disabled>
        {options}
      </RadioGroup>

      <RadioGroup
        label="Pick a schedule"
        required
        error="Choose how often you want to hear from us."
      >
        {options}
      </RadioGroup>

      <RadioGroup label="Plan" defaultValue="daily">
        <Radio value="realtime" label="Real-time" />
        <Radio value="daily" label="Daily digest" />
        <Radio value="weekly" label="Weekly digest" disabled helper="Not on the free plan." />
      </RadioGroup>
    </div>
  ),
};

/** Sizes set once on the group and inherited by every radio inside. */
export const GroupSizes: Story = {
  render: () => (
    <div style={stack}>
      {sizes.map((size) => (
        <RadioGroup key={size} size={size} label={size} defaultValue="daily">
          {options}
        </RadioGroup>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('daily');
    return (
      <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
        <RadioGroup label="Delivery schedule" value={value} onChange={setValue}>
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
 * Validation on submit, the honest moment for a radio set: nothing is wrong until
 * the user tries to move on without choosing.
 */
export const ValidationOnSubmit: Story = {
  render: () => {
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
          label="Delivery schedule"
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
