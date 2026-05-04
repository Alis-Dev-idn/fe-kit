# Prompt: `dashboard-kit` — Dashboard Layout Library (React + TypeScript)

## Overview

Build the `dashboard` package inside `@alisdev/fe-kit` monorepo. Provides a compound component-based dashboard layout with responsive sidebar, navbar, content area, mobile bottom nav with swipe gesture, theming support, and Tailwind CSS compatibility.

---

## Package Structure

```
packages/dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx              # Root layout component
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx            # Desktop sidebar
│   │   │   ├── SidebarItem.tsx        # Single nav item
│   │   │   ├── SidebarGroup.tsx       # Collapsible group
│   │   │   └── SidebarDrawer.tsx      # Mobile drawer (swipe up)
│   │   ├── Navbar/
│   │   │   ├── Navbar.tsx             # Top navbar
│   │   │   ├── NavbarProfile.tsx      # Avatar + dropdown
│   │   │   ├── ProfileMenuItem.tsx    # Dropdown menu item
│   │   │   ├── NotificationBell.tsx   # Built-in notification
│   │   │   └── NotificationItem.tsx   # Single notification item
│   │   ├── Content/
│   │   │   └── Content.tsx            # Scrollable content area
│   │   └── BottomNav/
│   │       ├── BottomNav.tsx          # Mobile bottom navigation
│   │       └── BottomNavItem.tsx      # Single bottom nav item
│   ├── hooks/
│   │   └── useDashboard.ts            # Dashboard state hook
│   ├── core/
│   │   └── DashboardKit.ts            # Setup & theme config
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

---

## Dependencies

```json
{
  "peerDependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x"
  },
  "peerDependenciesMeta": {
    "react-router-dom": { "optional": true }
  }
}
```

---

## 1. Types

```typescript
type SidebarState = "full" | "collapsed" | "hidden"
type ThemeType = "light" | "dark" | "auto"

interface SidebarItemConfig {
  label: string
  icon?: React.ReactNode
  path?: string
  onClick?: () => void
  roles?: string[]                    // hide if user doesn't have role
  badge?: string | number             // notification badge
  children?: SidebarItemConfig[]      // nested submenu
}

interface ProfileMenuItemConfig {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  divider?: boolean                   // render divider before this item
}

interface NotificationConfig {
  id: string
  title: string
  description?: string
  time: string
  read: boolean
  onClick?: () => void
}

interface UserConfig {
  name: string
  avatar?: string                     // URL, fallback to initials if not provided
  role?: string                       // subtitle below name
}
```

---

## 2. `DashboardKit` — Setup

```typescript
interface DashboardKitConfig {
  theme?: ThemeType                   // default: "light"
}

class DashboardKit {
  static setup(config: DashboardKitConfig): void
}
```

---

## 3. `useDashboard` Hook

```typescript
interface UseDashboardResult {
  sidebarState: SidebarState
  setSidebarState: (state: SidebarState) => void
  isMobile: boolean                   // true if viewport ≤ 768px
  isDrawerOpen: boolean               // mobile drawer state
  openDrawer: () => void
  closeDrawer: () => void
}

function useDashboard(): UseDashboardResult
```

---

## 4. `Dashboard` — Root Component

```typescript
interface DashboardProps {
  children: React.ReactNode
  className?: string
}

const Dashboard: React.FC<DashboardProps> & {
  Sidebar: typeof Sidebar
  Navbar: typeof Navbar
  Content: typeof Content
}
```

**Layout behavior:**
```
Desktop (> 768px):
┌─────────────────────────────────────┐
│           Navbar                    │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │   Content                │
│          │   (only this scrolls)    │
│          │                          │
└──────────┴──────────────────────────┘

