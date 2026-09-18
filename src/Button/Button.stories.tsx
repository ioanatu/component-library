import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import { fn } from 'storybook/test';
import { buttonVariants, sizes } from '../types';
import type { ButtonElementProps, ButtonProps } from './Button';
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
 * `<Button type="button" onClick={onClick}>Click me</Button>`
 *
 *
 * ** All props example: **
 *
 * `<Button variant="secondary" size="lg" type="submit" onClick={onClick} disabled loading>Click me</Button>`
 *
 */

/**
 * Storybook renders one flat control table, so the union is widened for stories:
 * href sits alongside the button props and each render casts back to ButtonProps.
 */
type ButtonStoryArgs = Omit<ButtonElementProps, 'href'> & { href?: string };

const meta: Meta<ButtonStoryArgs> = {
  title: 'Molecules/Button',
  component: Button as ComponentType<ButtonStoryArgs>,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    href: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    children: 'Click here',
    onClick: fn(),
    size: 'md',
    variant: 'primary',
    disabled: false,
    loading: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonSizes: Story = {
  argTypes: {
    variant: { control: 'inline-radio', options: buttonVariants },
  },
  render: (args) => (
    <div style={{ margin: 'auto' }}>
      <Button {...(args as ButtonProps)} size="sm" />
      <div style={{ margin: '14px 0' }}>
        <Button {...(args as ButtonProps)} size="md" />
      </div>
      <Button {...(args as ButtonProps)} size="lg" />
    </div>
  ),
};

export const ButtonVariants: Story = {
  argTypes: {
    variant: { control: false, table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
      {buttonVariants.map((variant) => (
        <Button {...(args as ButtonProps)} key={variant} variant={variant}>
          {variant}
        </Button>
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
    children: 'Get started',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
      <Button {...(args as ButtonProps)} />
      <Button {...(args as ButtonProps)} variant="primary">
        Docs
      </Button>
      <Button {...(args as ButtonProps)} variant="primary" disabled>
        Disabled link
      </Button>
    </div>
  ),
};
