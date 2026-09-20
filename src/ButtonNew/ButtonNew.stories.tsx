import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType, ReactNode } from 'react';
import { buttonNewVariants, elevations, sizes } from '../types';
import type { ButtonNewElementProps, ButtonNewProps } from './ButtonNew';
import { ButtonNew } from './ButtonNew';

const sizesText = ['Small', 'Medium', 'Large'] as const;

const PlusIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M8 3.5v9M3.5 8h9" />
  </svg>
);

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
    {children}
  </div>
);

type ButtonNewStoryArgs = Omit<ButtonNewElementProps, 'href'> & {
  href?: string;
  children?: ReactNode;
  icon?: ReactNode;
};

/**
 * CTA button following the OFFSET design system: a 2px ink border, a hard offset
 * shadow, and one primary action per view.
 *
 * Intent selects the variant and the variant selects the colour, so there is no
 * `color` prop. Every colour and every gap comes from a token.
 *
 * - **Press** — the face travels its own offset distance and lands flush in its
 *   shadow. `elevation` sets that distance: sm 2px, md 4px, lg 8px.
 * - **Ghost** — no border and no shadow, so surface and ink carry every state.
 *   Disabled steps down to the label alone rather than gaining a fill.
 * - **Loading** — the width never changes. The spinner takes the icon's slot, or
 *   hangs in a zero-width one and re-centres with the label.
 * - **Busy, not disabled** — loading sets `aria-busy` and `aria-disabled`, so
 *   focus survives the work instead of being dropped mid-task.
 * - **Icon-only** — drop the children and it turns square; the type then requires
 *   an `aria-label`.
 * - **Link** — `href` renders an anchor. Disabled keeps it focusable and blocks
 *   both click and Enter.
 *
 *
 * Import
 * ---
 *
 * `import { ButtonNew } from '@ioanatu/component-library';`
 *
 * Usage
 * ---
 *
 * ** Simplest example: **
 *
 * `<ButtonNew onClick={onClick}>Click me</ButtonNew>`
 *
 *
 * ** All props example: **
 *
 * `<ButtonNew variant="secondary" size="lg" elevation="lg" type="submit" icon={<PlusIcon />} onClick={onClick} fullWidth loading>Click me</ButtonNew>`
 *
 */

/**
 * Storybook renders one flat control table, so the union is widened for stories:
 * href sits alongside the button props and each render casts back to ButtonNewProps.
 */

