import { RouteKitConfig } from "../types";

export class RouteKit {
  private static config: Required<RouteKitConfig> = {
    authCheck: undefined as any,
    authStore: undefined as any,
    authSelector: undefined as any,
    getRoles: undefined as any,
    roleStore: undefined as any,
    roleSelector: undefined as any,
    loginPath: "/login",
    unauthorizedPath: "/403",
    notFoundPath: "/404",
    suspenseFallback: null,
  };

  static setup(config: RouteKitConfig): void {
    this.config = { ...this.config, ...config };
  }

  static getConfig(): Required<RouteKitConfig> {
    return this.config;
  }
}
