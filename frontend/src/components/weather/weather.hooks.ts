import * as React from 'react';
import type { WeatherData } from './weather.types';

type Coordinates = { latitude: number; longitude: number };

export function useGeolocation() {
  const [coordinates, setCoordinates] = React.useState<Coordinates | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const requestPermission = React.useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada neste navegador.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordinates({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setError(null);
        setLoading(false);
      },
      (err) => {
        setCoordinates(null);
        setError(err.message || 'Permissão de geolocalização negada.');
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 }
    );
  }, []);

  return { coordinates, error, loading, requestPermission };
}

type WeatherError = { message: string; status?: number };

function getApiBaseUrl(): string {
  // Allows local dev without editing Vite proxy config.
  // Example: VITE_API_BASE_URL=http://localhost:3000
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return base?.replace(/\/+$/, '') ?? '';
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    let details: unknown = undefined;
    try {
      details = await res.json();
    } catch {
      // ignore
    }
    const err: WeatherError = { message: 'Erro ao buscar clima.', status: res.status };
    if (details && typeof details === 'object' && 'error' in (details as Record<string, unknown>)) {
      err.message = String((details as Record<string, unknown>).error);
    }
    throw err;
  }
  return (await res.json()) as T;
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
    } catch (e) {
      setData(null);
      const err = (e && typeof e === 'object' && 'message' in (e as Record<string, unknown>))
        ? (e as WeatherError)
        : ({ message: 'Erro inesperado.' } as WeatherError);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCity = React.useCallback(async (city: string) => {
    const base = getApiBaseUrl();
    const url = `${base}/api/weather/forecast?city=${encodeURIComponent(city)}`;
    await run(url);
  }, [run]);

  const fetchByCoordinates = React.useCallback(async (latitude: number, longitude: number) => {
    const base = getApiBaseUrl();
    const url = `${base}/api/weather/forecast?latitude=${encodeURIComponent(String(latitude))}&longitude=${encodeURIComponent(
      String(longitude)
    )}`;
    await run(url);
  }, [run]);

  React.useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return { data, error, loading, fetchByCity, fetchByCoordinates };
}

