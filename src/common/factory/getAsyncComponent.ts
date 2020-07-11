/**
 * 获取动态组件
 */
import Vue, { VueConstructor } from 'vue';

export function getAsyncComponent(importComp: () => Promise<typeof import('*.vue')>) {
  return (importComp as unknown) as VueConstructor<Vue>;
}
