import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders with an accessible name', () => {
    render(<Button>Save changes</Button>);

    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
  });

  it('uses type=button by default', () => {
    render(<Button>Action</Button>);

    expect(screen.getByRole('button', { name: 'Action' })).toHaveAttribute('type', 'button');
  });

  it('supports click interactions when enabled', () => {
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Continue</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('prevents interaction when disabled', () => {
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Cannot press
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Cannot press' });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('announces busy state while loading', () => {
    render(<Button isLoading>Saving</Button>);

    const button = screen.getByRole('button', { name: /saving/i });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
  });
});
