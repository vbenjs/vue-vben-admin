declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const Component: DefineComponent<{}, {}, any>
  export default Component
}

declare module 'virtual:*' {
  const result: any
  export default result
}

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare type AnyFunction<T> = (...args: any[]) => T

declare type LabelValueOptions = {
  label: string
  value: any
  [key: string]: string | number | boolean
}[]

declare type EmitType = (event: string, ...args: any[]) => void

declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T
}

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> =
  ComponentElRef<T> | null

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

declare type CustomizedHTMLElement<T> = HTMLElement & T

declare type PartialReturnType<T extends (...args: unknown[]) => unknown> =
  Partial<ReturnType<T>>

declare type SFCWithInstall<T> = T & Plugin
