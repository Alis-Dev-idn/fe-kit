# Prompt: `form-kit` — Form Management Library (React + TypeScript)

## Overview

Build the `form` package inside `@alisdev/fe-kit` monorepo. Provides Zod-based form management with validation, field arrays, dirty tracking, watch, and seamless integration with `axios-kit`'s `useApi`.

---

## Package Structure

```
packages/form/
├── src/
│   ├── hooks/
│   │   ├── useForm.ts         # Main form hook
│   │   └── useFieldArray.ts   # Dynamic field array hook
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
    "zod": "^3.x"
  }
}
```

---

## 1. `useForm` Hook

```typescript
type ValidateOn = "submit" | "change" | "blur"

interface UseFormOptions<T> {
  initialValues?: Partial<T>
  validateOn?: ValidateOn          // default: "submit"
  onSubmit: (values: T) => Promise<unknown>
  transform?: {
    beforeSubmit?: (values: T) => unknown    // transform before sending to API
    beforePopulate?: (values: unknown) => Partial<T>  // transform API data before populating form
  }
}

interface FieldError {
  field: string
  message: string
}

interface UseFormResult<T> {
  // State
  values: Partial<T>
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isDirty: boolean
  dirtyFields: Partial<Record<keyof T, boolean>>
  isValid: boolean
  isSubmitting: boolean

  // Handlers
  handleChange: (field: keyof T, value: unknown) => void
  handleBlur: (field: keyof T) => void
  handleSubmit: () => Promise<void>

  // Manual control
  setValue: (field: keyof T, value: unknown) => void
  setError: (field: keyof T, message: string) => void
  reset: (values?: Partial<T>) => void

  // Watch
  watch: <K extends keyof T>(field: K | K[]) => T[K] | Pick<T, K extends K[] ? K[number] : K>
}

function useForm<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  options: UseFormOptions<z.infer<z.ZodObject<T>>>
): UseFormResult<z.infer<z.ZodObject<T>>>
```

---

## 2. Validation Behavior

**`validateOn: "submit"` (default):**
- Validation only runs on `handleSubmit()`
- Errors cleared when user starts typing (`handleChange`)

**`validateOn: "change"`:**
- Validation runs on every `handleChange()`
- Real-time error feedback per field

**`validateOn: "blur"`:**
- Validation runs when field loses focus (`handleBlur()`)
- Error shown after user leaves the field

**Zod error mapping:**
```typescript
// Zod error → field-level errors
{
  errors: {
    firstName: "String must contain at least 1 character(s)",
    email: "Invalid email",
    age: "Expected number, received string"
  }
}
```

---

## 3. Server Error Injection

When `onSubmit` throws an `ApiError` from `axios-kit`, field-level errors from server response are automatically injected:

```typescript
// Server responds with:
// { message: "Validation failed", data: { errors: [{ field: "email", message: "Email already registered" }] } }

// useForm automatically calls:
setError("email", "Email already registered")
```

**Requirements:**
- After successful submit → `reset()` is NOT called automatically (developer decides)
- `isSubmitting` → `true` from submit start until resolve/reject
- If `onSubmit` throws non-ApiError → `setError` with generic message, re-throw

---

## 4. Transform

```typescript
const form = useForm(CreateUserSchema, {
  initialValues: { age: 25 },
  onSubmit: async (values) => UserService.create(values),
  transform: {
    // Modify values before sending to API
    beforeSubmit: (values) => ({
      ...values,
      fullName: `${values.firstName} ${values.lastName}`,
      createdAt: new Date().toISOString()
    }),
    // Transform API response data before populating form (e.g. edit form)
    beforePopulate: (apiData: unknown) => {
      const data = apiData as IUser
      return {
        ...data,
        birthDate: new Date(data.birthDate).toISOString().split("T")[0]
      }
    }
  }
})

// Populate form from API data (triggers beforePopulate)
form.reset(form.transform?.beforePopulate?.(apiUser))
```

---

## 5. `useFieldArray` Hook

Manages dynamic arrays of fields within a form.

```typescript
interface UseFieldArrayResult<T> {
  fields: T[]
  append: (value: T) => void
  prepend: (value: T) => void
  remove: (index: number) => void
  move: (from: number, to: number) => void
  swap: (indexA: number, indexB: number) => void
  update: (index: number, value: T) => void
  replace: (values: T[]) => void
}

function useFieldArray<T, K extends keyof T>(
  form: UseFormResult<T>,
  field: K
): UseFieldArrayResult<T[K] extends Array<infer U> ? U : never>
```

