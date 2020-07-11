/**
 * 切换vue2 和vue3的支持，vue2支持主要是ie11 IE10， ie9样式可能会不兼容，但是能运行
 */

// vue2.0
import Vue, { VueConstructor, VNode, Component } from 'vue';
import VueCompositionAPI from '@vue/composition-api';
export default VueCompositionAPI;

export * from '@vue/composition-api';
export { Vue, VueConstructor, VNode, Component };
// export {
//   Component,
//   AsyncComponent,
//   ComponentOptions,
//   FunctionalComponentOptions,
//   RenderContext,
//   ComputedOptions,
//   WatchHandler,
//   WatchOptionsWithHandler,
//   DirectiveFunction,
//   DirectiveOptions,
//   VNodeChildren,
//   VNodeChildrenArrayContents,
//   VNode,
//   VNodeComponentOptions,
//   VNodeData,
//   VNodeDirective,
//   PluginFunction,
//   PluginObject,
//   CreateElement,
//   VueConstructor,
// } from 'vue';

// vue3.0 需要安装3.0的vue依赖
// export * from 'vue';
