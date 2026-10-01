import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonNew } from '../ButtonNew/ButtonNew';
import { Chip } from '../Chip/Chip';
import { Body } from '../Typography';
import { Table } from './Table';

/**
 * Table following the OFFSET design system: heavy outside, quiet inside — a bordered
 * container on the offset shadow, rows divided by hairlines, the head in solid ink.
 *
 * - **A real `<table>`** — with `<caption>`, `<th scope="col">` and `<tbody>`. A grid of
 *   divs looks identical and gives a screen reader nothing: no dimensions, no header
 *   association, no row-by-row navigation.
 * - **`rowHeader`** marks the column that identifies each row as `<th scope="row">`, so
 *   a cell is announced with the row it belongs to rather than in isolation.
 * - **`caption` is required** — it names the table. `hideCaption` keeps it announced when
 *   a visible heading already sits above.
 * - **The scroll area is focusable** — a region that pans by mouse has to be reachable by
 *   keyboard, so it takes a tab stop and shows a focus ring.
 *
 * Import
 * ---
 *
 * `import { Table } from '@ioanatu/component-library';`
 */

interface Batch {
  name: string;
  owner: string;
  count: string;
  status: string;
  tone: 'success' | 'warning' | 'error' | 'info';
}

const BATCHES: Batch[] = [
  {
    name: 'accounts_2024_q4',
    owner: 'Data team',
    count: '48,210',
    status: 'Migrated',
    tone: 'success',
  },
  {
    name: 'invoices_legacy',
    owner: 'Billing',
    count: '12,004',
    status: 'In review',
    tone: 'warning',
  },
  {
    name: 'attachments_blob',
    owner: 'Platform',
    count: '301,887',
    status: 'Failed',
    tone: 'error',
  },
  { name: 'contacts_merge', owner: 'Growth', count: '7,455', status: 'Queued', tone: 'info' },
];

const COLUMNS = [
  { key: 'name', label: 'Batch', width: '33%' },
  { key: 'owner', label: 'Owner', width: '23%' },
  { key: 'count', label: 'Records', width: '21%', align: 'end' as const },
  { key: 'status', label: 'Status', width: '23%' },
];

const cell = (row: Batch, key: string) => {
  if (key === 'status') return <Chip label={row.status} variant={row.tone} size="sm" />;
  if (key === 'count')
    return (
      <Body as="span" level={3} mono tone="muted" unbounded>
        {row.count}
      </Body>
    );
  if (key === 'owner')
    return (
      <Body as="span" level={3} tone="muted" unbounded>
        {row.owner}
      </Body>
    );
  return (
    <Body as="span" level={3} weight="medium" unbounded>
      {row.name}
    </Body>
  );
};

const meta: Meta<typeof Table<Batch>> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    zebra: { control: 'boolean' },
    hideCaption: { control: 'boolean' },
    minWidth: { control: 'number' },
    columns: { control: false },
    rows: { control: false },
    cell: { control: false },
    header: { control: false },
  },
  args: {
    caption: 'Migration batches',
    columns: COLUMNS,
    rows: BATCHES,
    cell,
    rowHeader: 'name',
    rowKey: (row) => row.name,
    zebra: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The header slot sits inside the border and lays its children out as a row. */
export const WithHeader: Story = {
  args: {
    hideCaption: true,
    header: (
      <>
        <Body level={2} weight="semibold">
          Migration batches
        </Body>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Chip label="128 rows" size="sm" />
          <ButtonNew variant="secondary" size="sm">
            Export
          </ButtonNew>
        </div>
      </>
    ),
  },
};

export const WithoutZebra: Story = {
  args: { zebra: false },
};

export const Empty: Story = {
  args: { rows: [], emptyMessage: 'No batches yet' },
};

/** Narrow the viewport and the region scrolls; Tab reaches it to pan by keyboard. */
export const Scrolling: Story = {
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Table {...args} />
    </div>
  ),
};
