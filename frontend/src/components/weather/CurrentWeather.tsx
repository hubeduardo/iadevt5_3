import { Droplets, MapPin, Thermometer, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WeatherIcon } from './WeatherIcon';
import type { CurrentWeather as CurrentWeatherData, WeatherLocation } from './weather.types';
import { formatTemperature } from './weather.utils';

export function CurrentWeather({
  data,
  location,
  className,
}: {
  data: CurrentWeatherData;
  location: WeatherLocation;
  className?: string;
}) {
  return (
    <section className={cn('max-w-full overflow-hidden rounded-3xl border border-white/20 bg-white/20 p-4 shadow-sm backdrop-blur-md sm:p-5', className)}>
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">
              {location.name}
              {location.country ? `, ${location.country}` : ''}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
            <div className="text-5xl font-semibold tracking-tight sm:text-6xl">{formatTemperature(data.temperature)}</div>
            <div className="pb-1 text-sm text-foreground/70 sm:pb-2">{data.weatherDescription}</div>
          </div>
        </div>
        <WeatherIcon weatherCode={data.weatherCode} size={30} className="shrink-0 pt-1 text-foreground/80 sm:size-[34px]" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <div className="flex items-center gap-2 text-xs text-foreground/70">
            <Thermometer className="size-4 shrink-0" />
            Sensacao
          </div>
          <div className="mt-1 text-lg font-medium">{formatTemperature(data.feelsLike)}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <div className="flex items-center gap-2 text-xs text-foreground/70">
            <Droplets className="size-4 shrink-0" />
            Umidade
          </div>
          <div className="mt-1 text-lg font-medium">{Math.round(data.humidity)}%</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-xs text-foreground/70">
            <Wind className="size-4 shrink-0" />
            Vento
          </div>
          <div className="mt-1 text-lg font-medium">{Math.round(data.windSpeed)} km/h</div>
        </div>
      </div>
    </section>
  );
}
