# Prompt: `notify-kit` — Notification/Toast Library (React + TypeScript)

## Overview

Build the `notify` package inside `@alisdev/fe-kit` monorepo. Provides imperative toast notifications with position control, promise support, custom components, action buttons, pause on hover, and optional `ApiError` interception.

---

## Package Structure

```
packages/notify/
├── src/
│   ├── core/
│   │   ├── NotifyKit.ts         # Setup & configuration
│   │   └── NotifyStore.ts       # Internal notification state store
│   ├── notify.ts                # Imperative API (notify.success, etc.)
│   ├── components/
│   │   └── NotifyContainer.tsx  # React container component
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
    "react-dom": "^18.x"
  }
}
```

---

## 1. Types

```typescript
type NotifyPosition =
  | "top-left" | "top-center" | "top-right"
  | "bottom-left" | "bottom-center" | "bottom-right"

type NotifyType = "success" | "error" | "warning" | "info"

interface NotifyAction {
  label: string
  onClick: () => void
}

interface NotifyOptions {
  duration?: number           // ms, 0 = persistent, default from setup
  dismissible?: boolean       // show close button, default from setup
  action?: NotifyAction       // optional action button
  position?: NotifyPosition   // override global position per notification
}

interface NotifyItem {
  id: string
  type: NotifyType
  message: string
  options: Required<NotifyOptions>
  createdAt: number
  paused: boolean
}
```

---

## 2. `NotifyKit` — Setup

```typescript
interface ApiError {
  message: string
  status: number
  code: string
  data: unknown
}

interface NotifyKitConfig {
  position?: NotifyPosition      // default: "top-right"
  duration?: number              // default: 3000ms
  dismissible?: boolean          // default: true
  pauseOnHover?: boolean         // default: true
  maxVisible?: number            // default: 3
  stack?: boolean                // stack notifications, default: true
  gap?: number                   // gap between notifications in px, default: 8
  interceptApiError?: {
    enabled: boolean             // default: false
    messageOverride?: (error: ApiError) => string  // custom message from ApiError
  }
}

class NotifyKit {
  static setup(config: NotifyKitConfig): void
  static getConfig(): Required<NotifyKitConfig>
  static dismiss(id: string): void
  static dismissAll(): void
}
```

**`interceptApiError` behavior:**

When `enabled: true`, the `axios-kit` response interceptor automatically triggers `notify.error()` for any `ApiError`:

```typescript
// Without messageOverride → uses error.message directly
notify.error("Unauthorized")

// With messageOverride → custom message logic
interceptApiError: {
  enabled: true,
  messageOverride: (error) => {
    if (error.status === 401) return "Session expired. Please login again."
    if (error.status === 403) return "You don't have permission to do this."
    return error.message
  }
}
```

**Requirements:**
- `interceptApiError` integration is done by registering a hook in `axios-kit`'s error interceptor
- If `axios-kit` is not installed, `interceptApiError` is silently ignored

---

## 3. Imperative Notify API

```typescript
interface NotifyAPI {
  success(message: string, options?: NotifyOptions): string   // returns id
  error(message: string, options?: NotifyOptions): string
  warning(message: string, options?: NotifyOptions): string
  info(message: string, options?: NotifyOptions): string
  custom(component: React.ReactNode, options?: NotifyOptions): string
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: unknown) => string)
    },
    options?: NotifyOptions
  ): Promise<T>
  dismiss(id: string): void
  dismissAll(): void
}

const notify: NotifyAPI
```

**`notify.promise` behavior:**
1. Shows loading notification immediately (type: `info`, no auto-dismiss)
2. On resolve → replaces with success notification
3. On reject → replaces with error notification
4. Returns original promise result (re-throws on reject)

---

## 4. `NotifyContainer` Component

Must be rendered once in the app (typically in root layout). Handles all notification rendering with animations.

```typescript
interface NotifyContainerProps {
  // Optional overrides — normally uses NotifyKit.setup() config
  position?: NotifyPosition
}

const NotifyContainer: React.FC<NotifyContainerProps>
```

**Usage:**
```typescript
// In App.tsx or root layout
import { NotifyContainer } from "@alisdev/fe-kit"

function App() {
  return (
    <>
      <Router />
      <NotifyContainer />
    </>
  )
}
```

**Animation requirements:**
- **Enter animation** (configurable): `fade` | `slide` | `zoom` | `bounce`
- **Exit animation** (configurable): same options
- Default: `fade` in, `fade` out
- Animation duration: `200ms` default, configurable via setup

```typescript
// Extended setup for animations
interface NotifyKitConfig {
  // ... existing fields
  animation?: {
    in?: "fade" | "slide" | "zoom" | "bounce"     // default: "fade"
    out?: "fade" | "slide" | "zoom" | "bounce"    // default: "fade"
    duration?: number                              // default: 200ms
  }
}
```

---

## 5. Pause on Hover

