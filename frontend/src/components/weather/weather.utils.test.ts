import { describe, expect, it } from 'vitest';
import { formatDayLabel, formatTemperature, getBackgroundGradient, getWeatherVisual } from './weather.utils';

describe('weather.utils', () => {
  it('maps WMO codes to correct descriptions and icons', () => {
    const visual = getWeatherVisual(61);

    expect(visual.description).toBe('Chuva leve');
    expect(visual.iconName).toBe('CloudRain');
  });

  it('returns fallback visuals for unknown codes', () => {
    const visual = getWeatherVisual(999);

    expect(visual.description).toBe('Parcialmente nublado');
  });

  it('formats days in Portuguese', () => {
    expect(formatDayLabel('2025-02-03')).toContain('segunda');
  });

  it('formats temperatures as rounded degrees', () => {
    expect(formatTemperature(24.6)).toBe('25°');
  });

  it('builds adaptive gradients', () => {
    expect(getBackgroundGradient(95)).toContain('bg-gradient-to-br');
  });
});
