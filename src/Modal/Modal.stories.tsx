import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { ButtonNew } from '../ButtonNew/ButtonNew';
import { Input } from '../Input/Input';
import { sizes } from '../types';
import { Body } from '../Typography';
import { Modal } from './Modal';

/**
 * Modal following the OFFSET design system: a bordered surface on the offset shadow,
 * over the ink scrim.
 *
 * - **Native `<dialog>` with `showModal()`** — the focus trap, Escape, the inert
 *   background and returning focus to whatever opened it are the browser's, not a
 *   re-implementation. It also renders in the top layer, so unlike the other overlays
 *   here no ancestor's `overflow: hidden` or z-index can clip it.
 * - **React stays in charge** — the `cancel` event is prevented so Escape routes through
 *   `onClose` like every other way of closing. One source of truth.
 * - **Backdrop clicks are told apart** by target: the `<dialog>` carries no fill or
 *   padding, so only a backdrop click lands on it; the panel swallows its own.
 * - **`dismissible={false}`** removes the close button and makes Escape and the backdrop
 *   inert, for a task that has to be answered.
 * - **Scroll is locked** while open, which `showModal()` does not do by itself.
 *
 * For a task that must be finished or abandoned before anything else. An outcome the
 * user need not acknowledge is a `Toast`.
 *
 * Import
 * ---
 *
 * `import { Modal } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    dismissible: { control: 'boolean' },
    open: { control: false },
    footer: { control: false },
  },
  args: {
    title: 'Name this migration',
    eyebrow: 'New project',
    description:
      'Focus moves here on open, is trapped while open, and returns to the button you pressed when this closes.',
    size: 'md',
    dismissible: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const nameRef = useRef<HTMLInputElement>(null);

    return (
      <>
        <ButtonNew onClick={() => setOpen(true)}>New project</ButtonNew>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          initialFocus={nameRef}
          footer={
            <>
              <ButtonNew variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </ButtonNew>
              <ButtonNew size="sm" onClick={() => setOpen(false)}>
                Create project
              </ButtonNew>
            </>
          }
        >
          <Input label="Project name" ref={nameRef} placeholder="Atlas migration" />
        </Modal>
      </>
    );
  },
};

/** Escape and the backdrop do nothing, and there is no close button. */
export const NotDismissible: Story = {
  args: {
    title: 'Confirm deletion',
    eyebrow: 'Careful',
    description: 'This removes the project and everything in it. There is no undo.',
    dismissible: false,
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <ButtonNew variant="destructive" onClick={() => setOpen(true)}>
          Delete project
        </ButtonNew>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <>
              <ButtonNew variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Keep it
              </ButtonNew>
              <ButtonNew variant="destructive" size="sm" onClick={() => setOpen(false)}>
                Delete
              </ButtonNew>
            </>
          }
        />
      </>
    );
  },
};

export const Sizes: Story = {
  argTypes: { size: { control: false, table: { disable: true } } },
  render: (args) => {
    const [size, setSize] = useState<(typeof sizes)[number] | null>(null);
    return (
      <div style={{ display: 'flex', gap: 10 }}>
        {sizes.map((option) => (
          <ButtonNew key={option} variant="secondary" size="sm" onClick={() => setSize(option)}>
            {option}
          </ButtonNew>
        ))}
        <Modal
          {...args}
          size={size ?? 'md'}
          title={`A ${size ?? 'md'} dialog`}
          open={size !== null}
          onClose={() => setSize(null)}
          footer={
            <ButtonNew size="sm" onClick={() => setSize(null)}>
              Done
            </ButtonNew>
          }
        />
      </div>
    );
  },
};

/** Long content scrolls inside the panel; the dialog stays within the viewport. */
export const LongContent: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <ButtonNew onClick={() => setOpen(true)}>Read the terms</ButtonNew>
        <Modal
          {...args}
          title="Terms of service"
          eyebrow={undefined}
          description={undefined}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <ButtonNew size="sm" onClick={() => setOpen(false)}>
              Accept
            </ButtonNew>
          }
        >
          <div style={{ display: 'grid', gap: 12 }}>
            {Array.from({ length: 12 }, (_, index) => (
              <Body key={index} level={3} tone="muted">
                Clause {index + 1}. The offset never blurs and never uses alpha, so the distance is
                the whole of the elevation.
              </Body>
            ))}
          </div>
        </Modal>
      </>
    );
  },
};
