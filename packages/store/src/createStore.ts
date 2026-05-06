import { useSyncExternalStore, useCallback, useMemo } from "react";
import { Actions, StoreFullState, Listener, Middleware } from "./types";

export function createStore<S extends object, A extends Actions<S>>(config: {
  state: S;
  actions: A;
  middleware?: Middleware[];
}) {
  const initialState = { ...config.state };
  let currentState = { ...initialState };
  let actionStates: any = Object.keys(config.actions).reduce((acc, key) => {
    acc[key] = { loading: false, error: null };
    return acc;
  }, {} as any);

  let globalLoading = false;
  let globalError: Error | null = null;

  const listeners = new Set<() => void>();

  const getState = () => currentState;

  const emit = () => {
    cachedFullState = null;
    listeners.forEach((l) => l());
  };

  const setState = (nextState: Partial<S> | ((state: S) => Partial<S>)) => {
    const partial = typeof nextState === "function" ? nextState(currentState) : nextState;
    currentState = { ...currentState, ...partial };
    emit();
  };

  const updateActionState = (name: string, updates: Partial<{ loading: boolean; error: Error | null }>) => {
    actionStates = {
      ...actionStates,
      [name]: { ...actionStates[name], ...updates },
    };
    
    // Update global loading/error
    globalLoading = Object.values(actionStates).some((s: any) => s.loading);
    if (updates.error) globalError = updates.error;
    else if (!globalLoading) {
       // Optional: reset global error if everything finished? 
       // Usually we keep the last error.
    }
    
    emit();
  };

  const reset = (field?: keyof S | Array<keyof S>) => {
    if (!field) {
      currentState = { ...initialState };
    } else if (Array.isArray(field)) {
      field.forEach((f) => {
        if (f in initialState) (currentState as any)[f] = (initialState as any)[f];
      });
    } else {
      if (field in initialState) (currentState as any)[field] = (initialState as any)[field];
    }
    emit();
  };

  const boundActions: any = {};
  Object.keys(config.actions).forEach((key) => {
    boundActions[key] = async (...args: any[]) => {
      updateActionState(key, { loading: true, error: null });
      try {
        const result = await config.actions[key](currentState, ...args);
        
        // Middleware pipeline could go here
        if (config.middleware) {
           // Basic middleware implementation
        }

        setState(result);
        updateActionState(key, { loading: false });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        updateActionState(key, { loading: false, error });
        throw error;
      }
    };
  });

  let cachedFullState: any = null;

  const getFullState = () => {
    if (!cachedFullState) {
      cachedFullState = {
        ...currentState,
        ...boundActions,
        actions: actionStates,
        loading: globalLoading,
        error: globalError,
        reset,
      };
    }
    return cachedFullState;
  };

  function useStore(): StoreFullState<S, A>;
  function useStore<R>(selector: (state: S & { actions: any, loading: boolean, error: Error | null }) => R): R;
  function useStore<R>(selector?: (state: any) => R): any {
    const getSnapshot = useCallback(() => {
      return getFullState();
    }, []);

    const slice = useSyncExternalStore(
      (onStoreChange) => {
        listeners.add(onStoreChange);
        return () => listeners.delete(onStoreChange);
      },
      getSnapshot
    );

    return selector ? selector(slice) : slice;
  }

  useStore.getState = getState;
  useStore.subscribe = <R>(selector: (state: S) => R, listener: (value: R) => void) => {
    let prevValue = selector(currentState);
    const unsubscribe = () => listeners.delete(handleChange);
    const handleChange = () => {
      const nextValue = selector(currentState);
      if (!Object.is(prevValue, nextValue)) {
        prevValue = nextValue;
        listener(nextValue);
      }
    };
    listeners.add(handleChange);
    return unsubscribe;
  };

  return useStore;
}
