import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { chipVariants, libSizes } from '../types';
import { Chip } from './Chip';
import styles from './Chip.module.css';

describe('Chip', () => {
  const onClick = vi.fn();
  const onDelete = vi.fn();

  beforeEach(() => {
    onClick.mockClear();
    onDelete.mockClear();
  });

  it('renders a plain label that is not interactive', () => {
    const { container } = render(<Chip label="React 19" />);
    expect(screen.getByText('React 19')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass(styles.chip, styles.primary, styles.md);
    expect(container.firstChild).not.toHaveClass(styles.clickable);
  });

  it('keeps consumer class names alongside its own', () => {
    const { container } = render(<Chip label="React 19" className="custom" />);
    expect(container.firstChild).toHaveClass(styles.chip, 'custom');
  });

  it('forwards unknown props to the root element', () => {
    const { container } = render(<Chip label="React 19" id="chip-1" title="A tag" />);
    expect(container.firstChild).toHaveAttribute('id', 'chip-1');
    expect(container.firstChild).toHaveAttribute('title', 'A tag');
  });

  it.each(chipVariants)('renders chip %s', (variant) => {
    const { container } = render(<Chip label="Varied" variant={variant} />);
    expect(container.firstChild).toHaveClass(styles.chip, styles[variant]);
  });

  it.each(libSizes)('renders chip %s', (size) => {
    const { container } = render(<Chip label="Sized" size={size} />);
    expect(container.firstChild).toHaveClass(styles.chip, styles[size]);
  });

  describe('with onClick', () => {
    it('renders a button of type button', () => {
      render(<Chip label="Filter" onClick={onClick} />);
      const chip = screen.getByRole('button', { name: 'Filter' });
      expect(chip).toHaveAttribute('type', 'button');
      expect(chip).toHaveClass(styles.chip, styles.clickable);
    });

    it('supports click interactions when enabled', () => {
      render(<Chip label="Filter" onClick={onClick} />);
      fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('prevents interaction when disabled', () => {
      render(<Chip label="Filter" onClick={onClick} disabled />);
      const chip = screen.getByRole('button', { name: 'Filter' });
      expect(chip).toBeDisabled();
      fireEvent.click(chip);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('forwards its ref to the underlying button element', () => {
      const ref = createRef<HTMLElement>();
      render(<Chip label="Filter" onClick={onClick} ref={ref} />);
      expect(ref.current).toBe(screen.getByRole('button', { name: 'Filter' }));
    });
  });

  describe('with href', () => {
    it('renders an anchor that navigates instead of a button', () => {
      render(<Chip label="typescript" href="#tags" />);
      const link = screen.getByRole('link', { name: 'typescript' });
      expect(link).toHaveAttribute('href', '#tags');
      expect(link).toHaveClass(styles.chip, styles.clickable);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('passes the click event so a handler can take over navigation', () => {
      const handleClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
      render(<Chip label="typescript" href="#tags" onClick={handleClick} />);

      const link = screen.getByRole('link', { name: 'typescript' });
      const event = createEvent.click(link);
      fireEvent(link, event);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(event.defaultPrevented).toBe(true);
    });

    it('drops the href when disabled so the link cannot be followed', () => {
      const { container } = render(
        <Chip label="typescript" href="#tags" disabled onClick={onClick} />,
      );
      const anchor = container.querySelector('a');

      expect(anchor).not.toHaveAttribute('href');
      expect(anchor).toHaveAttribute('aria-disabled', 'true');
      fireEvent.click(anchor!);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not let a disabled link bubble its click to an ancestor', () => {
      const onAncestorClick = vi.fn();
      render(
        /* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events --
           a bare ancestor listener is the point of the test. */
        <div onClick={onAncestorClick}>
          <Chip label="typescript" href="#tags" disabled onClick={onClick} />
        </div>,
      );
      fireEvent.click(screen.getByText('typescript'));
      expect(onClick).not.toHaveBeenCalled();
      expect(onAncestorClick).not.toHaveBeenCalled();
    });

    it('forwards its ref to the underlying anchor element', () => {
      const ref = createRef<HTMLElement>();
      render(<Chip label="typescript" href="#tags" ref={ref} />);
      expect(ref.current).toBe(screen.getByRole('link', { name: 'typescript' }));
    });
  });

  describe('with onDelete', () => {
    it('names the remove button after the chip', () => {
      render(<Chip label="react" onDelete={onDelete} />);
      expect(screen.getByRole('button', { name: 'Remove react' })).toBeInTheDocument();
    });

    it('lets deleteLabel override the remove button name', () => {
      render(<Chip label="react" onDelete={onDelete} deleteLabel="Remove the react filter" />);
      expect(screen.getByRole('button', { name: 'Remove the react filter' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Remove react' })).not.toBeInTheDocument();
    });

    it('renders a custom delete icon', () => {
      render(<Chip label="react" onDelete={onDelete} deleteIcon={<span>x</span>} />);
      expect(screen.getByRole('button', { name: 'Remove react' })).toHaveTextContent('x');
    });

    it('calls onDelete when the remove button is clicked', () => {
      render(<Chip label="react" onDelete={onDelete} />);
      fireEvent.click(screen.getByRole('button', { name: 'Remove react' }));
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('does not let a removal bubble to an ancestor handler', () => {
      const onAncestorClick = vi.fn();
      render(
        /* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events --
           a bare ancestor listener is the point of the test. */
        <div onClick={onAncestorClick}>
          <Chip label="react" onDelete={onDelete} />
        </div>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Remove react' }));
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onAncestorClick).not.toHaveBeenCalled();
    });

    it('keeps the chip a label when only onDelete is given', () => {
      render(<Chip label="react" onDelete={onDelete} />);
      expect(screen.getAllByRole('button')).toHaveLength(1);
      expect(screen.queryByRole('button', { name: 'react' })).not.toBeInTheDocument();
    });

    it('pairs a clickable chip with a sibling remove button, not a nested one', () => {
      const { container } = render(<Chip label="react" onClick={onClick} onDelete={onDelete} />);
      const action = screen.getByRole('button', { name: 'react' });
      const remove = screen.getByRole('button', { name: 'Remove react' });

      expect(action.querySelector('button')).toBeNull();
      expect(action.parentElement).toBe(remove.parentElement);
      expect(container.firstChild).toHaveClass(styles.chip, styles.clickable, styles.hasDelete);
    });

    it('removes without triggering the chip action', () => {
      render(<Chip label="react" onClick={onClick} onDelete={onDelete} />);
      fireEvent.click(screen.getByRole('button', { name: 'Remove react' }));
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('renders a link chip that is also removable', () => {
      render(<Chip label="react" href="#tags" onDelete={onDelete} />);
      expect(screen.getByRole('link', { name: 'react' })).toHaveAttribute('href', '#tags');
      expect(screen.getByRole('button', { name: 'Remove react' })).toBeInTheDocument();
    });

    it('drops the href of a disabled removable link', () => {
      const { container } = render(
        <Chip label="react" href="#tags" onDelete={onDelete} disabled onClick={onClick} />,
      );
      const anchor = container.querySelector('a');

      expect(anchor).not.toHaveAttribute('href');
      expect(anchor).toHaveAttribute('aria-disabled', 'true');
      fireEvent.click(anchor!);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('disables the remove button and the action when disabled', () => {
      render(<Chip label="react" onClick={onClick} onDelete={onDelete} disabled />);
      const remove = screen.getByRole('button', { name: 'Remove react' });

      expect(remove).toBeDisabled();
      expect(screen.getByRole('button', { name: 'react' })).toBeDisabled();
      fireEvent.click(remove);
      expect(onDelete).not.toHaveBeenCalled();
    });

    it('forwards its ref to the wrapping element', () => {
      const ref = createRef<HTMLElement>();
      const { container } = render(<Chip label="react" onDelete={onDelete} ref={ref} />);
      expect(ref.current).toBe(container.firstChild);
    });

    describe('keyboard', () => {
      it.each(['Backspace', 'Delete'])('removes the chip on %s released', (key) => {
        render(<Chip label="react" onDelete={onDelete} />);
        fireEvent.keyUp(screen.getByRole('button', { name: 'Remove react' }), { key });
        expect(onDelete).toHaveBeenCalledTimes(1);
      });

      it.each(['Backspace', 'Delete'])(
        'claims %s on keydown so the browser cannot navigate back',
        (key) => {
          render(<Chip label="react" onDelete={onDelete} />);
          const remove = screen.getByRole('button', { name: 'Remove react' });
          const event = createEvent.keyDown(remove, { key });
          fireEvent(remove, event);
          expect(event.defaultPrevented).toBe(true);
        },
      );

      it("runs the consumer's own key handlers alongside its own", () => {
        const onKeyUp = vi.fn();
        render(<Chip label="react" onDelete={onDelete} onKeyUp={onKeyUp} />);
        fireEvent.keyUp(screen.getByRole('button', { name: 'Remove react' }), { key: 'Backspace' });
        expect(onKeyUp).toHaveBeenCalledTimes(1);
        expect(onDelete).toHaveBeenCalledTimes(1);
      });

      it('ignores other keys', () => {
        render(<Chip label="react" onDelete={onDelete} />);
        fireEvent.keyUp(screen.getByRole('button', { name: 'Remove react' }), { key: 'a' });
        expect(onDelete).not.toHaveBeenCalled();
      });

      it('blurs the chip on Escape', () => {
        render(<Chip label="react" onClick={onClick} onDelete={onDelete} />);
        const action = screen.getByRole('button', { name: 'react' });
        action.focus();
        expect(action).toHaveFocus();

        fireEvent.keyUp(action, { key: 'Escape' });
        expect(action).not.toHaveFocus();
        expect(onDelete).not.toHaveBeenCalled();
      });

      it('does not remove a disabled chip', () => {
        render(<Chip label="react" onDelete={onDelete} disabled />);
        const remove = screen.getByRole('button', { name: 'Remove react' });
        const event = createEvent.keyDown(remove, { key: 'Backspace' });

        fireEvent(remove, event);
        fireEvent.keyUp(remove, { key: 'Backspace' });

        expect(event.defaultPrevented).toBe(false);
        expect(onDelete).not.toHaveBeenCalled();
      });
    });
  });

  describe('adornments', () => {
    it('hides a decorative icon from assistive technology', () => {
      render(<Chip label="design" icon={<span data-testid="icon">*</span>} />);
      expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByText('design')).toBeInTheDocument();
    });

    it('leaves an avatar exposed so its own alternative text is used', () => {
      render(<Chip label="Ada" avatar={<img src="ada.png" alt="Ada Lovelace" />} />);
      const avatar = screen.getByAltText('Ada Lovelace');
      expect(avatar.parentElement).toHaveClass(styles.avatar);
      expect(avatar.parentElement).not.toHaveAttribute('aria-hidden');
    });

    it('gives the avatar precedence over the icon', () => {
      render(
        <Chip
          label="Ada"
          avatar={<span data-testid="avatar">AL</span>}
          icon={<span data-testid="icon">*</span>}
        />,
      );
      expect(screen.getByTestId('avatar')).toBeInTheDocument();
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    });
  });

  it('marks a disabled static chip as disabled', () => {
    const { container } = render(<Chip label="React 19" disabled />);
    expect(container.firstChild).toHaveAttribute('aria-disabled', 'true');
  });

  it('forwards its ref to the underlying span element', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(<Chip label="React 19" ref={ref} />);
    expect(ref.current).toBe(container.firstChild);
  });
});
