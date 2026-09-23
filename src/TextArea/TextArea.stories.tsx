import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ButtonNew } from '../ButtonNew/ButtonNew';
import { sizes, textAreaResizes } from '../types';
import { Body, Headline } from '../Typography';
import { TextArea } from './TextArea';

/**
 * Multi-line field following the OFFSET design system. It draws the same frame as
 * `Input` — 2px ink border, offset shadow carrying the state — and owns the same
 * wiring: a real `<label for>`, helper and error linked through `aria-describedby`,
 * `aria-invalid` on error, ids generated with `useId`.
 *
 * What multi-line changes:
 *
 * - **Prose leading** — the control sets `--lh-md`, because several lines at
 *   `normal` leading are hard to read.
 * - **It grows** — by drag (`resize`), or by itself (`autoResize` + `maxRows`).
 * - **Character count** — visible but `aria-hidden`, so it does not announce a new
 *   number on every keystroke; the limit is described once instead.
 * - **No status icons or clear button** — both want a vertical centre a multi-line
 *   box does not have, and that corner belongs to the resize handle.
 *
 *
 * Import
 * ---
 *
 * `import { TextArea } from '@ioanatu/component-library';`
 *
 * Usage
 * ---
 *
 * ** Simplest example: **
 *
 * `<TextArea label="Notes" />`
 *
 * ** All props example: **
 *
 * `<TextArea label="Notes" size="lg" rows={4} autoResize maxRows={8} showCount maxLength={200} helper="Visible to the whole workspace." required fullWidth />`
 */

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    resize: { control: 'inline-radio', options: textAreaResizes },
    rows: { control: { type: 'number', min: 1, max: 12 } },
    maxRows: { control: { type: 'number', min: 1, max: 12 } },
    autoResize: { control: 'boolean' },
    showCount: { control: 'boolean' },
    maxLength: { control: 'number' },
    helper: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    optional: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    label: 'Notes',
    placeholder: 'Anything the team should know',
    size: 'md',
    rows: 3,
    resize: 'vertical',
    autoResize: false,
    showCount: false,
    required: false,
    optional: false,
    disabled: false,
    readOnly: false,
    hideLabel: false,
    fullWidth: false,
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 420 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Size sets the padding and the type step; height comes from `rows`. */
export const Sizes: Story = {
  argTypes: { size: { control: false, table: { disable: true } } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 18 }}>
      {sizes.map((size) => (
        <TextArea key={size} {...args} size={size} label={`Notes (${size})`} />
      ))}
    </div>
  ),
};

/**
 * The hint stays put while the error shows — it was true before the error and it
 * is still true. Both are linked through `aria-describedby`, and the error sets
 * `aria-invalid` and announces itself.
 */
export const HelperAndError: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 18 }}>
      <TextArea {...args} helper="Visible to everyone in the workspace." />
      <TextArea
        {...args}
        helper="Visible to everyone in the workspace."
        error="Say what changed, not just that something did."
        defaultValue="stuff"
      />
    </div>
  ),
};

/** Marking what is required beats marking everything else. */
export const RequiredAndOptional: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 18 }}>
      <TextArea {...args} label="Why are you migrating?" required />
      <TextArea {...args} label="Anything else" optional />
    </div>
  ),
};

/**
 * Read-only keeps its ink and border, stays in the tab order and can be copied.
 * Disabled is inert, leaves the tab order and drops its shadow.
 */
export const ReadOnlyAndDisabled: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 18 }}>
      <TextArea
        {...args}
        label="Migration summary"
        readOnly
        defaultValue={'Moved 48,210 accounts.\nTwo batches deferred to Sunday.'}
        helper="Generated when the run finished."
      />
      <TextArea {...args} label="Admin notes" disabled defaultValue="Managed by your admin." />
    </div>
  ),
};

/**
 * Type past the third line: the box grows instead of scrolling, and shrinks again
 * when you delete. Past `maxRows` it stops growing and scrolls, so it can never
 * push the rest of the form off the screen.
 *
 * `autoResize` turns the drag handle off — a box that sizes itself would undo
 * your drag on the next keystroke.
 */
export const AutoResize: Story = {
  args: {
    autoResize: true,
    maxRows: 8,
    rows: 2,
    helper: 'Grows to eight lines, then scrolls.',
    defaultValue: 'Start typing and watch the field grow with the content.',
  },
};

/**
 * The count is visible but `aria-hidden`, because announcing a new number on every
 * keystroke drowns out the typing. The limit is instead described once — focus the
 * field with a screen reader on and you hear "Maximum 120 characters".
 *
 * `maxLength` stops input at the limit, so the count turns red only if a longer
 * value arrives programmatically or from a paste the browser truncates.
 */
export const CharacterCount: Story = {
  args: {
    showCount: true,
    maxLength: 120,
    helper: 'Keep it short enough to scan.',
    defaultValue: 'Two batches deferred to Sunday.',
  },
};

