import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeatherIcon } from './WeatherIcon';

describe('WeatherIcon', () => {
  it('should render the correct icon aria-label for a WMO code', () => {
    render(<WeatherIcon weatherCode={0} />);
    expect(screen.getByLabelText('Céu limpo')).toBeInTheDocument();
  });

  it('should accept size prop', () => {
    render(<WeatherIcon weatherCode={2} size={32} />);
    expect(screen.getByLabelText('Parcialmente nublado')).toBeInTheDocument();
  });
});

