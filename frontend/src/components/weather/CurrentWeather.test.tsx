import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CurrentWeather } from './CurrentWeather';
import type { CurrentWeather as CurrentWeatherData, WeatherLocation } from './weather.types';

describe('CurrentWeather', () => {
  it('renders temperature, city and condition', () => {
    const location: WeatherLocation = {
      name: 'Sao Paulo',
      country: 'Brazil',
      latitude: -23.55,
      longitude: -46.63,
    };

    const data: CurrentWeatherData = {
      temperature: 25,
      feelsLike: 27,
      humidity: 65,
      windSpeed: 12,
      weatherCode: 2,
      weatherDescription: 'Parcialmente nublado',
    };

    render(<CurrentWeather data={data} location={location} />);

    expect(screen.getByText('Sao Paulo, Brazil')).toBeInTheDocument();
    expect(screen.getByText('25°')).toBeInTheDocument();
    expect(screen.getByText('Parcialmente nublado')).toBeInTheDocument();
  });
});
