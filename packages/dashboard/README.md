# @alisdev/fe-kit-dashboard

A premium, modular dashboard layout system for React. Provides highly customizable sidebar, navbar, and content components with built-in mobile responsiveness, fluid transitions, and a built-in state context.

## Features

- 📱 **Mobile Ready**: Automatically detects small screens. The sidebar transforms into a swipeable mobile drawer.
- ↔️ **Collapsible Sidebar**: Supports three states: `full` (expanded), `collapsed` (icons only), and `hidden`.
- 🧩 **Modular Architecture**: Clean sub-components for `<Dashboard.Navbar>`, `<Dashboard.Sidebar>`, and `<Dashboard.Content>` so you retain full control over your layout rendering.
- 🪝 **Context State Engine**: The `useDashboard` hook allows you to control layout states (like opening the sidebar on mobile) from any deeply nested child component.
- 🔔 **Notification UI**: Built-in styling for header notification icons with unread badges.

## Installation

```bash
pnpm add @alisdev/fe-kit-dashboard
```

## Basic Implementation

The `<Dashboard>` component acts as the Context Provider and root flex container. Inside it, you assemble the layout pieces.

```tsx
import { 
  Dashboard, 
  SidebarGroup, 
  SidebarItem, 
  Notification 
} from "@alisdev/fe-kit-dashboard";
import { HomeIcon, UsersIcon, SettingsIcon, BellIcon } from "lucide-react";

export function AdminLayout({ children }) {
  return (
    <Dashboard>
      
      {/* 1. Left Navigation */}
      <Dashboard.Sidebar 
        logo={<img src="/logo.svg" alt="Logo" />}
        title="Admin Panel"
      >
        <SidebarGroup label="General">
          <SidebarItem icon={<HomeIcon />} label="Overview" active={true} />
          <SidebarItem icon={<UsersIcon />} label="Users" badge="4 New" />
        </SidebarGroup>
        
        <SidebarGroup label="System">
          <SidebarItem icon={<SettingsIcon />} label="Settings" />
        </SidebarGroup>
      </Dashboard.Sidebar>
      
      {/* 2. Main Content Area */}
      <Dashboard.Content>
        
        {/* Top Navbar */}
        <Dashboard.Navbar title="Dashboard Overview">
           {/* Custom Navbar Actions */}
           <div className="flex gap-4">
             <Notification icon={<BellIcon />} unreadCount={3} />
             <UserAvatarMenu />
           </div>
        </Dashboard.Navbar>
        
        {/* The Actual Page Route Content */}
        <main className="p-6">
          {children}
        </main>
        
      </Dashboard.Content>

    </Dashboard>
  );
}
```

## Advanced Control via `useDashboard`

Sometimes you need a button deep inside your page content to toggle the sidebar, or check if the user is currently on a mobile device.

```tsx
import { useDashboard } from "@alisdev/fe-kit-dashboard";
import { MenuIcon } from "lucide-react";

function CustomMobileHeader() {
  const { sidebarState, setSidebarState, isMobile } = useDashboard();
  
  if (!isMobile) return null;

  return (
    <header className="mobile-header">
      <button 
        onClick={() => setSidebarState("full")}
        aria-label="Open Menu"
      >
        <MenuIcon />
      </button>
      <h1>My App</h1>
    </header>
  );
}
```

## Component API Reference

### `<Dashboard>`
The root wrapper. Sets up the Context Provider and `100vh` flex layout.
- `className`: Optional custom classes.

### `<Dashboard.Sidebar>`
The navigation drawer.
- `logo`: `ReactNode` rendered at the top left.
- `title`: `string` displayed next to the logo.
- `className`: Wrapper styling.

### `SidebarGroup`
Groups navigation links under a small heading.
- `label`: `string`. The group title (e.g., "Settings").

### `SidebarItem`
An individual navigation link.
- `label`: `string`. The link text.
- `icon`: `ReactNode`. The SVG icon.
- `active`: `boolean`. Highlights the item as the current route.
- `badge`: `string | ReactNode`. Renders a small badge on the right side.
- `onClick`: `() => void`. Triggers when clicked (useful for routing).

### `<Dashboard.Navbar>`
The top horizontal bar over the content area.
- `title`: `string | ReactNode`. The page title.
- `children`: `ReactNode`. Renders on the far right (perfect for user profiles, search bars, or notifications).

### `Notification`
A specialized button for the Navbar.
- `icon`: `ReactNode` (e.g., `<BellIcon />`).
- `unreadCount`: `number`. If `> 0`, shows a red dot/badge.
- `onClick`: `() => void`. Action to trigger dropdown or panel.