export const Success: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 18 }}>
      <TextArea
        {...args}
        label="Why are you migrating?"
        success
        defaultValue="Consolidating three workspaces into one before the audit."
        helper="Looks good."
      />
      <TextArea
        {...args}
        label="Error wins when both are set"
        success
        error="Say what changed, not just that something did."
        defaultValue="stuff"
      />
    </div>
  ),
};

/** The drag handle, and how to take it away. */
export const ResizeBehaviour: Story = {
  argTypes: { resize: { control: false, table: { disable: true } } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 18 }}>
      <TextArea {...args} label="Vertical (default) — drag the corner" resize="vertical" />
      <TextArea {...args} label="Fixed — no handle" resize="none" />
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 640 }}>
        <Story />
      </div>
    ),
  ],
};

const Column = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ display: 'grid', gap: 14, alignContent: 'start', minInlineSize: 320, flex: 1 }}>
    <Headline level={4}>{title}</Headline>
    {children}
  </div>
);

const Note = ({ children }: { children: React.ReactNode }) => (
  <Body level={3} tone="muted">
    {children}
  </Body>
);

const check = (value: string) => (value.trim().length < 10 ? 'Give us at least a sentence.' : '');

/**
 * Events on the left, validation on the right.
 *
 * **Events** logs every handler the field forwards — `onFocus`, `onChange`,
 * `onBlur` — so you can see an uncontrolled field still reports all of them.
 *
 * **On blur** checks when you leave the field, which is the moment the result has
 * to announce itself: a failure gets `role="alert"` and `aria-invalid`, a pass
 * gets the check and a polite "Valid". Typing again clears both rather than
 * leaving a stale verdict on screen.
 *
 * **On submit** waits for the button, the pattern for a form that should not nag
 * mid-typing. `noValidate` keeps the browser bubble away so the component's own
 * message is what shows.
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
    const [blurDone, setBlurDone] = useState(false);

    const [submitValue, setSubmitValue] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitDone, setSubmitDone] = useState(false);

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
        <Column title="Events">
          <Note>Focus it, type, then tab away — every handler is logged.</Note>
          <TextArea
            {...args}
            label="Release notes"
            defaultValue="Moved 48,210 accounts."
            onFocus={() => record('onFocus')}
            onBlur={(event) => record(`onBlur — ${event.target.value.length} chars`)}
            onChange={(event) => record(`onChange — ${event.target.value.length} chars`)}
          />
          <Body level={3} mono tone="muted" style={{ minBlockSize: 120, whiteSpace: 'pre-line' }}>
            {log.length === 0 ? 'No events yet.' : log.map((entry) => `▸ ${entry}`).join('\n')}
          </Body>
        </Column>

        <Column title="Validation">
          <Note>On blur: leave it short and tab away, then fix it and tab away again.</Note>
          <TextArea
            {...args}
            label="Why are you migrating? — validates on blur"
            required
            helper="A sentence is plenty."
            value={blurValue}
            error={blurError || undefined}
            success={blurDone && !blurError}
            onChange={(event) => {
              setBlurValue(event.target.value);
              /* Clear the verdict while it is being corrected; re-checking on
                 every keystroke would nag before the value can be right. */
              setBlurError('');
              setBlurDone(false);
            }}
            onBlur={(event) => {
              setBlurError(check(event.target.value));
              setBlurDone(true);
            }}
          />

          <Note>On submit: the verdict waits for the button.</Note>
          <form
            style={{ display: 'grid', gap: 14 }}
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitError(check(submitValue));
              setSubmitDone(true);
            }}
          >
            <TextArea
              {...args}
              label="Why are you migrating? — validates on submit"
              required
              showCount
              maxLength={200}
              value={submitValue}
              error={submitError || undefined}
              success={submitDone && !submitError}
              onChange={(event) => {
                setSubmitValue(event.target.value);
                setSubmitError('');
                setSubmitDone(false);
              }}
            />
            <ButtonNew type="submit" variant="primary" size="sm">
              Submit
            </ButtonNew>
          </form>
        </Column>
      </div>
    );
  },
};

/**
 * The single-field version of the same thing, kept for the simplest case: blur or
 * submit, one message, no event log beside it.
 */
export const Validation: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const check = (next: string) => (next.trim().length < 10 ? 'Give us at least a sentence.' : '');

    return (
      <form
        style={{ display: 'grid', gap: 16 }}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setError(check(value));
        }}
      >
        <TextArea
          {...args}
          label="Why are you migrating?"
          required
          showCount
          maxLength={200}
          helper="A sentence is plenty."
          value={value}
          error={error || undefined}
          onChange={(event) => {
            setValue(event.target.value);
            setError('');
          }}
          onBlur={(event) => setError(check(event.target.value))}
        />
        <ButtonNew type="submit" variant="primary" size="sm">
          Submit
        </ButtonNew>
      </form>
    );
  },
};