const meta: Meta<ButtonNewStoryArgs> = {
  title: 'Molecules/ButtonNew',
  component: ButtonNew as ComponentType<ButtonNewStoryArgs>,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: buttonNewVariants },
    size: { control: 'inline-radio', options: sizes },
    elevation: { control: 'inline-radio', options: elevations },
    href: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    icon: { control: false },
  },
  args: {
    children: 'Click here',
    onClick: () => window.alert('Button clicked!'),
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * One primary per view. The shadow rule runs underneath: a neutral surface casts
 * an accent shadow, an accent or tonal fill casts an ink one.
 */
export const Variants: Story = {
  args: {
    elevation: 'md',
  },

  argTypes: {
    variant: { control: false, table: { disable: true } },
    children: { control: false, table: { disable: true } },
    onClick: { control: false, table: { disable: true } },
    loadingLabel: { control: false, table: { disable: true } },
    type: { control: false, table: { disable: true } },
    icon: { control: false, table: { disable: true } },
    href: { control: false, table: { disable: true } },
  },

  render: (args) => (
    <Row>
      <ButtonNew {...(args as ButtonNewProps)} variant="primary">
        Primary
      </ButtonNew>
      <ButtonNew {...(args as ButtonNewProps)} variant="secondary">
        Secondary
      </ButtonNew>
      <ButtonNew {...(args as ButtonNewProps)} variant="ghost">
        Ghost
      </ButtonNew>
      <ButtonNew {...(args as ButtonNewProps)} variant="destructive">
        Destructive
      </ButtonNew>
      <ButtonNew {...(args as ButtonNewProps)} disabled>
        Disabled
      </ButtonNew>
      <ButtonNew {...(args as ButtonNewProps)} variant="primary" loading>
        Saving
      </ButtonNew>
    </Row>
  ),
};

/** Every size clears a 44px touch target once its 8px gap is counted. */
export const Sizes: Story = {
  argTypes: {
    size: { control: false, table: { disable: true } },
    children: { control: false, table: { disable: true } },
    onClick: { control: false, table: { disable: true } },
    loadingLabel: { control: false, table: { disable: true } },
    type: { control: false, table: { disable: true } },
    icon: { control: false, table: { disable: true } },
    href: { control: false, table: { disable: true } },
  },
  render: (args) => (
    <>
      <Row>
        {sizes.map((size, i) => (
          <ButtonNew key={size} {...(args as ButtonNewProps)} size={size}>
            {sizesText[i]}
          </ButtonNew>
        ))}
      </Row>
      <p> </p>
      <Row>
        {sizes.map((size) => (
          <ButtonNew
            key={size}
            {...(args as ButtonNewProps)}
            icon={<PlusIcon />}
            aria-label="Add"
            children={undefined}
            size={size}
          />
        ))}
      </Row>
    </>
  ),
};

/**
 * Elevation is the offset distance, and the system defines three: sm 2px, md 4px,
 * lg 8px. The shadow travels down-right at 45°, never blurs and never uses alpha,
 * so the distance is the whole of it.
 *
 * It is also the press distance — pressing lands the face flush in its own
 * shadow — so press one of each to feel the difference.
 *
 * The shadow rule decides the colour, not this prop: a neutral surface casts an
 * accent shadow (top row), an accent or tonal fill casts an ink one (bottom row).
 * Left unset, a button takes its size's own distance: 2px for sm, 4px for md and
 * lg. Ghost carries no shadow, so elevation does nothing to it.
 */
export const Elevation: Story = {
  argTypes: {
    elevation: { control: false, table: { disable: true } },
    children: { control: false, table: { disable: true } },
    onClick: { control: false, table: { disable: true } },
    loadingLabel: { control: false, table: { disable: true } },
    type: { control: false, table: { disable: true } },
    icon: { control: false, table: { disable: true } },
    variant: { control: false, table: { disable: true } },
    href: { control: false, table: { disable: true } },
  },
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gap: '18px',
      }}
    >
      <Row>
        {elevations.map((elevation) => (
          <ButtonNew
            key={elevation}
            {...(args as ButtonNewProps)}
            variant="secondary"
            elevation={elevation}
          >
            {`Neutral - ${elevation}`}
          </ButtonNew>
        ))}
      </Row>
      <Row>
        {elevations.map((elevation) => (
          <ButtonNew
            key={elevation}
            {...(args as ButtonNewProps)}
            variant="primary"
            elevation={elevation}
          >
            {`Accent - ${elevation}`}
          </ButtonNew>
        ))}
      </Row>
      <Row>
        {elevations.map((elevation) => (
          <ButtonNew
            key={elevation}
            {...(args as ButtonNewProps)}
            variant="destructive"
            elevation={elevation}
          >
            {`Destructive - ${elevation}`}
          </ButtonNew>
        ))}
      </Row>
    </div>
  ),
};

/**
 * Each pair is one variant at rest and disabled.
 *
 * Disabled drops the offset shadow and takes border and ink down to their subtle
 * step, so the control reads as inert without changing size or moving anything
 * around it.
 *
 * Ghost is the exception. The shared treatment would hand it a fill and a border
 * it does not carry at rest, which makes the disabled state louder than the live
 * one, so it steps down instead: the label alone, in the faintest ink.
 */
export const Disabled: Story = {
  argTypes: {
    variant: { control: false, table: { disable: true } },
    disabled: { control: false, table: { disable: true } },
    children: { control: false, table: { disable: true } },
    onClick: { control: false, table: { disable: true } },
    loadingLabel: { control: false, table: { disable: true } },
    type: { control: false, table: { disable: true } },
    icon: { control: false, table: { disable: true } },
    href: { control: false, table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: '18px', justifyItems: 'start' }}>
      {buttonNewVariants.map((variant) => (
        <Row key={variant}>
          <ButtonNew {...(args as ButtonNewProps)} variant={variant}>
            {variant}
          </ButtonNew>
          <ButtonNew {...(args as ButtonNewProps)} variant={variant} disabled>
            {variant}
          </ButtonNew>
        </Row>
      ))}
    </div>
  ),
};

/**
 * Loading never widens the button — compare each pair, which is the same button
 * at rest and busy.
 *
 * With an icon the spinner takes the icon's slot. Without one it hangs in a
 * zero-width slot, and spinner and label re-centre together inside the width the
 * button already had.
 *
 * The control keeps its colours and its place in the tab order while it is busy:
 * it carries `aria-busy`, is marked `aria-disabled` rather than natively
 * disabled so focus is not dropped mid-task, and announces its loading text.
 */
