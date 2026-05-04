# Prompt: `table-kit` — Table Management Library (React + TypeScript)

## Overview

Build the `table` package inside `@alisdev/fe-kit` monorepo. Provides a `useTable` hook with client-side and server-side data support, sorting, filtering, pagination, column visibility, row selection, export, sticky header, and frozen column support.

---

## Package Structure

```
packages/table/
├── src/
│   ├── hooks/
│   │   └── useTable.ts          # Main table hook
│   ├── utils/
│   │   ├── exportCsv.ts         # CSV export utility
│   │   └── exportExcel.ts       # Excel export utility
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
    "react": "^18.x"
  },
  "dependencies": {
    "xlsx": "^0.18.x"
  }
}
```

---

## 1. Types

```typescript
type SortOrder = "asc" | "desc"
type SortBy = "path" | "method"

interface SortConfig {
  key: string
  order: SortOrder
  priority: number    // lower = higher priority (1 = primary sort)
}

interface FilterConfig {
  key: string
  value: unknown
  operator?: "eq" | "like" | "gte" | "lte" | "in"  // default: "eq"
}

interface ColumnDef<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  pinned?: "left" | "right"    // frozen column
  visible?: boolean             // default: true
  render?: (value: unknown, row: T) => React.ReactNode   // custom cell
  actions?: (row: T) => React.ReactNode                  // action cell

  // Mobile card view
  mobilePriority?: number
  // 1-2   → always visible in card
  // 3+    → hidden, visible on card expand
  // unset → default 999 (hidden in card)
  // First column with mobilePriority: 1 → auto becomes card title
  // Column with actions → renders as ⋮ dropdown in top-right of card
}

// Expandable row config
interface ExpandableConfig<T> {
  multiple?: boolean           // allow multiple expanded rows, default: false
  trigger?: "icon" | "row"    // expand trigger, default: "icon"

  // Sync render — data already available in row
  render?: (row: T) => React.ReactNode

  // Async render — fetch on expand, show loading until resolved
  renderAsync?: (row: T) => Promise<React.ReactNode>

  loadingComponent?: React.ReactNode  // default: spinner
  cacheResult?: boolean               // cache async result per row, default: true
}

// PageResult from be-kit shape
interface PageResult<T> {
  content: T[]
  page: number
  size: number
  total: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
}

interface TableParams {
  page: number
  size: number
  sort?: SortConfig[]
  filters?: FilterConfig[]
  search?: string
}
```

---

## 2. `useTable` Hook

```typescript
interface UseTableOptions<T> {
  // Client-side
  data?: T[]

  // Server-side (auto-maps PageResult from be-kit)
  fetchFn?: (params: TableParams) => Promise<PageResult<T>>

  columns: ColumnDef<T>[]

  pagination?: {
    page?: number    // default: 1
    size?: number    // default: 10
  }

  // Loading & empty state overrides
  loadingComponent?: React.ReactNode    // default: skeleton rows
  emptyComponent?: React.ReactNode      // default: "No data available"

  // Row selection
  selection?: boolean    // default: false

  // Expandable rows
  expandable?: ExpandableConfig<T>

  // Mobile breakpoint override
  mobileBreakpoint?: number   // default: 768 (px)
}

interface UseTableResult<T> {
  // Data
  data: T[]
  loading: boolean
  isEmpty: boolean

  // Pagination
  page: number
  size: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  setPage: (page: number) => void
  setSize: (size: number) => void

  // Sort (multi-column with priority)
  sorts: SortConfig[]
  setSort: (sorts: SortConfig[]) => void
  addSort: (key: string, order: SortOrder, priority?: number) => void
  removeSort: (key: string) => void
  clearSort: () => void

  // Filter
  search: string
  setSearch: (value: string) => void
  filters: FilterConfig[]
  setFilter: (key: string, value: unknown, operator?: FilterConfig["operator"]) => void
  removeFilter: (key: string) => void
  clearFilters: () => void

  // Column visibility
  visibleColumns: ColumnDef<T>[]
  toggleColumn: (key: string) => void
  showColumn: (key: string) => void
  hideColumn: (key: string) => void

  // Selection
  selectedRows: T[]
  selectedKeys: string[]
  toggleRow: (row: T) => void
  toggleAll: () => void
  isSelected: (row: T) => boolean
  clearSelection: () => void

  // Export (from hook)
  exportCsv: (filename?: string) => void
  exportExcel: (filename?: string) => void

  // Refresh (server-side only)
  refresh: () => void

  // Expandable
  expandedRows: string[]                    // keys of expanded rows
  toggleExpand: (row: T) => void
  isExpanded: (row: T) => boolean
  collapseAll: () => void

  // Mobile
  isMobile: boolean                         // true if viewport ≤ mobileBreakpoint
}

function useTable<T extends object>(options: UseTableOptions<T>): UseTableResult<T>
```

