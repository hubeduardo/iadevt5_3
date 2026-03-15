import { useEffect, useRef, useState } from 'react';
import { Coordinates, WeatherData } from './weather.types';

const API_BASE_URL = 'http://localhost:3000/api/weather';

interface UseWeatherState {
  data: WeatherData | null;
  error: string | null;
  loading: boolean;
  fetchByCity: (city: string) => Promise<void>;
  fetchByCoordinates: (latitude: number, longitude: number) => Promise<void>;
}

interface UseGeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  loading: boolean;
  requestPermission: () => void;
}

async function fetchWeather(query: string): Promise<WeatherData> {
  const response = await fetch(`${API_BASE_URL}/forecast?${query}`);
  const payload = (await response.json()) as WeatherData | { error?: string };

  if (!response.ok) {
    const message = 'error' in payload && typeof payload.error === 'string'
      ? payload.error
      : 'Nao foi possivel obter o clima agora.';
    throw new Error(message);
  }

  return payload as WeatherData;
}

export function useWeather(): UseWeatherState {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runFetch(query: string): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      const nextData = await fetchWeather(query);
      setData(nextData);
    } catch (caughtError) {
      setData(null);
      setError(caughtError instanceof Error ? caughtError.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  async function fetchByCity(city: string): Promise<void> {
    const normalizedCity = city.trim();
    if (!normalizedCity) {
      setError('Informe uma cidade para buscar.');
      return;
    }

    await runFetch(`city=${encodeURIComponent(normalizedCity)}`);
  }

  async function fetchByCoordinates(latitude: number, longitude: number): Promise<void> {
    await runFetch(`latitude=${latitude}&longitude=${longitude}`);
  }

  return { data, error, loading, fetchByCity, fetchByCoordinates };
}

export function useGeolocation(autoRequest = true): UseGeolocationState {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(autoRequest);
  const requestedRef = useRef(false);

  function requestPermission(): void {
    if (!('geolocation' in navigator)) {
      setLoading(false);
      setError('Geolocalizacao indisponivel neste navegador.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setError('Permissao de localizacao negada. Busque por uma cidade.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }

  useEffect(() => {
    if (!autoRequest || requestedRef.current) {
      return;
    }

    requestedRef.current = true;
    requestPermission();
  }, [autoRequest]);

  return { coordinates, error, loading, requestPermission };
}
