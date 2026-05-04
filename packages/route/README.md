# @alisdev/fe-kit-route

A powerful, configuration-driven routing layer built on top of `react-router-dom` v6. It drastically simplifies complex enterprise routing by providing built-in authentication guards, role-based access control, automated dynamic imports (lazy loading), and automatic breadcrumb generation.

## Features

- 🛡️ **Authentication Guards**: Protect private routes globally via simple configuration flags. Unauthenticated users are automatically bounced to login.
- 👮 **Role-based Access Control (RBAC)**: Restrict specific branches of your app to certain roles (e.g., `["admin", "manager"]`).
- 🍞 **Auto Breadcrumbs**: Generates a strongly-typed breadcrumb trail array automatically based on the current active route and configuration.
- 💤 **Automatic Code Splitting**: Detects functions that return `import()` and automatically wraps them in `React.lazy` and `Suspense`, providing default fallback loaders without boilerplate.
- 🗺️ **Config-driven vs JSX-driven**: Build your entire routing tree from a single declarative array, or use the `<AuthRoute>` and `<RoleRoute>` wrapper components in raw JSX.

## Installation

```bash
pnpm add @alisdev/fe-kit-route react-router-dom
```

## Global Configuration

You must configure the routing kit before you render your application. This tells the kit how to check your authentication state.

```typescript
import { RouteKit } from "@alisdev/fe-kit-route";

RouteKit.setup({
  // Logic to determine if the user is currently logged in
  authCheck: () => !!localStorage.getItem("token"),
  
  // Logic to extract the roles of the current user
  getRoles: () => {
    const userString = localStorage.getItem("user");
    if (!userString) return [];
    return JSON.parse(userString).roles || [];
  },
  
  // Redirection paths
  loginPath: "/auth/login",
  unauthorizedPath: "/403"
});
```

## 1. Config-based Routing (Recommended)

Defining routes as an array makes the application structure easy to read, manage, and scale. The `createRoutes` function recursively converts your config into `react-router-dom` `<Route>` components.

```tsx
import { createRoutes, RouteConfig } from "@alisdev/fe-kit-route";
import { BrowserRouter, Routes } from "react-router-dom";
import { DefaultLayout } from "./layouts/DefaultLayout";
import { AdminLayout } from "./layouts/AdminLayout";

// Standard synchronous component
import HomePage from "./pages/HomePage"; 

const routesConfig: RouteConfig[] = [
  // Public Route
  { 
    path: "/", 
    component: HomePage, 
    breadcrumb: "Home" 
  },
  
  // Protected Route (Requires Login)
  { 
    path: "/dashboard", 
    component: () => import("./pages/Dashboard"), // Automatically lazy-loaded!
    auth: true, 
    breadcrumb: "Dashboard",
    layout: DefaultLayout
  },

  // Role Protected Route (Requires Login AND 'admin' role)
  { 
    path: "/admin", 
    component: AdminLayout,
    auth: true,
    roles: ["admin"],
    breadcrumb: "Admin Area",
    children: [
      { 
        // Generates an index route
        index: true, 
        component: () => import("./pages/admin/Overview") 
      },
      { 
        path: "users", 
        component: () => import("./pages/admin/UserList"),
        breadcrumb: "User Management"
      }
    ]
  },
  
  // Fallback
  { 
    path: "*", 
    component: () => import("./pages/NotFound") 
  }
];

// Generate React Elements
const mappedRoutes = createRoutes(routesConfig);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {mappedRoutes}
      </Routes>
    </BrowserRouter>
  );
}
```

## 2. Using Breadcrumbs

If you defined the `breadcrumb` property in your `RouteConfig`, you can easily generate breadcrumb UI in your layouts using the `useBreadcrumb` hook.

```tsx
import { useBreadcrumb } from "@alisdev/fe-kit-route";
import { Link } from "react-router-dom";

export function BreadcrumbNav() {
  const breadcrumbs = useBreadcrumb();
  // Returns: [{ label: "Home", path: "/" }, { label: "Admin Area", path: "/admin" }, { label: "User Management", path: "/admin/users" }]

  return (
    <nav className="flex gap-2 text-sm text-gray-500">
      {breadcrumbs.map((bc, index) => (
        <span key={bc.path}>
          <Link to={bc.path} className="hover:text-blue-600">
            {bc.label}
          </Link>
          {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
}
```

## 3. JSX-based Guards

If you prefer building your `<Routes>` manually in JSX instead of an array, you can use the guard wrapper components.

```tsx
import { Routes, Route } from "react-router-dom";
import { AuthRoute, RoleRoute } from "@alisdev/fe-kit-route";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      {/* Guarded by Authentication */}
      <Route path="/profile" element={
        <AuthRoute>
          <ProfilePage />
        </AuthRoute>
      } />

      {/* Guarded by Authentication AND Role */}
      <Route path="/admin" element={
        <AuthRoute>
          <RoleRoute roles={["admin", "superadmin"]}>
            <AdminPage />
          </RoleRoute>
        </AuthRoute>
      } />
    </Routes>
  );
}
```

## API Reference

### `RouteConfig` Object

| Property | Type | Description |
| :--- | :--- | :--- |
| `path` | `string` | The URL path (mutually exclusive with `index`). |
| `index` | `boolean` | If true, acts as the default child route for the parent path. |
| `component` | `React.ComponentType \| () => Promise<any>` | The component to render. If a function returning a Promise is provided, it is automatically wrapped in `React.lazy`. |
| `auth` | `boolean` | If true, user must be authenticated. |
| `roles` | `string[]` | If provided, user must possess at least one of these roles. Implies `auth: true`. |
| `layout` | `React.ComponentType` | A wrapper component. The `component` will be passed as `children` to the layout. |
| `breadcrumb`| `string \| ((params) => string)` | The text to show in the breadcrumb trail. Can be a string or a function receiving URL params. |
| `children` | `RouteConfig[]` | Nested routes. |
