# Prompt: `confirm-kit` — Dialog Confirmation Library (React + TypeScript)

## Overview

Build the `confirm` package inside `@alisdev/fe-kit` monorepo. Provides imperative and hook-based dialog system supporting confirm, alert, and prompt dialogs with animations, backdrop control, keyboard support, stacking behavior, Zod validation, timeout/countdown, and custom component override.

---

## Package Structure

```
packages/confirm/
├── src/
│   ├── core/
│   │   ├── ConfirmKit.ts         # Setup & configuration
│   │   └── ConfirmStore.ts       # Internal dialog state store
│   ├── dialogs/
│   │   ├── ConfirmDialog.tsx     # Default confirm dialog component
│   │   ├── AlertDialog.tsx       # Default alert dialog component
│   │   └── PromptDialog.tsx      # Default prompt dialog component
│   ├── imperative/
│   │   ├── confirm.ts            # confirm() function
│   │   ├── alert.ts              # alert() function
│   │   └── prompt.ts             # prompt() function
│   ├── hooks/
│   │   └── useConfirm.ts         # Hook-based API
│   ├── components/
│   │   └── ConfirmContainer.tsx  # Root container (renders all dialogs)
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
    "zod": "^3.x"
  },
  "peerDependenciesMeta": {
    "zod": { "optional": true }
  }
}
```

---

## 1. Types

```typescript
type AnimationType = "fade" | "slide" | "zoom" | "bounce"
type StackBehavior = "layer" | "replace"
type ThemeType = "light" | "dark" | "auto"

interface AnimationConfig {
  in?: AnimationType      // default: "fade"
  out?: AnimationType     // default: "fade"
  duration?: number       // ms, default: 200
}

interface BackdropConfig {
  enabled?: boolean       // default: true
  blur?: boolean          // default: false
  dismissible?: boolean   // click backdrop = cancel, default: true
}

interface KeyboardConfig {
  confirm?: string        // default: "Enter"
  cancel?: string         // default: "Escape"
  trapFocus?: boolean     // default: true
}

interface TimeoutConfig {
  duration: number        // ms
  action: "confirm" | "cancel"
  showCountdown?: boolean // default: true
}

interface BaseDialogOptions {
  animation?: AnimationConfig
  backdrop?: BackdropConfig
  timeout?: TimeoutConfig
  component?: React.ReactNode   // override default dialog UI entirely
}

interface ConfirmOptions extends BaseDialogOptions {
  title: string
  message?: string
  confirmLabel?: string    // default: "Confirm"
  cancelLabel?: string     // default: "Cancel"
}

interface AlertOptions extends BaseDialogOptions {
  title: string
  message?: string
  confirmLabel?: string    // default: "OK"
}

interface PromptOptions extends BaseDialogOptions {
  title: string
  message?: string
  placeholder?: string
  defaultValue?: string
  confirmLabel?: string    // default: "Submit"
  cancelLabel?: string     // default: "Cancel"
  validation?: import("zod").ZodString  // Zod schema for input validation
}
```

---

## 2. `ConfirmKit` — Setup

```typescript
interface ConfirmKitConfig {
  animation?: AnimationConfig
  backdrop?: BackdropConfig
  keyboard?: KeyboardConfig
  theme?: ThemeType               // default: "light"
  stack?: StackBehavior           // default: "layer"
}

class ConfirmKit {
  static setup(config: ConfirmKitConfig): void
  static getConfig(): Required<ConfirmKitConfig>
  static dismiss(id: string): void
  static dismissAll(): void
}
```

---

## 3. Imperative API

### `confirm(options)`

```typescript
function confirm(options: ConfirmOptions): Promise<boolean>

// Returns:
// true  → user clicked confirm / pressed Enter
// false → user clicked cancel / pressed Escape / clicked backdrop
```

### `alert(options)`

```typescript
function alert(options: AlertOptions): Promise<void>

// Resolves when user clicks OK or presses Enter
```

### `prompt(options)`

```typescript
function prompt(options: PromptOptions): Promise<string | null>

// Returns:
// string  → user input value (after validation passes)
// null    → user cancelled
```

**Prompt with Zod validation:**
```typescript
const name = await prompt({
  title: "Enter your name",
  placeholder: "Full name...",
  validation: z.string().min(1, "Name is required").max(50, "Too long"),
})
// If validation fails → error shown inside dialog, dialog stays open
// User must fix input before confirming
```

---

## 4. `useConfirm` Hook

Declarative alternative. Requires rendering `<ConfirmDialog />` in component.

```typescript
interface UseConfirmResult {
  confirm: (options: ConfirmOptions) => Promise<boolean>
  alert: (options: AlertOptions) => Promise<void>
  prompt: (options: PromptOptions) => Promise<string | null>
  ConfirmDialog: React.FC  // must be rendered in component
}

function useConfirm(): UseConfirmResult
```

**Usage:**
```typescript
function DeleteButton({ userId }: { userId: string }) {
  const { confirm, ConfirmDialog } = useConfirm()

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete User",
      message: "This action cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel"
    })
    if (confirmed) await UserService.delete(userId)
  }

  return (
    <>
      <button onClick={handleDelete}>Delete</button>
      <ConfirmDialog />
    </>
  )
}
```

