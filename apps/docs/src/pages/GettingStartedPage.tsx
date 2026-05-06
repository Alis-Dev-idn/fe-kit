import React from "react";
import { Link } from "react-router-dom";
import { InstallBlock } from "../components/shared/InstallBlock";
import { TabbedCode } from "../components/shared/TabbedCode";
import { Callout } from "../components/shared/Callout";
import { Badge, Divider } from "@alisdev/fe-kit-ui";

export const GettingStartedPage: React.FC = () => {
  return (
    <div className="pb-32 max-w-4xl">
      <section className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Documentation</span>
        </div>
        <h1 className="text-5xl font-black mb-6 tracking-tight">Getting Started</h1>
        <p className="text-xl text-text-2 leading-relaxed">
          Welcome to the AlisDev Frontend Toolkit. This guide will help you set up 
          your environment and start building premium React applications.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-4">
          <span className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-sm">1</span>
          Installation
        </h2>
        <p className="text-text-2 mb-6">
          The toolkit is distributed as a set of modular packages. You can install the entire 
          ecosystem at once or pick specific modules to keep your bundle size small.
        </p>

        <div className="space-y-12">
          <div>
            <h3 className="text-sm font-bold text-text-3 uppercase tracking-widest mb-4">Option A: The Full Toolkit</h3>
            <InstallBlock packageName="@alisdev/fe-kit" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-text-3 uppercase tracking-widest mb-4">Option B: Modular Packages</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { name: "ui", desc: "Core UI Primitives" },
                 { name: "notify", desc: "Notification System" },
                 { name: "axios", desc: "API Client Wrapper" },
                 { name: "table", desc: "Data Grid System" },
               ].map(pkg => (
                 <div key={pkg.name} className="p-4 rounded-xl border border-border bg-surface hover:border-primary/30 transition-colors">
                    <code className="text-primary text-xs font-bold">@alisdev/fe-kit-{pkg.name}</code>
                    <p className="text-xs text-text-3 mt-1">{pkg.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      <Divider className="my-16" />

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-4">
          <span className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-sm">2</span>
          Configuration
        </h2>
        <p className="text-text-2 mb-8">
          Most kits work out of the box, but some require global providers at the root of your app. 
          For example, the <strong>Modal Kit</strong> and <strong>Notify Kit</strong> need stack containers.
        </p>

        <TabbedCode 
          tabs={[
            {
              label: "App Wrapper",
              language: "tsx",
              code: `import { ModalStack } from "@alisdev/fe-kit-modal";\nimport { NotifyContainer } from "@alisdev/fe-kit-notify";\n\nfunction App() {\n  return (\n    <div className="my-app">\n      {/* Global containers */}\n      <ModalStack />\n      <NotifyContainer />\n\n      {/* Your content */}\n      <Router />\n    </div>\n  );\n}`
            }
          ]}
        />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-4">
          <span className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-sm">3</span>
          Prerequisites
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h4 className="font-bold mb-2">React 18+</h4>
            <p className="text-sm text-text-2">Uses modern features like useSyncExternalStore and Suspense.</p>
          </Card>
          <Card className="p-6">
            <h4 className="font-bold mb-2">TypeScript 5+</h4>
            <p className="text-sm text-text-2">Leverages advanced type inference for API signatures.</p>
          </Card>
        </div>
      </section>

      <section className="p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to build?</h3>
        <p className="text-text-2 mb-8">Dive into specific kit documentation to see examples and API details.</p>
        <Link to="/ui" className="inline-flex bg-primary text-white px-8 py-3 rounded-xl font-bold">
          Browse UI Components
        </Link>
      </section>
    </div>
  );
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-surface border border-border rounded-2xl ${className}`}>
    {children}
  </div>
);
