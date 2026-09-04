import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { chipVariants, libSizes } from '../types';
import { Chip } from './Chip';

/**
 *
 * Chips are compact elements that represent an input, an attribute or an action.
 *
 * They let someone enter information, make a selection, filter a list or trigger an
 * action, and normally sit inside a form, a toolbar or a results header rather than
 * standing on their own.
 *
 * A chip renders the lightest element its props allow: a `span` while it is only a
 * label, a `button` once `onClick` is set, an anchor once `href` is set.
 *
 *
 * Import
 * ---
 *
 * `import { Chip } from '@ioanatu/component-library';`
 *
 * Usage
 * ---
 *
 * ** Simplest example: **
 *
 * `<Chip label="React 19" />`
 *
 *
 * ** All props example: **
 *
 * `<Chip variant="accent" size="sm" label="Design" icon={<StarIcon />} href="/tags/design" onClick={onClick} onDelete={onDelete} deleteLabel="Remove design tag" disabled />`
 *
 */

const meta: Meta<typeof Chip> = {
  title: 'Molecules/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: chipVariants },
    size: { control: 'inline-radio', options: libSizes },
    href: { control: 'text' },
    disabled: { control: 'boolean' },
    icon: { control: false },
    avatar: { control: false },
    deleteIcon: { control: false },
  },
  args: {
    label: 'React 19',
    size: 'md',
    variant: 'primary',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' } as const;

const TagIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M2 2h5.6l6.4 6.4-5.6 5.6L2 7.6V2Zm2.6 2.6a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M6.2 12.4 2 8.2l1.5-1.5 2.7 2.7 6.3-6.3L14 4.6l-7.8 7.8Z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style={{ width: 12, height: 12 }}>
    <path d="M6 2h4v1h3v1.5H3V3h3V2ZM4 6h8l-.6 8H4.6L4 6Z" />
  </svg>
);

/**
 * `variant` carries both the fill and the intent, so there is no separate `color`
 * prop to pair it with. The five match the Button variants: `primary` and
 * `secondary` are neutral, `danger` and `success` colour the border and text, and
 * `accent` fills the chip.
 */
export const ChipVariants: Story = {
  argTypes: {
    variant: { control: false, table: { disable: true } },
  },
  render: (args) => (
    <div style={row}>
      {chipVariants.map((variant) => (
        <Chip {...args} key={variant} variant={variant} label={variant} />
      ))}
    </div>
  ),
};

/**
 * `size` offers a small chip alongside the default medium one. `md` matches the
 * height of the badges in the docs; `sm` is for dense rows and table cells.
 */
export const ChipSizes: Story = {
  argTypes: {
    size: { control: false, table: { disable: true } },
  },
  render: (args) => (
    <div style={row}>
      {libSizes.map((size) => (
        <Chip {...args} key={size} size={size} label={size} />
      ))}
    </div>
  ),
};

/**
 * Chips can carry actions. A chip with `onClick` becomes a button that lifts on
 * hover and presses in on click; a chip with `onDelete` grows a remove button that
 * fills in as you reach for it. Both are available at once.
 *
 * This story shows the first: `onClick` alone.
 */
export const Clickable: Story = {
  args: {
    label: 'Filter: open',
    onClick: fn(),
  },
  render: (args) => (
    <div style={row}>
      <Chip {...args} />
      <Chip {...args} variant="accent" label="Filter: mine" />
    </div>
  ),
};

/**
 * `onDelete` appends a remove button after the label. Unlike the Material UI chip,
 * which hangs a click handler on the delete icon itself, this is a real `button`
 * with its own accessible name, so it can be tabbed to and pressed with the
 * keyboard — see Accessibility below.
 */
export const Deletable: Story = {
  args: {
    label: 'react',
    onDelete: fn(),
  },
  render: (args) => (
    <div style={row}>
      <Chip {...args} />
      <Chip {...args} variant="danger" label="blocked" />
    </div>
  ),
};

/**
 * Passing both makes the label a button and the cross a second, separate button.
 * They are siblings rather than one nested inside the other, because nesting a
 * button inside a button is invalid HTML — the chip wraps them in a `span` to keep
 * the pill intact. Removing a chip does not fire its `onClick`.
 */
export const ClickableAndDeletable: Story = {
  args: {
    label: 'react',
    onClick: fn(),
    onDelete: fn(),
  },
  render: (args) => (
    <div style={row}>
      <Chip {...args} />
      <Chip {...args} variant="accent" label="typescript" />
    </div>
  ),
};

/**
 * `href` renders an anchor that navigates, keeping the same styling. There is no
 * `component` prop to set: the element follows from the props.
 *
 * A disabled link drops its `href` so it can be neither followed nor tabbed to.
 */
export const ClickableLink: Story = {
  args: {
    href: '#chip',
    label: 'typescript',
  },
  render: (args) => (
    <div style={row}>
      <Chip {...args} />
      <Chip {...args} variant="accent" label="accessibility" />
      <Chip {...args} label="unavailable" disabled />
    </div>
  ),
};

