import { fireEvent, render, screen } from '@testing-library/react';
import { Avatar, initialsOf } from './Avatar';
import styles from './Avatar.module.css';
import { AvatarGroup } from './AvatarGroup';

describe('Avatar', () => {
  it('takes initials from the first and last word', () => {
    expect(initialsOf('Ada Lovelace')).toBe('AL');
    expect(initialsOf('m.reyes')).toBe('MR');
    expect(initialsOf('Cher')).toBe('C');
    expect(initialsOf('  ')).toBe('');
  });

  it('is one image named after the person', () => {
    render(<Avatar name="m.reyes" />);
    expect(screen.getByRole('img', { name: 'm.reyes' })).toHaveTextContent('MR');
  });

  it('hides itself when decorative', () => {
    const { container } = render(<Avatar name="m.reyes" decorative />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('falls back to initials when the photo fails', () => {
    const { container } = render(<Avatar name="m.reyes" src="/missing.png" />);
    const image = container.querySelector('img')!;
    expect(image).toHaveAttribute('alt', '');
    fireEvent.error(image);
    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'm.reyes' })).toHaveTextContent('MR');
  });

  it('takes its size from the group', () => {
    render(
      <AvatarGroup label="Reviewers" size="lg">
        <Avatar name="m.reyes" />
      </AvatarGroup>,
    );
    expect(screen.getByRole('img', { name: 'm.reyes' })).toHaveClass(styles.lg);
  });
});

describe('AvatarGroup', () => {
  it('caps the row at max and counts the rest', () => {
    render(
      <AvatarGroup label="Reviewers" max={2}>
        <Avatar name="ioana.t" />
        <Avatar name="m.reyes" />
        <Avatar name="k.bauer" />
      </AvatarGroup>,
    );
    expect(screen.getByRole('group', { name: 'Reviewers' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'k.bauer' })).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: '1 more' })).toHaveTextContent('+1');
  });

  it('counts against total when not everyone is passed', () => {
    render(
      <AvatarGroup label="Reviewers" total={12}>
        <Avatar name="ioana.t" />
        <Avatar name="m.reyes" />
        <Avatar name="k.bauer" />
      </AvatarGroup>,
    );
    expect(screen.getByRole('img', { name: '9 more' })).toBeInTheDocument();
  });
});
