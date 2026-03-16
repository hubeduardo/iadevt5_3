import axios, { AxiosError } from 'axios';
import {
  GeocodingResult,
  HttpError,
  OpenMeteoForecastApiResponse,
  OpenMeteoGeocodingApiResponse,
  WeatherResponse,
  WeatherService
} from './weather.types';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
// Not part of the task's explicit requirements, but helps returning city/country for lat/lon requests.
const REVERSE_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/reverse';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const DEFAULT_TIMEOUT_MS = 10_000;

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Principalmente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Neblina',
  48: 'Neblina com geada',
  51: 'Garoa leve',
  53: 'Garoa moderada',
  55: 'Garoa intensa',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve forte',
  95: 'Tempestade',
  96: 'Tempestade com granizo',
  99: 'Tempestade com granizo forte'
};

function getWeatherDescription(weatherCode: number): string {
  return WMO_DESCRIPTIONS[weatherCode] ?? 'Condição desconhecida';
}

function round(value: number): number {
  return Math.round(value);
}

function safeGetFirst<T>(arr: T[] | undefined): T | undefined {
  if (!arr || arr.length === 0) return undefined;
  return arr[0];
}

function formatHour(timeIsoLike: string): string {
  // Open-Meteo returns e.g. "2026-03-16T14:00"
  const timePart = timeIsoLike.split('T')[1];
  if (!timePart) return timeIsoLike;
  return timePart.slice(0, 5);
}

function formatDayOfWeek(dateStr: string): string {
  // Expect "YYYY-MM-DD"
  const date = new Date(`${dateStr}T00:00:00`);
  // Keep it in pt-BR for UI consistency with the PRD examples.
  const raw = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date);
  return raw.length > 0 ? raw[0].toUpperCase() + raw.slice(1) : raw;
}

function mapAxiosErrorToHttpError(error: unknown, context: Record<string, unknown>): HttpError {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data;
    return new HttpError('External API error', 500, {
      ...context,
      status,
      data
    });
  }
  return new HttpError('Unexpected error', 500, context);
}

export class OpenMeteoWeatherService implements WeatherService {
  public async geocodeCity(city: string): Promise<GeocodingResult[]> {
    const startedAt = Date.now();
    console.log('Geocoding requested', { city });

    try {
      const response = await axios.get<OpenMeteoGeocodingApiResponse>(GEOCODING_URL, {
        params: { name: city, count: 5, language: 'pt' },
        timeout: DEFAULT_TIMEOUT_MS
      });

      console.log('Geocoding response received', {
        city,
        durationMs: Date.now() - startedAt,
        resultsCount: response.data.results?.length ?? 0
      });

      const results = response.data.results ?? [];
      return results.map((r) => ({
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        country: r.country,
        admin1: r.admin1
      }));
    } catch (error) {
      console.error('Geocoding failed', { city, error });
      throw mapAxiosErrorToHttpError(error, { endpoint: 'geocoding', city });
    }
  }

  public async getWeatherByCity(city: string): Promise<WeatherResponse> {
    const results = await this.geocodeCity(city);
    const first = safeGetFirst(results);
    if (!first) {
      throw new HttpError('City not found', 404, { city });
    }

    const forecast = await this.fetchForecast(first.latitude, first.longitude);
    return this.formatWeatherResponse(forecast, {
      name: first.name,
      country: first.country,
      latitude: first.latitude,
      longitude: first.longitude
    });
  }

  public async getWeatherByCoordinates(latitude: number, longitude: number): Promise<WeatherResponse> {
    const location = await this.tryReverseGeocode(latitude, longitude);
    const forecast = await this.fetchForecast(latitude, longitude);

    return this.formatWeatherResponse(forecast, {
      name: location?.name ?? `Latitude ${latitude}, Longitude ${longitude}`,
      country: location?.country ?? '',
      latitude,
      longitude
    });
  }

  private async tryReverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<{ name: string; country: string } | undefined> {
    try {
      const response = await axios.get<OpenMeteoGeocodingApiResponse>(REVERSE_GEOCODING_URL, {
        params: { latitude, longitude, count: 1, language: 'pt' },
        timeout: DEFAULT_TIMEOUT_MS
      });
      const first = safeGetFirst(response.data.results);
      if (!first) return undefined;
      return { name: first.name, country: first.country };
    } catch (error) {
      // Non-blocking: reverse geocoding is just for UX (city/country label).
      console.error('Reverse geocoding failed', { latitude, longitude, error });
      return undefined;
    }
  }

  private async fetchForecast(latitude: number, longitude: number): Promise<OpenMeteoForecastApiResponse> {
    const startedAt = Date.now();
    console.log('Weather forecast requested', { latitude, longitude });

    try {
      const response = await axios.get<OpenMeteoForecastApiResponse>(FORECAST_URL, {
        params: {
          latitude,
          longitude,
          timezone: 'auto',
          forecast_days: 7,
          wind_speed_unit: 'kmh',
          current:
            'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
          hourly:
            'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
          daily: 'temperature_2m_max,temperature_2m_min,weather_code'
        },
        timeout: DEFAULT_TIMEOUT_MS
      });

      console.log('Open-Meteo forecast response received', {
        latitude,
        longitude,
        durationMs: Date.now() - startedAt,
        timezone: response.data.timezone
      });

      return response.data;
    } catch (error) {
      console.error('Open-Meteo forecast failed', { latitude, longitude, error });
      throw mapAxiosErrorToHttpError(error, { endpoint: 'forecast', latitude, longitude });
    }
  }

  private formatWeatherResponse(
    forecast: OpenMeteoForecastApiResponse,
    location: { name: string; country: string; latitude: number; longitude: number }
  ): WeatherResponse {
    const current = forecast.current;
    const hourly = forecast.hourly;
    const daily = forecast.daily;

    const hourlyItems = hourly.time.slice(0, 24).map((t, i) => ({
      time: formatHour(t),
      temperature: round(hourly.temperature_2m[i] ?? 0),
      weatherCode: hourly.weather_code[i] ?? 0
    }));

    const dailyItems = daily.time.slice(0, 7).map((d, i) => ({
      date: d,
      dayOfWeek: formatDayOfWeek(d),
      temperatureMin: round(daily.temperature_2m_min[i] ?? 0),
      temperatureMax: round(daily.temperature_2m_max[i] ?? 0),
      weatherCode: daily.weather_code[i] ?? 0
    }));

    return {
      location,
      current: {
        temperature: round(current.temperature_2m),
        feelsLike: round(current.apparent_temperature),
        humidity: round(current.relative_humidity_2m),
        windSpeed: round(current.wind_speed_10m),
        weatherCode: current.weather_code,
        weatherDescription: getWeatherDescription(current.weather_code)
      },
      hourly: hourlyItems,
      daily: dailyItems
    };
  }
}

