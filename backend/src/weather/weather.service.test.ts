import test from 'node:test';
import assert from 'node:assert/strict';
import { createWeatherService } from './weather.service';
import { ForecastApiResponse, GeocodingApiResponse, HttpClient, WeatherApiError } from './weather.types';

function createHttpClientMock(responses: Array<unknown>): HttpClient {
  let callIndex = 0;

  return {
    async get<T>(): Promise<{ data: T }> {
      const data = responses[callIndex] as T;
      callIndex += 1;
      return { data };
    },
  };
}

test('weather.service geocodes a valid city', async () => {
  const geocodingResponse: GeocodingApiResponse = {
    results: [
      {
        name: 'Sao Paulo',
        latitude: -23.55,
        longitude: -46.63,
        country: 'Brazil',
        admin1: 'Sao Paulo',
      },
    ],
  };
  const service = createWeatherService(createHttpClientMock([geocodingResponse]));

  const result = await service.geocodeCity('Sao Paulo');

  assert.equal(result[0].name, 'Sao Paulo');
  assert.equal(result[0].latitude, -23.55);
  assert.equal(result[0].longitude, -46.63);
});

test('weather.service formats forecast data from coordinates', async () => {
  const forecastResponse: ForecastApiResponse = {
    latitude: -23.55,
    longitude: -46.63,
    timezone: 'America/Sao_Paulo',
    current: {
      time: '2025-02-03T14:00',
      temperature_2m: 25,
      relative_humidity_2m: 65,
      apparent_temperature: 27,
      weather_code: 2,
      wind_speed_10m: 12,
    },
    hourly: {
      time: ['2025-02-03T14:00', '2025-02-03T15:00'],
      temperature_2m: [25, 24],
      weather_code: [2, 3],
    },
    daily: {
      time: ['2025-02-03', '2025-02-04'],
      temperature_2m_max: [28, 29],
      temperature_2m_min: [18, 19],
      weather_code: [2, 61],
    },
  };
  const service = createWeatherService(createHttpClientMock([forecastResponse]));

  const result = await service.getForecastByCoordinates(-23.55, -46.63, {
    name: 'Sao Paulo',
    latitude: -23.55,
    longitude: -46.63,
    country: 'Brazil',
    admin1: 'Sao Paulo',
  });

  assert.equal(result.location.name, 'Sao Paulo');
  assert.equal(result.current.weatherDescription, 'Parcialmente nublado');
  assert.equal(result.hourly[0].temperature, 25);
  assert.equal(result.daily[0].temperatureMax, 28);
});

test('weather.service resolves forecast by city through geocoding', async () => {
  const geocodingResponse: GeocodingApiResponse = {
    results: [
      {
        name: 'Sao Paulo',
        latitude: -23.55,
        longitude: -46.63,
        country: 'Brazil',
      },
    ],
  };
  const forecastResponse: ForecastApiResponse = {
    latitude: -23.55,
    longitude: -46.63,
    timezone: 'America/Sao_Paulo',
    current: {
      time: '2025-02-03T14:00',
      temperature_2m: 25,
      relative_humidity_2m: 65,
      apparent_temperature: 27,
      weather_code: 2,
      wind_speed_10m: 12,
    },
    hourly: {
      time: ['2025-02-03T14:00'],
      temperature_2m: [25],
      weather_code: [2],
    },
    daily: {
      time: ['2025-02-03'],
      temperature_2m_max: [28],
      temperature_2m_min: [18],
      weather_code: [2],
    },
  };
  const service = createWeatherService(createHttpClientMock([geocodingResponse, forecastResponse]));

  const result = await service.getForecast({ city: 'Sao Paulo' });

  assert.equal(result.location.latitude, -23.55);
  assert.equal(result.current.temperature, 25);
});

test('weather.service throws 404 when city is not found', async () => {
  const service = createWeatherService(createHttpClientMock([{ results: [] }]));

  await assert.rejects(() => service.geocodeCity('Cidade Inexistente'), (error: unknown) => {
    assert.ok(error instanceof WeatherApiError);
    assert.equal(error.statusCode, 404);
    return true;
  });
});
