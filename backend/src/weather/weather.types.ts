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

export interface WeatherLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface WeatherResponse {
  location: WeatherLocation;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface GeocodingApiResponse {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
  }>;
}

export interface ForecastApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}

export interface HttpClient {
  get<T>(url: string, config?: { params?: Record<string, string | number> }): Promise<{ data: T }>;
}

export interface WeatherService {
  geocodeCity(city: string): Promise<GeocodingResult[]>;
  getForecastByCoordinates(
    latitude: number,
    longitude: number,
    location?: GeocodingResult
  ): Promise<WeatherResponse>;
  getForecast(input: WeatherRequest): Promise<WeatherResponse>;
}

export class WeatherApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'WeatherApiError';
    this.statusCode = statusCode;
  }
}
