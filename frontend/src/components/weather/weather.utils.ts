import type { DailyForecast } from './weather.types';

export const WMO_CODES: Record<number, { description: string; icon: string; gradient: string }> = {
  0: { description: 'Ceu limpo', icon: 'Sun', gradient: 'from-yellow-300/70 via-orange-300/45 to-sky-300/70' },
  1: { description: 'Principalmente limpo', icon: 'Sun', gradient: 'from-yellow-300/70 via-orange-300/45 to-sky-300/70' },
  2: { description: 'Parcialmente nublado', icon: 'CloudSun', gradient: 'from-blue-300/70 via-slate-100/50 to-gray-300/70' },
  3: { description: 'Nublado', icon: 'Cloud', gradient: 'from-gray-300/70 via-slate-200/50 to-gray-400/70' },
  45: { description: 'Neblina', icon: 'CloudFog', gradient: 'from-gray-200/80 via-slate-100/55 to-gray-300/80' },
  48: { description: 'Neblina com geada', icon: 'CloudFog', gradient: 'from-gray-200/80 via-blue-100/55 to-blue-200/80' },
  51: { description: 'Garoa leve', icon: 'CloudDrizzle', gradient: 'from-gray-300/70 via-blue-200/55 to-blue-400/70' },
  53: { description: 'Garoa moderada', icon: 'CloudDrizzle', gradient: 'from-gray-400/70 via-blue-300/55 to-blue-500/70' },
  55: { description: 'Garoa intensa', icon: 'CloudDrizzle', gradient: 'from-gray-500/70 via-blue-400/55 to-blue-600/70' },
  61: { description: 'Chuva leve', icon: 'CloudRain', gradient: 'from-blue-300/70 via-blue-400/55 to-blue-500/70' },
  63: { description: 'Chuva moderada', icon: 'CloudRain', gradient: 'from-blue-400/70 via-blue-500/55 to-blue-600/70' },
  65: { description: 'Chuva forte', icon: 'CloudRain', gradient: 'from-blue-500/70 via-blue-600/55 to-blue-700/70' },
  71: { description: 'Neve leve', icon: 'Snowflake', gradient: 'from-blue-100/80 via-slate-100/55 to-blue-200/80' },
  73: { description: 'Neve moderada', icon: 'Snowflake', gradient: 'from-blue-100/80 via-blue-200/55 to-blue-300/80' },
  75: { description: 'Neve forte', icon: 'Snowflake', gradient: 'from-blue-200/80 via-blue-300/55 to-blue-400/80' },
  95: { description: 'Tempestade', icon: 'CloudLightning', gradient: 'from-gray-600/80 via-slate-700/55 to-gray-800/80' },
  96: { description: 'Tempestade com granizo', icon: 'CloudLightning', gradient: 'from-gray-700/80 via-slate-800/55 to-gray-900/80' },
  99: { description: 'Tempestade com granizo forte', icon: 'CloudLightning', gradient: 'from-gray-800/80 via-slate-900/55 to-black/80' },
};

export function getWmoMeta(weatherCode: number): { description: string; icon: string; gradient: string } {
  return (
    WMO_CODES[weatherCode] ?? {
      description: 'Condicao desconhecida',
      icon: 'Cloud',
      gradient: 'from-gray-200/80 via-slate-100/55 to-gray-300/80',
    }
  );
}

export function formatTemperature(value: number): string {
  return `${Math.round(value)}°`;
}

export function formatHourFromIsoLike(value: string): string {
  const time = value.split('T')[1];
  return time ? time.slice(0, 5) : value;
}

export function formatDayOfWeek(date: Date): string {
  const raw = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date);
  return raw.length > 0 ? `${raw[0].toUpperCase()}${raw.slice(1)}` : raw;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isToday(daily: DailyForecast, now: Date = new Date()): boolean {
  return isSameDay(new Date(`${daily.date}T00:00:00`), now);
}
