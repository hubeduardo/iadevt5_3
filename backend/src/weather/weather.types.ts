export interface WeatherRequest {
  latitude?: number;
  longitude?: number;
  city?: string;
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface WeatherResponseLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
}

export interface DailyForecast {
  date: string;
  dayOfWeek: string;
  temperatureMin: number;
  temperatureMax: number;
  weatherCode: number;
}

export interface WeatherResponse {
  location: WeatherResponseLocation;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

// External API shapes (Open-Meteo)
export interface OpenMeteoGeocodingApiResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface OpenMeteoGeocodingApiResponse {
  results?: OpenMeteoGeocodingApiResult[];
}

export interface OpenMeteoForecastApiCurrent {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  weather_code: number;
}

export interface OpenMeteoForecastApiHourly {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  wind_speed_10m: number[];
  weather_code: number[];
}

export interface OpenMeteoForecastApiDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
}

export interface OpenMeteoForecastApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: OpenMeteoForecastApiCurrent;
  hourly: OpenMeteoForecastApiHourly;
  daily: OpenMeteoForecastApiDaily;
}

export interface WeatherService {
  geocodeCity(city: string): Promise<GeocodingResult[]>;
  getWeatherByCity(city: string): Promise<WeatherResponse>;
  getWeatherByCoordinates(latitude: number, longitude: number): Promise<WeatherResponse>;
}

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

