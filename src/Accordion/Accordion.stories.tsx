import type { Meta, StoryObj } from '@storybook/react-vite';
import { Body } from '../Typography';
import { Accordion, type AccordionItem } from './Accordion';

/**
 * Accordion following the OFFSET design system: heavy outside, quiet inside — one
 * bordered container on the offset shadow, sections divided by hairlines.
 *
 * - **WAI-ARIA accordion pattern** — each header is a `<button>` inside a heading, with
 *   `aria-expanded` and `aria-controls`; each panel is a region named by its header.
 * - **Headings** — set `headingLevel` to fit the page, so the sections appear in a
 *   screen reader's heading list.
 * - **Keys** — Tab reaches every header, Enter or Space toggles, and Up, Down, Home and End
 *   move between headers.
 * - **Find in page works** — closed panels use `hidden="until-found"`, so the browser
 *   searches them and opens the one with the match.
 * - **State is not the chevron alone** — the open header carries a 3px accent edge.
 *
 * Import
 * ---
 *
 * `import { Accordion } from '@ioanatu/component-library';`
 */

const ITEMS: AccordionItem[] = [
  {
    id: 'tokens',
    title: 'Can I change the accent colour?',
    content: (
      <Body level={3} tone="inherit">
        Yes. Set --accent on any ancestor and every focus ring, shadow and selected state follows.
      </Body>
    ),
  },
  {
    id: 'dark',
    title: 'Is there a dark theme?',
    content: (
      <Body level={3} tone="inherit">
        Set data-theme=&quot;dark&quot; on a container. Only the semantic tokens change.
      </Body>
    ),
  },
  {
    id: 'rtl',
    title: 'Does it support right-to-left?',
    content: (
      <Body level={3} tone="inherit">
        Components use logical properties, so they mirror under dir=&quot;rtl&quot;.
      </Body>
    ),
  },
  {
    id: 'legacy',
    title: 'Where is the v1 Button?',
    disabled: true,
    content: null,
  },
];

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6] },
    multiple: { control: 'boolean' },
    items: { control: false },
  },
  args: { items: ITEMS, headingLevel: 3, multiple: false, defaultExpanded: ['tokens'] },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Accordion {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Several sections can stay open at once. */
export const Multiple: Story = {
  args: {
    multiple: true,
    defaultExpanded: ['tokens', 'dark'],
    headingLevel: 6,
  },
};
