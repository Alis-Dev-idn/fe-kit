# @alisdev/fe-kit

A premium, all-in-one frontend utility kit for React + TypeScript + Vite. Built for speed, consistency, and a professional user experience.

## 📦 Packages

This monorepo consists of several high-quality kits designed to work together seamlessly:

- **[Axios Kit](./packages/axios)**: Robust HTTP client with global interceptors.
- **[Confirm Kit](./packages/confirm)**: Imperative dialogs (Alert, Confirm, Prompt).
- **[Notify Kit](./packages/notify)**: Stacked notifications with progress bars.
- **[Store Kit](./packages/store)**: Simple, reactive state management with persistence.
- **[Form Kit](./packages/form)**: Zod-powered form validation and dynamic arrays.
- **[Table Kit](./packages/table)**: Hybrid client/server table management with Excel export.
- **[Modal Kit](./packages/modal)**: Multi-layer modal stacking system.
- **[Dashboard Kit](./packages/dashboard)**: Premium responsive dashboard layout components.
- **[Input Kit](./packages/input)**: A complete set of styled, accessible input components.
- **[UI Kit](./packages/ui)**: Modern UI Primitives & Overlay System.
- **[Chart Kit](./packages/chart)**: Recharts Abstraction & Data Visualization with Real-time Support.
- **[Map Kit](./packages/map)**: High-performance Geospatial Layer with MapLibre GL.
- **[Route Kit](./packages/route)**: Config-driven routing with Auth & Role guards.

## 🚀 Quick Start

### 1. Installation

```bash
pnpm add @alisdev/fe-kit zod axios react-router-dom
```

### 2. Global Setup

Most kits require a container or setup call at the root of your application.

```tsx
import { 
  NotifyContainer, 
  ConfirmContainer, 
  ModalStack, 
  RouteKit 
} from "@alisdev/fe-kit";

// Configure routing
RouteKit.setup({
  authCheck: () => !!localStorage.getItem("token"),
  loginPath: "/login"
});

function App() {
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      
      {/* Container components for imperative kits */}
      <NotifyContainer />
      <ConfirmContainer />
      <ModalStack />
    </>
  );
}
```

### 3. Usage Example

```tsx
import { notify, confirm, useForm } from "@alisdev/fe-kit";

function MyComponent() {
  const handleDelete = async () => {
    const ok = await confirm({ title: "Delete?", message: "Are you sure?" });
    if (ok) {
      notify.success("Deleted successfully!");
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

## 🛠️ Development

This project uses **pnpm workspaces** and **Turborepo**.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run in development mode
pnpm dev
```

## 📜 License

MIT © [Alis Dev](https://github.com/Alis-Dev-idn)
