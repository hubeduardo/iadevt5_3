import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useWeather } from './weather.hooks';
import type { WeatherData } from './weather.types';

describe('useWeather', () => {
  it('starts with idle state', () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('stores data on successful fetch', async () => {
    const fixture: WeatherData = {
      location: { name: 'Sao Paulo', country: 'Brazil', latitude: -23.55, longitude: -46.63 },
      current: {
        temperature: 25,
        feelsLike: 27,
        humidity: 65,
        windSpeed: 12,
        weatherCode: 2,
        weatherDescription: 'Parcialmente nublado',
      },
      hourly: [{ time: '14:00', temperature: 25, weatherCode: 2 }],
      daily: [{ date: '2026-03-16', dayOfWeek: 'Segunda', temperatureMin: 18, temperatureMax: 28, weatherCode: 2 }],
    };

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json',
        },
        json: async () => fixture,
      })) as unknown as typeof fetch
    );

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.fetchByCity('Sao Paulo');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data?.location.name).toBe('Sao Paulo');
      expect(result.current.error).toBeNull();
    });
  });

  it('stores error on failed fetch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 404,
        headers: {
          get: () => 'application/json',
        },
        json: async () => ({ error: 'City not found' }),
      })) as unknown as typeof fetch
    );

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.fetchByCity('Atlantis');
    });

    await waitFor(() => {
      expect(result.current.data).toBeNull();
      expect(result.current.error?.message).toBe('City not found');
      expect(result.current.error?.status).toBe(404);
    });
  });
});