---

## 3. Client-side vs Server-side

### Client-side:
- All sorting, filtering, pagination done in-memory
- `fetchFn` not provided — uses `data` array directly
- Changing page/sort/filter → recalculates from full dataset
- `total` = `data.length`

### Server-side:
- `fetchFn` provided — all operations delegated to API
- Changing page/sort/filter → calls `fetchFn` with new `TableParams`
- Response is `PageResult<T>` — auto-mapped to table state
- `refresh()` re-calls `fetchFn` with current params

```typescript
// Server-side example
const table = useTable({
  fetchFn: (params) => UserService.findAll(params),
  columns: [...],
  pagination: { page: 1, size: 10 }
})

// fetchFn receives:
// { page: 1, size: 10, sort: [{ key: "createdAt", order: "desc", priority: 1 }], search: "dudi", filters: [...] }
```

---

## 4. Multi-column Sort with Priority

```typescript
// Sort by firstName (primary), then createdAt (secondary)
table.setSort([
  { key: "firstName", order: "asc", priority: 1 },
  { key: "createdAt", order: "desc", priority: 2 }
])

// Add sort (auto-assigns next priority)
table.addSort("email", "asc")

// Remove specific sort
table.removeSort("firstName")

// Clear all sorts
table.clearSort()
```

**Client-side sort resolution:**
- Sorts applied in priority order (1 → 2 → 3...)
- Same value in primary sort → falls through to secondary sort

---

## 5. Sticky Header + Frozen Column

The table component must implement these CSS behaviors:

**Sticky header** (scroll vertical → header stays):
```css
thead {
  position: sticky;
  top: 0;
  z-index: 2;
  background: white;
}
```

**Frozen columns** (`pinned: "left"` or `pinned: "right"`):
```css
/* Left-pinned column */
.pinned-left {
  position: sticky;
  left: 0;        /* calculated per column based on widths */
  z-index: 1;
  background: white;
}

/* Right-pinned column */
.pinned-right {
  position: sticky;
  right: 0;
  z-index: 1;
  background: white;
}
```

**Requirements:**
- `useTable` returns `visibleColumns` with `pinnedLeftOffset` and `pinnedRightOffset` computed values
- Body scroll does not exceed header bounds (horizontal scroll container wraps only tbody)
- Multiple left-pinned columns stack correctly (offset calculated from sum of previous pinned widths)

```typescript
// Extended ColumnDef returned by useTable
interface ResolvedColumnDef<T> extends ColumnDef<T> {
  pinnedOffset?: number   // computed px offset for sticky positioning
}
```

---

## 6. Mobile Responsive — Card View

Automatically activates when viewport ≤ `mobileBreakpoint` (default: 768px).

**Card layout:**
```
┌─────────────────────────────┐
│ Dudi Setiawan           ⋮   │  ← title + actions dropdown
├─────────────────────────────┤
│ Email    d@mail.com         │  ← mobilePriority: 2
│ Age      25                 │
├─────────────────────────────┤
│ ▶ Show more (2 fields)      │  ← expand for priority 3+ fields
└─────────────────────────────┘
```

**Column priority rules:**
- `mobilePriority: 1` → card title (first occurrence) + always visible
- `mobilePriority: 2` → visible in card body
- `mobilePriority: 3+` → hidden, shown on card expand
- `mobilePriority` unset → default 999 (hidden)
- Column with `actions` → renders as `⋮` dropdown in top-right corner of card

**Actions dropdown (⋮):**
- Tap `⋮` → shows dropdown with all action items
- Closes on outside tap or action click

**Requirements:**
- `isMobile` updates on window resize via `matchMedia`
- Card expand is independent per row
- Mobile ignores `pinned`, sticky header (sort via separate controls if needed)
- Selection in mobile → checkbox inside top-left of card

---

## 7. Expandable Rows

Works on both desktop (inline row expansion) and mobile (inside card).

