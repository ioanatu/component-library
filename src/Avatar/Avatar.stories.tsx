import type { Meta, StoryObj } from '@storybook/react-vite';
import { avatarTones, sizes } from '../types';
import { Body } from '../Typography';
import { Avatar } from './Avatar';
import { AvatarGroup } from './AvatarGroup';

/**
 * Avatar following the OFFSET design system: a round badge on the ink border,
 * showing a photo or, failing that, initials.
 *
 * - **One accessible name** — the badge is a single `role="img"` labelled with `name`,
 *   so a screen reader hears "m.reyes", not "M R".
 * - **`decorative`** hides it when the name is already written beside it, so the name
 *   is not read twice.
 * - **A broken photo falls back to initials** instead of a broken-image icon.
 * - **`AvatarGroup`** is a labelled `role="group"`; the `+N` badge is read as "N more".
 *
 * Import
 * ---
 *
 * `import { Avatar, AvatarGroup } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'inline-radio', options: avatarTones },
    size: { control: 'inline-radio', options: sizes },
    decorative: { control: 'boolean' },
  },
  args: { name: 'm.reyes', tone: 'sunken', size: 'md' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {sizes.map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {avatarTones.map((tone) => (
        <Avatar key={tone} {...args} tone={tone} />
      ))}
    </div>
  ),
};

/** The URL does not resolve, so the initials show instead. */
export const BrokenImage: Story = {
  args: { src: 'https://example.invalid/avatar.png' },
};

/** The name is written beside it, so the avatar is hidden from screen readers. */
export const Decorative: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Avatar {...args} decorative />
      <Body as="span" level={3} weight="medium">
        {args.name}
      </Body>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup label="Reviewers" total={12}>
      <Avatar name="ioana.t" tone="surface" />
      <Avatar name="m.reyes" tone="surface" />
      <Avatar name="k.bauer" tone="surface" />
    </AvatarGroup>
  ),
};
