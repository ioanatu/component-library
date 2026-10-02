import { fireEvent, render, screen } from '@testing-library/react';
import { type TreeItem,TreeView } from './TreeView';

const ITEMS: TreeItem[] = [
  {
    id: 'card',
    label: 'Card',
    children: [
      { id: 'header', label: 'Header', children: [{ id: 'avatar', label: 'Avatar' }] },
      { id: 'media', label: 'Media' },
    ],
  },
  { id: 'footer', label: 'Footer' },
];

const item = (name: string) => screen.getByRole('treeitem', { name: new RegExp(`^${name}`) });

describe('TreeView', () => {
  it('is one tab stop with position info on each item', () => {
    render(<TreeView label="Structure" items={ITEMS} defaultExpandedIds={['card']} />);
    expect(screen.getByRole('tree', { name: 'Structure' })).toBeInTheDocument();
    expect(item('Card')).toHaveAttribute('tabindex', '0');
    expect(item('Header')).toHaveAttribute('tabindex', '-1');
    expect(item('Media')).toHaveAttribute('aria-level', '2');
    expect(item('Media')).toHaveAttribute('aria-posinset', '2');
    expect(item('Media')).toHaveAttribute('aria-setsize', '2');
    expect(item('Card')).toHaveAttribute('aria-expanded', 'true');
    expect(item('Media')).not.toHaveAttribute('aria-expanded');
  });

  it('moves, opens and closes with the arrow keys', () => {
    render(<TreeView label="Structure" items={ITEMS} />);
    item('Card').focus();
    fireEvent.keyDown(item('Card'), { key: 'ArrowRight' });
    expect(item('Card')).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(item('Card'), { key: 'ArrowRight' });
    expect(item('Header')).toHaveFocus();

    fireEvent.keyDown(item('Header'), { key: 'ArrowDown' });
    expect(item('Media')).toHaveFocus();

    fireEvent.keyDown(item('Media'), { key: 'ArrowLeft' });
    expect(item('Card')).toHaveFocus();

    fireEvent.keyDown(item('Card'), { key: 'ArrowLeft' });
    expect(item('Card')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('treeitem', { name: 'Media' })).not.toBeInTheDocument();
  });

  it('jumps with Home, End and type-ahead', () => {
    render(<TreeView label="Structure" items={ITEMS} defaultExpandedIds={['card']} />);
    item('Card').focus();
    fireEvent.keyDown(item('Card'), { key: 'End' });
    expect(item('Footer')).toHaveFocus();
    fireEvent.keyDown(item('Footer'), { key: 'Home' });
    expect(item('Card')).toHaveFocus();
    fireEvent.keyDown(item('Card'), { key: 'm' });
    expect(item('Media')).toHaveFocus();
  });

  it('selects with Enter, Space and click', () => {
    const onSelectedChange = vi.fn();
    render(
      <TreeView
        label="Structure"
        items={ITEMS}
        defaultExpandedIds={['card']}
        onSelectedChange={onSelectedChange}
      />,
    );
    fireEvent.keyDown(item('Media'), { key: 'Enter' });
    expect(onSelectedChange).toHaveBeenLastCalledWith('media');
    expect(item('Media')).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(item('Footer'), { key: ' ' });
    expect(onSelectedChange).toHaveBeenLastCalledWith('footer');

    fireEvent.click(screen.getByText('Header'));
    expect(onSelectedChange).toHaveBeenLastCalledWith('header');
    expect(item('Header')).toHaveAttribute('aria-expanded', 'true');
  });
});
