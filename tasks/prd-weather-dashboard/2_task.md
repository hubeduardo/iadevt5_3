# Tarefa 2.0: Frontend - Weather Dashboard

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar a camada frontend completa do Weather Dashboard, incluindo types, hooks, utils e todos os componentes React. A interface deve seguir o design system Apple-like com glassmorphism, gradientes adaptativos às condições climáticas e experiência visual premium.

<requirements>
- RF01: O sistema deve solicitar permissão de geolocalização ao carregar a página
- RF02: Se autorizado, o sistema deve obter as coordenadas e buscar o clima automaticamente
- RF03: Se negado ou indisponível, o sistema deve exibir um campo de busca com mensagem orientativa
- RF04: O sistema deve exibir um campo de busca para digitação do nome da cidade
- RF06: O sistema deve tratar casos de cidade não encontrada com mensagem amigável
- RF07: O sistema deve permitir nova busca a qualquer momento
- RF08-RF14: Exibir clima atual (temperatura, sensação térmica, umidade, vento, condição, ícone, cidade/país)
- RF15-RF17: Previsão horária (24h) com scroll horizontal
- RF18-RF20: Previsão de 7 dias com destaque no dia atual
</requirements>

## Subtarefas

- [ ] 2.1 Criar arquivo `frontend/src/components/weather/weather.types.ts` com interfaces compartilhadas
- [ ] 2.2 Criar arquivo `frontend/src/components/weather/weather.utils.ts` com utilitários (mapeamento WMO, formatação)
- [ ] 2.3 Criar arquivo `frontend/src/components/weather/weather.hooks.ts` com hooks `useWeather` e `useGeolocation`
- [ ] 2.4 Criar componente `frontend/src/components/weather/WeatherIcon.tsx`
- [ ] 2.5 Criar componente `frontend/src/components/weather/WeatherSearch.tsx`
- [ ] 2.6 Criar componente `frontend/src/components/weather/CurrentWeather.tsx`
- [ ] 2.7 Criar componente `frontend/src/components/weather/HourlyForecast.tsx`
- [ ] 2.8 Criar componente `frontend/src/components/weather/DailyForecast.tsx`
- [ ] 2.9 Criar componente `frontend/src/components/weather/WeatherDashboard.tsx` (página principal)
- [ ] 2.10 Criar testes unitários dos componentes e utils

## Detalhes de Implementação

Consulte a seção **"Design de Implementação"** e **"Diretrizes de UI/UX"** do arquivo `techspec.md` para detalhes completos.

### Interfaces (weather.types.ts)

```typescript
interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
}

interface DailyForecast {
  date: string;
  dayOfWeek: string;
  temperatureMin: number;
  temperatureMax: number;
  weatherCode: number;
}

interface WeatherData {
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}
```

### Mapeamento WMO Weather Codes (weather.utils.ts)

```typescript
const WMO_CODES: Record<number, { description: string; icon: string; gradient: string }> = {
  0: { description: "Céu limpo", icon: "Sun", gradient: "from-yellow-400 to-orange-500" },
  1: { description: "Principalmente limpo", icon: "Sun", gradient: "from-yellow-400 to-orange-500" },
  2: { description: "Parcialmente nublado", icon: "CloudSun", gradient: "from-blue-400 to-gray-400" },
  3: { description: "Nublado", icon: "Cloud", gradient: "from-gray-400 to-gray-600" },
  45: { description: "Neblina", icon: "CloudFog", gradient: "from-gray-300 to-gray-500" },
  48: { description: "Neblina com geada", icon: "CloudFog", gradient: "from-gray-300 to-blue-300" },
  51: { description: "Garoa leve", icon: "CloudDrizzle", gradient: "from-gray-400 to-blue-500" },
  53: { description: "Garoa moderada", icon: "CloudDrizzle", gradient: "from-gray-500 to-blue-600" },
  55: { description: "Garoa intensa", icon: "CloudDrizzle", gradient: "from-gray-600 to-blue-700" },
  61: { description: "Chuva leve", icon: "CloudRain", gradient: "from-blue-400 to-blue-600" },
  63: { description: "Chuva moderada", icon: "CloudRain", gradient: "from-blue-500 to-blue-700" },
  65: { description: "Chuva forte", icon: "CloudRain", gradient: "from-blue-600 to-blue-800" },
  71: { description: "Neve leve", icon: "Snowflake", gradient: "from-blue-100 to-blue-300" },
  73: { description: "Neve moderada", icon: "Snowflake", gradient: "from-blue-200 to-blue-400" },
  75: { description: "Neve forte", icon: "Snowflake", gradient: "from-blue-300 to-blue-500" },
  95: { description: "Tempestade", icon: "CloudLightning", gradient: "from-gray-700 to-purple-900" },
  96: { description: "Tempestade com granizo", icon: "CloudLightning", gradient: "from-gray-800 to-purple-900" },
  99: { description: "Tempestade com granizo forte", icon: "CloudLightning", gradient: "from-gray-900 to-purple-900" },
};
```

