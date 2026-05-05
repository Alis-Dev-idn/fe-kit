import { InputSize, InputTheme, InputVariant } from "../types";

export interface InputKitConfig {
  /** Default theme: "light" */
  theme?: InputTheme;
  /** Default size: "md" */
  size?: InputSize;
  /** Default variant: "outline" */
  variant?: InputVariant;
}

class InputKit {
  private static config: InputKitConfig = {
    theme: "light",
    size: "md",
    variant: "outline",
  };

  /**
   * Initialize InputKit with global configuration
   */
  static setup(config: InputKitConfig): void {
    this.config = { ...this.config, ...config };
    this.applyTheme(this.config.theme || "light");
  }

  /**
   * Get current configuration
   */
  static getConfig(): InputKitConfig {
    return this.config;
  }

  /**
   * Manually apply theme to document
   */
  static applyTheme(theme: InputTheme): void {
    const root = document.documentElement;
    if (theme === "auto") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-input-theme", isDark ? "dark" : "light");
    } else {
      root.setAttribute("data-input-theme", theme);
    }
  }
}

export { InputKit };
