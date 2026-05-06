import React from "react";
import { useApi, AxiosKit } from "@alisdev/fe-kit-axios";
import { KitBadge } from "../components/shared/KitBadge";
import { InstallBlock } from "../components/shared/InstallBlock";
import { DemoArea } from "../components/shared/DemoArea";
import { ApiTable } from "../components/shared/ApiTable";
import { TabbedCode } from "../components/shared/TabbedCode";
import { Callout } from "../components/shared/Callout";
import { Button, Card, CardHeader, CardContent } from "@alisdev/fe-kit-ui";
import axios from "axios";

// Register instance for demo
try {
  AxiosKit.register("demo", {
    baseURL: "https://jsonplaceholder.typicode.com",
    timeout: 5000
  });
} catch (e) {
  // Ignore if already registered
}

export const AxiosPage: React.FC = () => {
  const api = AxiosKit.use("demo");

  // useApi uses a function that returns a promise
  const { data, loading, error, execute } = useApi<any[]>(
    (signal) => api.get("/posts", { params: { _limit: 3 }, signal }),
    { immediate: false }
  );

  return (
    <div className="pb-20">
      <section className="mb-16">
        <KitBadge category="Data & State" />
        <h1 className="text-4xl font-bold mb-4">Axios Kit</h1>
        <p className="text-text-2 text-lg leading-relaxed mb-6 max-w-3xl">
          A robust HTTP client wrapper with unified instance management, 
          built-in interceptors, and a declarative <code>useApi</code> hook.
        </p>
        <InstallBlock packageName="@alisdev/fe-kit-axios" />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Live Demo</h2>
        <DemoArea>
          <div className="space-y-6">
            <div className="flex justify-center">
              <Button 
                onClick={() => execute()} 
                loading={loading}
                leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>}
              >
                Fetch Mock Posts
              </Button>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/20 p-4 rounded-lg flex items-center gap-3 text-danger">
                <span className="text-sm font-medium">Error: {error.message}</span>
              </div>
            )}

            {data && (
              <div className="grid grid-cols-1 gap-4">
                {data.map((post: any) => (
                  <Card key={post.id}>
                    <CardHeader title={post.title} />
                    <CardContent className="text-sm text-text-2">
                      {post.body}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!data && !loading && !error && (
              <div className="text-center py-10 border border-dashed border-border rounded-lg text-text-3 italic text-sm">
                Click the button to test instance retrieval and request execution.
              </div>
            )}
          </div>
        </DemoArea>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">API Reference</h2>
        <ApiTable 
          rows={[
            { name: "AxiosKit.register(name, config)", type: "Function", description: "Registers a named Axios instance." },
            { name: "AxiosKit.use(name)", type: "Function", description: "Retrieves a previously registered instance." },
            { name: "useApi(fn, options)", type: "Hook", description: "Manages loading, error, and data for any async function." },
            { name: "execute()", type: "Function", description: "Manually triggers the request function." },
            { name: "TokenStorage", type: "Class", description: "Helper to manage JWT in cookies or local storage." },
          ]}
        />
      </section>
    </div>
  );
};
