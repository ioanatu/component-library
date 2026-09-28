import { fireEvent, render, screen } from '@testing-library/react';
import { TabMenu } from './TabMenu';

const ITEMS = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board' },
];

const setup = (props: Partial<React.ComponentProps<typeof TabMenu>> = {}) =>
  render(<TabMenu label="View mode" items={ITEMS} {...props} />);

const tab = (name: string) => screen.getByRole('tab', { name });

describe('TabMenu', () => {
  it('names the tablist and selects the first item by default', () => {
    setup();
    expect(screen.getByRole('tablist', { name: 'View mode' })).toBeInTheDocument();
    expect(tab('Grid')).toHaveAttribute('aria-selected', 'true');
    expect(tab('List')).toHaveAttribute('aria-selected', 'false');
  });

  it('keeps one tab stop with a roving tabindex', () => {
    setup({ defaultValue: 'list' });
    expect(tab('Grid')).toHaveAttribute('tabindex', '-1');
    expect(tab('List')).toHaveAttribute('tabindex', '0');
    expect(tab('Board')).toHaveAttribute('tabindex', '-1');
  });

  it('selects on click', () => {
    const onChange = vi.fn();
    setup({ onChange });
    fireEvent.click(tab('Board'));
    expect(onChange).toHaveBeenCalledWith('board');
    expect(tab('Board')).toHaveAttribute('aria-selected', 'true');
  });

  it('moves and selects with the arrows, wrapping', () => {
    setup();
    fireEvent.keyDown(tab('Grid'), { key: 'ArrowRight' });
    expect(tab('List')).toHaveAttribute('aria-selected', 'true');
    expect(tab('List')).toHaveFocus();

    fireEvent.keyDown(tab('List'), { key: 'ArrowRight' });
    fireEvent.keyDown(tab('Board'), { key: 'ArrowRight' });
    expect(tab('Grid')).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(tab('Grid'), { key: 'ArrowLeft' });
    expect(tab('Board')).toHaveAttribute('aria-selected', 'true');
  });

  it('jumps to the ends with Home and End', () => {
    setup({ defaultValue: 'list' });
    fireEvent.keyDown(tab('List'), { key: 'End' });
    expect(tab('Board')).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(tab('Board'), { key: 'Home' });
    expect(tab('Grid')).toHaveAttribute('aria-selected', 'true');
  });

  it('skips a disabled tab, and will not select it on click', () => {
    const onChange = vi.fn();
    const items = [...ITEMS.slice(0, 2), { value: 'board', label: 'Board', disabled: true }];
    setup({ items, onChange, defaultValue: 'list' });

    expect(tab('Board')).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(tab('Board'));
    expect(onChange).not.toHaveBeenCalled();

    /* From List, Right wraps past the disabled Board to Grid. */
    fireEvent.keyDown(tab('List'), { key: 'ArrowRight' });
    expect(tab('Grid')).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(tab('Grid'), { key: 'End' });
    expect(tab('List')).toHaveAttribute('aria-selected', 'true');
  });

  it('wires a tab to its panel', () => {
    setup({ items: ITEMS.map((item) => ({ ...item, panelId: 'panel' })) });
    expect(tab('Grid')).toHaveAttribute('aria-controls', 'panel');
  });

  it('respects a controlled value', () => {
    const onChange = vi.fn();
    setup({ value: 'list', onChange });
    fireEvent.click(tab('Board'));
    expect(onChange).toHaveBeenCalledWith('board');
    expect(tab('List')).toHaveAttribute('aria-selected', 'true');
  });
});
