import { fireEvent, render, screen } from '@testing-library/react';
import { DropdownMenu } from './DropdownMenu';
import { MenuItem } from './MenuItem';

const setup = () =>
  render(
    <DropdownMenu trigger={<button type="button">Actions</button>}>
      <MenuItem onSelect={() => {}}>Edit</MenuItem>
      <MenuItem disabled onSelect={() => {}}>
        Duplicate
      </MenuItem>
      <MenuItem onSelect={() => {}}>Move</MenuItem>
    </DropdownMenu>,
  );

describe('DropdownMenu smoke', () => {
  const trigger = () => screen.getByRole('button', { name: 'Actions' });

  it('wires the trigger', () => {
    setup();
    expect(trigger()).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens on click and focuses the first item', () => {
    setup();
    fireEvent.click(trigger());
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  });

  it('opens on ArrowUp focused on the last item', () => {
    setup();
    fireEvent.keyDown(trigger(), { key: 'ArrowUp' });
    expect(screen.getByRole('menuitem', { name: 'Move' })).toHaveFocus();
  });

  it('moves with arrows, wraps, and includes the disabled item', () => {
    setup();
    fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
    const menu = screen.getByRole('menu');

    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();

    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: 'Move' })).toHaveFocus();

    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

    fireEvent.keyDown(menu, { key: 'End' });
    expect(screen.getByRole('menuitem', { name: 'Move' })).toHaveFocus();

    fireEvent.keyDown(menu, { key: 'Home' });
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  });

  it('jumps by typeahead', () => {
    setup();
    fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'm' });
    expect(screen.getByRole('menuitem', { name: 'Move' })).toHaveFocus();
  });

  it('closes on Escape and returns focus to the trigger', () => {
    setup();
    fireEvent.click(trigger());
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
  });

  it('selects an item, closes, and restores focus', () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu trigger={<button type="button">Menu</button>}>
        <MenuItem onSelect={onSelect}>Only</MenuItem>
      </DropdownMenu>,
    );
    const t = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(t);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Only' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(t).toHaveFocus();
  });

  it('does nothing when a disabled item is activated, and stays open', () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu trigger={<button type="button">Menu</button>}>
        <MenuItem disabled onSelect={onSelect}>
          Nope
        </MenuItem>
      </DropdownMenu>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Nope' }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('keeps the menu open for closeOnSelect={false}', () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu trigger={<button type="button">Menu</button>}>
        <MenuItem closeOnSelect={false} onSelect={onSelect}>
          Toggle
        </MenuItem>
      </DropdownMenu>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Toggle' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closes on pointerdown outside', () => {
    setup();
    fireEvent.click(trigger());
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('preserves the trigger own handlers', () => {
    const onClick = vi.fn();
    render(
      <DropdownMenu
        trigger={
          <button type="button" onClick={onClick}>
            Menu
          </button>
        }
      >
        <MenuItem onSelect={() => {}}>Only</MenuItem>
      </DropdownMenu>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