When `pauseOnHover: true`:
- Mouse enter → pause countdown timer
- Mouse leave → resume countdown from remaining time
- Visual indicator: progress bar at bottom of notification shows remaining time

---

## 6. Max Visible & Stack Behavior

```typescript
NotifyKit.setup({
  maxVisible: 3,    // max 3 notifications at once
  stack: true       // stack vertically at configured position
})

// If 4th notification arrives while 3 are visible:
// → oldest notification is dismissed automatically
// → new notification slides in
```

---

## 7. Mobile Responsive

Automatically activates when viewport ≤ 768px. No configuration needed.

**Position remapping:**
```
Desktop position   → Mobile position
top-left           → top-center
top-right          → top-center
top-center         → top-center    (unchanged)
bottom-left        → bottom-center
bottom-right       → bottom-center
bottom-center      → bottom-center (unchanged)
```

**Width adjustment:**
```
Desktop → width: 320px (fixed)
Mobile  → width: 92vw  (nearly full width)
```

**Max visible on mobile:**
```
Desktop → maxVisible from config (default: 3)
Mobile  → max 2 notifications visible at once
          (regardless of config value)
```

**Swipe to dismiss:**
- User can swipe left or right to dismiss a notification
- Notification follows finger movement (`translateX`) as visual feedback
- Swipe > 30% of notification width → dismiss with slide-out animation
- Swipe < 30% → snap back to original position smoothly
- Works with touch events (`touchstart`, `touchmove`, `touchend`)

```
Swipe right 30%+ → slide out to right → dismiss
Swipe left  30%+ → slide out to left  → dismiss
Swipe < 30%      → snap back (spring animation)
```

**Requirements:**
- Use `window.matchMedia("(max-width: 768px)")` with resize listener
- Swipe detection via `touchstart`/`touchmove`/`touchend` events
- During swipe → disable pause-on-hover timer
- Snap back uses CSS transition: `transform 0.2s ease-out`
- Swipe dismiss uses same exit animation direction as swipe direction

## 8. Full Usage Example (README.md)

```typescript
import { NotifyKit, notify, NotifyContainer } from "@alisdev/fe-kit"

// ── Setup (main.tsx) ──────────────────────────────────────────────

NotifyKit.setup({
  position: "top-right",
  duration: 3000,
  dismissible: true,
  pauseOnHover: true,
  maxVisible: 3,
  stack: true,
  gap: 8,
  animation: {
    in: "slide",
    out: "fade",
    duration: 200
  },
  interceptApiError: {
    enabled: true,
    messageOverride: (error) => {
      if (error.status === 401) return "Session expired. Please login again."
      if (error.status === 403) return "You don't have permission."
      if (error.status === 500) return "Server error. Please try again later."
      return error.message
    }
  }
})

// ── Root component ────────────────────────────────────────────────

function App() {
  return (
    <>
      <Router />
      <NotifyContainer />
    </>
  )
}

// ── Usage in components ───────────────────────────────────────────

// Basic
notify.success("Profile updated!")
notify.error("Something went wrong")
notify.warning("Session expiring in 5 minutes")
notify.info("New message received")

// With options
notify.success("File uploaded!", {
  duration: 5000,
  position: "bottom-right",    // override global position
  action: {
    label: "View File",
    onClick: () => navigate("/files")
  }
})

// Persistent (no auto-dismiss)
const id = notify.info("Processing large file...", { duration: 0, dismissible: false })
// Later...
notify.dismiss(id)

// Promise
const result = await notify.promise(
  UserService.updateProfile(form),
  {
    loading: "Updating profile...",
    success: "Profile updated successfully!",
    error: (err) => `Failed: ${(err as ApiError).message}`
  }
)

// Custom component
notify.custom(
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <img src={user.avatar} width={32} height={32} style={{ borderRadius: "50%" }} />
    <span>{user.name} sent you a message</span>
  </div>,
  { duration: 5000 }
)

// Dismiss all
notify.dismissAll()
```

---

## Output Requirements

1. Implement all files in `src/` with full TypeScript types
2. Export `NotifyKit`, `notify`, `NotifyContainer` from `src/index.ts`
3. `NotifyContainer` auto-injects into DOM via React Portal (renders at `document.body`)
4. Internal state managed without external dependencies (custom pub/sub or React state)
5. Animation implemented via CSS transitions (no external animation library)
6. Progress bar timer uses `requestAnimationFrame` for smooth countdown
7. Add inline JSDoc on all public APIs
8. Handle edge cases:
   - `notify.*` called before `NotifyContainer` is mounted → queue notifications, render when mounted
   - `notify.promise` rejects → show error notification AND re-throw original error
   - `notify.dismiss(id)` with non-existent id → silently ignore
   - `duration: 0` → no auto-dismiss, stays until manually dismissed
   - `maxVisible` exceeded → dismiss oldest before showing new
   - Multiple `NotifyContainer` instances → warn in console, only first one renders notifications
