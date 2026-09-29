import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Body } from '../Typography';
import { Slider } from './Slider';

/**
 * Slider following the OFFSET design system: a 2px ink track that fills with
 * `--accent`, and a thumb carrying the offset shadow.
 *
 * - **A real `<input type="range">`**, painted rather than rebuilt. Arrows, Home/End,
 *   Page Up/Down, the drag behaviour and the announced value all come from the
 *   browser instead of being reimplemented approximately.
 * - **`formatValue` sets `aria-valuetext`**, so a screen reader says "60%" rather than
 *   "60". The visible pill is `aria-hidden`, since the input already announces it.
 * - **Hover shows the wash ring** on the thumb, the same signal Checkbox and Radio use.
 * - **The fill is a gradient** driven by a custom property: only Firefox implements
 *   `::-moz-range-progress`, so a gradient is the one portable way to colour the
 *   filled half.
 *
 * Import
 * ---
 *
 * `import { Slider } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    showValue: { control: 'boolean' },
    disabled: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    helper: { control: 'text' },
    error: { control: 'text' },
    formatValue: { control: false },
  },
  args: {
    label: 'Storage limit',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 60,
    showValue: true,
    disabled: false,
    hideLabel: false,
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Slider {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** `formatValue` drives both the pill and what a screen reader announces. */
export const Formatted: Story = {
  args: {
    label: 'Storage limit',
    formatValue: (value) => `${value}%`,
  },
};

export const WithHelper: Story = {
  args: {
    helper: 'Applies to every project in this workspace.',
    formatValue: (value) => `${value} GB`,
    max: 500,
    step: 10,
    defaultValue: 250,
  },
};

export const Invalid: Story = {
  args: {
    defaultValue: 95,
    formatValue: (value) => `${value}%`,
    error: 'Above your plan’s 80% soft limit.',
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 40, formatValue: (value) => `${value}%` },
};

/** A coarse step, so the thumb snaps. Keyboard steps by the same amount. */
export const Stepped: Story = {
  args: { label: 'Quality', min: 1, max: 5, step: 1, defaultValue: 3, showValue: true },
};

export const WithoutValue: Story = {
  args: { showValue: false },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(30);
    return (
      <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <Slider {...args} value={value} onChange={setValue} formatValue={(v) => `${v}%`} />
        <Body level={3} tone="muted">
          {value < 50 ? 'Plenty of room.' : 'Getting close to the limit.'}
        </Body>
      </div>
    );
  },
};
