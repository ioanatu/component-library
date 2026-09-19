import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType, ReactNode } from 'react';
import { fn } from 'storybook/test';
import { buttonNewVariants, sizes } from '../types';
import type { ButtonNewElementProps, ButtonNewProps } from './ButtonNew';
import { ButtonNew } from './ButtonNew';

/**
 *
 * CTA button following the OFFSET design system: a 2px ink border, a hard offset
 * shadow, and one primary action per view.
 *
 * Intent selects the variant and the variant selects the colour, so there is no
 * `color` prop. Every colour and every gap comes from a token.
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
 * `<ButtonNew variant="secondary" size="lg" type="submit" icon={<PlusIcon />} onClick={onClick} fullWidth loading>Click me</ButtonNew>`
 *
 */

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

/**
 * Storybook renders one flat control table, so the union is widened for stories:
 * href sits alongside the button props and each render casts back to ButtonNewProps.
 */
type ButtonNewStoryArgs = Omit<ButtonNewElementProps, 'href'> & {
  href?: string;
  children?: ReactNode;
  icon?: ReactNode;
};

const meta: Meta<ButtonNewStoryArgs> = {
  title: 'Molecules/ButtonNew',
  component: ButtonNew as ComponentType<ButtonNewStoryArgs>,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: buttonNewVariants },
    size: { control: 'inline-radio', options: sizes },
    href: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    icon: { control: false },
  },
  args: {
    children: 'Click here',
    onClick: fn(),
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
  argTypes: {
    variant: { control: false, table: { disable: true } },
    children: { control: false, table: { disable: true } },
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
  // args: { children: { control: false, table: { disable: true } } },

  render: (args) => (
    <Row>
      <ButtonNew {...(args as ButtonNewProps)} size="sm" icon={<PlusIcon />} aria-label="Add" />
      <ButtonNew {...(args as ButtonNewProps)} size="md" icon={<PlusIcon />} aria-label="Add" />
      <ButtonNew {...(args as ButtonNewProps)} size="lg" icon={<PlusIcon />} aria-label="Add" />
      <ButtonNew
        {...(args as ButtonNewProps)}
        variant="secondary"
        icon={<PlusIcon />}
        aria-label="Add"
        loading
      />
      <ButtonNew
        {...(args as ButtonNewProps)}
        variant="secondary"
        icon={<PlusIcon />}
        aria-label="Add"
        disabled
      />
    </Row>
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

export const FullWidth: Story = {
  args: { fullWidth: true, children: 'Publish project' },
  render: (args) => (
    <div style={{ display: 'grid', gap: '14px', inlineSize: '320px' }}>
      <ButtonNew {...(args as ButtonNewProps)} />
      <ButtonNew {...(args as ButtonNewProps)} variant="secondary" icon={<PlusIcon />} />
      <ButtonNew {...(args as ButtonNewProps)} variant="ghost" />
    </div>
  ),
};
