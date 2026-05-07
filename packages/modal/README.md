# @alisdev/fe-kit-modal

A multi-layered, dynamic modal stacking system for React. It automatically handles `z-index` layering, backdrop blurring, and focus management when you open modals on top of other modals.

## Features

- 📚 **Unlimited Stacking**: Open a modal from within a modal. The kit automatically tracks depth, applies backdrops only to the top-most layer, and manages keyboard focus.
- 🗄️ **Declarative & Imperative APIs**: Use the standard `<Modal>` component, or trigger modals via the `modal.open()` command from anywhere.
- 🎨 **Sleek OS-level Designs**: Built-in styling options for `macos` and `windows` window controls.
- 🚪 **Focus Trapping**: Automatically traps keyboard focus inside the active modal for accessibility.
- 🎭 **Smooth Transitions**: Coordinated entry and exit animations for both the modal container and the backdrop.

## Installation

```bash
pnpm add @alisdev/fe-kit-modal
```

## Global Setup

You must mount the `ModalStack` at the root of your application. This is the container where imperative modals are injected.

```tsx
import { ModalStack } from "@alisdev/fe-kit-modal";

function App() {
  return (
    <>
      <Router />
      <ModalStack />
    </>
  );
}
```

## 1. Imperative API (Best for Dynamic Content)

The imperative API is highly recommended for forms, detail views, and complex flows because you don't need to bloat your component state with multiple `isOpen` booleans.

```typescript
import { modal } from "@alisdev/fe-kit-modal";
import { UserEditForm } from "./UserEditForm";

function handleEditUser(userId: string) {
  const modalId = modal.open({
    title: "Edit User Profile",
    // You can pass raw strings, or full React components
    content: <UserEditForm userId={userId} onSave={() => modal.close(modalId)} />,
    size: "lg", // "sm" | "md" | "lg" | "full"
    theme: "macos", // "default" | "macos" | "windows"
    closeOnBackdropClick: false // Prevent accidental closures
  });
}
```

### Stacked Modals
You can call `modal.open` from *inside* the `UserEditForm` component. The system will automatically dim the `Edit User Profile` modal and render the new modal on top of it.

```typescript
// Inside UserEditForm.tsx
function handleSelectAvatar() {
  modal.open({
    title: "Select Avatar",
    content: <AvatarPicker />,
    size: "sm"
  });
}
```

## 2. Declarative API (Standard Component)

If you prefer standard React state patterns, the `<Modal>` component offers the exact same features and connects to the same stacking context automatically.

```tsx
import { useState } from "react";
import { Modal } from "@alisdev/fe-kit-modal";

export function ProfileSettings() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Settings</button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Account Settings"
        size="md"
        theme="windows"
      >
        <Modal.Body>
          <p>Update your email, password, and preferences here.</p>
        </Modal.Body>
        
        <Modal.Footer>
          <button className="btn-secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button className="btn-primary" onClick={() => save()}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
```

## API Reference

### `ModalConfig` (for `modal.open`) / `ModalProps`

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string \| ReactNode` | `""` | The header title. |
| `content` | `ReactNode` | - | (Imperative only) The body of the modal. |
| `size` | `"sm" \| "md" \| "lg" \| "full"` | `"md"` | Controls the max-width of the dialog container. |
| `theme` | `"default" \| "macos" \| "windows"` | `"default"` | Stylizes the header and close buttons. |
| `closeOnBackdropClick` | `boolean` | `true` | Allows closing by clicking outside the modal. |
| `closeOnEscape` | `boolean` | `true` | Allows closing via the Escape key. |
| `hideCloseButton` | `boolean` | `false` | Removes the 'X' button from the header. |

### `modal` Utility Methods

- `modal.open(config)`: Opens a new modal and returns a unique string `ID`.
- `modal.close(id)`: Closes a specific modal.
- `modal.closeTop()`: Automatically closes whichever modal is currently at the top of the stack (useful for generic "Cancel" buttons).
- `modal.closeAll()`: Instantly removes all modals from the screen.
