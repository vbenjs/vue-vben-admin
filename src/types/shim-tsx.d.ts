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
      $props: any;
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }
}
