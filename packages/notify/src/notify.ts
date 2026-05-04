import { ReactNode } from "react";
import { NotifyOptions, NotifyType, NotifyItem } from "./types";
import { notifyStore } from "./core/NotifyStore";
import { NotifyKit } from "./core/NotifyKit";

function createNotify(type: NotifyType, message: string | ReactNode, options?: NotifyOptions): string {
  const config = NotifyKit.getConfig();
  const id = Math.random().toString(36).substring(2, 9);
  
  const item: NotifyItem = {
    id,
    type,
    message,
    options: {
      duration: options?.duration ?? config.duration,
      dismissible: options?.dismissible ?? config.dismissible,
      action: options?.action as any,
      position: options?.position ?? config.position,
      animation: { ...config.animation, ...options?.animation },
    },
    createdAt: Date.now(),
    paused: false,
    remaining: options?.duration ?? config.duration,
  };

  notifyStore.addNotification(item, config.maxVisible);
  return id;
}

export const notify = {
  success: (message: string, options?: NotifyOptions) => createNotify("success", message, options),
  error: (message: string, options?: NotifyOptions) => createNotify("error", message, options),
  warning: (message: string, options?: NotifyOptions) => createNotify("warning", message, options),
  info: (message: string, options?: NotifyOptions) => createNotify("info", message, options),
  custom: (component: ReactNode, options?: NotifyOptions) => createNotify("custom", component, options),
  
  promise: async <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
    options?: NotifyOptions
  ): Promise<T> => {
    const id = createNotify("info", messages.loading, { ...options, duration: 0 });
    
    try {
      const result = await promise;
      const successMsg = typeof messages.success === "function" ? messages.success(result) : messages.success;
      notifyStore.removeNotification(id);
      createNotify("success", successMsg, options);
      return result;
    } catch (error) {
      const errorMsg = typeof messages.error === "function" ? messages.error(error) : messages.error;
      notifyStore.removeNotification(id);
      createNotify("error", errorMsg, options);
      throw error;
    }
  },

  dismiss: (id: string) => notifyStore.removeNotification(id),
  dismissAll: () => notifyStore.dismissAll(),
};
