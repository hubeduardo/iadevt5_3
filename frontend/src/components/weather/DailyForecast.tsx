import { DailyForecast as DailyForecastItem } from './weather.types';
import { formatTemperature } from './weather.utils';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
  data: DailyForecastItem[];
}

export function DailyForecast({ data }: DailyForecastProps) {
  const today = data[0]?.date;

  return (
    <section className="rounded-[2rem] border border-white/40 bg-white/22 p-5 shadow-[0_20px_70px_rgba(76,108,148,0.14)] backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">7 Dias</p>
      <h2 className="mt-1 text-2xl font-semibold text-slate-900">Proximos dias</h2>

      <div className="mt-5 space-y-3">
        {data.slice(0, 7).map((item) => {
          const isToday = item.date === today;
          return (
            <article
              key={item.date}
              data-testid={isToday ? 'daily-today' : undefined}
              className={`flex items-center justify-between rounded-[1.4rem] border px-4 py-3 transition ${
                isToday
                  ? 'border-slate-900/15 bg-slate-900 text-white shadow-lg'
                  : 'border-white/45 bg-white/45 text-slate-900'
              }`}
            >
              <div>
                <p className={`font-semibold ${isToday ? 'text-white' : 'text-slate-900'}`}>{item.dayOfWeek}</p>
                <p className={`text-sm ${isToday ? 'text-white/80' : 'text-slate-500'}`}>{item.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <WeatherIcon weatherCode={item.weatherCode} className={isToday ? 'text-white' : undefined} />
                <div className="text-right">
                  <p className={`font-semibold ${isToday ? 'text-white' : 'text-slate-900'}`}>
                    {formatTemperature(item.temperatureMax)}
                  </p>
                  <p className={`text-sm ${isToday ? 'text-white/80' : 'text-slate-500'}`}>
                    {formatTemperature(item.temperatureMin)}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
