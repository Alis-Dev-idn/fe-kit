import { ConfirmOptions, DialogInstance } from "../types";
import { confirmStore } from "../core/ConfirmStore";

/**
 * Show a confirmation dialog.
 * Resolves to true if confirmed, false if cancelled.
 */
export function confirm(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const id = options.id || Math.random().toString(36).substring(2, 9);
    
    const instance: DialogInstance = {
      id,
      type: "confirm",
      options,
      resolve,
      isOpen: true,
      createdAt: Date.now(),
    };

    confirmStore.addDialog(instance);
  });
}
