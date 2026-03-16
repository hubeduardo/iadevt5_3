import * as React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function WeatherSearch({
  onSearch,
  loading = false,
  hint,
  className,
}: {
  onSearch: (city: string) => void;
  loading?: boolean;
  hint?: string;
  className?: string;
}) {
  const [city, setCity] = React.useState('');

  function submit() {
    const nextCity = city.trim();
    if (!nextCity) return;
    onSearch(nextCity);
  }

  return (
    <div className={cn('w-full min-w-0', className)}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Cidade</span>
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submit();
            }}
            placeholder="Digite uma cidade (ex: Sao Paulo)"
            className="h-11 w-full min-w-0 rounded-xl border border-white/20 bg-white/20 px-4 text-sm text-foreground shadow-sm backdrop-blur-md placeholder:text-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-10"
            disabled={loading}
          />
        </label>
        <Button
          type="button"
          onClick={submit}
          disabled={loading || city.trim().length === 0}
          className="h-11 w-full rounded-xl sm:h-10 sm:w-auto"
        >
          <Search className="mr-1 size-4" />
          Buscar
        </Button>
      </div>
      {hint ? <p className="mt-2 text-sm leading-5 text-foreground/70">{hint}</p> : null}
    </div>
  );
}
