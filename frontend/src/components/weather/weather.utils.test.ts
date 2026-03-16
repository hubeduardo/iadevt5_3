import { describe, expect, it } from 'vitest';
import { WMO_CODES, formatDayOfWeek, formatTemperature, getWmoMeta, isSameDay } from './weather.utils';

describe('weather.utils', () => {
  it('maps known WMO codes', () => {
    expect(WMO_CODES[0].description).toBe('Ceu limpo');
    expect(WMO_CODES[2].icon).toBe('CloudSun');
    expect(WMO_CODES[63].gradient).toContain('from-blue-400');
  });

  it('returns fallback meta for unknown code', () => {
    const meta = getWmoMeta(9999);
    expect(meta.description).toBe('Condicao desconhecida');
    expect(meta.icon).toBe('Cloud');
  });

  it('formats temperatures', () => {
    expect(formatTemperature(25)).toBe('25°');
    expect(formatTemperature(25.5)).toBe('26°');
  });

  it('formats weekday labels in pt-BR', () => {
    const label = formatDayOfWeek(new Date('2026-03-16T12:00:00'));
    expect(label[0]).toBe(label[0]?.toUpperCase());
  });

  it('compares same day correctly', () => {
    expect(isSameDay(new Date('2026-03-16T00:01:00'), new Date('2026-03-16T23:59:00'))).toBe(true);
    expect(isSameDay(new Date('2026-03-16T00:01:00'), new Date('2026-03-17T00:01:00'))).toBe(false);
  });
});
