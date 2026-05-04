# @alisdev/fe-kit-table (V2)

A comprehensive, highly scalable table management library for React. It seamlessly switches between fully client-side and fully server-side operations while providing a rich, responsive UI component out of the box.

## Features

- 🔄 **Hybrid Data Model**: Pass an array to handle everything in memory, or pass a `fetchFn` to delegate pagination, sorting, and filtering to your API.
- 📌 **Frozen Columns**: Pin columns to the `left` or `right` side of the table with auto-calculated sticky CSS offsets.
- 📏 **Sticky Header**: Keep column headers visible while scrolling through hundreds of rows.
- 📱 **Mobile Card View**: Automatically detects viewports. Under `768px` (configurable), rows transform into vertical cards with expandable hidden fields and dropdown actions.
- ✅ **Selection System**: Built-in tracking for single row and bulk selections.
- 👁️ **Column Visibility**: Programmatically toggle columns, with an out-of-the-box dropdown UI provided by `Table.ColumnToggle`.
- ➕ **Expandable Rows**: Support nested content below rows. Includes `renderAsync` for fetching details only when a row is expanded.
- 📥 **Export**: Built-in CSV and Excel export. Automatically respects column visibility and ignores custom React render functions in favor of raw data.

## Installation

```bash
pnpm add @alisdev/fe-kit-table xlsx
```

## Basic Usage (`<Table />` Component)

The compound `Table` component wraps the `useTable` hook and provides a styled, ready-to-use interface.

```tsx
import { Table, ColumnDef } from "@alisdev/fe-kit-table";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
  { 
    key: "name", 
    label: "Name", 
    sortable: true, 
    pinned: "left", // Stays visible when scrolling right
    width: "200px", 
    mobilePriority: 1 // Acts as the title in Mobile Card view
  },
  { 
    key: "email", 
    label: "Email", 
    filterable: true,
    mobilePriority: 2 // Always visible in Mobile Card body
  },
  { 
    key: "role", 
    label: "Role",
    render: (val) => <span className="badge">{val}</span>
  },
  { 
    key: "actions", 
    label: "Actions", 
    pinned: "right",
    actions: (row) => <button onClick={() => editUser(row.id)}>Edit</button>
  }
];

export function UsersPage() {
  return (
    <Table<User>
      // Automatically triggers server-side mode
      fetchFn={async (params) => {
        // params = { page: 1, size: 10, search: "", sort: [], filters: [] }
        const res = await fetch(`/api/users?${new URLSearchParams(params as any)}`);
        const json = await res.json();
        // Return PageResult shape
        return {
          content: json.data,
          total: json.totalElements,
          page: json.number,
          size: json.size,
          totalPages: json.totalPages,
          hasNext: !json.last,
          hasPrev: !json.first
        };
      }}
      columns={columns}
      pagination={{ size: 20 }}
      selection={true} // Enables checkbox column
      showPagination={true}
      showColumnToggle={true}
      showExport={true}
      exportFormats={["csv", "excel"]}
    />
  );
}
```

## Advanced Customization (`useTable` Hook)

If you need a completely bespoke UI layout, bypass the `<Table />` component and use the `useTable` hook directly.

```tsx
import { useTable, Table } from "@alisdev/fe-kit-table";

export function CustomDashboardTable({ localData }) {
  const table = useTable({
    data: localData, // Triggers Client-Side mode
    columns: myColumns,
  });

  return (
    <div className="custom-wrapper">
      {/* Custom Toolbar */}
      <div className="toolbar">
        <input 
          placeholder="Global Search..." 
          value={table.search} 
          onChange={e => table.setSearch(e.target.value)} 
        />
        <span>{table.selectedRows.length} items selected</span>
        
        {/* You can still use the sub-components manually! */}
        <Table.ColumnToggle table={table} />
        <Table.ExportButton table={table} />
      </div>

      {/* Manual Table Render */}
      <div className="scroll-area">
        <table>
          <thead>
            <tr>
              {table.visibleColumns.map(col => (
                <th 
                   key={col.key as string}
                   onClick={() => col.sortable && table.addSort(col.key as string, "asc")}
                >
                  {col.label} 
                  {table.sorts.find(s => s.key === col.key)?.order === 'asc' ? '↑' : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
             {/* Render logic... */}
          </tbody>
        </table>
      </div>
      
      <Table.Pagination table={table} />
    </div>
  );
}
```

## Core Data Structures

### `ColumnDef<T>`

Defines how a specific column behaves in desktop, mobile, and export scenarios.

| Property | Type | Description |
| :--- | :--- | :--- |
| `key` | `keyof T \| string` | The property name in your data object. |
| `label` | `string` | The text rendered in the header `<th>` and export CSV headers. |
| `sortable` | `boolean` | Enables click-to-sort logic. |
| `filterable` | `boolean` | Flags column for filter UI usage. |
| `width` | `string` | e.g. `"150px"`. Strongly recommended for `pinned` columns. |
| `pinned` | `"left" \| "right"` | Freezes the column during horizontal scroll. |
| `visible` | `boolean` | If false, column starts hidden. |
| `render` | `(val, row) => ReactNode` | Custom JSX to render inside the cell. |
| `actions` | `(row) => ReactNode` | Special render for action buttons (ignored in CSV exports, renders as dropdown in mobile). |
| `mobilePriority`| `number` | `1` = Card Title, `2` = Visible in body, `3+` = Hidden inside "Show More" accordion. |

### `ExpandableConfig<T>`

Configures the behavior for nested rows.

| Property | Type | Description |
| :--- | :--- | :--- |
| `multiple` | `boolean` | If true, expanding row B does not collapse row A. |
| `render` | `(row) => ReactNode` | Synchronous render for the expanded area. |
| `renderAsync`| `(row) => Promise<ReactNode>` | Fetches data when expanded. Displays `loadingComponent` while resolving. |
| `cacheResult`| `boolean` | If true, `renderAsync` is only fired the first time a row is expanded. |

### Server-Side Params (`TableParams`)

When `fetchFn` is triggered, it receives this object. You map this to your backend's API format.

```typescript
interface TableParams {
  page: number; // 1-indexed
  size: number;
  search?: string;
  sort?: { key: string; order: "asc" | "desc"; priority: number }[];
  filters?: { key: string; value: unknown; operator?: "eq" | "like" | "gte" | "lte" | "in" }[];
}
```
