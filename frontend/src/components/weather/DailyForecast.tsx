import { cn } from '@/lib/utils';
import { WeatherIcon } from './WeatherIcon';
import type { DailyForecast as DailyForecastData } from './weather.types';
import { formatTemperature, isToday } from './weather.utils';

export function DailyForecast({ data, className }: { data: DailyForecastData[]; className?: string }) {
  return (
    <section className={cn('max-w-full overflow-hidden rounded-3xl border border-white/20 bg-white/20 p-4 shadow-sm backdrop-blur-md sm:p-5', className)}>
      <h2 className="mb-3 text-sm font-medium text-foreground/80">Proximos 7 dias</h2>
      <div className="space-y-2" aria-label="Previsao diaria">
        {data.slice(0, 7).map((day) => {
          const today = isToday(day);

          return (
            <div
              key={day.date}
              className={cn(
                'flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-2.5 sm:px-4 sm:py-3',
                today && 'border-white/25 bg-white/15'
              )}
            >
              <div className="min-w-0">
                <div className="text-sm font-medium">{today ? 'Hoje' : day.dayOfWeek}</div>
                <div className="text-xs text-foreground/60">{day.date}</div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <WeatherIcon weatherCode={day.weatherCode} size={18} className="text-foreground/80" />
                <div className="text-sm text-foreground/80">
                  <span className="font-medium">{formatTemperature(day.temperatureMax)}</span>
                  <span className="mx-1 text-foreground/50">/</span>
                  <span className="text-foreground/70">{formatTemperature(day.temperatureMin)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
