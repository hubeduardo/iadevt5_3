import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WeatherSearch } from './WeatherSearch';

describe('WeatherSearch', () => {
  it('triggers search on button click', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(<WeatherSearch onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText(/Digite uma cidade/i), '  Sao Paulo  ');
    await user.click(screen.getByRole('button', { name: /Buscar/i }));

    expect(onSearch).toHaveBeenCalledWith('Sao Paulo');
  });

  it('triggers search on enter', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(<WeatherSearch onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText(/Digite uma cidade/i), 'Rio{enter}');

    expect(onSearch).toHaveBeenCalledWith('Rio');
  });
});
