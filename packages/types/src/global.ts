import type { VNodeChild, PropType as VuePropType, Plugin } from 'vue'
import type { RouteRecordItem as IRouteRecordItem } from './router'

declare global {
  type AnyFunction<T> = (...args: any[]) => T

  type LabelValueOptions = {
    label: string
    value: any
    [key: string]: string | number | boolean
  }[]

  type EmitType = (event: string, ...args: any[]) => void

  interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
    $el: T
  }

  type ComponentRef<T extends HTMLElement = HTMLDivElement> =
    ComponentElRef<T> | null

  type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

  type CustomizedHTMLElement<T> = HTMLElement & T

  type PartialReturnType<T extends (...args: unknown[]) => unknown> = Partial<
    ReturnType<T>
  >

  const __APP_INFO__: {
    pkg: {
      name: string
      version: string
      dependencies: Recordable<string>
      devDependencies: Recordable<string>
    }
    lastBuildTime: string
  }
  const __VITE_USE_MOCK__: boolean

  // vue
  type PropType<T> = VuePropType<T>
  type VueNode = VNodeChild | JSX.Element

  type RouteRecordItem = IRouteRecordItem

  type Nullable<T> = T | null
  type Recordable<T = any> = Record<string, T>

  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
  }

  type TimeoutHandle = ReturnType<typeof setTimeout>
  type IntervalHandle = ReturnType<typeof setInterval>

  type SFCWithInstall<T> = T & Plugin

  interface ChangeEvent extends Event {
    target: HTMLInputElement
  }

  interface ImportMetaEnv extends ViteEnv {
    __: never
  }

  interface ViteEnv {
    VITE_USE_MOCK: boolean
    VITE_USE_PWA: boolean
    VITE_PUBLIC_PATH: string
    VITE_PROXY: [string, string][]
    VITE_GLOB_APP_TITLE: string
    VITE_GLOB_APP_SHORT_NAME: string
    VITE_USE_CDN: boolean
    VITE_DROP_CONSOLE: boolean
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
    VITE_LEGACY: boolean
    VITE_USE_IMAGEMIN: boolean
    VITE_GENERATE_UI: string
  }
}
