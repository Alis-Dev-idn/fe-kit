# @alisdev/fe-kit-ui

Modern UI Primitives & Overlay System for React and TypeScript. Part of the `@alisdev/fe-kit` monorepo.

## Features

- ✨ **Modern Primitives**: Buttons, Cards, Badges, and more.
- 📱 **Responsive Overlays**: Popovers transform into Bottom Sheets on mobile.
- 🎈 **Overlay System**: Powered by `@floating-ui/react` for precise positioning.
- 🎨 **Theming**: Full CSS variables support for light/dark modes.
- ⚡ **Lightweight**: Optimized for performance and minimal bundle size.

---

## Installation

```bash
pnpm add @alisdev/fe-kit-ui
```

---

## Getting Started

Initialize the `UIkit` at the root of your application:

```tsx
import { UIkit } from "@alisdev/fe-kit-ui";

UIkit.setup({
  theme: "auto",
  radius: "0.75rem"
});
```

Import the styles:

```tsx
import "@alisdev/fe-kit-ui/dist/index.css";
```

---

## Components

### Button
Highly customizable buttons with loading states and icons.

```tsx
<Button variant="primary" loading={isLoading}>
  Click Me
</Button>
```

### Card
Elegant card primitives with header, content, and footer.

```tsx
<Card hoverable>
  <CardHeader title="Dashboard" action={<Button size="sm">Edit</Button>} />
  <CardContent>Content here...</CardContent>
</Card>
```

### Popover (Responsive)
Floating panel on desktop, bottom sheet on mobile.

```tsx
<Popover 
  trigger={<Button>Open Popover</Button>}
  title="Settings"
>
  <div className="p-4">Settings content...</div>
</Popover>
```

### Stack
Flexible flexbox wrapper for consistent spacing.

```tsx
<Stack direction="row" gap="1rem" responsive>
  <Button>A</Button>
  <Button>B</Button>
</Stack>
```

### Progress
A clean progress bar.

```tsx
<Progress value={70} color="var(--ui-success)" />
```

### Badge
Small status indicators.

```tsx
<Badge variant="success">Active</Badge>
```

### Skeleton
Animated loading placeholders.

```tsx
<Skeleton height="2rem" />
<Skeleton width="40px" height="40px" circle />
```

### Divider
Horizontal or vertical line separator.

```tsx
<Divider />
<Divider vertical className="h-8" />
```

### Tooltip
Information displayed on hover.

```tsx
<Tooltip content="Save your changes">
  <Button>Save</Button>
</Tooltip>
```

### Dropdown
Nested dropdown menus powered by Floating UI.

```tsx
<Dropdown
  trigger={<Button>Menu</Button>}
  items={[
    { label: "Profile", onClick: () => alert("Profile") },
    { 
      label: "Settings", 
      children: [{ label: "Account" }, { label: "Security" }] 
    }
  ]}
/>
```

### useOverlay (Hook)
A helpful hook to manage overlay states (open/close, ESC to close).

```tsx
const { isOpen, open, close, toggle } = useOverlay({ closeOnEsc: true });
```

---

## Data Types

### Shared Types
| Type | Definition | Description |
| :--- | :--- | :--- |
| `UITheme` | `"light" \| "dark" \| "auto"` | Theme mode |
| `Placement` | `Floating UI Placements` | Overlay positioning |

### Component Props
| Component | Key Props |
| :--- | :--- |
| `Button` | `variant`, `size`, `loading`, `fullWidth`, `leftIcon`, `rightIcon` |
| `Card` | `padding`, `hoverable` |
| `Stack` | `direction`, `gap`, `align`, `justify`, `responsive` |
| `Popover` | `trigger`, `title`, `placement`, `responsive` |
| `Dropdown` | `trigger`, `items` (supports nested children) |

---

## Customization
Override global variables in your CSS:

```css
:root {
  --ui-primary: #6366f1;
  --ui-radius: 1rem;
}
```
