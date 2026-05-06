import React from "react";
import { useForm } from "@alisdev/fe-kit-form";
import { z } from "zod";
import { KitBadge } from "../components/shared/KitBadge";
import { InstallBlock } from "../components/shared/InstallBlock";
import { DemoArea } from "../components/shared/DemoArea";
import { ApiTable } from "../components/shared/ApiTable";
import { TabbedCode } from "../components/shared/TabbedCode";
import { Callout } from "../components/shared/Callout";

const schema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 chars"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "Must be at least 18").max(99, "Must be under 100"),
  role: z.enum(["Admin", "User", "Guest"]),
  bio: z.string().min(20, "Bio must be at least 20 chars"),
  agree: z.boolean().refine(val => val === true, "You must agree to terms")
});

type FormData = z.infer<typeof schema>;

export const FormPage: React.FC = () => {
  const [submitted, setSubmitted] = React.useState(false);

  const { 
    values, 
    errors, 
    handleChange, 
    handleBlur, 
    handleSubmit, 
    isSubmitting, 
    reset 
  } = useForm(schema, {
    initialValues: {
      fullName: "",
      email: "",
      age: 18,
      role: "User",
      bio: "",
      agree: false
    },
    onSubmit: async (data) => {
      await new Promise(r => setTimeout(r, 1500));
      setSubmitted(true);
      console.log("Form Submitted:", data);
      setTimeout(() => setSubmitted(false), 3000);
    },
    validateOn: "blur"
  });

  return (
    <div className="pb-20">
      <section className="mb-16">
        <KitBadge category="Data & State" />
        <h1 className="text-4xl font-bold mb-4">Form Kit</h1>
        <p className="text-text-2 text-lg leading-relaxed mb-6 max-w-3xl">
          Powerful form management with first-class Zod support. 
          Handles validation, nested fields, and dynamic arrays with ease.
        </p>
        <InstallBlock packageName="@alisdev/fe-kit-form" />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Live Demo</h2>
        <DemoArea>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-3 uppercase">Full Name</label>
                  <input 
                    value={values.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    className={`w-full bg-bg border ${errors.fullName ? 'border-danger' : 'border-border'} rounded px-3 py-2 text-sm outline-none focus:border-primary transition-colors`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-danger text-[10px] mt-1">{errors.fullName}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-3 uppercase">Email</label>
                  <input 
                    value={values.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={`w-full bg-bg border ${errors.email ? 'border-danger' : 'border-border'} rounded px-3 py-2 text-sm outline-none focus:border-primary transition-colors`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-danger text-[10px] mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-3 uppercase">Age</label>
                  <input 
                    type="number"
                    value={values.age}
                    onChange={(e) => handleChange("age", Number(e.target.value))}
                    onBlur={() => handleBlur("age")}
                    className={`w-full bg-bg border ${errors.age ? 'border-danger' : 'border-border'} rounded px-3 py-2 text-sm outline-none focus:border-primary transition-colors`}
                  />
                  {errors.age && <p className="text-danger text-[10px] mt-1">{errors.age}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-3 uppercase">Role</label>
                  <select 
                    value={values.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="w-full bg-bg border border-border rounded px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                    <option value="Guest">Guest</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-3 uppercase">Bio</label>
                <textarea 
                  value={values.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  onBlur={() => handleBlur("bio")}
                  rows={3}
                  className={`w-full bg-bg border ${errors.bio ? 'border-danger' : 'border-border'} rounded px-3 py-2 text-sm outline-none focus:border-primary resize-none transition-colors`}
                  placeholder="Tell us about yourself (min 20 chars)..."
                />
                {errors.bio && <p className="text-danger text-[10px] mt-1">{errors.bio}</p>}
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={values.agree}
                  onChange={(e) => handleChange("agree", e.target.checked)}
                  id="agree" 
                  className="accent-primary" 
                />
                <label htmlFor="agree" className="text-xs text-text-2">I agree to the terms and conditions</label>
              </div>
              {errors.agree && <p className="text-danger text-[10px]">{errors.agree}</p>}

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : "Submit Form"}
                </button>
                <button 
                  type="button" 
                  onClick={() => reset()}
                  className="btn-ghost"
                >
                  Reset
                </button>
              </div>

              {submitted && (
                <div className="bg-success/10 border border-success/20 text-success p-3 rounded text-sm text-center animate-in fade-in zoom-in-95">
                  Form submitted successfully!
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="flex flex-col h-full">
              <span className="text-xs font-bold text-text-3 uppercase mb-2 px-1">Live JSON Preview</span>
              <div className="flex-1 bg-code-bg border border-border rounded-lg p-4 overflow-auto scrollbar-thin">
                <pre className="text-[11px] font-mono text-[#4ea8de]">
                  {JSON.stringify(values, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </DemoArea>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">API Reference</h2>
        <ApiTable 
          rows={[
            { name: "useForm(schema, options)", type: "Hook", description: "Main hook. Takes a Zod schema and configuration options." },
            { name: "handleChange", type: "Function", description: "Updates a field value. (field, value) => void" },
            { name: "handleBlur", type: "Function", description: "Triggers validation for a field on blur." },
            { name: "handleSubmit", type: "Function", description: "Executes validation and onSubmit callback." },
            { name: "isSubmitting", type: "boolean", description: "True when the onSubmit promise is pending." },
            { name: "errors", type: "Object", description: "Contains validation error messages keyed by field name." },
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
              code: `import { useForm } from "@alisdev/fe-kit-form";\nimport { z } from "zod";\n\nconst schema = z.object({ name: z.string() });\n\nconst { handleChange, handleSubmit } = useForm(schema, {\n  onSubmit: (data) => console.log(data)\n});`
            },
            {
              label: "Field Helper",
              language: "tsx",
              code: `const { field } = useForm(schema, ...);\n\n// Returns { name, value, onChange, onBlur, error }\n<input {...field("email")} />`
            },
            {
              label: "Validation Options",
              language: "tsx",
              code: `useForm(schema, {\n  validateOn: "change", // or "blur" or "submit"\n  initialValues: { ... }\n});`
            }
          ]}
        />
      </section>
    </div>
  );
};