**Desktop expand:**
```
┌───┬────────────┬────────────┬──────────┐
│ ▶ │ Dudi       │ d@mail.com │ [actions]│  ← collapsed
└───┴────────────┴────────────┴──────────┘

┌───┬────────────┬────────────┬──────────┐
│ ▼ │ Dudi       │ d@mail.com │ [actions]│  ← expanded
├───┴────────────┴────────────┴──────────┤
│  Orders:                               │
│  ┌───────┬─────────┬────────────────┐  │
│  │ #001  │ Rp150rb │ Paid           │  │
│  │ #002  │ Rp200rb │ Pending        │  │
│  └───────┴─────────┴────────────────┘  │
└────────────────────────────────────────┘
```

**Mobile expand (inside card):**
```
┌─────────────────────────────┐
│ ▼ Dudi Setiawan         ⋮   │
├─────────────────────────────┤
│ Email    d@mail.com         │
│ Age      25                 │
├─────────────────────────────┤
│ ── Orders ──                │
│ #001 · Rp150rb · Paid       │
│ #002 · Rp200rb · Pending    │
└─────────────────────────────┘
```

**Config:**
```typescript
expandable: {
  multiple?: boolean           // default: false — expanding A collapses B
  trigger?: "icon" | "row"    // default: "icon"

  // Sync
  render?: (row: T) => React.ReactNode

  // Async — fetch on expand, cache result per row
  renderAsync?: (row: T) => Promise<React.ReactNode>
  loadingComponent?: React.ReactNode   // default: spinner
  cacheResult?: boolean                // default: true
}
```

**Requirements:**
- Expanded content full-width below row (desktop) or inside card (mobile)
- `expandedRows` tracks keys of currently expanded rows
- `cacheResult: true` → store resolved ReactNode per row key, skip re-fetch on re-expand
- `trigger: "row"` → entire row/card clickable (pointer cursor)
- Expand icon column auto-added as first column when `expandable` is defined

---

---

## 8. Export Utilities

### From hook (exports current page data):
```typescript
table.exportCsv("users.csv")      // exports table.data (current page)
table.exportExcel("users.xlsx")   // exports table.data (current page)
```

### Standalone helpers (custom data):
```typescript
import { exportCsv, exportExcel } from "@alisdev/fe-kit"

exportCsv(customData, "custom.csv")
exportExcel(customData, "custom.xlsx")
```

**Export requirements:**
- Column labels from `ColumnDef.label` (not `key`)
- Only visible columns exported
- `render` function results are NOT used — raw data values only
- `actions` column excluded from export
- Uses `xlsx` library for Excel export
- CSV uses comma delimiter, UTF-8 BOM for Excel compatibility

---

## 9. Default Loading & Empty Components

```typescript
// Default skeleton (5 rows, matches visible column count)
const DefaultTableSkeleton = ({ columns }: { columns: number }) => (
  <tbody>
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: columns }).map((_, j) => (
          <td key={j}><div className="skeleton-cell" /></td>
        ))}
      </tr>
    ))}
  </tbody>
)

// Default empty state
const DefaultEmptyState = () => (
  <tr><td colSpan={999}>No data available</td></tr>
)
```

---

## 10. Full Usage Example (README.md)

