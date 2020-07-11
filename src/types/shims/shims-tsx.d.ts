// @ts-ignore
import { VNode } from 'vue';
import { ComponentRenderProxy } from '@/setup/vue';
declare module '*.tsx' {
  import Vue from 'vue';
  export default Vue;
}
declare global {
  // window对象
  namespace JSX {
    // @ts-ignore
    interface Element extends VNode {}
    // @ts-ignore
    interface ElementClass extends ComponentRenderProxy {}
    interface ElementAttributesProperty {
      $props?: any; // 定义要使用的属性名称
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
declare module '@/setup/vue/dist/component/component' {
  interface SetupContext {
    readonly refs: { [key: string]: Vue | Element | Vue[] | Element[] };
  }
}
