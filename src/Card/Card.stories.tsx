import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Chip } from '../Chip/Chip';
import { cardVariants } from '../types';
import { Card } from './Card';

/**
 *
 * Bordered surface for a titled block of content — the card the docs page is
 * built from, promoted to a component.
 *
 * It is a plain container unless `href` is set, which turns the whole surface into
 * one link. There is no click-handler-only mode: a `div` that responds to clicks
 * cannot be reached by keyboard, and wrapping the card in a `button` would swallow
 * anything interactive inside it. A card that needs a control holds that control
 * in `action` or in its children.
 *
 *
 * Import
 * ---
 *
 * `import { Card } from '@ioanatu/component-library';`
 *
 * Usage
 * ---
 *
 * ** Simplest example: **
 *
 * `<Card title="Token-driven">Every value is a CSS custom property.</Card>`
 *
 *
 * ** All props example: **
 *
 * `<Card variant="flat" title="Token-driven" titleLevel={2} icon={<Mark />} action={<Chip label="ready" />} href="/tokens" onClick={onClick}>Every value is a CSS custom property.</Card>`
 *
 */

const meta: Meta<typeof Card> = {
  title: 'Molecules/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: cardVariants },
    titleLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6] },
    href: { control: 'text' },
    icon: { control: false },
    action: { control: false },
  },
  args: {
    variant: 'shadow',
    title: 'Token-driven',
    children:
      'Every value — color, spacing, radius, elevation, type — is a CSS custom property. Restyle the whole system by editing the token layer, not the components.',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const grid = {
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  maxWidth: 760,
} as const;

/**
 * `variant` decides whether the card carries the offset shadow. Use `flat` where
 * cards are already stacked densely, or nested inside another bordered surface,
 * and the shadows would pile up.
 */
export const Variants: Story = {
  argTypes: {
    variant: { control: false, table: { disable: true } },
  },
  render: (args) => (
    <div style={grid}>
      {cardVariants.map((variant) => (
        <Card {...args} key={variant} variant={variant} title={variant} />
      ))}
    </div>
  ),
};

/**
 * `icon` renders a decorative mark in a bordered square above the title. It is
 * hidden from assistive technology, since the title already names the card.
 */
export const WithIcon: Story = {
  render: (args) => (
    <div style={grid}>
      <Card {...args} icon="◆" title="Token-driven" />
      <Card {...args} icon="⌨" title="Accessible by default">
        Correct ARIA roles, full keyboard operation, managed focus and visible focus rings ship with
        every component.
      </Card>
    </div>
  ),
};

/**
 * `action` sits at the trailing edge of the title row. It keeps its own size, so a
 * long title wraps beneath it rather than pushing it out of the card.
 */
export const WithAction: Story = {
  render: (args) => (
    <div style={grid}>
      <Card {...args} title="Button" action={<Chip label="a11y" variant="success" size="sm" />}>
        Primary, accent and ghost variants with the signature press interaction.
      </Card>
      <Card
        {...args}
        title="A title long enough to wrap beneath its own action chip"
        action={<Chip label="draft" variant="warning" size="sm" />}
      >
        The action never shrinks and never leaves the row.
      </Card>
    </div>
  ),
};

/**
 * `href` turns the whole surface into one link, which lifts on hover and presses
 * in on click like every other surface in the system. A flat card has no shadow to
 * grow, so it shades its surface instead.
 *
 * Only reach for this on a card with no other interactive content — a link inside
 * a link cannot be operated.
 */
export const AsLink: Story = {
  args: {
    href: '#card',
    onClick: fn(),
  },
  render: (args) => (
    <div style={grid}>
      <Card {...args} icon="→" title="Get started">
        Install the package and import the components.
      </Card>
      <Card {...args} variant="flat" icon="→" title="Read the tokens">
        Every colour, radius and shadow in one file.
      </Card>
    </div>
  ),
};

export const ContentOnly: Story = {
  args: {
    title: undefined,
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Card {...args}>A bordered surface with nothing but its content.</Card>
    </div>
  ),
};
