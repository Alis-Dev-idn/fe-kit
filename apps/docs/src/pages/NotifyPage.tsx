import React from "react";
import { notify, NotifyPosition, NotifyType } from "@alisdev/fe-kit-notify";
import { KitBadge } from "../components/shared/KitBadge";
import { InstallBlock } from "../components/shared/InstallBlock";
import { DemoArea } from "../components/shared/DemoArea";
import { ApiTable } from "../components/shared/ApiTable";
import { TabbedCode } from "../components/shared/TabbedCode";
import { Callout } from "../components/shared/Callout";

export const NotifyPage: React.FC = () => {
  const [customTitle, setCustomTitle] = React.useState("Custom Notification");
  const [customMessage, setCustomMessage] = React.useState("This is a custom message fired from the demo.");
  const [position, setPosition] = React.useState<NotifyPosition>("top-right");
  const [duration, setDuration] = React.useState(3000);
  const [count, setCount] = React.useState(0);

  const fire = (type: NotifyType) => {
    notify[type](`${customTitle}: ${customMessage}`, { position, duration });
    setCount(prev => prev + 1);
  };

  const firePreset = (type: NotifyType, title: string, message: string) => {
    notify[type](`${title}: ${message}`, { position, duration });
    setCount(prev => prev + 1);
  };

  return (
    <div className="pb-20">
      {/* SECTION 1 — KIT HEADER */}
      <section className="mb-16">
        <KitBadge category="UI & Overlay" />
        <h1 className="text-4xl font-bold mb-4">Notify Kit</h1>
        <p className="text-text-2 text-lg leading-relaxed mb-6 max-w-3xl">
          A high-performance, lightweight notification system for React. Supports stacking, 
          multiple positions, progress bars, and imperative calls from anywhere in your app.
        </p>
        <InstallBlock packageName="@alisdev/fe-kit-notify" />
      </section>

      {/* SECTION 2 — LIVE INTERACTIVE DEMO */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Live Demo</h2>
        <DemoArea>
          <div className="space-y-10">
            {/* Preset Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => firePreset("success", "Success!", "Operation completed successfully.")}
                className="px-6 py-2 bg-success text-white rounded-lg font-medium hover:brightness-110 transition-all shadow-lg shadow-success/20"
              >
                Success
              </button>
              <button 
                onClick={() => firePreset("error", "Error!", "Something went wrong.")}
                className="px-6 py-2 bg-danger text-white rounded-lg font-medium hover:brightness-110 transition-all shadow-lg shadow-danger/20"
              >
                Error
              </button>
              <button 
                onClick={() => firePreset("warning", "Warning!", "Please check your input.")}
                className="px-6 py-2 bg-warning text-white rounded-lg font-medium hover:brightness-110 transition-all shadow-lg shadow-warning/20"
              >
                Warning
              </button>
              <button 
                onClick={() => firePreset("info", "Information", "New updates are available.")}
                className="px-6 py-2 bg-[#4ea8de] text-white rounded-lg font-medium hover:brightness-110 transition-all shadow-lg shadow-[#4ea8de]/20"
              >
                Info
              </button>
            </div>

            {/* Custom Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface p-6 rounded-xl border border-border">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-3 uppercase mb-2">Title</label>
                  <input 
                    type="text" 
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full bg-bg border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-3 uppercase mb-2">Message</label>
                  <textarea 
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={2}
                    className="w-full bg-bg border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none resize-none"
                  />
                </div>
                <button 
                  onClick={() => fire("success")}
                  className="btn-primary w-full py-3"
                >
                  Fire!
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-3 uppercase mb-2">Position</label>
                  <select 
                    value={position}
                    onChange={(e) => setPosition(e.target.value as NotifyPosition)}
                    className="w-full bg-bg border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
                  >
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-center">Bottom Center</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-3 uppercase mb-2 flex justify-between">
                    Duration <span>{duration}ms</span>
                  </label>
                  <input 
                    type="range" 
                    min="1000" 
                    max="10000" 
                    step="500"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div className="pt-4 text-center border-t border-border/50">
                  <span className="text-text-3 text-xs">Notifications shown: </span>
                  <span className="text-white font-bold">{count}</span>
                </div>
              </div>
            </div>
          </div>
        </DemoArea>
      </section>

      {/* SECTION 3 — API REFERENCE */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">API Reference</h2>
        <ApiTable 
          rows={[
            { name: "notify.success()", type: "(title, message, options?)", description: "Trigger a success notification." },
            { name: "notify.error()", type: "(title, message, options?)", description: "Trigger an error notification." },
            { name: "notify.warning()", type: "(title, message, options?)", description: "Trigger a warning notification." },
            { name: "notify.info()", type: "(title, message, options?)", description: "Trigger an info notification." },
            { name: "position", type: "string", default: "'top-right'", description: "Position on screen: top-right, top-left, bottom-right, etc." },
            { name: "duration", type: "number", default: "3000", description: "Auto-close delay in milliseconds." },
            { name: "showProgress", type: "boolean", default: "true", description: "Show the timer progress bar." },
          ]}
        />
      </section>

      {/* SECTION 4 — CODE EXAMPLES */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Code Examples</h2>
        <TabbedCode 
          tabs={[
            {
              label: "Basic Usage",
              language: "tsx",
              code: `import { notify } from "@alisdev/fe-kit-notify";\n\nconst handleClick = () => {\n  notify.success("Saved!", "Your changes have been saved.");\n};`
            },
            {
              label: "Advanced",
              language: "tsx",
              code: `notify.info("Processing...", "This might take a while.", {\n  position: "bottom-center",\n  duration: 5000,\n  showProgress: true,\n  onClose: () => console.log("Closed!")\n});`
            },
            {
              label: "With TypeScript",
              language: "tsx",
              code: `import { notify, NotifyOptions } from "@alisdev/fe-kit-notify";\n\nconst options: NotifyOptions = {\n  position: "top-left",\n  duration: 1000\n};\n\nnotify.warning("Warning", "Check your input", options);`
            }
          ]}
        />
      </section>

      {/* SECTION 5 — NOTES & TIPS */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Notes & Tips</h2>
        <Callout type="tip" title="Provider Required">
          Make sure to include <code>&lt;NotifyContainer /&gt;</code> at the root of your application to render the notifications.
        </Callout>
        <Callout type="info">
          The <code>notify</code> API is imperative, meaning you can call it from anywhere—even outside of React components or hooks.
        </Callout>
      </section>
    </div>
  );
};
