import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WeatherIcon } from './WeatherIcon';

describe('WeatherIcon', () => {
  it('renders the expected icon label for a WMO code', () => {
    render(<WeatherIcon weatherCode={0} />);
    expect(screen.getByLabelText('Ceu limpo')).toBeInTheDocument();
  });

  it('accepts size and className props', () => {
    render(<WeatherIcon weatherCode={2} size={32} className="custom-icon" />);
    expect(screen.getByLabelText('Parcialmente nublado')).toHaveClass('custom-icon');
  });
});
