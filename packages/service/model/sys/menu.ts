export interface RouteItem {
  path: string
  component: any
  meta: any
  name?: string
  alias?: string | string[]
  redirect?: string
  caseSensitive?: boolean
  children?: RouteItem[]
}

/**
 * @description: Get menu return value
 */
export type GetMenuListResultModel = RouteItem[]
