import { ThemeType } from "../types";

export interface DashboardKitConfig {
  theme?: ThemeType;
}

export class DashboardKit {
  private static config: Required<DashboardKitConfig> = {
    theme: "light",
  };

  static setup(config: DashboardKitConfig): void {
    this.config = { ...this.config, ...config };
  }

  static getConfig(): Required<DashboardKitConfig> {
    return this.config;
  }
}
