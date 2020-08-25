declare module '*.vue' {
  import Vue from 'compatible-vue';
  export default Vue;
}
declare module '*.md' {
  import Vue from 'compatible-vue';
  export default Vue;
}

// declare module 'compatible-vue/dist/component/component' {
//   export interface SetupContext {
//     readonly refs: { [key: string]: Vue | Element | Vue[] | Element[] };
//   }
// }

declare type ImportComponentPromise = Promise<typeof import('*.vue')>;
// declare module 'vue/types/options' {
//   interface ComponentOptions<V extends Vue> {
//     [propName: string]: any;

//     ref?: string;
//   }
// }

// declare module '*.vue' {
//   import { Component, ComponentPublicInstance } from 'vue';
//   const _default: Component & {
//     // eslint-disable-next-line
//     new (): ComponentPublicInstance<any>;
//   };
//   export default _default;
// }

declare type Nullable<T> = T | null;

declare type CustomizedHTMLElement<T> = HTMLElement & T;

declare type Indexable<T> = {
  [key: string]: T;
};

declare type KeyString<T = any> = {
  [key: string]: T;
};
