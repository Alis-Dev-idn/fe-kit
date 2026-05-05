import React from "react";
import {
  ComposedChart as RechartsComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BaseChartProps } from "../../types";
import { ChartKit } from "../../core/ChartKit";
import { getChartColor } from "../../utils/colors";
import { useRealtimeData } from "../../hooks/useRealtimeData";
import clsx from "clsx";

export interface ComposedChartProps<T> extends BaseChartProps<T> {
  bars?: { dataKey: string; name?: string; color?: string; stackId?: string }[];
  lines?: { dataKey: string; name?: string; color?: string }[];
  areas?: { dataKey: string; name?: string; color?: string; stackId?: string }[];
}

export function ComposedChart<T = any>({
  data: initialData,
  xKey,
  bars = [],
  lines = [],
  areas = [],
  height = 300,
  responsive = true,
  grid = ChartKit.getConfig().grid,
  tooltip = ChartKit.getConfig().tooltip,
  legend = ChartKit.getConfig().legend,
  className,
  realtime,
  formatValue,
  formatLabel,
}: ComposedChartProps<T>) {
  const { data, isStreaming } = useRealtimeData(initialData, realtime);
  const strokeWidth = ChartKit.getConfig().strokeWidth || 2;
  const radius = ChartKit.getConfig().radius || 4;
  const isAnimated = realtime?.smooth !== false && data.length <= 200;

  // We need to keep track of the color index across different types
  let colorIndex = 0;

  const content = (
    <RechartsComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <defs>
        {areas.map((area, idx) => {
          const color = getChartColor(idx, area.color);
          return (
            <linearGradient key={`color${area.dataKey}`} id={`color${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          );
        })}
      </defs>
      {grid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ui-border, #e5e7eb)" />}
      <XAxis 
        dataKey={xKey} 
        axisLine={false} 
        tickLine={false} 
        tick={{ fontSize: 12, fill: "var(--ui-text-muted, #6b7280)" }}
        dy={10}
        tickFormatter={formatLabel}
      />
      <YAxis 
        axisLine={false} 
        tickLine={false} 
        tick={{ fontSize: 12, fill: "var(--ui-text-muted, #6b7280)" }}
        dx={-10}
        tickFormatter={formatValue}
      />
      {tooltip && (
        <Tooltip
          contentStyle={{ 
            borderRadius: "var(--ui-radius, 8px)", 
            border: "1px solid var(--ui-border, #e5e7eb)",
            boxShadow: "var(--ui-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1))",
            backgroundColor: "var(--ui-surface, #ffffff)",
            color: "var(--ui-text, #111827)",
          }}
          formatter={formatValue ? (value: any) => [formatValue(Number(value)), ""] : undefined}
          labelFormatter={formatLabel}
          isAnimationActive={!isStreaming}
        />
      )}
      {legend && <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />}
      
      {areas.map((area) => {
        const idx = colorIndex++;
        return (
          <Area
            key={`area-${area.dataKey}`}
            type="monotone"
            dataKey={area.dataKey}
            name={area.name || area.dataKey}
            stroke={getChartColor(idx, area.color)}
            fill={`url(#color${area.dataKey})`}
            strokeWidth={strokeWidth}
            stackId={area.stackId}
            isAnimationActive={isAnimated}
            animationDuration={realtime?.smooth ? 300 : 0}
          />
        );
      })}
      
      {bars.map((bar) => {
        const idx = colorIndex++;
        return (
          <Bar
            key={`bar-${bar.dataKey}`}
            dataKey={bar.dataKey}
            name={bar.name || bar.dataKey}
            fill={getChartColor(idx, bar.color)}
            radius={[radius, radius, 0, 0]}
            stackId={bar.stackId}
            isAnimationActive={isAnimated}
            animationDuration={realtime?.smooth ? 300 : 0}
          />
        );
      })}
      
      {lines.map((line) => {
        const idx = colorIndex++;
        return (
          <Line
            key={`line-${line.dataKey}`}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name || line.dataKey}
            stroke={getChartColor(idx, line.color)}
            strokeWidth={strokeWidth}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
            isAnimationActive={isAnimated}
            animationDuration={realtime?.smooth ? 300 : 0}
          />
        );
      })}
    </RechartsComposedChart>
  );

  const wrapperClass = clsx("w-full relative", className);

  if (responsive) {
    return (
      <div className={wrapperClass} style={{ height }}>
        {isStreaming && (
          <div className="absolute top-0 right-0 flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full z-10 border border-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LIVE
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          {content}
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {content}
    </div>
  );
}
