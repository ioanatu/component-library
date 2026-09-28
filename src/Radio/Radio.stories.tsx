import type { Meta, StoryObj } from '@storybook/react-vite';
import { sizes } from '../types';
import { Radio } from './Radio';

/**
 * Radio following the OFFSET design system: a 2px ink circle that fills with
 * `--accent` and shows a dot when selected.
 *
 * - **A real input, custom paint** — `<input type="radio">` hidden from sight only,
 *   so form submission and the accessibility tree behave natively.
 * - **Arrow keys come free** — radios sharing a `name` are one control to the
 *   browser: arrows move and select, and only the selected one is in the tab order.
 *   That works only while the name is shared, which is why `RadioGroup` always
 *   supplies one.
 * - **Never colour alone** — the dot appears as well as the fill changing.
 * - **Belongs in a group** — `RadioGroup` owns the selected value. A lone radio
 *   cannot be deselected, so use `Checkbox` or `Toggle` for a single on/off choice.
 *
 * The radios below are standalone with their own `name`, which is what lets each
 * one demonstrate a state independently. Real use goes through `RadioGroup`.
 *
 * Import
 * ---
 *
 * `import { Radio } from '@ioanatu/component-library';`
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

const column = { display: 'grid', gap: 18, justifyItems: 'start' } as const;

export const Playground: Story = {};

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

export const States: Story = {
  render: (args) => (
    <div style={column}>
      <Radio {...args} name="s1" label="Unselected" />
      <Radio {...args} name="s2" label="Selected" defaultChecked />
      <Radio {...args} name="s3" label="Disabled, unselected" disabled />
      <Radio {...args} name="s4" label="Disabled, selected" disabled defaultChecked />
      <Radio {...args} name="s5" label="Invalid" error="Pick a delivery schedule." />
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
