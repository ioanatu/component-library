import { fireEvent, render, screen } from '@testing-library/react';
import { Select } from './Select';

const OPTIONS = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const setup = (props: Partial<React.ComponentProps<typeof Select>> = {}) =>
  render(<Select label="Size" options={OPTIONS} {...props} />);

const trigger = () => screen.getByRole('button', { name: /Size/ });
const open = () => fireEvent.click(trigger());

describe('Select', () => {
  it('shows the placeholder until something is selected', () => {
    setup({ placeholder: 'Choose a size' });
    expect(trigger()).toHaveTextContent('Choose a size');
  });

  it('shows the selected option label', () => {
    setup({ defaultValue: 'medium' });
    expect(trigger()).toHaveTextContent('Medium');
  });

  it('wires the trigger to the listbox', () => {
    setup();
    expect(trigger()).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');

    open();
    const listbox = screen.getByRole('listbox');
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    expect(trigger()).toHaveAttribute('aria-controls', listbox.id);
  });

  it('marks only the selected option as selected', () => {
    setup({ defaultValue: 'medium' });
    open();
    expect(screen.getByRole('option', { name: 'Medium' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'Small' })).toHaveAttribute('aria-selected', 'false');
  });

  it('opens with the listbox focused and the selected option active', () => {
    setup({ defaultValue: 'medium' });
    open();
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveFocus();
    expect(listbox).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Medium' }).id,
    );
  });

  it('moves the active option with the arrows, wrapping', () => {
    setup();
    open();
    const listbox = screen.getByRole('listbox');
    const activeId = () => listbox.getAttribute('aria-activedescendant');

    expect(activeId()).toBe(screen.getByRole('option', { name: 'Small' }).id);

    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    expect(activeId()).toBe(screen.getByRole('option', { name: 'Medium' }).id);

    fireEvent.keyDown(listbox, { key: 'End' });
    expect(activeId()).toBe(screen.getByRole('option', { name: 'Large' }).id);

    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    expect(activeId()).toBe(screen.getByRole('option', { name: 'Small' }).id);

    fireEvent.keyDown(listbox, { key: 'ArrowUp' });
    expect(activeId()).toBe(screen.getByRole('option', { name: 'Large' }).id);
  });

  it('picks the active option with Enter and returns focus to the trigger', () => {
    const onChange = vi.fn();
    setup({ onChange });
    open();

    const listbox = screen.getByRole('listbox');
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    fireEvent.keyDown(listbox, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith('medium');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
    expect(trigger()).toHaveTextContent('Medium');
  });

  it('picks on click', () => {
    const onChange = vi.fn();
    setup({ onChange });
    open();
    fireEvent.click(screen.getByRole('option', { name: 'Large' }));
    expect(onChange).toHaveBeenCalledWith('large');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens on ArrowUp with the last option active', () => {
    setup();
    fireEvent.keyDown(trigger(), { key: 'ArrowUp' });
    expect(screen.getByRole('listbox')).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Large' }).id,
    );
  });

  it('jumps by typeahead when not searchable', () => {
    setup();
    open();
    const listbox = screen.getByRole('listbox');
    fireEvent.keyDown(listbox, { key: 'l' });
    expect(listbox).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Large' }).id,
    );
  });

  it('closes on Escape and on outside pointerdown', () => {
    setup();
    open();
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();

    open();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('will not pick a disabled option', () => {
    const onChange = vi.fn();
    setup({
      onChange,
      options: [...OPTIONS, { value: 'huge', label: 'Huge', disabled: true }],
    });
    open();
    const option = screen.getByRole('option', { name: 'Huge' });
    expect(option).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(option);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('submits through a hidden input when given a name', () => {
    const { container } = setup({ name: 'size', defaultValue: 'large' });
    expect(container.querySelector('input[type="hidden"][name="size"]')).toHaveValue('large');
  });

  it('links helper and error to the trigger, and announces the error', () => {
    setup({ helper: 'Applies to new projects.', error: 'Choose a size.' });
    const describedBy = trigger().getAttribute('aria-describedby') ?? '';
    expect(describedBy.split(' ')).toHaveLength(2);
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a size.');
  });

  it('does not open when disabled', () => {
    setup({ disabled: true });
    expect(trigger()).toBeDisabled();
    open();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

describe('Select, searchable', () => {
  const setupSearch = (props: Partial<React.ComponentProps<typeof Select>> = {}) =>
    render(<Select label="Size" options={OPTIONS} searchable {...props} />);

  const openSearch = () => fireEvent.click(screen.getByRole('button', { name: /Size/ }));
  const search = () => screen.getByRole('combobox');

  it('focuses the search field on open and owns the active option', () => {
    setupSearch();
    openSearch();
    expect(search()).toHaveFocus();
    expect(search()).toHaveAttribute('aria-controls', screen.getByRole('listbox').id);
    expect(search()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Small' }).id,
    );
  });

  it('filters as you type', () => {
    setupSearch();
    openSearch();
    fireEvent.change(search(), { target: { value: 'la' } });

    expect(screen.getByRole('option', { name: 'Large' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Small' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(1);
  });

  it('keeps the arrows working while the query is narrowed', () => {
    setupSearch();
    openSearch();
    fireEvent.change(search(), { target: { value: 'l' } });

    /* Small and Large both contain an l. */
    expect(screen.getAllByRole('option')).toHaveLength(2);
    fireEvent.keyDown(search(), { key: 'ArrowDown' });
    expect(search()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Large' }).id,
    );
  });

  it('picks the active filtered option with Enter', () => {
    const onChange = vi.fn();
    setupSearch({ onChange });
    openSearch();
    fireEvent.change(search(), { target: { value: 'med' } });
    fireEvent.keyDown(search(), { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('medium');
  });

  it('shows the empty message and announces the count', () => {
    setupSearch();
    openSearch();
    fireEvent.change(search(), { target: { value: 'zzz' } });
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText('No matches')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('0 of 3 options');
  });

  it('lets a space be typed rather than picking', () => {
    const onChange = vi.fn();
    setupSearch({ onChange });
    openSearch();
    fireEvent.keyDown(search(), { key: ' ' });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('clears the query when reopened', () => {
    setupSearch();
    openSearch();
    fireEvent.change(search(), { target: { value: 'med' } });
    fireEvent.keyDown(search(), { key: 'Escape' });

    openSearch();
    expect(search()).toHaveValue('');
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });
});
