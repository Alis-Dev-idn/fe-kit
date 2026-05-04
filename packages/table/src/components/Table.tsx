import React, { ReactElement, useState, useEffect } from "react";
import { UseTableOptions, UseTableResult } from "../types";
import { useTable } from "../hooks/useTable";
import { TableSkeleton, TableEmpty } from "./TableStates";
import { MobileCard } from "./MobileCard";
import "./table.css";

export interface TableProps<T extends object> extends UseTableOptions<T> {
  showPagination?: boolean;
  showColumnToggle?: boolean;
  showExport?: boolean;
  exportFormats?: ("csv" | "excel")[];
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T) => string);
  cellClassName?: string;
  mobileCardClassName?: string;
  paginationClassName?: string;
  columnToggleClassName?: string;
  exportClassName?: string;
}

export const Table = <T extends object>(props: TableProps<T>) => {
  const table = useTable(props);
  const {
    showPagination = true,
    showColumnToggle = false,
    showExport = false,
    className = "",
    headerClassName = "",
    rowClassName = "",
    cellClassName = "",
    mobileCardClassName = "",
  } = props;

  if (table.isMobile) {
    return (
      <div className={`table-mobile-view ${className}`}>
        {table.loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : table.isEmpty ? (
          <div className="p-8 text-center text-slate-500">No data available</div>
        ) : (
          table.data.map((row, i) => (
            <MobileCard
              key={i}
              row={row}
              columns={table.visibleColumns}
              selection={props.selection}
              isSelected={table.isSelected(row)}
              onToggleRow={() => table.toggleRow(row)}
              isExpanded={table.isExpanded(row)}
              onToggleExpand={() => table.toggleExpand(row)}
              className={mobileCardClassName}
            />
          ))
        )}
        {showPagination && <TablePagination table={table} className={props.paginationClassName} />}
      </div>
    );
  }

  const getRowClass = (row: T) => {
    if (typeof rowClassName === "function") return rowClassName(row);
    return rowClassName;
  };

  return (
    <div className={`table-root ${className}`}>
      <div className="table-header-toolbar">
        {showColumnToggle && <TableColumnToggle table={table} className={props.columnToggleClassName} />}
        {showExport && <TableExportButton table={table} className={props.exportClassName} />}
      </div>

      <div className="table-scroll-container">
        <table className="table-element">
          <thead className={`table-thead ${headerClassName}`}>
            <tr>
              {props.selection && (
                <th className="table-th selection-cell sticky-col" style={{ left: 0, zIndex: 10 }}>
                  <input type="checkbox" onChange={table.toggleAll} checked={table.selectedRows.length === table.data.length && table.data.length > 0} />
                </th>
              )}
              {table.visibleColumns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`table-th ${col.pinned ? "sticky-col" : ""} ${col.sortable ? "sortable-header" : ""}`}
                  style={{
                    position: col.pinned ? "sticky" : undefined,
                    left: col.pinned === "left" ? col.pinnedOffset : undefined,
                    right: col.pinned === "right" ? col.pinnedOffset : undefined,
                    width: col.width,
                    zIndex: col.pinned ? 5 : 1
                  }}
                  onClick={() => col.sortable && table.addSort(String(col.key), "asc")}
                >
                  <div className="th-content">
                    {col.label}
                    {col.sortable && (
                      <span className="sort-indicator">
                        {table.sorts.find(s => s.key === col.key)?.order === "asc" ? " ↑" : 
                         table.sorts.find(s => s.key === col.key)?.order === "desc" ? " ↓" : ""}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {table.loading ? (
            <TableSkeleton columns={table.visibleColumns.length + (props.selection ? 1 : 0)} />
          ) : table.isEmpty ? (
            <TableEmpty colSpan={table.visibleColumns.length + (props.selection ? 1 : 0)} />
          ) : (
            <tbody className="table-tbody">
              {table.data.map((row, i) => {
                const isExpanded = table.isExpanded(row);
                return (
                  <React.Fragment key={i}>
                    <tr className={`table-tr ${getRowClass(row)}`}>
                      {props.selection && (
                        <td className="table-td selection-cell sticky-col" style={{ left: 0, zIndex: 4 }}>
                          <input type="checkbox" checked={table.isSelected(row)} onChange={() => table.toggleRow(row)} />
                        </td>
                      )}
                      {table.visibleColumns.map((col) => (
                        <td
                          key={String(col.key)}
                          className={`table-td ${col.pinned ? "sticky-col" : ""}`}
                          style={{
                            position: col.pinned ? "sticky" : undefined,
                            left: col.pinned === "left" ? col.pinnedOffset : undefined,
                            right: col.pinned === "right" ? col.pinnedOffset : undefined,
                            zIndex: col.pinned ? 3 : 1
                          }}
                        >
                          {col.actions ? (
                            col.actions(row)
                          ) : col.render ? (
                            col.render((row as any)[col.key], row)
                          ) : (
                            String((row as any)[col.key] ?? "")
                          )}
                        </td>
                      ))}
                    </tr>
                    {isExpanded && (
                      <tr className="table-expanded-row">
                        <td colSpan={table.visibleColumns.length + (props.selection ? 1 : 0)} className="p-0">
                          <div className="expanded-content-wrapper">
                            {props.expandable?.render && props.expandable.render(row)}
                            {props.expandable?.renderAsync && <AsyncExpandedContent row={row} renderAsync={props.expandable.renderAsync} loadingComponent={props.expandable.loadingComponent} />}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      {showPagination && <TablePagination table={table} className={props.paginationClassName} />}
    </div>
  );
};

// --- Sub-components ---

export const TablePagination: React.FC<{ table: UseTableResult<any>; className?: string; pageSizeOptions?: number[] }> = ({
  table,
  className = "",
  pageSizeOptions = [10, 25, 50, 100],
}) => (
  <div className={`table-pagination ${className}`}>
    <div className="pagination-info">
      Page {table.page} of {table.totalPages} ({table.total} total)
    </div>
    <div className="pagination-controls">
      <button disabled={!table.hasPrev} onClick={() => table.setPage(table.page - 1)} className="pagination-btn">
        Prev
      </button>
      <button disabled={!table.hasNext} onClick={() => table.setPage(table.page + 1)} className="pagination-btn">
        Next
      </button>
      <select value={table.size} onChange={(e) => table.setSize(Number(e.target.value))} className="pagination-select">
        {pageSizeOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export const TableColumnToggle: React.FC<{ table: UseTableResult<any>; className?: string; label?: string }> = ({
  table,
  className = "",
  label = "Columns",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`column-toggle ${className}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="toggle-btn">
        {label}
      </button>
      {isOpen && (
        <div className="toggle-dropdown">
          {table.visibleColumns.map((col) => (
            <label key={String(col.key)} className="toggle-item">
              <input type="checkbox" checked={col.visible !== false} onChange={() => table.toggleColumn(String(col.key))} />
              {col.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export const TableExportButton: React.FC<{ table: UseTableResult<any>; formats?: ("csv" | "excel")[]; className?: string; label?: string }> = ({
  table,
  formats = ["csv", "excel"],
  className = "",
  label = "Export",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`export-button ${className}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="export-btn">
        {label}
      </button>
      {isOpen && (
        <div className="export-dropdown">
          {formats.includes("csv") && (
            <button onClick={() => { table.exportCsv(); setIsOpen(false); }} className="dropdown-item">CSV</button>
          )}
          {formats.includes("excel") && (
            <button onClick={() => { table.exportExcel(); setIsOpen(false); }} className="dropdown-item">Excel</button>
          )}
        </div>
      )}
    </div>
  );
};

// --- Utils ---

const AsyncExpandedContent: React.FC<{ row: any; renderAsync: (row: any) => Promise<React.ReactNode>; loadingComponent?: React.ReactNode }> = ({
  row,
  renderAsync,
  loadingComponent,
}) => {
  const [content, setContent] = useState<React.ReactNode>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    renderAsync(row).then((res) => {
      setContent(res);
      setLoading(false);
    });
  }, [row, renderAsync]);

  if (loading) return <>{loadingComponent || <div>Loading details...</div>}</>;
  return <>{content}</>;
};

// Attach sub-components to Table
(Table as any).Pagination = TablePagination;
(Table as any).ColumnToggle = TableColumnToggle;
(Table as any).ExportButton = TableExportButton;
