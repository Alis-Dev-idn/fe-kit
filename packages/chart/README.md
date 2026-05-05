# @alisdev/fe-kit-chart

Modern, responsive, and customizable chart system built on top of Recharts. Part of the `@alisdev/fe-kit` monorepo.

## Features

- 📊 **Beautiful Defaults**: Clean, modern look out of the box with sensible color palettes.
- 📱 **Responsive**: Automatically adapts to container width and optimizes for mobile.
- ⚡ **Real-time Streaming**: Built-in support for sliding windows, polling, and WebSocket streams.
- 🎨 **Customizable**: Override colors, tooltips, grid, and animations easily.
- 🧩 **UI Kit Integration**: Works seamlessly with `@alisdev/fe-kit-ui` cards and containers.

---

## Installation

```bash
pnpm add @alisdev/fe-kit-chart recharts
```

---

## Getting Started

Initialize the `ChartKit` at the root of your application to override global defaults (optional):

```tsx
import { ChartKit } from "@alisdev/fe-kit-chart";

ChartKit.setup({
  colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
  radius: 8,
});
```

---

## Components

### LineChart
Multi-line chart with smooth curves.

```tsx
<LineChart
  data={data}
  xKey="month"
  lines={[
    { dataKey: "revenue", name: "Revenue" },
    { dataKey: "target", color: "#f59e0b" }
  ]}
  formatValue={(v) => `$${v}`}
/>
```

### BarChart
Rounded bar charts with stacking support.

```tsx
<BarChart
  data={data}
  xKey="month"
  bars={[
    { dataKey: "sales", stackId: "a" },
    { dataKey: "profit", stackId: "a" }
  ]}
/>
```

### AreaChart
Area charts with beautiful gradient fills.

```tsx
<AreaChart
  data={data}
  xKey="month"
  areas={[
    { dataKey: "users" }
  ]}
/>
```

### PieChart
Donut or standard pie charts with animated interactions.

```tsx
<PieChart
  data={data}
  nameKey="name"
  valueKey="value"
  innerRadius={50}
/>
```

### ComposedChart
Mix lines, bars, and areas in a single chart.

```tsx
<ComposedChart
  data={data}
  xKey="month"
  areas={[{ dataKey: "revenue" }]}
  bars={[{ dataKey: "profit" }]}
  lines={[{ dataKey: "target" }]}
/>
```

---

## Real-time & Streaming

All charts support the `realtime` prop for live data updates with smooth animations and sliding window buffers.

### Polling Mode

```tsx
<LineChart
  data={initialData}
  xKey="time"
  lines={[{ dataKey: "cpu" }]}
  realtime={{
    enabled: true,
    polling: {
      interval: 2000,
      fetcher: () => fetch("/api/metrics").then(res => res.json())
    },
    maxPoints: 50,
    smooth: true
  }}
/>
```

### Streaming Mode (e.g. WebSocket)

```tsx
<AreaChart
  data={[]}
  xKey="time"
  areas={[{ dataKey: "value" }]}
  realtime={{
    enabled: true,
    stream: {
      subscribe: (push) => {
        const ws = new WebSocket("wss://example.com/stream");
        ws.onmessage = (e) => push(JSON.parse(e.data));
        return () => ws.close();
      }
    },
    maxPoints: 100
  }}
/>
```

---

## Utilities

- `formatCurrency(value, currency, locale)`
- `formatPercentage(value, decimals, locale)`
- `formatCompactNumber(value, locale)`
