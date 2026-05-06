import React from "react";

interface ApiRow {
  name: string;
  type: string;
  description: string;
  default?: string;
}

interface ApiTableProps {
  rows: ApiRow[];
}

export const ApiTable: React.FC<ApiTableProps> = ({ rows }) => {
  return (
    <div className="my-10 overflow-hidden border border-border rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-up border-b border-border">
            <th className="px-4 py-3 text-[10px] font-bold text-text-3 uppercase tracking-widest">Name</th>
            <th className="px-4 py-3 text-[10px] font-bold text-text-3 uppercase tracking-widest">Type</th>
            <th className="px-4 py-3 text-[10px] font-bold text-text-3 uppercase tracking-widest">Default</th>
            <th className="px-4 py-3 text-[10px] font-bold text-text-3 uppercase tracking-widest">Description</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {rows.map((row, idx) => (
            <tr 
              key={row.name} 
              className={`border-b border-border last:border-0 ${idx % 2 === 0 ? 'bg-surface' : 'bg-bg'}`}
            >
              <td className="px-4 py-4 font-mono font-bold text-white">{row.name}</td>
              <td className="px-4 py-4 font-mono text-primary text-xs">{row.type}</td>
              <td className="px-4 py-4 font-mono text-text-3 text-xs">{row.default || "-"}</td>
              <td className="px-4 py-4 text-text-2 leading-relaxed">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
