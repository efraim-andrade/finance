import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { LabelButton } from './label-button';

describe('LabelButton', () => {
  it('renders children text', () => {
    render(<LabelButton>Filter</LabelButton>);

    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('renders icon when passed', () => {
    const { container } = render(
      <LabelButton icon={(props) => <svg data-testid="icon" {...props} />}>
        With Icon
      </LabelButton>,
    );

    expect(container.querySelector('[data-testid="icon"]')).toBeInTheDocument();
  });

  it('does not render icon when not passed', () => {
    const { container } = render(<LabelButton>No Icon</LabelButton>);

    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('uses md size by default', () => {
    render(<LabelButton>Default</LabelButton>);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('data-size', 'default');
  });

  it('uses sm size when specified', () => {
    render(<LabelButton size="sm">Small</LabelButton>);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('data-size', 'sm');
  });

  it('applies disabled attribute and styling', () => {
    render(<LabelButton disabled>Disabled</LabelButton>);

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('merges custom className', () => {
    render(<LabelButton className="extra-class">Styled</LabelButton>);

    const button = screen.getByRole('button');

    expect(button.className).toContain('extra-class');
  });

  it('uses secondary variant by default', () => {
    render(<LabelButton>Secondary</LabelButton>);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('data-variant', 'outline');
  });

  it('uses primary variant when specified', () => {
    render(<LabelButton variant="primary">Primary</LabelButton>);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('data-variant', 'default');
  });

  it('passes additional HTML attributes through', () => {
    render(
      <LabelButton type="submit" aria-label="Apply filter">
        Submit
      </LabelButton>,
    );

    const button = screen.getByRole('button', { name: 'Apply filter' });

    expect(button).toHaveAttribute('type', 'submit');
  });
});