Mobile (≤ 768px):
┌─────────────────────────┐
│  Navbar (title only)    │
├─────────────────────────┤
│                         │
│  Content                │
│  (only this scrolls)    │
│                         │
├─────────────────────────┤
│  Bottom Nav             │
│  🏠  📊  ⚙️  👤         │
└─────────────────────────┘
```

**Requirements:**
- Only `Content` area scrolls — sidebar and navbar are fixed
- `Dashboard` provides `DashboardContext` consumed by all sub-components
- Body scroll locked when mobile drawer is open

---

## 5. `Dashboard.Sidebar`

```typescript
interface SidebarProps {
  // Config-based (Opsi A)
  items?: SidebarItemConfig[]

  // Children-based (Opsi B)
  children?: React.ReactNode

  className?: string
  collapsedWidth?: string             // default: "64px"
  fullWidth?: string                  // default: "240px"
}
```

**Desktop sidebar states:**

```
State: "full" (default)
┌───────────────┐
│ 📊 Dashboard  │
│ 👤 Users      │
│ ⚙️ Settings   │
│   └ Profile   │  ← nested submenu
│   └ Security  │
└───────────────┘

State: "collapsed" (icon only)
┌────┐
│ 📊 │  ← tooltip on hover shows label
│ 👤 │
│ ⚙️ │
└────┘

State: "hidden"
(sidebar completely gone, content full width)
```

**Nested submenu:**
- Click group item → expand/collapse children
- Collapsed sidebar → submenu appears as popover on hover
- Active route → highlight active item and parent group

**Mobile sidebar → becomes drawer:**
```
Swipe up from bottom nav area → drawer slides up
Swipe down or tap backdrop    → drawer closes

┌─────────────────────────┐
│ ────                    │  ← drag handle
├─────────────────────────┤
│ 🏠 Home                 │
│ 📊 Dashboard            │
│ 👤 Users                │
│ ⚙️ Settings             │
│   └ Profile             │
│   └ Security            │
└─────────────────────────┘
```

---

## 6. `SidebarItem` & `SidebarGroup` Sub-components

```typescript
interface SidebarItemProps {
  label: string
  icon?: React.ReactNode
  path?: string
  onClick?: () => void
  badge?: string | number
  className?: string
}

interface SidebarGroupProps {
  label: string
  icon?: React.ReactNode
  defaultOpen?: boolean               // default: false
  children: React.ReactNode
  className?: string
}
```

**Usage (children-based):**
```typescript
<Dashboard.Sidebar>
  <SidebarItem label="Home" icon={<HomeIcon />} path="/" />
  <SidebarItem label="Users" icon={<UsersIcon />} path="/users" badge={5} />
  <SidebarGroup label="Settings" icon={<SettingsIcon />}>
    <SidebarItem label="Profile" path="/settings/profile" />
    <SidebarItem label="Security" path="/settings/security" />
  </SidebarGroup>
</Dashboard.Sidebar>
```

---

## 7. `Dashboard.Navbar`

```typescript
interface NavbarProps {
  // Title
  title?: string
  logo?: React.ReactNode              // shown left of title
  showTitleOnMobile?: boolean         // default: true

  // Right side
  user?: UserConfig
  profileMenu?: ProfileMenuItemConfig[]
  profileMenuChildren?: React.ReactNode  // children-based override

  // Notifications
  notifications?: NotificationConfig[]
  onNotificationClick?: (notification: NotificationConfig) => void
  onMarkAllRead?: () => void
  notificationSlot?: React.ReactNode    // custom notification component

