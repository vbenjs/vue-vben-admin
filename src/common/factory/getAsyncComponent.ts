/**
 * 获取动态组件
 */
import { VueConstructor, Vue, FunctionalComponentOptions } from 'compatible-vue';

export function getAsyncComponent(importComp: any) {
  return (importComp as unknown) as VueConstructor<Vue>;
}

export function transformComponents(
  functionalComponent: FunctionalComponentOptions<Record<string, any>, any>
) {
  return (functionalComponent as unknown) as VueConstructor<Vue>;
}
