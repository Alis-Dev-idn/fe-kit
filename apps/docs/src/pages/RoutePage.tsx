import React from "react";
import { RouteKit } from "@alisdev/fe-kit-route";
import { KitBadge } from "../components/shared/KitBadge";
import { InstallBlock } from "../components/shared/InstallBlock";
import { DemoArea } from "../components/shared/DemoArea";
import { ApiTable } from "../components/shared/ApiTable";
import { TabbedCode } from "../components/shared/TabbedCode";
import { Callout } from "../components/shared/Callout";
import { Link } from "react-router-dom";

export const RoutePage: React.FC = () => {
  return (
    <div className="pb-20">
      <section className="mb-16">
        <KitBadge category="Navigation" />
        <h1 className="text-4xl font-bold mb-4">Route Kit</h1>
        <p className="text-text-2 text-lg leading-relaxed mb-6 max-w-3xl">
          Enterprise routing layer built on top of React Router v6. 
          Simplifies authentication guards, role-based access, and breadcrumb generation.
        </p>
        <InstallBlock packageName="@alisdev/fe-kit-route" />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Automatic Breadcrumbs</h2>
        <DemoArea>
          <div className="bg-surface border border-border p-8 rounded-xl text-center">
            <h4 className="text-xs font-bold text-text-3 uppercase mb-6 tracking-widest">Active Breadcrumb Trail</h4>
            <nav className="flex items-center justify-center gap-2 text-lg font-medium">
              <span className="text-primary">Home</span>
              <span className="text-text-3 text-sm">/</span>
              <span className="text-text-2">Navigation</span>
              <span className="text-text-3 text-sm">/</span>
              <span className="text-text-2">Route Kit</span>
            </nav>
            <p className="mt-6 text-sm text-text-3 max-w-md mx-auto leading-relaxed">
              The trail above is generated dynamically based on your current URL and the 
              <code>breadcrumb</code> property in your route configuration.
            </p>
          </div>
        </DemoArea>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Route Configuration</h2>
        <TabbedCode 
          tabs={[
            {
              label: "Basic Config",
              language: "tsx",
              code: `const routes = [\n  { \n    path: "/admin", \n    component: AdminLayout, \n    auth: true, \n    roles: ["admin"],\n    breadcrumb: "Admin Area"\n  }\n];`
            },
            {
              label: "Lazy Loading",
              language: "tsx",
              code: `// Functions returning import() are auto-lazyloaded\n{\n  path: "/reports",\n  component: () => import("./pages/Reports"),\n  breadcrumb: "Reports"\n}`
            }
          ]}
        />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">API Reference</h2>
        <ApiTable 
          rows={[
            { name: "createRoutes(config)", type: "Function", description: "Converts RouteConfig array into <Route> elements." },
            { name: "useBreadcrumb()", type: "Hook", description: "Returns the current active trail: { label, path }." },
            { name: "AuthRoute", type: "Component", description: "JSX wrapper for guarding routes by authentication." },
            { name: "RoleRoute", type: "Component", description: "JSX wrapper for guarding routes by user roles." },
            { name: "RouteKit.setup(config)", type: "Function", description: "Initializes auth and role check logic." },
          ]}
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Route Guards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Callout type="info" title="Auth Guard">
            Set <code>auth: true</code> in your config to automatically redirect unauthenticated 
            users to the login page.
          </Callout>
          <Callout type="info" title="Role Guard">
            Pass an array of roles (e.g. <code>roles: ["admin"]</code>) to restrict access to specific users.
          </Callout>
        </div>
      </section>
    </div>
  );
};
