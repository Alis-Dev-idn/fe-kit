import React from "react";
import {
  AreaChart as RechartsAreaChart,
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

export interface AreaChartProps<T> extends BaseChartProps<T> {
  areas: {
    dataKey: string;
    name?: string;
    color?: string;
    stackId?: string;
  }[];
}

export function AreaChart<T = any>({
  data: initialData,
  xKey,
  areas,
  height = 300,
  responsive = true,
  grid = ChartKit.getConfig().grid,
  tooltip = ChartKit.getConfig().tooltip,
  legend = ChartKit.getConfig().legend,
  className,
  realtime,
  formatValue,
  formatLabel,
}: AreaChartProps<T>) {
  const { data, isStreaming } = useRealtimeData(initialData, realtime);
  const strokeWidth = ChartKit.getConfig().strokeWidth || 2;
  const isAnimated = realtime?.smooth !== false && data.length <= 200;

  const content = (
    <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
      {areas.map((area, idx) => (
        <Area
          key={area.dataKey}
          type="monotone"
          dataKey={area.dataKey}
          name={area.name || area.dataKey}
          stroke={getChartColor(idx, area.color)}
          fillOpacity={1}
          fill={`url(#color${area.dataKey})`}
          strokeWidth={strokeWidth}
          stackId={area.stackId}
          isAnimationActive={isAnimated}
          animationDuration={realtime?.smooth ? 300 : 0}
        />
      ))}
    </RechartsAreaChart>
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
