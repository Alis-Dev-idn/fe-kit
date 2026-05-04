import { ReactNode, ComponentType } from "react";

export type AuthCheckFn = () => boolean | Promise<boolean>;
export type GetRolesFn = () => string[] | Promise<string[]>;

export interface RouteKitConfig {
  authCheck?: AuthCheckFn;
  authStore?: () => any;
  authSelector?: (state: any) => boolean;
  getRoles?: GetRolesFn;
  roleStore?: () => any;
  roleSelector?: (state: any) => string[];
  loginPath?: string;
  unauthorizedPath?: string;
  notFoundPath?: string;
  suspenseFallback?: ReactNode;
}

export interface RouteConfig {
  path: string;
  component: ComponentType<any> | (() => Promise<{ default: ComponentType<any> }>);
  lazy?: boolean;
  auth?: boolean;
  roles?: string[];
  breadcrumb?: string | ((params: Record<string, string>) => string | Promise<string>);
  children?: RouteConfig[];
  index?: boolean;
  layout?: ComponentType<any>;
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive: boolean;
}
