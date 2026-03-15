import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CurrentWeather } from './CurrentWeather';
import { DailyForecast } from './DailyForecast';
import { HourlyForecast } from './HourlyForecast';
import { WeatherSearch } from './WeatherSearch';
import { WeatherData } from './weather.types';

const weatherFixture: WeatherData = {
  location: {
    name: 'Sao Paulo',
    country: 'Brazil',
    latitude: -23.55,
    longitude: -46.63,
  },
  current: {
    temperature: 25,
    feelsLike: 27,
    humidity: 65,
    windSpeed: 12,
    weatherCode: 2,
    weatherDescription: 'Parcialmente nublado',
  },
  hourly: Array.from({ length: 24 }, (_, index) => ({
    time: `${String(index).padStart(2, '0')}:00`,
    temperature: 20 + index,
    weatherCode: 2,
  })),
  daily: Array.from({ length: 7 }, (_, index) => ({
    date: `2025-02-0${index + 1}`,
    dayOfWeek: `dia-${index + 1}`,
    temperatureMin: 18 + index,
    temperatureMax: 26 + index,
    weatherCode: 2,
  })),
};

describe('weather components', () => {
  it('CurrentWeather renders temperature, location and condition', () => {
    render(<CurrentWeather data={weatherFixture.current} location={weatherFixture.location} />);

    expect(screen.getByText('25°')).toBeInTheDocument();
    expect(screen.getByText('Sao Paulo, Brazil')).toBeInTheDocument();
    expect(screen.getAllByText('Parcialmente nublado').length).toBeGreaterThan(0);
  });

  it('HourlyForecast renders 24 items and horizontal scroll container', () => {
    render(<HourlyForecast data={weatherFixture.hourly} />);

    expect(screen.getByTestId('hourly-scroll')).toBeInTheDocument();
    expect(screen.getAllByText(/:00/)).toHaveLength(24);
  });

  it('DailyForecast renders 7 days and highlights today', () => {
    render(<DailyForecast data={weatherFixture.daily} />);

    expect(screen.getAllByText(/dia-/)).toHaveLength(7);
    expect(screen.getByTestId('daily-today')).toBeInTheDocument();
  });

  it('WeatherSearch triggers callback on submit', () => {
    const onSearch = vi.fn();
    render(<WeatherSearch onSearch={onSearch} />);

    fireEvent.change(screen.getByLabelText('Digite o nome da cidade'), {
      target: { value: 'Lisboa' },
    });
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }));

    expect(onSearch).toHaveBeenCalledWith('Lisboa');
  });
});