### Hooks (weather.hooks.ts)

**useGeolocation**: Hook para obter coordenadas do navegador
- Retorna: `{ coordinates, error, loading, requestPermission }`

**useWeather**: Hook para buscar dados climáticos
- Parâmetros: coordenadas (lat/lon) ou nome da cidade
- Retorna: `{ data, error, loading, fetchByCity, fetchByCoordinates }`

### Diretrizes de UI/UX (Inspiração Apple)

- **Minimalismo**: Interface limpa, sem elementos desnecessários
- **Tipografia**: Fontes grandes e legíveis para temperatura principal, hierarquia visual clara
- **Cores**: Gradientes suaves que se adaptam à condição climática
- **Animações**: Transições suaves entre estados
- **Glassmorphism**: Uso de blur e transparência em cards (`backdrop-blur-md bg-white/20`)
- **Responsividade**: Design adaptável para desktop, tablet e mobile

### Componentes

**WeatherIcon.tsx**
- Mapeia código WMO para ícone Lucide React correspondente
- Props: `weatherCode: number`, `size?: number`, `className?: string`

**WeatherSearch.tsx**
- Campo de busca com input e botão
- Props: `onSearch: (city: string) => void`, `loading?: boolean`
- Exibir mensagem orientativa quando geolocalização não disponível

**CurrentWeather.tsx**
- Exibe clima atual: temperatura, sensação térmica, umidade, vento, condição, cidade/país
- Props: `data: CurrentWeather`, `location: Location`
- Tipografia grande para temperatura principal

**HourlyForecast.tsx**
- Lista horizontal com scroll das próximas 24 horas
- Props: `data: HourlyForecast[]`
- Cada item: horário, ícone, temperatura

**DailyForecast.tsx**
- Lista vertical dos próximos 7 dias
- Props: `data: DailyForecast[]`
- Cada item: dia da semana, ícone, temp min/max
- Destacar dia atual visualmente

**WeatherDashboard.tsx**
- Página principal que compõe todos os componentes
- Gerencia estado de loading, erro e dados
- Aplica gradiente de fundo baseado na condição climática
- Solicita geolocalização ao carregar

## Critérios de Sucesso

- Página carrega e solicita permissão de geolocalização
- Se permitido, exibe clima da localização atual automaticamente
- Se negado, exibe campo de busca com mensagem orientativa
- Busca por cidade funciona e exibe resultados
- Cidade não encontrada exibe mensagem amigável
- Previsão horária permite scroll horizontal
- Previsão de 7 dias destaca o dia atual
- Gradiente de fundo muda conforme condição climática
- Interface responsiva (desktop, tablet, mobile)
- Glassmorphism aplicado nos cards
- Código 100% tipado (sem `any`)
- Testes unitários passando

## Testes da Tarefa

- [ ] Testes de unidade para `weather.utils.ts`:
  - Testar mapeamento de códigos WMO para descrições corretas
  - Testar mapeamento de códigos WMO para ícones corretos
  - Testar mapeamento de códigos WMO para gradientes corretos
  - Testar formatação de datas
  - Testar formatação de temperaturas

- [ ] Testes de unidade para `WeatherIcon.tsx`:
  - Testar renderização do ícone correto para cada código WMO
  - Testar props de tamanho e className

- [ ] Testes de unidade para `useWeather.ts`:
  - Testar estado inicial (loading: false, data: null, error: null)
  - Testar estado de loading durante fetch
  - Testar estado de sucesso com dados
  - Testar estado de erro

- [ ] Testes de componentes:
  - `CurrentWeather`: renderiza temperatura, cidade, condição
  - `HourlyForecast`: renderiza 24 itens com scroll
  - `DailyForecast`: renderiza 7 dias, destaca dia atual
  - `WeatherSearch`: dispara callback ao buscar

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>
<critical>VERIFICAR O RESPONSIVO DA PAGINA</critical>
<critical>VERIFICAR A QUESTÃO DE SCROLL LATERIAL, COMO TEMOS 24H À FRENTE PODE HAVER PROBLEMAS NESSE COMPONENTE</critical>

## Arquivos relevantes

**Arquivos a criar:**
- `frontend/src/components/weather/weather.types.ts`
- `frontend/src/components/weather/weather.utils.ts`
- `frontend/src/components/weather/weather.hooks.ts`
- `frontend/src/components/weather/WeatherIcon.tsx`
- `frontend/src/components/weather/WeatherSearch.tsx`
- `frontend/src/components/weather/CurrentWeather.tsx`
- `frontend/src/components/weather/HourlyForecast.tsx`
- `frontend/src/components/weather/DailyForecast.tsx`
- `frontend/src/components/weather/WeatherDashboard.tsx`
- `frontend/src/components/weather/WeatherIcon.test.tsx`
- `frontend/src/components/weather/weather.utils.test.ts`

**Dependências:**
- Lucide React (já instalado no projeto)
- Tailwind CSS (já configurado no projeto)
