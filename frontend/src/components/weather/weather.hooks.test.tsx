import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useWeather } from './weather.hooks';

function HookProbe({ onReady }: { onReady: (api: ReturnType<typeof useWeather>) => void }) {
  const api = useWeather();

  useEffect(() => {
    onReady(api);
  }, [api, onReady]);

  return (
    <div>
      <span data-testid="loading">{String(api.loading)}</span>
      <span data-testid="error">{api.error ?? ''}</span>
      <span data-testid="city">{api.data?.location.name ?? ''}</span>
    </div>
  );
}

describe('useWeather', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('starts with idle state', () => {
    render(<HookProbe onReady={() => undefined} />);

    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('error').textContent).toBe('');
    expect(screen.getByTestId('city').textContent).toBe('');
  });

  it('loads data successfully by city', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        location: { name: 'Sao Paulo', country: 'Brazil', latitude: -23.55, longitude: -46.63 },
        current: { temperature: 25, feelsLike: 27, humidity: 65, windSpeed: 12, weatherCode: 2, weatherDescription: 'Parcialmente nublado' },
        hourly: [],
        daily: [],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    let hookApi: ReturnType<typeof useWeather> | null = null;
    render(<HookProbe onReady={(api) => { hookApi = api; }} />);

    await act(async () => {
      await hookApi?.fetchByCity('Sao Paulo');
    });

    await waitFor(() => {
      expect(screen.getByTestId('city').textContent).toBe('Sao Paulo');
    });
  });

  it('handles fetch errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Cidade nao encontrada' }),
    }));

    let hookApi: ReturnType<typeof useWeather> | null = null;
    render(<HookProbe onReady={(api) => { hookApi = api; }} />);

    await act(async () => {
      await hookApi?.fetchByCity('Cidade Inexistente');
    });

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('Cidade nao encontrada');
    });
  });
});
