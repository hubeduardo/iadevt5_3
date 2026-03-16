import { cn } from '@/lib/utils';
import { WeatherIcon } from './WeatherIcon';
import type { HourlyForecast as HourlyForecastData } from './weather.types';
import { formatTemperature } from './weather.utils';

export function HourlyForecast({ data, className }: { data: HourlyForecastData[]; className?: string }) {
  return (
    <section className={cn('max-w-full overflow-hidden rounded-3xl border border-white/20 bg-white/20 p-4 shadow-sm backdrop-blur-md sm:p-5', className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-foreground/80">Proximas 24 horas</h2>
        <div className="hidden text-xs text-foreground/60 sm:block">Arraste para navegar</div>
      </div>

      <div className="max-w-full overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:pb-2">
        <div className="flex min-w-0 gap-2 sm:gap-3" aria-label="Previsao horaria">
          {data.slice(0, 24).map((item) => (
            <div
              key={`${item.time}-${item.weatherCode}`}
              className="min-w-[78px] shrink-0 rounded-2xl border border-white/10 bg-white/10 px-2.5 py-2.5 text-center sm:min-w-[86px] sm:px-3 sm:py-3"
            >
              <div className="text-xs text-foreground/70">{item.time}</div>
              <div className="mt-2 flex justify-center">
                <WeatherIcon weatherCode={item.weatherCode} size={18} className="text-foreground/80" />
              </div>
              <div className="mt-2 text-sm font-medium">{formatTemperature(item.temperature)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
