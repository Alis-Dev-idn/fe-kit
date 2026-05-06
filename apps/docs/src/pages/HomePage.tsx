import React from "react";
import { Link } from "react-router-dom";
import { CodeBlock } from "../components/shared/CodeBlock";

const FEATURES = [
  { 
    title: "TypeScript First", 
    desc: "Strictly typed from the ground up for the best developer experience.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  },
  { 
    title: "Modular Design", 
    desc: "Install only what you need. Each kit is a standalone, lightweight package.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  { 
    title: "Enterprise Ready", 
    desc: "Built for complex applications with performance and stability in mind.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
];

const KITS = [
  { name: "Table", desc: "Hybrid client/server table with Excel export & fixed columns", path: "/table" },
  { name: "Notify", desc: "Elegant stacked notifications with progress indicators", path: "/notify" },
  { name: "Chart", desc: "Responsive, streaming-ready data visualizations", path: "/chart" },
  { name: "Map", desc: "MapLibre GL wrapper with clustering & realtime support", path: "/map" },
  { name: "Route", desc: "Config-driven routing with auth & role guards", path: "/route" },
  { name: "Modal", desc: "Imperative modal stack for complex user flows", path: "/modal" },
];

export const HomePage: React.FC = () => {
  return (
    <div className="pb-32 space-y-32">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] -z-10 rounded-full" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-3">Version 2.4.1 Released</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
          Modern Toolkit for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#8b5cf6]">
            Frontend Excellence
          </span>
        </h1>
        
        <p className="text-xl text-text-2 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          A modular ecosystem of React components and utilities designed to handle 
          the complexity of enterprise frontend development.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/getting-started" className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95">
            Get Started Free
          </Link>
          <Link to="/ui" className="w-full sm:w-auto bg-surface hover:bg-surface-up border border-border px-8 py-4 rounded-xl font-bold text-lg transition-all">
            Explore Components
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURES.map((f, i) => (
          <div key={i} className="p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
            <p className="text-text-2 leading-relaxed text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Popular Kits Grid */}
      <section>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Core Modules</h2>
          <p className="text-text-2">Everything you need to build a professional dashboard or application.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {KITS.map((kit, i) => (
            <Link 
              key={i} 
              to={kit.path}
              className="group p-8 rounded-2xl bg-surface border border-border hover:bg-surface-up transition-all hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-full bg-bg border border-border flex items-center justify-center text-sm font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                  {kit.name[0]}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
              <h4 className="text-lg font-bold mb-2">{kit.name} Kit</h4>
              <p className="text-text-2 text-sm leading-relaxed">{kit.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <section className="bg-surface rounded-3xl border border-border p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <svg className="w-64 h-64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to start building?</h2>
          <p className="text-text-2 mb-10">Install the full toolkit or individual packages. It's up to you.</p>
          
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold text-text-3 uppercase tracking-widest block mb-3">Install All Packages</span>
              <CodeBlock language="bash" code="pnpm add @alisdev/fe-kit" />
            </div>
            <div className="flex gap-4 pt-4">
              <Link to="/getting-started" className="text-primary font-bold hover:underline flex items-center gap-2">
                Read installation guide <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