  className?: string
}
```

**Desktop navbar:**
```
┌──────────────────────────────────────────────────┐
│ [Logo] Title                    🔔  [DS] Dudi ▾  │
└──────────────────────────────────────────────────┘
```

**Mobile navbar:**
```
┌──────────────────────────────────────────────────┐
│ Title (optional)                                 │
└──────────────────────────────────────────────────┘
```

**Avatar behavior:**
- `user.avatar` provided → show image in circle
- No avatar → auto-generate initials from `user.name`
  - "Dudi Setiawan" → "DS" with auto background color
  - Color derived from name hash (consistent per name)

**Profile dropdown (click avatar):**
```
┌─────────────────┐
│ [DS] Dudi       │
│      Admin      │
├─────────────────┤
│ 👤 Profile      │
│ ⚙️ Settings     │
├─────────────────┤  ← divider
│ 🚪 Sign Out     │
└─────────────────┘
```

**Notification dropdown (click bell):**
```
┌────────────────────────┐
│ Notifications      Mark all read │
├────────────────────────┤
│ 🔵 New user registered │  ← unread
│    2 minutes ago       │
├────────────────────────┤
│ Order completed        │  ← read (dimmed)
│    1 hour ago          │
└────────────────────────┘
```

---

## 8. `Dashboard.Content`

```typescript
interface ContentProps {
  children: React.ReactNode
  className?: string
  padding?: string | number           // default: "1.5rem"
}
```

**Requirements:**
- Only this area scrolls (overflow-y: auto)
- Takes remaining viewport height after navbar
- Content centered with max-width if content is narrow

---

## 9. `BottomNav` — Mobile Only

Automatically renders on mobile (≤ 768px). Hidden on desktop.

```typescript
interface BottomNavProps {
  items?: SidebarItemConfig[]         // override from sidebar items
  // if not provided → auto-takes first 4-5 items from sidebar
  maxItems?: number                   // default: 5
  className?: string
}
```

**Swipe up to expand drawer:**
```
Rest state:
┌─────────────────────────┐
│  🏠   📊   ⚙️   👤      │  ← bottom nav (4-5 icons)
└─────────────────────────┘

Swipe up (from bottom nav) → drawer expands:
┌─────────────────────────┐
│ ────                    │  ← drag handle
├─────────────────────────┤
│ 🏠 Home                 │
│ 📊 Dashboard            │
│ 👤 Users                │
│ ⚙️ Settings             │
│   └ Profile             │  ← full sidebar items
└─────────────────────────┘

Swipe down → collapse back to bottom nav
```

**Swipe detection:**
- `touchstart` → record start Y position
- `touchmove` → track delta Y, move drawer accordingly
- `touchend` → if delta > 30% drawer height → expand, else collapse

---

## 10. Theming

**CSS variables (light theme default):**
```css
:root {
  --dashboard-sidebar-bg: #1e293b;
  --dashboard-sidebar-text: #94a3b8;
  --dashboard-sidebar-active-bg: #3b82f6;
  --dashboard-sidebar-active-text: #ffffff;
  --dashboard-navbar-bg: #ffffff;
  --dashboard-navbar-border: #e2e8f0;
  --dashboard-content-bg: #f8fafc;
  --dashboard-text-primary: #1e293b;
  --dashboard-text-secondary: #64748b;
}
```

**Dark theme:**
```css
[data-dashboard-theme="dark"] {
  --dashboard-sidebar-bg: #0f172a;
  --dashboard-navbar-bg: #1e293b;
  --dashboard-content-bg: #0f172a;
  --dashboard-text-primary: #f1f5f9;
}
```

**Tailwind compatibility:**
- All components accept `className` prop
- CSS variables can be overridden via Tailwind arbitrary values
- Example: `className="bg-[--dashboard-sidebar-bg]"`

---

## 11. Full Usage Example (README.md)

```typescript
import {
  DashboardKit, Dashboard, useDashboard,
  SidebarItem, SidebarGroup
} from "@alisdev/fe-kit"

// ── Setup ─────────────────────────────────────────────────────────

DashboardKit.setup({ theme: "light" })

// ── Config-based ──────────────────────────────────────────────────

const sidebarItems = [
  { label: "Home", icon: <HomeIcon />, path: "/" },
  { label: "Dashboard", icon: <ChartIcon />, path: "/dashboard" },
  {
    label: "Users", icon: <UsersIcon />, path: "/users",
    badge: 3, roles: ["admin"]
  },
  {
    label: "Settings", icon: <SettingsIcon />,
    children: [
      { label: "Profile", path: "/settings/profile" },
      { label: "Security", path: "/settings/security" },
    ]
  }
]

