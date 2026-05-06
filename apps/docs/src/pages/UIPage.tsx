import React from "react";
import { 
  Button, 
  Card, 
  CardHeader,
  CardContent,
  Progress, 
  Badge, 
  Skeleton, 
  Tooltip,
  Dropdown,
  Stack,
  Divider
} from "@alisdev/fe-kit-ui";
import { KitBadge } from "../components/shared/KitBadge";
import { InstallBlock } from "../components/shared/InstallBlock";
import { DemoArea } from "../components/shared/DemoArea";
import { ApiTable } from "../components/shared/ApiTable";
import { TabbedCode } from "../components/shared/TabbedCode";
import { Callout } from "../components/shared/Callout";

export const UIPage: React.FC = () => {
  return (
    <div className="pb-20">
      <section className="mb-16">
        <KitBadge category="UI & Overlay" />
        <h1 className="text-4xl font-bold mb-4">UI Kit</h1>
        <p className="text-text-2 text-lg leading-relaxed mb-6 max-w-3xl">
          Clean, accessible, and themeable UI primitives. 
          Includes advanced overlays like Popovers and Dropdowns.
        </p>
        <InstallBlock packageName="@alisdev/fe-kit-ui" />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Live Demo</h2>
        <DemoArea>
          <div className="space-y-12">
            {/* Buttons & Badges */}
            <section className="space-y-4 text-center">
              <h3 className="text-xs font-bold text-text-3 uppercase tracking-widest mb-6">Buttons & Badges</h3>
              <Stack direction="row" gap="1rem" justify="center" align="center" responsive>
                <Button variant="primary">Primary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="primary" loading={true}>Loading</Button>
              </Stack>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <Badge variant="success">Active</Badge>
                <Badge variant="warning">Pending</Badge>
                <Badge variant="danger">Failed</Badge>
                <Badge variant="default">Default</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </section>

            <Divider />

            {/* Cards & Progress */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader title="System Usage" action={<Badge variant="success">Live</Badge>} />
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-text-2">CPU Utilization</span>
                      <span className="text-white font-bold">42%</span>
                    </div>
                    <Progress value={42} color="var(--primary)" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-text-2">Memory</span>
                      <span className="text-white font-bold">85%</span>
                    </div>
                    <Progress value={85} color="var(--danger)" />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                 <h3 className="text-xs font-bold text-text-3 uppercase tracking-widest">Skeletons</h3>
                 <div className="space-y-3">
                   <Skeleton height="1.5rem" className="w-3/4" />
                   <Skeleton height="1rem" className="w-full" />
                   <Skeleton height="1rem" className="w-5/6" />
                   <div className="flex gap-4 mt-6">
                     <Skeleton width="48px" height="48px" circle />
                     <div className="flex-1 space-y-2 pt-1">
                       <Skeleton height="1rem" className="w-1/2" />
                       <Skeleton height="1rem" className="w-1/3" />
                     </div>
                   </div>
                 </div>
              </div>
            </section>

            <Divider />

            {/* Overlays */}
            <section className="flex flex-wrap items-center justify-center gap-8 py-4">
               <Tooltip content="Tooltip message">
                 <span className="text-primary underline cursor-help decoration-dashed underline-offset-4">Hover for Tooltip</span>
               </Tooltip>

               <Dropdown 
                 trigger={<Button variant="ghost">Open Dropdown</Button>}
                 items={[
                   { label: "Profile", onClick: () => {} },
                   { 
                     label: "Settings", 
                     children: [
                       { label: "Account", onClick: () => {} },
                       { label: "Privacy", onClick: () => {} }
                     ] 
                   },
                   { label: "Logout", onClick: () => {}, className: "text-danger" },
                 ]}
               />
            </section>
          </div>
        </DemoArea>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">API Reference</h2>
        <ApiTable 
          rows={[
            { name: "Button", type: "Component", description: "Standard button with variants: primary, secondary, outline, ghost, danger." },
            { name: "Popover", type: "Component", description: "Responsive overlay: popover on desktop, bottom sheet on mobile." },
            { name: "Stack", type: "Component", description: "Flexbox wrapper for gap and responsive layout management." },
            { name: "Progress", type: "Component", description: "Progress bar with custom color support." },
            { name: "Skeleton", type: "Component", description: "Loading placeholders with 'circle' support." },
            { name: "Divider", type: "Component", description: "Horizontal/Vertical separators." },
          ]}
        />
      </section>
    </div>
  );
};
