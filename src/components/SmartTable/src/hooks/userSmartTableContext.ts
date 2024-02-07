import type { SmartTableProps, TableActionType } from '../types/SmartTableType';
import type { ComputedRef, Ref } from 'vue';
import { inject, provide } from 'vue';

const key = Symbol('smart-table');

type Instance = TableActionType & {
  wrapRef: Ref<Nullable<HTMLElement>>;
  getBindValues: ComputedRef<Recordable>;
};

type RetInstance = Omit<Instance, 'getBindValues'> & {
  getBindValues: ComputedRef<SmartTableProps>;
};

export function createTableContext(instance: Instance) {
  provide(key, instance);
}

export function useTableContext(): RetInstance {
  return inject(key) as RetInstance;
}
