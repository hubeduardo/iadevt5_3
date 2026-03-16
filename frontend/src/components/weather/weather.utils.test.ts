import { describe, it, expect } from 'vitest';
import { WMO_CODES, formatDayOfWeek, formatTemperature, getWmoMeta, isSameDay } from './weather.utils';

describe('weather.utils', () => {
  it('should map known WMO codes', () => {
    expect(WMO_CODES[0].description).toBe('Céu limpo');
    expect(WMO_CODES[2].icon).toBe('CloudSun');
  });

  it('should provide fallback meta for unknown code', () => {
    const meta = getWmoMeta(9999);
    expect(meta.description).toBeTruthy();
    expect(meta.icon).toBeTruthy();
    expect(meta.gradient).toBeTruthy();
  });

  it('should format temperature as degrees', () => {
    expect(formatTemperature(25)).toBe('25°');
    expect(formatTemperature(25.49)).toBe('25°');
    expect(formatTemperature(25.5)).toBe('26°');
  });

  it('should format day of week (pt-BR) with capitalized first letter', () => {
    const d = new Date('2026-03-16T12:00:00');
    const label = formatDayOfWeek(d);
    expect(label[0]).toBe(label[0]?.toUpperCase());
  });

  it('should compare same day correctly', () => {
    expect(isSameDay(new Date('2026-03-16T00:01:00'), new Date('2026-03-16T23:59:00'))).toBe(true);
    expect(isSameDay(new Date('2026-03-16T23:59:00'), new Date('2026-03-17T00:01:00'))).toBe(false);
  });
});

