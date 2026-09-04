import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { buttonSizes, buttonVariants } from '../types';
import { Button } from './Button';

/**
 *
 * CTA button with primary, secondary and danger variants.
 *
 * It displays a spinner and suppresses onClick if the loading prop is passed as true.
 *
 *
 * Import
 * ---
 *
 * `import { Button } from '@ioanatu/component-library';`
 *
 * Usage
 * ---
 *
 * ** Simplest example: **
 *
 * `<Button type="button" label="Click me" onClick={onClick} />`
 *
 *
 * ** All props example: **
 *
 * `<Button variant="secondary" size="lg" type="submit" label="Click me" onClick={onClick} disabled loading />`
 *
 */

const meta: Meta<typeof Button> = {
  title: 'Molecules/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: buttonSizes },
    href: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    label: 'Click here',
    onClick: fn(),
    size: 'md',
    variant: 'primary',
    disabled: false,
    loading: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SmallMediumLargeButtons: Story = {
  argTypes: {
    variant: { control: 'inline-radio', options: buttonVariants },
  },
  render: (args) => (
    <div style={{ margin: 'auto' }}>
      <Button {...args} size="sm" />
      <div style={{ margin: '14px 0' }}>
        <Button {...args} size="md" />
      </div>
      <Button {...args} size="lg" />
    </div>
  ),
};

export const Variants: Story = {
  argTypes: {
    variant: { control: false, table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
      {buttonVariants.map((variant) => (
        <Button {...args} key={variant} variant={variant} label={variant} />
      ))}
    </div>
  ),
};

/**
 * Passing `href` renders an anchor that navigates, keeping the same styling.
 * A disabled or loading link drops its `href` so it cannot be followed or tabbed to.
 */
export const AsLink: Story = {
  args: {
    href: '#start',
    variant: 'accent',
    label: 'Get started',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
      <Button {...args} />
      <Button {...args} variant="primary" label="Docs" />
      <Button {...args} variant="primary" label="Disabled link" disabled />
    </div>
  ),
};
