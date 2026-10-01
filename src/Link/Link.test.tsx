import { render, screen } from '@testing-library/react';
import { Link } from './Link';

describe('Link', () => {
  it('renders an anchor with its href', () => {
    render(<Link href="/terms">Terms</Link>);
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
  });

  it('opens external links safely and says so', () => {
    render(
      <Link href="https://example.com" external>
        Example
      </Link>,
    );
    const link = screen.getByRole('link', { name: /^Example\s?\(opens in a new tab\)$/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
