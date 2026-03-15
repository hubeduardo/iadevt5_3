import { HourlyForecast as HourlyForecastItem } from './weather.types';
import { formatTemperature } from './weather.utils';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  data: HourlyForecastItem[];
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  return (
    <section className="rounded-[2rem] border border-white/40 bg-white/20 p-5 shadow-[0_20px_70px_rgba(76,108,148,0.14)] backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">24 Horas</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Previsao horaria</h2>
        </div>
        <span className="text-sm text-slate-500">Deslize para ver as proximas horas</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2" data-testid="hourly-scroll">
        {data.slice(0, 24).map((item) => (
          <article
            key={`${item.time}-${item.temperature}`}
            className="min-w-[108px] rounded-[1.5rem] border border-white/45 bg-white/45 p-4 text-center shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{item.time}</p>
            <div className="my-3 flex justify-center">
              <WeatherIcon weatherCode={item.weatherCode} size={28} />
            </div>
            <p className="text-lg font-semibold text-slate-900">{formatTemperature(item.temperature)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
