import { createContext, useContext } from "react";
import { SidebarState } from "../types";

export interface DashboardContextValue {
  sidebarState: SidebarState;
  setSidebarState: (state: SidebarState) => void;
  isMobile: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard(): DashboardContextValue {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a Dashboard component");
  }
  return context;
}
