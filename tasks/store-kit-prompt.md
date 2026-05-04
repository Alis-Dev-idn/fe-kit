# Prompt: `store-kit` — State Management Library (React + TypeScript)

## Overview

Build the `store` package inside `@alisdev/fe-kit` monorepo. Provides lightweight Zustand-style global store and context-scoped store with async actions, selectors, middleware (logger, devtools, persist), and outside-React subscription support.

---

## Package Structure

```
packages/store/
├── src/
│   ├── createStore.ts           # Global store factory
│   ├── createContextStore.ts    # Context-scoped store factory
│   ├── middleware/
│   │   ├── logger.ts            # Logger middleware
│   │   ├── devtools.ts          # Redux DevTools middleware
│   │   └── persist.ts           # Storage persistence middleware
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
    "react": "^18.x"
  }
}
```

---

## 1. `createStore` — Global Store

```typescript
type StorageType = "localStorage" | "sessionStorage" | "cookie"

interface PersistOptions {
  key: string
  storage: StorageType
  cookieOptions?: {
    expires?: number    // days
    path?: string
    secure?: boolean
  }
}

type ActionResult<S> = Partial<S> | Promise<Partial<S>>
type Actions<S> = Record<string, (state: S, ...args: any[]) => ActionResult<S>>

interface ActionLoadingState<A extends Actions<any>> {
  [K in keyof A]: { loading: boolean; error: Error | null }
}

interface StoreResult<S, A extends Actions<S>> {
  // Hook — use in React components
  (): StoreState<S, A>

  // Selector hook — optimized re-renders
  <R>(selector: (state: S) => R): R

  // Outside React subscription
  subscribe<R>(selector: (state: S) => R, listener: (value: R) => void): () => void

  // Get state outside React
  getState(): S
}

interface StoreState<S, A extends Actions<S>> {
  // Spread state fields
  [K in keyof S]: S[K]
} & {
  // Spread action functions
  [K in keyof A]: (...args: Parameters<A[K]> extends [any, ...infer P] ? P : []) => Promise<ReturnType<A[K]>>
} & {
  // Global loading/error
  loading: boolean
  error: Error | null

  // Per-action loading/error
  actions: ActionLoadingState<A>

  // Reset
  reset: (field?: keyof S | Array<keyof S>) => void
}

function createStore<S extends object, A extends Actions<S>>(config: {
  state: S
  actions: A
  middleware?: Array<Middleware>
}): StoreResult<S, A>
```

---

## 2. `createContextStore` — Scoped Store

Same API as `createStore` but scoped to a React component subtree via Context.

```typescript
interface ContextStoreResult<S, A extends Actions<S>> {
  Provider: React.FC<{ children: React.ReactNode; initialValues?: Partial<S> }>
  useStore: StoreResult<S, A>
}

function createContextStore<S extends object, A extends Actions<S>>(config: {
  state: S
  actions: A
  middleware?: Array<Middleware>
}): ContextStoreResult<S, A>
```

**Usage:**
```typescript
const UserStore = createContextStore({ state, actions })

// Wrap subtree
<UserStore.Provider initialValues={{ user: currentUser }}>
  <ProfilePage />
</UserStore.Provider>

// Use inside subtree
const { user, setUser } = UserStore.useStore()
const user = UserStore.useStore(state => state.user)
```

---

## 3. Async Actions

Actions can be sync or async. Loading and error state are tracked automatically:

```typescript
const useUserStore = createStore({
  state: {
    user: null as IUser | null,
    users: [] as IUser[]
  },
  actions: {
    // Sync action
    setUser: (state, user: IUser) => ({ user }),

    // Async action — loading/error auto-tracked
    fetchUser: async (state, id: string) => {
      const user = await UserService.getById(id)
      return { user }
    },

    fetchUsers: async (state) => {
      const users = await UserService.findAll()
      return { users }
    },

    logout: (state) => ({ user: null, users: [] })
  }
})

// Usage
const {
  user, users,
  fetchUser, fetchUsers, logout,

  loading,           // true if ANY action is loading
  error,             // error from last failed action

  actions: {
    fetchUser: { loading: fetchingUser, error: fetchUserError },
    fetchUsers: { loading: fetchingUsers, error: fetchUsersError }
  }
} = useUserStore()

// Calling action
await fetchUser("abc123")
```

---

## 4. Selectors

Selectors prevent unnecessary re-renders by only re-rendering when the selected value changes:

```typescript
// Without selector — re-renders on ANY state change
const { user, users, loading } = useUserStore()

// With selector — re-renders ONLY when user changes
const user = useUserStore(state => state.user)

// Computed selector
const fullName = useUserStore(state =>
  state.user ? `${state.user.firstName} ${state.user.lastName}` : null
)

// Multiple values selector
const { user, loading } = useUserStore(state => ({
  user: state.user,
  loading: state.actions.fetchUser.loading
}))
```

