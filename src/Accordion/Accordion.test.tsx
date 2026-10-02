import { fireEvent, render, screen } from '@testing-library/react';
import { Accordion, type AccordionItem } from './Accordion';

const ITEMS: AccordionItem[] = [
  { id: 'a', title: 'First', content: 'Alpha' },
  { id: 'b', title: 'Second', content: 'Beta' },
  { id: 'c', title: 'Third', content: 'Gamma', disabled: true },
];

const button = (name: string) => screen.getByRole('button', { name });

describe('Accordion', () => {
  it('wires each header button to its labelled region', () => {
    render(<Accordion items={ITEMS} defaultExpanded={['a']} headingLevel={2} />);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3);
    expect(button('First')).toHaveAttribute('aria-expanded', 'true');
    const region = screen.getByRole('region', { name: 'First' });
    expect(button('First')).toHaveAttribute('aria-controls', region.id);
    expect(region).toHaveTextContent('Alpha');
  });

  it('hides closed panels so find-in-page can still reach them', () => {
    render(<Accordion items={ITEMS} />);
    const panel = document.getElementById(button('Second').getAttribute('aria-controls')!)!;
    expect(panel).toHaveAttribute('hidden', 'until-found');
    fireEvent(panel, new Event('beforematch'));
    expect(button('Second')).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps one section open unless multiple is set', () => {
    const { rerender } = render(<Accordion items={ITEMS} />);
    fireEvent.click(button('First'));
    fireEvent.click(button('Second'));
    expect(button('First')).toHaveAttribute('aria-expanded', 'false');
    expect(button('Second')).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(button('Second'));
    expect(button('Second')).toHaveAttribute('aria-expanded', 'false');

    rerender(<Accordion items={ITEMS} multiple key="multi" />);
    fireEvent.click(button('First'));
    fireEvent.click(button('Second'));
    expect(button('First')).toHaveAttribute('aria-expanded', 'true');
    expect(button('Second')).toHaveAttribute('aria-expanded', 'true');
  });

  it('moves between enabled headers with arrows, Home and End', () => {
    render(<Accordion items={ITEMS} />);
    button('First').focus();
    fireEvent.keyDown(button('First'), { key: 'ArrowDown' });
    expect(button('Second')).toHaveFocus();
    fireEvent.keyDown(button('Second'), { key: 'ArrowDown' });
    expect(button('First')).toHaveFocus();
    fireEvent.keyDown(button('First'), { key: 'End' });
    expect(button('Second')).toHaveFocus();
    fireEvent.keyDown(button('Second'), { key: 'Home' });
    expect(button('First')).toHaveFocus();
    expect(button('Third')).toBeDisabled();
  });
});
