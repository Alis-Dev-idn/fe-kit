# Prompt: `route-fe-kit` — Routing Library (React + TypeScript + React Router DOM)

## Overview

Build the `route` package inside `@alisdev/fe-kit` monorepo. Provides a config-based and JSX-based routing layer on top of React Router DOM v6 with authentication guard, role-based access, lazy loading, automatic breadcrumbs, and nested route support.

---

## Package Structure

```
packages/route/
├── src/
│   ├── components/
│   │   ├── AuthRoute.tsx            # Auth guard wrapper
│   │   ├── RoleRoute.tsx            # Role guard wrapper
│   │   ├── LazyRoute.tsx            # Lazy load wrapper
│   │   └── Breadcrumb.tsx           # Auto breadcrumb component
│   ├── core/
│   │   ├── RouteKit.ts              # Setup & config
│   │   └── createRoutes.ts          # Config-based route builder
│   ├── hooks/
│   │   ├── useBreadcrumb.ts         # Breadcrumb hook
│   │   └── useRouteAccess.ts        # Auth/role check hook
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
  }
}
```

---

## 1. Types

```typescript
type AuthCheckFn = () => boolean | Promise<boolean>
type GetRolesFn = () => string[] | Promise<string[]>

interface RouteKitConfig {
  // Auth check — flexible, developer decides where to read from
  authCheck?: AuthCheckFn
  // e.g. () => !!sessionStorage.getItem("token")
  // e.g. () => !!localStorage.getItem("token")
  // e.g. async () => { const user = await AuthService.getMe(); return !!user }

  // Or integrate with store-kit
  authStore?: () => { [key: string]: unknown }
  authSelector?: (state: unknown) => boolean

  // Role check — flexible
  getRoles?: GetRolesFn
  // e.g. () => JSON.parse(sessionStorage.getItem("user") ?? "{}").roles

  // Or integrate with store-kit
  roleStore?: () => { [key: string]: unknown }
  roleSelector?: (state: unknown) => string[]

  // Redirect paths
  loginPath?: string           // default: "/login"
  unauthorizedPath?: string    // default: "/403"
  notFoundPath?: string        // default: "/404"

  // Lazy loading fallback
  suspenseFallback?: React.ReactNode  // default: null
}

interface RouteConfig {
  path: string
  component: React.ComponentType | (() => Promise<{ default: React.ComponentType }>)
  lazy?: boolean                 // wrap with React.lazy + Suspense
  auth?: boolean                 // require authentication
  roles?: string[]               // require specific roles
  breadcrumb?: string | ((params: Record<string, string>) => string | Promise<string>)
  children?: RouteConfig[]
  index?: boolean                // index route
  layout?: React.ComponentType   // layout wrapper for this route
}
```

---

## 2. `RouteKit` — Setup

```typescript
class RouteKit {
  static setup(config: RouteKitConfig): void
  static getConfig(): Required<RouteKitConfig>
}
```

**Auth check priority:**
1. If `authStore` + `authSelector` provided → use store
2. If `authCheck` provided → use callback
3. If neither → no auth guard (all routes accessible)

**Role check priority:**
1. If `roleStore` + `roleSelector` provided → use store
2. If `getRoles` provided → use callback
3. If neither → roles not enforced

---

## 3. `createRoutes` — Config-based

```typescript
function createRoutes(routes: RouteConfig[]): React.ReactElement
```

**Usage:**
```typescript
const AppRoutes = createRoutes([
  {
    path: "/",
    component: HomePage,
    breadcrumb: "Home"
  },
  {
    path: "/login",
    component: LoginPage
  },
  {
    path: "/dashboard",
    component: DashboardLayout,
    auth: true,
    breadcrumb: "Dashboard",
    children: [
      {
        path: "",
        index: true,
        component: DashboardHome
      },
      {
        path: "users",
        component: UsersPage,
        auth: true,
        roles: ["admin"],
        lazy: true,
        breadcrumb: "Users",
        children: [
          {
            path: ":id",
            component: () => import("./pages/UserDetailPage"),
            // lazy auto-detected from import function
            breadcrumb: async (params) => {
              const user = await UserService.findById(params.id)
              return `${user.firstName} ${user.lastName}`
            }
          }
        ]
      },
      {
        path: "settings",
        component: SettingsPage,
        auth: true,
        lazy: true,
        breadcrumb: "Settings"
      }
    ]
  },
  {
    path: "/403",
    component: UnauthorizedPage
  },
  {
    path: "*",
    component: NotFoundPage
  }
])
```

---

## 4. JSX-based (Opsi B)

