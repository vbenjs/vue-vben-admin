import { VueConstructor } from 'compatible-vue';

export function getAsyncComponent(importComp: () => Promise<typeof import('*.vue')>) {
  return (importComp as unknown) as VueConstructor<Vue>;
}
