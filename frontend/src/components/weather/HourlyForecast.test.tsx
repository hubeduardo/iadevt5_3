import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HourlyForecast } from './HourlyForecast';
import type { HourlyForecast as HourlyForecastData } from './weather.types';

describe('HourlyForecast', () => {
  it('renders only the first 24 hourly items', () => {
    const data: HourlyForecastData[] = Array.from({ length: 30 }, (_, index) => ({
      time: `${String(index).padStart(2, '0')}:00`,
      temperature: 20 + index,
      weatherCode: 0,
    }));

    render(<HourlyForecast data={data} />);

    expect(screen.getByText(/Proximas 24 horas/i)).toBeInTheDocument();
    expect(screen.getByText('00:00')).toBeInTheDocument();
    expect(screen.getByText('23:00')).toBeInTheDocument();
    expect(screen.queryByText('24:00')).not.toBeInTheDocument();
  });
});
