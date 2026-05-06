import React from "react";
import { alert, confirm, prompt } from "@alisdev/fe-kit-confirm";
import { KitBadge } from "../components/shared/KitBadge";
import { InstallBlock } from "../components/shared/InstallBlock";
import { DemoArea } from "../components/shared/DemoArea";
import { ApiTable } from "../components/shared/ApiTable";
import { TabbedCode } from "../components/shared/TabbedCode";
import { Callout } from "../components/shared/Callout";

export const ConfirmPage: React.FC = () => {
  const [result, setResult] = React.useState<string | null>(null);

  const handleAlert = async () => {
    await alert({ title: "Hello!", message: "This is a simple alert message." });
    setResult("Alert closed");
  };

  const handleConfirm = async () => {
    const ok = await confirm({ title: "Are you sure?", message: "This action cannot be undone." });
    setResult(ok ? "You clicked: OK" : "You clicked: Cancel");
  };

  const handlePrompt = async () => {
    const val = await prompt({ 
      title: "Newsletter", 
      message: "Enter your email to subscribe:",
      placeholder: "your@email.com"
    });
    setResult(val ? `You entered: ${val}` : "(cancelled)");
  };

  const handleDanger = async () => {
    const ok = await confirm({ 
      title: "Delete User?", 
      message: "All data associated with this user will be permanently removed.",
      confirmLabel: "Delete",
      cancelLabel: "Keep User",
    });
    setResult(ok ? "User Deleted" : "Action Aborted");
  };

  return (
    <div className="pb-20">
      <section className="mb-16">
        <KitBadge category="UI & Overlay" />
        <h1 className="text-4xl font-bold mb-4">Confirm Kit</h1>
        <p className="text-text-2 text-lg leading-relaxed mb-6 max-w-3xl">
          Promise-based imperative dialogs. Show alerts, confirmations, and prompts from anywhere 
          without managing local state for every modal.
        </p>
        <InstallBlock packageName="@alisdev/fe-kit-confirm" />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Live Demo</h2>
        <DemoArea>
          <div className="space-y-8 flex flex-col items-center">
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={handleAlert} className="btn-ghost">Show Alert</button>
              <button onClick={handleConfirm} className="btn-primary">Show Confirm</button>
              <button onClick={handlePrompt} className="btn-ghost">Show Prompt</button>
              <button onClick={handleDanger} className="px-4 py-2 bg-danger/10 text-danger border border-danger/20 hover:bg-danger hover:text-white rounded transition-all font-medium">
                Danger Confirm
              </button>
            </div>

            {result && (
              <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-surface border border-border px-4 py-3 rounded-lg text-center">
                  <span className="text-xs text-text-3 uppercase font-bold tracking-widest block mb-1">Result</span>
                  <span className="text-white font-mono">{result}</span>
                </div>
              </div>
            )}
          </div>
        </DemoArea>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">API Reference</h2>
        <ApiTable 
          rows={[
            { name: "alert(options)", type: "Function", description: "Shows a simple dialog with an OK button. Returns Promise<void>." },
            { name: "confirm(options)", type: "Function", description: "Shows a dialog with OK/Cancel buttons. Returns Promise<boolean>." },
            { name: "prompt(options)", type: "Function", description: "Shows a dialog with an input field. Returns Promise<string | null>." },
            { name: "title", type: "string", description: "Header text of the dialog." },
            { name: "message", type: "string", description: "Body text of the dialog." },
            { name: "confirmLabel", type: "string", default: "'Confirm'", description: "Label for the primary button." },
            { name: "cancelLabel", type: "string", default: "'Cancel'", description: "Label for the secondary button." },
          ]}
        />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Code Examples</h2>
        <TabbedCode 
          tabs={[
            {
              label: "Basic Usage",
              language: "tsx",
              code: `import { confirm } from "@alisdev/fe-kit-confirm";\n\nconst handleDelete = async () => {\n  const ok = await confirm({\n    title: "Delete?",\n    message: "Are you really sure?"\n  });\n  if (ok) {\n    // do delete\n  }\n};`
            },
            {
              label: "Advanced Prompt",
              language: "tsx",
              code: `const email = await prompt({\n  title: "Subscribe",\n  message: "Enter email:",\n  confirmLabel: "Subscribe",\n  cancelLabel: "No thanks",\n  placeholder: "hello@world.com"\n});\n\nif (email) {\n  console.log("Subscribing:", email);\n}`
            }
          ]}
        />
      </section>
    </div>
  );
};