const profileMenu = [
  { label: "Profile", icon: <UserIcon />, onClick: () => navigate("/profile") },
  { label: "Settings", icon: <SettingsIcon />, onClick: () => navigate("/settings") },
  { label: "Sign Out", icon: <LogoutIcon />, onClick: handleLogout, divider: true }
]

const notifications = [
  { id: "1", title: "New user registered", time: "2m ago", read: false },
  { id: "2", title: "Order completed", time: "1h ago", read: true }
]

// ── Layout ────────────────────────────────────────────────────────

function AppLayout() {
  const { sidebarState, setSidebarState } = useDashboard()

  return (
    <Dashboard>
      <Dashboard.Navbar
        title="My App"
        logo={<Logo />}
        showTitleOnMobile={true}
        user={{ name: "Dudi Setiawan", avatar: "/avatar.jpg", role: "Admin" }}
        profileMenu={profileMenu}
        notifications={notifications}
        onNotificationClick={(n) => markAsRead(n.id)}
        onMarkAllRead={markAllRead}
        className="shadow-sm"
      />

      <Dashboard.Sidebar
        items={sidebarItems}
        className="border-r border-slate-700"
      />

      <Dashboard.Content className="p-6">
        <button onClick={() => setSidebarState("collapsed")}>
          Collapse Sidebar
        </button>
        <button onClick={() => setSidebarState("hidden")}>
          Hide Sidebar
        </button>
        <button onClick={() => setSidebarState("full")}>
          Show Sidebar
        </button>
        <Outlet />
      </Dashboard.Content>
    </Dashboard>
  )
}

// ── Children-based sidebar ────────────────────────────────────────

function AppLayoutChildren() {
  return (
    <Dashboard>
      <Dashboard.Navbar
        title="My App"
        user={{ name: "Dudi Setiawan" }}
      >
        {/* Custom notification slot */}
        <MyCustomNotificationBell />
      </Dashboard.Navbar>

      <Dashboard.Sidebar className="bg-slate-900">
        <SidebarItem label="Home" icon={<HomeIcon />} path="/" />
        <SidebarItem label="Dashboard" icon={<ChartIcon />} path="/dashboard" />
        <SidebarGroup label="Settings" icon={<SettingsIcon />} defaultOpen>
          <SidebarItem label="Profile" path="/settings/profile" />
          <SidebarItem label="Security" path="/settings/security" />
        </SidebarGroup>
      </Dashboard.Sidebar>

      <Dashboard.Content>
        <Outlet />
      </Dashboard.Content>
    </Dashboard>
  )
}
```

---

## Output Requirements

1. Implement all files in `src/` with full TypeScript types
2. Export `DashboardKit`, `Dashboard`, `useDashboard`, `SidebarItem`, `SidebarGroup` from `src/index.ts`
3. `Dashboard` provides `DashboardContext` — all sub-components consume it
4. Sidebar transition uses CSS transition for smooth collapse/expand
5. Mobile detection via `window.matchMedia("(max-width: 768px)")` with resize listener
6. Avatar initials color derived from name hash — consistent per name
7. All components accept `className` for Tailwind override
8. CSS variables defined on `:root` and `[data-dashboard-theme]`
9. Add inline JSDoc on all public APIs
10. Handle edge cases:
    - `useDashboard()` called outside `Dashboard` → throw descriptive error
    - `Sidebar items` with `roles` → hide item if user role not matched (silent, no error)
    - `notifications` empty → hide notification bell badge
    - `user.avatar` broken URL → fallback to initials automatically
    - Mobile swipe up threshold < 30% → snap back to bottom nav
    - `setSidebarState` on mobile → ignored (mobile uses drawer, not sidebar states)
    - Both `items` and `children` provided → render `children`, ignore `items`, log warning
    - `SidebarGroup` in collapsed sidebar → show popover on hover with children
    - Nested `SidebarGroup` → support max 2 levels deep
