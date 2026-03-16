import { cn } from '@/lib/utils';
import type { HourlyForecast as HourlyForecastType } from './weather.types';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperature } from './weather.utils';

export function HourlyForecast({ data, className }: { data: HourlyForecastType[]; className?: string }) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-white/20 bg-white/20 p-5 shadow-sm backdrop-blur-md',
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground/80">Próximas 24 horas</h2>
        <div className="text-xs text-foreground/60">Arraste para navegar</div>
      </div>
      <div
        className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Previsão horária"
      >
        {data.slice(0, 24).map((item) => (
          <div
            key={item.time}
            className="min-w-[86px] rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-center"
          >
            <div className="text-xs text-foreground/70">{item.time}</div>
            <div className="mt-2 flex justify-center">
              <WeatherIcon weatherCode={item.weatherCode} size={18} className="text-foreground/80" />
            </div>
            <div className="mt-2 text-sm font-medium">{formatTemperature(item.temperature)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

