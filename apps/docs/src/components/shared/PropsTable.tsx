import React from "react";

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

interface PropsTableProps {
  props: PropRow[];
}

export const PropsTable: React.FC<PropsTableProps> = ({ props }) => {
  return (
    <div className="overflow-x-auto my-6 border border-border rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead className="bg-surface-up/50">
          <tr>
            <th className="px-4 py-3 text-xs font-bold text-text-3 uppercase tracking-wider border-b border-border">Prop</th>
            <th className="px-4 py-3 text-xs font-bold text-text-3 uppercase tracking-wider border-b border-border">Type</th>
            <th className="px-4 py-3 text-xs font-bold text-text-3 uppercase tracking-wider border-b border-border">Default</th>
            <th className="px-4 py-3 text-xs font-bold text-text-3 uppercase tracking-wider border-b border-border">Required</th>
            <th className="px-4 py-3 text-xs font-bold text-text-3 uppercase tracking-wider border-b border-border">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {props.map((p) => (
            <tr key={p.name} className="hover:bg-surface-up/30 transition-colors">
              <td className="px-4 py-3 text-sm font-mono text-primary font-medium">
                {p.name}
              </td>
              <td className="px-4 py-3 text-sm font-mono text-text-2">
                {p.type}
              </td>
              <td className="px-4 py-3 text-sm text-text-3 italic">
                {p.default ?? "—"}
              </td>
              <td className="px-4 py-3 text-sm text-text-2">
                {p.required ? (
                  <span className="text-red-400">Yes</span>
                ) : (
                  <span className="text-text-3">No</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-text-2 leading-relaxed">
                {p.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
