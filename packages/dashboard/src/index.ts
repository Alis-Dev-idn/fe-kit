import { Dashboard as DashboardBase, DashboardNavbar, DashboardSidebar, DashboardContent } from "./components/Dashboard";
import { useDashboard } from "./hooks/useDashboard";
import { DashboardKit } from "./core/DashboardKit";

export const Dashboard = DashboardBase as any;
Dashboard.Navbar = DashboardNavbar;
Dashboard.Sidebar = DashboardSidebar;
Dashboard.Content = DashboardContent;

export { useDashboard, DashboardKit };
export * from "./types";
