import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DailyForecast } from './DailyForecast';
import type { DailyForecast as DailyForecastType } from './weather.types';

describe('DailyForecast', () => {
  it('should label today as "Hoje"', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-16T10:00:00'));

    const data: DailyForecastType[] = [
      { date: '2026-03-16', dayOfWeek: 'Segunda', temperatureMin: 18, temperatureMax: 28, weatherCode: 2 },
      { date: '2026-03-17', dayOfWeek: 'Terça', temperatureMin: 18, temperatureMax: 27, weatherCode: 3 },
    ];

    render(<DailyForecast data={data} />);

    expect(screen.getByText('Hoje')).toBeInTheDocument();

    vi.useRealTimers();
  });
});

