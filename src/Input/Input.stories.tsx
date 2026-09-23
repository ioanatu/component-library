import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Body, Headline } from '../Typography';
import { ButtonNew } from '../ButtonNew/ButtonNew';
import { inputTypes, sizes } from '../types';
import { Input } from './Input';

const SearchIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
);

const Column = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ display: 'grid', gap: 14, alignContent: 'start', minInlineSize: 300, flex: 1 }}>
    <Headline level={4}>{title}</Headline>
    {children}
  </div>
);

const Note = ({ children }: { children: React.ReactNode }) => (
  <Body level={3} tone="muted">
    {children}
  </Body>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
    {children}
  </div>
);

/**
 * Text field following the OFFSET design system: a 2px ink border and the
 * system's offset shadow, which carries the state — `--border-subtle` at rest,
 * `--accent` on focus, `--danger` when invalid.
 *
 * The component owns the wiring that is easy to get wrong:
 *
 * - **Real label** — `label` is required by the type. `hideLabel` hides it visually
 *   while keeping it in the accessibility tree.
 * - **Described, not guessed** — `helper` and `error` are linked through
 *   `aria-describedby`, and an `aria-describedby` you pass is merged, not replaced.
 * - **Invalid is announced** — `error` sets `aria-invalid` and is read out when it
 *   appears, pairing its colour with an icon so the state survives greyscale.
 * - **Busy is announced** — `loading` sets `aria-busy` and speaks politely.
 * - **Controlled or uncontrolled** — pass `value` and it follows you; leave it out
 *   and it keeps its own, so `clearable` works with no state of yours behind it.
 * - **Read-only ≠ disabled** — read-only stays focusable and copyable; disabled is
 *   inert and leaves the tab order.
 *
 *
 * Import
 * ---
 *
 * `import { Input } from '@ioanatu/component-library';`
 *
 * Usage
 * ---
 *
 * ** Simplest example: **
 *
 * `<Input label="Project name" />`
 *
 * ** All props example: **
 *
 * `<Input label="Postcode" size="lg" type="text" helper="Five digits." error="Postcode is not correct" loading success clearable required leading={<Icon />} trailing="kWh" fullWidth />`
 */

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    type: { control: 'select', options: inputTypes },
    helper: { control: 'text' },
    error: { control: 'text' },
    loading: { control: 'boolean' },
    success: { control: 'boolean' },
    clearable: { control: 'boolean' },
    required: { control: 'boolean' },
    optional: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    leading: { control: false },
    trailing: { control: false },
  },
  args: {
    label: 'Your postcode',
    placeholder: '12345',
    size: 'md',
    type: 'text',
    loading: false,
    success: false,
    clearable: false,
    required: false,
    optional: false,
    disabled: false,
    readOnly: false,
    hideLabel: false,
    fullWidth: false,
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 340 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every prop on the left, every state on the right.
 *
 * Note what the states do to assistive tech, not just to pixels: `loading` sets
 * `aria-busy` and speaks, `success` speaks rather than relying on a green tick,
 * `error` sets `aria-invalid` and interrupts, and `disabled` leaves the tab order
 * while `readOnly` stays in it.
 */
export const InputPropsAndStates: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ padding: 24 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Row>
      <Column title="Props">
        <Note>Default: type text with a label.</Note>
        <Input {...args} />

        <Note>With helper text under the control.</Note>
        <Input {...args} helper="Five digits, no spaces." />

        <Note>With a trailing unit after the value.</Note>
        <Input {...args} label="Yearly consumption" type="number" trailing="kWh" />

        <Note>With maxLength as a length restriction.</Note>
        <Input {...args} maxLength={5} helper="Stops accepting input at five characters." />

        <Note>Type number, with a numeric keypad on touch.</Note>
        <Input {...args} type="number" inputMode="numeric" />

        <Note>Prefilled, and clearable — the X empties it and hands focus back.</Note>
        <Input {...args} defaultValue="1234" clearable />

        <Note>Autocomplete: lets the browser fill a known email.</Note>
        <Input {...args} label="Your email address" type="email" autoComplete="email" />

        <Note>Required, marked on the label with a glyph rather than colour.</Note>
        <Input {...args} required />

        <Note>Optional, spelled out — clearer than marking everything else.</Note>
        <Input {...args} label="Internal code" optional />

        <Note>Label hidden on screen but still announced.</Note>
        <Input {...args} label="Search batches" hideLabel type="search" leading={<SearchIcon />} />
      </Column>

      <Column title="States">
        <Note>Disabled: inert, and out of the tab order.</Note>
        <Input {...args} disabled />

        <Note>Disabled with a value: no clear button, since nothing may change.</Note>
        <Input {...args} disabled defaultValue="12345" clearable />

        <Note>Read-only: cannot be edited, but takes focus and can be copied.</Note>
        <Input {...args} readOnly defaultValue="12345" trailing="kWh" clearable />

        <Note>Loading: spinner, `aria-busy`, and a polite announcement.</Note>
        <Input {...args} loading />

        <Note>Loading with read-only, to stop edits while the value is fetched.</Note>
        <Input {...args} loading readOnly defaultValue="123" trailing="kWh" />

        <Note>Success: needs a value to sit beside — a tick on an empty field says nothing.</Note>
        <Input {...args} success defaultValue="12345" trailing="kWh" />

        <Note>Error, with a message long enough to wrap.</Note>
        <Input
          {...args}
          defaultValue=""
          error="Postcode is not correct. Enter five digits with no spaces or letters."
        />

        <Note>Error alongside helper text: the hint stays, because it is still true.</Note>
        <Input {...args} helper="Five digits, no spaces." error="Postcode cannot be empty" />

        <Note>Focus ring: tab into any field above to see the frame light up.</Note>
      </Column>
    </Row>
  ),
};

