import type { RouteMeta } from 'vue-router';

export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

export type FunctionType = 'MENU' | 'CATALOG';

/**
 * @description: Get menu return value
 */
export interface getMenuListResultModel {
  component: string;
  componentName: string;
  cached?: boolean;
  functionName: string;
  functionType: FunctionType;
  internalOrExternal: boolean;
  locales: Recordable<string>;
  url: string;
  icon?: string;
  functionId: number;
  parentId: number;
  isMenu?: boolean;
  redirect?: string;
}
