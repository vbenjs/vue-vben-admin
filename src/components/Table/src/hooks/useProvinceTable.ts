import type { Ref } from 'vue';
import { provide, inject } from 'vue';
import { TableActionType } from '../types/table';

const key = Symbol('table');

type Instance = TableActionType & { wrapRef: Ref<Nullable<HTMLElement>> };

export function provideTable(instance: Instance) {
  provide(key, instance);
}

export function injectTable(): Instance {
  return inject(key) as Instance;
}
