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
    variant: { control: 'inline-radio', options: buttonVariants },
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

export const Default: Story = {};

export const SmallMediumLargeButtons: Story = {
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
  render: (args) => (
    <div style={{ display: 'flex', gap: '14px' }}>
      {buttonVariants.map((variant) => (
        <Button {...args} key={variant} variant={variant} label={variant} />
      ))}
    </div>
  ),
};
