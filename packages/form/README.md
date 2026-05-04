# @alisdev/fe-kit-form

A high-performance, strictly-typed React form management hook powered entirely by Zod. It provides complex validation, dirty state tracking, and nested dynamic field arrays with ease.

## Features

- ✅ **Zod First**: Schema validation is mandatory, ensuring 100% type safety and centralized validation logic.
- ⚡ **Optimized Re-renders**: Internal state is tracked efficiently. `watch` lets you selectively subscribe to specific fields.
- 🔄 **Dynamic Field Arrays**: `useFieldArray` provides complete CRUD operations for array-based form fields (e.g., adding multiple tags or sub-items).
- 🧹 **Dirty Tracking**: `isDirty` and `dirtyFields` automatically track modifications against `defaultValues`.
- 🧬 **Deep Path Support**: Bind to nested object properties effortlessly using dot notation (e.g., `user.address.street`).

## Installation

```bash
pnpm add @alisdev/fe-kit-form zod
```

## Basic Usage (`useForm`)

The core hook manages your entire form state lifecycle.

```tsx
import { useForm } from "@alisdev/fe-kit-form";
import { z } from "zod";

// 1. Define your Zod schema
const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  age: z.coerce.number().min(18, "You must be an adult")
});

type UserFormValues = z.infer<typeof userSchema>;

function RegisterForm() {
  // 2. Initialize the hook
  const { register, handleSubmit, errors, isDirty, reset } = useForm<UserFormValues>({
    schema: userSchema,
    defaultValues: { email: "", password: "", age: 0 }
  });

  // 3. Handle submission (data is fully typed and validated)
  const onSubmit = (data: UserFormValues) => {
    console.log("Validated Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        {/* register() automatically injects name, value, onChange, and onBlur */}
        <input {...register("email")} placeholder="Email" />
        {errors.email && <span className="text-red-500">{errors.email}</span>}
      </div>

      <div>
        <input {...register("password")} type="password" placeholder="Password" />
        {errors.password && <span className="text-red-500">{errors.password}</span>}
      </div>

      <div>
        <input {...register("age")} type="number" placeholder="Age" />
        {errors.age && <span className="text-red-500">{errors.age}</span>}
      </div>
      
      {/* Disable submission if no fields have been modified */}
      <button type="submit" disabled={!isDirty}>Register</button>
      
      <button type="button" onClick={() => reset()}>Reset to Defaults</button>
    </form>
  );
}
```

## Working with Dynamic Arrays (`useFieldArray`)

When you need a list of inputs that users can add to or remove from (like a list of tags or multiple addresses), use `useFieldArray`.

```tsx
import { useForm, useFieldArray } from "@alisdev/fe-kit-form";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  tags: z.array(z.object({
    value: z.string().min(1, "Tag cannot be empty")
  }))
});

function TagEditor() {
  const { control, register, handleSubmit, errors } = useForm({
    schema,
    defaultValues: { title: "", tags: [{ value: "React" }] }
  });

  // Attach the array hook to a specific field path ("tags")
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "tags"
  });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register("title")} placeholder="Post Title" />
      
      <h4>Tags</h4>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 mb-2">
          {/* Note the dot notation for nested array fields */}
          <input {...register(`tags.${index}.value`)} />
          
          <button type="button" onClick={() => remove(index)}>Delete</button>
          
          {index > 0 && (
             <button type="button" onClick={() => swap(index, index - 1)}>Up</button>
          )}
          
          {/* Array specific errors */}
          {errors.tags?.[index]?.value && (
            <span className="text-red-500">{errors.tags[index].value}</span>
          )}
        </div>
      ))}

      <button type="button" onClick={() => append({ value: "" })}>
        Add New Tag
      </button>

      <button type="submit">Submit</button>
    </form>
  );
}
```

## API Reference

### `useForm` Configuration

| Property | Type | Description |
| :--- | :--- | :--- |
| `schema` | `ZodSchema` | Required. The Zod schema defining shape and validation. |
| `defaultValues` | `T` | Required. Initial values for the form. Essential for dirty tracking. |
| `mode` | `"onSubmit" \| "onChange" \| "onBlur"` | When validation triggers. Default is `"onSubmit"`. |

### `useForm` Returns

- `register(path)`: Function to bind inputs. Returns `{ name, value, onChange, onBlur }`.
- `handleSubmit(onValid, onInvalid?)`: Wraps your submit handler.
- `errors`: Object containing current validation error strings mapping to your schema.
- `watch(path?)`: Subscribes to changes. Pass no arguments to watch all, or a specific path.
- `setValue(path, value)`: Programmatically update a field.
- `reset(values?)`: Reverts form to `defaultValues` or new provided values.
- `isDirty`: `boolean`. True if any field differs from `defaultValues`.
- `dirtyFields`: Record tracking which specific paths have been modified.
- `isValid`: `boolean`. True if there are currently no validation errors.

### `useFieldArray` Returns

- `fields`: Array of items. Each item is wrapped with a unique `id` for React rendering keys.
- `append(value)`: Add item to end.
- `prepend(value)`: Add item to beginning.
- `insert(index, value)`: Insert item at specific index.
- `remove(index)`: Remove item.
- `swap(indexA, indexB)`: Exchange two items.
- `move(from, to)`: Move an item to a new position.
- `update(index, value)`: Replace item entirely.
