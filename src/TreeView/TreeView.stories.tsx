import type { Meta, StoryObj } from '@storybook/react-vite';
import { type TreeItem,TreeView } from './TreeView';

/**
 * Tree view following the OFFSET design system: quiet rows on the page, the selected
 * row on the accent wash with a 3px accent edge.
 *
 * - **WAI-ARIA tree pattern** — one tab stop; arrow keys move, Right and Left open, close
 *   and step between parent and child, Home and End jump, Enter or Space selects.
 * - **Type-ahead** — a letter moves to the next item that starts with it.
 * - **Position is announced** — each item reports its level, position and set size.
 *
 * Import
 * ---
 *
 * `import { TreeView } from '@ioanatu/component-library';`
 */

const ITEMS: TreeItem[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx', meta: '4 KB' },
          { id: 'card', label: 'Card.tsx', meta: '3 KB' },
        ],
      },
      { id: 'index', label: 'index.ts', meta: '1 KB' },
    ],
  },
  { id: 'readme', label: 'README.md', meta: '2 KB' },
  { id: 'package', label: 'package.json', meta: '1 KB' },
];

const meta: Meta<typeof TreeView> = {
  title: 'Components/TreeView',
  component: TreeView,
  tags: ['autodocs'],
  args: { label: 'Project files', items: ITEMS, defaultExpandedIds: ['src'] },
  render: (args) => (
    <div style={{ width: 320 }}>
      <TreeView {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { defaultExpandedIds: ['src', 'components'], defaultSelectedId: 'card' },
};
