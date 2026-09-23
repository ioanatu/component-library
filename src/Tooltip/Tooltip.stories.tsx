import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ButtonNew } from '../ButtonNew/ButtonNew';
import { sizes, tooltipPlacements, tooltipVariants } from '../types';
import { Body } from '../Typography';
import { Tooltip } from './Tooltip';

/**
 * Tooltip following the OFFSET design system: an inverted ink bubble with the
 * offset shadow, anchored to its trigger.
 *
 * - **Labels only** — a tooltip may never hold an action, a control, or the only
 *   copy of a piece of information. Reach for a Popover instead.
 * - **Two fills** — `dark` inverts against the page, `light` sits on `--surface`.
 *   Both are named for the light theme: because `--ink` and `--page` flip with the
 *   theme, `dark` stays inverted in dark mode rather than turning black-on-black.
 * - **Focus, not hover alone** — keyboard focus shows it immediately; hover waits
 *   out the delay. Click-focus is ignored, so pressing a button doesn't pop one.
 * - **WCAG 1.4.13** — Escape dismisses it, the pointer can move into the bubble
 *   without it closing, and it never hides on a timer.
 * - **Describes the trigger** — linked with `aria-describedby`, so it is read as
 *   the trigger's description rather than its name.
 * - **Three sizes** — density, not just type: each drives padding, arrow, gap and
 *   max width alongside the type step (12 / 14 / 16px).
 * - **Flips** — the preferred side gives way if the bubble would leave the viewport.
 *
 * The trigger is cloned, not wrapped, so it keeps its own handlers and the tooltip
 * adds nothing to the layout. It must be focusable.
 *
 * Import
 * ---
 *
 * `import { Tooltip } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    placement: { control: 'inline-radio', options: tooltipPlacements },
    variant: { control: 'inline-radio', options: tooltipVariants },
    size: { control: 'inline-radio', options: sizes },
    delay: { control: { type: 'number', min: 0, step: 50 } },
    content: { control: 'text' },
    disabled: { control: 'boolean' },
    maxWidth: { control: { type: 'number', min: 120, step: 10 } },
  },
  args: {
    content: 'Drift is the gap between the schema on record and the schema actually deployed.',
    placement: 'top',
    variant: 'dark',
    size: 'md',
    delay: 150,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 60 }}>
      <Tooltip {...args}>
        <ButtonNew variant="secondary">What is drift?</ButtonNew>
      </Tooltip>
    </div>
  ),
};

/**
 * Both held open so the fills can be compared. `dark` is the default and the one
 * the design page uses; `light` is for placing a tooltip over dark or busy
 * artwork, where an inverted bubble would disappear into it.
 */
export const Variants: Story = {
  argTypes: { variant: { control: false, table: { disable: true } } },
  render: (args) => (
    <div style={{ display: 'flex', gap: 40, padding: '90px 60px 60px' }}>
      {tooltipVariants.map((variant) => (
        <Tooltip {...args} key={variant} variant={variant} open content={`The ${variant} fill.`}>
          <ButtonNew variant="secondary">{variant}</ButtonNew>
        </Tooltip>
      ))}
    </div>
  ),
};

/**
 * Held open to compare. The arrow and the gap scale with the bubble, so the point
 * keeps the same clearance from the trigger at every size.
 */
export const Sizes: Story = {
  argTypes: { size: { control: false, table: { disable: true } } },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 40, padding: '110px 60px 60px' }}>
      {sizes.map((size) => (
        <Tooltip {...args} key={size} size={size} open content={`The ${size} size.`}>
          <ButtonNew variant="secondary" size={size}>
            {size}
          </ButtonNew>
        </Tooltip>
      ))}
    </div>
  ),
};

/** The side is a preference: each flips if the bubble would leave the viewport. */
export const Placements: Story = {
  argTypes: { placement: { control: false, table: { disable: true } } },
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, max-content)',
        gap: 70,
        padding: 90,
      }}
    >
      {tooltipPlacements.map((placement) => (
        <Tooltip {...args} key={placement} placement={placement} content={`Placed ${placement}.`}>
          <ButtonNew variant="secondary">{placement}</ButtonNew>
        </Tooltip>
      ))}
    </div>
  ),
};

/**
 * Hover waits out `delay`; keyboard focus never does. Tab to the second trigger
 * to see the difference, then press Escape to dismiss.
 */
export const Delay: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, padding: 60 }}>
      <Tooltip {...args} delay={0} content="No delay.">
        <ButtonNew variant="secondary">Immediate</ButtonNew>
      </Tooltip>
      <Tooltip {...args} delay={600} content="Waited 600ms.">
        <ButtonNew variant="secondary">Slow</ButtonNew>
      </Tooltip>
    </div>
  ),
};

/** Driven from outside, for a walkthrough or a first-run hint. */
export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ display: 'grid', gap: 20, justifyItems: 'start', padding: 60 }}>
        <Tooltip {...args} open={open} onOpenChange={setOpen} content="Pinned open from outside.">
          <ButtonNew variant="secondary">Anchor</ButtonNew>
        </Tooltip>
        <ButtonNew variant="ghost" onClick={() => setOpen((prev) => !prev)}>
          {open ? 'Hide' : 'Show'}
        </ButtonNew>
        <Body level={3} tone="muted">
          Escape dismisses it too — the state stays in sync.
        </Body>
      </div>
    );
  },
};
