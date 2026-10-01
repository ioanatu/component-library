import type { Meta, StoryObj } from '@storybook/react-vite';
import { alertTones } from '../types';
import { Body } from '../Typography';
import { Alert } from './Alert';

/**
 * Alert following the OFFSET design system: a tinted panel on the tone's border and
 * offset shadow, led by a glyph so the tone never rests on colour alone.
 *
 * - **Silent by default** — `announce` makes it a live region: `polite` for a status,
 *   `assertive` for a problem that needs action now.
 * - **An alert that takes focus needs neither** — moving focus to it already reads it.
 *   Give it `tabIndex={-1}`, as an error summary does.
 * - **`headingLevel`** renders the title as a heading, so it joins the page outline.
 *
 * Import
 * ---
 *
 * `import { Alert } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'inline-radio', options: alertTones },
    headingLevel: { control: 'inline-radio', options: [undefined, 2, 3, 4] },
    announce: { control: 'inline-radio', options: [undefined, 'polite', 'assertive'] },
  },
  args: {
    tone: 'info',
    title: 'Scheduled maintenance',
    children: (
      <Body level={2} unbounded>
        Exports pause on Sunday from 02:00 to 04:00.
      </Body>
    ),
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Alert {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 480 }}>
      {alertTones.map((tone) => (
        <Alert
          key={tone}
          {...args}
          tone={tone}
          title={`${tone[0].toUpperCase()}${tone.slice(1)}`}
        />
      ))}
    </div>
  ),
};