/**
 * `deleteIcon` replaces the default cross. The icon is decorative — the remove
 * button keeps its accessible name either way, so swapping the glyph never costs
 * the label.
 */
export const CustomDeleteIcon: Story = {
  args: {
    label: 'draft',
    onDelete: fn(),
  },
  render: (args) => (
    <div style={row}>
      <Chip {...args} deleteIcon={<TrashIcon />} deleteLabel="Delete the draft" />
      <Chip
        {...args}
        variant="danger"
        label="stale"
        deleteIcon={<span aria-hidden="true">✕</span>}
      />
    </div>
  ),
};

/**
 * `avatar` sits flush against the leading edge, for a picture or a set of initials.
 * It stays exposed to assistive technology, so an image should carry its own `alt`
 * — or `alt=""` when it only repeats the label.
 */
export const AvatarChip: Story = {
  render: (args) => (
    <div style={row}>
      <Chip {...args} label="Ada Lovelace" avatar={<span aria-hidden="true">AL</span>} />
      <Chip
        {...args}
        variant="accent"
        label="Grace Hopper"
        avatar={<span aria-hidden="true">GH</span>}
      />
    </div>
  ),
};

/**
 * `icon` renders a decorative node before the label. It is hidden from assistive
 * technology, since it only ever restates what the label already says.
 *
 * When both are passed, `avatar` wins.
 */
export const IconChip: Story = {
  render: (args) => (
    <div style={row}>
      <Chip {...args} label="design" icon={<TagIcon />} />
      <Chip {...args} variant="success" label="shipped" icon={<CheckIcon />} />
    </div>
  ),
};

/**
 * A chip keeps its label on one line and truncates it. To let one wrap, override
 * the fixed height and the white space, and add some vertical padding back:
 *
 * `<Chip label="…" style={{ height: 'auto', whiteSpace: 'normal', paddingBlock: 6 }} />`
 */
export const MultilineChip: Story = {
  render: (args) => (
    <div style={{ ...row, maxWidth: 260 }}>
      <Chip {...args} label="Truncated because the pill will not grow to fit it" />
      <Chip
        {...args}
        label="Wrapped over as many lines as the label needs"
        style={{ height: 'auto', whiteSpace: 'normal', paddingBlock: 6 }}
      />
    </div>
  ),
};

/**
 * Rendering a collection: each chip removes itself from the array, and its remove
 * button says which one it is. `deleteLabel` overrides that name when the label
 * alone is not descriptive enough — "Remove react" is clear in isolation, less so
 * read out of a list of filters.
 */
export const ChipArray: Story = {
  argTypes: {
    label: { control: false, table: { disable: true } },
  },
  render: (args) => {
    const [filters, setFilters] = useState(['react', 'typescript', 'storybook', 'a11y']);

    return (
      <div style={{ ...row, minHeight: 40 }}>
        {filters.map((filter) => (
          <Chip
            {...args}
            key={filter}
            label={filter}
            deleteLabel={`Remove the ${filter} filter`}
            onDelete={() => setFilters((current) => current.filter((f) => f !== filter))}
          />
        ))}
        {filters.length === 0 ? (
          <Chip {...args} variant="secondary" label="no filters" />
        ) : (
          <Chip {...args} variant="secondary" label="clear all" onClick={() => setFilters([])} />
        )}
      </div>
    );
  },
};

/**
 * `disabled` suppresses clicks, navigation and deletion, and fades the whole pill.
 * A disabled button chip is disabled natively; a disabled link chip loses its
 * `href` and swallows the click, so it cannot be followed or reach an ancestor
 * handler.
 */
export const DisabledChip: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <div style={row}>
      <Chip {...args} label="static" />
      <Chip {...args} label="clickable" onClick={fn()} />
      <Chip {...args} label="link" href="#chip" />
      <Chip {...args} label="deletable" onDelete={fn()} />
    </div>
  ),
};

/**
 * A clickable or deletable chip is a button in the tab order. A chip that is both
 * holds two tab stops — the label and the cross — rather than one control that
 * changes meaning depending on where the pointer lands.
 *
 * Releasing `Backspace` or `Delete` anywhere inside a deletable chip removes it,
 * and `Escape` blurs it, matching the Material UI chip. `Backspace` is claimed on
 * key down so the browser cannot treat it as a request to navigate back.
 *
 * The remove button is named `Remove {label}` unless `deleteLabel` says otherwise,
 * so it is distinguishable from every other remove button on the page.
 *
 * Tab into the chips below and try it.
 */
export const Accessibility: Story = {
  args: {
    label: 'react',
    onClick: fn(),
    onDelete: fn(),
  },
  render: (args) => (
    <div style={row}>
      <Chip {...args} />
      <Chip {...args} variant="accent" label="typescript" onClick={undefined} />
      <Chip {...args} variant="secondary" label="storybook" onDelete={undefined} />
    </div>
  ),
};
