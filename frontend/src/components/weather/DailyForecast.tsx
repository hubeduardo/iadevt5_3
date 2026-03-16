import { cn } from '@/lib/utils';
import type { DailyForecast as DailyForecastType } from './weather.types';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperature, isToday } from './weather.utils';

export function DailyForecast({ data, className }: { data: DailyForecastType[]; className?: string }) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-white/20 bg-white/20 p-5 shadow-sm backdrop-blur-md',
        className
      )}
    >
      <h2 className="mb-3 text-sm font-medium text-foreground/80">Próximos 7 dias</h2>
      <div className="space-y-2" aria-label="Previsão diária">
        {data.slice(0, 7).map((day) => {
          const today = isToday(day);
          return (
            <div
              key={day.date}
              className={cn(
                'flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3',
                today && 'border-white/25 bg-white/15'
              )}
            >
              <div className="min-w-0">
                <div className="text-sm font-medium">{today ? 'Hoje' : day.dayOfWeek}</div>
                <div className="text-xs text-foreground/60">{day.date}</div>
              </div>

              <div className="flex items-center gap-3">
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

