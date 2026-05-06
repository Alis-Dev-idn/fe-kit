import React from "react";
import { Link, useLocation } from "react-router-dom";

const KITS = [
  { category: "Introduction", kits: ["Getting-Started"] },
  { category: "Data & State", kits: ["Store", "Axios", "Form"] },
  { category: "UI & Overlay", kits: ["Notify", "Confirm", "Modal", "UI"] },
  { category: "Display", kits: ["Table", "Chart", "Dashboard", "Input"] },
  { category: "Navigation", kits: ["Route"] },
  { category: "Map", kits: ["Map"] },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [search, setSearch] = React.useState("");

  const filteredKits = KITS.map(group => ({
    ...group,
    kits: group.kits.filter(k => k.toLowerCase().includes(search.toLowerCase()))
  })).filter(group => group.kits.length > 0);

  return (
    <aside className="w-[240px] fixed h-screen bg-surface border-r border-border flex flex-col z-20 overflow-y-auto scrollbar-thin">
      <div className="p-6">
        <Link to="/" className="text-xl font-bold text-primary block">@alisdev/fe-kit</Link>
        <span className="text-xs text-text-3 font-mono mt-1 block">v2.4.1</span>
      </div>

      <div className="px-4 mb-6">
        <input
          type="text"
          placeholder="Search kits..."
          className="w-full bg-bg border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <nav className="flex-1 px-2 pb-10">
        {filteredKits.map((group) => (
          <div key={group.category} className="mb-6">
            <h3 className="px-4 text-[10px] font-bold text-text-3 uppercase tracking-widest mb-2">
              {group.category}
            </h3>
            <div className="space-y-0.5">
              {group.kits.map((kit) => {
                const path = `/${kit.toLowerCase()}`;
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={kit}
                    to={path}
                    className={`
                      block px-4 py-2 rounded text-sm transition-all duration-150
                      ${isActive 
                        ? "bg-surface-up text-white border-l-2 border-primary" 
                        : "text-text-2 hover:bg-surface-up hover:text-text"}
                    `}
                  >
                    {kit.replace(/-/g, " ")} {group.category !== "Introduction" && "Kit"}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border bg-surface sticky bottom-0">
        <a 
          href="https://github.com/Alis-Dev-idn/fe-kit" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 text-xs text-text-2 hover:text-primary transition-colors"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          View on GitHub
        </a>
      </div>
    </aside>
  );
};
