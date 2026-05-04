import { ColumnDef } from "../types";

export function exportCsv<T>(
  data: T[], 
  columns: ColumnDef<T>[], 
  filename: string = "export.csv"
) {
  if (data.length === 0) return;

  const visibleColumns = columns.filter(c => c.visible !== false && !c.actions);
  const headers = visibleColumns.map(c => c.label);
  
  const csvContent = [
    headers.join(","),
    ...data.map(row => visibleColumns.map(col => {
      const val = (row as any)[col.key];
      const stringVal = val === null || val === undefined ? "" : String(val);
      return stringVal.includes(',') ? `"${stringVal}"` : stringVal;
    }).join(","))
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
