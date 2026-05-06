import React from "react";
import { 
  TextInput, 
  TextArea, 
  Checkbox, 
  Switch, 
  Slider,
  TextEditor
} from "@alisdev/fe-kit-input";
import { KitBadge } from "../components/shared/KitBadge";
import { InstallBlock } from "../components/shared/InstallBlock";
import { DemoArea } from "../components/shared/DemoArea";
import { ApiTable } from "../components/shared/ApiTable";
import { TabbedCode } from "../components/shared/TabbedCode";
import { Callout } from "../components/shared/Callout";

export const InputPage: React.FC = () => {
  const [text, setText] = React.useState<string | number>("");
  const [checked, setChecked] = React.useState(false);
  const [toggle, setToggle] = React.useState(true);
  const [range, setRange] = React.useState(50);
  const [html, setHtml] = React.useState("<p>Hello <strong>World</strong>!</p>");

  return (
    <div className="pb-20">
      <section className="mb-16">
        <KitBadge category="Display" />
        <h1 className="text-4xl font-bold mb-4">Input Kit</h1>
        <p className="text-text-2 text-lg leading-relaxed mb-6 max-w-3xl">
          Highly customizable form controls with built-in validation, 
          theming, and rich text support.
        </p>
        <InstallBlock packageName="@alisdev/fe-kit-input" />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Live Demo</h2>
        <DemoArea>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <TextInput 
                label="Text Input"
                placeholder="Enter something..."
                value={text}
                onChange={setText}
                helperText="Values are passed directly to onChange."
              />
              <TextInput 
                label="Error State"
                error="Validation message"
                value="Invalid value"
                onChange={setText}
              />
              <TextArea 
                label="Text Area"
                placeholder="Auto-resizing content..."
                autoResize
                minRows={3}
                value=""
                onChange={() => {}}
              />
            </div>

            <div className="space-y-8">
              <div className="flex gap-10">
                <Checkbox 
                  label="Checkbox"
                  checked={checked}
                  onChange={setChecked}
                />
                <Switch 
                  label="Switch Toggle"
                  checked={toggle}
                  onChange={setToggle}
                />
              </div>

              <Slider 
                label="Slider Range"
                min={0}
                max={100}
                value={range}
                onChange={(val) => setRange(val as number)}
                showValue
              />

              {/* 
              <div className="pt-4 border-t border-border">
                <label className="text-xs font-bold text-text-3 uppercase block mb-3">Rich Text Editor</label>
                <div className="bg-surface border border-border rounded-lg overflow-hidden min-h-[150px]">
                  <TextEditor 
                    value={html}
                    onChange={setHtml}
                    placeholder="Type rich content here..."
                  />
                </div>
              </div>
              */}
              <div className="pt-4 border-t border-border text-center">
                <p className="text-text-3 italic text-sm">Rich Text Editor is temporarily disabled for maintenance.</p>
              </div>
            </div>
          </div>
        </DemoArea>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">API Reference</h2>
        <ApiTable 
          rows={[
            { name: "TextInput", type: "Component", description: "Supports type: text, password, number, email, etc." },
            { name: "TextArea", type: "Component", description: "Supports autoResize and row constraints." },
            { name: "Checkbox", type: "Component", description: "Custom styled check with direct boolean onChange." },
            { name: "Switch", type: "Component", description: "Toggle switch with labelPosition support." },
            { name: "Slider", type: "Component", description: "Supports range (dual thumb) and value formatting." },
            { name: "TextEditor", type: "Component", description: "Full Tiptap implementation with toolbar config." },
          ]}
        />
      </section>
    </div>
  );
};