/** md clears the 44px touch target. sm is for dense toolbars, not for forms. */
export const Sizes: Story = {
  argTypes: { size: { control: false, table: { disable: true } } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 18 }}>
      {sizes.map((size) => (
        <Input key={size} {...args} size={size} label={`Your postcode (${size})`} clearable />
      ))}
    </div>
  ),
};

/**
 * No `value`, no `onChange`, no state at the call site — the field keeps its own.
 * Type into it, then clear it with the X: both work, and a controlled caller would
 * still receive `onChange` for each.
 */
export const Uncontrolled: Story = {
  args: {
    label: 'Uncontrolled field',
    defaultValue: 'Start typing to see the value change',
    clearable: true,
  },
};

/**
 * The X appears only when there is something to clear, and never when the field is
 * disabled or read-only. It is a real button: reachable by Tab, named for screen
 * readers, and `type="button"` so it cannot submit the form around it. Clearing
 * moves focus back to the input, because the button itself disappears.
 */
export const Clearable: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 18 }}>
      <Input {...args} label="Uncontrolled, prefilled" defaultValue="12345" clearable />
      <Input {...args} label="Empty — nothing to clear yet" clearable />
      <Input {...args} label="Disabled with a value" defaultValue="12345" clearable disabled />
    </div>
  ),
};

/**
 * The three icons that live inside the frame. Loading outranks the others: while
 * work is running, whether the last value passed or failed is not yet the point.
 */
export const StatusIcons: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 18 }}>
      <Input {...args} label="Loading" loading defaultValue="12345" />
      <Input {...args} label="Success" success defaultValue="12345" helper="Postcode found." />
      <Input {...args} label="Error" error="Postcode is not correct" defaultValue="12" />
      <Input
        {...args}
        label="Loading wins over error"
        loading
        error="Postcode is not correct"
        defaultValue="12"
      />
    </div>
  ),
};

/**
 * `leading` is hidden from assistive tech, so it may only repeat what the label
 * already says. `trailing` is left exposed, so it can hold a unit or a real control.
 */
export const Adornments: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 18 }}>
      <Input {...args} label="Search batches" leading={<SearchIcon />} placeholder="Search" />
      <Input {...args} label="Storage limit" type="number" defaultValue={82} trailing="%" />
      <Input {...args} label="Cost estimate" type="number" defaultValue={240} trailing="€" />
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true, label: 'Notes', placeholder: 'Anything the team should know' },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 520 }}>
        <Story />
      </div>
    ),
  ],
};

const validate = (value: string) => {
  if (value.trim() === '') return 'Postcode cannot be empty';
  if (value.length < 5 || !/^\d*$/.test(value)) return 'Postcode is not correct';
  return '';
};

/**
 * Events on the left, validation on the right.
 *
 * **Events** log every handler the field forwards — `onFocus`, `onChange`, `onBlur`
 * and `onClear` — so you can see that an uncontrolled field still reports
 * everything, including a clear.
 *
 * **Validation on blur** checks when you leave the field, which is the moment the
 * error has to announce itself: `role="alert"` reads it out and `aria-invalid` goes
 * on the control. Typing again clears the error rather than leaving it stale.
 *
 * **Validation on click** waits for the button, the pattern for a form that should
 * not nag mid-typing. The form is `noValidate` so the component's own message shows
 * instead of the browser bubble.
 */
export const EventsAndValidation: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ padding: 24 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => {
    const [log, setLog] = useState<string[]>([]);
    const record = (entry: string) => setLog((entries) => [entry, ...entries].slice(0, 6));

    const [blurValue, setBlurValue] = useState('');
    const [blurError, setBlurError] = useState('');

    const [clickValue, setClickValue] = useState('');
    const [clickError, setClickError] = useState('');

    return (
      <Row>
        <Column title="Events">
          <Note>Focus it, type, clear it, then tab away — every handler is logged.</Note>
          <Input
            {...args}
            label="First name"
            defaultValue="Ada"
            clearable
            onFocus={() => record('onFocus')}
            onBlur={(event) => record(`onBlur — "${event.target.value}"`)}
            onChange={(event) => record(`onChange — "${event.target.value}"`)}
            onClear={() => record('onClear')}
          />
          <Body level={3} mono tone="muted" style={{ minBlockSize: 120 }}>
            {log.length === 0 ? 'No events yet.' : log.map((entry) => `▸ ${entry}`).join('\n')}
          </Body>
        </Column>

        <Column title="Validation">
          <Note>On blur: leave the field empty and tab away.</Note>
          <Input
            {...args}
            label="Postcode — validates on blur"
            helper="Five digits, no spaces."
            value={blurValue}
            error={blurError || undefined}
            maxLength={5}
            onChange={(event) => {
              setBlurValue(event.target.value);
              /* Clear the error while it is being corrected; re-checking on every
                 keystroke would nag before the value can possibly be right. */
              setBlurError('');
            }}
            onBlur={(event) => setBlurError(validate(event.target.value))}
            clearable
            onClear={() => setBlurError('')}
          />

          <Note>On click: the error waits for the button.</Note>
          <form
            style={{ display: 'grid', gap: 14 }}
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              setClickError(validate(clickValue));
            }}
          >
            <Input
              {...args}
              label="Postcode — validates on submit"
              value={clickValue}
              error={clickError || undefined}
              maxLength={5}
              onChange={(event) => {
                setClickValue(event.target.value);
                setClickError('');
              }}
              clearable
              onClear={() => setClickError('')}
            />
            <ButtonNew type="submit" variant="primary" size="sm">
              Validate
            </ButtonNew>
          </form>
        </Column>
      </Row>
    );
  },
};
