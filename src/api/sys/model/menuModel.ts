// export interface RouteItem {
//   path: string;
//   component: any;
//   meta: RouteMeta;
//   name?: string;
//   alias?: string | string[];
//   redirect?: string;
//   caseSensitive?: boolean;
//   children?: RouteItem[];
// }
export interface RouteItem {
  cdid: string;
  qqdz: string;
  cdmc: string;
  children: RouteItem[];
}
/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[];
