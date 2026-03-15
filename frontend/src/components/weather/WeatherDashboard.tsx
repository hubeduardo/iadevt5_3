import { useEffect } from 'react';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import { CurrentWeather } from './CurrentWeather';
import { DailyForecast } from './DailyForecast';
import { HourlyForecast } from './HourlyForecast';
import { WeatherSearch } from './WeatherSearch';
import { useGeolocation, useWeather } from './weather.hooks';
import { getBackgroundGradient } from './weather.utils';

export function WeatherDashboard() {
  const weather = useWeather();
  const geolocation = useGeolocation(true);

  useEffect(() => {
    if (!geolocation.coordinates) {
      return;
    }

    void weather.fetchByCoordinates(
      geolocation.coordinates.latitude,
      geolocation.coordinates.longitude
    );
  }, [geolocation.coordinates]);

  const helperMessage = geolocation.error ?? 'Permita a localizacao para ver o clima atual automaticamente.';
  const backgroundClass = weather.data
    ? getBackgroundGradient(weather.data.current.weatherCode)
    : 'bg-gradient-to-br from-sky-100 via-white to-blue-200';

  return (
    <main className={`min-h-screen overflow-hidden px-4 py-6 text-slate-900 transition-colors duration-700 md:px-6 ${backgroundClass}`}>
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/15 p-5 shadow-[0_40px_140px_rgba(88,121,164,0.18)] backdrop-blur-2xl md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(125,211,252,0.26),transparent_30%)]" />

          <div className="relative">
            <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">Weather Dashboard</p>
                <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">
                  Clima elegante, em tempo real, sem ruido visual.
                </h1>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-600">
                O painel prioriza sua localizacao ao carregar a pagina, mas voce pode alternar de cidade a qualquer momento.
              </p>
            </header>

            <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
              <div className="space-y-6">
                <WeatherSearch
                  onSearch={(city) => void weather.fetchByCity(city)}
                  onUseLocation={geolocation.requestPermission}
                  loading={weather.loading || geolocation.loading}
                  helperMessage={helperMessage}
                />

                {weather.error ? (
                  <div className="rounded-[2rem] border border-red-200/70 bg-white/55 p-5 text-red-700 backdrop-blur-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5" />
                      <div>
                        <p className="font-semibold">Nao foi possivel carregar o clima</p>
                        <p className="mt-1 text-sm">{weather.error === 'Cidade nao encontrada' ? 'Cidade nao encontrada. Tente um nome mais especifico.' : weather.error}</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {weather.loading && !weather.data ? (
                  <div className="flex min-h-[280px] items-center justify-center rounded-[2rem] border border-white/40 bg-white/25 backdrop-blur-xl">
                    <div className="flex items-center gap-3 text-slate-600">
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      Carregando previsao...
                    </div>
                  </div>
                ) : null}

                {weather.data ? (
                  <>
                    <CurrentWeather data={weather.data.current} location={weather.data.location} />
                    <HourlyForecast data={weather.data.hourly} />
                  </>
                ) : null}
              </div>

              <div className="space-y-6">
                <aside className="rounded-[2rem] border border-white/40 bg-slate-950/80 p-6 text-white shadow-[0_20px_70px_rgba(15,23,42,0.28)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Modo Automatico</p>
                  <h2 className="mt-3 text-2xl font-semibold">Abertura inteligente</h2>
                  <p className="mt-3 text-sm leading-6 text-white/75">
                    Ao entrar na pagina, o painel tenta obter sua localizacao. Se a permissao for negada ou indisponivel, a busca por cidade permanece disponivel com orientacao clara.
                  </p>
                </aside>

                {weather.data ? (
                  <DailyForecast data={weather.data.daily} />
                ) : (
                  <div className="rounded-[2rem] border border-white/40 bg-white/25 p-6 text-slate-700 backdrop-blur-xl">
                    <p className="text-lg font-semibold">Pronto para uma busca manual</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Informe uma cidade para ver o clima atual, as proximas 24 horas e a previsao dos proximos 7 dias.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
