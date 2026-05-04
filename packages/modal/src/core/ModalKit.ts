import { AnimationConfig, CloseButtonStyle } from "../types";

export interface ModalKitConfig {
  animation?: AnimationConfig;
  closeButtonStyle?: CloseButtonStyle;
  backdrop?: {
    enabled?: boolean;
    baseOpacity?: number;
    opacityIncrement?: number;
  };
}

const DEFAULT_CONFIG: Required<ModalKitConfig> = {
  animation: { in: "fade", out: "fade", duration: 200 },
  closeButtonStyle: "windows",
  backdrop: {
    enabled: true,
    baseOpacity: 0.5,
    opacityIncrement: 0.1,
  },
};

export class ModalKit {
  private static config: Required<ModalKitConfig> = { ...DEFAULT_CONFIG };

  static setup(config: ModalKitConfig): void {
    this.config = {
      ...this.config,
      ...config,
      animation: { ...this.config.animation, ...config.animation },
      backdrop: { ...this.config.backdrop, ...config.backdrop },
    };
  }

  static getConfig(): Required<ModalKitConfig> {
    return this.config;
  }
}
