import React, { useState, useEffect, useMemo } from "react";
import { SidebarState } from "../types";
import { DashboardContext, DashboardContextValue } from "../hooks/useDashboard";
import { DashboardKit } from "../core/DashboardKit";
import "./dashboard.css";

export const Dashboard: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  const [sidebarState, setSidebarState] = useState<SidebarState>("full");
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const config = DashboardKit.getConfig();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const contextValue: DashboardContextValue = useMemo(() => ({
    sidebarState,
    setSidebarState,
    isMobile,
    isDrawerOpen,
    openDrawer: () => setIsDrawerOpen(true),
    closeDrawer: () => setIsDrawerOpen(false),
  }), [sidebarState, isMobile, isDrawerOpen]);

  return (
    <DashboardContext.Provider value={contextValue}>
      <div 
        className={`dashboard-root ${className}`} 
        data-dashboard-theme={config.theme}
      >
        {children}
      </div>
    </DashboardContext.Provider>
  );
};

export const DashboardNavbar: React.FC<{ children?: React.ReactNode; title?: string; className?: string }> = ({
  children,
  title,
  className = ""
}) => {
  return (
    <header className={`dashboard-navbar ${className}`}>
      {title && <h1 className="navbar-title">{title}</h1>}
      {children}
    </header>
  );
};

export const DashboardSidebar: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = ""
}) => {
  const { sidebarState, isMobile } = useContext(DashboardContext)!;
  if (isMobile) return null;

  const width = sidebarState === "full" ? "240px" : sidebarState === "collapsed" ? "64px" : "0px";

  return (
    <aside className={`dashboard-sidebar ${className}`} style={{ width }}>
      {children}
    </aside>
  );
};

export const DashboardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ""
}) => {
  return (
    <main className={`dashboard-content ${className}`}>
      {children}
    </main>
  );
};
