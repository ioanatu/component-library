import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import type React from 'react';
import { createRef } from 'react';
import { buttonSizes, buttonVariants } from '../types';
import { Button } from './Button';
import styles from './Button.module.css';

describe('Button', () => {
  const onClick = vi.fn();

  beforeEach(() => onClick.mockClear());

  it('renders the label as its accessible name', () => {
    render(<Button type="button" label="Save changes" />);
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
  });

  it('applies the type attribute', () => {
    render(<Button type="submit" label="Action" />);
    expect(screen.getByRole('button', { name: 'Action' })).toHaveAttribute('type', 'submit');
  });

  it('supports click interactions when enabled', () => {
    render(<Button type="button" label="Continue" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('prevents interaction when disabled', () => {
    render(<Button type="button" label="Cannot press" disabled onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Cannot press' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('announces busy state and blocks clicks while loading', () => {
    render(<Button type="button" label="Saving" loading onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Saving' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards its ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button type="button" label="Focus me" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Focus me' }));
  });

  it.each(buttonSizes)('renders button %s', (size) => {
    const { container } = render(<Button type="button" label="Sized" loading size={size} />);
    expect(container.querySelector(`.${styles.loadingSpinner}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sized' })).toHaveClass(styles.button, styles[size]);
  });

  describe('with href', () => {
    it('renders an anchor that navigates instead of a button', () => {
      render(<Button label="Get started" href="#start" />);
      const link = screen.getByRole('link', { name: 'Get started' });
      expect(link).toHaveAttribute('href', '#start');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('keeps the variant and size classes', () => {
      render(<Button label="Get started" href="#start" variant="accent" size="lg" />);
      expect(screen.getByRole('link', { name: 'Get started' })).toHaveClass(
        styles.button,
        styles.accent,
        styles.lg,
      );
    });

    it('supports click interactions', () => {
      render(<Button label="Go" href="#start" onClick={onClick} />);
      fireEvent.click(screen.getByRole('link', { name: 'Go' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('passes the click event so a handler can take over navigation', () => {
      const handleClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
      render(<Button label="Scroll" href="#start" onClick={handleClick} />);

      const event = createEvent.click(screen.getByRole('link', { name: 'Scroll' }));
      fireEvent(screen.getByRole('link', { name: 'Scroll' }), event);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick.mock.calls[0][0]).toBeDefined();
      expect(event.defaultPrevented).toBe(true);
    });

    it('does not let a disabled link bubble its click to an ancestor', () => {
      const onAncestorClick = vi.fn();
      render(
        <div onClick={onAncestorClick}>
          <Button label="Cannot go" href="#start" disabled onClick={onClick} />
        </div>,
      );
      fireEvent.click(screen.getByText('Cannot go'));
      expect(onClick).not.toHaveBeenCalled();
      expect(onAncestorClick).not.toHaveBeenCalled();
    });

    it('drops the href when disabled so the link cannot be followed', () => {
      const { container } = render(
        <Button label="Cannot go" href="#start" disabled onClick={onClick} />,
      );
      const anchor = container.querySelector('a');

      expect(anchor).not.toHaveAttribute('href');
      expect(anchor).toHaveAttribute('aria-disabled', 'true');
      fireEvent.click(anchor!);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('announces busy state and blocks navigation while loading', () => {
      const { container } = render(
        <Button label="Loading" href="#start" loading onClick={onClick} />,
      );
      const anchor = container.querySelector('a');

      expect(anchor).toHaveAttribute('aria-busy', 'true');
      expect(anchor).not.toHaveAttribute('href');
      expect(anchor).toHaveAttribute('aria-disabled', 'true');
      fireEvent.click(anchor!);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('never renders a type attribute on the anchor', () => {
      render(<Button label="Go" href="#start" type="submit" />);
      expect(screen.getByRole('link', { name: 'Go' })).not.toHaveAttribute('type');
    });

    it('forwards its ref to the underlying anchor element', () => {
      const ref = createRef<HTMLAnchorElement>();
      render(<Button label="Focus me" href="#start" ref={ref} />);
      expect(ref.current).toBe(screen.getByRole('link', { name: 'Focus me' }));
    });
  });

  it('renders the success variant with its own class', () => {
    render(<Button type="button" label="Confirm" variant="success" />);
    const button = screen.getByRole('button', { name: 'Confirm' });
    expect(button).toHaveClass(styles.button, styles.success);
    expect(button).not.toHaveClass(styles.danger);
    expect(button).not.toHaveClass(styles.secondary);
  });

  it('renders the accent variant as a filled button', () => {
    render(<Button type="button" label="Get started" variant="accent" />);
    const button = screen.getByRole('button', { name: 'Get started' });
    expect(button).toHaveClass(styles.button, styles.accent);
    expect(button).not.toHaveClass(styles.success);
    expect(button).not.toHaveClass(styles.danger);
  });

  it.each(buttonVariants)('renders button %s', (variant) => {
    render(<Button type="button" label="Varied" variant={variant} />);
    expect(screen.getByRole('button', { name: 'Varied' })).toHaveClass(
      ...[styles.button, styles[variant]].filter(Boolean),
    );
  });
});
