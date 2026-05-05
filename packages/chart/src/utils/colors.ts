import { ChartKit } from "../core/ChartKit";

export function getChartColor(index: number, overrideColor?: string): string {
  if (overrideColor) return overrideColor;
  
  const colors = ChartKit.getConfig().colors || [];
  if (colors.length === 0) return "#3b82f6"; // fallback blue
  
  return colors[index % colors.length];
}
