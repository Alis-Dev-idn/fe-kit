import React from "react";

export const TableSkeleton: React.FC<{ columns: number; rows?: number }> = ({ 
  columns, 
  rows = 5 
}) => (
  <tbody>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: columns }).map((_, j) => (
          <td key={j} className="px-4 py-3">
            <div className="table-skeleton-cell" style={{ height: "20px", background: "#f1f5f9", borderRadius: "4px", width: "100%" }} />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

export const TableEmpty: React.FC<{ colSpan: number; message?: string }> = ({ 
  colSpan, 
  message = "No data available" 
}) => (
  <tbody>
    <tr>
      <td colSpan={colSpan} className="px-4 py-8 text-center text-slate-500">
        {message}
      </td>
    </tr>
  </tbody>
);