**Example:**
```typescript
const InvoiceSchema = z.object({
  client: z.string(),
  items: z.array(z.object({
    name: z.string(),
    price: z.coerce.number(),
    qty: z.coerce.number()
  }))
})

const form = useForm(InvoiceSchema, {
  initialValues: { items: [{ name: "", price: 0, qty: 1 }] },
  onSubmit: async (values) => InvoiceService.create(values)
})

const { fields, append, remove } = useFieldArray(form, "items")

// In JSX
{fields.map((field, index) => (
  <div key={index}>
    <input
      value={field.name}
      onChange={e => form.setValue(`items.${index}.name`, e.target.value)}
    />
    <button onClick={() => remove(index)}>Remove</button>
  </div>
))}
<button onClick={() => append({ name: "", price: 0, qty: 1 })}>Add Item</button>
```

---

## 6. Watch

```typescript
// Watch single field — returns current value, re-renders on change
const firstName = form.watch("firstName")

// Watch multiple fields
const [firstName, lastName] = form.watch(["firstName", "lastName"])

// Conditional rendering based on watched value
const role = form.watch("role")
{role === "admin" && (
  <input
    value={form.values.adminCode ?? ""}
    onChange={e => form.setValue("adminCode", e.target.value)}
  />
)}
```

---

## 7. Full Usage Example (README.md)

```typescript
import { useForm, useFieldArray } from "@alisdev/fe-kit"
import { z } from "zod"

// ── Schemas ───────────────────────────────────────────────────────

const CreateUserSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Invalid email"),
  age: z.coerce.number().min(18, "Must be 18+"),
  role: z.enum(["user", "admin"]),
  adminCode: z.string().optional(),
})
type ICreateUser = z.infer<typeof CreateUserSchema>

const InvoiceSchema = z.object({
  client: z.string().min(1),
  items: z.array(z.object({
    name: z.string().min(1),
    price: z.coerce.number().min(0),
    qty: z.coerce.number().min(1)
  }))
})

// ── Simple Form ───────────────────────────────────────────────────

export function CreateUserForm() {
  const form = useForm(CreateUserSchema, {
    initialValues: { role: "user" },
    validateOn: "blur",
    onSubmit: async (values) => UserService.create(values),
    transform: {
      beforeSubmit: (values) => ({
        ...values,
        fullName: `${values.firstName} ${values.lastName}`
      })
    }
  })

  const role = form.watch("role")

  return (
    <div>
      <input
        value={form.values.firstName ?? ""}
        onChange={e => form.handleChange("firstName", e.target.value)}
        onBlur={() => form.handleBlur("firstName")}
      />
      {form.errors.firstName && <p>{form.errors.firstName}</p>}

      <select
        value={form.values.role}
        onChange={e => form.handleChange("role", e.target.value)}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      {role === "admin" && (
        <input
          value={form.values.adminCode ?? ""}
          onChange={e => form.handleChange("adminCode", e.target.value)}
        />
      )}

      <button
        onClick={form.handleSubmit}
        disabled={form.isSubmitting || !form.isDirty}
      >
        {form.isSubmitting ? "Saving..." : "Save"}
      </button>
    </div>
  )
}

// ── Field Array Form ──────────────────────────────────────────────

export function InvoiceForm() {
  const form = useForm(InvoiceSchema, {
    initialValues: { items: [{ name: "", price: 0, qty: 1 }] },
    onSubmit: async (values) => InvoiceService.create(values)
  })

  const { fields, append, remove } = useFieldArray(form, "items")

  return (
    <div>
      <input
        value={form.values.client ?? ""}
        onChange={e => form.handleChange("client", e.target.value)}
      />

      {fields.map((field, index) => (
        <div key={index}>
          <input
            value={field.name}
            onChange={e => form.setValue(`items.${index}.name` as any, e.target.value)}
          />
          <input
            type="number"
            value={field.price}
            onChange={e => form.setValue(`items.${index}.price` as any, e.target.value)}
          />
          <button onClick={() => remove(index)}>Remove</button>
        </div>
      ))}

      <button onClick={() => append({ name: "", price: 0, qty: 1 })}>Add Item</button>
      <button onClick={form.handleSubmit} disabled={form.isSubmitting}>Submit</button>
    </div>
  )
}
```

---

## Output Requirements

1. Implement all files in `src/` with full TypeScript types
2. Export everything from `src/index.ts`
3. Zod schema drives all TypeScript types — no manual type duplication
4. `watch()` must trigger re-render only for components watching the changed field
5. `isDirty` computed by deep comparison of `values` vs `initialValues`
6. `dirtyFields` tracks individual field changes
7. Add inline JSDoc on all public APIs
8. Handle edge cases:
   - `validateOn: "change"` with Zod coerce → validate parsed value, not raw string
   - `setValue` with nested path (`items.0.name`) → update nested value correctly
   - `reset()` with no args → revert to `initialValues`
   - `reset(newValues)` → set new initial values and clear errors/touched
   - `onSubmit` ApiError with no field errors → set generic form-level error
   - `watch([])` with empty array → return empty object