---

## 5. Stacking Behavior

```typescript
// "layer" — dialogs stack on top of each other
ConfirmKit.setup({ stack: "layer" })
// First dialog stays, second appears on top
// Closing top dialog reveals previous one

// "replace" — new dialog replaces current
ConfirmKit.setup({ stack: "replace" })
// Current dialog dismissed, new dialog appears
```

---

## 6. Keyboard Support

```typescript
ConfirmKit.setup({
  keyboard: {
    confirm: "Enter",    // default
    cancel: "Escape",    // default
    trapFocus: true      // Tab cycles within dialog only
  }
})
```

**Focus trap requirements:**
- On dialog open → focus moves to first focusable element
- Tab/Shift+Tab → cycles through focusable elements within dialog only
- On dialog close → focus returns to previously focused element

---

## 7. Timeout with Countdown

```typescript
// Auto-cancel after 30 seconds with countdown display
const confirmed = await confirm({
  title: "Session Expiring",
  message: "You will be logged out due to inactivity.",
  confirmLabel: "Stay Logged In",
  cancelLabel: "Logout Now",
  timeout: {
    duration: 30000,
    action: "cancel",     // auto-cancel after 30s
    showCountdown: true   // shows "29s remaining" updating each second
  }
})
```

**Countdown display:**
- Updates every second
- Format: `"Xs remaining"` or `"Auto-closing in Xs"`
- When timeout fires → resolves promise with `false` (cancel) or `true` (confirm)

---

## 8. Theme

```typescript
ConfirmKit.setup({ theme: "light" | "dark" | "auto" })

// "auto" → follows system preference via prefers-color-scheme
// Applies CSS custom properties for theming
```

**CSS custom properties (light theme):**
```css
:root {
  --confirm-bg: #ffffff;
  --confirm-text: #1a1a1a;
  --confirm-border: #e5e7eb;
  --confirm-backdrop: rgba(0, 0, 0, 0.5);
  --confirm-btn-confirm-bg: #3b82f6;
  --confirm-btn-cancel-bg: #f3f4f6;
  --confirm-btn-confirm-text: #ffffff;
  --confirm-btn-cancel-text: #374151;
}
```

**Dark theme overrides:**
```css
[data-confirm-theme="dark"] {
  --confirm-bg: #1f2937;
  --confirm-text: #f9fafb;
  /* ... */
}
```

---

## 9. `ConfirmContainer` Component

Root container that renders all active dialogs. Uses React Portal at `document.body`.

```typescript
const ConfirmContainer: React.FC
```

Must be rendered once in app root:
```typescript
function App() {
  return (
    <>
      <Router />
      <ConfirmContainer />
    </>
  )
}
```

---

## 10. Mobile Responsive

Automatically activates when viewport ≤ 768px. No configuration needed.

**Position & Layout:**
```
Desktop → centered modal
Mobile  → bottom sheet (slides up from bottom)
          width: 100vw
          max-height: 85vh
          rounded top corners (border-radius: 16px 16px 0 0)
          drag handle indicator at top (decorative bar)
```

**Size:**
```
Desktop → width: 480px (preset "sm" equivalent)
Mobile  → width: 100vw (full width)
```

**Keyboard avoidance (Prompt dialog):**
- When virtual keyboard appears on mobile → dialog shifts up automatically
- Uses `visualViewport` API to detect keyboard height
- Dialog repositions so input field is always visible above keyboard

```typescript
// Internal implementation
window.visualViewport?.addEventListener("resize", () => {
  const keyboardHeight = window.innerHeight - window.visualViewport.height
  // shift dialog up by keyboardHeight
})
```

**Swipe to dismiss:**
```
Confirm dialog → swipe down > 30% of dialog height → cancel (resolve false)
Alert dialog   → swipe down > 30% of dialog height → dismiss (resolve void)
Prompt dialog  → swipe disabled (user must explicitly confirm/cancel)

Visual feedback:
- Dialog follows finger movement (translateY) during swipe
- Swipe < 30% → snap back with spring animation (0.2s ease-out)
- Swipe > 30% → slide down and out → resolve with cancel value
```

**Stacking on mobile:**
```
Same as desktop — layer stacking supported
Each dialog slides up from bottom, stacked above previous
Backdrop darkens per layer (same as desktop)
```

**Requirements:**
- Use `window.matchMedia("(max-width: 768px)")` with resize listener
- Swipe detection via `touchstart`/`touchmove`/`touchend`
- `preventClose: true` → swipe dismiss disabled
- `backdrop.dismissible: false` → swipe dismiss also disabled
- Keyboard avoidance only applies to `prompt` dialog on mobile
- Viewport resize desktop → mobile → re-render as bottom sheet
- Viewport resize mobile → desktop → re-render as centered modal

## 11. Full Usage Example (README.md)

