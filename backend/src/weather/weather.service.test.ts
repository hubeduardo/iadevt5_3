import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { OpenMeteoWeatherService } from './weather.service';
import { OpenMeteoForecastApiResponse, OpenMeteoGeocodingApiResponse } from './weather.types';

type AxiosGet = typeof axios.get;

function makeAxiosResponse<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    // AxiosResponse carries a fairly complex `config` type; for unit tests we only need `data`.
    config: {}
  } as unknown as AxiosResponse<T>;
}

function buildForecastFixture(): OpenMeteoForecastApiResponse {
  const hourlyTime: string[] = Array.from({ length: 24 }, (_, i) => {
    const hour = String(14 + i).padStart(2, '0');
    return `2026-03-16T${hour}:00`;
  });

  return {
    latitude: -23.55,
    longitude: -46.63,
    timezone: 'America/Sao_Paulo',
    current: {
      temperature_2m: 25.2,
      apparent_temperature: 27.1,
      relative_humidity_2m: 64.6,
      wind_speed_10m: 12.4,
      weather_code: 2
    },
    hourly: {
      time: hourlyTime,
      temperature_2m: Array.from({ length: 24 }, (_, i) => 25 + i * 0.1),
      relative_humidity_2m: Array.from({ length: 24 }, () => 65),
      apparent_temperature: Array.from({ length: 24 }, () => 27),
      wind_speed_10m: Array.from({ length: 24 }, () => 12),
      weather_code: Array.from({ length: 24 }, () => 2)
    },
    daily: {
      time: ['2026-03-16', '2026-03-17', '2026-03-18', '2026-03-19', '2026-03-20', '2026-03-21', '2026-03-22'],
      temperature_2m_max: [28.2, 27.9, 28.1, 29.0, 28.0, 27.5, 26.9],
      temperature_2m_min: [18.1, 18.4, 18.0, 19.2, 19.0, 18.8, 18.3],
      weather_code: [2, 2, 3, 61, 63, 0, 1]
    }
  };
}

describe('OpenMeteoWeatherService', () => {
  let originalAxiosGet: AxiosGet;

  beforeEach(() => {
    originalAxiosGet = axios.get;
  });

  afterEach(() => {
    axios.get = originalAxiosGet;
  });

  it('should geocode a city and return formatted weather response', async () => {
    // Arrange
    const service = new OpenMeteoWeatherService();

    const geocodingFixture: OpenMeteoGeocodingApiResponse = {
      results: [
        { name: 'São Paulo', latitude: -23.55, longitude: -46.63, country: 'Brazil', admin1: 'São Paulo' }
      ]
    };
    const forecastFixture = buildForecastFixture();

    axios.get = (async (url: string, config?: AxiosRequestConfig) => {
      if (url.includes('/v1/search')) return makeAxiosResponse(geocodingFixture);
      if (url.includes('/v1/forecast')) {
        assert.equal(config?.params?.timezone, 'auto');
        return makeAxiosResponse(forecastFixture);
      }
      throw new Error(`Unexpected URL: ${url}`);
    }) as AxiosGet;

    // Act
    const data = await service.getWeatherByCity('São Paulo');

    // Assert
    assert.equal(data.location.name, 'São Paulo');
    assert.equal(data.location.country, 'Brazil');
    assert.equal(data.current.temperature, 25);
    assert.equal(data.current.feelsLike, 27);
    assert.equal(data.current.humidity, 65);
    assert.equal(data.current.windSpeed, 12);
    assert.equal(data.current.weatherCode, 2);
    assert.equal(data.current.weatherDescription, 'Parcialmente nublado');
    assert.equal(data.hourly.length, 24);
    assert.equal(data.hourly[0]?.time, '14:00');
    assert.equal(data.daily.length, 7);
    assert.equal(data.daily[0]?.date, '2026-03-16');
  });

  it('should return weather response for coordinates and use reverse geocoding when available', async () => {
    // Arrange
    const service = new OpenMeteoWeatherService();
    const forecastFixture = buildForecastFixture();
    const reverseFixture: OpenMeteoGeocodingApiResponse = {
      results: [{ name: 'São Paulo', latitude: -23.55, longitude: -46.63, country: 'Brazil' }]
    };

    axios.get = (async (url: string) => {
      if (url.includes('/v1/reverse')) return makeAxiosResponse(reverseFixture);
      if (url.includes('/v1/forecast')) return makeAxiosResponse(forecastFixture);
      throw new Error(`Unexpected URL: ${url}`);
    }) as AxiosGet;

    // Act
    const data = await service.getWeatherByCoordinates(-23.55, -46.63);

    // Assert
    assert.equal(data.location.name, 'São Paulo');
    assert.equal(data.location.country, 'Brazil');
    assert.equal(data.hourly.length, 24);
    assert.equal(data.daily.length, 7);
  });
});
