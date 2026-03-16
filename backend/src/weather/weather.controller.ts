import { Request, Response } from 'express';
import { HttpError, WeatherService } from './weather.types';

function parseNumber(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new HttpError('Invalid number parameter', 400, { value });
  }
  return parsed;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  public getGeocoding = async (req: Request, res: Response): Promise<void> => {
    try {
      const city = req.query.city;
      if (!isNonEmptyString(city)) {
        res.status(400).json({ error: 'Missing required query param: city' });
        return;
      }

      const results = await this.weatherService.geocodeCity(city);
      if (results.length === 0) {
        res.status(404).json({ error: 'City not found', city });
        return;
      }

      res.status(200).json({ results });
    } catch (error) {
      this.handleError(error, req, res);
    }
  };

  public getForecast = async (req: Request, res: Response): Promise<void> => {
    try {
      const city = req.query.city;
      const latitude = req.query.latitude;
      const longitude = req.query.longitude;

      const hasCity = isNonEmptyString(city);
      const hasAnyCoord = typeof latitude !== 'undefined' || typeof longitude !== 'undefined';
      const hasBothCoord = typeof latitude !== 'undefined' && typeof longitude !== 'undefined';

      if (hasCity && hasAnyCoord) {
        res.status(400).json({ error: 'Provide either city or latitude/longitude, not both' });
        return;
      }

      if (hasCity) {
        console.log('Forecast requested (by city)', { city });
        const data = await this.weatherService.getWeatherByCity(city);
        res.status(200).json(data);
        return;
      }

      if (!hasBothCoord) {
        res.status(400).json({
          error: 'Missing query params. Provide city or both latitude and longitude'
        });
        return;
      }

      if (!isNonEmptyString(latitude) || !isNonEmptyString(longitude)) {
        res.status(400).json({ error: 'Invalid latitude/longitude' });
        return;
      }

      const lat = parseNumber(latitude);
      const lon = parseNumber(longitude);

      console.log('Forecast requested (by coordinates)', { latitude: lat, longitude: lon });
      const data = await this.weatherService.getWeatherByCoordinates(lat, lon);
      res.status(200).json(data);
    } catch (error) {
      this.handleError(error, req, res);
    }
  };

  private handleError(error: unknown, req: Request, res: Response): void {
    void req;

    if (error instanceof HttpError) {
      if (error.statusCode >= 500) {
        console.error('Weather controller error', { statusCode: error.statusCode, details: error.details });
      }
      res.status(error.statusCode).json({
        error: error.message,
        details: error.details
      });
      return;
    }

    console.error('Unexpected weather controller error', { error });
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}

