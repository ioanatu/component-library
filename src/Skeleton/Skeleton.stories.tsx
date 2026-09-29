import type { Meta, StoryObj } from '@storybook/react-vite';
import { Body } from '../Typography';
import { Skeleton } from './Skeleton';

/**
 * Skeleton following the OFFSET design system: a sunken bar on a hairline border,
 * pulsing while the real content loads.
 *
 * - **Placeholders are not information** — the bars are `aria-hidden`, so a screen
 *   reader is not read a pile of empty boxes.
 * - **`label` announces the wait** — the wrapper becomes a polite `role="status"` with
 *   `aria-busy`. Set it on one skeleton per loading region, not on every bar.
 * - **The pulse stops under `prefers-reduced-motion`**, which is precisely what that
 *   setting is asking for; the bars settle at a steady opacity instead.
 * - **Mirror the real layout's shape** so the page does not jump when content lands.
 *
 * Import
 * ---
 *
 * `import { Skeleton } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    circle: { control: 'boolean' },
    lines: { control: { type: 'number', min: 1, max: 8 } },
    gap: { control: 'number' },
    radius: { control: 'text' },
    label: { control: 'text' },
  },
  args: { width: '100%', height: 14, lines: 1, gap: 10, circle: false },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Skeleton {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** `lines` stacks bars and shortens the last one, the way a paragraph ends. */
export const TextBlock: Story = {
  args: { lines: 3, label: 'Loading…' },
};

export const Block: Story = {
  args: { height: 70, label: 'Loading…' },
};

export const Circle: Story = {
  args: { circle: true, height: 44 },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Skeleton {...args} />
      <div style={{ flex: 1 }}>
        <Skeleton lines={2} />
      </div>
    </div>
  ),
};

/** What it is for: the same shape as the thing that is coming. */
export const MirrorsTheLayout: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 14, maxWidth: 360 }}>
      <Skeleton width="45%" height={18} label="Loading project" />
      <Skeleton lines={3} />
      <Skeleton height={70} />
      <Body level={3} tone="muted">
        One label per region, so the wait is announced once.
      </Body>
    </div>
  ),
};
