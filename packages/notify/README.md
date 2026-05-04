# @alisdev/fe-kit-notify

A high-performance, stacked notification system for React. Supports multiple positions, progress bars, interactive actions, and seamless promise-based toasts.

## Features

- 📍 **6 Positions**: Render notifications in `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, or `bottom-right`.
- ⏳ **Progress Tracking**: Visual progress bar indicating how much time is left before auto-dismissal.
- ⏸️ **Pause on Hover**: Automatically pauses the dismissal timer when the user hovers over the notification.
- 🤝 **Promise Support**: `notify.promise()` automatically handles loading, success, and error states for async operations.
- 🖱️ **Interactive Actions**: Attach buttons and callbacks directly inside the toast.
- 🎨 **Customizable**: Control durations, animations, and max visible counts globally or per-toast.

## Installation

```bash
pnpm add @alisdev/fe-kit-notify
```

## Global Setup

1. Configure the default behavior using `NotifyKit.setup`.
2. Mount `NotifyContainer` at the root of your application.

```tsx
import { NotifyKit, NotifyContainer } from "@alisdev/fe-kit-notify";

// Configure global defaults (Optional)
NotifyKit.setup({
  position: "bottom-right",
  duration: 4000,
  maxVisible: 4,
  pauseOnHover: true,
  animation: {
    in: "slide",
    out: "fade",
    duration: 300
  }
});

function App() {
  return (
    <>
      <Router />
      <NotifyContainer />
    </>
  );
}
```

## Basic Usage

The `notify` object provides methods for different semantic types:

```typescript
import { notify } from "@alisdev/fe-kit-notify";

// Simple success
notify.success("Profile updated successfully!");

// Error with description
notify.error("Failed to connect to the database.");

// Informational
notify.info("A new software update is available.");

// Warning
notify.warning("Your storage is almost full.");

// Custom styling
notify.custom("File uploaded", {
  duration: 2000,
  position: "top-center" // Override global position for this specific toast
});
```

## Advanced Features

### 1. Promise Toasts
Automatically track an asynchronous operation. The toast will show a loading state, then automatically switch to success or error depending on the promise resolution.

```typescript
import { notify } from "@alisdev/fe-kit-notify";

async function handleSaveData() {
  const saveRequest = api.post("/data", myData);

  await notify.promise(saveRequest, {
    loading: "Saving your changes...",
    success: "Data saved successfully!",
    error: (err) => `Failed to save: ${err.message}`
  });
}
```

### 2. Interactive Actions
You can embed an action button directly into the notification.

```typescript
notify.warning("You have unsaved changes.", {
  duration: 0, // 0 means persistent (will not auto-dismiss)
  dismissible: false, // Hides the 'X' button
  action: {
    label: "Save Now",
    onClick: async () => {
      await saveChanges();
      notify.dismissAll(); // Clear notifications programmatically
    }
  }
});
```

### 3. Dismissing Notifications
Notifications auto-dismiss based on duration, but you can control them manually:

```typescript
// Create a toast and get its unique ID
const toastId = notify.info("Uploading file...", { duration: 0 });

// Later...
notify.dismiss(toastId);

// Or clear the entire screen
NotifyKit.dismissAll();
```

## Configuration Options

### `NotifyOptions` (Per-Toast Config)
Passed as the second argument to any `notify.*` method.

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `duration` | `number` | `3000` | Time in ms before auto-dismiss. Set to `0` to make it persistent. |
| `position` | `NotifyPosition` | Global config | Overrides the global position. |
| `dismissible`| `boolean` | `true` | Whether to show the close 'X' button. |
| `action` | `NotifyAction` | `undefined` | `{ label: string, onClick: () => void }` |

### `NotifyKitConfig` (Global Config via `setup`)

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `maxVisible` | `number` | `3` | Maximum number of toasts visible at once. Older ones are queued. |
| `pauseOnHover`| `boolean` | `true` | Pauses the progress bar when the mouse enters the toast. |
| `stack` | `boolean` | `true` | Whether to stack them visually or overlay them. |
