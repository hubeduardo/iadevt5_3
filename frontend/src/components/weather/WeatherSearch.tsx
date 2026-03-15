import { FormEvent, useState } from 'react';
import { Search, LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WeatherSearchProps {
  onSearch: (city: string) => void;
  onUseLocation?: () => void;
  loading?: boolean;
  helperMessage?: string | null;
}

export function WeatherSearch({
  onSearch,
  onUseLocation,
  loading = false,
  helperMessage,
}: WeatherSearchProps) {
  const [city, setCity] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSearch(city);
  }

  return (
    <section className="rounded-[2rem] border border-white/40 bg-white/25 p-5 shadow-[0_24px_80px_rgba(94,129,172,0.18)] backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Weather Search</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Busque qualquer cidade</h2>
        </div>
        {onUseLocation ? (
          <Button
            type="button"
            variant="secondary"
            className="rounded-full bg-white/60 text-slate-700 hover:bg-white"
            onClick={onUseLocation}
          >
            <LocateFixed />
            Minha localizacao
          </Button>
        ) : null}
      </div>

      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="city-search">
          Digite o nome da cidade
        </label>
        <input
          id="city-search"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Ex.: Sao Paulo, Lisboa, Tokyo"
          className="h-12 flex-1 rounded-full border border-white/50 bg-white/70 px-5 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
        />
        <Button
          type="submit"
          className={cn(
            'h-12 rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800',
            loading && 'opacity-80'
          )}
          disabled={loading}
        >
          <Search />
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>
      </form>

      {helperMessage ? (
        <p className="mt-3 text-sm text-slate-600">{helperMessage}</p>
      ) : (
        <p className="mt-3 text-sm text-slate-500">Use a busca se a geolocalizacao estiver indisponivel ou se quiser trocar de cidade.</p>
      )}
    </section>
  );
}
