import * as React from 'react';
import type { WeatherData } from './weather.types';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type WeatherError = {
  message: string;
  status?: number;
};

function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return base?.replace(/\/+$/, '') ?? '';
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  const contentType = response.headers.get('content-type') ?? '';

  if (!response.ok) {
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      payload = undefined;
    }

    throw {
      message:
        payload && typeof payload === 'object' && 'error' in payload
          ? String((payload as Record<string, unknown>).error)
          : 'Erro ao buscar clima.',
      status: response.status,
    } satisfies WeatherError;
  }

  if (!contentType.includes('application/json')) {
    throw {
      message: 'Backend indisponivel ou configuracao de API invalida.',
      status: response.status,
    } satisfies WeatherError;
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw {
      message: 'Resposta invalida da API de clima.',
      status: response.status,
    } satisfies WeatherError;
  }
}

export function useGeolocation() {
  const [coordinates, setCoordinates] = React.useState<Coordinates | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const requestPermission = React.useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalizacao nao suportada neste navegador.');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
        setLoading(false);
      },
      (geoError) => {
        setCoordinates(null);
        setError(geoError.message || 'Permissao de geolocalizacao negada.');
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 }
    );
  }, []);

  return { coordinates, error, loading, requestPermission };
}

export function useWeather() {
  const [data, setData] = React.useState<WeatherData | null>(null);
  const [error, setError] = React.useState<WeatherError | null>(null);
  const [loading, setLoading] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  const run = React.useCallback(async (url: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchJson<WeatherData>(url, controller.signal);
      setData(result);
    } catch (unknownError) {
      setData(null);
      if (unknownError && typeof unknownError === 'object' && 'message' in unknownError) {
        setError(unknownError as WeatherError);
      } else {
        setError({ message: 'Erro inesperado.' });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCity = React.useCallback(
    async (city: string) => {
      await run(`${getApiBaseUrl()}/api/weather/forecast?city=${encodeURIComponent(city)}`);
    },
    [run]
  );

  const fetchByCoordinates = React.useCallback(
    async (latitude: number, longitude: number) => {
      await run(
        `${getApiBaseUrl()}/api/weather/forecast?latitude=${encodeURIComponent(String(latitude))}&longitude=${encodeURIComponent(
          String(longitude)
        )}`
      );
    },
    [run]
  );

  React.useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return { data, error, loading, fetchByCity, fetchByCoordinates };
}
