import { Middleware } from "../types";

export const logger = (): Middleware => (store) => (next) => (action, nextState) => {
  const prevState = store.getState();
  console.group(`[store] action: ${action}`);
  console.log("%cprev", "color: #9E9E9E; font-weight: bold", prevState);
  console.log("%cnext", "color: #4CAF50; font-weight: bold", nextState);
  console.groupEnd();
  return next(action, nextState);
};