```typescript
// Auth guard component
interface AuthRouteProps {
  children: React.ReactNode
  roles?: string[]
  fallback?: React.ReactNode    // shown while checking auth
}

const AuthRoute: React.FC<AuthRouteProps>

// Role guard component
interface RoleRouteProps {
  children: React.ReactNode
  roles: string[]
}

const RoleRoute: React.FC<RoleRouteProps>
```

**Usage:**
```typescript
import { Routes, Route } from "react-router-dom"
import { AuthRoute, RoleRoute } from "@alisdev/fe-kit"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Auth protected */}
      <Route path="/dashboard" element={
        <AuthRoute>
          <DashboardLayout />
        </AuthRoute>
      }>
        <Route index element={<DashboardHome />} />

        {/* Role protected */}
        <Route path="users" element={
          <RoleRoute roles={["admin"]}>
            <UsersPage />
          </RoleRoute>
        } />

        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="/403" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
```

---

## 5. Lazy Loading

Two ways to define lazy routes:

```typescript
// Way 1 — boolean flag (auto-wrap with React.lazy)
{
  path: "/dashboard",
  component: DashboardPage,
  lazy: true
  // internally: React.lazy(() => import("./DashboardPage"))
}

// Way 2 — import function (auto-detected as lazy)
{
  path: "/dashboard",
  component: () => import("./pages/DashboardPage"),
  // lazy: true not needed — import function detected automatically
}
```

**Suspense fallback:**
```typescript
RouteKit.setup({
  suspenseFallback: <PageLoader />  // shown while lazy component loads
})
```

---

## 6. Breadcrumb

### Auto-generation from path:

```typescript
// Path segments → capitalize, replace - and _ with space
"/"                          → []
"/dashboard"                 → ["Dashboard"]
"/dashboard/users"           → ["Dashboard", "Users"]
"/dashboard/users/123"       → ["Dashboard", "Users", "123"]
"/dashboard/user-management" → ["Dashboard", "User Management"]
"/dashboard/user_settings"   → ["Dashboard", "User Settings"]
```

### Manual override per route:

```typescript
// Static string
{ path: "/dashboard", breadcrumb: "My Dashboard" }

// Sync function with params
{ path: "/users/:id", breadcrumb: (params) => `User #${params.id}` }

// Async function (fetches data)
{
  path: "/users/:id",
  breadcrumb: async (params) => {
    const user = await UserService.findById(params.id)
    return `${user.firstName} ${user.lastName}`
  }
}
```

### `Breadcrumb` Component:

```typescript
interface BreadcrumbProps {
  separator?: React.ReactNode    // default: "/"
  className?: string
  itemClassName?: string
  activeClassName?: string       // class for current page item
  renderItem?: (item: BreadcrumbItem, isLast: boolean) => React.ReactNode
}

interface BreadcrumbItem {
  label: string
  path: string
  isActive: boolean
}

const Breadcrumb: React.FC<BreadcrumbProps>
```

**Usage:**
```typescript
// Default render
<Breadcrumb />
// Dashboard / Users / Dudi Setiawan

// Custom separator
<Breadcrumb separator={<ChevronRight />} className="text-sm text-gray-500" />

// Custom render
<Breadcrumb
  renderItem={(item, isLast) => (
    isLast
      ? <span className="font-semibold">{item.label}</span>
      : <Link to={item.path}>{item.label}</Link>
  )}
/>
```

### `useBreadcrumb` Hook:

```typescript
interface UseBreadcrumbResult {
  items: BreadcrumbItem[]
  loading: boolean    // true while async breadcrumb resolves
}

function useBreadcrumb(): UseBreadcrumbResult
```

---

## 7. Auth Guard Flow

```
User visits protected route
         ↓
   Check auth (authCheck / authStore)
         ↓
   ┌─────────────┐
   │  Authorized? │
   └─────────────┘
     ↓ Yes          ↓ No
Check roles     Redirect to loginPath
     ↓
 ┌──────────────┐
 │ Has role?    │
 └──────────────┘
   ↓ Yes          ↓ No
Render page   Redirect to unauthorizedPath
```

**Loading state during async auth check:**
```typescript
// While authCheck promise resolves → show fallback
<AuthRoute fallback={<PageLoader />}>
  <DashboardPage />
</AuthRoute>
```

---

## 8. Full Usage Example (README.md)

```typescript
import {
  RouteKit, createRoutes, AuthRoute, RoleRoute,
  Breadcrumb, useBreadcrumb
} from "@alisdev/fe-kit"
import { BrowserRouter } from "react-router-dom"

