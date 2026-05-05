export interface RealtimeOptions<T> {
  enabled?: boolean;

  // data source
  stream?: {
    subscribe: (push: (data: T) => void) => () => void;
  };

  // fallback polling
  polling?: {
    interval: number;
    fetcher: () => Promise<T>;
  };

  // buffer control
  maxPoints?: number; // max data points in memory (default: 50)
  windowSize?: number; // visible window size

  // behavior
  autoScroll?: boolean; // always show latest data
  smooth?: boolean; // animate transitions

  // performance
  throttleMs?: number; // limit updates frequency
}

export interface BaseChartProps<T = any> {
  data: T[];
  xKey: string;

  height?: number;
  responsive?: boolean;

  grid?: boolean;
  tooltip?: boolean;
  legend?: boolean;

  className?: string;

  // Streaming extension
  realtime?: RealtimeOptions<T>;

  // Formatting
  formatValue?: (value: number) => string;
  formatLabel?: (label: string) => string;
}
