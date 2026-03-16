import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CurrentWeather } from './CurrentWeather';
import type { CurrentWeather as CurrentWeatherType, WeatherLocation } from './weather.types';

describe('CurrentWeather', () => {
  it('should render temperature, location and description', () => {
    const location: WeatherLocation = { name: 'São Paulo', country: 'Brazil', latitude: -23.55, longitude: -46.63 };
    const data: CurrentWeatherType = {
      temperature: 25,
      feelsLike: 27,
      humidity: 65,
      windSpeed: 12,
      weatherCode: 2,
      weatherDescription: 'Parcialmente nublado',
    };

    render(<CurrentWeather data={data} location={location} />);

    expect(screen.getByText('São Paulo, Brazil')).toBeInTheDocument();
    expect(screen.getByText('25°')).toBeInTheDocument();
    expect(screen.getByText('Parcialmente nublado')).toBeInTheDocument();
  });
});