**Requirements:**
- Default equality check: `Object.is` (shallow)
- For object selectors: shallow comparison of object keys

---

## 5. Reset

```typescript
const { reset } = useUserStore()

// Reset ALL state to initial values
reset()

// Reset single field
reset("user")

// Reset multiple fields
reset(["user", "users"])
```

---

## 6. Middleware

### `logger()`
```typescript
// Logs every state change to console
import { logger } from "@alisdev/fe-kit"

createStore({
  state,
  actions,
  middleware: [logger()]
})
// Console output:
// [store] action: fetchUser | prev: { user: null } | next: { user: {...} }
```

### `devtools(name?)`
```typescript
// Integrates with Redux DevTools browser extension
import { devtools } from "@alisdev/fe-kit"

createStore({
  state,
  actions,
  middleware: [devtools("UserStore")]
})
```

### `persist(options)`
```typescript
// Persists state to storage
import { persist } from "@alisdev/fe-kit"

createStore({
  state,
  actions,
  middleware: [
    persist({
      key: "user-store",
      storage: "localStorage"   // or "sessionStorage" | "cookie"
    })
  ]
})
// State is restored from storage on store initialization
```

---

## 7. Outside React Subscription

```typescript
// Subscribe to state changes outside React (e.g. in services, utilities)
const unsubscribe = useUserStore.subscribe(
  state => state.user,
  (user) => {
    if (user) apiInstance.defaults.headers["X-User-Id"] = user._id
    else delete apiInstance.defaults.headers["X-User-Id"]
  }
)

// Get current state
const currentUser = useUserStore.getState().user

// Cleanup
unsubscribe()
```

---

## 8. Full Usage Example (README.md)

```typescript
import { createStore, createContextStore, logger, devtools, persist } from "@alisdev/fe-kit"

// ── Global Store ──────────────────────────────────────────────────

const useAuthStore = createStore({
  state: {
    user: null as IUser | null,
    isLoggedIn: false,
    token: null as string | null
  },
  actions: {
    login: async (state, credentials: ILoginBody) => {
      const { user, token } = await AuthService.login(credentials)
      return { user, token, isLoggedIn: true }
    },
    logout: (state) => ({ user: null, token: null, isLoggedIn: false }),
    updateUser: (state, data: Partial<IUser>) => ({
      user: state.user ? { ...state.user, ...data } : null
    })
  },
  middleware: [
    logger(),
    devtools("AuthStore"),
    persist({ key: "auth", storage: "localStorage" })
  ]
})

// ── Context Store (scoped) ────────────────────────────────────────

const TableStore = createContextStore({
  state: {
    selectedRows: [] as string[],
    filters: {} as Record<string, unknown>
  },
  actions: {
    toggleRow: (state, id: string) => ({
      selectedRows: state.selectedRows.includes(id)
        ? state.selectedRows.filter(r => r !== id)
        : [...state.selectedRows, id]
    }),
    clearSelection: (state) => ({ selectedRows: [] }),
    setFilter: (state, key: string, value: unknown) => ({
      filters: { ...state.filters, [key]: value }
    })
  }
})

// ── Usage in components ───────────────────────────────────────────

function AuthStatus() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const { login, logout, actions: { login: loginState } } = useAuthStore()

  return (
    <div>
      {isLoggedIn ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button
          onClick={() => login({ email: "user@email.com", password: "pass" })}
          disabled={loginState.loading}
        >
          {loginState.loading ? "Logging in..." : "Login"}
        </button>
      )}
      {loginState.error && <p>{loginState.error.message}</p>}
    </div>
  )
}

function UsersPage() {
  return (
    <TableStore.Provider>
      <UserTable />
    </TableStore.Provider>
  )
}

function UserTable() {
  const { selectedRows, toggleRow } = TableStore.useStore()
  return <div>{selectedRows.length} selected</div>
}

// ── Outside React ─────────────────────────────────────────────────

// Auto-sync token to axios headers
useAuthStore.subscribe(
  state => state.token,
  (token) => {
    const api = AxiosKit.use("main")
    if (token) api.defaults.headers["Authorization"] = `Bearer ${token}`
  }
)
```

---

## Output Requirements

1. Implement all files in `src/` with full TypeScript types — full inference from `state` and `actions`
2. Export everything from `src/index.ts`
3. Use React `useSyncExternalStore` for subscription-based updates (React 18)
4. Selector equality uses `Object.is` by default
5. Middleware pipeline processes state changes in order
6. `persist` middleware hydrates state synchronously on store creation
7. Add inline JSDoc on all public APIs
8. Handle edge cases:
   - Async action throws → set `actions[name].error`, set global `error`, do NOT update state
   - `persist` storage unavailable (e.g. SSR) → silently skip, no throw
   - `devtools` extension not installed → silently skip, no throw
   - `reset(field)` with non-existent field → silently ignore
   - `createContextStore.useStore()` called outside `Provider` → throw descriptive error
   - Multiple `persist` middleware → throw error at store creation time
