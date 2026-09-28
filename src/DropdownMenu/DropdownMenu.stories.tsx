import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ButtonNew } from '../ButtonNew/ButtonNew';
import { menuPlacements } from '../types';
import { Body } from '../Typography';
import { DropdownMenu } from './DropdownMenu';
import { MenuGroup, MenuItem, MenuSeparator } from './MenuItem';

/**
 * Dropdown menu following the OFFSET design system: a bordered surface with the
 * offset shadow, hung off its trigger.
 *
 * - **A menu of actions, not a value picker** — the APG menu-button pattern. A
 *   `<button aria-haspopup="menu">` opens a `role="menu"` and focus moves into the
 *   items, so the whole thing behaves as one control. Choosing a *value* is a
 *   listbox or a native select, which is a different component.
 * - **Keyboard** — Enter, Space or Down opens on the first item, Up opens on the
 *   last. Inside: Up/Down wrap, Home/End jump to the ends, typing jumps to an item
 *   by name, Escape closes and returns focus to the trigger, Tab closes and moves on.
 * - **Hover focuses** — so mouse and keyboard converge on one highlight instead of
 *   showing two at once.
 * - **Disabled items stay focusable** via `aria-disabled`, so the keyboard can still
 *   discover them. They just do nothing.
 * - **Flips and clamps** — the corner gives way on collision in both axes, and the
 *   height is capped by the space actually available, so it never runs off screen.
 *
 * Positioned relative to the trigger rather than portaled, so an ancestor with
 * `overflow: hidden` will clip it.
 *
 * Import
 * ---
 *
 * `import { DropdownMenu, MenuItem, MenuSeparator, MenuGroup } from '@ioanatu/component-library';`
 */

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  argTypes: {
    placement: { control: 'inline-radio', options: menuPlacements },
    maxHeight: { control: { type: 'number', min: 100, step: 20 } },
    minWidth: { control: { type: 'number', min: 120, step: 10 } },
    maxWidth: { control: { type: 'number', min: 160, step: 10 } },
    trigger: { control: false },
    children: { control: false },
  },
  args: {
    placement: 'bottom-start',
    minWidth: 200,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const actions = (
  <>
    <MenuItem onSelect={() => {}} shortcut="⌘E">
      Edit project
    </MenuItem>
    <MenuItem onSelect={() => {}} shortcut="⌘D">
      Duplicate
    </MenuItem>
    <MenuItem onSelect={() => {}}>Move to…</MenuItem>
    <MenuSeparator />
    <MenuItem destructive onSelect={() => {}}>
      Delete project
    </MenuItem>
  </>
);

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: '20px 20px 240px' }}>
      <DropdownMenu {...args} trigger={<ButtonNew variant="secondary">Actions</ButtonNew>}>
        {actions}
      </DropdownMenu>
    </div>
  ),
};

/** Each corner is a preference; all four flip if the menu would leave the viewport. */
export const Placements: Story = {
  argTypes: { placement: { control: false, table: { disable: true } } },
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, max-content)',
        gap: 60,
        padding: '200px 60px',
      }}
    >
      {menuPlacements.map((placement) => (
        <DropdownMenu
          {...args}
          key={placement}
          placement={placement}
          trigger={<ButtonNew variant="secondary">{placement}</ButtonNew>}
        >
          {actions}
        </DropdownMenu>
      ))}
    </div>
  ),
};

/**
 * `maxHeight` caps the list and the rest scrolls. Arrowing past the edge keeps the
 * focused item in view, and the cap is reduced further if the viewport has less room
 * than asked for.
 */
export const MaxHeight: Story = {
  args: { maxHeight: 240 },
  render: (args) => (
    <div style={{ padding: '20px 20px 300px' }}>
      <DropdownMenu {...args} trigger={<ButtonNew variant="secondary">Assign to…</ButtonNew>}>
        {[
          'Ada Lovelace',
          'Alan Turing',
          'Barbara Liskov',
          'Donald Knuth',
          'Edsger Dijkstra',
          'Grace Hopper',
          'Ken Thompson',
          'Margaret Hamilton',
          'Radia Perlman',
          'Tim Berners-Lee',
        ].map((person) => (
          <MenuItem key={person} onSelect={() => {}}>
            {person}
          </MenuItem>
        ))}
      </DropdownMenu>
    </div>
  ),
};

