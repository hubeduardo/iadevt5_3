import type { DailyForecast } from './weather.types';

export const WMO_CODES: Record<
  number,
  { description: string; icon: string; gradient: string }
> = {
  0: { description: 'Céu limpo', icon: 'Sun', gradient: 'from-yellow-300/60 via-orange-300/40 to-sky-300/60' },
  1: { description: 'Principalmente limpo', icon: 'Sun', gradient: 'from-yellow-300/60 via-orange-300/40 to-sky-300/60' },
  2: { description: 'Parcialmente nublado', icon: 'CloudSun', gradient: 'from-sky-300/60 via-slate-200/50 to-indigo-200/60' },
  3: { description: 'Nublado', icon: 'Cloud', gradient: 'from-slate-300/60 via-slate-200/40 to-slate-400/60' },
  45: { description: 'Neblina', icon: 'CloudFog', gradient: 'from-slate-200/60 via-slate-100/40 to-slate-300/60' },
  48: { description: 'Neblina com geada', icon: 'CloudFog', gradient: 'from-slate-200/60 via-sky-100/40 to-blue-200/60' },
  51: { description: 'Garoa leve', icon: 'CloudDrizzle', gradient: 'from-slate-300/60 via-sky-200/40 to-blue-300/60' },
  53: { description: 'Garoa moderada', icon: 'CloudDrizzle', gradient: 'from-slate-400/60 via-sky-200/40 to-blue-400/60' },
  55: { description: 'Garoa intensa', icon: 'CloudDrizzle', gradient: 'from-slate-500/60 via-sky-300/40 to-blue-500/60' },
  61: { description: 'Chuva leve', icon: 'CloudRain', gradient: 'from-sky-300/60 via-blue-300/40 to-indigo-300/60' },
  63: { description: 'Chuva moderada', icon: 'CloudRain', gradient: 'from-blue-400/60 via-indigo-300/40 to-slate-400/60' },
  65: { description: 'Chuva forte', icon: 'CloudRain', gradient: 'from-blue-500/60 via-indigo-400/40 to-slate-500/60' },
  71: { description: 'Neve leve', icon: 'Snowflake', gradient: 'from-sky-100/70 via-blue-100/50 to-slate-200/70' },
  73: { description: 'Neve moderada', icon: 'Snowflake', gradient: 'from-sky-100/70 via-blue-200/50 to-slate-200/70' },
  75: { description: 'Neve forte', icon: 'Snowflake', gradient: 'from-blue-200/70 via-indigo-200/50 to-slate-300/70' },
  95: { description: 'Tempestade', icon: 'CloudLightning', gradient: 'from-slate-600/60 via-indigo-500/40 to-slate-800/60' },
  96: { description: 'Tempestade com granizo', icon: 'CloudLightning', gradient: 'from-slate-700/60 via-indigo-600/40 to-slate-900/60' },
  99: { description: 'Tempestade com granizo forte', icon: 'CloudLightning', gradient: 'from-slate-800/60 via-indigo-700/40 to-slate-950/60' },
};

export function getWmoMeta(weatherCode: number): { description: string; icon: string; gradient: string } {
  return WMO_CODES[weatherCode] ?? {
    description: 'Condição desconhecida',
    icon: 'Cloud',
    gradient: 'from-slate-200/60 via-slate-100/40 to-slate-300/60',
  };
}

export function formatTemperature(value: number): string {
  const rounded = Math.round(value);
  return `${rounded}°`;
}

export function formatHourFromIsoLike(value: string): string {
  // "2026-03-16T14:00" -> "14:00"
  const time = value.split('T')[1];
  if (!time) return value;
  return time.slice(0, 5);
}

export function formatDayOfWeek(date: Date): string {
  const raw = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date);
  return raw.length > 0 ? raw[0].toUpperCase() + raw.slice(1) : raw;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isToday(daily: DailyForecast, now: Date = new Date()): boolean {
  const date = new Date(`${daily.date}T00:00:00`);
  return isSameDay(date, now);
}

