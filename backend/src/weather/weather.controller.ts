import { Request, Response } from 'express';
import { WeatherApiError, WeatherService } from './weather.types';
import { weatherService } from './weather.service';

interface WeatherController {
  getForecast(req: Request, res: Response): Promise<void>;
  geocodeCity(req: Request, res: Response): Promise<void>;
}

function parseCoordinate(value: unknown): number | undefined {
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function handleError(error: unknown, res: Response): void {
  if (error instanceof WeatherApiError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  res.status(500).json({ error: 'Erro interno do servidor' });
}

export function createWeatherController(service: WeatherService = weatherService): WeatherController {
  return {
    async getForecast(req: Request, res: Response): Promise<void> {
      try {
        const city = typeof req.query.city === 'string' ? req.query.city.trim() : undefined;
        const latitude = parseCoordinate(req.query.latitude);
        const longitude = parseCoordinate(req.query.longitude);

        if (city) {
          const forecast = await service.getForecast({ city });
          res.status(200).json(forecast);
          return;
        }

        if (latitude === undefined || longitude === undefined) {
          res.status(400).json({ error: 'Informe city ou latitude e longitude' });
          return;
        }

        if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
          res.status(400).json({ error: 'Latitude e longitude devem ser numeros validos' });
          return;
        }

        const forecast = await service.getForecast({ latitude, longitude });
        res.status(200).json(forecast);
      } catch (error) {
        handleError(error, res);
      }
    },

    async geocodeCity(req: Request, res: Response): Promise<void> {
      try {
        const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';
        if (!city) {
          res.status(400).json({ error: 'Parametro city e obrigatorio' });
          return;
        }

        const results = await service.geocodeCity(city);
        res.status(200).json({ results });
      } catch (error) {
        handleError(error, res);
      }
    },
  };
}

export const weatherController = createWeatherController();
