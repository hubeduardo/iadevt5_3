import * as React from 'react';
import { AlertTriangle, LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CurrentWeather } from './CurrentWeather';
import { DailyForecast } from './DailyForecast';
import { HourlyForecast } from './HourlyForecast';
import { WeatherSearch } from './WeatherSearch';
import { useGeolocation, useWeather } from './weather.hooks';
import { getWmoMeta } from './weather.utils';

function LoadingCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-3xl border border-white/20 bg-white/20 p-5 shadow-sm backdrop-blur-md',
        className
      )}
    >
      <div className="h-4 w-40 rounded bg-white/30" />
      <div className="mt-4 h-12 w-32 rounded bg-white/30" />
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="h-16 rounded-2xl bg-white/20" />
        <div className="h-16 rounded-2xl bg-white/20" />
        <div className="h-16 rounded-2xl bg-white/20" />
      </div>
    </div>
  );
}

export function WeatherDashboard() {
  const { coordinates, error: geoError, loading: geoLoading, requestPermission } = useGeolocation();
  const { data, error, loading, fetchByCity, fetchByCoordinates } = useWeather();
  const [hasRequestedGeo, setHasRequestedGeo] = React.useState(false);

  React.useEffect(() => {
    if (hasRequestedGeo) return;
    setHasRequestedGeo(true);
    requestPermission();
  }, [hasRequestedGeo, requestPermission]);

  React.useEffect(() => {
    if (!coordinates) return;
    void fetchByCoordinates(coordinates.latitude, coordinates.longitude);
  }, [coordinates, fetchByCoordinates]);

  const bg = data ? getWmoMeta(data.current.weatherCode).gradient : 'from-sky-300/40 via-slate-100/40 to-indigo-200/40';

  return (
    <main className={cn('min-h-screen px-4 py-10')}>
      <div
        className={cn(
          'pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br',
          bg,
          'opacity-80 blur-0'
        )}
      />

      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Weather Dashboard</h1>
              <p className="text-sm text-foreground/70">Clima atual, próximas 24h e previsão de 7 dias</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                requestPermission();
              }}
              disabled={geoLoading}
              className="rounded-xl"
              title="Usar minha localização"
            >
              <LocateFixed className="mr-1 size-4" />
              Localização
            </Button>
          </div>

          <WeatherSearch
            onSearch={(city) => void fetchByCity(city)}
            loading={loading}
            hint={geoError ? 'Geolocalização indisponível. Busque por uma cidade para continuar.' : undefined}
          />
        </header>

        {error ? (
          <div className="mb-5 rounded-2xl border border-white/20 bg-white/20 p-4 text-sm text-foreground/80 shadow-sm backdrop-blur-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-4 text-foreground/70" />
              <div className="min-w-0">
                <div className="font-medium">Não foi possível carregar o clima</div>
                <div className="mt-1 text-foreground/70">{error.message}</div>
              </div>
            </div>
          </div>
        ) : null}

        {loading && !data ? (
          <div className="grid gap-4">
            <LoadingCard />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="animate-pulse rounded-3xl border border-white/20 bg-white/20 p-5 shadow-sm backdrop-blur-md">
                <div className="h-4 w-36 rounded bg-white/30" />
                <div className="mt-4 h-24 rounded-2xl bg-white/20" />
              </div>
              <div className="animate-pulse rounded-3xl border border-white/20 bg-white/20 p-5 shadow-sm backdrop-blur-md">
                <div className="h-4 w-32 rounded bg-white/30" />
                <div className="mt-4 h-24 rounded-2xl bg-white/20" />
              </div>
            </div>
          </div>
        ) : null}

        {data ? (
          <div className="grid gap-4">
            <CurrentWeather data={data.current} location={data.location} />
            <HourlyForecast data={data.hourly} />
            <DailyForecast data={data.daily} />
          </div>
        ) : null}
      </div>
    </main>
  );
}