// ── Setup ─────────────────────────────────────────────────────────

RouteKit.setup({
  // Auth from sessionStorage
  authCheck: () => !!sessionStorage.getItem("access_token"),

  // Roles from store-kit
  roleStore: useAuthStore,
  roleSelector: (state: any) => state.user?.roles ?? [],

  // Redirects
  loginPath: "/login",
  unauthorizedPath: "/403",
  notFoundPath: "/404",

  // Lazy fallback
  suspenseFallback: <PageLoader />
})

// ── Config-based routes ───────────────────────────────────────────

const AppRoutes = createRoutes([
  { path: "/", component: HomePage, breadcrumb: "Home" },
  { path: "/login", component: LoginPage },
  {
    path: "/dashboard",
    component: DashboardLayout,
    auth: true,
    breadcrumb: "Dashboard",
    children: [
      { path: "", index: true, component: DashboardHome },
      {
        path: "users",
        component: () => import("./pages/UsersPage"),
        auth: true,
        roles: ["admin"],
        breadcrumb: "Users",
        children: [
          {
            path: ":id",
            component: () => import("./pages/UserDetailPage"),
            breadcrumb: async (params) => {
              const user = await UserService.findById(params.id)
              return `${user.firstName} ${user.lastName}`
            }
          }
        ]
      },
      {
        path: "settings",
        component: SettingsPage,
        lazy: true,
        breadcrumb: "Settings"
      }
    ]
  },
  { path: "/403", component: UnauthorizedPage },
  { path: "*", component: NotFoundPage }
])

// ── App ───────────────────────────────────────────────────────────

function App() {
  return (
    <BrowserRouter>
      {AppRoutes}
    </BrowserRouter>
  )
}

// ── JSX-based ─────────────────────────────────────────────────────

function AppJSX() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <AuthRoute fallback={<PageLoader />}>
            <DashboardLayout />
          </AuthRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="users" element={
            <RoleRoute roles={["admin"]}>
              <UsersPage />
            </RoleRoute>
          } />
        </Route>
        <Route path="/403" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

// ── Breadcrumb in layout ──────────────────────────────────────────

function DashboardLayout() {
  return (
    <Dashboard>
      <Dashboard.Navbar title="My App" />
      <Dashboard.Sidebar items={sidebarItems} />
      <Dashboard.Content>
        {/* Auto breadcrumb */}
        <Breadcrumb
          separator={<span className="mx-2 text-gray-400">/</span>}
          className="mb-4 text-sm"
          activeClassName="font-semibold text-gray-900"
        />
        <Outlet />
      </Dashboard.Content>
    </Dashboard>
  )
}

// ── useBreadcrumb hook ────────────────────────────────────────────

function PageHeader() {
  const { items, loading } = useBreadcrumb()

  if (loading) return <BreadcrumbSkeleton />

  return (
    <nav>
      {items.map((item, i) => (
        <span key={item.path}>
          {item.isActive
            ? <span>{item.label}</span>
            : <Link to={item.path}>{item.label}</Link>
          }
          {i < items.length - 1 && " / "}
        </span>
      ))}
    </nav>
  )
}
```

---

## Output Requirements

1. Implement all files in `src/` with full TypeScript types
2. Export `RouteKit`, `createRoutes`, `AuthRoute`, `RoleRoute`, `Breadcrumb`, `useBreadcrumb`, `useRouteAccess` from `src/index.ts`
3. `createRoutes` recursively processes `children` to build nested React Router routes
4. Lazy detection: `() => import(...)` function auto-detected, no need for `lazy: true`
5. Async breadcrumb resolves in background — `useBreadcrumb` returns `loading: true` while pending
6. Breadcrumb items update on every route change
7. Add inline JSDoc on all public APIs
8. Handle edge cases:
   - `RouteKit.setup()` not called → use defaults (no auth, no roles, default redirect paths)
   - `authCheck` async rejects → treat as unauthorized, redirect to `loginPath`
   - `getRoles` async rejects → treat as no roles, redirect to `unauthorizedPath`
   - `lazy: true` on non-dynamic component → wrap with `React.lazy(() => Promise.resolve({ default: component }))`
   - Async breadcrumb rejects → fallback to auto-generated label from path segment
   - Route with `roles` but no `auth: true` → auto-imply `auth: true`
   - Nested route inherits parent `auth` → child routes of auth-protected parent are also protected
   - Both `authCheck` and `authStore` provided → prefer `authStore`, log warning
   - Both `getRoles` and `roleStore` provided → prefer `roleStore`, log warning
