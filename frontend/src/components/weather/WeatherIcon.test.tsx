import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WeatherIcon } from './WeatherIcon';

describe('WeatherIcon', () => {
  it('renders the expected icon for a WMO code', () => {
    render(<WeatherIcon weatherCode={0} />);

    expect(screen.getByTestId('weather-icon-Sun')).toBeInTheDocument();
  });

  it('applies size and className props', () => {
    render(<WeatherIcon weatherCode={61} size={40} className="custom-class" />);

    expect(screen.getByTestId('weather-icon-CloudRain')).toHaveClass('custom-class');
  });
});
