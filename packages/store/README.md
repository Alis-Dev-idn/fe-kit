# @alisdev/fe-kit-store

A lightweight, high-performance state management library for React 18+ based on `useSyncExternalStore`. It eliminates the need for complex reducers or providers for global state, while fully supporting isolated context stores when needed.

## Features

- ⚛️ **React 18 Optimized**: Built natively on `useSyncExternalStore` for tearing-free, concurrent-safe updates.
- 🌍 **Global Stores**: Create singleton stores that can be imported and used anywhere (no `<Provider>` wrapping required).
- 🏘️ **Context Stores**: Create isolated, scoped stores bound to a component tree (perfect for reusable complex components like tables).
- 💾 **Persistence**: Built-in middleware to automatically sync state to `localStorage` or `sessionStorage`.
- 🔍 **DevTools & Logger**: Seamless state debugging and logging middleware.
- 🪶 **Zero Dependencies**: Extremely small bundle size.

## Installation

```bash
pnpm add @alisdev/fe-kit-store
```

## 1. Global Store Usage

Global stores are singletons. State lives outside the React tree, meaning you can update and read it from outside components (e.g., inside API interceptors or plain TS files).

### Creating a Store

```typescript
import { createStore } from "@alisdev/fe-kit-store";
import { persist, logger } from "@alisdev/fe-kit-store/middleware";

interface User {
  id: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuthStore = createStore<AuthState>(
  // 1. Initial State
  {
    user: null,
    isAuthenticated: false
  }, 
  // 2. Options & Middlewares
  {
    name: "auth-store", // Required for persist/devtools
    middlewares: [
      logger(), // Logs prev state, action, and next state to console
      persist({ 
        key: "my-app-auth", 
        storage: window.localStorage // or window.sessionStorage
      })
    ]
  }
);
```

### Consuming in Components

```tsx
import { useAuthStore } from "./authStore";

function UserProfile() {
  // Selectively extract state. React will only re-render if these specific values change.
  const { user, isAuthenticated, setState } = useAuthStore();

  const handleLogout = () => {
    // Partial updates: you only need to provide the fields you want to change
    setState({ user: null, isAuthenticated: false });
  };

  if (!isAuthenticated) return <LoginScreen />;

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

### Deep Updates
`setState` performs a shallow merge. For deeply nested updates, use the callback pattern:

```typescript
setState((prev) => ({
  user: {
    ...prev.user,
    settings: {
      ...prev.user.settings,
      theme: "dark"
    }
  }
}));
```

## 2. Context Store (Scoped State)

Global stores are bad for reusable components (e.g., if you render `<MyTable />` twice, they would share the same global state). Context stores solve this by creating isolated state bound to a specific React subtree.

### Creating a Context Store

```tsx
import { createContextStore } from "@alisdev/fe-kit-store";

interface TableState {
  page: number;
  search: string;
}

// 1. Define how the initial state is created from Provider props
export const { Provider: TableProvider, useStore: useTableStore } = createContextStore(
  (props: { initialPage?: number }) => ({
    page: props.initialPage || 1,
    search: ""
  })
);
```

### Usage

The provider initializes the isolated state, and children consume it.

```tsx
function SearchInput() {
  const { search, setState } = useTableStore();
  return (
    <input 
      value={search} 
      onChange={e => setState({ search: e.target.value })} 
    />
  );
}

function Pagination() {
  const { page, setState } = useTableStore();
  return (
    <button onClick={() => setState({ page: page + 1 })}>
      Next Page ({page})
    </button>
  );
}

// Parent Component
export function ComplexTable() {
  return (
    <TableProvider initialPage={1}>
      <div className="table-layout">
        <SearchInput />
        <DataGrid />
        <Pagination />
      </div>
    </TableProvider>
  );
}
```

## Middlewares

### `persist({ key, storage? })`
Automatically saves state to Web Storage.
- `key`: The string key used in storage.
- `storage`: Defaults to `localStorage`. Pass `sessionStorage` if needed.

### `logger()`
Prints colored logs to the browser console whenever state changes. Shows previous state, the payload, and the new state.

### `devtools()`
Connects your store to the Redux DevTools Extension in the browser. Requires the store `name` to be set.
