import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Combobox, type ComboboxOption } from './Combobox';

/**
 * Combobox following the OFFSET design system: an Input that suggests as you type, for
 * lists too long or too remote for a Select.
 *
 * - **ARIA 1.2 combobox** — focus stays in the field; arrow keys move a highlight through
 *   the listbox, Enter picks, Escape closes.
 * - **The result count is announced**, so a screen reader user knows the list is there.
 * - **The caller owns the data** — fetch, debounce and cancel outside, pass `options` in.
 *
 * Import
 * ---
 *
 * `import { Combobox } from '@ioanatu/component-library';`
 */

const CITIES: ComboboxOption[] = [
  { value: 'ams', label: 'Amsterdam', description: 'Netherlands' },
  { value: 'ath', label: 'Athens', description: 'Greece' },
  { value: 'bcn', label: 'Barcelona', description: 'Spain' },
  { value: 'ber', label: 'Berlin', description: 'Germany' },
  { value: 'buc', label: 'Bucharest', description: 'Romania' },
  { value: 'lis', label: 'Lisbon', description: 'Portugal' },
];

const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: { label: 'City', helper: 'Type to see suggestions.' },
  render: function Render(args) {
    const [text, setText] = useState('');
    const [picked, setPicked] = useState<string>();
    const options = CITIES.filter((city) => city.label.toLowerCase().includes(text.toLowerCase()));

    return (
      <div style={{ width: 320, minHeight: 360 }}>
        <Combobox
          {...args}
          inputValue={text}
          onInputChange={setText}
          options={options}
          onSelect={(option) => {
            setText(option.label);
            setPicked(option.label);
          }}
        />
        <p>Picked: {picked ?? 'nothing yet'}</p>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true, loadingLabel: 'Searching' },
};
