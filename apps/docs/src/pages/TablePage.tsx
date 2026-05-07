import React from "react";
import { Table, ColumnDef } from "@alisdev/fe-kit-table";
import { KitBadge } from "../components/shared/KitBadge";
import { InstallBlock } from "../components/shared/InstallBlock";
import { DemoArea } from "../components/shared/DemoArea";
import { ApiTable } from "../components/shared/ApiTable";
import { TabbedCode } from "../components/shared/TabbedCode";
import { Callout } from "../components/shared/Callout";
import { Badge } from "@alisdev/fe-kit-ui";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "ACTIVE" | "INACTIVE" | "BANNED";
}

const mockData: UserData[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "ACTIVE" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "ACTIVE" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "INACTIVE" },
  { id: 4, name: "David Miller", email: "david@example.com", role: "Editor", status: "BANNED" },
  { id: 5, name: "Eve Wilson", email: "eve@example.com", role: "Viewer", status: "ACTIVE" },
];

export const TablePage: React.FC = () => {
  const columns: ColumnDef<UserData>[] = [
    { 
      key: "id", 
      label: "ID", 
      width: "60px",
      sortable: true 
    },
    { 
      key: "name", 
      label: "Name", 
      sortable: true,
      pinned: "left",
      width: "180px",
      mobilePriority: 1
    },
    { 
      key: "email", 
      label: "Email",
      mobilePriority: 2
    },
    { 
      key: "role", 
      label: "Role",
      width: "120px"
    },
    { 
      key: "status", 
      label: "Status",
      width: "100px",
      render: (val: string) => {
        const variant = val === "ACTIVE" ? "success" : val === "BANNED" ? "danger" : "default";
        return <Badge variant={variant as any}>{val}</Badge>;
      }
    },
    {
      key: "actions",
      label: "Actions",
      pinned: "right",
      width: "100px",
      actions: (row: UserData) => (
        <div className="flex gap-2">
          <button className="text-text-3 hover:text-primary transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button className="text-text-3 hover:text-danger transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="pb-20">
      <section className="mb-16">
        <KitBadge category="Display" />
        <h1 className="text-4xl font-bold mb-4">Table Kit</h1>
        <p className="text-text-2 text-lg leading-relaxed mb-6 max-w-3xl">
          High-performance table with hybrid data model. Supports pinned columns, 
          mobile card view, and server-side processing out of the box.
        </p>
        <InstallBlock packageName="@alisdev/fe-kit-table" />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Live Demo</h2>
        <DemoArea>
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <Table<UserData>
              data={mockData}
              columns={columns}
              selection={true}
              showPagination={true}
              showColumnToggle={true}
              pagination={{ size: 10 }}
            />
          </div>
        </DemoArea>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Callout type="info" title="Hybrid Model">
            Pass <code>data</code> for client-side mode or <code>fetchFn</code> for server-side mode. 
            The hook handles all the complexity of state management for you.
          </Callout>
          <Callout type="info" title="Mobile Friendly">
            Table automatically switches to a Card View on small screens. 
            Use <code>mobilePriority</code> to control field visibility.
          </Callout>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">API Reference</h2>
        <ApiTable 
          rows={[
            { name: "ColumnDef.pinned", type: "'left' | 'right'", description: "Freezes column during horizontal scroll." },
            { name: "ColumnDef.actions", type: "Function", description: "Special render for actions (ignored in exports)." },
            { name: "fetchFn", type: "Function", description: "Async function for server-side processing." },
            { name: "selection", type: "boolean", description: "Enables row selection checkboxes." },
            { name: "ExpandableConfig", type: "Object", description: "Settings for nested row content." },
          ]}
        />
      </section>
    </div>
  );
};
