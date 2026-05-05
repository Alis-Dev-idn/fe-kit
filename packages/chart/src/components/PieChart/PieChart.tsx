import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartKit } from "../../core/ChartKit";
import { getChartColor } from "../../utils/colors";
import { useRealtimeData } from "../../hooks/useRealtimeData";
import { RealtimeOptions } from "../../types";
import clsx from "clsx";

export interface PieChartProps<T> {
  data: T[];
  nameKey: string;
  valueKey: string;
  
  height?: number;
  responsive?: boolean;
  
  innerRadius?: number | string;
  outerRadius?: number | string;
  showLabel?: boolean;
  
  tooltip?: boolean;
  legend?: boolean;
  className?: string;

  realtime?: RealtimeOptions<T>;
  formatValue?: (value: number) => string;
  formatLabel?: (label: string) => string;
}

export function PieChart<T = any>({
  data: initialData,
  nameKey,
  valueKey,
  height = 300,
  responsive = true,
  innerRadius = 0,
  outerRadius = "80%",
  showLabel = false,
  tooltip = ChartKit.getConfig().tooltip,
  legend = ChartKit.getConfig().legend,
  className,
  realtime,
  formatValue,
  formatLabel,
}: PieChartProps<T>) {
  const { data, isStreaming } = useRealtimeData(initialData, realtime);
  const isAnimated = realtime?.smooth !== false;

  const content = (
    <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
      <Pie
        data={data}
        dataKey={valueKey}
        nameKey={nameKey}
        cx="50%"
        cy="50%"
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        label={showLabel ? (entry) => formatLabel ? formatLabel(entry[nameKey]) : entry[nameKey] : false}
        isAnimationActive={isAnimated}
        animationDuration={realtime?.smooth ? 300 : 0}
        stroke="var(--ui-surface, #ffffff)"
        strokeWidth={2}
      >
        {data.map((entry: any, index) => (
          <Cell key={`cell-${index}`} fill={getChartColor(index, entry.color)} />
        ))}
      </Pie>
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
          isAnimationActive={!isStreaming}
        />
      )}
      {legend && <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />}
    </RechartsPieChart>
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
