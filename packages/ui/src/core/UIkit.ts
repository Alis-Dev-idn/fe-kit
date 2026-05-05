export type UITheme = "light" | "dark" | "auto";

export interface UIkitConfig {
  theme?: UITheme;
  radius?: string;
}

class UIkit {
  private static config: UIkitConfig = {
    theme: "light",
  };

  static setup(config: UIkitConfig): void {
    this.config = { ...this.config, ...config };
    this.applyTheme(this.config.theme || "light");
    
    if (this.config.radius) {
      document.documentElement.style.setProperty("--ui-radius", this.config.radius);
    }
  }

  static getConfig(): UIkitConfig {
    return this.config;
  }

  static applyTheme(theme: UITheme): void {
    const root = document.documentElement;
    if (theme === "auto") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-ui-theme", isDark ? "dark" : "light");
    } else {
      root.setAttribute("data-ui-theme", theme);
    }
  }
}

export { UIkit };
