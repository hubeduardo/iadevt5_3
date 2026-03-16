import { Droplets, MapPin, Thermometer, Wind } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';
import { cn } from '@/lib/utils';
import type { CurrentWeather as CurrentWeatherType, WeatherLocation } from './weather.types';
import { formatTemperature } from './weather.utils';

export function CurrentWeather({
  data,
  location,
  className,
}: {
  data: CurrentWeatherType;
  location: WeatherLocation;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-white/20 bg-white/20 p-5 shadow-sm backdrop-blur-md',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <MapPin className="size-4" />
            <span className="truncate">
              {location.name}
              {location.country ? `, ${location.country}` : ''}
            </span>
          </div>
          <div className="mt-2 flex items-end gap-3">
            <div className="text-6xl font-semibold tracking-tight">{formatTemperature(data.temperature)}</div>
            <div className="pb-2 text-sm text-foreground/70">{data.weatherDescription}</div>
          </div>
        </div>
        <div className="pt-1">
          <WeatherIcon weatherCode={data.weatherCode} size={34} className="text-foreground/80" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <div className="flex items-center gap-2 text-xs text-foreground/70">
            <Thermometer className="size-4" />
            Sensação
          </div>
          <div className="mt-1 text-lg font-medium">{formatTemperature(data.feelsLike)}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <div className="flex items-center gap-2 text-xs text-foreground/70">
            <Droplets className="size-4" />
            Umidade
          </div>
          <div className="mt-1 text-lg font-medium">{Math.round(data.humidity)}%</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <div className="flex items-center gap-2 text-xs text-foreground/70">
            <Wind className="size-4" />
            Vento
          </div>
          <div className="mt-1 text-lg font-medium">{Math.round(data.windSpeed)} km/h</div>
        </div>
      </div>
    </section>
  );
}

