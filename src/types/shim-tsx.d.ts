import type { ComponentRenderProxy, VNode } from 'vue';

declare module '*.tsx' {
  import { defineComponent } from 'vue';
  const component: ReturnType<defineComponent>;
  export default component;
}

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode;
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy;
    interface ElementAttributesProperty {
      $props: any; // 定义要使用的属性名称
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
    interface IntrinsicAttributes {
      // ['v-if']?: unknown;
      // ['v-else-if']?: unknown;
      // ['v-else']?: unknown;
      // need
      // ['v-show']?: unknown;
      [elem: string]: any;
      // ['v-html']?: unknown;
      // ['v-text']?: unknown;
      // ['v-model']?: unknown;
    }
  }
}
