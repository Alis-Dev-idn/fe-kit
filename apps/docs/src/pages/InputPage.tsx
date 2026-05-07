import React from "react";
import {
  TextInput,
  TextArea,
  Checkbox,
  Switch,
  Slider,
  TextEditor
} from "@alisdev/fe-kit-input";
import { PropsTable, PropRow } from "../components/shared/PropsTable";
import { KitBadge } from "../components/shared/KitBadge";
import { InstallBlock } from "../components/shared/InstallBlock";
import { DemoArea } from "../components/shared/DemoArea";
import { Callout } from "../components/shared/Callout";

const TEXT_INPUT_PROPS: PropRow[] = [
  { name: "label", type: "string", description: "The label for the input field." },
  { name: "value", type: "string | number", description: "The current value of the input." },
  { name: "onChange", type: "(val: any) => void", description: "Callback when the value changes." },
  { name: "placeholder", type: "string", description: "Placeholder text when empty." },
  { name: "type", type: "string", default: "text", description: "HTML input type (text, password, number, etc.)" },
  { name: "error", type: "string", description: "Error message to display." },
  { name: "helperText", type: "string", description: "Optional hint text below the input." },
  { name: "required", type: "boolean", default: "false", description: "Adds a required asterisk to the label." },
  { name: "disabled", type: "boolean", default: "false", description: "Disables the input interaction." },
  { name: "prefix", type: "ReactNode", description: "Icon or element to show before the input." },
  { name: "suffix", type: "ReactNode", description: "Icon or element to show after the input." },
  { name: "loading", type: "boolean", default: "false", description: "Shows a loading spinner inside the input." },
];

const EDITOR_PROPS: PropRow[] = [
  { name: "value", type: "string", description: "HTML content for the editor." },
  { name: "onChange", type: "(html: string) => void", description: "Callback when content changes." },
  { name: "placeholder", type: "string", description: "Placeholder text when editor is empty." },
  { name: "disabled", type: "boolean", default: "false", description: "Makes the editor read-only." },
];

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
        <h2 className="text-2xl font-bold mb-6">Standard Inputs</h2>
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
                label="Password Input"
                type="password"
                placeholder="Secure entry..."
                value=""
                onChange={() => { }}
              />
              <TextArea
                label="Text Area"
                placeholder="Auto-resizing content..."
                autoResize
                minRows={3}
                value=""
                onChange={() => { }}
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
                onChange={(val: any) => setRange(val as number)}
                showValue
              />

              <TextInput
                label="Input with Suffix"
                placeholder="0.00"
                type="number"
                suffixText="USD"
                value=""
                onChange={() => { }}
              />
            </div>
          </div>
        </DemoArea>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Rich Text Editor</h2>
        <Callout type="info">
          Powered by Tiptap. Includes support for bold, italic, underline, links, images, and tables.
        </Callout>
        <DemoArea>
          <div className="bg-surface border border-border rounded-lg overflow-hidden min-h-[300px]">
            <TextEditor
              value={html as string}
              onChange={(val) => setHtml(val as string)}
              placeholder="Type rich content here..."
            />
          </div>
        </DemoArea>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">TextInput API</h2>
        <PropsTable props={TEXT_INPUT_PROPS} />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">TextEditor API</h2>
        <PropsTable props={EDITOR_PROPS} />
      </section>
    </div>
  );
};
