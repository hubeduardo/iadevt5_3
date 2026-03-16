import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useWeather } from './weather.hooks';
import type { WeatherData } from './weather.types';

describe('useWeather', () => {
  it('should have initial state', () => {
    const { result } = renderHook(() => useWeather());
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should set data on successful fetchByCity', async () => {
    const fixture: WeatherData = {
      location: { name: 'São Paulo', country: 'Brazil', latitude: -23.55, longitude: -46.63 },
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
        json: async () => fixture,
      })) as unknown as typeof fetch
    );

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.fetchByCity('São Paulo');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data?.location.name).toBe('São Paulo');
      expect(result.current.error).toBeNull();
    });
  });

  it('should set error on failed fetch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 404,
        json: async () => ({ error: 'City not found' }),
      })) as unknown as typeof fetch
    );

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.fetchByCity('Atlantis');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error?.message).toBe('City not found');
      expect(result.current.error?.status).toBe(404);
    });
  });
});

