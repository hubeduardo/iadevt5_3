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
    <div className={cn('animate-pulse rounded-3xl border border-white/20 bg-white/20 p-4 shadow-sm backdrop-blur-md sm:p-5', className)}>
      <div className="h-4 w-40 rounded bg-white/30" />
      <div className="mt-3 h-10 w-28 rounded bg-white/30" />
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        <div className="h-14 rounded-2xl bg-white/20" />
        <div className="h-14 rounded-2xl bg-white/20" />
        <div className="hidden h-14 rounded-2xl bg-white/20 sm:block" />
      </div>
    </div>
  );
}

export function WeatherDashboard() {
  const { coordinates, error: geoError, loading: geoLoading, requestPermission } = useGeolocation();
  const { data, error, loading, fetchByCity, fetchByCoordinates } = useWeather();
  const [requestedGeo, setRequestedGeo] = React.useState(false);

  React.useEffect(() => {
    if (requestedGeo) return;
    setRequestedGeo(true);
    requestPermission();
  }, [requestedGeo, requestPermission]);

  React.useEffect(() => {
    if (!coordinates) return;
    void fetchByCoordinates(coordinates.latitude, coordinates.longitude);
  }, [coordinates, fetchByCoordinates]);

  const backgroundGradient = data
    ? getWmoMeta(data.current.weatherCode).gradient
    : 'from-blue-300/40 via-slate-100/40 to-yellow-200/40';

  return (
    <main className="min-h-[100svh] overflow-x-hidden px-3 py-4 sm:px-4 sm:py-8">
      <div className={cn('pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br opacity-80', backgroundGradient)} />

      <div className="mx-auto w-full max-w-3xl min-w-0">
        <header className="mb-4 flex flex-col gap-3 sm:mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Weather Dashboard</h1>
              <p className="text-sm text-foreground/70">Clima atual, proximas 24h e previsao de 7 dias</p>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={requestPermission}
              disabled={geoLoading}
              className="w-full rounded-xl sm:w-auto"
            >
              <LocateFixed className="mr-1 size-4" />
              Localizacao
            </Button>
          </div>

          <WeatherSearch
            onSearch={(city) => {
              void fetchByCity(city);
            }}
            loading={loading}
            hint={geoError ? 'Geolocalizacao indisponivel. Busque por uma cidade para continuar.' : undefined}
          />
        </header>

        {error ? (
          <div className="mb-4 rounded-2xl border border-white/20 bg-white/20 p-4 text-sm text-foreground/80 shadow-sm backdrop-blur-md sm:mb-5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-foreground/70" />
              <div>
                <div className="font-medium">Nao foi possivel carregar o clima</div>
                <div className="mt-1 text-foreground/70">{error.message}</div>
              </div>
            </div>
          </div>
        ) : null}

        {loading && !data ? (
          <div className="grid gap-3 sm:gap-4">
            <LoadingCard />
            <div className="grid gap-3 md:grid-cols-2 sm:gap-4">
              <LoadingCard />
              <LoadingCard />
            </div>
          </div>
        ) : null}

        {data ? (
          <div className="grid min-w-0 gap-3 sm:gap-4">
            <CurrentWeather data={data.current} location={data.location} />
            <HourlyForecast data={data.hourly} />
            <DailyForecast data={data.daily} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
