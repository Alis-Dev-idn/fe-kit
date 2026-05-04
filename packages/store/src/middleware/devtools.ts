import { Middleware } from "../types";

export const devtools = (name?: string): Middleware => (store) => {
  const extension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
  if (!extension) return (next) => (action, nextState) => next(action, nextState);

  const dt = extension.connect({ name: name || "StoreKit" });
  dt.init(store.getState());

  return (next) => (action, nextState) => {
    dt.send(action, nextState);
    return next(action, nextState);
  };
};
