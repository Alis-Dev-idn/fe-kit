import React from "react";
import { createStore } from "@alisdev/fe-kit-store";
import { KitBadge } from "../components/shared/KitBadge";
import { InstallBlock } from "../components/shared/InstallBlock";
import { DemoArea } from "../components/shared/DemoArea";
import { ApiTable } from "../components/shared/ApiTable";
import { TabbedCode } from "../components/shared/TabbedCode";
import { Callout } from "../components/shared/Callout";
import { Button, Card, CardHeader, CardContent } from "@alisdev/fe-kit-ui";

// Correct Store Implementation
const useCounter = createStore({
  state: {
    count: 0,
    history: [] as number[],
  },
  actions: {
    increment: (state) => ({ 
      count: state.count + 1,
      history: [...state.history, state.count + 1].slice(-5)
    }),
    decrement: (state) => ({ 
      count: state.count - 1,
      history: [...state.history, state.count - 1].slice(-5)
    }),
    reset: () => ({ count: 0, history: [] })
  }
});

export const StorePage: React.FC = () => {
  const { count, history, increment, decrement, reset, loading } = useCounter();

  return (
    <div className="pb-20">
      <section className="mb-16">
        <KitBadge category="Data & State" />
        <h1 className="text-4xl font-bold mb-4">Store Kit</h1>
        <p className="text-text-2 text-lg leading-relaxed mb-6 max-w-3xl">
          Lightweight, high-performance state management based on <code>useSyncExternalStore</code>. 
          Supports global singletons and scoped context stores.
        </p>
        <InstallBlock packageName="@alisdev/fe-kit-store" />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Live Demo</h2>
        <DemoArea>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader title="Counter Store" subtitle="Reactive State Demo" />
              <CardContent className="text-center space-y-6">
                <div className="text-6xl font-bold text-primary font-mono py-4">{count}</div>
                <div className="flex gap-2 justify-center">
                  <Button variant="ghost" onClick={() => decrement()}>-</Button>
                  <Button onClick={() => increment()}>+</Button>
                  <Button variant="outline" onClick={() => reset()}>Reset</Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="bg-code-bg border border-border rounded-lg p-4 h-full">
                <span className="text-[10px] font-bold text-text-3 uppercase block mb-3">Activity Log</span>
                <div className="space-y-2">
                  {history.map((val: number, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      <span className="text-text-2">Value changed to</span>
                      <span className="font-mono font-bold text-white">{val}</span>
                    </div>
                  ))}
                  {history.length === 0 && <p className="text-text-3 italic text-sm">No activity yet...</p>}
                </div>
              </div>
            </div>
          </div>
        </DemoArea>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">API Reference</h2>
        <ApiTable 
          rows={[
            { name: "createStore({ state, actions })", type: "Function", description: "Creates a singleton store hook." },
            { name: "state", type: "Object", description: "The initial data structure." },
            { name: "actions", type: "Object", description: "Method map: (state, ...args) => Partial<State>." },
            { name: "loading", type: "boolean", description: "True if an async action is in progress." },
            { name: "error", type: "Error | null", description: "The last error thrown by an action." },
            { name: "reset(keys?)", type: "Function", description: "Resets state to initial values." },
          ]}
        />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Code Examples</h2>
        <TabbedCode 
          tabs={[
            {
              label: "Defining Store",
              language: "tsx",
              code: `const useStore = createStore({\n  state: { user: null },\n  actions: {\n    login: (state, name) => ({ user: name }),\n    logout: () => ({ user: null })\n  }\n});`
            },
            {
              label: "Async Actions",
              language: "tsx",
              code: `actions: {\n  fetchData: async (state) => {\n    const data = await api.get('/data');\n    return { data };\n  }\n}`
            }
          ]}
        />
      </section>
    </div>
  );
};
