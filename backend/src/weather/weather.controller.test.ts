import test from 'node:test';
import assert from 'node:assert/strict';
import { Request, Response } from 'express';
import { createWeatherController } from './weather.controller';
import { WeatherApiError, WeatherResponse, WeatherService } from './weather.types';

function createRequestMock(query: Record<string, string> = {}): Request {
  return { query } as unknown as Request;
}

function createResponseMock() {
  const state: {
    statusCode: number;
    body: unknown;
  } = {
    statusCode: 200,
    body: undefined,
  };

  const response = {
    status(code: number) {
      state.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      state.body = payload;
      return this;
    },
  } as Response;

  return { response, state };
}

function createServiceStub(overrides: Partial<WeatherService> = {}): WeatherService {
  const baseResponse: WeatherResponse = {
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
    hourly: [{ time: '14:00', temperature: 25, weatherCode: 2 }],
    daily: [{ date: '2025-02-03', dayOfWeek: 'segunda-feira', temperatureMin: 18, temperatureMax: 28, weatherCode: 2 }],
  };

  return {
    async geocodeCity() {
      return [baseResponse.location];
    },
    async getForecast() {
      return baseResponse;
    },
    async getForecastByCoordinates() {
      return baseResponse;
    },
    ...overrides,
  };
}

test('weather.controller returns 200 for valid city forecast requests', async () => {
  const controller = createWeatherController(createServiceStub());
  const { response, state } = createResponseMock();
  const request = createRequestMock({ city: 'Sao Paulo' });

  await controller.getForecast(request, response);

  assert.equal(state.statusCode, 200);
  assert.deepEqual(state.body, await createServiceStub().getForecast({ city: 'Sao Paulo' }));
});

test('weather.controller returns 200 for valid coordinates forecast requests', async () => {
  const controller = createWeatherController(createServiceStub());
  const { response, state } = createResponseMock();
  const request = createRequestMock({ latitude: '-23.55', longitude: '-46.63' });

  await controller.getForecast(request, response);

  assert.equal(state.statusCode, 200);
});

test('weather.controller returns 404 when city is not found', async () => {
  const controller = createWeatherController(createServiceStub({
    async getForecast() {
      throw new WeatherApiError('Cidade nao encontrada', 404);
    },
  }));
  const { response, state } = createResponseMock();
  const request = createRequestMock({ city: 'Cidade Inexistente' });

  await controller.getForecast(request, response);

  assert.equal(state.statusCode, 404);
  assert.deepEqual(state.body, { error: 'Cidade nao encontrada' });
});

test('weather.controller returns 400 when forecast parameters are missing', async () => {
  const controller = createWeatherController(createServiceStub());
  const { response, state } = createResponseMock();
  const request = createRequestMock();

  await controller.getForecast(request, response);

  assert.equal(state.statusCode, 400);
  assert.deepEqual(state.body, { error: 'Informe city ou latitude e longitude' });
});

test('weather.controller returns 500 on external API errors', async () => {
  const controller = createWeatherController(createServiceStub({
    async geocodeCity() {
      throw new WeatherApiError('Erro ao consultar geocoding', 500);
    },
  }));
  const { response, state } = createResponseMock();
  const request = createRequestMock({ city: 'Sao Paulo' });

  await controller.geocodeCity(request, response);

  assert.equal(state.statusCode, 500);
  assert.deepEqual(state.body, { error: 'Erro ao consultar geocoding' });
});
