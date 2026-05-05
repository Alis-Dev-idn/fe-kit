export interface ChartConfig {
  colors?: string[];
  grid?: boolean;
  tooltip?: boolean;
  legend?: boolean;
  radius?: number;
  strokeWidth?: number;
}

export class ChartKit {
  private static config: ChartConfig = {
    colors: [
      "#3b82f6", // Blue
      "#10b981", // Emerald
      "#f59e0b", // Amber
      "#ef4444", // Red
      "#8b5cf6", // Violet
    ],
    grid: true,
    tooltip: true,
    legend: true,
    radius: 4,
    strokeWidth: 2,
  };

  static setup(config: ChartConfig): void {
    this.config = { ...this.config, ...config };
  }

  static getConfig(): ChartConfig {
    return this.config;
  }
}
