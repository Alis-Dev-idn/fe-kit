# @alisdev/fe-kit-input

A complete set of styled, accessible input components for React and TypeScript. Part of the `@alisdev/fe-kit` monorepo.

## Features

- 🎨 **Theming**: Support for Light/Dark mode via CSS variables and `InputKit` setup.
- 📐 **Sizing & Variants**: Multiple sizes (sm, md, lg) and variants (outline, filled, underline).
- 🧩 **Form Integration**: Seamless integration with `@alisdev/fe-kit-form` using the `field()` helper.
- ✅ **Validation**: Built-in support for Zod validation on blur/change.
- 🛠️ **Rich Components**: Includes Rich Text Editor (Tiptap), Multi-thumb Slider, Auto-resize TextArea, and more.

---

## Installation

```bash
npm install @alisdev/fe-kit-input
# or
pnpm add @alisdev/fe-kit-input
```

---

## Getting Started

First, initialize the `InputKit` at the root of your application:

```tsx
import { InputKit } from "@alisdev/fe-kit-input";

InputKit.setup({
  theme: "auto",
  size: "md",
  variant: "outline"
});
```

Don't forget to import the styles:

```tsx
import "@alisdev/fe-kit-input/dist/index.css";
```

---

## Components

### 1. TextInput

The main component for text-based inputs.

```tsx
<TextInput
  label="Username"
  placeholder="Enter your username"
  required
  value={username}
  onChange={setUsername}
/>
```

#### TextInput Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `type` | `TextInputType` | `"text"` | Type of input (password, email, number, etc.) |
| `variant` | `InputVariant` | `"outline"` | Visual style |
| `prefixText` | `string` | - | Text prefix (e.g., "Rp") |
| `suffixText` | `string` | - | Text suffix (e.g., ".com") |
| `stepper` | `boolean` | `false` | Show +/- buttons (for type="number") |
| `copyable` | `boolean` | `false` | Show copy to clipboard button |
| `loading` | `boolean` | `false` | Show loading spinner |

### 2. TextArea

Auto-resizing textarea component.

```tsx
<TextArea
  label="Biography"
  autoResize
  minRows={3}
  maxRows={10}
  value={bio}
  onChange={setBio}
/>
```

### 3. Checkbox & CheckboxGroup

```tsx
<Checkbox
  label="I agree to terms"
  checked={agreed}
  onChange={setAgreed}
/>

<CheckboxGroup
  label="Roles"
  options={[
    { label: "Admin", value: "admin" },
    { label: "Editor", value: "editor" }
  ]}
  value={selected}
  onChange={setSelected}
/>
```

### 4. Switch & SwitchGroup

```tsx
<Switch
  label="Enable Notifications"
  checked={enabled}
  onChange={setEnabled}
/>
```

### 5. Slider

Native-based range slider with single and dual thumb support.

```tsx
<Slider
  label="Volume"
  min={0}
  max={100}
  value={volume}
  onChange={setVolume}
  showValue
/>
```

### 6. TextEditor

Rich text editor powered by Tiptap.

```tsx
<TextEditor
  label="Content"
  value={content}
  onChange={setContent}
  toolbar={{
    bold: true,
    italic: true,
    image: true
  }}
/>
```

---

## Data Types

### Shared Types

| Type | Definition | Description |
| :--- | :--- | :--- |
| `InputSize` | `"sm" \| "md" \| "lg"` | Controls padding and font size |
| `InputVariant` | `"outline" \| "filled" \| "underline"` | Visual style of the input container |
| `InputTheme` | `"light" \| "dark" \| "auto"` | Theme of the components |

### Component-Specific Types

| Component | Prop Type | Key Properties |
| :--- | :--- | :--- |
| `TextInput` | `TextInputProps` | `type`, `prefix`, `suffix`, `stepper`, `copyable` |
| `TextArea` | `TextAreaProps` | `autoResize`, `minRows`, `maxRows`, `rows` |
| `Checkbox` | `CheckboxProps` | `checked`, `indeterminate`, `labelPosition` |
| `CheckboxGroup` | `CheckboxGroupProps` | `options`, `value`, `direction` |
| `Switch` | `SwitchProps` | `checked`, `activeColor`, `inactiveColor` |
| `Slider` | `SliderProps` | `min`, `max`, `step`, `range`, `rangeValue`, `formatValue` |
| `TextEditor` | `TextEditorProps` | `value`, `toolbar`, `minHeight`, `onImageUpload` |

---

## Form Integration

Use with `@alisdev/fe-kit-form`:

```tsx
const form = useForm(Schema, { onSubmit });

<TextInput label="Email" {...form.field("email")} />
<Switch label="Active" {...form.field("isActive")} />
```

---

## CSS Variables

You can customize the appearance by overriding these variables in your CSS:

```css
:root {
  --input-bg: #ffffff;
  --input-border: #d1d5db;
  --input-border-focus: #3b82f6;
  --input-accent: #3b82f6;
  --input-error: #ef4444;
}
```
