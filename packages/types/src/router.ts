import type { RouteRecordRaw, RouteMeta, RouteComponent } from 'vue-router'

type Lazy<T> = () => Promise<T>

export type RouteRecordItem = {
  path: string
  name: string
  meta: RouteMeta
  children?: RouteRecordItem[]
  component?: RouteComponent | Lazy<RouteComponent> | string
} & RouteRecordRaw
