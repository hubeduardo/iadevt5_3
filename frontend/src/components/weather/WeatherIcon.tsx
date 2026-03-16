import * as React from 'react';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Snowflake,
  Sun,
  type LucideIcon,
} from 'lucide-react';
import { getWmoMeta } from './weather.utils';

const ICONS: Record<string, LucideIcon> = {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
};

export function WeatherIcon({
  weatherCode,
  size = 20,
  className,
}: {
  weatherCode: number;
  size?: number;
  className?: string;
}) {
  const meta = getWmoMeta(weatherCode);
  const Icon = ICONS[meta.icon] ?? Cloud;

  return <Icon aria-label={meta.description} className={className} size={size} />;
}

export const WeatherIconMemo = React.memo(WeatherIcon);