```typescript
import { useTable, exportCsv, exportExcel } from "@alisdev/fe-kit"

// ── Server-side table ─────────────────────────────────────────────

export function UsersTable() {
  const table = useTable<IUser>({
    fetchFn: (params) => UserService.findAll(params),
    columns: [
      { key: "_id", label: "ID", visible: false },
      { key: "firstName", label: "First Name", sortable: true, filterable: true, pinned: "left", width: "150px" },
      { key: "lastName", label: "Last Name", sortable: true },
      { key: "email", label: "Email", filterable: true },
      { key: "age", label: "Age", sortable: true },
      { key: "createdAt", label: "Created At", sortable: true },
      {
        key: "actions",
        label: "Actions",
        pinned: "right",
        width: "120px",
        actions: (row) => (
          <div>
            <button onClick={() => handleEdit(row)}>Edit</button>
            <button onClick={() => handleDelete(row._id)}>Delete</button>
          </div>
        )
      }
    ],
    pagination: { page: 1, size: 10 },
    selection: true,
    emptyComponent: <p>No users found</p>
  })

  return (
    <div>
      {/* Search */}
      <input
        value={table.search}
        onChange={e => table.setSearch(e.target.value)}
        placeholder="Search..."
      />

      {/* Column visibility toggle */}
      {table.visibleColumns.map(col => (
        <label key={String(col.key)}>
          <input
            type="checkbox"
            checked={col.visible !== false}
            onChange={() => table.toggleColumn(String(col.key))}
          />
          {col.label}
        </label>
      ))}

      {/* Export */}
      <button onClick={() => table.exportCsv("users.csv")}>Export CSV</button>
      <button onClick={() => table.exportExcel("users.xlsx")}>Export Excel</button>

      {/* Bulk actions */}
      {table.selectedRows.length > 0 && (
        <button onClick={() => bulkDelete(table.selectedKeys)}>
          Delete {table.selectedRows.length} selected
        </button>
      )}

      {/* Table with sticky header + frozen columns */}
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              {table.selection && (
                <th>
                  <input type="checkbox" onChange={table.toggleAll} />
                </th>
              )}
              {table.visibleColumns.map(col => (
                <th
                  key={String(col.key)}
                  style={{
                    position: col.pinned ? "sticky" : undefined,
                    left: col.pinned === "left" ? col.pinnedOffset : undefined,
                    right: col.pinned === "right" ? col.pinnedOffset : undefined,
                    width: col.width
                  }}
                  onClick={() => col.sortable && table.addSort(String(col.key), "asc")}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {table.loading ? (
            <DefaultTableSkeleton columns={table.visibleColumns.length} />
          ) : table.isEmpty ? (
            <tbody><tr><td colSpan={999}>No users found</td></tr></tbody>
          ) : (
            <tbody>
              {table.data.map((row, i) => (
                <tr key={i}>
                  {table.selection && (
                    <td>
                      <input
                        type="checkbox"
                        checked={table.isSelected(row)}
                        onChange={() => table.toggleRow(row)}
                      />
                    </td>
                  )}
                  {table.visibleColumns.map(col => (
                    <td
                      key={String(col.key)}
                      style={{
                        position: col.pinned ? "sticky" : undefined,
                        left: col.pinned === "left" ? col.pinnedOffset : undefined,
                        right: col.pinned === "right" ? col.pinnedOffset : undefined,
                      }}
                    >
                      {col.actions
                        ? col.actions(row)
                        : col.render
                          ? col.render(row[col.key as keyof IUser], row)
                          : String(row[col.key as keyof IUser] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination */}
      <div>
        <button disabled={!table.hasPrev} onClick={() => table.setPage(table.page - 1)}>Prev</button>
        <span>Page {table.page} of {table.totalPages} ({table.total} total)</span>
        <button disabled={!table.hasNext} onClick={() => table.setPage(table.page + 1)}>Next</button>
        <select value={table.size} onChange={e => table.setSize(Number(e.target.value))}>
          {[10, 25, 50, 100].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  )
}
```

---

## Output Requirements

1. Implement all files in `src/` with full TypeScript types
2. Export `useTable`, `exportCsv`, `exportExcel` from `src/index.ts`
3. Client-side and server-side modes share the same API surface
4. Pinned column offsets auto-calculated from column widths (parse px values)
5. Server-side: debounce search input by 300ms before calling `fetchFn`
6. `isMobile` uses `window.matchMedia` with resize listener — updates reactively
7. Card view auto-derives title from first column with `mobilePriority: 1`
8. Expandable icon column auto-prepended when `expandable` config is provided
9. Add inline JSDoc on all public APIs
10. Handle edge cases:
    - Both `data` and `fetchFn` provided → prefer `fetchFn`, log warning
    - Neither provided → return empty table, log warning
    - `toggleAll` when all selected → deselect all
    - `exportCsv/Excel` with no data → create empty file with headers only
    - Column with no `width` → `pinnedOffset` uses default "100px"
    - `setPage` beyond `totalPages` → clamp to `totalPages`
    - `setSize` change → reset to page 1
    - No column has `mobilePriority` defined → all fields shown in card (no expand needed)
    - `expandable.multiple: false` + expand row A while B expanded → collapse B first
    - `expandable.renderAsync` throws → show error state in expanded area, do not crash
    - `expandable.cacheResult: true` + row data changes → cache invalidated, re-fetch on next expand
    - `trigger: "row"` + `selection: true` → row click expands, checkbox click selects (no conflict)
    - Mobile card with no `actions` column → hide the dot-dot-dot button entirely
