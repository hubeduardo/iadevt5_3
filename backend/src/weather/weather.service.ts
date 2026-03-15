import axios from 'axios';
import {
  ForecastApiResponse,
  GeocodingApiResponse,
  GeocodingResult,
  HttpClient,
  WeatherApiError,
  WeatherRequest,
  WeatherResponse,
  WeatherService,
} from './weather.types';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const TIMEOUT_MS = 10000;

const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: 'Ceu limpo',
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
  99: 'Tempestade com granizo forte',
};

const defaultHttpClient: HttpClient = {
  get<T>(url: string, config?: { params?: Record<string, string | number> }) {
    return axios.get<T>(url, { ...config, timeout: TIMEOUT_MS });
  },
};

function getWeatherDescription(code: number): string {
  return WEATHER_DESCRIPTIONS[code] ?? 'Condicao desconhecida';
}

function getDayOfWeek(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: 'UTC' }).format(new Date(date));
}

function logError(context: Record<string, string | number>, error: unknown): void {
  const message = error instanceof Error ? error.message : 'Unexpected error';
  console.error(JSON.stringify({ scope: 'weather.service', ...context, message }));
}

function toWeatherResponse(
  forecast: ForecastApiResponse,
  location: GeocodingResult
): WeatherResponse {
  if (!forecast.current || !forecast.hourly || !forecast.daily) {
    throw new WeatherApiError('Resposta incompleta da API de clima', 500);
  }

  return {
    location: {
      name: location.name,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
    },
    current: {
      temperature: forecast.current.temperature_2m,
      feelsLike: forecast.current.apparent_temperature,
      humidity: forecast.current.relative_humidity_2m,
      windSpeed: forecast.current.wind_speed_10m,
      weatherCode: forecast.current.weather_code,
      weatherDescription: getWeatherDescription(forecast.current.weather_code),
    },
    hourly: forecast.hourly.time.slice(0, 24).map((time, index) => ({
      time: new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      }).format(new Date(time)),
      temperature: forecast.hourly!.temperature_2m[index],
      weatherCode: forecast.hourly!.weather_code[index],
    })),
    daily: forecast.daily.time.slice(0, 7).map((date, index) => ({
      date,
      dayOfWeek: getDayOfWeek(date),
      temperatureMin: forecast.daily!.temperature_2m_min[index],
      temperatureMax: forecast.daily!.temperature_2m_max[index],
      weatherCode: forecast.daily!.weather_code[index],
    })),
  };
}

function normalizeGeocodingResults(response: GeocodingApiResponse): GeocodingResult[] {
  return (response.results ?? []).map((result) => ({
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    admin1: result.admin1,
  }));
}

export function createWeatherService(httpClient: HttpClient = defaultHttpClient): WeatherService {
  return {
    async geocodeCity(city: string): Promise<GeocodingResult[]> {
      try {
        const { data } = await httpClient.get<GeocodingApiResponse>(GEOCODING_URL, {
          params: {
            name: city,
            count: 5,
            language: 'pt',
          },
        });

        const results = normalizeGeocodingResults(data);
        if (results.length === 0) {
          throw new WeatherApiError('Cidade nao encontrada', 404);
        }

        return results;
      } catch (error) {
        logError({ city }, error);
        if (error instanceof WeatherApiError) {
          throw error;
        }

        throw new WeatherApiError('Erro ao consultar geocoding', 500);
      }
    },

    async getForecastByCoordinates(
      latitude: number,
      longitude: number,
      location?: GeocodingResult
    ): Promise<WeatherResponse> {
      try {
        const { data } = await httpClient.get<ForecastApiResponse>(FORECAST_URL, {
          params: {
            latitude,
            longitude,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
            hourly: 'temperature_2m,weather_code',
            daily: 'temperature_2m_max,temperature_2m_min,weather_code',
            timezone: 'auto',
            forecast_days: 7,
          },
        });

        const resolvedLocation: GeocodingResult = location ?? {
          name: 'Coordenadas informadas',
          country: 'N/A',
          latitude,
          longitude,
        };

        return toWeatherResponse(data, resolvedLocation);
      } catch (error) {
        logError({ latitude, longitude }, error);
        if (error instanceof WeatherApiError) {
          throw error;
        }

        throw new WeatherApiError('Erro ao consultar previsao do tempo', 500);
      }
    },

    async getForecast(input: WeatherRequest): Promise<WeatherResponse> {
      if (input.city) {
        const [location] = await this.geocodeCity(input.city);
        return this.getForecastByCoordinates(location.latitude, location.longitude, location);
      }

      if (typeof input.latitude === 'number' && typeof input.longitude === 'number') {
        return this.getForecastByCoordinates(input.latitude, input.longitude);
      }

      throw new WeatherApiError('Informe cidade ou latitude/longitude', 400);
    },
  };
}

export const weatherService = createWeatherService();
