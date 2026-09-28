import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import { DropdownMenu } from './DropdownMenu';
import { MenuCheckboxItem, MenuItem } from './MenuItem';

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

  it('activates the focused item with Space rather than treating it as typeahead', () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu trigger={<button type="button">Menu</button>}>
        <MenuItem onSelect={onSelect}>Only</MenuItem>
      </DropdownMenu>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));

    const item = screen.getByRole('menuitem', { name: 'Only' });
    expect(item).toHaveFocus();

    /* Space must reach the item, so the default is not prevented for it. */
    const event = createEvent.keyDown(screen.getByRole('menu'), { key: ' ' });
    fireEvent(screen.getByRole('menu'), event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('closes on pointerdown outside', () => {
    setup();
    fireEvent.click(trigger());
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('adds a chevron to the trigger without losing its label', () => {
    setup();
    expect(trigger()).toHaveAccessibleName('Actions');
    expect(trigger().querySelector('svg')).toBeInTheDocument();
  });

  it('omits the chevron when asked', () => {
    render(
      <DropdownMenu chevron={false} trigger={<button type="button">Actions</button>}>
        <MenuItem onSelect={() => {}}>Edit</MenuItem>
      </DropdownMenu>,
    );
    expect(trigger().querySelector('svg')).toBeNull();
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

describe('MenuCheckboxItem', () => {
  const setupChecks = () =>
    render(
      <DropdownMenu trigger={<button type="button">Columns</button>}>
        <MenuCheckboxItem defaultChecked>Status</MenuCheckboxItem>
        <MenuCheckboxItem>Owner</MenuCheckboxItem>
        <MenuItem onSelect={() => {}}>Show all</MenuItem>
      </DropdownMenu>,
    );

  const open = () => fireEvent.click(screen.getByRole('button', { name: 'Columns' }));

  it('reports its state through the checkbox role', () => {
    setupChecks();
    open();
    expect(screen.getByRole('menuitemcheckbox', { name: 'Status' })).toBeChecked();
    expect(screen.getByRole('menuitemcheckbox', { name: 'Owner' })).not.toBeChecked();
  });

  it('toggles and leaves the menu open', () => {
    setupChecks();
    open();
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Owner' }));
    expect(screen.getByRole('menuitemcheckbox', { name: 'Owner' })).toBeChecked();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('is reached by the arrow keys alongside plain items', () => {
    setupChecks();
    open();
    expect(screen.getByRole('menuitemcheckbox', { name: 'Status' })).toHaveFocus();

    const menu = screen.getByRole('menu');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitemcheckbox', { name: 'Owner' })).toHaveFocus();

    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: 'Show all' })).toHaveFocus();

    fireEvent.keyDown(menu, { key: 'End' });
    expect(screen.getByRole('menuitem', { name: 'Show all' })).toHaveFocus();
  });

  it('notifies with the state it is moving to, controlled', () => {
    const onCheckedChange = vi.fn();
    render(
      <DropdownMenu trigger={<button type="button">Columns</button>}>
        <MenuCheckboxItem checked={false} onCheckedChange={onCheckedChange}>
          Owner
        </MenuCheckboxItem>
      </DropdownMenu>,
    );
    open();
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Owner' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('menuitemcheckbox', { name: 'Owner' })).not.toBeChecked();
  });

  it('draws the state with the library Checkbox, kept out of the tab order', () => {
    setupChecks();
    open();
    const row = screen.getByRole('menuitemcheckbox', { name: 'Status' });
    const input = row.querySelector('input[type="checkbox"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-hidden', 'true');
    expect(input).toHaveAttribute('tabindex', '-1');
    /* The row is the only thing in the menu's item list. */
    expect(row.tagName).toBe('DIV');
  });

  it('toggles on Enter and on Space', () => {
    setupChecks();
    open();
    const row = () => screen.getByRole('menuitemcheckbox', { name: 'Owner' });

    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
    expect(row()).toHaveFocus();

    fireEvent.keyDown(row(), { key: ' ' });
    expect(row()).toBeChecked();

    fireEvent.keyDown(row(), { key: 'Enter' });
    expect(row()).not.toBeChecked();
  });

  it('does nothing when disabled', () => {
    const onCheckedChange = vi.fn();
    render(
      <DropdownMenu trigger={<button type="button">Columns</button>}>
        <MenuCheckboxItem disabled onCheckedChange={onCheckedChange}>
          Owner
        </MenuCheckboxItem>
      </DropdownMenu>,
    );
    open();
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Owner' }));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole('menuitemcheckbox', { name: 'Owner' })).not.toBeChecked();
  });
});
