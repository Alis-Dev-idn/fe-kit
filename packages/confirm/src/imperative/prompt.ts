import { PromptOptions, DialogInstance } from "../types";
import { confirmStore } from "../core/ConfirmStore";

/**
 * Show a prompt dialog.
 * Resolves to the input string if submitted, or null if cancelled.
 */
export function prompt(options: PromptOptions): Promise<string | null> {
  return new Promise((resolve) => {
    const id = options.id || Math.random().toString(36).substring(2, 9);
    
    const instance: DialogInstance = {
      id,
      type: "prompt",
      options,
      resolve,
      isOpen: true,
      createdAt: Date.now(),
    };

    confirmStore.addDialog(instance);
  });
}
