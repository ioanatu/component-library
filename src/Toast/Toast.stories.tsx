import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ButtonNew } from '../ButtonNew/ButtonNew';
import { toastPlacements, toastTones } from '../types';
import { Body, Headline } from '../Typography';
import { Toast, ToastRegion } from './Toast';

/**
 * Toast following the OFFSET design system: a bordered surface with the offset
 * shadow, floating over the page.
 *
 * - **For outcomes, not decisions** — a toast can be missed. An error that needs a
 *   choice belongs in a dialog.
 * - **Announced, never focused** — `role="status"` and polite by default,
 *   `role="alert"` and assertive for `tone="error"`, which is the design system's own
 *   spec for this component. Focus stays where the user left it.
 * - **A landmark** — `ToastRegion` is a labelled `role="region"`, so it can be reached
 *   by landmark navigation rather than only by tabbing into whatever is on screen.
 * - **The timer is holdable** — hovering or focusing a toast stops the countdown
 *   (WCAG 2.2.1). Errors do not auto-dismiss at all.
 * - **Keep the region mounted.** A live region that appears at the same moment as its
 *   content is unreliable, so render `ToastRegion` once, high in the tree, and put
 *   toasts into it.
 *
 * State lives with you: hold an array and render a `Toast` per entry. There is no
 * global store in this library.
 *
 * Import
 * ---
 *
 * `import { Toast, ToastRegion } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'inline-radio', options: toastTones },
    duration: { control: { type: 'number', min: 0, step: 500 } },
    dismissible: { control: 'boolean' },
    action: { control: false },
  },
  args: {
    tone: 'success',
    title: 'Project created',
    children: 'Polite live region — it announces without stealing focus.',
    dismissible: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Rendered in place rather than floating, so the docs can show it still. */
export const Default: Story = {
  args: { duration: 0 },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Toast {...args} onDismiss={() => {}} />
    </div>
  ),
};

export const Tones: Story = {
  argTypes: { tone: { control: false, table: { disable: true } } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 14, maxWidth: 360 }}>
      <Toast {...args} tone="success" title="Project created" duration={0} onDismiss={() => {}}>
        The migration is queued and will start shortly.
      </Toast>
      <Toast {...args} tone="info" title="Export ready" duration={0} onDismiss={() => {}}>
        Your download will begin automatically.
      </Toast>
      <Toast
        {...args}
        tone="warning"
        title="Approaching your limit"
        duration={0}
        onDismiss={() => {}}
      >
        You have used 92% of the included storage.
      </Toast>
      <Toast {...args} tone="error" title="Could not save" duration={0} onDismiss={() => {}}>
        Assertive, and it will not dismiss itself.
      </Toast>
    </div>
  ),
};

/** A single optional control. Never the only route to the action — toasts vanish. */
export const WithAction: Story = {
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Toast
        {...args}
        title="Project archived"
        duration={0}
        onDismiss={() => {}}
        action={
          <ButtonNew variant="secondary" size="sm">
            Undo
          </ButtonNew>
        }
      >
        It will stay in the archive for 30 days.
      </Toast>
    </div>
  ),
};

/** The real thing: fired into a mounted region, stacking, dismissing on a timer. */
export const Live: Story = {
  argTypes: { title: { control: false }, children: { control: false } },
  render: (args) => {
    const [items, setItems] = useState<{ id: number; tone: (typeof toastTones)[number] }[]>([]);
    const [placement, setPlacement] = useState<(typeof toastPlacements)[number]>('bottom-right');

    const fire = (tone: (typeof toastTones)[number]) =>
      setItems((prev) => [...prev, { id: Date.now() + Math.random(), tone }]);

    const COPY = {
      success: ['Project created', 'The migration is queued.'],
      info: ['Export ready', 'Your download will begin automatically.'],
      warning: ['Approaching your limit', 'You have used 92% of your storage.'],
      error: ['Could not save', 'Check your connection and try again.'],
    } as const;

    return (
      <div style={{ display: 'grid', gap: 18 }}>
        <Headline level={4}>Fire a toast:</Headline>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {toastTones.map((tone) => (
            <ButtonNew key={tone} variant="secondary" size="sm" onClick={() => fire(tone)}>
              {tone}
            </ButtonNew>
          ))}
        </div>

        <Headline level={4} style={{ marginTop: 20 }}>
          Select a Toast placement:
        </Headline>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {toastPlacements.map((option) => (
            <ButtonNew
              key={option}
              size="sm"
              variant={option === placement ? 'primary' : 'ghost'}
              onClick={() => setPlacement(option)}
            >
              {option}
            </ButtonNew>
          ))}
        </div>

        <Body level={3} tone="muted">
          Hover a toast to hold its timer. Errors stay until dismissed.
        </Body>

        <ToastRegion placement={placement}>
          {items.map((item) => (
            <Toast
              {...args}
              key={item.id}
              tone={item.tone}
              title={COPY[item.tone][0]}
              onDismiss={() => setItems((prev) => prev.filter((entry) => entry.id !== item.id))}
            >
              {COPY[item.tone][1]}
            </Toast>
          ))}
        </ToastRegion>
      </div>
    );
  },
};
