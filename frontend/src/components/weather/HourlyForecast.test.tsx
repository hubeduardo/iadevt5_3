import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HourlyForecast } from './HourlyForecast';
import type { HourlyForecast as HourlyForecastType } from './weather.types';

describe('HourlyForecast', () => {
  it('should render up to 24 items', () => {
    const data: HourlyForecastType[] = Array.from({ length: 30 }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      temperature: 20 + i,
      weatherCode: 0,
    }));

    render(<HourlyForecast data={data} />);

    // section title
    expect(screen.getByText(/Próximas 24 horas/i)).toBeInTheDocument();
    // first and last within 24
    expect(screen.getByText('00:00')).toBeInTheDocument();
    expect(screen.getByText('23:00')).toBeInTheDocument();
    // beyond 24 should not exist
    expect(screen.queryByText('24:00')).not.toBeInTheDocument();
  });
});

