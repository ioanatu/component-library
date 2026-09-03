import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { buttonSizes, buttonVariants } from '../types';
import { Button } from './Button';
import styles from './Button.module.css';

describe('Button', () => {
  const onClick = vi.fn();

  beforeEach(() => {
    onClick.mockClear();
  });

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

  it.each(buttonVariants)('renders button %s', (variant) => {
    render(<Button type="button" label="Varied" variant={variant} />);
    expect(screen.getByRole('button', { name: 'Varied' })).toHaveClass(
      ...[styles.button, styles[variant]].filter(Boolean),
    );
  });
});
