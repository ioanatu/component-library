import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Chip } from '../Chip/Chip';
import { cardElevations, sizes } from '../types';
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
 * `<Card elevation="flat" padding="lg" title="Token-driven" icon={<Mark />} action={<Chip label="ready" />} href="/tokens" onClick={onClick}>Every value is a CSS custom property.</Card>`
 *
 */

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    elevation: { control: 'inline-radio', options: cardElevations },
    padding: { control: 'inline-radio', options: sizes },
    href: { control: 'text' },
    icon: { control: false },
    action: { control: false },
  },
  args: {
    elevation: 'md',
    padding: 'md',
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

const PADDING_PX = { sm: 16, md: 20, lg: 24 } as const;

/**
 * `flat` drops the shadow; the other three are the same distances as ButtonNew —
 * 2, 4 and 8px. The offset never blurs and never uses alpha, so the distance is
 * the whole of the elevation, and hover and press both scale with it.
 *
 * Reach for `flat` where cards stack densely, or nest inside another bordered
 * surface, and the shadows would pile up.
 */
export const Elevations: Story = {
  argTypes: { elevation: { control: false, table: { disable: true } } },
  render: (args) => (
    <div style={grid}>
      {cardElevations.map((elevation) => (
        <Card {...args} key={elevation} elevation={elevation} title={`Elevation ${elevation}`}>
          The offset travels down-right at 45°, and never blurs.
        </Card>
      ))}
    </div>
  ),
};

/** Inner spacing: 16, 20 or 24px. The border, radius and shadow do not change. */
export const Paddings: Story = {
  argTypes: { padding: { control: false, table: { disable: true } } },
  render: (args) => (
    <div style={grid}>
      {sizes.map((padding) => (
        <Card {...args} key={padding} padding={padding} title={`Padding ${padding}`}>
          {PADDING_PX[padding]}px on every side.
        </Card>
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
      <Card {...args} elevation="flat" icon="→" title="Read the tokens">
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
