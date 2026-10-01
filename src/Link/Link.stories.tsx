import type { Meta, StoryObj } from '@storybook/react-vite';
import { Body } from '../Typography';
import { Link } from './Link';

/**
 * Inline link following the OFFSET design system: ink text on an accent underline
 * that thickens on hover.
 *
 * - **Always underlined**, so a link is told apart from text by shape, not colour alone.
 * - **`external`** opens a new tab and says so to assistive tech.
 *
 * Import
 * ---
 *
 * `import { Link } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  args: { href: '#', children: 'privacy notice', external: false },
  render: (args) => (
    <Body level={2}>
      Read our <Link {...args} /> before you continue.
    </Body>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const External: Story = {
  args: { href: 'https://www.w3.org/WAI/WCAG22/quickref/', children: 'WCAG 2.2', external: true },
};
