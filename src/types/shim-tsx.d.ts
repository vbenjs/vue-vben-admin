// 文件: `shim-tsx.d.ts`
import Vue, { VNode } from 'vue';
import type { ComponentRenderProxy } from '@vue/composition-api';

declare module '*.tsx' {
  import { defineComponent } from 'vue';
  const component: ReturnType<defineComponent>;
  // import { ComponentOptions } from 'vue';
  // const component: ReturnType<ComponentOptions>;
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
