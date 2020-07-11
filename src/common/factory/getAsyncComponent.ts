/**
 * 获取动态组件
 */
import { VueConstructor, Vue } from 'compatible-vue';

export function getAsyncComponent(importComp: any) {
  return (importComp as unknown) as VueConstructor<Vue>;
}
