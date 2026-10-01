import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';
import styles from './Alert.module.css';

describe('Alert', () => {
  it('is silent by default', () => {
    render(<Alert title="Saved" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('maps announce to a live region role', () => {
    const { rerender } = render(<Alert title="Saved" announce="polite" />);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
    rerender(<Alert title="Failed" announce="assertive" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
  });

  it('renders the title as a heading when given a level', () => {
    render(<Alert title="There is a problem" headingLevel={2} />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'There is a problem' }),
    ).toBeInTheDocument();
  });

  it('applies the tone class and forwards props', () => {
    const { container } = render(<Alert tone="danger" tabIndex={-1} title="x" />);
    expect(container.firstChild).toHaveClass(styles.alert, styles.danger);
    expect(container.firstChild).toHaveAttribute('tabindex', '-1');
  });
});