/** A labelled set is a `role="group"` with its label tied on by `aria-labelledby`. */
export const Groups: Story = {
  render: (args) => (
    <div style={{ padding: '20px 20px 320px' }}>
      <DropdownMenu {...args} trigger={<ButtonNew variant="secondary">Export</ButtonNew>}>
        <MenuGroup label="This project">
          <MenuItem onSelect={() => {}}>Export as CSV</MenuItem>
          <MenuItem onSelect={() => {}}>Export as JSON</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup label="Everything">
          <MenuItem onSelect={() => {}}>Export all projects</MenuItem>
          <MenuItem disabled onSelect={() => {}}>
            Export audit log
          </MenuItem>
        </MenuGroup>
      </DropdownMenu>
    </div>
  ),
};

/**
 * A disabled item keeps its place in the arrow order. Tab to the trigger, open with
 * Down and arrow through: the disabled one is reachable and announced, but nothing
 * happens when you activate it.
 */
export const DisabledItems: Story = {
  render: (args) => (
    <div style={{ padding: '20px 20px 240px' }}>
      <DropdownMenu {...args} trigger={<ButtonNew variant="secondary">Actions</ButtonNew>}>
        <MenuItem onSelect={() => {}}>Edit project</MenuItem>
        <MenuItem disabled onSelect={() => {}}>
          Duplicate — needs a paid plan
        </MenuItem>
        <MenuItem onSelect={() => {}}>Move to…</MenuItem>
        <MenuSeparator />
        <MenuItem destructive disabled onSelect={() => {}}>
          Delete project
        </MenuItem>
      </DropdownMenu>
    </div>
  ),
};

/** `href` renders the item as a link, so middle-click and copy-link still work. */
export const LinkItems: Story = {
  render: (args) => (
    <div style={{ padding: '20px 20px 240px' }}>
      <DropdownMenu {...args} trigger={<ButtonNew variant="secondary">Help</ButtonNew>}>
        <MenuItem href="#docs">Documentation</MenuItem>
        <MenuItem href="#changelog">Changelog</MenuItem>
        <MenuSeparator />
        <MenuItem onSelect={() => {}}>Contact support</MenuItem>
      </DropdownMenu>
    </div>
  ),
};

/** Long labels wrap rather than truncate, so nothing is hidden. `maxWidth` caps it. */
export const LongLabels: Story = {
  args: { maxWidth: 260 },
  render: (args) => (
    <div style={{ padding: '20px 20px 260px' }}>
      <DropdownMenu {...args} trigger={<ButtonNew variant="secondary">Bulk actions</ButtonNew>}>
        <MenuItem onSelect={() => {}}>Re-run every failed migration in this environment</MenuItem>
        <MenuItem onSelect={() => {}}>Archive</MenuItem>
      </DropdownMenu>
    </div>
  ),
};

/**
 * `closeOnSelect={false}` leaves the menu open, for an item that toggles something
 * the user may want to change again straight away.
 */
export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [density, setDensity] = useState('comfortable');

    return (
      <div style={{ display: 'grid', gap: 16, justifyItems: 'start', padding: '20px 20px 240px' }}>
        <DropdownMenu
          {...args}
          open={open}
          onOpenChange={setOpen}
          trigger={<ButtonNew variant="secondary">View options</ButtonNew>}
        >
          {['comfortable', 'compact'].map((option) => (
            <MenuItem key={option} closeOnSelect={false} onSelect={() => setDensity(option)}>
              {option === density ? `✓ ${option}` : option}
            </MenuItem>
          ))}
        </DropdownMenu>

        <Body level={3} tone="muted">
          Density: {density} · menu {open ? 'open' : 'closed'}
        </Body>
      </div>
    );
  },
};
