import { AlertOptions, DialogInstance } from "../types";
import { confirmStore } from "../core/ConfirmStore";

/**
 * Show an alert dialog.
 * Resolves when the user clicks OK.
 */
export function alert(options: AlertOptions): Promise<void> {
  return new Promise((resolve) => {
    const id = options.id || Math.random().toString(36).substring(2, 9);
    
    const instance: DialogInstance = {
      id,
      type: "alert",
      options,
      resolve,
      isOpen: true,
      createdAt: Date.now(),
    };

    confirmStore.addDialog(instance);
  });
}
