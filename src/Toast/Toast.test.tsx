import { act, fireEvent, render, screen } from '@testing-library/react';
import { Toast, ToastRegion } from './Toast';

describe('Toast', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('announces politely by default without taking focus', () => {
    render(<Toast tone="success" title="Project created" />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).toHaveAttribute('aria-atomic', 'true');
    expect(toast).not.toHaveFocus();
  });

  it('announces an error assertively', () => {
    render(<Toast tone="error" title="Could not save" />);
    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'assertive');
  });

  it('dismisses itself after the duration', () => {
    const onDismiss = vi.fn();
    render(<Toast title="Saved" duration={3000} onDismiss={onDismiss} />);

    act(() => vi.advanceTimersByTime(2999));
    expect(onDismiss).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('never auto-dismisses an error', () => {
    const onDismiss = vi.fn();
    render(<Toast tone="error" title="Could not save" onDismiss={onDismiss} />);
    act(() => vi.advanceTimersByTime(60000));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('holds the timer while hovered', () => {
    const onDismiss = vi.fn();
    render(<Toast title="Saved" duration={3000} onDismiss={onDismiss} />);
    const toast = screen.getByRole('status');

    fireEvent.mouseEnter(toast);
    act(() => vi.advanceTimersByTime(10000));
    expect(onDismiss).not.toHaveBeenCalled();

    fireEvent.mouseLeave(toast);
    act(() => vi.advanceTimersByTime(3000));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('holds the timer while focused', () => {
    const onDismiss = vi.fn();
    render(<Toast title="Saved" duration={3000} onDismiss={onDismiss} />);
    fireEvent.focus(screen.getByRole('status'));
    act(() => vi.advanceTimersByTime(10000));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('dismisses on the close button', () => {
    const onDismiss = vi.fn();
    render(<Toast title="Saved" duration={0} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('omits the close button without a dismiss handler, or when not dismissible', () => {
    const { unmount } = render(<Toast title="Saved" />);
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
    unmount();

    render(<Toast title="Saved" dismissible={false} onDismiss={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
  });

  it('renders detail and an action', () => {
    render(
      <Toast title="Archived" duration={0} action={<button type="button">Undo</button>}>
        Kept for 30 days.
      </Toast>,
    );
    expect(screen.getByText('Kept for 30 days.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
  });
});

describe('ToastRegion', () => {
  it('is a labelled landmark that holds its toasts', () => {
    render(
      <ToastRegion>
        <Toast title="One" />
        <Toast title="Two" />
      </ToastRegion>,
    );
    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region).toBeInTheDocument();
    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(region).toContainElement(screen.getByText('One'));
  });

  it('stays in the DOM when empty, so the live region pre-exists', () => {
    render(<ToastRegion />);
    expect(screen.getByRole('region', { name: 'Notifications' })).toBeEmptyDOMElement();
  });
});
