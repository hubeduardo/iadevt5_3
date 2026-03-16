import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
  const [value, setValue] = React.useState('');

  function submit() {
    const city = value.trim();
    if (!city) return;
    onSearch(city);
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex gap-2">
        <label className="flex-1">
          <span className="sr-only">Cidade</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
            }}
            placeholder="Digite uma cidade (ex: São Paulo)"
            className="h-10 w-full rounded-xl border border-white/20 bg-white/20 px-4 text-sm text-foreground shadow-sm backdrop-blur-md placeholder:text-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={loading}
          />
        </label>
        <Button
          type="button"
          onClick={submit}
          disabled={loading || value.trim().length === 0}
          className="rounded-xl"
        >
          <Search className="mr-1 size-4" />
          Buscar
        </Button>
      </div>
      {hint ? <p className="mt-2 text-sm text-foreground/70">{hint}</p> : null}
    </div>
  );
}

