import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WeatherSearch } from './WeatherSearch';

describe('WeatherSearch', () => {
  it('should call onSearch with trimmed city on button click', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<WeatherSearch onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText(/Digite uma cidade/i), '  São Paulo  ');
    await user.click(screen.getByRole('button', { name: /buscar/i }));

    expect(onSearch).toHaveBeenCalledWith('São Paulo');
  });

  it('should call onSearch on Enter', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<WeatherSearch onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/Digite uma cidade/i);
    await user.type(input, 'Rio{enter}');

    expect(onSearch).toHaveBeenCalledWith('Rio');
  });
});

