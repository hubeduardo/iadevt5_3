import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DailyForecast } from './DailyForecast';
import type { DailyForecast as DailyForecastData } from './weather.types';

describe('DailyForecast', () => {
  it('highlights the current day as Hoje', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-16T10:00:00'));

    const data: DailyForecastData[] = [
      { date: '2026-03-16', dayOfWeek: 'Segunda', temperatureMin: 18, temperatureMax: 28, weatherCode: 2 },
      { date: '2026-03-17', dayOfWeek: 'Terca', temperatureMin: 18, temperatureMax: 27, weatherCode: 3 },
    ];

    render(<DailyForecast data={data} />);

    expect(screen.getByText('Hoje')).toBeInTheDocument();

    vi.useRealTimers();
  });
});
