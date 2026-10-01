import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { Combobox, type ComboboxOption } from './Combobox';

const OPTIONS: ComboboxOption[] = [
  { value: 'ams', label: 'Amsterdam' },
  { value: 'ath', label: 'Athens', description: 'Greece' },
];

function Harness({ onSelect = vi.fn() }: { onSelect?: (option: ComboboxOption) => void }) {
  const [text, setText] = useState('');
  return (
    <Combobox
      label="City"
      inputValue={text}
      onInputChange={setText}
      options={OPTIONS.filter((option) => option.label.startsWith(text))}
      onSelect={onSelect}
      minChars={1}
    />
  );
}

describe('Combobox', () => {
  it('opens a listbox and announces the count once typing starts', () => {
    render(<Harness />);
    const input = screen.getByRole('combobox', { name: 'City' });
    expect(input).toHaveAttribute('aria-expanded', 'false');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'A' } });
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.getByRole('status')).toHaveTextContent('2 results available');
  });

  it('moves the highlight with arrow keys and picks with Enter', () => {
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'A' } });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const athens = screen.getByRole('option', { name: /Athens/ });
    expect(input).toHaveAttribute('aria-activedescendant', athens.id);
    expect(athens).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(OPTIONS[1]);
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes on Escape and picks on click', () => {
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'A' } });

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.click(screen.getByRole('option', { name: 'Amsterdam' }));
    expect(onSelect).toHaveBeenCalledWith(OPTIONS[0]);
  });

  it('says so when nothing matches', () => {
    render(<Harness />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Z' } });
    expect(screen.getByRole('status')).toHaveTextContent('No results');
  });
});