export const Loading: Story = {
  args: { loading: true },
  argTypes: {
    loading: { control: false, table: { disable: true } },
    children: { control: false, table: { disable: true } },
    onClick: { control: false, table: { disable: true } },
    loadingLabel: { control: false, table: { disable: true } },
    type: { control: false, table: { disable: true } },
    icon: { control: false, table: { disable: true } },
    href: { control: false, table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: '18px', justifyItems: 'start' }}>
      <Row>
        <ButtonNew {...(args as ButtonNewProps)} loading={false}>
          Save changes
        </ButtonNew>
        <ButtonNew {...(args as ButtonNewProps)} loading>
          Save changes
        </ButtonNew>
      </Row>
      <Row>
        <ButtonNew
          {...(args as ButtonNewProps)}
          variant="secondary"
          icon={<PlusIcon />}
          loading={false}
        >
          Add project
        </ButtonNew>
        <ButtonNew {...(args as ButtonNewProps)} variant="secondary" icon={<PlusIcon />} loading>
          Add project
        </ButtonNew>
      </Row>
      <Row>
        <ButtonNew
          {...(args as ButtonNewProps)}
          variant="secondary"
          icon={<PlusIcon />}
          aria-label="Add"
          loading={false}
          children={undefined}
        />
        <ButtonNew
          {...(args as ButtonNewProps)}
          variant="secondary"
          icon={<PlusIcon />}
          aria-label="Add"
          loading
          children={undefined}
        />
      </Row>
    </div>
  ),
};

/**
 * With no children the button is square and the icon is the whole control, so
 * the type requires an `aria-label` to name it. The spinner replaces the icon
 * while it loads.
 */
export const IconOnly: Story = {
  args: { children: undefined },
  argTypes: {
    children: { control: false, table: { disable: true } },
    onClick: { control: false, table: { disable: true } },
    loadingLabel: { control: false, table: { disable: true } },
    type: { control: false, table: { disable: true } },
    icon: { control: false, table: { disable: true } },
    href: { control: false, table: { disable: true } },
    elevation: { control: false, table: { disable: true } },
    fullWidth: { control: false, table: { disable: true } },
  },

  render: (args) => (
    <>
      <Row>
        <ButtonNew size="sm" icon={<PlusIcon />} aria-label="Add" />
        <ButtonNew size="md" icon={<PlusIcon />} aria-label="Add" />
        <ButtonNew size="lg" icon={<PlusIcon />} aria-label="Add" />
        <ButtonNew variant="secondary" icon={<PlusIcon />} aria-label="Add" loading />
        <ButtonNew variant="secondary" icon={<PlusIcon />} aria-label="Add" disabled />
      </Row>
      <Row>
        <p></p>
      </Row>
      <Row>
        <ButtonNew
          size="sm"
          icon={<PlusIcon />}
          aria-label="Add"
          {...(args as ButtonNewProps)}
          elevation="sm"
        />
        <ButtonNew
          size="sm"
          icon={<PlusIcon />}
          aria-label="Add"
          {...(args as ButtonNewProps)}
          elevation="md"
        />
        <ButtonNew
          size="sm"
          icon={<PlusIcon />}
          aria-label="Add"
          {...(args as ButtonNewProps)}
          elevation="lg"
        />
      </Row>
    </>
  ),
};

/**
 * Passing `href` renders an anchor that navigates, keeping the same styling.
 * A disabled or loading link keeps its href and is marked `aria-disabled`, so it
 * stays focusable and announces the state instead of silently vanishing from the
 * tab order — clicks and Enter are suppressed.
 */
export const AsLink: Story = {
  args: {
    href: '#start',
    children: 'Get started',
  },
  argTypes: {
    loading: { control: false, table: { disable: true } },
    children: { control: false, table: { disable: true } },
    onClick: { control: false, table: { disable: true } },
    loadingLabel: { control: false, table: { disable: true } },
    type: { control: false, table: { disable: true } },
    icon: { control: false, table: { disable: true } },
    elevation: { control: false, table: { disable: true } },
  },
  render: (args) => (
    <Row>
      <ButtonNew {...(args as ButtonNewProps)} />
      <ButtonNew {...(args as ButtonNewProps)} variant="secondary">
        Docs
      </ButtonNew>
      <ButtonNew {...(args as ButtonNewProps)} variant="secondary" disabled>
        Disabled link
      </ButtonNew>
      <ButtonNew {...(args as ButtonNewProps)} variant="secondary" loading>
        Opening
      </ButtonNew>
    </Row>
  ),
};

export const AllProps: Story = {
  args: { fullWidth: true, children: 'Publish project' },
  render: (args) => (
    <div style={{ display: 'grid', gap: '14px', inlineSize: '320px' }}>
      <ButtonNew {...(args as ButtonNewProps)} />
      <ButtonNew {...(args as ButtonNewProps)} variant="secondary" icon={<PlusIcon />} />
      <ButtonNew {...(args as ButtonNewProps)} variant="ghost" />
    </div>
  ),
};
