import { Droplets, MapPin, Wind } from 'lucide-react';
import { WeatherData, WeatherLocation } from './weather.types';
import { formatLocationLabel, formatTemperature, getWeatherVisual } from './weather.utils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  data: WeatherData['current'];
  location: WeatherLocation;
}

export function CurrentWeather({ data, location }: CurrentWeatherProps) {
  const visual = getWeatherVisual(data.weatherCode);

  return (
    <section className="overflow-hidden rounded-[2.25rem] border border-white/45 bg-white/22 p-6 text-slate-950 shadow-[0_32px_120px_rgba(61,95,140,0.18)] backdrop-blur-xl md:p-8">
      <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-r ${visual.gradient} opacity-55 blur-3xl`} />
      <div className="relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Agora</p>
            <h1 className="mt-3 max-w-xl text-5xl font-semibold tracking-tight md:text-7xl">
              {formatTemperature(data.temperature)}
            </h1>
            <div className="mt-4 flex items-center gap-3 text-slate-700">
              <MapPin className="h-4 w-4" />
              <span className="text-sm md:text-base">{formatLocationLabel(location.name, location.country)}</span>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/50 bg-white/35 p-5 shadow-inner shadow-white/30">
            <div className="flex items-center gap-4">
              <WeatherIcon weatherCode={data.weatherCode} size={56} />
              <div>
                <p className="text-lg font-semibold">{data.weatherDescription}</p>
                <p className="text-sm text-slate-600">Sensacao de {formatTemperature(data.feelsLike)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/40 bg-white/35 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Droplets className="h-4 w-4" />
              Umidade
            </div>
            <p className="mt-3 text-2xl font-semibold">{data.humidity}%</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/40 bg-white/35 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Wind className="h-4 w-4" />
              Vento
            </div>
            <p className="mt-3 text-2xl font-semibold">{Math.round(data.windSpeed)} km/h</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/40 bg-white/35 p-4">
            <div className="text-sm text-slate-600">Condicao</div>
            <p className="mt-3 text-2xl font-semibold">{visual.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
