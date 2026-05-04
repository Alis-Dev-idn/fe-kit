import React, { createContext, useContext, useMemo, ReactNode } from "react";
import { createStore } from "./createStore";
import { Actions, StoreFullState, Middleware } from "./types";

export function createContextStore<S extends object, A extends Actions<S>>(config: {
  state: S;
  actions: A;
  middleware?: Middleware[];
}) {
  const Context = createContext<ReturnType<typeof createStore<S, A>> | null>(null);

  const Provider: React.FC<{ children: ReactNode; initialValues?: Partial<S> }> = ({
    children,
    initialValues,
  }) => {
    const store = useMemo(() => {
      const mergedState = initialValues ? { ...config.state, ...initialValues } : config.state;
      return createStore({ ...config, state: mergedState });
    }, []);

    return <Context.Provider value={store}>{children}</Context.Provider>;
  };

  function useStore(): StoreFullState<S, A>;
  function useStore<R>(selector: (state: any) => R): R;
  function useStore(selector?: any): any {
    const store = useContext(Context);
    if (!store) {
      throw new Error("useStore must be used within a StoreProvider");
    }
    return store(selector);
  }

  return {
    Provider,
    useStore,
  };
}
