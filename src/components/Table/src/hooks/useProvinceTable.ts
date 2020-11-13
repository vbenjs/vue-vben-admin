import type { Ref } from 'vue';
import type { TableActionType } from '../types/table';

import { provide, inject } from 'vue';

const key = Symbol('table');

type Instance = TableActionType & { wrapRef: Ref<Nullable<HTMLElement>> };

export function provideTable(instance: Instance) {
  provide(key, instance);
}

export function injectTable(): Instance {
  return inject(key) as Instance;
}
