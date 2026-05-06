import React from "react";
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  AreaChart,
  ComposedChart
} from "@alisdev/fe-kit-chart";
import { KitBadge } from "../components/shared/KitBadge";
import { InstallBlock } from "../components/shared/InstallBlock";
import { DemoArea } from "../components/shared/DemoArea";
import { ApiTable } from "../components/shared/ApiTable";
import { TabbedCode } from "../components/shared/TabbedCode";
import { Callout } from "../components/shared/Callout";
import { Card, CardHeader, CardContent, Stack, Badge } from "@alisdev/fe-kit-ui";

const mockMonthlyData = [
  { month: "Jan", revenue: 4500, profit: 1200, users: 400, target: 5000 },
  { month: "Feb", revenue: 5200, profit: 1500, users: 450, target: 5000 },
  { month: "Mar", revenue: 4800, profit: 1100, users: 500, target: 5000 },
  { month: "Apr", revenue: 6100, profit: 1900, users: 550, target: 6000 },
  { month: "May", revenue: 5900, profit: 1700, users: 600, target: 6000 },
  { month: "Jun", revenue: 7200, profit: 2400, users: 700, target: 6500 },
];

const mockPieData = [
  { name: "Desktop", value: 400, color: "#6e56cf" },
  { name: "Mobile", value: 300, color: "#22c55e" },
  { name: "Tablet", value: 200, color: "#f59e0b" },
  { name: "Unknown", value: 100, color: "#ef4444" },
];

export const ChartPage: React.FC = () => {
  return (
    <div className="pb-20">
      <section className="mb-16">
        <KitBadge category="Display" />
        <h1 className="text-4xl font-bold mb-4">Chart Kit</h1>
        <p className="text-text-2 text-lg leading-relaxed mb-6 max-w-3xl">
          High-performance, responsive charting library built on Recharts. 
          Features beautiful defaults and real-time streaming support.
        </p>
        <InstallBlock packageName="@alisdev/fe-kit-chart" />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Line & Area Charts</h2>
        <DemoArea>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader title="Revenue Overview" subtitle="Monthly revenue vs target" />
              <CardContent className="h-[300px]">
                <LineChart
                  data={mockMonthlyData}
                  xKey="month"
                  lines={[
                    { dataKey: "revenue", name: "Revenue", color: "var(--primary)" },
                    { dataKey: "target", name: "Target", color: "var(--text-3)" }
                  ]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="User Growth" subtitle="Cumulative user base" />
              <CardContent className="h-[300px]">
                <AreaChart
                  data={mockMonthlyData}
                  xKey="month"
                  areas={[
                    { dataKey: "users", name: "Total Users", color: "var(--success)" }
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </DemoArea>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Bar & Distribution</h2>
        <DemoArea>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader title="Profit Breakdown" subtitle="Stackable profitability data" />
              <CardContent className="h-[300px]">
                <BarChart
                  data={mockMonthlyData}
                  xKey="month"
                  bars={[
                    { dataKey: "profit", name: "Net Profit", color: "var(--primary)" }
                  ]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Device Distribution" subtitle="Traffic by platform" />
              <CardContent className="h-[300px]">
                <PieChart
                  data={mockPieData}
                  nameKey="name"
                  valueKey="value"
                  innerRadius={60}
                  outerRadius={80}
                />
              </CardContent>
            </Card>
          </div>
        </DemoArea>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">API Reference</h2>
        <ApiTable 
          rows={[
            { name: "data", type: "T[]", description: "Array of data objects to visualize." },
            { name: "xKey", type: "keyof T", description: "The key used for the X-axis (labels)." },
            { name: "lines / bars / areas", type: "Config[]", description: "Configuration for series: { dataKey, name, color, ... }." },
            { name: "realtime", type: "Object", description: "Enables polling or streaming mode for live updates." },
            { name: "formatValue", type: "Function", description: "Formatter for Y-axis and Tooltip values." },
          ]}
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Streaming Support</h2>
        <Callout type="info" title="Live Data Updates">
          Chart Kit supports smooth animations for real-time data. Just pass the <code>realtime</code> prop 
          with a <code>polling</code> interval or a <code>stream</code> subscriber to handle sliding window updates.
        </Callout>
      </section>
    </div>
  );
};
