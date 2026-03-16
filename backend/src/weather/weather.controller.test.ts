import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Request, Response } from 'express';
import { WeatherController } from './weather.controller';
import { HttpError, WeatherResponse, WeatherService } from './weather.types';

function makeResponseStub() {
  const state: { statusCode?: number; body?: unknown } = {};

  const res = {
    status(code: number) {
      state.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      state.body = payload;
      return this;
    }
  };

  return { res: res as unknown as Response, state };
}

function makeRequestStub(query: Record<string, unknown>) {
  return { query } as unknown as Request;
}

function makeWeatherFixture(): WeatherResponse {
  return {
    location: { name: 'São Paulo', country: 'Brazil', latitude: -23.55, longitude: -46.63 },
    current: {
      temperature: 25,
      feelsLike: 27,
      humidity: 65,
      windSpeed: 12,
      weatherCode: 2,
      weatherDescription: 'Parcialmente nublado'
    },
    hourly: [{ time: '14:00', temperature: 25, weatherCode: 2 }],
    daily: [{ date: '2026-03-16', dayOfWeek: 'Segunda', temperatureMin: 18, temperatureMax: 28, weatherCode: 2 }]
  };
}

describe('WeatherController', () => {
  it('should return 200 for forecast by city', async () => {
    // Arrange
    const service: WeatherService = {
      async geocodeCity() {
        return [];
      },
      async getWeatherByCity(city: string) {
        assert.equal(city, 'São Paulo');
        return makeWeatherFixture();
      },
      async getWeatherByCoordinates() {
        throw new Error('not expected');
      }
    };

    const controller = new WeatherController(service);
    const req = makeRequestStub({ city: 'São Paulo' });
    const { res, state } = makeResponseStub();

    // Act
    await controller.getForecast(req, res);

    // Assert
    assert.equal(state.statusCode, 200);
    assert.ok(typeof state.body === 'object' && state.body !== null);
  });

  it('should return 200 for forecast by coordinates', async () => {
    // Arrange
    const service: WeatherService = {
      async geocodeCity() {
        return [];
      },
      async getWeatherByCity() {
        throw new Error('not expected');
      },
      async getWeatherByCoordinates(latitude: number, longitude: number) {
        assert.equal(latitude, -23.55);
        assert.equal(longitude, -46.63);
        return makeWeatherFixture();
      }
    };

    const controller = new WeatherController(service);
    const req = makeRequestStub({ latitude: '-23.55', longitude: '-46.63' });
    const { res, state } = makeResponseStub();

    // Act
    await controller.getForecast(req, res);

    // Assert
    assert.equal(state.statusCode, 200);
  });

  it('should return 404 when city is not found', async () => {
    // Arrange
    const service: WeatherService = {
      async geocodeCity() {
        return [];
      },
      async getWeatherByCity() {
        throw new HttpError('City not found', 404, { city: 'Atlantis' });
      },
      async getWeatherByCoordinates() {
        throw new Error('not expected');
      }
    };

    const controller = new WeatherController(service);
    const req = makeRequestStub({ city: 'Atlantis' });
    const { res, state } = makeResponseStub();

    // Act
    await controller.getForecast(req, res);

    // Assert
    assert.equal(state.statusCode, 404);
  });

  it('should return 400 when missing params', async () => {
    // Arrange
    const service: WeatherService = {
      async geocodeCity() {
        return [];
      },
      async getWeatherByCity() {
        throw new Error('not expected');
      },
      async getWeatherByCoordinates() {
        throw new Error('not expected');
      }
    };
    const controller = new WeatherController(service);
    const req = makeRequestStub({});
    const { res, state } = makeResponseStub();

    // Act
    await controller.getForecast(req, res);

    // Assert
    assert.equal(state.statusCode, 400);
  });

  it('should return 500 when service throws unexpected error', async () => {
    // Arrange
    const service: WeatherService = {
      async geocodeCity() {
        return [];
      },
      async getWeatherByCity() {
        throw new Error('boom');
      },
      async getWeatherByCoordinates() {
        throw new Error('not expected');
      }
    };
    const controller = new WeatherController(service);
    const req = makeRequestStub({ city: 'São Paulo' });
    const { res, state } = makeResponseStub();

    // Act
    await controller.getForecast(req, res);

    // Assert
    assert.equal(state.statusCode, 500);
  });

  it('should return 200 for geocoding endpoint with valid city', async () => {
    // Arrange
    const service: WeatherService = {
      async geocodeCity(city: string) {
        assert.equal(city, 'São Paulo');
        return [{ name: 'São Paulo', latitude: -23.55, longitude: -46.63, country: 'Brazil', admin1: 'São Paulo' }];
      },
      async getWeatherByCity() {
        throw new Error('not expected');
      },
      async getWeatherByCoordinates() {
        throw new Error('not expected');
      }
    };

    const controller = new WeatherController(service);
    const req = makeRequestStub({ city: 'São Paulo' });
    const { res, state } = makeResponseStub();

    // Act
    await controller.getGeocoding(req, res);

    // Assert
    assert.equal(state.statusCode, 200);
  });

  it('should return 404 for geocoding when no results', async () => {
    // Arrange
    const service: WeatherService = {
      async geocodeCity() {
        return [];
      },
      async getWeatherByCity() {
        throw new Error('not expected');
      },
      async getWeatherByCoordinates() {
        throw new Error('not expected');
      }
    };

    const controller = new WeatherController(service);
    const req = makeRequestStub({ city: 'Nowhere' });
    const { res, state } = makeResponseStub();

    // Act
    await controller.getGeocoding(req, res);

    // Assert
    assert.equal(state.statusCode, 404);
  });
});

