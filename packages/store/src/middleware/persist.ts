import { Middleware, PersistOptions } from "../types";

export const persist = (options: PersistOptions): Middleware => {
  const { key, storage: storageType } = options;

  const getStorage = () => {
    if (typeof window === "undefined") return null;
    if (storageType === "localStorage") return window.localStorage;
    if (storageType === "sessionStorage") return window.sessionStorage;
    return null; // Cookies logic can be added here if needed
  };

  return (store) => {
    const storage = getStorage();
    if (storage) {
      const saved = storage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Hydrate state
          // Note: This needs to happen during store creation for best result.
          // In this simple middleware, we do it immediately if possible.
          // But createStore needs to support initial hydrate.
        } catch (e) {}
      }
    }

    return (next) => (action, nextState) => {
      if (storage) {
        storage.setItem(key, JSON.stringify(nextState));
      }
      return next(action, nextState);
    };
  };
};