```typescript
import {
  ConfirmKit, confirm, alert, prompt,
  useConfirm, ConfirmContainer
} from "@alisdev/fe-kit"
import { z } from "zod"

// ── Setup (main.tsx) ──────────────────────────────────────────────

ConfirmKit.setup({
  animation: { in: "zoom", out: "fade", duration: 200 },
  backdrop: { enabled: true, blur: true, dismissible: true },
  keyboard: { confirm: "Enter", cancel: "Escape", trapFocus: true },
  theme: "auto",
  stack: "layer"
})

// ── Root component ────────────────────────────────────────────────

function App() {
  return (
    <>
      <Router />
      <ConfirmContainer />
    </>
  )
}

// ── Imperative confirm ────────────────────────────────────────────

async function handleDelete(id: string) {
  const confirmed = await confirm({
    title: "Delete User",
    message: "Are you sure? This action cannot be undone.",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    animation: { in: "zoom" },
    backdrop: { blur: true }
  })

  if (confirmed) {
    await UserService.delete(id)
    notify.success("User deleted!")
  }
}

// ── Imperative alert ──────────────────────────────────────────────

async function handleSuccess() {
  await alert({
    title: "Success!",
    message: "Your profile has been updated.",
    confirmLabel: "Great!"
  })
  navigate("/profile")
}

// ── Imperative prompt ─────────────────────────────────────────────

async function handleRename() {
  const newName = await prompt({
    title: "Rename File",
    placeholder: "Enter new file name...",
    defaultValue: "document.pdf",
    validation: z.string()
      .min(1, "Name is required")
      .max(100, "Name too long")
      .regex(/^[a-zA-Z0-9._-]+$/, "Invalid characters"),
    confirmLabel: "Rename",
    cancelLabel: "Cancel"
  })

  if (newName) {
    await FileService.rename(fileId, newName)
  }
}

// ── Session timeout ───────────────────────────────────────────────

async function handleSessionWarning() {
  const stayLoggedIn = await confirm({
    title: "Session Expiring",
    message: "Your session will expire due to inactivity.",
    confirmLabel: "Stay Logged In",
    cancelLabel: "Logout",
    timeout: {
      duration: 30000,
      action: "cancel",
      showCountdown: true
    }
  })

  if (!stayLoggedIn) {
    await AuthService.logout()
    navigate("/login")
  } else {
    await AuthService.refreshToken()
  }
}

// ── Stacking dialogs ──────────────────────────────────────────────

async function handleDoubleConfirm() {
  const first = await confirm({ title: "Are you sure?" })
  if (first) {
    const second = await confirm({
      title: "Really sure?",
      message: "This is irreversible."
    })
    if (second) await dangerousAction()
  }
}

// ── Custom component override ─────────────────────────────────────

await confirm({
  title: "Custom Dialog",
  component: (
    <div style={{ padding: 24, textAlign: "center" }}>
      <img src="/warning.svg" width={64} />
      <h2>Custom Warning</h2>
      <p>This uses a fully custom component.</p>
    </div>
  )
})

// ── Hook-based (declarative) ──────────────────────────────────────

function DeleteButton({ userId }: { userId: string }) {
  const { confirm, ConfirmDialog } = useConfirm()

  return (
    <>
      <button onClick={async () => {
        const ok = await confirm({
          title: "Delete?",
          message: "This cannot be undone."
        })
        if (ok) await UserService.delete(userId)
      }}>
        Delete
      </button>
      <ConfirmDialog />
    </>
  )
}
```

---

## Output Requirements

1. Implement all files in `src/` with full TypeScript types
2. Export `ConfirmKit`, `confirm`, `alert`, `prompt`, `useConfirm`, `ConfirmContainer` from `src/index.ts`
3. `ConfirmContainer` renders via React Portal at `document.body`
4. Animations implemented via CSS transitions — no external animation library
5. Focus trap implemented natively — no external focus-trap library
6. Countdown uses `setInterval` cleared on dialog close/timeout
7. Theme CSS variables applied to dialog wrapper element
8. Add inline JSDoc on all public APIs
9. Handle edge cases:
   - `confirm/alert/prompt` called before `ConfirmContainer` mounted → queue dialogs, render when mounted
   - `component` override provided → render custom component, ignore `title`/`message`/`confirmLabel`/`cancelLabel` BUT still handle keyboard + backdrop + timeout
   - `backdrop.dismissible: false` + no cancel button → only keyboard Escape or timeout can dismiss
   - Multiple `ConfirmContainer` → warn in console, only first renders
   - `prompt` validation fails → show Zod error message inside dialog, do NOT close
   - `timeout` fires while user is typing in `prompt` → cancel input, resolve with `null`
   - `ConfirmKit.dismissAll()` → resolves all pending promises with `false` / `null`
   - `useConfirm` called without rendering `<ConfirmDialog />` → warn in console after first use
   - Mobile swipe on `preventClose: true` dialog → swipe disabled, no movement
   - Mobile swipe on `prompt` dialog → touch events ignored on dialog, swipe disabled
   - `visualViewport` not supported → fallback to static position, no keyboard avoidance
   - Viewport resize while dialog open → re-layout without closing dialog
