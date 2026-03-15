import { cn } from '@/lib/utils';
import { getWeatherVisual } from './weather.utils';

interface WeatherIconProps {
  weatherCode: number;
  size?: number;
  className?: string;
}

export function WeatherIcon({ weatherCode, size = 24, className }: WeatherIconProps) {
  const { icon: Icon, iconName, accent } = getWeatherVisual(weatherCode);

  return (
    <span data-testid={`weather-icon-${iconName}`} className={cn('inline-flex', accent, className)}>
      <Icon aria-hidden="true" size={size} strokeWidth={1.75} />
    </span>
  );
}
