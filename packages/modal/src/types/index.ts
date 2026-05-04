import { ReactNode } from "react";

export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "full" | { width: string; height?: string };
export type ModalPosition = "center" | "top" | "bottom" | "left" | "right";
export type CloseButtonStyle = "macos" | "windows" | "button";
export type ScrollBehavior = "body" | "outside";
export type AnimationType = "fade" | "slide" | "zoom" | "bounce";

export interface AnimationConfig {
  in?: AnimationType;
  out?: AnimationType;
  duration?: number;
}

export interface DownloadProgress {
  percent: number;
  loaded: number;
  total: number;
  speed: number;
  estimatedTime: number;
}
