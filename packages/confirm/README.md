# @alisdev/fe-kit-confirm

An imperative and hook-based dialog system for React. Provides sleek, non-blocking confirmation, alert, and prompt dialogs. It solves the problem of needing to manage complex `isOpen` state for simple user interactions.

## Features

- ⚡ **Imperative API**: Trigger dialogs from anywhere (even outside React components, like inside Redux thunks or Axios interceptors).
- 🪝 **React Hook**: Use `useConfirm` for component-level control.
- ✅ **Zod Validation**: Built-in validation for prompt inputs ensuring users provide the correct data format.
- 🎨 **Modern Design**: Premium aesthetics with smooth animations, focus trapping, and backdrop blurring.
- ⌨️ **Accessibility**: Full support for `Enter` to confirm and `Escape` to cancel.

## Installation

```bash
pnpm add @alisdev/fe-kit-confirm zod
```

## Global Setup

You must mount the `ConfirmContainer` at the very root of your application. This container acts as the portal where all dialogs are rendered.

```tsx
import { ConfirmContainer } from "@alisdev/fe-kit-confirm";

function App() {
  return (
    <>
      <YourApplicationRouter />
      
      {/* Place this at the end of your DOM */}
      <ConfirmContainer />
    </>
  );
}
```

## 1. Using the Imperative API (Recommended)

The imperative API allows you to await user input sequentially without managing any React state.

### Alert Dialog
A simple dialog that requires the user to acknowledge a message.

```typescript
import { alert } from "@alisdev/fe-kit-confirm";

async function handleSave() {
  await saveToServer();
  
  // Execution pauses here until the user clicks "OK"
  await alert({
    title: "Success",
    message: "Your changes have been saved successfully.",
    confirmText: "Got it" // Optional: customize the button text
  });
  
  // Continues after OK
  redirect("/");
}
```

### Confirm Dialog
A dialog that returns a boolean indicating whether the user confirmed or canceled.

```typescript
import { confirm } from "@alisdev/fe-kit-confirm";

async function handleDelete(itemId: string) {
  const isConfirmed = await confirm({
    title: "Delete Item?",
    message: "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText: "Yes, Delete",
    cancelText: "Cancel",
    confirmVariant: "danger" // Styles the confirm button red
  });

  if (isConfirmed) {
    await deleteFromServer(itemId);
  }
}
```

### Prompt Dialog (with Zod)
A dialog that requests text input from the user and validates it before allowing confirmation.

```typescript
import { prompt } from "@alisdev/fe-kit-confirm";
import { z } from "zod";

async function handleRename() {
  const newName = await prompt({
    title: "Rename Project",
    message: "Please enter a new name for your project:",
    placeholder: "e.g., Marketing Campaign Q4",
    defaultValue: "Old Project Name",
    // Zod schema for instant validation
    validation: z.string().min(3, "Name must be at least 3 characters").max(50),
    confirmText: "Rename"
  });

  if (newName !== null) {
    // newName is guaranteed to pass the Zod validation
    await updateName(newName);
  }
}
```

## 2. Using the React Hook

If you prefer to keep your dialog triggers bound to a specific component's lifecycle, you can use the `useConfirm` hook. It provides the exact same API as the imperative functions.

```tsx
import { useConfirm } from "@alisdev/fe-kit-confirm";

export function DeleteAccountButton() {
  const { confirm, alert } = useConfirm();

  const handleClick = async () => {
    const ok = await confirm({
      title: "Delete Account",
      message: "Are you sure? This is permanent.",
      confirmVariant: "danger"
    });

    if (ok) {
      await alert({ title: "Account Deleted" });
    }
  };

  return (
    <button className="bg-red-500 text-white p-2" onClick={handleClick}>
      Delete Account
    </button>
  );
}
```

## API Reference

### Dialog Options Reference

#### Common Options (All Dialogs)
| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | - | The title of the dialog. |
| `message` | `string` | - | The descriptive message body. |
| `confirmText` | `string` | `"OK"` | Text for the primary confirmation button. |

#### Confirm Options (Extends Common)
| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `cancelText` | `string` | `"Cancel"` | Text for the cancel button. |
| `confirmVariant` | `"primary" \| "danger"` | `"primary"` | Color styling for the confirm button. |

#### Prompt Options (Extends Confirm)
| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `defaultValue` | `string` | `""` | Initial value in the text input. |
| `placeholder` | `string` | `""` | Placeholder text for the input. |
| `validation` | `ZodType<string>` | `undefined` | A Zod schema to validate the user's input. The confirm button is disabled until validation passes. |
