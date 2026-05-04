import { ReactNode } from "react";

export type SidebarState = "full" | "collapsed" | "hidden";
export type ThemeType = "light" | "dark" | "auto";

export interface SidebarItemConfig {
  label: string;
  icon?: ReactNode;
  path?: string;
  onClick?: () => void;
  roles?: string[];
  badge?: string | number;
  children?: SidebarItemConfig[];
}

export interface ProfileMenuItemConfig {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  divider?: boolean;
}

export interface NotificationConfig {
  id: string;
  title: string;
  description?: string;
  time: string;
  read: boolean;
  onClick?: () => void;
}

export interface UserConfig {
  name: string;
  avatar?: string;
  role?: string;
}
