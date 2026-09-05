import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { cardVariants } from '../types';
import { Card } from './Card';
import styles from './Card.module.css';

describe('Card', () => {
  const onClick = vi.fn();

  beforeEach(() => onClick.mockClear());

  it('renders its title as a heading and its children as the body', () => {
    render(<Card title="Token-driven">Every value is a custom property.</Card>);
    expect(screen.getByRole('heading', { name: 'Token-driven' })).toBeInTheDocument();
    expect(screen.getByText('Every value is a custom property.')).toBeInTheDocument();
  });

  it('renders nothing but a surface when given neither title nor children', () => {
    const { container } = render(<Card />);
    expect(container.firstChild).toHaveClass(styles.card);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('keeps consumer class names alongside its own', () => {
    const { container } = render(<Card title="Card" className="custom" />);
    expect(container.firstChild).toHaveClass(styles.card, 'custom');
  });

  it('forwards unknown props to the root element', () => {
    const { container } = render(<Card title="Card" id="card-1" data-testid="card" />);
    expect(container.firstChild).toHaveAttribute('id', 'card-1');
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('forwards its ref to the underlying element', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(<Card title="Card" ref={ref} />);
    expect(ref.current).toBe(container.firstChild);
  });

  describe('title', () => {
    it('is an h3 by default', () => {
      render(<Card title="Card" />);
      expect(screen.getByRole('heading', { level: 3, name: 'Card' })).toBeInTheDocument();
    });

    it.each([2, 3, 4, 5, 6] as const)('renders at level %s when asked', (level) => {
      render(<Card title="Card" titleLevel={level} />);
      expect(screen.getByRole('heading', { level, name: 'Card' })).toBeInTheDocument();
    });

    it('is omitted entirely when no title is given', () => {
      render(<Card>Body only</Card>);
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
  });

  describe('variant', () => {
    it('carries the shadow by default, which is the base card and has no class', () => {
      const { container } = render(<Card title="Card" />);
      expect(container.firstChild).toHaveClass(styles.card);
      expect(container.firstChild).not.toHaveClass(styles.flat);
    });

    it('drops the shadow when flat', () => {
      const { container } = render(<Card title="Card" variant="flat" />);
      expect(container.firstChild).toHaveClass(styles.card, styles.flat);
    });

    it.each(cardVariants)('renders the %s variant', (variant) => {
      const { container } = render(<Card title="Card" variant={variant} />);
      expect(container.firstChild).toHaveClass(styles.card);
      expect((container.firstChild as HTMLElement).className).not.toContain('undefined');
    });
  });

  describe('adornments', () => {
    it('hides a decorative icon from assistive technology', () => {
      render(<Card title="Card" icon={<span data-testid="icon">*</span>} />);
      expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders an action beside the title', () => {
      render(<Card title="Card" action={<button type="button">Menu</button>} />);
      const action = screen.getByRole('button', { name: 'Menu' });
      expect(action.parentElement).toHaveClass(styles.action);
      expect(action.parentElement?.parentElement).toHaveClass(styles.header);
    });

    it('renders an action on a card with no title', () => {
      render(<Card action={<button type="button">Menu</button>}>Body</Card>);
      expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('omits both wrappers when neither is given', () => {
      const { container } = render(<Card title="Card" />);
      expect(container.querySelector(`.${styles.icon}`)).toBeNull();
      expect(container.querySelector(`.${styles.action}`)).toBeNull();
    });
  });

  describe('with href', () => {
    it('turns the whole card into a link', () => {
      render(<Card title="Get started" href="#card" />);
      const link = screen.getByRole('link', { name: 'Get started' });
      expect(link).toHaveAttribute('href', '#card');
      expect(link).toHaveClass(styles.card, styles.link);
    });

    it('keeps the title a heading inside the link', () => {
      render(<Card title="Get started" href="#card" />);
      expect(screen.getByRole('heading', { level: 3, name: 'Get started' })).toBeInTheDocument();
    });

    it('supports click interactions', () => {
      render(<Card title="Go" href="#card" onClick={onClick} />);
      fireEvent.click(screen.getByRole('link', { name: 'Go' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('passes the click event so a handler can take over navigation', () => {
      const handleClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
      render(<Card title="Scroll" href="#card" onClick={handleClick} />);

      const link = screen.getByRole('link', { name: 'Scroll' });
      const event = createEvent.click(link);
      fireEvent(link, event);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(event.defaultPrevented).toBe(true);
    });

    it('keeps the flat variant', () => {
      render(<Card title="Go" href="#card" variant="flat" />);
      expect(screen.getByRole('link', { name: 'Go' })).toHaveClass(styles.flat, styles.link);
    });

    it('forwards its ref to the underlying anchor element', () => {
      const ref = createRef<HTMLElement>();
      render(<Card title="Go" href="#card" ref={ref} />);
      expect(ref.current).toBe(screen.getByRole('link', { name: 'Go' }));
    });

    it('is a div rather than a link without href', () => {
      render(<Card title="Static" />);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });
});
