import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  LucideIcon,
  Snowflake,
  Sun,
} from 'lucide-react';

export interface WeatherVisual {
  description: string;
  icon: LucideIcon;
  iconName: string;
  gradient: string;
  accent: string;
}

export const WMO_CODES: Record<number, WeatherVisual> = {
  0: { description: 'Ceu limpo', icon: Sun, iconName: 'Sun', gradient: 'from-amber-200 via-sky-200 to-blue-400', accent: 'text-amber-500' },
  1: { description: 'Principalmente limpo', icon: Sun, iconName: 'Sun', gradient: 'from-amber-200 via-sky-200 to-blue-400', accent: 'text-amber-500' },
  2: { description: 'Parcialmente nublado', icon: CloudSun, iconName: 'CloudSun', gradient: 'from-sky-200 via-cyan-200 to-slate-400', accent: 'text-sky-600' },
  3: { description: 'Nublado', icon: Cloud, iconName: 'Cloud', gradient: 'from-slate-200 via-slate-300 to-slate-500', accent: 'text-slate-600' },
  45: { description: 'Neblina', icon: CloudFog, iconName: 'CloudFog', gradient: 'from-slate-100 via-slate-200 to-slate-400', accent: 'text-slate-500' },
  48: { description: 'Neblina com geada', icon: CloudFog, iconName: 'CloudFog', gradient: 'from-slate-100 via-cyan-100 to-sky-300', accent: 'text-cyan-600' },
  51: { description: 'Garoa leve', icon: CloudDrizzle, iconName: 'CloudDrizzle', gradient: 'from-slate-200 via-sky-300 to-blue-500', accent: 'text-blue-600' },
  53: { description: 'Garoa moderada', icon: CloudDrizzle, iconName: 'CloudDrizzle', gradient: 'from-slate-300 via-sky-400 to-blue-600', accent: 'text-blue-700' },
  55: { description: 'Garoa intensa', icon: CloudDrizzle, iconName: 'CloudDrizzle', gradient: 'from-slate-400 via-sky-500 to-blue-700', accent: 'text-blue-800' },
  61: { description: 'Chuva leve', icon: CloudRain, iconName: 'CloudRain', gradient: 'from-sky-300 via-blue-500 to-indigo-700', accent: 'text-blue-700' },
  63: { description: 'Chuva moderada', icon: CloudRain, iconName: 'CloudRain', gradient: 'from-sky-400 via-blue-600 to-indigo-800', accent: 'text-blue-800' },
  65: { description: 'Chuva forte', icon: CloudRain, iconName: 'CloudRain', gradient: 'from-slate-500 via-blue-700 to-indigo-900', accent: 'text-indigo-900' },
  71: { description: 'Neve leve', icon: Snowflake, iconName: 'Snowflake', gradient: 'from-cyan-50 via-sky-100 to-blue-300', accent: 'text-cyan-600' },
  73: { description: 'Neve moderada', icon: Snowflake, iconName: 'Snowflake', gradient: 'from-cyan-100 via-sky-200 to-blue-400', accent: 'text-sky-700' },
  75: { description: 'Neve forte', icon: Snowflake, iconName: 'Snowflake', gradient: 'from-cyan-200 via-sky-300 to-blue-500', accent: 'text-blue-700' },
  95: { description: 'Tempestade', icon: CloudLightning, iconName: 'CloudLightning', gradient: 'from-slate-600 via-slate-800 to-sky-950', accent: 'text-amber-300' },
  96: { description: 'Tempestade com granizo', icon: CloudLightning, iconName: 'CloudLightning', gradient: 'from-slate-700 via-slate-900 to-sky-950', accent: 'text-amber-300' },
  99: { description: 'Tempestade com granizo forte', icon: CloudLightning, iconName: 'CloudLightning', gradient: 'from-slate-800 via-slate-950 to-black', accent: 'text-amber-200' },
};

const FALLBACK_VISUAL = WMO_CODES[2];

export function getWeatherVisual(weatherCode: number): WeatherVisual {
  return WMO_CODES[weatherCode] ?? FALLBACK_VISUAL;
}

export function formatTemperature(value: number): string {
  return `${Math.round(value)}°`;
}

export function formatDayLabel(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(new Date(date));
}

export function formatLocationLabel(name: string, country: string): string {
  return `${name}, ${country}`;
}

export function getBackgroundGradient(weatherCode: number): string {
  const { gradient } = getWeatherVisual(weatherCode);
  return `bg-gradient-to-br ${gradient}`;
}
