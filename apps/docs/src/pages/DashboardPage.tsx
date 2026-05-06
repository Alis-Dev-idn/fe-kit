import React from "react";
import { 
  Dashboard, 
  useDashboard
} from "@alisdev/fe-kit-dashboard";
import { KitBadge } from "../components/shared/KitBadge";
import { InstallBlock } from "../components/shared/InstallBlock";
import { DemoArea } from "../components/shared/DemoArea";
import { ApiTable } from "../components/shared/ApiTable";
import { Callout } from "../components/shared/Callout";
import { Card, Button, Badge, Stack } from "@alisdev/fe-kit-ui";

const MiniDashboardDemo = () => {
  return (
    <div className="border border-border rounded-xl overflow-hidden h-[500px] flex bg-bg shadow-2xl relative">
      {/* Sidebar Simulation */}
      <div className="w-64 border-r border-border bg-surface flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">A</div>
          <span className="font-bold">Alis Admin</span>
        </div>
        <div className="p-4 flex-1">
          <div className="mb-4">
             <h5 className="text-[10px] font-bold text-text-3 uppercase mb-2">General</h5>
             <div className="space-y-1">
                <div className="px-3 py-2 rounded bg-primary/10 text-primary text-sm font-medium">Overview</div>
                <div className="px-3 py-2 rounded text-text-2 text-sm">Analytics</div>
                <div className="px-3 py-2 rounded text-text-2 text-sm flex justify-between items-center">
                  <span>Customers</span>
                  <Badge variant="outline">12</Badge>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Content Simulation */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6">
          <h4 className="font-bold text-sm">Overview</h4>
          <div className="flex items-center gap-4">
            <div className="relative">
                <div className="w-4 h-4 bg-primary text-[10px] text-white flex items-center justify-center rounded-full absolute -top-1 -right-1">3</div>
                <svg className="w-5 h-5 text-text-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             </div>
            <div className="w-8 h-8 rounded-full bg-border" />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto bg-bg/50">
          <div className="grid grid-cols-2 gap-4 mb-6">
             <Card><div className="p-4"><p className="text-xs text-text-3 mb-1">Total Sales</p><h3 className="text-xl">$12,840</h3></div></Card>
             <Card><div className="p-4"><p className="text-xs text-text-3 mb-1">Active Users</p><h3 className="text-xl">1,240</h3></div></Card>
          </div>
          <Card className="h-40 flex items-center justify-center text-text-3 text-sm italic">
             Main content area...
          </Card>
        </main>
      </div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  return (
    <div className="pb-20">
      <section className="mb-16">
        <KitBadge category="UI & Overlay" />
        <h1 className="text-4xl font-bold mb-4">Dashboard Kit</h1>
        <p className="text-text-2 text-lg leading-relaxed mb-6 max-w-3xl">
          A premium, modular dashboard layout system. 
          Provides responsive sidebar, navbar, and content containers with built-in state management.
        </p>
        <InstallBlock packageName="@alisdev/fe-kit-dashboard" />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Visual Overview</h2>
        <DemoArea>
          <MiniDashboardDemo />
        </DemoArea>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">API Reference</h2>
        <ApiTable 
          rows={[
            { name: "Dashboard", type: "Provider", description: "Root container and context provider for the dashboard state." },
            { name: "Dashboard.Sidebar", type: "Component", description: "Responsive side navigation with logo and item support." },
            { name: "Dashboard.Navbar", type: "Component", description: "Top header area with title and action slots." },
            { name: "Dashboard.Content", type: "Component", description: "Main scrollable container for page content." },
          ]}
        />
      </section>
    </div>
  );
};
